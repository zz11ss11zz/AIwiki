# Learning, synthesis and practical discovery

## Why AIwiki exists

AIwiki aims to become the knowledge infrastructure for navigating the AI information explosion: rather than chasing every new development, we can turn every valuable discovery into a building block of lasting knowledge.

AI advances faster than most people can understand, absorb and try each development. Saving more links is not the solution. AIwiki should turn scattered discoveries into a connected, durable understanding of AI: what changed, why it matters, what it builds on, how it relates to previous discoveries, what to learn first, and what to try next. A reader who returns after months should recover the context without catching up on every headline.

The public encyclopedia is a shared, evidence-backed learning resource. The owner's collection of interesting links, questions, reflections and ideas is a private-by-default working knowledge layer. Approved general knowledge can enrich the public encyclopedia without disclosing the original private note. Never silently transform personal opinion into a verified public fact.

## Capture → digest → connect → try → revisit

| Stage | Required behavior |
|---|---|
| Capture | Accept a URL, standalone thought/question, or URL with a note through the website or Agent API. Keep capture friction low; preserve source locator, input language, original private note and time. |
| Digest | Distinguish what the source actually says, what is independently verified, why it matters, what remains uncertain, and what may be worth exploring. Record extraction/access failure honestly. |
| Connect | Resolve entities, map specific semantic relationships with rationale and evidence, and surface useful prior discoveries, related wiki concepts, conflicting claims and prerequisites. Do not invent links to force a graph. |
| Try | Where appropriate propose a small experiment, practical guide or decision workflow, with prerequisite knowledge, version, expected outcome, estimated effort, costs/permissions, limitations and verification status. Not every source is actionable. |
| Revisit | Offer a private reading queue, unfinished experiments and meaningful changes since the last visit. Keep older context, distinguish a new tool from an update and identify what has become obsolete. |

## Knowledge item experience

A source digest is a reusable view rather than a disposable chat summary. Each digest has a title, source link/attribution, dates, original language, short and extended explanation, key claims/evidence, relevance, connected topics and why each link matters, suggested prerequisites, practical follow-ups and open questions. Provide "read in 2 minutes" and deeper reading views; time estimates are approximate. For a personal thought, present it as a reflection, hypothesis, question or idea, not a sourced article. Show the associated sources if supplied and evidence gaps if not.

In the graph, readers can toggle topic, history/lineage, practical dependencies, alternative/comparison and evidence views. Use selected local neighborhoods, semantic directions, source-backed edge explanations and curated paths. Similarity retrieval is a suggestion mechanism only. The private workspace may link to public entities, but the public graph must never leak a private node, relation, count, snippet or inferred personal interest.

## From knowing to using

Recommended actions may be: read a prerequisite; compare two tools; reproduce a small demo; test a feature; follow a tutorial; revisit a hypothesis when evidence changes; or consciously defer. Prioritize by reader-selected interest and time budget, not hype or raw publication recency. Show rationale for each recommendation and allow dismissal. Store personal reading/practice status privately (unread, reading, understood, to_try, tried, deferred; user-controlled, not inferred from a click). For experiments, store outcome, tested version, date, failures and links to notes. An AI suggestion never counts as a completed experiment.

Provide optional catch-up views by topic or since a selected date: meaningful changes, newly relevant connections, outdated material, unanswered questions and prioritized next steps. Not a mandatory daily digest. Important historical milestones should remain discoverable even if old.

## Editorial and language policy

English is the canonical public language: repository README, navigation, default wiki and guide pages, API contracts and primary developer docs. Simplified Chinese is a supplementary locale, with an explicit switch/link and same stable knowledge IDs, revision/provenance alignment, translation status and fallback to English when missing. Original Chinese or other-language sources and personal notes remain in their original language; English summaries must preserve meaning and attribution. Chinese supporting documentation may explain project goals and usage but must not diverge from canonical requirements. Do not auto-translate private reflections for public release.

## MVP acceptance scenarios

1. Submit a public article with a private note; show a digest with source-grounded claims, at least two justified relations where evidence permits, prior related knowledge and a reasonable next step or an explicit "no practical action identified." A link without content is not success.
2. Submit a standalone idea in Chinese; preserve its wording, label it as a private reflection/question/hypothesis, connect it to at least one relevant concept if justified and identify missing evidence. No fabricated source, public claim or private data leak.
3. Submit a second related source or changed version; show how it extends, contradicts, replaces or applies existing knowledge, with a clear explanation and no duplicate canonical topic. Repeated identical submissions are idempotent.
4. Reopen a saved topic after a simulated interval; distinguish meaningful changes from unchanged background and surface a prioritized reading or experiment suggestion. Record user-controlled status.
5. Follow a practical guide with a runnable or explicitly untested example, then record a real or fixture-based experiment outcome without claiming that generated steps have been executed.
6. Browse in English by default and switch to a supplementary Chinese page where available; the same entity IDs, citations and revision history survive the language switch. Private inputs cannot appear in public search, graph, logs, exports or recommendations.

These are planned product requirements, not claims about the bootstrap implementation. Do not expand into a full social network, news feed or elaborate gamification before the capture-to-understanding loop works.
