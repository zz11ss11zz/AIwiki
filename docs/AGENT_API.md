# Agent integration

Development agents operate on GitHub through issues/branches/PRs/tests. Knowledge agents use versioned HTTP and later a thin MCP adapter. Separate credentials and scopes; no shell or repo write access through knowledge API.

Default local port 8787, configurable via ENCY4AI_PORT. Loopback only in bootstrap; no direct public forwarding. Base /api/v1; Authorization: Bearer <token>; JSON; persistent opaque job IDs; optional Idempotency-Key. Same key/payload returns original job, changed payload returns 409. Single trusted operator/token only, not multi-tenant identity. Status never returns private payload.

| Endpoint | State | Purpose |
|---|---|---|
| GET /healthz | implemented | liveness |
| GET /openapi.json | implemented | live contract |
| GET /api/v1/capabilities | implemented | live vs planned capabilities |
| POST /api/v1/inbox | implemented | queue URL or text plus note |
| GET /api/v1/jobs/{job_id} | implemented | state/timestamps |
| GET /api/v1/wiki/{id} | planned | article/revision |
| GET /api/v1/search | planned | text/semantic search |
| GET /api/v1/graph/{id} | planned | bounded graph/evidence |
| GET /api/v1/jobs/{id}/result | planned | authorized proposal/results |
| POST /api/v1/proposals | planned | propose revision |
| POST /api/v1/proposals/{id}/review | planned | privileged review |
| MCP adapter | planned | same narrow REST scopes |

Planned scopes: knowledge:read, inbox:submit, inbox:read_own, proposal:write, review:approve, publish:write. Production requires actor IDs, expiry, revocation, rate limits, audit, server-side ownership, TLS and CSRF controls where applicable. No public admin endpoint.

## Planned learning-first extensions (not implemented)
Preserve the existing submission contract; text can represent a standalone question, idea or reflection, and note can accompany a URL or text. Future backwards-compatible schema/endpoint changes should carry capture kind, original language, owner and explicit private visibility. Authorized result retrieval should expose source-grounded digest, evidence anchors, explained candidate relations to existing entities/discoveries, uncertainty, prerequisites and practical next steps or no action. Keep personal notes/learning progress/experiment outcomes private. Add typed learning and catch-up queries only after ownership and review controls are in place. English is canonical for API documentation; original submitted text must not be overwritten by translations. Update OpenAPI and compatibility tests when implementation changes.

## Submission contract
POST inbox accepts exactly one nonempty url or text, optional note. Body max 128 KiB. HTTP(S) URL accepted as data, not fetched. Future worker must screen all resolved IPs and redirects against loopback/private/link-local/reserved ranges, defend DNS rebinding, enforce allowed types, bounded download/timeouts and source access rights. Never access private endpoints or cloud metadata. Prompt injection containment is mandatory. Uploads and webhooks need separate authenticated implementation.

202 = queued, not analyzed; 200 = idempotent repeat. Poll job with same credential; bounded retries/backoff. No deletion/export or multi-user support yet; use non-sensitive test data. Planned MCP tools: search_knowledge, get_article, get_neighbors, submit_source, get_job, get_result, propose_revision. No bypass of permissions via MCP.

Remote access after owner approval: authenticated HTTPS reverse proxy or private network with per-agent scoped credentials. A port is not authentication. Do not bind this bootstrap publicly, register a domain or provision infrastructure without explicit approval.
