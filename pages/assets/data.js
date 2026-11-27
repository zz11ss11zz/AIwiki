// Reader data adapter. The ONLY module that knows the dataset shape.
// Input: a parsed JSON object (schema "ency4ai.reader.v0", see web/README.md).
// Output: { ok: true, ds, warnings } or { ok: false, reason }.
// Pure functions, no DOM or network access, so it runs under node:test.

export const SCHEMA = 'ency4ai.reader.v0';

// Forward/inverse labels for the typed predicates in docs/KNOWLEDGE.md.
// Edges with any other predicate are dropped: the UI never invents semantics.
export const PREDICATES = {
  is_a: ['Is a', 'Has instance'],
  subclass_of: ['Subclass of', 'Has subclass'],
  part_of: ['Part of', 'Has part'],
  built_on: ['Built on', 'Foundation for'],
  evolves_from: ['Evolves from', 'Evolved into'],
  developed_by: ['Developed by', 'Developed'],
  supports: ['Supports', 'Supported by'],
  prerequisite_for: ['Prerequisite for', 'Has prerequisite'],
  applied_to: ['Applied to', 'Application of'],
  alternative_to: ['Alternative to', 'Alternative to'],
  evaluated_on: ['Evaluated on', 'Evaluates'],
};

export const CLAIM_KINDS = {
  observed_fact: 'Observed fact',
  author_claim: 'Author claim',
  inference: 'Inference',
  editorial_advice: 'Editorial advice',
  hypothesis: 'Attributed hypothesis',
};

export const STATUSES = {
  verified: 'Verified',
  candidate: 'Unverified candidate',
  disputed: 'Disputed',
  superseded: 'Superseded',
  rejected: 'Rejected',
  synthetic: 'Synthetic fixture',
  published: 'Published',
};

const isObj = (v) => v !== null && typeof v === 'object' && !Array.isArray(v);
const str = (v) => (typeof v === 'string' ? v : '');
const arr = (v) => (Array.isArray(v) ? v : []);

function indexById(list, kind, warnings) {
  const map = new Map();
  for (const item of list) {
    if (!isObj(item) || !str(item.id)) {
      warnings.push(`${kind}: dropped entry without id`);
      continue;
    }
    if (map.has(item.id)) {
      warnings.push(`${kind}: duplicate id ${item.id} ignored`);
      continue;
    }
    map.set(item.id, item);
  }
  return map;
}

export function loadDataset(raw) {
  if (!isObj(raw)) return { ok: false, reason: 'Dataset is not a JSON object.' };
  if (raw.schema !== SCHEMA) {
    return { ok: false, reason: `Unsupported dataset schema (expected ${SCHEMA}).` };
  }
  if (!Array.isArray(raw.articles) || !Array.isArray(raw.fields)) {
    return { ok: false, reason: 'Dataset is missing fields or articles.' };
  }
  const warnings = [];
  const fields = indexById(raw.fields, 'field', warnings);
  const sources = indexById(arr(raw.sources), 'source', warnings);
  const claims = indexById(arr(raw.claims), 'claim', warnings);
  const articles = indexById(raw.articles, 'article', warnings);

  for (const claim of claims.values()) {
    claim.evidence = arr(claim.evidence).filter((ev) => {
      const ok = isObj(ev) && sources.has(ev.source_id);
      if (!ok) warnings.push(`claim ${claim.id}: evidence with unknown source dropped`);
      return ok;
    });
  }

  for (const a of articles.values()) {
    if (!fields.has(a.field_id)) {
      warnings.push(`article ${a.id}: unknown field ${str(a.field_id)}`);
      a.field_id = null;
    }
    a.aliases = arr(a.aliases).filter((x) => typeof x === 'string');
    a.sections = arr(a.sections).filter((s) => isObj(s) && str(s.id) && str(s.heading));
    for (const s of a.sections) {
      s.paragraphs = arr(s.paragraphs).filter((p) => isObj(p) && str(p.text));
      for (const p of s.paragraphs) {
        p.claim_ids = arr(p.claim_ids).filter((cid) => {
          const ok = claims.has(cid);
          if (!ok) warnings.push(`article ${a.id}: citation to unknown claim ${cid} dropped`);
          return ok;
        });
      }
    }
  }

  const edges = [];
  for (const e of arr(raw.edges)) {
    if (!isObj(e)) continue;
    if (!PREDICATES[e.predicate]) {
      warnings.push(`edge ${str(e.id)}: unknown predicate ${str(e.predicate)} dropped`);
      continue;
    }
    if (!articles.has(e.subject_id) || !articles.has(e.object_id)) {
      warnings.push(`edge ${str(e.id)}: dangling endpoint dropped`);
      continue;
    }
    if (e.claim_id != null && !claims.has(e.claim_id)) {
      warnings.push(`edge ${str(e.id)}: unknown claim ${e.claim_id} cleared`);
      e.claim_id = null;
    }
    edges.push(e);
  }

  return {
    ok: true,
    warnings,
    ds: {
      synthetic: raw.synthetic === true,
      notice: str(raw.notice),
      fields,
      articles,
      claims,
      sources,
      edges,
    },
  };
}

export function articlesInField(ds, fieldId) {
  const crossListed = arr(ds.fields.get(fieldId)?.article_ids);
  return [...ds.articles.values()]
    .filter((a) => a.field_id === fieldId || crossListed.includes(a.id))
    .sort((x, y) => str(x.title).localeCompare(str(y.title)));
}

// Related topics come only from typed edges, shown from the viewed article's side.
export function relatedTopics(ds, articleId) {
  const out = [];
  for (const e of ds.edges) {
    let dir = null;
    if (e.subject_id === articleId) dir = 0;
    else if (e.object_id === articleId) dir = 1;
    if (dir === null) continue;
    const otherId = dir === 0 ? e.object_id : e.subject_id;
    out.push({
      edge: e,
      label: PREDICATES[e.predicate][dir],
      other: ds.articles.get(otherId),
    });
  }
  return out;
}

// Numbered citations for one article: claims in order of first appearance,
// then claims that back the article's related-topic edges.
export function citationOrder(ds, article) {
  const order = [];
  const seen = new Set();
  const add = (cid) => {
    if (cid && !seen.has(cid) && ds.claims.has(cid)) {
      seen.add(cid);
      order.push(cid);
    }
  };
  for (const s of article.sections) for (const p of s.paragraphs) p.claim_ids.forEach(add);
  for (const r of relatedTopics(ds, article.id)) add(r.edge.claim_id);
  return order;
}

export const MAX_QUERY = 200;

export function search(ds, query) {
  const terms = str(query).slice(0, MAX_QUERY).toLowerCase().split(/\s+/).filter(Boolean);
  if (!terms.length) return [];
  const hits = [];
  for (const a of ds.articles.values()) {
    const title = str(a.title).toLowerCase();
    const hay = [title, ...a.aliases.map((x) => x.toLowerCase()), str(a.summary).toLowerCase()].join('\n');
    if (!terms.every((t) => hay.includes(t))) continue;
    const score = terms.filter((t) => title.includes(t)).length;
    hits.push({ article: a, score });
  }
  hits.sort((x, y) => y.score - x.score || str(x.article.title).localeCompare(str(y.article.title)));
  return hits.map((h) => h.article);
}
