# Implementation backlog

Status: bootstrap only. Do not mark planned items complete without evidence. See AGENTS.md and AUTOLOOP.md.

## P0 — reproducible foundation
- [ ] Inventory repository, CI and environment; record baseline. Choose maintainable stack (suggest Next.js/React, Python API, PostgreSQL; evaluate before adopting). Docker Compose local development, runtime secrets, documented single startup command.
- [ ] Define migrations for stable entities, claims, edges, sources, revisions, proposals and jobs. Authorization and public/private boundaries. Test graph integrity, citations, version scope and private isolation.
- [ ] Build article/wiki UI, search, navigation, small verified seed set, bounded graph (suggest Cytoscape.js), timeline and revision views. Validate responsive/accessibility. English canonical/default; linked supplementary Chinese pages share IDs and provenance.

## P1 — high-priority ingestion and review
- [ ] Durable job worker with leases/recovery, retries, idempotency, safe URL/text extraction and provenance. Offline fixtures in CI, authorized live source tests separately.
- [ ] Provider-neutral LLM interface, structured output validation, prompt-injection containment, cost limits and runtime keys.
- [ ] Entity resolution, candidate relations/claims, duplicate/conflict detection, draft diff and review queue. Approve/reject/rollback with audit and privacy tests.
- [ ] Implement read/query/proposal endpoints, OpenAPI, scopes, ownership and rate limits; independent Agent submits and retrieves its proposal. MCP only after REST integration passes.
- [ ] Implement [learning-first vertical slice](LEARNING.md): URL plus note, standalone thought/question, cross-source explained relations, digest with practical next step or none, private reading/experiment state and minimal topic catch-up. Demonstrate English default and Chinese companion locale; keep original notes private.

## P2 — practical learning and freshness
- [ ] Expand to product seed/guide acceptance criteria; role/goal learning paths, prerequisites, references and actual test status. Deepen catch-up, prioritized reading/experiment queues and personal progress; distinguish suggested, tried and verified actions.
- [ ] Freshness checks, link checks, snapshots, revision diffs, graph quality checks. Automated draft maintenance, not unconditional publication.

## P3 — deploy and maintain
- [ ] Present deployment/network/security/credential/backup/rollback/observability/cost plan for approval. No public bootstrap port. Verify deployment separately.
- [ ] Browser clipper, chat/Agent submission, reading queue, annotations, optional MCP, then multi-user isolation.

## First implementation cycle
Open or reuse tracking issue for P0/P1; record baseline and tests. Prefer a thin vertical slice: canonical article and evidence-backed local graph, real source submission, private evidence-backed proposal, review. Prioritize this over visual feature breadth. Each cycle reports changed files, evidence, blockers and next task. Keep roadmap and handoff in sync.
