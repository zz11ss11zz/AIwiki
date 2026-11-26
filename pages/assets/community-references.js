export function mountCommunityReferences(main, params) {
  const template = document.getElementById('community-references');
  if (!template || ['article', 'field', 'q'].some(key => params.has(key))) return;

  const content = template.content.cloneNode(true);
  const section = content.querySelector('#community-references-section');
  const tag = params.get('tag');
  const tagLinks = [...section.querySelectorAll('[data-reference-tag]')];
  const hasTagFilter = tagLinks.some(link => link.dataset.referenceTag === tag);
  if (hasTagFilter) {
    for (const note of section.querySelectorAll('[data-reference-tags]')) {
      note.hidden = !note.dataset.referenceTags.split(/\s+/).includes(tag);
    }
    for (const link of tagLinks) {
      if (link.dataset.referenceTag === tag) link.setAttribute('aria-current', 'page');
    }
    section.querySelector('[data-reference-reset]').hidden = false;
  }

  const appendix = document.createElement('details');
  appendix.className = 'community-reference-appendix';
  const summary = document.createElement('summary');
  summary.textContent = template.dataset.appendixLabel;
  appendix.append(summary, content);
  appendix.open = hasTagFilter;
  main.append(appendix);

  const openReferenceTarget = () => {
    const target = document.getElementById(window.location.hash.slice(1));
    if (target && section.contains(target)) {
      appendix.open = true;
      target.scrollIntoView();
    }
  };
  openReferenceTarget();
  window.addEventListener('hashchange', openReferenceTarget);
}
