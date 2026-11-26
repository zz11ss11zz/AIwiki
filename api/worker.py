"""Opt-in background worker for locally recorded source and model fixtures."""

import argparse
import json
import os
import time
import uuid
from collections.abc import Callable
from dataclasses import dataclass
from pathlib import Path

from api.model_pipeline import (
    KnowledgePipeline, ModelAdapter, ModelResponse, ModelSettings, PrivateThought,
    PublicEntity, PublicSource,
)
from api.server import connect, init_db, utcnow

MAX_ATTEMPTS = 3
LEASE_SECONDS = 30
RETRY_SECONDS = 1


@dataclass(frozen=True)
class Lease:
    job_id: str
    payload: str
    token: str
    attempts: int


class InboxWorker:
    def __init__(self, db_path, process: Callable[[dict], dict], *, clock=time.time):
        self.db_path = db_path
        self.process = process
        self.clock = clock
        init_db(db_path)

    def claim(self):
        with connect(self.db_path) as db:
            db.execute("BEGIN IMMEDIATE")
            now = self.clock()
            row = db.execute("""
                SELECT jobs.job_id, jobs.payload, COALESCE(job_processing.attempts, 0) AS attempts
                FROM jobs LEFT JOIN job_processing USING (job_id)
                WHERE jobs.status IN ('queued', 'extracting')
                    AND (job_processing.eligible_at IS NULL OR job_processing.eligible_at <= ?)
                ORDER BY jobs.created_at, jobs.job_id LIMIT 1
            """, (now,)).fetchone()
            if row is None:
                return None
            token = uuid.uuid4().hex
            attempts = row["attempts"] + 1
            db.execute("""
                INSERT INTO job_processing (job_id, attempts, lease_token, eligible_at)
                VALUES (?, ?, ?, ?)
                ON CONFLICT (job_id) DO UPDATE SET attempts=excluded.attempts,
                    lease_token=excluded.lease_token, eligible_at=excluded.eligible_at
            """, (row["job_id"], attempts, token, now + LEASE_SECONDS))
            db.execute("UPDATE jobs SET status='extracting', updated_at=? WHERE job_id=?",
                       (utcnow(), row["job_id"]))
            return Lease(row["job_id"], row["payload"], token, attempts)

    def finish(self, lease, result):
        status = {
            "proposed": "proposed",
            "deferred_private_input": "deferred",
        }.get(result["status"], "failed")
        if result["status"] == "model_unavailable" and lease.attempts < MAX_ATTEMPTS:
            status = "queued"
        retry = status == "queued"
        stored_result = None if retry else json.dumps(result, ensure_ascii=False)
        with connect(self.db_path) as db:
            db.execute("BEGIN IMMEDIATE")
            now = self.clock()
            updated = db.execute("""
                UPDATE job_processing SET lease_token=NULL, eligible_at=?, result=?
                WHERE job_id=? AND lease_token=? AND eligible_at > ?
            """, (now + RETRY_SECONDS if retry else now, stored_result,
                  lease.job_id, lease.token, now)).rowcount
            if updated:
                db.execute("UPDATE jobs SET status=?, updated_at=? WHERE job_id=?",
                           (status, utcnow(), lease.job_id))
            return bool(updated)

    def run_once(self):
        lease = self.claim()
        if lease is None:
            return False
        if lease.attempts > MAX_ATTEMPTS:
            result = {"status": "worker_attempts_exhausted"}
        else:
            result = self.process(json.loads(lease.payload))
        self.finish(lease, result)
        return True


def fixture_processor(path: Path, env):
    fixture = json.loads(path.read_text(encoding="utf-8"))
    source = PublicSource(fixture["source"]["url"], tuple(fixture["source"]["paragraphs"]))
    context = tuple(PublicEntity(**item) for item in fixture["public_context"])
    settings = ModelSettings.from_environment({
        "ENCY4AI_PROVIDER": "fixture",
        "ENCY4AI_MODEL": "shared-v1",
        **env,
    })

    def recorded_response(stage, model, request):
        return ModelResponse(model, json.dumps(fixture["responses"][stage]))

    pipeline = KnowledgePipeline(settings, {
        "fixture": ModelAdapter(recorded_response),
        "fixture-second": ModelAdapter(recorded_response),
    })

    def process(payload):
        if "url" not in payload:
            return pipeline.propose(thought=PrivateThought(payload["text"], "reflection"))
        document = source if payload["url"] == source.url else PublicSource(payload["url"], None)
        return pipeline.propose(source=document, note=payload.get("note"), public_context=context)

    return process


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--fixture", type=Path, required=True, help="Operator-provided local fixture file")
    parser.add_argument("--once", action="store_true", help="Process at most one eligible job and exit")
    args = parser.parse_args()
    os.umask(0o077)
    worker = InboxWorker(os.environ.get("ENCY4AI_DB", ".local/inbox.sqlite3"),
                         fixture_processor(args.fixture, os.environ))
    try:
        if args.once:
            worker.run_once()
        else:
            while True:
                if not worker.run_once():
                    time.sleep(0.5)
    except KeyboardInterrupt:
        pass


if __name__ == "__main__":
    main()
