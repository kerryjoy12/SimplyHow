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
        <h3 class="footer-social-heading">Follow us</h3>
        <nav class="footer-socials" aria-label="Social media">
          <a href="https://web.facebook.com/profile.php?id=61587794397315" target="_blank" rel="noopener noreferrer" aria-label="Facebook">
            <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M13.5 21v-8.2h2.8l.4-3.2h-3.2v-2c0-.9.3-1.5 1.6-1.5h1.7V3.2c-.3 0-1.3-.1-2.4-.1-2.4 0-4.1 1.5-4.1 4.2v2.3H7.5v3.2h2.8V21h3.2z"/></svg>
          </a>
          <a href="https://www.tiktok.com/@intimacare254" target="_blank" rel="noopener noreferrer" aria-label="TikTok">
            <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M19.6 7.3a6.7 6.7 0 0 1-4.1-1.4v8.4a6.2 6.2 0 1 1-5.3-6.1v3.4a2.9 2.9 0 1 0 2.1 2.8V2.5h3.3c.2 2 1.7 3.7 4 4v.8z"/></svg>
          </a>
          <a href="https://www.instagram.com/reels/DeWhKUysZDx/" target="_blank" rel="noopener noreferrer" aria-label="Instagram">
            <svg viewBox="0 0 24 24" aria-hidden="true"><rect x="3.2" y="3.2" width="17.6" height="17.6" rx="5" fill="none" stroke="currentColor" stroke-width="2"/><circle cx="12" cy="12" r="4" fill="none" stroke="currentColor" stroke-width="2"/><circle cx="17.7" cy="6.6" r="1.2"/></svg>
          </a>
          <a href="https://wa.me/254712370394" target="_blank" rel="noopener noreferrer" aria-label="WhatsApp">
            <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M20.5 11.7a8.4 8.4 0 0 1-12.4 7.4l-4.6 1.2 1.2-4.5a8.4 8.4 0 1 1 15.8-4.1zm-8.4-7a6.9 6.9 0 0 0-5.9 10.4l.3.5-.7 2.6 2.7-.7.5.3a6.9 6.9 0 1 0 3.1-13.1zm3.8 9.9c-.2-.1-1.2-.6-1.4-.7s-.3-.1-.5.1-.5.7-.7.8-.3.2-.5.1a5.7 5.7 0 0 1-1.7-1.1 6.4 6.4 0 0 1-1.2-1.5c-.1-.2 0-.3.1-.5l.4-.4.2-.4v-.4l-.6-1.5c-.2-.4-.4-.4-.5-.4h-.4c-.2 0-.4.1-.6.3a2.5 2.5 0 0 0-.8 1.8 4.4 4.4 0 0 0 .9 2.3 10.1 10.1 0 0 0 3.9 3.5c.5.2.9.4 1.2.4.5.2 1 .1 1.3.1.4-.1 1.2-.5 1.4-1s.2-.9.1-1c-.1-.2-.3-.2-.5-.3z"/></svg>
          </a>
        </nav>
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
        <p>&copy; ${year} ${SITE}. All rights reserved. <a href="/disclaimer/">Disclaimer</a></p>
      </div>
    </div>
  </footer>`;
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
          <p>Our articles are published under the SimplyHow Editorial Team byline. Check current official instructions for your device or situation, and contact us if you find an error. <a href="/about/">About SimplyHow &rarr;</a> &nbsp;<a href="/editorial-policy/">Editorial policy &rarr;</a></p>
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
