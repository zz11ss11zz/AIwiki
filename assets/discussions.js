/*
 * ENCY4AI — Community discussions
 *
 * Browser-local, unverified notes. Deliberately isolated from the encyclopedia:
 *  - stored only in localStorage under STORAGE_KEY (no network, no telemetry);
 *  - never merged with article search, references or citations;
 *  - all user input is rendered with textContent (never as HTML);
 *  - submitted URLs are validated syntactically (http/https only) and never fetched.
 */
(function () {
  'use strict';

  var STORAGE_KEY = 'ency4ai.reader.communityDiscussions.v1';
  var MAX_EXCERPT = 5000;
  var MAX_URL = 2048;

  var form = document.getElementById('discussion-form');
  var excerptInput = document.getElementById('excerpt-input');
  var urlInput = document.getElementById('url-input');
  var excerptError = document.getElementById('excerpt-error');
  var urlError = document.getElementById('url-error');
  var storageError = document.getElementById('storage-error');
  var statusEl = document.getElementById('discussion-status');
  var listEl = document.getElementById('discussion-list');
  var emptyEl = document.getElementById('discussion-empty');
  var countEl = document.getElementById('saved-count');
  var savedHeading = document.getElementById('saved-heading');

  if (!form || !excerptInput || !urlInput || !listEl) return;

  var storage = getStorage();
  var records = [];

  var dateFormatter = null;
  try {
    dateFormatter = new Intl.DateTimeFormat(undefined, { dateStyle: 'medium', timeStyle: 'short' });
  } catch (e) {
    dateFormatter = null;
  }

  /* ---------- storage ---------- */

  function getStorage() {
    try {
      var s = window.localStorage;
      return s || null;
    } catch (e) {
      return null; // e.g. SecurityError when storage is blocked
    }
  }

  /** Returns { records: [...], problem: null | 'unavailable' | 'unreadable' } */
  function readRecords() {
    if (!storage) return { records: [], problem: 'unavailable' };
    var raw;
    try {
      raw = storage.getItem(STORAGE_KEY);
    } catch (e) {
      return { records: [], problem: 'unavailable' };
    }
    if (raw === null) return { records: [], problem: null };
    var parsed;
    try {
      parsed = JSON.parse(raw);
    } catch (e) {
      return { records: [], problem: 'unreadable' };
    }
    if (!Array.isArray(parsed)) return { records: [], problem: 'unreadable' };
    var clean = [];
    for (var i = 0; i < parsed.length; i++) {
      var r = sanitizeRecord(parsed[i]);
      if (r) clean.push(r);
    }
    return { records: clean, problem: null };
  }

  /** Re-validate everything read from storage; it may have been edited by hand. */
  function sanitizeRecord(r) {
    if (!r || typeof r !== 'object') return null;
    if (typeof r.id !== 'string' || !r.id || r.id.length > 100) return null;
    if (typeof r.excerpt !== 'string') return null;
    var excerpt = r.excerpt.trim();
    if (!excerpt || excerpt.length > MAX_EXCERPT) return null;
    var url = '';
    if (typeof r.url === 'string' && r.url) {
      url = normalizeUrl(r.url);
      if (url === null) url = ''; // drop unsafe/invalid links rather than render them
    }
    if (typeof r.savedAt !== 'string' || isNaN(Date.parse(r.savedAt))) return null;
    return { id: r.id, excerpt: excerpt, url: url, savedAt: r.savedAt };
  }

  /** Throws on failure (unavailable storage, quota exceeded, etc.). */
  function writeRecords(next) {
    if (!storage) throw new Error('Local storage is unavailable');
    storage.setItem(STORAGE_KEY, JSON.stringify(next));
  }

  /* ---------- validation ---------- */

  /** Returns a normalized http(s) URL string, or null if invalid. Never fetches. */
  function normalizeUrl(value) {
    var v = String(value).trim();
    if (v.length > MAX_URL || !/^https?:\/\//i.test(v)) return null;
    var u;
    try {
      u = new URL(v);
    } catch (e) {
      return null;
    }
    if (u.protocol !== 'http:' && u.protocol !== 'https:') return null;
    if (!u.hostname) return null;
    if (u.username || u.password) return null; // avoid storing embedded credentials
    return u.href.length > MAX_URL ? null : u.href;
  }

  function setFieldError(input, errorEl, message) {
    if (message) {
      errorEl.textContent = message;
      errorEl.hidden = false;
      input.setAttribute('aria-invalid', 'true');
    } else {
      errorEl.textContent = '';
      errorEl.hidden = true;
      input.removeAttribute('aria-invalid');
    }
  }

  /* ---------- messages ---------- */

  function showStorageError(message) {
    storageError.textContent = '';
    var p = document.createElement('p');
    p.textContent = message;
    storageError.appendChild(p);
    storageError.hidden = false;
  }

  function clearStorageError() {
    storageError.textContent = '';
    storageError.hidden = true;
  }

  function announce(message) {
    // Clear first so repeated identical messages are re-announced.
    statusEl.textContent = '';
    window.setTimeout(function () { statusEl.textContent = message; }, 50);
  }

  /* ---------- rendering ---------- */

  function formatDate(iso) {
    var d = new Date(iso);
    if (isNaN(d.getTime())) return iso;
    if (dateFormatter) {
      try { return dateFormatter.format(d); } catch (e) { /* fall through */ }
    }
    return d.toLocaleString();
  }

  function shortLabel(text) {
    var oneLine = text.replace(/\s+/g, ' ').trim();
    return oneLine.length > 40 ? oneLine.slice(0, 40) + '…' : oneLine;
  }

  function render() {
    listEl.textContent = '';
    for (var i = 0; i < records.length; i++) {
      listEl.appendChild(renderItem(records[i]));
    }
    var n = records.length;
    emptyEl.hidden = n > 0;
    listEl.hidden = n === 0;
    countEl.textContent = n > 0 ? '(' + n + ')' : '';
  }

  function renderItem(r) {
    var li = document.createElement('li');
    li.className = 'discussion-item';
    li.setAttribute('data-id', r.id);

    var quote = document.createElement('blockquote');
    quote.className = 'excerpt';
    quote.textContent = r.excerpt; // text only, never HTML
    li.appendChild(quote);

    var meta = document.createElement('p');
    meta.className = 'meta';

    var badge = document.createElement('span');
    badge.className = 'badge badge-candidate';
    badge.textContent = 'Unverified';
    meta.appendChild(badge);

    var saved = document.createElement('span');
    saved.appendChild(document.createTextNode('Saved '));
    var time = document.createElement('time');
    time.setAttribute('datetime', r.savedAt);
    var dateText = formatDate(r.savedAt);
    time.textContent = dateText;
    saved.appendChild(time);
    meta.appendChild(saved);
    li.appendChild(meta);

    if (r.url) {
      var src = document.createElement('p');
      src.className = 'source-line';
      src.appendChild(document.createTextNode('Source (unverified): '));
      var a = document.createElement('a');
      a.className = 'source-url';
      a.href = r.url; // validated http(s) only; not fetched by this page
      a.rel = 'nofollow noopener noreferrer';
      a.referrerPolicy = 'no-referrer';
      a.textContent = r.url;
      src.appendChild(a);
      li.appendChild(src);
    }

    var del = document.createElement('button');
    del.type = 'button';
    del.className = 'button-delete';
    del.setAttribute('data-delete-id', r.id);
    del.appendChild(document.createTextNode('Delete excerpt'));
    var hiddenCtx = document.createElement('span');
    hiddenCtx.className = 'visually-hidden';
    hiddenCtx.textContent = ': “' + shortLabel(r.excerpt) + '”, saved ' + dateText;
    del.appendChild(hiddenCtx);
    li.appendChild(del);

    return li;
  }

  /* ---------- actions ---------- */

  function makeId() {
    try {
      if (window.crypto && typeof window.crypto.randomUUID === 'function') {
        return window.crypto.randomUUID();
      }
    } catch (e) { /* fall back */ }
    return Date.now().toString(36) + '-' + Math.random().toString(36).slice(2, 10);
  }

  function onSubmit(event) {
    event.preventDefault();

    var excerpt = excerptInput.value.trim();
    var rawUrl = urlInput.value.trim();
    var firstInvalid = null;

    if (!excerpt) {
      setFieldError(excerptInput, excerptError, 'Enter an excerpt before saving.');
      firstInvalid = excerptInput;
    } else if (excerpt.length > MAX_EXCERPT) {
      setFieldError(excerptInput, excerptError, 'The excerpt is longer than 5,000 characters.');
      firstInvalid = excerptInput;
    } else {
      setFieldError(excerptInput, excerptError, '');
    }

    var url = '';
    if (rawUrl) {
      url = normalizeUrl(rawUrl);
      if (url === null) {
        setFieldError(urlInput, urlError, 'Enter a full web address starting with http:// or https://, or leave this field empty.');
        firstInvalid = firstInvalid || urlInput;
      } else {
        setFieldError(urlInput, urlError, '');
      }
    } else {
      setFieldError(urlInput, urlError, '');
    }

    if (firstInvalid) {
      firstInvalid.focus();
      return;
    }

    var current = readRecords();
    if (current.problem === 'unreadable') {
      showStorageError('Previously saved notes could not be read. Your input and the stored notes have been preserved.');
      return;
    }
    var record = { id: makeId(), excerpt: excerpt, url: url, savedAt: new Date().toISOString() };
    var next = [record].concat(current.records);

    try {
      writeRecords(next);
    } catch (e) {
      // Keep the form contents so nothing the user typed is lost.
      showStorageError(
        'Could not save in this browser (storage may be full, disabled or blocked). ' +
        'Your text is still in the form — copy it somewhere safe before leaving this page.'
      );
      excerptInput.focus();
      return;
    }

    records = next;
    clearStorageError();
    form.reset();
    render();
    announce('Excerpt saved locally in this browser.');
    excerptInput.focus();
  }

  function onListClick(event) {
    var target = event.target;
    var btn = target && target.closest ? target.closest('button[data-delete-id]') : null;
    if (!btn || !listEl.contains(btn)) return;
    var id = btn.getAttribute('data-delete-id');

    var current = readRecords();
    if (current.problem) {
      showStorageError('Could not read the saved notes. Nothing was deleted.');
      return;
    }
    var index = -1;
    for (var i = 0; i < current.records.length; i++) {
      if (current.records[i].id === id) { index = i; break; }
    }
    if (index === -1) return;

    var next = current.records.slice(0, index).concat(current.records.slice(index + 1));
    try {
      writeRecords(next);
    } catch (e) {
      showStorageError('Could not delete the excerpt because browser storage is unavailable. Nothing was changed.');
      return;
    }

    records = next;
    clearStorageError();
    render();
    announce('Excerpt deleted.');

    // Move focus to a sensible place: the next item's delete button, else previous, else heading.
    var buttons = listEl.querySelectorAll('button[data-delete-id]');
    if (buttons.length) {
      buttons[Math.min(index, buttons.length - 1)].focus();
    } else {
      savedHeading.focus();
    }
  }

  function clearErrorOnInput(input, errorEl) {
    input.addEventListener('input', function () {
      if (input.getAttribute('aria-invalid') === 'true') setFieldError(input, errorEl, '');
    });
  }

  /* ---------- init ---------- */

  function loadAndRender() {
    var result = readRecords();
    records = result.records;
    if (result.problem === 'unavailable') {
      showStorageError('Browser storage is unavailable here (it may be disabled or blocked), so excerpts cannot be saved on this page.');
    } else if (result.problem === 'unreadable') {
      showStorageError('Previously saved notes could not be read. The page will keep those stored records.');
    }
    render();
  }

  form.addEventListener('submit', onSubmit);
  listEl.addEventListener('click', onListClick);
  clearErrorOnInput(excerptInput, excerptError);
  clearErrorOnInput(urlInput, urlError);

  // Keep multiple open tabs consistent (local event only; no network).
  window.addEventListener('storage', function (event) {
    if (event.key === STORAGE_KEY || event.key === null) {
      var result = readRecords();
      if (!result.problem) {
        records = result.records;
        render();
      }
    }
  });

  loadAndRender();
})();
