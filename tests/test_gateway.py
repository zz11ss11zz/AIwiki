import json
import tempfile
import threading
import unittest
import urllib.error
import urllib.request
from pathlib import Path
from api.server import Gateway

class GatewayTest(unittest.TestCase):
    def setUp(self):
        self.tmp = tempfile.TemporaryDirectory()
        self.db = str(Path(self.tmp.name) / 'queue.sqlite3')
        self.token = 'local-test-token-not-a-production-secret'
        self.start()
    def start(self):
        self.srv = Gateway(('127.0.0.1',0), self.db,self.token)
        self.base = f'http://127.0.0.1:{self.srv.server_port}'
        self.thread = threading.Thread(target=self.srv.serve_forever,daemon=True)
        self.thread.start()
    def stop(self):
        self.srv.shutdown()
        self.srv.server_close()
        self.thread.join()
    def tearDown(self):
        self.stop()
        self.tmp.cleanup()
    def request(self,path,data=None,auth=True,key=None):
        headers = {'Content-Type':'application/json'}
        if auth:
            headers['Authorization'] = 'Bearer '+self.token
        if key:
            headers['Idempotency-Key'] = key
        req = urllib.request.Request(self.base+path,headers=headers,data=None if data is None else json.dumps(data).encode())
        try:
            with urllib.request.urlopen(req,timeout=3) as r:
                return r.status,json.load(r)
        except urllib.error.HTTPError as e:
            return e.code,json.load(e)
    def test_health_and_contract(self):
        self.assertEqual(self.request('/healthz',auth=False)[0],200)
        code,spec = self.request('/openapi.json',auth=False)
        self.assertEqual(code,200)
        self.assertIn('/api/v1/inbox',spec['paths'])
        self.assertFalse(self.request('/api/v1/capabilities')[1]['publication_enabled'])
    def test_unauthorized(self):
        self.assertEqual(self.request('/api/v1/inbox',{'text':'test'},auth=False)[0],401)
        self.assertEqual(self.request('/api/v1/capabilities',auth=False)[0],401)
    def test_submission_status_and_privacy(self):
        status,job=self.request('/api/v1/inbox',{'url':'https://example.org/paper','note':'private'})
        self.assertEqual(status,202)
        self.assertEqual(job['status'],'queued')
        self.assertEqual(job['visibility'],'private')
        self.assertNotIn('payload',job)
        path='/api/v1/jobs/'+job['job_id']
        self.assertEqual(self.request(path,auth=False)[0],401)
        self.assertEqual(self.request(path),(200,job))
    def test_idempotency(self):
        payload={'text':'test source'}
        code,first=self.request('/api/v1/inbox',payload,key='test-001')
        self.assertEqual(code,202)
        self.assertEqual(self.request('/api/v1/inbox',payload,key='test-001'),(200,first))
        self.assertEqual(self.request('/api/v1/inbox',{'text':'different'},key='test-001')[0],409)
    def test_persistence_after_restart(self):
        _,job=self.request('/api/v1/inbox',{'text':'durable'},key='test-restart')
        self.stop()
        self.start()
        self.assertEqual(self.request('/api/v1/jobs/'+job['job_id']),(200,job))
    def test_invalid_input(self):
        for payload in ({},{'url':'file:///etc/passwd'},{'url':'https://u:p@example.org'},{'url':'https://example.org','text':'both'},{'text':'x','visibility':'public'},{'text':' '}):
            self.assertEqual(self.request('/api/v1/inbox',payload)[0],400)
    def test_oversize(self):
        self.assertEqual(self.request('/api/v1/inbox',{'text':'a'*(128*1024)})[0],413)
    def test_planned_not_active(self):
        self.assertEqual(self.request('/api/v1/proposals',{'text':'test'})[0],404)

if __name__=='__main__':
    unittest.main()
