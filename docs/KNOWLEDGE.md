# Knowledge model and editorial rules

Stable IDs are language independent and never silently reused. Example concept:transformer; aliases resolve to IDs. Versioned releases are separate entities. Public and private candidates have explicit authorization and visibility.

## Entity types
concept, algorithm, architecture, model_family, model_release, tool, protocol, dataset, benchmark, paper, person, organization, event, application, guide, learning_path, source.
Article: canonical entity ID, locale, title, aliases, summary, sections, status, timestamps, revision ID, claim IDs, related guide IDs. Align locales by ID. English is canonical; translations include translated_from_revision, translation_status and locale. Preserve the original language of the underlying source or private reflection.

## Typed semantic relationships
Directed edge fields: id, subject_id, predicate, object_id, claim_id, source_ids, qualifiers, valid_from, valid_to, verified_at, status, revision_id. Enforce permitted entity/predicate pairs, no dangling references, supporting claim/citation for public factual edges. Inverse display preserves semantics.

| Predicate | Meaning |
|---|---|
| is_a / subclass_of | instance/class or taxonomy |
| part_of | architecture/system component |
| built_on | documented technical dependency |
| evolves_from | evidenced lineage, not chronology alone |
| developed_by | attribution with qualifiers |
| supports | version-scoped compatibility |
| prerequisite_for | learning dependency; editorial judgement |
| applied_to | documented use case |
| alternative_to | comparable purpose with context |
| evaluated_on | benchmark/evaluation scoped to settings |
| supports_claim / contradicts_claim | evidence about a claim |

## Claim and source
Claim: id, subject_id, statement, kind (observed fact / author claim / inference / editorial advice / explicitly attributed hypothesis), status (candidate / verified / disputed / superseded / rejected), evidence[], as_of, verified_at, reviewer, revision_id. Evidence: source ID, precise locator (section/page/timestamp/commit/paragraph) and permitted quotation or paraphrase.
Source: original URL, canonical URL, title, author/publisher, publication/retrieval dates, access state, content fingerprint when permitted, license/restrictions, provenance. One source can support some claims but not others. Record disagreements.

## Private capture, synthesis and learning records
Capture: id, actor_id, kind (source / reflection / question / idea / hypothesis), original_text, locale, optional source_id and private note, captured_at, visibility, dedupe key. Standalone personal thoughts are not verified public claims. Keep the user's wording distinct from AI analysis.
Digest: id, capture_id, short_summary, expanded_explanation, claim/evidence IDs, significance, uncertainty, related entity/digest IDs, relation rationale, prerequisites, suggested actions, generated_at, model/provenance and revision. A proposed relation must explain why it matters; similarity alone does not establish a factual edge.
LearningAction: id, actor_id, linked digest/entity/guide IDs, action_kind (read / compare / experiment / revisit / defer), rationale, prerequisites, version, approximate effort, expected outcome, verification status. PersonalProgress: user-controlled status, timestamps, optional experiment outcome/observations and next question. Keep these records private. Private graph edges may reference public IDs but must not leak through public backlinks, counts, search, caches, logs or exports. A private hypothesis can be linked as such without becoming a public claim.

## Lifecycle
submitted -> queued -> extracting -> proposed -> needs_review -> approved/rejected -> published -> superseded. Jobs may fail with bounded retries. Job state differs from article verification. Server filters unpublished/private records. Rollbacks retain audit history. LLM confidence is not verification.

## Storage
Start with PostgreSQL typed entity/claim/edge/source/revision/proposal and durable jobs; Markdown/MDX articles with explicit revision references; optional pgvector for candidate retrieval only. Git tracks code and approved public text; private data stays in access-controlled storage. One canonical writer per object, graph/search derived reproducibly. Migrations and invariant tests before moving from bootstrap SQLite.
