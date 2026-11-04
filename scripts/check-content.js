'use strict';

// Content QA for SimplyHow: word counts, meta fields, FAQs, structure, links.
// Usage: node scripts/check-content.js [--min=80] [--words=2000]

const fs = require('fs');
const path = require('path');
const config = require('../site.config');
const { loadArticles, loadPages } = require('../lib/content');

const args = process.argv.slice(2);
const getArg = (name, dflt) => {
  const hit = args.find((a) => a.startsWith(`--${name}=`));
  return hit ? hit.split('=')[1] : dflt;
};
const MIN_ARTICLES = Number(getArg('min', 80));
const MIN_WORDS = Number(getArg('words', 2000));

const articles = loadArticles(path.join(__dirname, '..', 'content', 'articles'));
const pages = loadPages(path.join(__dirname, '..', 'content', 'pages'));
const catSlugs = new Set(config.categories.map((c) => c.slug));

const errors = [];
const warnings = [];
const err = (a, msg) => errors.push(`${a.file}: ${msg}`);
const warn = (a, msg) => warnings.push(`${a.file}: ${msg}`);

// ---- totals
if (articles.length < MIN_ARTICLES) {
  errors.push(`ARTICLE COUNT: found ${articles.length}, need at least ${MIN_ARTICLES}`);
}
const pageSlugs = new Set(pages.map((p) => p.slug));
for (const required of ['about', 'contact', 'privacy-policy', 'terms', 'disclaimer', 'cookie-policy', 'editorial-policy']) {
  if (!pageSlugs.has(required)) errors.push(`MISSING PAGE: content/pages/${required}.md`);
}

// ---- per-article checks
const slugs = new Set();
const titles = new Set();
const descriptions = new Set();
const totalWords = articles.reduce((s, a) => s + (a.words || 0), 0);

for (const a of articles) {
  if (!a.slug) err(a, 'missing slug');
  else if (slugs.has(a.slug)) err(a, `duplicate slug ${a.slug}`);
  else slugs.add(a.slug);

  if (!a.title) err(a, 'missing title');
  else {
    if (titles.has(a.title)) err(a, 'duplicate title');
    titles.add(a.title);
    if (a.title.length > 70) warn(a, `title ${a.title.length} chars (>70 may truncate in SERPs)`);
  }

  if (!a.description) err(a, 'missing description');
  else {
    if (descriptions.has(a.description)) err(a, 'duplicate meta description');
    descriptions.add(a.description);
    if (a.description.length < 70) warn(a, `description short (${a.description.length} chars, aim 120-160)`);
    if (a.description.length > 170) warn(a, `description long (${a.description.length} chars, aim 120-160)`);
  }

  if (!a.body) err(a, 'empty body');
  if ((a.words || 0) < MIN_WORDS) err(a, `only ${a.words} words (need >= ${MIN_WORDS})`);
  if (!catSlugs.has(a.category)) err(a, `invalid category "${a.category}"`);
  if (!Array.isArray(a.keywords) || a.keywords.length < 3) err(a, 'needs >= 3 keywords');
  if (!Array.isArray(a.tags) || a.tags.length < 3) err(a, 'needs >= 3 tags');
  if (!a.date || Number.isNaN(new Date(a.date + 'T00:00:00Z').getTime())) err(a, `invalid date "${a.date}"`);
  if (!a.author) warn(a, 'missing author (will fall back to site author)');

  const faqs = a.faqs || [];
  if (faqs.length < 4) err(a, `only ${faqs.length} FAQs (need >= 4)`);
  faqs.forEach((f, i) => {
    if (!f.q || !f.q.endsWith('?')) err(a, `FAQ ${i + 1} question should end with ?`);
    if (!f.a || f.a.split(/\s+/).length < 12) err(a, `FAQ ${i + 1} answer too short`);
  });

  const h2s = (a.body.match(/^##\s+/gm) || []).length;
  if (h2s < 5) err(a, `only ${h2s} H2 sections (need >= 5)`);

  // internal link integrity
  const links = [...a.body.matchAll(/\]\((\/[^)\s]+)\)/g)].map((m) => m[1]);
  for (const link of links) {
    const clean = link.split('#')[0];
    if (/^\/posts\//.test(clean)) {
      const slug = clean.replace('/posts/', '').replace(/\/$/, '');
      if (!articles.some((x) => x.slug === slug)) err(a, `broken internal link ${link}`);
    } else if (/^\/category\//.test(clean)) {
      const slug = clean.replace('/category/', '').replace(/\/$/, '');
      if (!catSlugs.has(slug)) err(a, `broken category link ${link}`);
    } else if (/^\/(about|contact|privacy-policy|terms|disclaimer|cookie-policy|editorial-policy|all-guides)\//.test(clean)) {
      // site page, verified below for pages
      const slug = clean.replace(/^\//, '').replace(/\/$/, '');
      if (!pageSlugs.has(slug) && slug !== 'all-guides') err(a, `broken page link ${link}`);
    } else if (/^https?:/.test(clean)) {
      // external link, nothing to verify offline
    } else if (clean.startsWith('/')) {
      // other root-relative links (rss, search index) are generated
    }
  }
  if (links.length < 3) warn(a, `only ${links.length} internal links (aim for 4-8 for SEO)`);
}

// cross-links from static pages
for (const p of pages) {
  const links = [...p.body.matchAll(/\]\((\/[^)\s]+)\)/g)].map((m) => m[1]);
  for (const link of links) {
    const clean = link.split('#')[0];
    if (/^\/posts\//.test(clean)) {
      const slug = clean.replace('/posts/', '').replace(/\/$/, '');
      if (!articles.some((x) => x.slug === slug)) errors.push(`${p.file}: broken internal link ${link}`);
    }
  }
}

// ---- report
console.log(`Articles: ${articles.length} | Pages: ${pages.length} | Words: ${totalWords.toLocaleString('en-US')} (avg ${articles.length ? Math.round(totalWords / articles.length).toLocaleString('en-US') : 0})`);

if (warnings.length) {
  console.log(`\nWarnings (${warnings.length}):`);
  warnings.slice(0, 40).forEach((w) => console.log('  ~ ' + w));
  if (warnings.length > 40) console.log(`  ... and ${warnings.length - 40} more`);
}

if (errors.length) {
  console.error(`\nERRORS (${errors.length}):`);
  errors.slice(0, 80).forEach((e) => console.error('  x ' + e));
  if (errors.length > 80) console.error(`  ... and ${errors.length - 80} more`);
  process.exit(1);
}

console.log('\nAll content checks passed.');
