export function mountCommunityReferences(main, params) {
  const template = document.getElementById('community-references');
  if (!template || ['article', 'field', 'q'].some(key => params.has(key))) return;

  const content = template.content.cloneNode(true);
  const section = content.querySelector('#community-references-section');
  const tag = params.get('tag');
  const tagLinks = [...section.querySelectorAll('[data-reference-tag]')];
  if (tagLinks.some(link => link.dataset.referenceTag === tag)) {
    for (const note of section.querySelectorAll('[data-reference-tags]')) {
      note.hidden = !note.dataset.referenceTags.split(/\s+/).includes(tag);
    }
    for (const link of tagLinks) {
      if (link.dataset.referenceTag === tag) link.setAttribute('aria-current', 'page');
    }
    section.querySelector('[data-reference-reset]').hidden = false;
  }

  const hero = main.querySelector('.hero');
  if (hero) hero.after(content);
  else main.append(content);

  const target = document.getElementById(window.location.hash.slice(1));
  if (target && section.contains(target)) target.scrollIntoView();
}
