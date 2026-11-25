# Security and privacy

Do not report sensitive vulnerabilities or credentials via public issues; ask owner for a private channel. Never commit private inbox content, unlicensed source copies, .env, tokens, DBs or private logs.

Bootstrap for a single trusted local operator only. It queues source data, does not fetch URLs or publish. Production requires scoped identity, tenant ownership where relevant, TLS, rate limits, audit, source rights, backup/restore and SSRF defenses. Rotate secrets; external content and LLM outputs are untrusted. Review publication explicitly. No arbitrary shell, local files, cloud metadata, private network or remote Git writes via source submission.
