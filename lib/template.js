'use strict';

const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const config = require('../site.config');
const { render, escapeHtml, inline } = require('./markdown');

const SITE = config.siteName;

// Assets are served with a week-long cache, so their URL carries a content hash;
// editing the CSS or JS produces a new URL and the browser refetches it.
const assetUrls = {};
function assetUrl(rel) {
  if (assetUrls[rel]) return assetUrls[rel];
  let version = '';
  try {
    const buf = fs.readFileSync(path.join(__dirname, '..', 'assets', rel));
    version = crypto.createHash('sha1').update(buf).digest('hex').slice(0, 8);
  } catch {
    version = '';
  }
  assetUrls[rel] = `/assets/${rel}${version ? `?v=${version}` : ''}`;
  return assetUrls[rel];
}

function formatDate(iso) {
  if (!iso) return '';
  const d = new Date(iso + 'T00:00:00Z');
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric', timeZone: 'UTC' });
}

function adsEnabled() {
  return Boolean(config.adsenseClient);
}

// Ad slot: renders a real AdSense unit once config.adsenseClient is set,
// otherwise renders nothing (see README for enabling ads).
function adSlot(position, format = 'auto') {
  if (!adsEnabled()) return '';
  return `
  <div class="ad-slot ad-slot--${position}">
    <span class="ad-label">Advertisement</span>
    <ins class="adsbygoogle" style="display:block" data-ad-client="${config.adsenseClient}" data-ad-slot="${position}" data-ad-format="${format}" data-full-width-responsive="true"></ins>
  </div>`;
}

function header(activePath = '/') {
  const items = config.nav
    .map((item) => {
      const active = item.href === '/' ? activePath === '/' : activePath.startsWith(item.href);
      return `<li><a href="${item.href}"${active ? ' aria-current="page"' : ''}>${item.label}</a></li>`;
    })
    .join('\n          ');
  return `
  <header class="site-header">
    <div class="container header-inner">
      <a class="brand" href="/" aria-label="${SITE} home">
        <svg class="brand-mark" viewBox="0 0 32 32" aria-hidden="true"><rect width="32" height="32" rx="8" fill="currentColor"/><path d="M9 21.5c2.8-1.4 4.4-3.4 4.9-6.1.5-2.7 2-4.7 4.6-6M17 9h5.5v5.5" fill="none" stroke="#fff" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"/></svg>
        <span class="brand-text">${SITE}</span>
      </a>
      <button class="nav-toggle" aria-expanded="false" aria-controls="site-nav" aria-label="Open menu">
        <span class="nav-toggle-bar"></span><span class="nav-toggle-bar"></span><span class="nav-toggle-bar"></span>
      </button>
      <nav id="site-nav" class="site-nav" aria-label="Main navigation">
        <ul>
          ${items}
        </ul>
        <button class="search-open" aria-label="Search guides" title="Search">
          <svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="11" cy="11" r="7" fill="none" stroke="currentColor" stroke-width="2"/><path d="M16.5 16.5 21 21" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>
        </button>
      </nav>
    </div>
  </header>`;
}

function footer() {
  const cats = config.categories
    .map((c) => `<li><a href="/category/${c.slug}/">${c.name}</a></li>`)
    .join('\n            ');
  const legal = config.footerLegal
    .map((l) => `<li><a href="${l.href}">${l.label}</a></li>`)
    .join('\n            ');
  const year = new Date().getFullYear();
  return `
  <footer class="site-footer">
    <div class="container footer-grid">
      <div class="footer-col footer-about">
        <a class="brand brand--footer" href="/">
          <svg class="brand-mark" viewBox="0 0 32 32" aria-hidden="true"><rect width="32" height="32" rx="8" fill="currentColor"/><path d="M9 21.5c2.8-1.4 4.4-3.4 4.9-6.1.5-2.7 2-4.7 4.6-6M17 9h5.5v5.5" fill="none" stroke="#fff" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"/></svg>
          <span class="brand-text">${SITE}</span>
        </a>
        <p>${config.description}</p>
      </div>
      <div class="footer-col">
        <h3>Categories</h3>
        <ul>
            ${cats}
        </ul>
      </div>
      <div class="footer-col">
        <h3>Explore</h3>
        <ul>
          <li><a href="/all-guides/">All Guides</a></li>
          <li><a href="/about/">About Us</a></li>
          <li><a href="/contact/">Contact</a></li>
          <li><a href="/editorial-policy/">Editorial Policy</a></li>
          <li><a href="/rss.xml">RSS Feed</a></li>
        </ul>
      </div>
      <div class="footer-col">
        <h3>Legal</h3>
        <ul>
            ${legal}
        </ul>
      </div>
    </div>
    <div class="footer-bottom">
      <div class="container">
        <p>&copy; ${year} ${SITE}. All rights reserved. This site may earn a commission through affiliate links at no extra cost to you. <a href="/disclaimer/">Disclaimer</a></p>
      </div>
    </div>
  </footer>`;
}

function cookieBanner() {
  return `
  <div class="cookie-banner" id="cookie-banner" role="dialog" aria-label="Cookie consent" hidden>
    <p>We use cookies to analyze traffic and improve your experience. Read our <a href="/cookie-policy/">Cookie Policy</a> and <a href="/privacy-policy/">Privacy Policy</a> for details.</p>
    <div class="cookie-actions">
      <button class="btn btn--ghost" data-cookie="reject">Reject</button>
      <button class="btn btn--primary" data-cookie="accept">Accept</button>
    </div>
  </div>`;
}

function searchOverlay() {
  return `
  <div class="search-overlay" id="search-overlay" hidden>
    <div class="search-panel" role="dialog" aria-label="Search guides">
      <div class="search-bar">
        <svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="11" cy="11" r="7" fill="none" stroke="currentColor" stroke-width="2"/><path d="M16.5 16.5 21 21" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>
        <input type="search" id="search-input" placeholder="Search 80+ guides..." autocomplete="off" aria-label="Search guides">
        <button class="search-close" aria-label="Close search">&times;</button>
      </div>
      <div class="search-results" id="search-results"></div>
    </div>
  </div>`;
}

function breadcrumbJsonLd(crumbs) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: crumbs.map((c, idx) => ({
      '@type': 'ListItem',
      position: idx + 1,
      name: c.name,
      item: config.url + c.href
    }))
  };
}

function layout({ title, description, path = '/', jsonld = [], body, ogType = 'website', noIndex = false, articleCoverOg = '', preloadImage = '' }) {
  const fullTitle = path === '/' ? `${title} | ${SITE}` : `${title} | ${SITE}`;
  const canonical = config.url + (path === '/' ? '/' : path);
  const ldScripts = jsonld
    .filter(Boolean)
    .map((obj) => `<script type="application/ld+json">${JSON.stringify(obj)}</script>`)
    .join('\n    ');
  const adsenseScript = adsEnabled()
    ? `\n    <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${config.adsenseClient}" crossorigin="anonymous"></script>`
    : '';
  // The image a visitor sees first should start downloading during head
  // parsing, not after the body is built. Remote hosts also get a warm
  // connection so the first byte arrives sooner.
  const imageHead = (() => {
    if (!preloadImage) return '';
    let preconnect = '';
    if (/^https?:\/\//i.test(preloadImage)) {
      try {
        const origin = new URL(preloadImage).origin;
        if (!config.url || !origin.startsWith(config.url.replace(/\/$/, ''))) {
          preconnect = `<link rel="preconnect" href="${escapeHtml(origin)}" crossorigin>\n    `;
        }
      } catch { /* keep it simple: preload without preconnect */ }
    }
    return `${preconnect}<link rel="preload" as="image" href="${escapeHtml(preloadImage)}" fetchpriority="high">\n    `;
  })();
  return `<!DOCTYPE html>
<html lang="${config.language}">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>${escapeHtml(fullTitle)}</title>
    <meta name="description" content="${escapeHtml(description || '')}">
    ${noIndex ? '<meta name="robots" content="noindex, follow">' : '<meta name="robots" content="index, follow, max-image-preview:large">'}
    <link rel="canonical" href="${canonical}">
    <meta name="author" content="${escapeHtml(config.author.name)}">
    <meta name="theme-color" content="#0f172a">
    <meta property="og:site_name" content="${SITE}">
    <meta property="og:type" content="${ogType}">
    <meta property="og:title" content="${escapeHtml(title)}">
    <meta property="og:description" content="${escapeHtml(description || '')}">
    <meta property="og:url" content="${canonical}">
    <meta property="og:locale" content="en_US">
    <meta name="twitter:card" content="summary_large_image">
    <meta name="twitter:title" content="${escapeHtml(title)}">
    <meta name="twitter:description" content="${escapeHtml(description || '')}">
    ${articleCoverOg ? `<meta property="og:image" content="${articleCoverOg}">\n    <meta name="twitter:image" content="${articleCoverOg}">` : ''}
    <link rel="icon" href="/favicon.svg" type="image/svg+xml">
    <link rel="alternate" type="application/rss+xml" title="${SITE} RSS Feed" href="/rss.xml">
    <link rel="sitemap" type="application/xml" title="Sitemap" href="/sitemap.xml">
    ${imageHead}<link rel="stylesheet" href="${assetUrl('css/style.css')}">${adsenseScript}
    ${ldScripts}
</head>
<body>
    <a class="skip-link" href="#main">Skip to content</a>
${header(path)}
    <main id="main">
${body}
    </main>
${footer()}
${cookieBanner()}
${searchOverlay()}
    <button class="back-to-top" id="back-to-top" aria-label="Back to top" hidden>&uarr;</button>
    <script src="${assetUrl('js/main.js')}" defer></script>
</body>
</html>`;
}

// Covers served from this site (uploads/*) are shown on a blurred backdrop of
// themselves so a small source still fills the tile without being stretched.
function isUploadedCover(url) {
  return typeof url === 'string' && url.startsWith('/uploads/');
}

// /uploads/ is also served with a week-long cache, so uploaded images need the
// same content hash treatment: replacing a cover must change its URL.
const uploadUrls = {};
function uploadUrl(url) {
  if (!isUploadedCover(url)) return url;
  if (uploadUrls[url]) return uploadUrls[url];
  let version = '';
  try {
    const buf = fs.readFileSync(path.join(__dirname, '..', 'public', url));
    version = crypto.createHash('sha1').update(buf).digest('hex').slice(0, 8);
  } catch {
    version = '';
  }
  uploadUrls[url] = version ? `${url}?v=${version}` : url;
  return uploadUrls[url];
}

function postCard(article, opts = {}) {
  const cat = config.categories.find((c) => c.slug === article.category);
  const catName = cat ? cat.name : 'Guide';
  // Photos uploaded through the admin can be small, so they get the blurred
  // backdrop treatment; externally hosted covers keep their plain tile.
  const thumbStyle = isUploadedCover(article.coverImage)
    ? ` card-thumb--photo" style="--thumb-image:url('${escapeHtml(uploadUrl(article.coverImage)).replace(/'/g, '%27')}')`
    : '';
  const thumb = article.coverImage
    ? `<img class="card-thumb-img" src="${escapeHtml(uploadUrl(article.coverImage))}" alt="${escapeHtml(article.title)}" loading="lazy" decoding="async" fetchpriority="low">`
    : `<span>${catName.charAt(0)}</span>`;
  return `
      <article class="card">
        <a class="card-thumb card-thumb--${article.category}${thumbStyle}" href="${article.url}" aria-hidden="true" tabindex="-1">
          ${thumb}
        </a>
        <div class="card-body">
          <a class="card-category" href="/category/${article.category}/">${catName}</a>
          <h3 class="card-title"><a href="${article.url}">${escapeHtml(article.title)}</a></h3>
          <p class="card-desc">${escapeHtml(article.description)}</p>
          <div class="card-meta"><time datetime="${article.date}">${formatDate(article.date)}</time><span aria-hidden="true">&middot;</span><span>${article.readingTime} min read</span></div>
        </div>
      </article>`;
}

function authorBox() {
  return `
      <aside class="author-box">
        <div class="author-avatar" aria-hidden="true">${SITE.charAt(0)}</div>
        <div>
          <h3 class="author-name">${escapeHtml(config.author.name)}</h3>
          <p class="author-title">${escapeHtml(config.author.jobTitle)}</p>
          <p>Our editors test every process end-to-end before publishing, update guides when tools or prices change, and link to primary sources so you can trust what you read on ${SITE}. <a href="/about/">How we work &rarr;</a> &nbsp;<a href="/editorial-policy/">Editorial policy &rarr;</a></p>
        </div>
      </aside>`;
}

function postPage(article, categoryPosts) {
  const cat = config.categories.find((c) => c.slug === article.category);
  const crumbs = [
    { name: 'Home', href: '/' },
    { name: cat.name, href: `/category/${cat.slug}/` },
    { name: article.title, href: article.url }
  ];

  const toc =
    article.outline.length > 2
      ? `<nav class="toc" aria-label="Table of contents">
        <h2 class="toc-title">On this page</h2>
        <ol>
          ${article.outline.map((o) => `<li><a href="#${o.id}">${escapeHtml(o.text)}</a></li>`).join('\n          ')}
        </ol>
      </nav>`
      : '';

  const faqs = article.faqs || [];
  const faqHtml = faqs.length
    ? `<section class="faq" id="frequently-asked-questions">
        <h2>Frequently Asked Questions</h2>
        ${faqs
          .map(
            (f) => `<details class="faq-item"${faqs.indexOf(f) === 0 ? ' open' : ''}>
          <summary>${escapeHtml(f.q)}</summary>
          <div class="faq-answer"><p>${escapeHtml(f.a)}</p></div>
        </details>`
          )
          .join('\n        ')}
      </section>`
    : '';

  const related = categoryPosts.filter((a) => a.slug !== article.slug).slice(0, 3);
  const relatedHtml = related.length
    ? `<section class="related">
        <h2>Keep learning: related guides</h2>
        <div class="card-grid">
          ${related.map((a) => postCard(a)).join('')}
        </div>
      </section>`
    : '';

  const tags = (article.tags || [])
    .map((t) => `<li>${escapeHtml(t)}</li>`)
    .join('');

  const jsonld = [
    {
      '@context': 'https://schema.org',
      '@type': 'BlogPosting',
      mainEntityOfPage: { '@type': 'WebPage', '@id': config.url + article.url },
      headline: article.title,
      description: article.description,
      datePublished: article.date,
      dateModified: article.updated || article.date,
      author: { '@type': 'Person', name: article.author || config.author.name },
      publisher: {
        '@type': 'Organization',
        name: SITE,
        logo: { '@type': 'ImageObject', url: config.url + '/favicon.svg' }
      },
      articleSection: cat.name,
      wordCount: article.words,
      keywords: (article.keywords || []).join(', '),
      inLanguage: 'en'
    },
    breadcrumbJsonLd(crumbs)
  ];
  if (faqs.length) {
    jsonld.push({
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: faqs.map((f) => ({
        '@type': 'Question',
        name: f.q,
        acceptedAnswer: { '@type': 'Answer', text: f.a }
      }))
    });
  }

  const coverImg = article.coverImage
    ? `<img class="post-cover" src="${escapeHtml(uploadUrl(article.coverImage))}" alt="${escapeHtml(article.title)}" loading="eager" decoding="async" fetchpriority="high">`
    : '';

  // Ends by closing the class attribute, plus the backdrop style for uploads.
  const coverWrapAttrs = isUploadedCover(article.coverImage)
    ? ` post-cover-wrap--photo" style="--cover-image:url('${escapeHtml(uploadUrl(article.coverImage)).replace(/'/g, '%27')}')"`
    : '"';

  const body = `
      <div class="container">
        <nav class="breadcrumbs" aria-label="Breadcrumb">
          <ol>
            ${crumbs.map((c, i) => `<li><a href="${c.href}">${escapeHtml(i === crumbs.length - 1 ? c.name.slice(0, 64) + (c.name.length > 64 ? '...' : '') : c.name)}</a></li>`).join('\n            ')}
          </ol>
        </nav>
      </div>
      <article class="post">
        ${coverImg ? `<div class="container post-cover-wrap${coverWrapAttrs} role="img" aria-label="${escapeHtml(article.title)}">${coverImg}</div>` : ''}
        <div class="container post-header">
          <a class="post-category" href="/category/${cat.slug}/">${cat.name}</a>
          <h1>${escapeHtml(article.title)}</h1>
          <p class="post-dek">${escapeHtml(article.description)}</p>
          <div class="post-meta">
            <span>By ${escapeHtml(article.author || config.author.name)}</span>
            <span aria-hidden="true">&middot;</span>
            <time datetime="${article.date}">Updated ${formatDate(article.updated || article.date)}</time>
            <span aria-hidden="true">&middot;</span>
            <span>${article.readingTime} min read</span>
            <span aria-hidden="true">&middot;</span>
            <span>${article.words.toLocaleString('en-US')} words</span>
          </div>
        </div>
        <div class="container">${adSlot('top-banner')}</div>
        <div class="container post-layout">
          <div class="post-content">
            ${toc}
            ${render(article.body)}
            <div class="ad-slot ad-slot--in-article">${adSlot('in-article')}</div>
            ${faqHtml}
            <div class="ad-slot ad-slot--below-content">${adSlot('below-content')}</div>
            ${tags ? `<ul class="post-tags">${tags}</ul>` : ''}
            ${authorBox()}
          </div>
        </div>
        <div class="container">
          ${relatedHtml}
        </div>
      </article>`;

  const articleCoverOg = article.coverImage || config.url + '/assets/OG-placeholder.png';

  return {
    html: layout({
      title: article.title,
      description: article.description,
      path: article.url,
      ogType: 'article',
      jsonld,
      body,
      articleCoverOg,
      preloadImage: uploadUrl(article.coverImage || '')
    }),
    crumbs
  };
}

function listPage({ title, description, path, heading, intro, articles, jsonld = [], crumbHtml = '' }) {
  const body = `
      <header class="page-header">
        <div class="container">
          ${crumbHtml}
          <h1>${escapeHtml(heading || title)}</h1>
          ${intro ? `<p class="page-intro">${intro}</p>` : ''}
        </div>
      </header>
      <div class="container">
        ${adSlot('top-banner')}
        <div class="card-grid card-grid--list">
          ${articles.map((a) => postCard(a)).join('')}
        </div>
      </div>`;
  return layout({ title, description, path, jsonld, body });
}

function staticPage({ title, description, path, bodyHtml, crumbs, jsonld }) {
  const crumbHtml = crumbs
    ? `<nav class="breadcrumbs" aria-label="Breadcrumb"><ol>${crumbs
        .map((c) => `<li><a href="${c.href}">${escapeHtml(c.name)}</a></li>`)
        .join('')}</ol></nav>`
    : '';
  const body = `
      <div class="container">
        ${crumbHtml}
        <article class="page">
          <header class="page-header page-header--slim">
            <h1>${escapeHtml(title)}</h1>
            ${description ? `<p class="page-intro">${escapeHtml(description)}</p>` : ''}
            <p class="page-updated">Last updated: ${formatDate(new Date().toISOString().slice(0, 10))}</p>
          </header>
          <div class="page-content">
            ${bodyHtml}
          </div>
        </article>
      </div>`;
  return layout({ title, description, path, jsonld, body });
}

module.exports = { layout, postPage, postCard, listPage, staticPage, formatDate, adSlot, breadcrumbJsonLd, authorBox };
