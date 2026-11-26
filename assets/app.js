import { mountCommunityReferences } from './community-references.js';
// Browser entry: fetch the dataset, render the current page, wire the nav toggle.
import { loadDataset } from './data.js';
import { route, renderSidebar, renderUnavailable } from './render.js';

// The preview server maps this path to the synthetic fixture or ENCY4AI_UI_DATA.
const DATA_URL = 'data/reader.json';

async function fetchDataset() {
  try {
    const res = await fetch(DATA_URL, { headers: { Accept: 'application/json' } });
    if (!res.ok) return { ok: false, reason: `The dataset could not be loaded (HTTP ${res.status}).` };
    return loadDataset(await res.json());
  } catch {
    return { ok: false, reason: 'The dataset could not be loaded or is not valid JSON.' };
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
  const chineseLink = document.querySelector('a[href="./zh/"], a[href="zh/"]');
  const locationParams = new URLSearchParams();
  for (const key of ['article', 'field', 'q']) {
    if (!params.has(key)) continue;
    locationParams.set(key, params.get(key));
    break;
  }
  if (chineseLink && locationParams.size) {
    const target = new URL(chineseLink.href);
    target.search = locationParams.toString();
    chineseLink.href = target.href;
  }
  const input = document.getElementById('search-input');
  if (params.has('q')) input.value = params.get('q');
  const nav = document.getElementById('site-nav');
  const mainEl = document.getElementById('main');
  const result = await fetchDataset();
  let page;
  if (result.ok) {
    if (result.warnings.length) console.warn('ENCY4AI dataset warnings:', result.warnings);
    const r = route(result.ds, params);
    page = r.page;
    nav.innerHTML = renderSidebar(result.ds, r.current);
  } else {
    page = renderUnavailable(result.reason);
    nav.innerHTML = '<h2 id="toc-heading" class="nav-heading">Browse by field</h2><p class="empty">Unavailable.</p>';
  }
  document.title = page.title;
  mainEl.innerHTML = page.html;
  mountCommunityReferences(mainEl, params);
  setupNavToggle();
  if (window.location.hash === '#practice') mainEl.querySelector('#practice')?.scrollIntoView();
}

main();
