# AutoLoop handoff — START HERE

Project name: ENCY4AI. Repository: https://github.com/zz11ss11zz/ENCY4AI (public). Purpose: a living AI encyclopedia and practical guide, not a news-only feed. AI is advancing faster than readers can understand, absorb and try new developments. The owner wants to save useful or interesting pages as well as personal reflections, questions and ideas; ENCY4AI must turn them into reusable digests, meaningful links to existing knowledge, learning/practice next steps and revisitable context. Read [LEARNING.md](LEARNING.md) as a core requirement. English is the default public and developer language; Chinese is supplementary. Preserve source and private-note language.

## Guiding vision

Official brand tagline: **Less Noise. More Understanding. Knowledge That Compounds.** Preserve this wording in the English homepage and use the approved localized equivalent in the Chinese companion. This tagline reflects the product's priority: durable understanding over information volume.

ENCY4AI aims to become the knowledge infrastructure for navigating the AI information explosion: rather than chasing every new development, we can turn every valuable discovery into a building block of lasting knowledge.

Use this as the decision criterion for product development: prioritize lasting understanding and meaningful connections over the volume or speed of news ingestion.

## First run

Start with [Issue #1 — P0/P1 kickoff](https://github.com/zz11ss11zz/ENCY4AI/issues/1). The renamed gateway and tests passed 8 local tests on 2026-11-25; the server.py and test_gateway.py Git blob hashes were verified against the tested files. Remote CI result was not confirmed; rerun tests and check Actions before advancing.
1. Clone the repository and inspect the current default branch, open issues and CI. Read AGENTS.md, README.md and all docs/; confirm baseline instead of assuming plans are implemented.
2. Run python -m unittest discover -s tests -v; record actual results and environment. Inspect the local gateway and OpenAPI. Do not install paid services or use production credentials.
3. Create/reuse issues aligned to P0–P3; check for duplicates and dependencies. Start with a vertical slice, not separate disconnected prototypes.
4. Create a feature branch, implement minimal scoped changes, test locally and open a PR. Link issue, demo, test results, screenshots where relevant, known limits and rollback. Never auto-merge or deploy without owner authorization.
5. Repeat for the next unblocked task. Update ROADMAP.md and this handoff after review. Report blockers instead of inventing success.

## Initial vertical slice
- Seed a small, source-verified set around Transformer, attention, LLM, AI Agent, RAG, MCP and practical application. Each entity has stable ID, primary source evidence, version qualifiers and typed relationships. Do not claim that one technology is a prerequisite or required component without evidence.
- Reader opens an English wiki page, browses labeled graph neighbors with explanations, follows a practical guide and can switch to a supplementary Chinese page with shared IDs/provenance.
- External Agent submits a URL with an idempotency key. The worker extracts authorized content, returns summary, new/existing entity matches, evidence anchors, candidate edges, conflicting claims and suggested wiki diffs to a private proposal. If source inaccessible, show that state.
- Submit a standalone Chinese thought/question, preserve original wording and private status, link to relevant concepts with rationale and separate hypothesis from evidence. Submit a second related source, show what is genuinely new, what relates to prior knowledge, and what to learn/try. Reopen a topic to see meaningful changes and incomplete learning or experiment tasks. Implement the acceptance scenarios in LEARNING.md without counting suggestions as executed experiments.
- Owner can review and approve/reject; audit, rollback and public/private isolation tested. Retrieval must show original source and relationships. Unverified or untested content explicitly labeled.
- Use fixtures for repeatable tests. Authorized live inputs separately; no third-party text or private payloads in Git.

## Developer versus knowledge agent
AutoLoop developer: GitHub branch/issue/PR/CI. Knowledge agent: scoped REST/OpenAPI, later MCP. Keep these separate. Default bootstrap loopback port 8787, ENCY4AI_ environment prefix. The HTTP gateway queues only. [Issue #5](https://github.com/zz11ss11zz/ENCY4AI/issues/5) tracks the [offline model pipeline](MODEL_PIPELINE.md) and its reproducible tests. Next, connect authorized source snapshots and curated context through a durable worker, then verify real provider adapters and reviewer authorization.

The offline branch was based on `e36a675`. Local Windows Python 3.12.14 passed all 17 tests with `python -m unittest discover -s tests -v`; the CLI produced private proposals with both shared and split model settings. The gateway explicitly closes each SQLite connection after its transaction and retains the existing HTTP contract.

## Maintenance loop
Inspect user-reported sources and existing issues; prioritize correctness/privacy and broken paths, then learning value and usability. Avoid measuring success by number of news items, links or graph nodes alone. Propose knowledge patches with sources; run link/freshness checks and flag obsolete tutorials. Produce reviewable PRs and private proposals. Never autonomously publish unreviewed facts, use private material in public repo, change repo access, spend money, or expose services. Track per-cycle objective, changes, source evidence, tests, pending review, blockers and next task. Preserve the existing MIT software license; owner chooses separate encyclopedia content licensing, production network and publication authorization.

## Completion evidence
- PR URL and commit SHA; tests with commands/results (CI and local distinguished).
- Screenshots or reproducible walkthrough for UX.
- API contract and compatibility, migration/rollback, security/privacy tests.
- Clearly label what is implemented, planned, unavailable, or not verified.
