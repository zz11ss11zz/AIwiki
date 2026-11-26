export function legacyReferenceDestination(params, hash) {
  if (['article', 'field', 'q'].some(key => params.has(key))) return null;
  const tag = params.get('tag') ?? '';
  const query = /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(tag) ? `?tag=${tag}` : '';
  const fragment = /^#reference-[a-z0-9-]+$/.test(hash) || hash === '#community-references-section'
    ? hash : '';
  return query || fragment
    ? `references.html${query}${fragment || '#community-references-section'}`
    : null;
}

function filterReferences(section, params) {
  const tag = params.get('tag');
  const tagLinks = [...section.querySelectorAll('[data-reference-tag]')];
  if (!tagLinks.some(link => link.dataset.referenceTag === tag)) return;

  for (const note of section.querySelectorAll('[data-reference-tags]')) {
    note.hidden = !note.dataset.referenceTags.split(/\s+/).includes(tag);
  }
  for (const link of tagLinks) {
    if (link.dataset.referenceTag === tag) link.setAttribute('aria-current', 'page');
  }
  section.querySelector('[data-reference-reset]').hidden = false;
}

if (typeof document !== 'undefined') {
  const section = document.getElementById('community-references-section');
  if (section) {
    const params = new URLSearchParams(window.location.search);
    filterReferences(section, params);
    const alternate = document.querySelector('[data-reference-locale]');
    const alternateUrl = new URL(alternate.href);
    const syncAlternate = () => {
      alternateUrl.search = window.location.search;
      alternateUrl.hash = window.location.hash;
      alternate.href = alternateUrl.href;
    };
    syncAlternate();
    window.addEventListener('hashchange', syncAlternate);
  }
}
