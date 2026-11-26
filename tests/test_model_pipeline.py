import json
import unittest
from pathlib import Path

from api.model_pipeline import (
    EXTRACT,
    SYNTHESIZE,
    KnowledgePipeline,
    ModelAdapter,
    ModelResponse,
    ModelSettings,
    ModelUnavailable,
    PrivateThought,
    PublicEntity,
    PublicSource,
)


class ModelPipelineTest(unittest.TestCase):
    def setUp(self):
        path = Path(__file__).parent / "fixtures" / "model_pipeline.json"
        fixture = json.loads(path.read_text(encoding="utf-8"))
        self.source = PublicSource(**fixture["source"])
        self.context = tuple(PublicEntity(**entry) for entry in fixture["public_context"])
        self.responses = fixture["responses"]
        self.calls = []

    def pipeline(self, **overrides):
        settings = ModelSettings.from_environment({
            "ENCY4AI_PROVIDER": "first",
            "ENCY4AI_MODEL": "default",
            **overrides,
        })

        def adapter(provider, accepts_private=False):
            def call(stage, model, request):
                self.calls.append((provider, stage, model, request))
                response = self.responses[stage]
                if isinstance(response, Exception):
                    raise response
                return ModelResponse(model + "-resolved", json.dumps(response))
            return ModelAdapter(call, accepts_private)

        return KnowledgePipeline(settings, {
            "first": adapter("first"),
            "second": adapter("second"),
            "local": adapter("local", accepts_private=True),
        })

    def propose(self, pipeline, **options):
        return pipeline.propose(source=self.source, public_context=self.context, **options)

    def test_shared_default_and_independent_overrides(self):
        for overrides, expected in [
            ({}, [("first", EXTRACT, "default"), ("first", SYNTHESIZE, "default")]),
            ({"ENCY4AI_EXTRACTION_PROVIDER": "second", "ENCY4AI_EXTRACTION_MODEL": "extract"},
             [("second", EXTRACT, "extract"), ("first", SYNTHESIZE, "default")]),
            ({"ENCY4AI_SYNTHESIS_PROVIDER": "second", "ENCY4AI_SYNTHESIS_MODEL": "synthesize"},
             [("first", EXTRACT, "default"), ("second", SYNTHESIZE, "synthesize")]),
        ]:
            with self.subTest(overrides=overrides):
                self.calls.clear()
                result = self.propose(self.pipeline(**overrides))
                self.assertEqual(result["status"], "proposed")
                self.assertEqual([call[:3] for call in self.calls], expected)
                models = result["proposal"]["models"]
                for provider, stage, model in expected:
                    self.assertEqual(models[stage], {"provider": provider, "model": model + "-resolved"})

    def test_related_source_has_resolvable_evidence_and_private_review_status(self):
        proposal = self.propose(self.pipeline())["proposal"]
        self.assertEqual(proposal["source_url"], self.source.url)
        self.assertEqual(proposal["visibility"], "private")
        self.assertEqual(proposal["review_status"], "needs_review")
        claim = proposal["extraction"]["claims"][0]
        self.assertEqual(claim["kind"], "author_claim")
        anchor = claim["evidence"]
        paragraph = self.source.paragraphs[anchor["paragraph"] - 1]
        self.assertEqual(paragraph[anchor["start"]:anchor["end"]], anchor["quote"])
        relation = proposal["digest"]["relations"][0]
        self.assertEqual(relation["status"], "candidate")
        self.assertEqual(relation["claim_ids"], [claim["id"]])
        self.assertTrue(relation["rationale"])
        self.assertEqual(proposal["digest"]["next_step"]["status"], "suggested")

    def test_inaccessible_source_and_no_evidence(self):
        pipeline = self.pipeline()
        result = pipeline.propose(source=PublicSource(self.source.url, None))
        self.assertEqual(result, {"status": "source_unavailable", "stage": EXTRACT})
        self.assertEqual(self.calls, [])
        self.responses[EXTRACT]["claims"] = []
        self.assertEqual(self.propose(pipeline)["status"], "no_source_evidence")
        self.assertEqual([call[1] for call in self.calls], [EXTRACT])

    def test_invalid_extraction_cannot_reach_synthesis(self):
        self.responses[EXTRACT]["claims"][0]["quote"] = "invented quotation"
        self.assertEqual(self.propose(self.pipeline()),
                         {"status": "invalid_model_output", "stage": EXTRACT})
        self.assertEqual([call[1] for call in self.calls], [EXTRACT])

    def test_synthesis_rejects_unknown_evidence_or_invalid_shape(self):
        self.responses[SYNTHESIZE]["relations"][0]["claim_ids"] = ["claim-999"]
        self.assertEqual(self.propose(self.pipeline()),
                         {"status": "invalid_model_output", "stage": SYNTHESIZE})
        self.responses[SYNTHESIZE] = []
        self.assertEqual(self.propose(self.pipeline()),
                         {"status": "invalid_model_output", "stage": SYNTHESIZE})

    def test_runtime_failure_is_reported_without_exception_contents(self):
        self.responses[SYNTHESIZE] = ModelUnavailable("sensitive runtime detail")
        self.assertEqual(self.propose(self.pipeline()),
                         {"status": "model_unavailable", "stage": SYNTHESIZE})

    def test_private_note_stays_out_of_external_requests_and_proposal(self):
        note = "private fixture note"
        result = self.propose(self.pipeline(ENCY4AI_SYNTHESIS_PROVIDER="second"), note=note)
        self.assertEqual(result["proposal"]["note_status"], "deferred_private_input")
        self.assertNotIn(note, json.dumps(self.calls))
        self.assertNotIn(note, json.dumps(result))
        self.assertNotIn(self.source.url, json.dumps(self.calls))

    def test_private_note_reaches_only_trusted_synthesis(self):
        note = "private fixture note"
        result = self.propose(self.pipeline(ENCY4AI_SYNTHESIS_PROVIDER="local"), note=note)
        self.assertEqual(result["proposal"]["note_status"], "used_locally")
        self.assertNotIn(note, json.dumps(self.calls[0]))
        self.assertEqual(self.calls[1][3]["private_note"], note)

    def test_standalone_thought_is_deferred_or_processed_locally(self):
        thought = PrivateThought("索引能减少查找时间吗？", "question")
        result = self.pipeline().propose(thought=thought)
        self.assertEqual(result, {"status": "deferred_private_input", "stage": SYNTHESIZE})
        self.assertEqual(self.calls, [])

        self.responses[SYNTHESIZE].update(
            summary="Question about lookup time.",
            significance="Identifies a possible experiment.",
            claim_ids=[], relations=[], next_step=None,
        )
        pipeline = self.pipeline(ENCY4AI_SYNTHESIS_PROVIDER="local")
        proposal = pipeline.propose(thought=thought, public_context=self.context)["proposal"]
        self.assertEqual([call[1] for call in self.calls], [SYNTHESIZE])
        self.assertEqual(proposal["thought"], {"kind": "question", "original_text": thought.text})
        self.assertIsNone(proposal["extraction"])
        self.assertIsNone(proposal["digest"]["next_step"])
        self.assertEqual(proposal["digest"]["relations"], [])
