"""Run the pipeline locally against a synthetic source and recorded model outputs."""

import json
import os
from pathlib import Path

from api.model_pipeline import (
    KnowledgePipeline,
    ModelAdapter,
    ModelResponse,
    ModelSettings,
    PublicEntity,
    PublicSource,
)

FIXTURE = Path(__file__).parent / "fixtures" / "model_pipeline.json"


def main():
    fixture = json.loads(FIXTURE.read_text(encoding="utf-8"))
    settings = ModelSettings.from_environment({
        "ENCY4AI_PROVIDER": "fixture",
        "ENCY4AI_MODEL": "shared-v1",
        **os.environ,
    })

    def recorded_response(stage, model, request):
        return ModelResponse(model, json.dumps(fixture["responses"][stage]))

    pipeline = KnowledgePipeline(settings, {
        "fixture": ModelAdapter(recorded_response),
        "fixture-second": ModelAdapter(recorded_response),
    })
    result = pipeline.propose(
        source=PublicSource(**fixture["source"]),
        public_context=tuple(PublicEntity(**entry) for entry in fixture["public_context"]),
    )
    print(json.dumps(result, indent=2))
    return 0 if result["status"] == "proposed" else 1


if __name__ == "__main__":
    raise SystemExit(main())
