# AIwiki

**The Living Encyclopedia and Practical Guide to Artificial Intelligence**

**Less Noise. More Understanding. Knowledge That Compounds.**

[简体中文 / Chinese companion](README.zh-CN.md)

> AI moves faster than we can understand, absorb, and try it. AIwiki turns scattered discoveries into connected, practical knowledge.

## Our vision

**AIwiki aims to become the knowledge infrastructure for navigating the AI information explosion: rather than chasing every new development, we can turn every valuable discovery into a building block of lasting knowledge.**

AIwiki is a wiki-first, evidence-backed encyclopedia and knowledge graph connecting AI history, theory, architectures, models, tools, practical workflows, applications, people and organizations. It is designed for people who discover valuable articles, projects, tutorials and ideas faster than they can make sense of them.

## From discovery to understanding

**Capture → Digest → Connect → Try → Revisit**

- Save a useful or interesting link, a question, a personal reflection or an idea, directly or through an external agent.
- Extract the key ideas, evidence, significance and uncertainties in a reusable digest rather than another isolated bookmark.
- Connect each discovery to existing concepts, sources, prerequisites, competing approaches and practical applications, with explanations of why the relationships matter.
- Identify useful next steps: a reading path, a small experiment, a comparison or a practical workflow. Clearly distinguish suggested from tested instructions.
- Return later to discover what has changed, revisit unfinished questions and experiments, and build understanding over time.

The public encyclopedia is English-first, with Chinese as a supplementary reading locale. Original sources and private notes retain their language. Personal collections, reflections and proposals are private by default; only authorized, reviewed knowledge enters the public wiki. AIwiki is not a news feed or an automatic publishing bot.

These are product goals; see the bootstrap status below for what is actually implemented.

## Start here

- [AGENTS.md](AGENTS.md) — AutoLoop and contributor operating instructions.
- [Product](docs/PRODUCT.md) — scope, UX and acceptance criteria.
- [Learning and synthesis](docs/LEARNING.md) — the core capture-to-understanding workflow.
- [Knowledge model](docs/KNOWLEDGE.md) — canonical IDs, claims, relations and provenance.
- [Agent API](docs/AGENT_API.md) — versioned interface and security boundaries.
- [Roadmap](docs/ROADMAP.md) — ordered development and maintenance plan.
- [AutoLoop handoff](docs/AUTOLOOP.md) — first run and handover checklist.
- [GitHub Pages deployment](docs/PAGES.md) — public reader source and deployment.
- [Security](SECURITY.md) — data and publication policy.

## Bootstrap status

The local Python gateway implements an authenticated durable inbox, job status and private result retrieval. The opt-in [offline worker](docs/MODEL_PIPELINE.md#run-from-the-inbox) runs source extraction and knowledge synthesis against synthetic fixtures. Live source fetching, reviewer approval, wiki publication and MCP remain planned.

Python 3.11+; no third-party runtime dependencies for the gateway.

```bash
export ENCY4AI_AGENT_TOKEN="$(python -c 'import secrets; print(secrets.token_urlsafe(32))')"
python -m api.server
```

Default listener: 127.0.0.1:8787. Configure ENCY4AI_HOST (loopback only), ENCY4AI_PORT and ENCY4AI_DB (default .local/inbox.sqlite3). Keep the token stable and secret, never in Git. See [OpenAPI](api/openapi.json).

```bash
curl -fsS http://127.0.0.1:8787/healthz
curl -fsS http://127.0.0.1:8787/api/v1/inbox \
  -H "Authorization: Bearer $ENCY4AI_AGENT_TOKEN" \
  -H 'Content-Type: application/json' \
  -H 'Idempotency-Key: example-source-001' \
  -d '{"url":"https://arxiv.org/abs/1706.03762","note":"Explain its impact and connect related concepts."}'
python -m unittest discover -s tests -v
```

HTTP 202 from submission means the job was queued. Poll `/api/v1/jobs/{job_id}` or request `/api/v1/jobs/{job_id}/result` with the same token. The result is available after an operator runs the worker.

This public repository does not authorize disclosure of private data, automatic publication, paid infrastructure or unrestricted agent access. The existing [MIT license](LICENSE) is preserved for repository software and its associated documentation. Third-party source material and encyclopedia contributions must respect their own licenses; the owner has not yet selected a separate public encyclopedia content license.
