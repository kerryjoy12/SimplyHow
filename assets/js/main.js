'use strict';

/* SimplyHow client-side behaviour: mobile nav, search, cookie consent,
   guide filtering, back-to-top. No dependencies. */
(function () {
  var doc = document;

  /* ---------------------------------------------------------- mobile nav */
  var toggle = doc.querySelector('.nav-toggle');
  var nav = doc.getElementById('site-nav');
  if (toggle && nav) {
    toggle.addEventListener('click', function () {
      var open = nav.classList.toggle('is-open');
      toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
      toggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
    });
  }

  /* -------------------------------------------------------- search overlay */
  var overlay = doc.getElementById('search-overlay');
  var openBtn = doc.querySelector('.search-open');
  var closeBtn = doc.querySelector('.search-close');
  var input = doc.getElementById('search-input');
  var results = doc.getElementById('search-results');
  var index = null;
  var indexPromise = null;

  function loadIndex() {
    if (index) return Promise.resolve(index);
    if (!indexPromise) {
      indexPromise = fetch('/search-index.json')
        .then(function (r) { return r.json(); })
        .then(function (data) { index = data; return index; })
        .catch(function () { return (index = []); });
    }
    return indexPromise;
  }

  function score(item, q) {
    var t = item.t.toLowerCase();
    var d = (item.d || '').toLowerCase();
    if (t === q) return 100;
    if (t.indexOf(q) === 0) return 80;
    if (t.indexOf(q) > -1) return 60;
    if (d.indexOf(q) > -1) return 30;
    if (item.c.toLowerCase().indexOf(q) > -1) return 20;
    return 0;
  }

  function renderResults(q) {
    if (!results) return;
    if (!q) {
      results.innerHTML = '<p class="search-empty">Start typing to search 80+ guides...</p>';
      return;
    }
    var matches = [];
    for (var i = 0; i < index.length; i++) {
      var s = score(index[i], q);
      if (s > 0) matches.push({ item: index[i], s: s });
    }
    matches.sort(function (a, b) { return b.s - a.s; });
    matches = matches.slice(0, 12);
    if (!matches.length) {
      results.innerHTML = '<p class="search-empty">No guides match "' + q.replace(/</g, '&lt;') + '". Try a simpler phrase.</p>';
      return;
    }
    results.innerHTML = matches
      .map(function (m) {
        return '<a class="search-result" href="' + m.item.u + '"><strong>' + m.item.t + '</strong><span>' + m.item.c + ' &middot; ' + m.item.d + '</span></a>';
      })
      .join('');
  }

  function openSearch() {
    if (!overlay) return;
    overlay.hidden = false;
    doc.body.style.overflow = 'hidden';
    loadIndex().then(function () { renderResults(input ? input.value.trim().toLowerCase() : ''); });
    if (input) { input.focus(); input.select(); }
  }

  function closeSearch() {
    if (!overlay) return;
    overlay.hidden = true;
    doc.body.style.overflow = '';
  }

  if (openBtn) openBtn.addEventListener('click', openSearch);
  if (closeBtn) closeBtn.addEventListener('click', closeSearch);
  if (overlay) {
    overlay.addEventListener('click', function (e) { if (e.target === overlay) closeSearch(); });
  }
  if (input) {
    input.addEventListener('input', function () {
      renderResults(input.value.trim().toLowerCase());
    });
    input.addEventListener('keydown', function (e) {
      if (e.key === 'Enter') {
        var first = results && results.querySelector('a.search-result');
        if (first) { e.preventDefault(); window.location.href = first.getAttribute('href'); }
      }
    });
  }
  doc.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') closeSearch();
    if ((e.key === 'k' || e.key === 'K') && (e.metaKey || e.ctrlKey)) { e.preventDefault(); openSearch(); }
  });

  /* ------------------------------------------------------- guide filtering */
  var filter = doc.getElementById('filter-input');
  if (filter) {
    var cards = Array.prototype.slice.call(doc.querySelectorAll('.card-grid .card'));
    filter.addEventListener('input', function () {
      var q = filter.value.trim().toLowerCase();
      var shown = 0;
      cards.forEach(function (card) {
        var hit = !q || card.textContent.toLowerCase().indexOf(q) > -1;
        card.style.display = hit ? '' : 'none';
        if (hit) shown++;
      });
      var note = doc.getElementById('filter-note');
      if (!note) {
        note = doc.createElement('p');
        note.id = 'filter-note';
        note.style.color = 'var(--muted)';
        filter.parentNode.insertBefore(note, filter.nextSibling);
      }
      note.textContent = q ? shown + ' of ' + cards.length + ' guides shown' : '';
    });
  }

  /* -------------------------------------------------------- cookie consent */
  var banner = doc.getElementById('cookie-banner');
  var CONSENT_KEY = 'simplyhow_cookie_consent';
  function getConsent() { try { return localStorage.getItem(CONSENT_KEY); } catch (e) { return null; } }
  function setConsent(v) { try { localStorage.setItem(CONSENT_KEY, v); } catch (e) { /* storage blocked */ } }
  if (banner && !getConsent()) {
    setTimeout(function () { banner.hidden = false; }, 900);
  }
  if (banner) {
    banner.addEventListener('click', function (e) {
      var action = e.target && e.target.getAttribute && e.target.getAttribute('data-cookie');
      if (!action) return;
      setConsent(action);
      banner.hidden = true;
    });
  }

  /* ----------------------------------------------------------- back to top */
  var topBtn = doc.getElementById('back-to-top');
  if (topBtn) {
    var onScroll = function () {
      topBtn.hidden = window.scrollY < 700;
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    topBtn.addEventListener('click', function () {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }
})();
