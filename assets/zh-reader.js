import { mountCommunityReferences } from './community-references.js';
// Simplified Chinese reader (web/zh/). Dependency-free, no telemetry.
// The canonical English dataset is fetched from ../data/reader.json and
// validated by the shared data.js adapter; Chinese presentation strings from
// zh-content.js are merged on top at render time. Anything without a matching
// translation is labelled "未翻译" and linked to the English article.
// Every data-derived string goes through esc(); outbound URLs through safeUrl().
import {
  loadDataset, articlesInField, relatedTopics, citationOrder, MAX_QUERY, SCHEMA,
} from './data.js';
import { articleExtras, renderToolDirectory, esc, safeUrl, BRAND } from './render.js';

const TAGLINE = '减少信息噪声，深化知识理解，让知识持续复利。';

// Page-relative: /ENCY4AI/zh/ → /ENCY4AI/data/reader.json; /zh/ → /data/reader.json.
const DATA_URL = '../data/reader.json';
const EN_BASE = '../';

const SUBTITLE_ZH = '人工智能活百科与实用指南';

const STATUS_ZH = {
  verified: '已核实',
  candidate: '未核实候选',
  disputed: '有争议',
  superseded: '已被取代',
  rejected: '已否决',
  synthetic: '合成测试数据',
  published: '已发布',
};

const KIND_ZH = {
  observed_fact: '观察到的事实',
  author_claim: '作者陈述',
  inference: '推断',
  editorial_advice: '编辑建议',
  hypothesis: '归属假说',
};

// [forward, inverse] labels, read from the viewed article's side (see data.js PREDICATES).
const PREDICATE_ZH = {
  is_a: ['属于类型', '具体实例'],
  subclass_of: ['父类', '子类'],
  part_of: ['所属整体', '组成部分'],
  built_on: ['构建基础', '作为基础支撑'],
  evolves_from: ['演化自', '演化为'],
  developed_by: ['开发者', '开发了'],
  supports: ['支持', '受其支持'],
  prerequisite_for: ['作为前提用于', '前提知识'],
  applied_to: ['应用于', '所应用的方法'],
  alternative_to: ['替代方案', '替代方案'],
  evaluated_on: ['评测基准', '评测对象'],
};

// ---------------------------------------------------------------- localizer

function makeLocalizer(content) {
  const c = content && typeof content === 'object' ? content : {};
  const pairs = (list) => new Map((Array.isArray(list) ? list : [])
    .filter((p) => Array.isArray(p) && typeof p[0] === 'string' && typeof p[1] === 'string' && p[1]));
  const byId = (obj) => {
    const m = new Map();
    if (obj && typeof obj === 'object') {
      for (const [id, v] of Object.entries(obj)) {
        if (v && typeof v.en === 'string' && typeof v.zh === 'string' && v.zh) m.set(id, v);
      }
    }
    return m;
  };
  const prose = pairs(c.prose);
  const headings = pairs(c.headings);
  const fields = byId(c.fields);
  const articles = byId(c.articles);
  const pinned = (map, item) => {
    const e = item ? map.get(item.id) : null;
    return e && e.en === item.title ? e : null;
  };
  return {
    loaded: Boolean(content),
    prose: (en) => (typeof en === 'string' && prose.has(en) ? prose.get(en) : null),
    heading: (en) => (typeof en === 'string' && headings.has(en) ? headings.get(en) : null),
    field: (f) => pinned(fields, f)?.zh ?? null,
    article: (a) => pinned(articles, a)?.zh ?? null,
    aliases: (a) => {
      const e = pinned(articles, a);
      return e && Array.isArray(e.aliases) ? e.aliases.filter((s) => typeof s === 'string' && s) : [];
    },
  };
}

let L = makeLocalizer(null);

// ---------------------------------------------------------------- helpers

const s = (v) => (typeof v === 'string' ? v : String(v ?? ''));
const q = (k, v) => `?${k}=${encodeURIComponent(v)}`;
const articleHref = (id) => q('article', id);
const fieldHref = (id) => q('field', id);
const enArticleHref = (id) => `${EN_BASE}${articleHref(id)}`;
const anchor = (prefix, id) => `${prefix}-${String(id).replace(/[^A-Za-z0-9_-]/g, '_')}`;

const badge = (kind, text) => `<span class="badge badge-${esc(kind)}">${esc(text)}</span>`;
const statusBadge = (st) => (st ? badge(st, STATUS_ZH[st] ?? st) : '');
const UNTRANSLATED = badge('untranslated', '未翻译');
const enSpan = (text) => `<span lang="en">${esc(text)}</span>`;

const articleTitleText = (a) => L.article(a) ?? s(a.title);
const articleTitleHtml = (a) => {
  const zh = L.article(a);
  return zh ? esc(zh) : `${enSpan(a.title)} ${UNTRANSLATED}`;
};
const fieldTitleText = (f) => L.field(f) ?? s(f.title);
const fieldTitleHtml = (f) => {
  const zh = L.field(f);
  return zh ? esc(zh) : `${enSpan(f.title)} ${UNTRANSLATED}`;
};

// Placeholder for prose that has no matching translation.
const missingProse = (articleId, what = '此段') => `<span class="hint">［${esc(what)}尚无中文译文］</span>`
  + ` <a href="${esc(enArticleHref(articleId))}" hreflang="en">阅读英文原文</a>`;

const byZhTitle = (x, y) => articleTitleText(x).localeCompare(articleTitleText(y), 'zh-Hans-CN');
const sortedInField = (ds, fieldId) => articlesInField(ds, fieldId).sort(byZhTitle);

function notices(ds) {
  let out = '';
  if (ds?.synthetic) {
    out += `<p class="notice" role="note"><strong>合成测试数据。</strong>${ds.notice ? ` ${enSpan(ds.notice)}` : ''}</p>`;
  }
  if (!L.loaded) {
    out += '<p class="notice" role="note"><strong>中文译文表未能加载。</strong>以下内容均标注为未翻译，并链接到英文原文。</p>';
  }
  return out;
}

function breadcrumb(trail) {
  const parts = ['<li><a href="./">首页</a></li>'];
  trail.forEach(([html, href], i) => {
    const last = i === trail.length - 1;
    parts.push(last
      ? `<li><span aria-current="page">${html}</span></li>`
      : `<li><a href="${esc(href)}">${html}</a></li>`);
  });
  return `<nav class="breadcrumb" aria-label="当前位置"><ol>${parts.join('')}</ol></nav>`;
}

// ---------------------------------------------------------------- pages

export function renderSidebar(ds, current = {}) {
  const items = [...ds.fields.values()].map((f) => {
    const list = sortedInField(ds, f.id);
    const isField = current.fieldId === f.id;
    const sub = list.length
      ? `<ul>${list.map((a) => {
        const cur = current.articleId === a.id ? ' aria-current="page"' : '';
        return `<li><a href="${esc(articleHref(a.id))}"${cur}>${articleTitleHtml(a)}</a></li>`;
      }).join('')}</ul>`
      : '';
    return `<li><a href="${esc(fieldHref(f.id))}"${isField ? ' aria-current="page"' : ''}>${fieldTitleHtml(f)}</a>`
      + ` <span class="count">（${list.length}）</span>${sub}</li>`;
  }).join('');
  return `<h2 id="toc-heading" class="nav-heading">按领域浏览</h2><ul class="tree">${items}</ul>`;
}

function renderHome(ds) {
  const fields = [...ds.fields.values()].map((f) => {
    const n = articlesInField(ds, f.id).length;
    return `<li><a href="${esc(fieldHref(f.id))}">${fieldTitleHtml(f)}</a> <span class="count">${n ? `${n} 篇条目` : '暂无条目'}</span></li>`;
  }).join('');
  return {
    title: `${BRAND} — ${SUBTITLE_ZH}`,
    html: `<section class="hero" aria-labelledby="home-title">
<h1 id="home-title">${BRAND}</h1>
<p class="subtitle">${esc(SUBTITLE_ZH)}</p>
<p class="tagline">${esc(TAGLINE)}</p>
</section>
${notices(ds)}
<p class="status-note">阅读器预览版。标记为“未核实候选”的条目正在等待编辑审核。</p>
<p class="status-note">条目编号、来源、证据位置和审核状态与<a href="${EN_BASE}" hreflang="en">英文版</a>一致。尚未翻译的内容会标注并链接到英文原文。</p>
<section aria-labelledby="fields-heading"><h2 id="fields-heading">入口</h2><ul class="field-list">${fields}</ul></section>`,
  };
}

function resultItem(a) {
  const zhSummary = L.prose(a.summary);
  const summary = zhSummary ? esc(zhSummary) : (a.summary ? missingProse(a.id, '摘要') : '');
  return `<li><a href="${esc(articleHref(a.id))}">${articleTitleHtml(a)}</a><p>${summary}</p></li>`;
}

function renderField(ds, fieldId) {
  const f = ds.fields.get(fieldId);
  if (!f) return renderNotFound('field', fieldId);
  const comparison = renderToolDirectory(ds, fieldId, 'zh');
  const list = sortedInField(ds, fieldId).filter(article => !comparison?.toolIds.includes(article.id));
  const body = list.length
    ? `<ul class="result-list">${list.map(resultItem).join('')}</ul>`
    : comparison ? '' : '<p class="empty">该领域尚无已发布的条目。</p>';
  return {
    title: `${fieldTitleText(f)} — ${BRAND}`,
    html: `${breadcrumb([[fieldTitleHtml(f)]])}${notices(ds)}<h1>${fieldTitleHtml(f)}</h1>${comparison?.html ?? ''}${body}`,
  };
}

function renderArticle(ds, articleId) {
  const a = ds.articles.get(articleId);
  if (!a) return renderNotFound('article', articleId);
  const field = a.field_id ? ds.fields.get(a.field_id) : null;
  const order = citationOrder(ds, a);
  const num = new Map(order.map((cid, i) => [cid, i + 1]));
  const backrefs = new Map();
  let refSeq = 0;
  let missing = L.article(a) ? 0 : 1;
  const cite = (cid) => {
    const n = num.get(cid);
    const refId = `cite-ref-${n}-${++refSeq}`;
    if (!backrefs.has(n)) backrefs.set(n, []);
    backrefs.get(n).push(refId);
    return `<sup class="cite"><a id="${refId}" href="#cite-${n}" aria-label="引用 ${n}">[${n}]</a></sup>`;
  };
  const prose = (text, what) => {
    const zh = L.prose(text);
    if (zh) return esc(zh);
    missing += 1;
    return missingProse(a.id, what);
  };
  const headingHtml = (h) => {
    const zh = L.heading(h);
    if (zh) return esc(zh);
    missing += 1;
    return `${enSpan(h)} ${UNTRANSLATED}`;
  };

  const extras = articleExtras(ds, a.id, 'zh');
  const sectionHeads = new Map(a.sections.map((sec) => [sec.id, headingHtml(sec.heading)]));
  const sections = a.sections.map((sec, i) => {
    const paras = sec.paragraphs.map((p) => `<p>${prose(p.text)}${p.claim_ids.map(cite).join('')}</p>`).join('');
    return `<section aria-labelledby="${anchor('sec', sec.id)}"><h2 id="${anchor('sec', sec.id)}">${sectionHeads.get(sec.id)}</h2>${paras}</section>${i === 0 ? extras.map(extra => extra.html).join('') : ''}`;
  }).join('');

  const related = relatedTopics(ds, a.id);
  const relatedHtml = related.length
    ? `<section aria-labelledby="related-heading"><h2 id="related-heading">相关主题</h2>
<p class="hint">仅列出知识图谱中记录的关系；每个标签说明该主题与<em>${articleTitleHtml(a)}</em>的关系。</p>
<ul class="related">${related.map((r) => {
    const dir = r.edge.subject_id === a.id ? 0 : 1;
    const label = PREDICATE_ZH[r.edge.predicate]?.[dir] ?? r.label;
    const rationale = r.edge.rationale ? `<p>${prose(r.edge.rationale, '关系说明')}</p>` : '';
    return `<li><span class="rel-label">${esc(label)}：</span><a href="${esc(articleHref(r.other.id))}">${articleTitleHtml(r.other)}</a> ${statusBadge(r.edge.status)}${r.edge.claim_id ? cite(r.edge.claim_id) : ''}${rationale}${r.edge.claim_id ? '' : '<p class="hint">此关系未记录支持性引用。</p>'}</li>`;
  }).join('')}</ul></section>`
    : '';

  const refItems = order.map((cid, i) => {
    const claim = ds.claims.get(cid);
    const zh = L.prose(claim.statement);
    if (!zh) missing += 1;
    return refItem(ds, claim, zh, a.id, i + 1, backrefs.get(i + 1) ?? []);
  });
  const refs = order.length
    ? `<ol class="references">${refItems.join('')}</ol>`
    : '<p class="empty">本条目尚无引用，其内容未经核实。</p>';

  const zhSummary = L.prose(a.summary);
  if (a.summary && !zhSummary) missing += 1;
  const summary = zhSummary ? esc(zhSummary) : (a.summary ? missingProse(a.id, '摘要') : '');

  const tocItems = a.sections.map((sec) => `<li><a href="#${anchor('sec', sec.id)}">${sectionHeads.get(sec.id)}</a></li>`);
  tocItems.splice(1, 0, ...extras.map(({ id, title }) => `<li><a href="#${id}">${esc(title)}</a></li>`));
  if (related.length) tocItems.push('<li><a href="#related-heading">相关主题</a></li>');
  tocItems.push('<li><a href="#references-heading">参考文献</a></li>');

  const zhTitle = L.article(a);
  const aliasZh = L.aliases(a);
  const enNames = [s(a.title), ...a.aliases].filter((x) => x && x !== zhTitle);
  const aliasLines = [
    aliasZh.length ? `<p class="aliases">又称：${aliasZh.map(esc).join('、')}</p>` : '',
    zhTitle && enNames.length ? `<p class="aliases">英文名称：${enNames.map(enSpan).join('、')}</p>` : '',
    !zhTitle && a.aliases.length ? `<p class="aliases">英文别名：${a.aliases.map(enSpan).join('、')}</p>` : '',
  ].join('');

  const partial = missing
    ? `<p class="notice" role="note"><strong>译文不完整。</strong>本条目有 ${missing} 处内容尚无中文译文，已在原位置标注。<a href="${esc(enArticleHref(a.id))}" hreflang="en">阅读英文原文</a></p>`
    : '';

  const trail = field
    ? [[fieldTitleHtml(field), fieldHref(field.id)], [articleTitleHtml(a)]]
    : [[articleTitleHtml(a)]];
  return {
    title: `${articleTitleText(a)} — ${BRAND}`,
    html: `${breadcrumb(trail)}${notices(ds)}
<article lang="zh-Hans" aria-labelledby="article-title">
<header class="article-head">
<h1 id="article-title">${articleTitleHtml(a)}</h1>
${aliasLines}
<p class="meta">${statusBadge(a.status)} <span>编号 <code>${esc(a.id)}</code></span> <span>修订版本 <code>${esc(a.revision_id)}</code></span>${a.updated_at ? ` <span>更新于 <time datetime="${esc(a.updated_at)}">${esc(a.updated_at)}</time></span>` : ''} <span><a href="${esc(enArticleHref(a.id))}" hreflang="en">英文原文</a></span></p>
${partial}
<p class="summary">${summary}</p>
</header>
<nav class="toc" aria-label="本页内容"><h2 class="nav-heading">目录</h2><ol>${tocItems.join('')}</ol></nav>
${sections}
${relatedHtml}
<section aria-labelledby="references-heading"><h2 id="references-heading">参考文献</h2>${refs}</section>
</article>`,
  };
}

function refItem(ds, claim, zhStatement, articleId, n, backrefIds) {
  const back = backrefIds.map((id, i) => `<a href="#${id}" aria-label="返回引用 ${n}${backrefIds.length > 1 ? `（第 ${i + 1} 处）` : ''}">↩</a>`).join(' ');
  const evidence = claim.evidence.length
    ? `<ul class="evidence">${claim.evidence.map((ev) => {
      const src = ds.sources.get(ev.source_id);
      const url = safeUrl(ev.url) ?? safeUrl(src.url);
      const title = url
        ? `<a href="${esc(url)}" rel="noopener noreferrer" lang="en" hreflang="en">${esc(src.title)}</a>`
        : enSpan(src.title);
      return `<li>${title}${src.publisher ? `，${enSpan(src.publisher)}` : ''}${ev.locator ? ` — 位置：${enSpan(ev.locator)}` : ''}${src.retrieved_at ? `（检索于 ${esc(src.retrieved_at)}）` : ''}</li>`;
    }).join('')}</ul>`
    : '<p class="hint">此主张未记录来源证据。</p>';
  const statement = zhStatement ? esc(zhStatement) : missingProse(articleId, '此主张');
  return `<li id="cite-${n}"><span class="backrefs">${back}</span> ${statement} ${badge(claim.kind, KIND_ZH[claim.kind] ?? '未分类主张')} ${statusBadge(claim.status)}${claim.as_of ? ` <span class="hint">截至 ${esc(claim.as_of)}</span>` : ''}${evidence}</li>`;
}

// Matches Chinese titles/aliases/summaries plus the original English title,
// aliases and summary, so English names keep working as search terms.
function zhSearch(ds, query) {
  const terms = s(query).slice(0, MAX_QUERY).toLowerCase().split(/\s+/).filter(Boolean);
  if (!terms.length) return [];
  const hits = [];
  for (const a of ds.articles.values()) {
    const titles = [L.article(a), a.title].filter((x) => typeof x === 'string' && x).map((x) => x.toLowerCase());
    const hay = [...titles, ...L.aliases(a), ...a.aliases, L.prose(a.summary), a.summary]
      .filter((x) => typeof x === 'string' && x).map((x) => x.toLowerCase()).join('\n');
    if (!terms.every((t) => hay.includes(t))) continue;
    const score = terms.filter((t) => titles.some((x) => x.includes(t))).length;
    hits.push({ article: a, score });
  }
  hits.sort((x, y) => y.score - x.score || byZhTitle(x.article, y.article));
  return hits.map((h) => h.article);
}

function renderSearch(ds, query) {
  const text = s(query).slice(0, MAX_QUERY);
  const hits = zhSearch(ds, text);
  let body;
  if (!text.trim()) body = '<p class="empty">请输入关键词，以搜索条目标题（含英文原名）、别名和摘要。</p>';
  else if (!hits.length) body = `<p class="empty" role="status">在已加载的数据集中未找到与“${esc(text)}”相关的结果。</p>`;
  else body = `<p role="status">找到 ${hits.length} 条与“${esc(text)}”相关的结果。</p><ul class="result-list">${hits.map(resultItem).join('')}</ul>`;
  return {
    title: `搜索${text ? `：${text}` : ''} — ${BRAND}`,
    html: `${breadcrumb([['搜索']])}${notices(ds)}<h1>搜索</h1>${body}`,
  };
}

function renderNotFound(kind, id) {
  const what = kind === 'field' ? '领域' : '条目';
  return {
    title: `未找到 — ${BRAND}`,
    html: `<h1>未找到</h1><p class="empty">已加载的数据集中不存在编号为 <code>${esc(id)}</code> 的${what}。</p><p><a href="./">返回首页</a></p>`,
  };
}

function renderUnavailable(reason) {
  return {
    title: `数据不可用 — ${BRAND}`,
    html: `<section class="hero"><h1>${BRAND}</h1><p class="tagline">${esc(TAGLINE)}</p></section>
<div class="notice notice-error" role="alert"><h2>百科数据不可用</h2><p>${esc(reason)}</p><p>为避免猜测，此处不显示任何内容。有关加载数据的方法，请参阅 web/README.md。</p></div>`,
  };
}

function route(ds, params) {
  if (params.has('article')) return { page: renderArticle(ds, params.get('article')), current: { articleId: params.get('article') } };
  if (params.has('field')) return { page: renderField(ds, params.get('field')), current: { fieldId: params.get('field') } };
  if (params.has('q')) return { page: renderSearch(ds, params.get('q')), current: {} };
  return { page: renderHome(ds), current: {} };
}

// ---------------------------------------------------------------- browser

// loadDataset() reasons are English; map the known ones to Chinese.
function zhReason(reason) {
  const r = s(reason);
  if (r === 'Dataset is not a JSON object.') return '数据集不是 JSON 对象。';
  if (r.startsWith('Unsupported dataset schema')) return `不支持的数据集模式（应为 ${SCHEMA}）。`;
  if (r === 'Dataset is missing fields or articles.') return '数据集缺少领域或条目列表。';
  return '数据集无效。';
}

async function fetchDataset() {
  try {
    const res = await fetch(DATA_URL, { headers: { Accept: 'application/json' } });
    if (!res.ok) return { ok: false, reason: `无法加载数据集（HTTP ${res.status}）。` };
    const result = loadDataset(await res.json());
    return result.ok ? result : { ok: false, reason: zhReason(result.reason) };
  } catch {
    return { ok: false, reason: '无法加载数据集，或数据集不是有效的 JSON。' };
  }
}

async function loadTranslations() {
  try {
    const mod = await import('./zh-content.js');
    return makeLocalizer(mod.ZH_CONTENT);
  } catch {
    return makeLocalizer(null);
  }
}

// Point the English language link at the matching English page.
function syncEnglishLink(link, params) {
  if (!link) return;
  for (const key of ['article', 'field', 'q']) {
    if (params.has(key)) {
      link.setAttribute('href', `${EN_BASE}${q(key, params.get(key))}`);
      return;
    }
  }
}

function setupNavToggle() {
  const btn = document.querySelector('.nav-toggle');
  const nav = document.getElementById('site-nav');
  const narrow = window.matchMedia('(max-width: 48rem)');
  const apply = () => {
    btn.hidden = !narrow.matches;
    const open = !narrow.matches || btn.getAttribute('aria-expanded') === 'true';
    nav.hidden = !open;
  };
  btn.setAttribute('aria-expanded', 'false');
  btn.addEventListener('click', () => {
    btn.setAttribute('aria-expanded', String(btn.getAttribute('aria-expanded') !== 'true'));
    apply();
  });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && narrow.matches && btn.getAttribute('aria-expanded') === 'true') {
      btn.setAttribute('aria-expanded', 'false');
      apply();
      btn.focus();
    }
  });
  narrow.addEventListener('change', apply);
  apply();
}

async function main() {
  const params = new URLSearchParams(window.location.search);
  const input = document.getElementById('search-input');
  if (params.has('q')) input.value = params.get('q');
  const englishLink = document.getElementById('lang-en');
  syncEnglishLink(englishLink, params);
  const nav = document.getElementById('site-nav');
  const mainEl = document.getElementById('main');
  const [localizer, result] = await Promise.all([loadTranslations(), fetchDataset()]);
  L = localizer;
  let page;
  if (result.ok) {
    if (result.warnings.length) console.warn('ENCY4AI dataset warnings:', result.warnings);
    try {
      const r = route(result.ds, params);
      page = r.page;
      nav.innerHTML = renderSidebar(result.ds, r.current);
    } catch {
      page = renderUnavailable('页面渲染失败。');
      nav.innerHTML = '<h2 id="toc-heading" class="nav-heading">按领域浏览</h2><p class="empty">不可用。</p>';
    }
  } else {
    page = renderUnavailable(result.reason);
    nav.innerHTML = '<h2 id="toc-heading" class="nav-heading">按领域浏览</h2><p class="empty">不可用。</p>';
  }
  document.title = page.title;
  mainEl.innerHTML = page.html;
  mountCommunityReferences(mainEl, params);
  setupNavToggle();
  const comparison = mainEl.querySelector('.tool-comparison');
  if (comparison) {
    const highlightRow = () => {
      const targetId = window.location.hash.slice(1);
      for (const row of comparison.tBodies[0].rows) {
        row.classList.toggle('is-comparison-target', row.id === targetId);
      }
      if (englishLink) {
        const target = new URL(englishLink.href);
        target.hash = comparison.querySelector('tr.is-comparison-target')?.id ?? '';
        englishLink.href = target.href;
      }
    };
    highlightRow();
    window.addEventListener('hashchange', highlightRow);
  }

  const fragment = window.location.hash.slice(1);
  if (fragment === 'practice' || fragment.startsWith('compare-tool_')) {
    document.getElementById(fragment)?.scrollIntoView();
  }
}

main();
