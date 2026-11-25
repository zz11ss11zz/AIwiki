# ENCY4AI

**The Living Encyclopedia of Artificial Intelligence** · 持续演进的人工智能百科全书与实用指南

ENCY4AI is a wiki-first, evidence-backed knowledge graph connecting AI history, theory, architectures, models, tools, practical workflows, applications, people and organizations. Readers can browse a book-like outline, follow semantic relationships, and learn how to use AI. Human or agent-submitted links and notes become private evidence-backed proposals, not automatic public posts.

## Start here

- [AGENTS.md](AGENTS.md) — AutoLoop and contributor operating instructions.
- [Product](docs/PRODUCT.md) — scope, UX and acceptance criteria.
- [Knowledge model](docs/KNOWLEDGE.md) — canonical IDs, claims, relations and provenance.
- [Agent API](docs/AGENT_API.md) — versioned interface and security boundaries.
- [Roadmap](docs/ROADMAP.md) — ordered development and maintenance plan.
- [AutoLoop handoff](docs/AUTOLOOP.md) — first run and handover checklist.
- [Security](SECURITY.md) — data and publication policy.

## Bootstrap status

Local Python gateway only, not a deployed encyclopedia. The gateway implements an authenticated durable inbox and job status; no source fetching, LLM extraction, wiki publishing or MCP is enabled yet.

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

HTTP 202 means queued, not analyzed or published. Poll /api/v1/jobs/{job_id} with the same token.

This public repository does not authorize disclosure of private data, automatic publication, paid infrastructure or unrestricted agent access. The existing [MIT license](LICENSE) is preserved for repository software and its associated documentation. Third-party source material and encyclopedia contributions must respect their own licenses; the owner has not yet selected a separate public encyclopedia content license.
