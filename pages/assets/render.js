// Pure HTML renderers. Every dataset string goes through esc(); URLs through safeUrl().
import {
  articlesInField, relatedTopics, citationOrder, search,
  CLAIM_KINDS, STATUSES, MAX_QUERY,
} from './data.js';
import { ARTICLE_FIGURES, TOOL_COMPARISON } from './article-figures.js';
import { COMPARISON_INTRO, GUIDE_SOURCE_LABELS, TOOL_GUIDES } from './tool-guides.js';
import { BROWSER_MEDIA_GUIDE, BROWSER_MEDIA_GUIDE_ID } from './browser-media-guide.js';

const BROWSER_MEDIA_TERMS = ['tool:google-antigravity', 'tool:google-flow', 'tool:tripo3d', 'concept:batch-generation'];

export const BRAND = 'AIwiki';
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
const toolComparisonAnchor = (id) => anchor('compare', id);

const badge = (kind, text) => `<span class="badge badge-${esc(kind)}">${esc(text)}</span>`;
const statusBadge = (s) => (s ? badge(s, STATUSES[s] ?? s) : '');

export function syntheticBanner(ds) {
  if (!ds?.synthetic) return '';
  return `<p class="notice" role="note"><strong>Synthetic fixture data.</strong> ${esc(ds.notice)}</p>`;
}

const TOOL_GROUPS = [
  ['agent-collaboration', 'Agent collaboration and orchestration', 'Agent 协作与编排',
    ['aionui', 'antigravity-swarm', 'codeg', 'multica', 'pigbun-partner']],
  ['development-workspaces', 'Development workspaces and clients', '开发工作台与客户端',
    ['cindy', 'google-antigravity', 'herdr', 'orca', 't3-code']],
  ['agent-skills', 'Agent skills and instructions', 'Agent 技能与工作规范',
    ['andrej-karpathy-skills', 'skillpay', 'youmind-skills', 'alipay-skillpay', 'tencent-skillhub-skillpay']],
  ['model-routing', 'Model gateways and routing', '模型接入与路由', ['magpie']],
  ['media-generation', 'Video and 3D creation', '视频与 3D 创作', ['google-flow', 'tripo3d']],
];

export function toolGroups(articles, locale) {
  const remaining = new Map(articles.map(article => [article.id, article]));
  const groups = [];
  for (const [id, en, zh, slugs] of TOOL_GROUPS) {
    const members = articles.filter(article => slugs.some(slug => article.id === `tool:${slug}`));
    if (!members.length) continue;
    for (const member of members) remaining.delete(member.id);
    groups.push({ id, title: locale === 'zh' ? zh : en, articles: members });
  }
  if (remaining.size) {
    groups.push({ id: 'other-tools', title: locale === 'zh' ? '其他工具' : 'Other tools',
      articles: [...remaining.values()] });
  }
  return groups;
}

export function renderSidebarArticles(articles, fieldId, locale, current, titleHtml) {
  const link = article => {
    const currentPage = current.articleId === article.id && (!article.field_id || article.field_id === fieldId)
      ? ' aria-current="page"' : '';
    return `<li><a href="${esc(articleHref(article.id))}"${currentPage}>${titleHtml(article)}</a></li>`;
  };
  if (!articles.length) return '';
  if (fieldId !== 'field:tools') return `<ul>${articles.map(link).join('')}</ul>`;
  return `<ul class="tool-nav-groups">${toolGroups(articles, locale).map(group => {
    const labelId = `tool-nav-${group.id}`;
    return `<li><span id="${labelId}" class="tool-nav-label">${esc(group.title)}</span>
<ul aria-labelledby="${labelId}">${group.articles.map(link).join('')}</ul></li>`;
  }).join('')}</ul>`;
}

const SKILL_COMPARISON_ID = 'compare-skill-marketplaces';
const SKILL_PRODUCTS = [
  ['tool:youmind-skills', 'source:youmind-skills-workflow',
    ['Install a reusable workflow in YouMind. A paid skill is priced in credits at installation.', 'Run the workflow with your own materials, for example to review this week’s draft. Check task usage separately.'],
    ['在 YouMind 里安装可复用的工作流。付费技能在安装时按积分定价。', '用自己的材料运行，比如审阅本周的稿件。任务消耗的积分另看用量。']],
  ['tool:alipay-skillpay', 'source:skillpay-alipay-faq',
    ['Confirm a purchase through Alipay AI Pay. Choose a one-time purchase or access for a fixed period where offered.', 'Receive the skill ZIP or use the skill during the paid term.'],
    ['用支付宝 AI 付确认购买。按商品上架的选项，一次性购买或按周期付费。', '取得技能 ZIP 文件，或在付费周期内使用技能。']],
  ['tool:tencent-skillhub-skillpay', 'source:skillpay-skillhub',
    ['An agent invokes a listed service. Each paid invocation is a billing event.', 'Get the result of that service call, such as a generated video.'],
    ['由智能体调用上架的服务。付费服务按调用次数计费。', '拿到本次服务的结果，例如生成的一段视频。']],
];

function renderSkillComparison(ds, locale, titleHtml) {
  if (!ds || ds.synthetic || !SKILL_PRODUCTS.every(([id]) => ds.articles.has(id))) return '';
  const zh = locale === 'zh';
  const title = zh ? '对比技能市场与付费平台' : 'Compare skill marketplaces and paid platforms';
  const intro = zh
    ? '先看哪一步会收费，再看你到手的是工作流、技能文件或限期使用权，还是一次调用的结果。'
    : 'Start with the event that triggers payment. Then check whether you receive a workflow, a skill file, access for a term, or the result of a service call.';
  const labels = zh ? ['工具', '如何计费', '用户获得什么'] : ['Tool', 'When you pay', 'What you receive'];
  const headers = labels.map(label => `<th scope="col">${esc(label)}</th>`).join('');
  const rows = SKILL_PRODUCTS.map(([id, sourceId, en, cn]) => {
    const name = titleHtml(ds.articles.get(id));
    const source = ds.sources.get(sourceId);
    const official = source ? `<br><a class="hint" href="${esc(source)}" rel="noreferrer">${zh ? '官方说明' : 'Official documentation'}</a>` : '';
    const cells = (zh ? cn : en).map(text => `<td>${esc(text)}</td>`).join('');
    return `<tr><th scope="row"><a href="${articleHref(id)}">${name}</a>${official}</th>${cells}</tr>`;
  }).join('');
  return `<h3 id="${SKILL_COMPARISON_ID}">${esc(title)}</h3><p>${esc(intro)}</p>
<div class="tool-comparison-scroll" role="region" aria-labelledby="${SKILL_COMPARISON_ID}" tabindex="0">
<table class="tool-comparison" aria-labelledby="${SKILL_COMPARISON_ID}"><thead><tr>${headers}</tr></thead><tbody>${rows}</tbody></table>
</div>`;
}

export function renderToolGroups(articles, locale, renderItem, ds, titleHtml = article => esc(article.title)) {
  const overview = ds?.articles.get('concept:agent-collaboration-architectures');
  return toolGroups(articles, locale).map(group => {
    const entries = group.id === 'agent-collaboration' && overview
      ? [overview, ...group.articles]
      : group.articles;
    const comparison = group.id === 'agent-skills' ? renderSkillComparison(ds, locale, titleHtml) : '';
    return section(group.id, group.title, `${comparison}<ul class="result-list">${entries.map(renderItem).join('')}</ul>`).html;
  }).join('');
}

export function renderSidebar(ds, current = {}) {
  const items = [...ds.fields.values()].map((f) => {
    const list = articlesInField(ds, f.id);
    const isField = current.fieldId === f.id;
    const sub = renderSidebarArticles(list, f.id, 'en', current, a => esc(a.title));
    return `<li><a href="${esc(fieldHref(f.id))}"${isField ? ' aria-current="page"' : ''}>${esc(f.title)}</a>`
      + ` <span class="count">(${list.length})</span>${sub}</li>`;
  }).join('');
  return `<h2 id="toc-heading" class="nav-heading">Browse by field</h2><ul class="tree">${items}<li class="appendix-nav"><a href="references.html">Appendix: Community references</a></li></ul>`;
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
  const comparison = renderToolDirectory(ds, fieldId);
  const list = articlesInField(ds, fieldId);
  const body = list.length
    ? fieldId === 'field:tools' ? renderToolGroups(list, 'en', resultItem, ds)
      : `<ul class="result-list">${list.map(resultItem).join('')}</ul>`
    : comparison ? '' : '<p class="empty">No published articles in this field yet.</p>';
  return {
    title: `${f.title} — ${BRAND}`,
    html: `${breadcrumb([[f.title]])}${syntheticBanner(ds)}<h1>${esc(f.title)}</h1>${body}${comparison?.html ?? ''}${renderFieldReferences(ds, f)}`,
  };
}

export function renderFieldReferences(ds, field, locale = 'en', titleHtml = article => esc(article.title)) {
  const ids = field.related_article_ids;
  if (!Array.isArray(ids)) return '';
  const links = [...new Set(ids)].map(id => ds.articles.get(id))
    .filter(article => article && article.field_id !== field.id)
    .map(article => `<li><a href="${esc(articleHref(article.id))}">${titleHtml(article)}</a></li>`);
  if (!links.length) return '';
  const heading = locale === 'zh' ? '相关工具与指南' : 'Related tools and guides';
  return section('field-references', heading, `<ul class="related">${links.join('')}</ul>`).html;
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

function renderFigureContent(figure, locale) {
  const [, credit, alt, instructions] = figure[locale];
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
  return `${visual}<ol class="figure-steps">${steps}</ol>${guide}`;
}

function renderFigure(figure, locale) {
  return section(figure.id, figure[locale][0], renderFigureContent(figure, locale));
}

function section(id, title, body) {
  return { id, title, html: `<section aria-labelledby="${id}"><h2 id="${id}">${esc(title)}</h2>${body}</section>` };
}

function availableTools(ds) {
  return ds.synthetic ? [] : TOOL_COMPARISON.filter(([id]) => ds.articles.get(id)?.field_id === 'field:tools');
}

export function renderToolDirectory(ds, fieldId, locale = 'en') {
  if (fieldId !== 'field:tools') return null;
  const tools = availableTools(ds);
  if (tools.length < 2) return null;
  const zh = locale === 'zh';
  const title = zh ? '对比多智能体协作工具' : 'Compare agent collaboration tools';
  const labels = zh ? ['工具', '适用场景', '工作方式', '如何跟进'] : ['Tool', 'When to use it', 'How it works', 'Where to follow progress'];
  const support = zh ? '官方说明' : 'Official documentation';
  const headers = labels.map(label => `<th scope="col">${esc(label)}</th>`).join('');
  const rows = tools.map(([id, source, en, cn]) => {
    const name = esc(ds.articles.get(id).title);
    const practiceLabel = TOOL_GUIDES.get(id)?.example?.[locale]?.comparisonLabel;
    const practiceLink = practiceLabel
      ? `<br><a href="${articleHref(id)}#practice" aria-label="${esc(practiceLabel)} (${name})">${esc(practiceLabel)}</a>`
      : '';
    const cells = (zh ? cn : en).map(text => `<td>${esc(text)}</td>`).join('');
    return `<tr id="${toolComparisonAnchor(id)}"><th scope="row"><a href="${articleHref(id)}">${name}</a><br>
<a class="hint" href="${esc(source)}" rel="noreferrer" aria-label="${support} (${name})">${support}</a>${practiceLink}</th>${cells}</tr>`;
  }).join('');
  const intro = COMPARISON_INTRO[locale].map(text => `<p>${esc(text)}</p>`).join('');
  const page = section('compare-tools', title, `${intro}
<div class="tool-comparison-scroll" role="region" aria-labelledby="compare-tools" tabindex="0">
<table class="tool-comparison" aria-labelledby="compare-tools"><thead><tr>${headers}</tr></thead><tbody>${rows}</tbody></table>
</div>`);
  return page;
}

function guideSources(sources, zh) {
  const links = sources.map(url =>
    `<a href="${esc(url)}" rel="noreferrer">${esc(GUIDE_SOURCE_LABELS.get(url)[zh ? 1 : 0])}</a>`
  ).join(' · ');
  return `<p class="hint">${links}</p>`;
}

function renderBrowserMediaGuide(locale) {
  const zh = locale === 'zh';
  const labels = zh
    ? { agent: '可交给智能体', required: '系统要求人工确认', review: '本指南建议人工复核' }
    : { agent: 'Agent can prepare', required: 'Product requires human confirmation', review: 'Human review recommended' };
  return BROWSER_MEDIA_GUIDE.map(route => {
    const { title, intro, steps, prompt } = route[locale];
    const figure = renderFigureContent(ARTICLE_FIGURES.get(route.figureId), locale);
    const list = steps.map(([mode, label, instruction]) =>
      `<li><strong>${esc(label)}</strong> <span class="badge guide-step-${mode}">${labels[mode]}</span><p>${esc(instruction)}</p></li>`
    ).join('');
    const example = prompt
      ? `<h3>${zh ? '可复制的 Antigravity 指令' : 'Prompt to copy into Antigravity'}</h3><pre class="guide-prompt">${esc(prompt)}</pre>`
      : '';
    const links = route.sources.map(([url, en, cn]) =>
      `<a href="${esc(url)}" rel="noreferrer">${esc(zh ? cn : en)}</a>`
    ).join(' · ');
    const comment = route.id === 'browser-setup'
      ? `<p class="hint"><a href="references.html#reference-browser-batch-media">${zh ? '这篇指南源于一条微信网友评论' : 'Read the community comment that suggested this workflow'}</a></p>`
      : '';
    return section(route.id, title, `<p>${esc(intro)}</p>${comment}${figure}<ol class="guide-steps">${list}</ol>${example}<p class="hint">${links}</p>`);
  });
}

const ARCHITECTURE_COMPARISON = [
  [["multica"], 'multica-execution',
    ["Issue blockers gate starts and reject cycles.","Communication graph unverified.","Workflow review can send work back for revision."],
    ["工单依赖会阻止下游启动，并禁止循环依赖。","通信图未核实。","工作流可将未通过审查的任务退回返工。"]],
  [["antigravity-swarm"], 'swarm-communication',
    ["The coordinator delegates to parallel workers. An explicit dependency graph is unverified.","The Graph tab shows who mentioned whom. Edge weights count posts.","The verifier reports problems to the worker responsible for the fix."],
    ["协调者向并行 Worker 派活。显式任务依赖图未核实。","Graph 标签页显示谁提及了谁，边权重按帖数计算。","Verifier 把问题反馈给负责修正的 Worker。"]],
  [["aionui"], 'aionui-dependencies',
    ["The board displays blocker links. Scheduler enforcement is unverified.","The leader delegates work and collects results.","A review and rework loop is unverified."],
    ["看板显示阻塞关系。调度器是否强制遵守这些关系尚未核实。","Leader 派活并收集结果。","审查与返工循环未核实。"]],
  [["codeg","cindy","t3-code"], 'delegation',
    ["The documented pattern is lead-to-worker delegation. Dependency scheduling is unverified.","Codeg returns worker results to the lead. Cindy has independent worker sessions. T3 Code shows child threads.","Cindy supports lead review of worker results. Automatic rework is unverified."],
    ["公开资料展示主 Agent 向 Worker 委派。依赖调度未核实。","Codeg 将结果交回 Lead，Cindy 使用独立 Worker 会话，T3 Code 可查看子线程。","Cindy 的 Lead 可以验收结果。自动返工规则未核实。"]],
  [["pigbun-partner"], 'pigbun-workstreams',
    ["Workstreams keep running. The internal scheduling model is unconfirmed.","Workstreams retain context. An inter-agent message graph is unverified.","The workstream asks the user to intervene for a decision or approval."],
    ["工作流持续推进，内部调度模型尚无法确认。","工作流保留上下文。Agent 间的消息图未核实。","需要决定或批准时，工作流会请用户介入。"]],
  [["orca","herdr","magpie"], 'tooling',
    ["Orca isolates attempts in worktrees, Herdr manages terminal sessions, and Magpie routes model requests.","The cited features cover session status and request routing. An inter-agent message graph is unverified.","Orca's guide shows a person comparing independent attempts. Automated rework is unverified."],
    ["Orca 用工作树隔离尝试，Herdr 管理终端会话，Magpie 路由模型请求。","所引功能涉及会话状态和请求路由。Agent 间的消息图未核实。","Orca 的指南展示由人比较独立尝试的结果。自动返工未核实。"]],
];

export const ARCHITECTURE_DIAGRAM_ID = 'architecture-diagram';

function renderArchitectureDiagram(articleId, locale, cite) {
  const zh = locale === 'zh';
  const id = ARCHITECTURE_DIAGRAM_ID;
  const title = zh ? '并行开发中的三种关系' : 'Three views of the same parallel development task';
  const label = (x, y, text, classes = 'diagram-label', align = 'middle') =>
    `<text x="${x}" y="${y}" text-anchor="${align}" class="${classes}">${esc(text)}</text>`;
  const node = (x, y, width, height, name, detail) => {
    const center = x + width / 2;
    const nameY = y + (detail ? 20 : height / 2 + 5);
    return `<rect x="${x}" y="${y}" width="${width}" height="${height}" rx="6"/>
${label(center, nameY, name, 'diagram-name')}${detail ? label(center, y + 38, detail) : ''}`;
  };
  const panel = (key, heading, description, draw) => {
    const marker = `${id}-${key}-arrow`;
    const edge = (path, arrow = true, type = '') =>
      `<path class="diagram-edge ${type}" d="${path}"${arrow ? ` marker-end="url(#${marker})"` : ''} />`;
    return `<div class="architecture-diagram-panel"><div><h3>${esc(heading)}</h3><p>${esc(description)}</p></div>
<svg viewBox="0 0 300 188" aria-hidden="true" focusable="false">
<defs><marker id="${marker}" viewBox="0 0 8 8" refX="7" refY="4" markerWidth="8" markerHeight="8" markerUnits="userSpaceOnUse" orient="auto"><path class="diagram-arrowhead" d="M0 0 L8 4 L0 8 Z"/></marker></defs>
${draw(edge)}</svg></div>`;
  };
  const workerA = 'Worker A';
  const workerB = 'Worker B';
  const date = zh ? '日期校验' : 'Validate dates';
  const amount = zh ? '金额校验' : 'Validate amounts';
  const reviewer = zh ? '审查者' : 'Reviewer';
  const dependency = panel('dependencies', zh ? '任务依赖' : 'Task dependencies',
    zh ? 'A 和 B 并行开发。两项改动都完成后，审查才开始。' : 'A and B work in parallel. Review starts once both changes are ready.',
    edge => [
      edge('M76 60 V82 H150', false), edge('M224 60 V82 H150', false), edge('M150 82 V120'),
      node(12, 12, 128, 48, workerA, date), node(160, 12, 128, 48, workerB, amount),
      node(84, 122, 132, 48, reviewer, zh ? '开始审查' : 'Start review'),
      label(158, 104, zh ? '两项完成' : 'Both ready', 'diagram-label', 'start'),
    ].join(''));
  const messages = panel('messages', zh ? 'Agent 间的消息' : 'Agent messages',
    zh ? 'A 向 B 询问测试样例，B 发回样例。箭头从发送者指向接收者。' : 'A asks B for a test fixture, and B shares it. Each arrow runs from sender to recipient.',
    edge => [
      edge('M76 65 V45 H224 V65', true, 'diagram-message'),
      edge('M224 113 V139 H76 V113', true, 'diagram-message'),
      node(12, 65, 128, 48, workerA, date), node(160, 65, 128, 48, workerB, amount),
      label(150, 34, zh ? '询问测试样例' : 'Ask for test fixture'),
      label(150, 159, zh ? '发回测试样例' : 'Share test fixture'),
    ].join(''));
  const rework = panel('rework', zh ? '审查与返工' : 'Review and rework',
    zh ? '日期测试失败后，审查者把改动退回 A。A 修正并重新提交，复查通过后流程结束。' : 'A failed date test sends the change back to A. A fixes and resubmits it. A passing rerun ends the cycle.',
    edge => [
      edge('M76 65 V45 H224 V65'), edge('M224 113 V137 H76 V113'), edge('M268 113 V153'),
      node(12, 65, 128, 48, workerA, zh ? '修正日期校验' : 'Fix date check'),
      node(160, 65, 128, 48, reviewer, zh ? '运行测试' : 'Run tests'),
      node(230, 155, 60, 29, zh ? '结束' : 'Done'),
      label(150, 34, zh ? '重新提交' : 'Resubmit fix'),
      label(146, 157, zh ? '测试失败，退回修正' : 'Test fails: revise'),
      label(262, 151, zh ? '通过' : 'Pass', 'diagram-label', 'end'),
    ].join(''));
  const caption = zh
    ? '示意案例中，两名 Worker 分别实现日期和金额校验。'
    : 'In this example, two workers implement date and amount validation.';
  return section(id, title, `<figure class="article-figure architecture-diagram">${dependency}${messages}${rework}
<figcaption>${esc(caption)}${cite('claim:collaboration-three-mechanisms')} · <a href="${articleHref(articleId)}#${id}">${zh ? '示意图链接' : 'Link to this diagram'}</a></figcaption></figure>`);
}

function renderArchitectureComparison(ds, article, locale, titleHtml, cite) {
  const zh = locale === 'zh';
  const id = 'architecture-comparison';
  const title = zh ? '工具协作机制对比' : 'Compare tool collaboration mechanisms';
  const headers = (zh ? ['工具', '执行图', '通信图', '反馈循环']
    : ['Tool', 'Execution graph', 'Communication graph', 'Feedback loop'])
    .map(label => `<th scope="col">${esc(label)}</th>`).join('');
  const rows = ARCHITECTURE_COMPARISON.map(([slugs, claim, en, cn]) => {
    const tools = slugs.map(slug => `tool:${slug}`).filter(toolId => article.related_tool_ids.includes(toolId));
    if (!tools.length) return '';
    const names = tools.map(toolId =>
      `<a href="${articleHref(toolId)}">${titleHtml(ds.articles.get(toolId))}</a>`
    ).join('<br>');
    const cells = (zh ? cn : en).map(text => `<td>${esc(text)}</td>`).join('');
    return `<tr><th scope="row">${names}${cite(`claim:collaboration-${claim}`)}</th>${cells}</tr>`;
  }).join('');
  return section(id, title, `<div class="tool-comparison-scroll" role="region" aria-labelledby="${id}" tabindex="0">
<table class="tool-comparison" aria-labelledby="${id}"><thead><tr>${headers}</tr></thead><tbody>${rows}</tbody></table>
</div>`);
}

export function articleExtras(ds, currentId, locale = 'en', titleHtml = article => esc(article.title), cite = () => '') {
  if (ds.synthetic) return [];
  const extras = [];
  const zh = locale === 'zh';
  if (currentId === BROWSER_MEDIA_GUIDE_ID) return renderBrowserMediaGuide(locale);
  const skillArticles = [...SKILL_PRODUCTS.map(([id]) => id), 'tool:skillpay'];
  if (skillArticles.includes(currentId)) {
    const peers = skillArticles.filter(id => id !== currentId && ds.articles.has(id)).map(id =>
      `<li><a href="${articleHref(id)}">${titleHtml(ds.articles.get(id))}</a></li>`
    ).join('');
    const compare = SKILL_PRODUCTS.every(([id]) => ds.articles.has(id))
      ? `<p><a href="${fieldHref('field:tools')}#${SKILL_COMPARISON_ID}">${zh ? '查看三种付费方式的对照' : 'Compare the three payment models'}</a></p>`
      : '';
    if (peers) extras.push(section('skill-marketplaces', zh ? '相关技能市场与付费平台' : 'Related skill marketplaces and paid platforms',
      `${compare}<ul class="related">${peers}</ul>`));
  }
  const currentArticle = ds.articles.get(currentId);
  const relatedTools = currentArticle?.related_tool_ids ?? [];
  if (currentId === 'concept:agent-collaboration-architectures' && relatedTools.length) {
    extras.push(renderArchitectureDiagram(currentId, locale, cite), renderArchitectureComparison(ds, currentArticle, locale, titleHtml, cite));
  }
  if (relatedTools.length) {
    const links = relatedTools.map(id =>
      `<li><a href="${articleHref(id)}">${esc(ds.articles.get(id).title)}</a></li>`
    ).join('');
    extras.push(section('related-tools', zh ? '相关工具条目' : 'Related tool articles', `<ul class="related">${links}</ul>`));
  }
  if (ds.articles.get(currentId)?.field_id === 'field:tools') {
    const relatedArticles = [...ds.articles.values()].filter(article => article.related_tool_ids?.includes(currentId));
    if (relatedArticles.length) {
      const links = relatedArticles.map(article =>
        `<li><a href="${articleHref(article.id)}">${titleHtml(article)}</a></li>`
      ).join('');
      extras.push(section('related-articles', zh ? '相关词条' : 'Related articles', `<ul class="related">${links}</ul>`));
    }
  }
  const guide = TOOL_GUIDES.get(currentId);
  if (guide) {
    for (const [id, title] of [
      ['origin', zh ? '起源与开发者' : 'Origins and developers'],
      ['features', zh ? '功能怎么用' : 'How the features work'],
    ]) {
      const content = guide[id];
      if (!content) continue;
      const paragraphs = content[locale].map(text => `<p>${esc(text)}</p>`).join('');
      extras.push(section(id, title, paragraphs + guideSources(content.sources, zh)));
    }
  }
  const figure = ARTICLE_FIGURES.get(currentId);
  if (figure) extras.push(renderFigure(figure, locale));
  if (guide?.subscriptions) {
    const title = zh ? '使用现有订阅接入 Gemini、GPT 和 Claude' : 'Use existing Gemini, GPT, and Claude subscriptions';
    const paragraphs = guide.subscriptions.map(entry =>
      `<p>${esc(entry[locale])}</p>${guideSources(entry.sources, zh)}`
    ).join('');
    extras.push(section('subscriptions', title, paragraphs));
  }
  if (BROWSER_MEDIA_TERMS.includes(currentId)) {
    const peers = BROWSER_MEDIA_TERMS.filter(id => id !== currentId && ds.articles.has(id)).map(id => {
      const name = zh && id === 'concept:batch-generation' ? '批量生成' : ds.articles.get(id).title;
      return `<a href="${articleHref(id)}">${esc(name)}</a>`;
    }).join(' · ');
    const label = zh ? '查看微信网友原话' : 'Read the community example';
    const description = zh
      ? '这条评论把浏览器代操作与两个生成工具放进同一个工作流。组合流程尚未实测。'
      : 'The comment describes a browser agent operating two generation tools. The combined workflow has not been tested.';
    const practice = ds.articles.has(BROWSER_MEDIA_GUIDE_ID)
      ? `<p><a href="${articleHref(BROWSER_MEDIA_GUIDE_ID)}">${zh ? '阅读批量生成实操指南' : 'Read the batch generation walkthrough'}</a></p>`
      : '';
    extras.push(section('community-use-case', zh ? '网友举例' : 'Community example',
      `<p>${description} <a href="references.html#reference-browser-batch-media">${label}</a></p><p>${peers}</p>${practice}`));
  }
  const tools = availableTools(ds);
  const listedInComparison = tools.length > 1 && tools.some(([id]) => id === currentId);
  if (guide) {
    const { title, setup, steps, comparisonLabel } = guide.example[locale];
    const task = zh ? '这是根据官方文档设计的练习，尚未在应用里实跑。' : 'This practice exercise follows the official documentation and has yet to be run in the app.';
    const stepsHtml = steps.map(text => `<li>${esc(text)}</li>`).join('');
    const backLabel = zh ? '返回工具对照' : 'Back to tool comparison';
    const backLink = comparisonLabel && listedInComparison
      ? `<p><a href="${fieldHref('field:tools')}#${toolComparisonAnchor(currentId)}">${backLabel}</a></p>`
      : '';
    extras.push(section('practice', title, `<p class="hint">${task}</p><p>${esc(setup)}</p><ol class="guide-steps">${stepsHtml}</ol>${guideSources(guide.example.sources, zh)}${backLink}`));
  }
  if (listedInComparison) {
    const peers = tools.filter(([id]) => id !== currentId).map(([id]) =>
      `<li><a href="${articleHref(id)}">${esc(ds.articles.get(id).title)}</a></li>`
    ).join('');
    const parent = `${fieldHref('field:tools')}#compare-tools`;
    const label = zh ? '回到工具目录看横向对比' : 'Compare all tools in the directory';
    extras.push(section('compare-tools', zh ? '同类工具' : 'Related tools', `<p><a href="${parent}">${label}</a></p><ul class="related">${peers}</ul>`));
  }
  return extras;
}

export function renderArticle(ds, articleId) {
  const a = ds.articles.get(articleId);
  if (!a) return renderNotFound('article', articleId);
  const field = a.field_id ? ds.fields.get(a.field_id) : null;
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

  const sections = a.sections.map(s => {
    const paras = s.paragraphs.map((p) => `<p>${esc(p.text)}${p.claim_ids.map(cite).join('')}</p>`).join('');
    return `<section aria-labelledby="${anchor('sec', s.id)}"><h2 id="${anchor('sec', s.id)}">${esc(s.heading)}</h2>${paras}</section>`;
  });
  const extras = articleExtras(ds, a.id, 'en', undefined, cid => num.has(cid) ? cite(cid) : '');
  if (sections.length) sections.splice(1, 0, ...extras.map(extra => extra.html));

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
${sections.join('')}
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
