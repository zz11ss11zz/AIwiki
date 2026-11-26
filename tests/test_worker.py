import json
import tempfile
import unittest
from pathlib import Path

from api.server import connect, utcnow
from api.worker import InboxWorker, LEASE_SECONDS, MAX_ATTEMPTS, RETRY_SECONDS, fixture_processor


class InboxWorkerTest(unittest.TestCase):
    def setUp(self):
        directory = tempfile.TemporaryDirectory()
        self.addCleanup(directory.cleanup)
        self.db = Path(directory.name) / 'inbox.sqlite3'
        self.now = 100.0
        self.calls = []
        self.worker = self.make_worker(self.unavailable)

    def make_worker(self, process):
        return InboxWorker(self.db, process, clock=lambda: self.now)

    def unavailable(self, payload):
        self.calls.append(payload)
        return {'status': 'model_unavailable'}

    def enqueue(self, payload):
        # A row written by the pre-worker inbox schema has no job_processing entry.
        with connect(self.db) as db:
            db.execute('INSERT INTO jobs VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
                       ('job', 'queued', 'private', utcnow(), utcnow(), json.dumps(payload), 'fp', None))

    def state(self):
        with connect(self.db) as db:
            row = db.execute('SELECT status, result FROM jobs LEFT JOIN job_processing USING (job_id)').fetchone()
        return row['status'], json.loads(row['result']) if row['result'] else None

    def test_expired_lease_can_be_reclaimed_and_stale_result_is_rejected(self):
        self.enqueue({'url': 'https://example.org/indexing-v2'})
        other = self.make_worker(self.unavailable)
        first = self.worker.claim()
        self.assertIsNone(other.claim())
        self.now += LEASE_SECONDS
        self.assertFalse(self.worker.finish(first, {'status': 'proposed'}))
        second = other.claim()
        self.assertEqual(second.attempts, 2)
        self.assertNotEqual(second.token, first.token)
        self.assertFalse(self.worker.finish(first, {'status': 'proposed'}))
        self.assertTrue(other.finish(second, {'status': 'proposed'}))
        self.assertEqual(self.state(), ('proposed', {'status': 'proposed'}))
        self.assertFalse(other.run_once())

    def test_temporary_model_errors_retry_only_up_to_attempt_limit(self):
        self.enqueue({'text': 'synthetic input'})
        for attempt in range(MAX_ATTEMPTS):
            self.assertTrue(self.worker.run_once())
            self.assertFalse(self.worker.run_once())
            self.assertEqual(len(self.calls), attempt + 1)
            self.now += RETRY_SECONDS
        self.assertEqual(self.state(), ('failed', {'status': 'model_unavailable'}))
        self.assertFalse(self.worker.run_once())

    def test_repeated_crashes_fail_without_an_extra_model_call(self):
        self.enqueue({'url': 'https://example.org/indexing-v2'})
        for attempt in range(1, MAX_ATTEMPTS + 1):
            self.assertEqual(self.worker.claim().attempts, attempt)
            self.now += LEASE_SECONDS
        self.assertTrue(self.worker.run_once())
        self.assertEqual(self.calls, [])
        self.assertEqual(self.state(), ('failed', {'status': 'worker_attempts_exhausted'}))

    def test_fixture_rejects_unknown_urls_and_defers_private_thoughts(self):
        fixture = Path(__file__).parent / 'fixtures' / 'model_pipeline.json'
        process = fixture_processor(fixture, {})
        for payload, outcome in [
            ({'url': 'https://example.invalid/unknown'}, ('failed', 'source_unavailable')),
            ({'text': 'private fixture input'}, ('deferred', 'deferred_private_input')),
        ]:
            with self.subTest(payload=payload):
                self.enqueue(payload)
                self.assertTrue(self.make_worker(process).run_once())
                state, result = self.state()
                self.assertEqual((state, result['status']), outcome)
                self.assertNotIn('proposal', result)
                with connect(self.db) as db:
                    db.execute('DELETE FROM job_processing')
                    db.execute('DELETE FROM jobs')
