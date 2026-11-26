# Offline model pipeline

The offline pipeline takes an operator-supplied public source snapshot and a small set of curated public entities. Source extraction returns author claims with resolvable quotations, concepts, versions and gaps. Knowledge synthesis uses the validated extraction and context to build a private proposal with a digest, candidate relations, uncertainties and a suggested next step or an explicit null action.

## Reproduce

From the repository root with Python 3.11 or later:

```bash
python -m tests.model_pipeline_demo
python -m unittest discover -s tests -v
```

The demo loads a synthetic source from the checked-in fixture. A successful result has status `proposed`, a `private` proposal in `needs_review`, and provenance for both stages. The default demo runs both stages with `fixture/shared-v1`. This command overrides synthesis while extraction retains the default:

```bash
ENCY4AI_SYNTHESIS_PROVIDER=fixture-second ENCY4AI_SYNTHESIS_MODEL=synthesis-v1 python -m tests.model_pipeline_demo
```

PowerShell:

```powershell
$env:ENCY4AI_SYNTHESIS_PROVIDER = 'fixture-second'
$env:ENCY4AI_SYNTHESIS_MODEL = 'synthesis-v1'
python -m tests.model_pipeline_demo
Remove-Item Env:ENCY4AI_SYNTHESIS_PROVIDER, Env:ENCY4AI_SYNTHESIS_MODEL
```

## Configuration

| Purpose | Provider variable | Model variable |
|---|---|---|
| Shared default | `ENCY4AI_PROVIDER` | `ENCY4AI_MODEL` |
| Source extraction override | `ENCY4AI_EXTRACTION_PROVIDER` | `ENCY4AI_EXTRACTION_MODEL` |
| Knowledge synthesis override | `ENCY4AI_SYNTHESIS_PROVIDER` | `ENCY4AI_SYNTHESIS_MODEL` |

The application registers adapters server-side and passes task data to a configured adapter. A missing override inherits its corresponding shared default field. The registered provider and the model ID reported by the adapter are recorded for each successful stage. The two fixture providers replay recorded outputs and require no credentials, tools or network requests.

## Validation and privacy

- Each extracted quotation must match exactly once in the given paragraph of the normalized snapshot. Evidence stores the one-based paragraph and zero-based, end-exclusive character offsets. The proposal stores the source URL separately. A valid quotation locates evidence. Editorial review still determines whether it supports the claim.
- Synthesis uses known entity and claim IDs. Factual relation suggestions require a supported predicate, two distinct context entities, a rationale and at least one extracted claim. All produced relations are candidates. Suggested practice is marked `suggested`.
- Inaccessible sources and unusable outputs return explicit statuses without a proposal. A source with no extracted evidence skips synthesis. Adapter failures exposed as `ModelUnavailable` return a status without runtime error details.
- The caller supplies only authorized public paragraphs and public context. Source URLs and private notes are omitted from external task payloads. Public-source synthesis can complete while deferring the note. Only adapters explicitly registered by the operator to process private input may receive a note or standalone thought. A deferred thought makes zero model calls. Processed thoughts retain their original wording and have no extracted source claims.
- The offline runner returns proposals in memory. HTTP submission and status are still queue-only. Fetch safety, real provider credentials and budgets, durable retries, result access, and reviewer authorization must be verified as those integrations are added. This module has no tool execution or publication operation.
