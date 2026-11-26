# Implementation backlog

Status: bootstrap only. Do not mark planned items complete without evidence. See AGENTS.md and AUTOLOOP.md.

## P0 — reproducible foundation
- [ ] Inventory repository, CI and environment; record baseline. Choose maintainable stack (suggest Next.js/React, Python API, PostgreSQL; evaluate before adopting). Docker Compose local development, runtime secrets, documented single startup command.
- [ ] Define migrations for stable entities, claims, edges, sources, revisions, proposals and jobs. Authorization and public/private boundaries. Test graph integrity, citations, version scope and private isolation.
- [ ] Build article/wiki UI, search, navigation, small verified seed set, bounded graph (suggest Cytoscape.js), timeline and revision views. Validate responsive/accessibility. English canonical/default; linked supplementary Chinese pages share IDs and provenance.

## P1 — high-priority ingestion and review
- [ ] Durable job worker with leases/recovery, retries, idempotency, safe URL/text extraction and provenance. Offline fixtures in CI, authorized live source tests separately.
  - The [offline inbox worker](MODEL_PIPELINE.md#run-from-the-inbox) processes queued fixture submissions into stored private results with lease recovery and bounded model retries. Live source retrieval remains open ([issue #7](https://github.com/zz11ss11zz/ENCY4AI/issues/7)).
- [ ] Provider-neutral LLM interface, structured output validation, prompt-injection containment, cost limits and runtime keys.
  - The [offline pipeline](MODEL_PIPELINE.md) exercises both tasks, independent routing, evidence validation and private-input handling ([issue #5](https://github.com/zz11ss11zz/ENCY4AI/issues/5)). Live adapters with credential and cost handling and reviewer authorization are pending.
  - [ ] **Source extraction.** From authorized text already fetched by the worker, return structured source claims, key concepts, versions where stated, precise source locators, and extraction gaps. Keep source claims separate from model interpretation. An inaccessible source produces an explicit access state and no extracted claims.
  - [ ] **Knowledge synthesis.** Use validated extraction and relevant existing knowledge to produce a private digest and proposal: why it matters, candidate entity matches and typed relations with rationale and evidence, uncertainties or conflicts, and a practical next step or an explicit no-action result. A standalone thought or question can enter synthesis directly, retaining its original wording and private status.
  - **First release scope.** An operator can set the provider and model independently for each task through server-side configuration. Both can inherit the same default. Use runtime keys and record the actual provider/model in proposal provenance. Limit external model calls to authorized public source material and permitted public knowledge context. Route private notes or standalone thoughts only to a runtime authorized for private inputs, or defer synthesis with an explicit status. Defer end-user API-key settings, automatic model selection, and cross-provider fallback.
  - **Acceptance.** With offline fixtures, the same public URL submission works with one shared default and with distinct task settings. Changing one task's settings leaves the other task's provider/model unchanged. A related-source fixture yields a private proposal with resolvable evidence anchors and an explained candidate relation or conflict. Inaccessible sources and invalid model output are reported without creating unsupported claims or proposals from that output. A private-note fixture confirms private text stays out of external calls and public results. Only an authorized reviewer can approve a proposal for publication.
- [ ] Entity resolution, candidate relations/claims, duplicate/conflict detection, draft diff and review queue. Approve/reject/rollback with audit and privacy tests.
- [ ] Implement read/query/proposal endpoints, OpenAPI, scopes, ownership and rate limits; independent Agent submits and retrieves its proposal. MCP only after REST integration passes.
  - The authenticated job result endpoint supports the current single-operator gateway. Ownership, multi-user access and reviewer endpoints remain open.
- [ ] Implement [learning-first vertical slice](LEARNING.md): URL plus note, standalone thought/question, cross-source explained relations, digest with practical next step or none, private reading/experiment state and minimal topic catch-up. Demonstrate English default and Chinese companion locale; keep original notes private.

## P2 — practical learning and freshness
- [ ] Expand to product seed/guide acceptance criteria; role/goal learning paths, prerequisites, references and actual test status. Deepen catch-up, prioritized reading/experiment queues and personal progress; distinguish suggested, tried and verified actions.
- [ ] Freshness checks, link checks, snapshots, revision diffs, graph quality checks. Automated draft maintenance, not unconditional publication.

## P3 — deploy and maintain
- [ ] Present deployment/network/security/credential/backup/rollback/observability/cost plan for approval. No public bootstrap port. Verify deployment separately.
- [ ] Browser clipper, chat/Agent submission, reading queue, annotations, optional MCP, then multi-user isolation.

## First implementation cycle
Open or reuse tracking issue for P0/P1; record baseline and tests. Prefer a thin vertical slice: canonical article and evidence-backed local graph, real source submission, private evidence-backed proposal, review. Prioritize this over visual feature breadth. Each cycle reports changed files, evidence, blockers and next task. Keep roadmap and handoff in sync.
