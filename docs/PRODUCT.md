# ENCY4AI product specification (v0.1)

## Vision

ENCY4AI aims to become the knowledge infrastructure for navigating the AI information explosion: rather than chasing every new development, we can turn every valuable discovery into a building block of lasting knowledge.

## Product promise
A continuously revised book, not a feed of AI headlines. One canonical article per topic; book chapters, graph neighborhoods and learning paths link to that article. Editorial promise: traceable facts, meaningful relationships, actionable workflows, visible freshness and revision history. Never promise perfect real-time accuracy.

## Founding problem and core workflow
AI advances faster than most readers can understand, digest and try it. The owner and future readers should be able to capture interesting/useful pages and their own questions, reflections and ideas, then see a coherent synthesis of related knowledge and a practical next step. The core experience is Capture → Digest → Connect → Try → Revisit. Read [Learning and synthesis](LEARNING.md) for detailed requirements. This workflow has P0/P1 priority, not a later optional feature.

## Readers and navigation
- Novice: plain-language explanations, prerequisites, introductory learning paths.
- Practitioner: goal-oriented guides, tool comparisons, verified workflows, cost/version caveats.
- Developer/researcher: architecture, mathematical depth, primary literature, code and reproducibility.
- Curator: private inbox, provenance, proposals, conflicts, reading queue and authorized public review.

Ten entry points: AI history; fundamentals; architectures; models; tools; agents and automation; practical handbook; industry applications (including AI for Science); people/organizations/industry; AGI and future. English-first: English is the canonical public and developer language; Simplified Chinese is a supplementary locale with explicit links/switches, shared stable IDs, synchronized provenance/revisions and English fallback when missing. Preserve original-language sources and private notes.

Views: book-like sidebar and table of contents; search; canonical article (overview/history/principles/practice/related/revisions); local knowledge graph with explicit semantic edge labels, filters and directions; timeline; learning paths; private knowledge inbox; review queue; source digests with explained connections and suggested next steps; private reading and experiment queue; topic-specific catch-up view. Accessible responsive layouts and keyboard navigation; public browsing without login; authenticated private features. Default graph one hop or bounded two hops, not a giant unreadable graph. Keep articles readable without graph.

## Knowledge ingestion
1. Accept URL, text or later supported upload from humans and external agents. Record original locator, submitted date, note, language and visibility (private by default); accept standalone questions, reflections or hypotheses without demanding a URL or fabricating evidence; deduplicate without discarding distinct versions or notes.
2. Fetch authorized public material only; enforce access rules, SSRF controls, timeouts, size caps, attribution and copyright constraints. If inaccessible, mark it and accept an authorized excerpt; never invent content.
3. Extract key claims, concepts, dates, people, models, methods, tools, practical workflows and candidate relationships. Separate author claims, verification and inference.
4. Resolve by stable IDs, aliases, versions, language and context; identify ambiguity and contradictory evidence instead of guessing.
5. Generate structured private proposal: summary, why it matters, existing/new entity IDs, typed edges, evidence anchors, guide candidates, confidence/verification state, conflicts, prerequisites, practical follow-ups (or explicitly none), explained connections to prior discoveries and suggested diffs.
6. Review preview with evidence, permissions and visibility; approve/reject/revise. Authorized public releases are versioned, auditable and reversible. Personal notes stay private.
7. Query from article to claim to edge to source; readers see what was verified, when and against which version.

## Practical guides
Separate tutorial (learn by doing), how-to (solve a goal), reference and explanation. Include objective, prerequisites, software/model versions, expected inputs/outputs, steps, costs/limits, risks, troubleshooting, verification date and test status. Generated instructions are not tested until actually run. Include alternatives where meaningful.

## Freshness and history
Event time, reporting time and verification time are different. Stable concepts change on evidence; versions/prices/APIs trigger checks; guides retested after dependency changes. Keep dated revisions and label superseded information. Distinguish actual archived snapshots from retrospective reconstructions.

## MVP acceptance
- 30 well-sourced entries across 10 fields; expand toward 100 after validation. Canonical IDs, typed relationships, citation metadata; no invented links.
- Two learning paths and five reproducible or explicitly untested guides. English default, linked Chinese companion locale sharing entity IDs and provenance.
- Complete the six learning scenarios in [LEARNING.md](LEARNING.md), including a private standalone Chinese reflection, meaningful cross-source connections, catch-up view, user-controlled reading and experiment status, and practical next steps.
- Three authorized real submissions and a repeated submission; demonstrate durable inbox, deduplication, source extraction, relation suggestions, conflicts/ambiguous entity review and linked draft proposals.
- Trace a claim to source; review approval/rejection, rollback, privacy tests; anonymous readers cannot see private drafts or submissions.
- Mobile/desktop accessible article reading, search, bounded graph and timeline; CI and local startup documented.
- Deployment is separately approved. Defer paid tiers, community editing, full MCP and multi-tenant enterprise functionality until the core workflow works.
