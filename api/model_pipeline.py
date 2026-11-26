"""Offline-testable model stages for private knowledge proposals."""

import json
from collections.abc import Callable, Mapping
from dataclasses import dataclass
from typing import Literal

EXTRACT = "source_extraction"
SYNTHESIZE = "knowledge_synthesis"
RELATIONS = {"applied_to", "built_on", "part_of", "alternative_to"}


@dataclass(frozen=True)
class ModelRoute:
    provider: str
    model: str


@dataclass(frozen=True)
class ModelSettings:
    extraction: ModelRoute
    synthesis: ModelRoute

    @classmethod
    def from_environment(cls, env: Mapping[str, str]):
        def route(prefix: str, fallback: ModelRoute | None = None) -> ModelRoute:
            def setting(name: str, default: str) -> str:
                key = f"ENCY4AI_{prefix}{name}"
                value = env.get(key, default).strip()
                if not value:
                    raise ValueError(f"Missing model configuration: {key}")
                return value

            return ModelRoute(
                setting("PROVIDER", fallback.provider if fallback else ""),
                setting("MODEL", fallback.model if fallback else ""),
            )

        default = route("")
        return cls(route("EXTRACTION_", default), route("SYNTHESIS_", default))


@dataclass(frozen=True)
class ModelResponse:
    model: str
    json_text: str


@dataclass(frozen=True)
class ModelAdapter:
    # The trusted server registry owns this setting. External adapters keep it false.
    generate: Callable[[str, str, dict], ModelResponse]
    accepts_private_input: bool = False


class ModelUnavailable(Exception):
    """Adapters raise this on runtime failures. Details stay out of job results."""


@dataclass(frozen=True)
class PublicSource:
    """A worker-authorized source. Paragraphs are the exact normalized snapshot."""

    url: str
    paragraphs: tuple[str, ...] | None


@dataclass(frozen=True)
class PublicEntity:
    entity_id: str
    description: str


@dataclass(frozen=True)
class PrivateThought:
    text: str
    kind: Literal["question", "reflection", "idea", "hypothesis"]


def _object(value, *fields):
    if not isinstance(value, dict) or value.keys() != set(fields):
        raise ValueError("Unexpected fields")
    return value


def _text(value):
    if not isinstance(value, str) or not value.strip() or len(value) > 4000:
        raise ValueError("Expected bounded nonempty text")
    return value


def _items(value):
    if not isinstance(value, list) or len(value) > 40:
        raise ValueError("Expected bounded array")
    return value


def _references(value, available):
    references = [_text(item) for item in _items(value)]
    if len(set(references)) != len(references) or set(references) - available:
        raise ValueError("Unexpected or repeated reference")
    return references


def _extracted(output, source):
    output = _object(output, "claims", "concepts", "versions", "gaps")
    extraction = {key: [_text(item) for item in _items(output[key])]
                  for key in ("concepts", "versions", "gaps")}
    extraction["claims"] = []
    for number, item in enumerate(_items(output["claims"]), 1):
        claim = _object(item, "statement", "paragraph", "quote")
        statement, quote = _text(claim["statement"]), _text(claim["quote"])
        paragraph = claim["paragraph"]
        if type(paragraph) is not int or not 1 <= paragraph <= len(source.paragraphs):
            raise ValueError("Unknown paragraph")
        text = source.paragraphs[paragraph - 1]
        start = text.find(quote)
        if start == -1 or text.find(quote, start + 1) != -1:
            raise ValueError("Quotation must resolve once in its paragraph")
        extraction["claims"].append({
            "id": f"claim-{number}", "statement": statement, "kind": "author_claim",
            "evidence": {"paragraph": paragraph, "quote": quote,
                         "start": start, "end": start + len(quote)},
        })
    return extraction


def _synthesized(output, claim_ids, entity_ids):
    output = _object(output, "summary", "significance", "claim_ids", "entity_ids",
                     "relations", "uncertainties", "next_step")
    references = _references(output["claim_ids"], claim_ids)
    if claim_ids and not references:
        raise ValueError("Source digest must cite at least one extracted claim")
    entities = _references(output["entity_ids"], entity_ids)
    relations = []
    for item in _items(output["relations"]):
        relation = _object(item, "subject_id", "predicate", "object_id", "claim_ids", "rationale")
        subject = _text(relation["subject_id"])
        target = _text(relation["object_id"])
        predicate = _text(relation["predicate"])
        evidence = _references(relation["claim_ids"], set(references))
        if (subject not in entities or target not in entities or subject == target
                or predicate not in RELATIONS or not evidence):
            raise ValueError("Relation requires distinct known entities and source evidence")
        relations.append(dict(relation, rationale=_text(relation["rationale"]), status="candidate"))

    action = output["next_step"]
    return {
        "summary": _text(output["summary"]),
        "significance": _text(output["significance"]),
        "claim_ids": references,
        "entity_ids": entities,
        "relations": relations,
        "uncertainties": [_text(item) for item in _items(output["uncertainties"])],
        "next_step": None if action is None else {"text": _text(action), "status": "suggested"},
    }


class KnowledgePipeline:
    def __init__(self, settings: ModelSettings, adapters: Mapping[str, ModelAdapter]):
        self.settings = settings
        self.adapters = dict(adapters)

    def _run(self, stage, route, data, validate):
        adapter = self.adapters.get(route.provider)
        if adapter is None:
            return {"status": "model_unavailable", "stage": stage}
        try:
            response = adapter.generate(stage, route.model, data)
        except ModelUnavailable:
            return {"status": "model_unavailable", "stage": stage}
        try:
            if not isinstance(response, ModelResponse) or not isinstance(response.json_text, str):
                raise ValueError("Unexpected model response")
            if len(response.json_text) > 128 * 1024:
                raise ValueError("Model output too large")
            result = validate(json.loads(response.json_text))
            model = _text(response.model)
        except (ValueError, RecursionError):
            return {"status": "invalid_model_output", "stage": stage}
        return {"status": "ok", "data": result, "model": {"provider": route.provider, "model": model}}

    def propose(self, *, source: PublicSource | None = None, note: str | None = None,
                thought: PrivateThought | None = None, public_context: tuple[PublicEntity, ...] = ()):
        if (source is None) == (thought is None) or (thought is not None and note is not None):
            raise ValueError("Provide a source with optional note, or a standalone thought")

        if source is not None and not source.paragraphs:
            return {"status": "source_unavailable", "stage": EXTRACT}

        synthesis_adapter = self.adapters.get(self.settings.synthesis.provider)
        accepts_private = synthesis_adapter is not None and synthesis_adapter.accepts_private_input
        if thought is not None and not accepts_private:
            return {"status": "deferred_private_input", "stage": SYNTHESIZE}

        models = {}
        extraction = None
        payload = {"context": [{"id": entry.entity_id, "description": entry.description}
                               for entry in public_context]}
        if source is not None:
            request = {"paragraphs": [{"number": i, "text": text}
                                      for i, text in enumerate(source.paragraphs, 1)]}
            extracted = self._run(EXTRACT, self.settings.extraction, request,
                                  lambda output: _extracted(output, source))
            if extracted["status"] != "ok":
                return extracted
            models[EXTRACT] = extracted["model"]
            extraction = extracted["data"]
            if not extraction["claims"]:
                return {"status": "no_source_evidence", "stage": EXTRACT, "gaps": extraction["gaps"]}
            # Send only the public extraction and context, without the submitted URL or note.
            payload["extraction"] = extraction
            if note is not None and accepts_private:
                payload["private_note"] = note
        else:
            payload["private_thought"] = {"kind": thought.kind, "text": thought.text}

        claim_ids = {claim["id"] for claim in extraction["claims"]} if extraction else set()
        entity_ids = {entry.entity_id for entry in public_context}
        synthesis = self._run(SYNTHESIZE, self.settings.synthesis, payload,
                              lambda output: _synthesized(output, claim_ids, entity_ids))
        if synthesis["status"] != "ok":
            return synthesis
        models[SYNTHESIZE] = synthesis["model"]
        proposal = {"visibility": "private", "review_status": "needs_review", "models": models,
                    "digest": synthesis["data"], "extraction": extraction}
        if source is not None:
            proposal["source_url"] = source.url
        if note is not None:
            proposal["note_status"] = "used_locally" if accepts_private else "deferred_private_input"
        if thought is not None:
            proposal["thought"] = {"kind": thought.kind, "original_text": thought.text}
        return {"status": "proposed", "proposal": proposal}
