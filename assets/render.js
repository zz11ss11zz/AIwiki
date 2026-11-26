// Pure HTML renderers. Every dataset string goes through esc(); URLs through safeUrl().
import {
  articlesInField, relatedTopics, citationOrder, search,
  CLAIM_KINDS, STATUSES, MAX_QUERY,
} from './data.js';
import { ARTICLE_FIGURES, TOOL_COMPARISON } from './article-figures.js';

export const BRAND = 'ENCY4AI';
export const SUBTITLE = 'The Living Encyclopedia and Practical Guide to Artificial Intelligence';
// Approved tagline, docs/PRODUCT.md. Do not reword.
export const TAGLINE = 'Less Noise. More Understanding. Knowledge That Compounds.';

export function esc(value) {
  return String(value ?? '').replace(/[&<>"']/g, (c) => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;',
  })[c]);
}

export function safeUrl(value) {
  try {
    const u = new URL(String(value));
    return u.protocol === 'https:' || u.protocol === 'http:' ? u.href : null;
  } catch {
    return null;
  }
}

const q = (k, v) => `?${k}=${encodeURIComponent(v)}`;
export const articleHref = (id) => q('article', id);
export const fieldHref = (id) => q('field', id);
const anchor = (prefix, id) => `${prefix}-${String(id).replace(/[^A-Za-z0-9_-]/g, '_')}`;

const badge = (kind, text) => `<span class="badge badge-${esc(kind)}">${esc(text)}</span>`;
const statusBadge = (s) => (s ? badge(s, STATUSES[s] ?? s) : '');

export function syntheticBanner(ds) {
  if (!ds?.synthetic) return '';
  return `<p class="notice" role="note"><strong>Synthetic fixture data.</strong> ${esc(ds.notice)}</p>`;
}

export function renderSidebar(ds, current = {}) {
  const items = [...ds.fields.values()].map((f) => {
    const list = articlesInField(ds, f.id);
    const isField = current.fieldId === f.id;
    const sub = list.length
      ? `<ul>${list.map((a) => {
        const cur = current.articleId === a.id ? ' aria-current="page"' : '';
        return `<li><a href="${esc(articleHref(a.id))}"${cur}>${esc(a.title)}</a></li>`;
      }).join('')}</ul>`
      : '';
    return `<li><a href="${esc(fieldHref(f.id))}"${isField ? ' aria-current="page"' : ''}>${esc(f.title)}</a>`
      + ` <span class="count">(${list.length})</span>${sub}</li>`;
  }).join('');
  return `<h2 id="toc-heading" class="nav-heading">Browse by field</h2><ul class="tree">${items}</ul>`;
}

export function renderHome(ds) {
  const fields = [...ds.fields.values()].map((f) => {
    const n = articlesInField(ds, f.id).length;
    return `<li><a href="${esc(fieldHref(f.id))}">${esc(f.title)}</a> <span class="count">${n ? `${n} article${n > 1 ? 's' : ''}` : 'No articles yet'}</span></li>`;
  }).join('');
  return {
    title: `${BRAND} — ${SUBTITLE}`,
    html: `<section class="hero" aria-labelledby="home-title">
<h1 id="home-title">${BRAND}</h1>
<p class="subtitle">${esc(SUBTITLE)}</p>
<p class="tagline">${esc(TAGLINE)}</p>
</section>
${syntheticBanner(ds)}
<p class="status-note">Reader preview. Entries marked as candidates await editorial review.</p>
<section aria-labelledby="fields-heading"><h2 id="fields-heading">Entry points</h2><ul class="field-list">${fields}</ul></section>`,
  };
}

export function renderField(ds, fieldId) {
  const f = ds.fields.get(fieldId);
  if (!f) return renderNotFound('field', fieldId);
  const list = articlesInField(ds, fieldId);
  const body = list.length
    ? `<ul class="result-list">${list.map(resultItem).join('')}</ul>`
    : '<p class="empty">No published articles in this field yet.</p>';
  return {
    title: `${f.title} — ${BRAND}`,
    html: `${breadcrumb([[f.title]])}${syntheticBanner(ds)}<h1>${esc(f.title)}</h1>${body}`,
  };
}

function resultItem(a) {
  return `<li><a href="${esc(articleHref(a.id))}">${esc(a.title)}</a><p>${esc(a.summary)}</p></li>`;
}

function breadcrumb(trail) {
  const parts = [`<li><a href="./">Home</a></li>`];
  trail.forEach(([text, href], i) => {
    const last = i === trail.length - 1;
    parts.push(last
      ? `<li><span aria-current="page">${esc(text)}</span></li>`
      : `<li><a href="${esc(href)}">${esc(text)}</a></li>`);
  });
  return `<nav class="breadcrumb" aria-label="Breadcrumb"><ol>${parts.join('')}</ol></nav>`;
}

function renderFigure(figure, locale) {
  const [title, credit, alt, instructions] = figure[locale];
  const zh = locale === 'zh';
  const source = `<a href="${esc(figure.source)}" rel="noreferrer">${esc(credit)}</a>`;
  const image = esc(figure.image);
  const fullSize = zh ? '查看原图' : 'Full-size image';
  const size = figure.size ? ` width="${figure.size[0]}" height="${figure.size[1]}"` : '';
  const visual = image
    ? `<figure class="article-figure${figure.paper ? ' paper-figure' : ''}">
<a href="${image}" rel="noreferrer"><img src="${image}" alt="${esc(alt)}"${size} loading="lazy" decoding="async" referrerpolicy="no-referrer"></a>
<figcaption>${source} · <a href="${image}" rel="noreferrer">${fullSize}</a></figcaption>
</figure>`
    : `<p><a href="${esc(figure.demo)}" rel="noreferrer">${zh ? '打开官方演示动图（约 61 MB）' : 'Open the official animated demo (about 61 MB)'}</a> · ${source}</p>`;
  const steps = instructions.map(([label, instruction]) =>
    `<li><details><summary>${esc(label)}</summary><p>${esc(instruction)}</p></details></li>`
  ).join('');
  const guide = figure.guide ? `<p class="hint"><a href="${esc(figure.guide)}" rel="noreferrer">${zh ? 'T3 Code 官方会话指南' : 'T3 Code thread guide'}</a></p>` : '';
  return section(figure.id, title, `${visual}<ol class="figure-steps">${steps}</ol>${guide}`);
}

function section(id, title, body) {
  return { id, title, html: `<section aria-labelledby="${id}"><h2 id="${id}">${esc(title)}</h2>${body}</section>` };
}

export function articleExtras(ds, currentId, locale = 'en') {
  const extras = [];
  if (ds.synthetic) return extras;
  const figure = ARTICLE_FIGURES.get(currentId);
  if (figure) extras.push(renderFigure(figure, locale));
  const tools = TOOL_COMPARISON.filter(([id]) => ds.articles.has(id));
  if (tools.length < 2 || !tools.some(([id]) => id === currentId)) return extras;

  const zh = locale === 'zh';
  const title = zh ? '对比多智能体协作工具' : 'Compare agent collaboration tools';
  const labels = zh ? ['协作单位', '如何跟进', '官方说明'] : ['Unit of work', 'How to follow progress', 'Official documentation'];
  const rows = tools.map(([id, source, en, cn]) => {
    const name = esc(ds.articles.get(id).title);
    const [unit, progress] = zh ? cn : en;
    const heading = id === currentId ? `<span aria-current="page">${name}</span>` : `<a href="${articleHref(id)}">${name}</a>`;
    return `<li><h3>${heading}</h3><dl><dt>${labels[0]}</dt><dd>${esc(unit)}</dd><dt>${labels[1]}</dt><dd>${esc(progress)}</dd></dl>
<a class="hint" href="${esc(source)}" rel="noreferrer">${labels[2]} (${name})</a></li>`;
  }).join('');
  extras.push(section('compare-tools', title, `<ul class="tool-comparison">${rows}</ul>`));
  return extras;
}

export function renderArticle(ds, articleId) {
  const a = ds.articles.get(articleId);
  if (!a) return renderNotFound('article', articleId);
  const field = a.field_id ? ds.fields.get(a.field_id) : null;
  const extras = articleExtras(ds, a.id);
  const order = citationOrder(ds, a);
  const num = new Map(order.map((cid, i) => [cid, i + 1]));
  const backrefs = new Map();
  let refSeq = 0;
  const cite = (cid) => {
    const n = num.get(cid);
    const refId = `cite-ref-${n}-${++refSeq}`;
    if (!backrefs.has(n)) backrefs.set(n, []);
    backrefs.get(n).push(refId);
    return `<sup class="cite"><a id="${refId}" href="#cite-${n}" aria-label="Citation ${n}">[${n}]</a></sup>`;
  };

  const sections = a.sections.map((s, i) => {
    const paras = s.paragraphs.map((p) => `<p>${esc(p.text)}${p.claim_ids.map(cite).join('')}</p>`).join('');
    return `<section aria-labelledby="${anchor('sec', s.id)}"><h2 id="${anchor('sec', s.id)}">${esc(s.heading)}</h2>${paras}</section>${i === 0 ? extras.map(extra => extra.html).join('') : ''}`;
  }).join('');

  const related = relatedTopics(ds, a.id);
  const relatedHtml = related.length
    ? `<section aria-labelledby="related-heading"><h2 id="related-heading">Related topics</h2>
<p class="hint">Only relationships recorded in the knowledge graph are listed; each label states how the topic relates to <em>${esc(a.title)}</em>.</p>
<ul class="related">${related.map((r) => `<li><span class="rel-label">${esc(r.label)}</span> <a href="${esc(articleHref(r.other.id))}">${esc(r.other.title)}</a> ${statusBadge(r.edge.status)}${r.edge.claim_id ? cite(r.edge.claim_id) : ''}${r.edge.rationale ? `<p>${esc(r.edge.rationale)}</p>` : ''}${r.edge.claim_id ? '' : '<p class="hint">No supporting citation recorded for this relationship.</p>'}</li>`).join('')}</ul></section>`
    : '';

  const refs = order.length
    ? `<ol class="references">${order.map((cid, i) => refItem(ds, ds.claims.get(cid), i + 1, backrefs.get(i + 1) ?? [])).join('')}</ol>`
    : '<p class="empty">This article has no citations yet. Its text is unverified.</p>';

  const tocItems = a.sections.map((s) => `<li><a href="#${anchor('sec', s.id)}">${esc(s.heading)}</a></li>`);
  tocItems.splice(1, 0, ...extras.map(({ id, title }) => `<li><a href="#${id}">${esc(title)}</a></li>`));
  if (related.length) tocItems.push('<li><a href="#related-heading">Related topics</a></li>');
  tocItems.push('<li><a href="#references-heading">References</a></li>');

  const trail = field ? [[field.title, fieldHref(field.id)], [a.title]] : [[a.title]];
  return {
    title: `${a.title} — ${BRAND}`,
    html: `${breadcrumb(trail)}${syntheticBanner(ds)}
<article lang="${esc(a.locale || 'en')}" aria-labelledby="article-title">
<header class="article-head">
<h1 id="article-title">${esc(a.title)}</h1>
${a.aliases.length ? `<p class="aliases">Also known as: ${a.aliases.map(esc).join(', ')}</p>` : ''}
<p class="meta">${statusBadge(a.status)} <span>ID <code>${esc(a.id)}</code></span> <span>Revision <code>${esc(a.revision_id)}</code></span>${a.updated_at ? ` <span>Updated <time datetime="${esc(a.updated_at)}">${esc(a.updated_at)}</time></span>` : ''}</p>
<p class="summary">${esc(a.summary)}</p>
</header>
<nav class="toc" aria-label="On this page"><h2 class="nav-heading">Contents</h2><ol>${tocItems.join('')}</ol></nav>
${sections}
${relatedHtml}
<section aria-labelledby="references-heading"><h2 id="references-heading">References</h2>${refs}</section>
</article>`,
  };
}

function refItem(ds, claim, n, backrefIds) {
  const back = backrefIds.map((id, i) => `<a href="#${id}" aria-label="Back to citation ${n}${backrefIds.length > 1 ? `, use ${i + 1}` : ''}">↩</a>`).join(' ');
  const evidence = claim.evidence.length
    ? `<ul class="evidence">${claim.evidence.map((ev) => {
      const src = ds.sources.get(ev.source_id);
      const url = safeUrl(ev.url) ?? safeUrl(src.url);
      const title = url ? `<a href="${esc(url)}" rel="noopener noreferrer">${esc(src.title)}</a>` : esc(src.title);
      return `<li>${title}${src.publisher ? `, ${esc(src.publisher)}` : ''}${ev.locator ? ` — ${esc(ev.locator)}` : ''}${src.retrieved_at ? ` (retrieved ${esc(src.retrieved_at)})` : ''}</li>`;
    }).join('')}</ul>`
    : '<p class="hint">No source evidence recorded for this claim.</p>';
  return `<li id="cite-${n}"><span class="backrefs">${back}</span> ${esc(claim.statement)} ${badge(claim.kind, CLAIM_KINDS[claim.kind] ?? 'Unclassified claim')} ${statusBadge(claim.status)}${claim.as_of ? ` <span class="hint">as of ${esc(claim.as_of)}</span>` : ''}${evidence}</li>`;
}

export function renderSearch(ds, query) {
  const text = String(query ?? '').slice(0, MAX_QUERY);
  const hits = search(ds, text);
  let body;
  if (!text.trim()) body = '<p class="empty">Enter a term to search article titles, aliases and summaries.</p>';
  else if (!hits.length) body = `<p class="empty" role="status">No results for “${esc(text)}” in the loaded dataset.</p>`;
  else body = `<p role="status">${hits.length} result${hits.length > 1 ? 's' : ''} for “${esc(text)}”.</p><ul class="result-list">${hits.map(resultItem).join('')}</ul>`;
  return {
    title: `Search${text ? `: ${text}` : ''} — ${BRAND}`,
    html: `${breadcrumb([['Search']])}${syntheticBanner(ds)}<h1>Search</h1>${body}`,
  };
}

export function renderNotFound(kind, id) {
  return {
    title: `Not found — ${BRAND}`,
    html: `<h1>Not found</h1><p class="empty">No ${esc(kind)} with ID <code>${esc(id)}</code> exists in the loaded dataset.</p><p><a href="./">Return to the home page</a></p>`,
  };
}

export function renderUnavailable(reason) {
  return {
    title: `Data unavailable — ${BRAND}`,
    html: `<section class="hero"><h1>${BRAND}</h1><p class="tagline">${esc(TAGLINE)}</p></section>
<div class="notice notice-error" role="alert"><h2>Encyclopedia data unavailable</h2><p>${esc(reason)}</p><p>No content is shown rather than guessed. See web/README.md for how to load data.</p></div>`,
  };
}

// Route from URLSearchParams to a page renderer.
export function route(ds, params) {
  if (params.has('article')) return { page: renderArticle(ds, params.get('article')), current: { articleId: params.get('article') } };
  if (params.has('field')) return { page: renderField(ds, params.get('field')), current: { fieldId: params.get('field') } };
  if (params.has('q')) return { page: renderSearch(ds, params.get('q')), current: {} };
  return { page: renderHome(ds), current: {} };
}
