"""Loopback-only gateway for private inbox jobs and worker results."""
import hashlib
import hmac
import json
import os
import re
import sqlite3
import uuid
from contextlib import contextmanager
from datetime import datetime, timezone
from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path
from urllib.parse import urlsplit

MAX_BODY = 128 * 1024
OPENAPI = Path(__file__).with_name('openapi.json')

def utcnow():
    return datetime.now(timezone.utc).isoformat()

@contextmanager
def connect(path):
    db = sqlite3.connect(path, timeout=5)
    db.row_factory = sqlite3.Row
    try:
        with db:
            yield db
    finally:
        db.close()

def init_db(path):
    Path(path).parent.mkdir(parents=True, exist_ok=True)
    with connect(path) as db:
        db.execute('''CREATE TABLE IF NOT EXISTS jobs (
            job_id TEXT PRIMARY KEY, status TEXT NOT NULL, visibility TEXT NOT NULL,
            created_at TEXT NOT NULL, updated_at TEXT NOT NULL,
            payload TEXT NOT NULL, fingerprint TEXT NOT NULL, idem_key TEXT UNIQUE)''')
        db.execute('''CREATE TABLE IF NOT EXISTS job_processing (
            job_id TEXT PRIMARY KEY REFERENCES jobs(job_id), attempts INTEGER NOT NULL,
            lease_token TEXT, eligible_at REAL NOT NULL, result TEXT)''')
        db.execute('CREATE INDEX IF NOT EXISTS jobs_queue ON jobs(status, created_at, job_id)')

def job_public(row):
    return {key: row[key] for key in ('job_id', 'status', 'visibility', 'created_at', 'updated_at')}

def validate(data):
    if not isinstance(data, dict) or set(data) - {'url','text','note'}:
        raise ValueError('Expected url or text and optional note')
    fields = [key for key in ('url', 'text') if key in data]
    if len(fields) != 1:
        raise ValueError('Provide exactly one of url or text')
    key = fields[0]
    if not isinstance(data[key], str) or not data[key].strip():
        raise ValueError('Source must be a nonempty string')
    if key == 'url':
        value = data[key]
        if len(value) > 8192 or any(c.isspace() or ord(c)<32 for c in value):
            raise ValueError('Invalid URL')
        parsed = urlsplit(value)
        if parsed.scheme not in ('http', 'https') or not parsed.hostname or parsed.username is not None or parsed.password is not None:
            raise ValueError('Expected absolute HTTP(S) URL without credentials')
        _ = parsed.port  # validates port; no network access
    if 'note' in data and (not isinstance(data['note'], str) or len(data['note']) > 8192):
        raise ValueError('Note must be a string up to 8192 characters')
    return json.dumps(data, ensure_ascii=False, sort_keys=True, separators=(',', ':'))

class Gateway(ThreadingHTTPServer):
    daemon_threads = True
    def __init__(self, address, db_path, token):
        if len(token) < 32:
            raise ValueError('Use an agent token of at least 32 characters')
        self.db_path = db_path
        self.token = token
        init_db(db_path)
        super().__init__(address, Handler)

class Handler(BaseHTTPRequestHandler):
    server_version = 'ENCY4AI-bootstrap/0.1'
    def setup(self):
        super().setup()
        self.connection.settimeout(10)
    def log_message(self, format, *args):
        # Avoid logging URLs, headers or payloads. Production needs redacted audit logs.
        pass
    def reply(self, code, value):
        body = json.dumps(value, ensure_ascii=False).encode('utf-8')
        self.send_response(code)
        self.send_header('Content-Type','application/json; charset=utf-8')
        self.send_header('Content-Length',str(len(body)))
        self.send_header('Cache-Control','no-store')
        self.send_header('X-Content-Type-Options','nosniff')
        self.end_headers()
        self.wfile.write(body)
    def auth(self):
        header = self.headers.get('Authorization','')
        if not hmac.compare_digest(header.encode('utf-8'), ('Bearer '+self.server.token).encode('utf-8')):
            self.reply(401, {'error':'unauthorized'})
            return False
        return True
    def do_GET(self):
        path = urlsplit(self.path).path
        if path == '/healthz':
            return self.reply(200, {'status':'ok','stage':'bootstrap'})
        if path == '/openapi.json':
            return self.reply(200, json.loads(OPENAPI.read_text(encoding='utf-8')))
        if not self.auth():
            return
        if path == '/api/v1/capabilities':
            return self.reply(200, {'version':'0.1.0','implemented':['inbox.submit','job.status','job.result'], 'planned':['source.extract','wiki.search','graph.query','proposal.review','mcp'], 'publication_enabled':False})
        match = re.fullmatch(r'/api/v1/jobs/([0-9a-f]{32})(/result)?', path)
        if match:
            with connect(self.server.db_path) as db:
                row = db.execute('''SELECT jobs.job_id, jobs.status, jobs.visibility,
                        jobs.created_at, jobs.updated_at, job_processing.result
                    FROM jobs LEFT JOIN job_processing USING (job_id) WHERE jobs.job_id=?''',
                    (match[1],)).fetchone()
            if row is None:
                return self.reply(404, {'error': 'not_found'})
            if not match[2]:
                return self.reply(200, job_public(row))
            if row['result'] is None:
                return self.reply(202, job_public(row))
            return self.reply(200, {**job_public(row), 'result': json.loads(row['result'])})
        return self.reply(404,{'error':'not_found'})
    def do_POST(self):
        if not self.auth():
            return
        if urlsplit(self.path).path != '/api/v1/inbox':
            return self.reply(404,{'error':'not_found'})
        if self.headers.get_content_type() != 'application/json':
            return self.reply(415,{'error':'application/json required'})
        try:
            size = int(self.headers.get('Content-Length','-1'))
        except ValueError:
            return self.reply(400,{'error':'invalid content length'})
        if size < 0:
            return self.reply(411,{'error':'content length required'})
        if size > MAX_BODY:
            return self.reply(413,{'error':'payload too large'})
        idem = self.headers.get('Idempotency-Key')
        if idem is not None and not re.fullmatch(r'[A-Za-z0-9._:-]{1,128}',idem):
            return self.reply(400,{'error':'invalid idempotency key'})
        try:
            payload = validate(json.loads(self.rfile.read(size).decode('utf-8')))
        except (ValueError, UnicodeError, RecursionError):
            return self.reply(400,{'error':'invalid source payload'})
        fp = hashlib.sha256(payload.encode('utf-8')).hexdigest()
        with connect(self.server.db_path) as db:
            db.execute('BEGIN IMMEDIATE')
            if idem:
                old = db.execute('SELECT * FROM jobs WHERE idem_key=?',(idem,)).fetchone()
                if old:
                    if old['fingerprint'] != fp:
                        return self.reply(409,{'error':'idempotency key conflicts with previous payload'})
                    return self.reply(200,job_public(old))
            job_id, now = uuid.uuid4().hex, utcnow()
            db.execute('INSERT INTO jobs VALUES (?,?,?,?,?,?,?,?)',(job_id,'queued','private',now,now,payload,fp,idem))
            row = db.execute('SELECT * FROM jobs WHERE job_id=?',(job_id,)).fetchone()
        return self.reply(202,job_public(row))

def main():
    os.umask(0o077)
    host = os.environ.get('ENCY4AI_HOST','127.0.0.1')
    if host != '127.0.0.1' and host != 'localhost':
        raise SystemExit('Bootstrap requires loopback binding; production ingress is not implemented.')
    port = int(os.environ.get('ENCY4AI_PORT','8787'))
    token = os.environ.get('ENCY4AI_AGENT_TOKEN','')
    if len(token) < 32:
        raise SystemExit('Set ENCY4AI_AGENT_TOKEN to a random secret of at least 32 characters.')
    gateway = Gateway((host,port),os.environ.get('ENCY4AI_DB','.local/inbox.sqlite3'),token)
    print(f'ENCY4AI local bootstrap on http://{host}:{gateway.server_port}', flush=True)
    try:
        gateway.serve_forever()
    except KeyboardInterrupt:
        pass
    finally:
        gateway.server_close()

if __name__ == '__main__':
    main()
