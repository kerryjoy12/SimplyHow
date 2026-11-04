'use strict';

// SimplyHow static site generator - zero dependencies.
// Reads content/pages/*.md and content/articles/*.md, renders the full
// site into dist/, including sitemap, RSS, robots.txt and search index.

const fs = require('fs');
const path = require('path');
const config = require('./site.config');
const { loadArticles, loadPages } = require('./lib/content');
const { render, escapeHtml } = require('./lib/markdown');
const tpl = require('./lib/template');

const ROOT = __dirname;
const DIST = path.join(ROOT, 'dist');

function ensureDir(dir) {
  fs.mkdirSync(dir, { recursive: true });
}

function write(rel, content) {
  const target = path.join(DIST, rel.replace(/^\//, ''));
  ensureDir(path.dirname(target));
  fs.writeFileSync(target, content);
}

function copyDir(src, dest) {
  if (!fs.existsSync(src)) return;
  ensureDir(dest);
  for (const entry of fs.readdirSync(src, { withFileTypes: true })) {
    const from = path.join(src, entry.name);
    const to = path.join(dest, entry.name);
    if (entry.isDirectory()) copyDir(from, to);
    else fs.copyFileSync(from, to);
  }
}

function stripMd(md) {
  return String(md)
    .replace(/!\[[^\]]*\]\([^)]*\)/g, '')
    .replace(/\[([^\]]+)\]\([^)]*\)/g, '$1')
    .replace(/[#>*`_]/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}

// ---------------------------------------------------------------- load content
const articles = loadArticles(path.join(ROOT, 'content', 'articles'));
const pages = loadPages(path.join(ROOT, 'content', 'pages'));

// Apply cover-image catalog (public/admin/thumbnails.json) into article frontmatter.
// Existing coverImage values already in an article file take priority.
const catalogPath = path.join(ROOT, 'public', 'admin', 'thumbnails.json');
if (fs.existsSync(catalogPath)) {
  const catalog = JSON.parse(fs.readFileSync(catalogPath, 'utf8'));
  const rows = Array.isArray(catalog?.rows) ? catalog.rows : [];
  const catalogMap = Object.fromEntries(rows.map((r) => [r.slug, String(r.coverImage || '').trim()]));
  for (const a of articles) {
    if (a.coverImage) continue; // already set in content — keep it
    const catalogUrl = catalogMap[a.slug];
    if (catalogUrl) a.coverImage = catalogUrl;
  }
}

// sanity: unique slugs and titles
const slugs = new Set();
const titles = new Set();
for (const a of articles) {
  if (!a.slug || !a.title || !a.body) throw new Error(`Missing slug/title/body in ${a.file}`);
  if (slugs.has(a.slug)) throw new Error(`Duplicate slug: ${a.slug}`);
  if (titles.has(a.title)) throw new Error(`Duplicate title: ${a.title}`);
  slugs.add(a.slug);
  titles.add(a.title);
}

const byCategory = {};
for (const c of config.categories) byCategory[c.slug] = [];
for (const a of articles) {
  if (!byCategory[a.category]) throw new Error(`Unknown category "${a.category}" in ${a.file}`);
  byCategory[a.category].push(a);
}

// ------------------------------------------------------------------ clean dist
fs.rmSync(DIST, { recursive: true, force: true });
ensureDir(DIST);

// -------------------------------------------------------------- article pages
for (const article of articles) {
  const { html } = tpl.postPage(article, byCategory[article.category]);
  write(`posts/${article.slug}/index.html`, html);
}

// ------------------------------------------------------------ category pages
for (const cat of config.categories) {
  const list = byCategory[cat.slug];
  const crumbHtml = `<nav class="breadcrumbs" aria-label="Breadcrumb"><ol><li><a href="/">Home</a></li><li>${escapeHtml(cat.name)}</li></ol></nav>`;
  const html = tpl.listPage({
    title: `${cat.name} - How-To Guides`,
    description: cat.description,
    path: `/category/${cat.slug}/`,
    heading: cat.name,
    intro: `${escapeHtml(cat.description)} Browse <strong>${list.length}</strong> step-by-step guides below.`,
    articles: list,
    crumbHtml,
    jsonld: [
      tpl.breadcrumbJsonLd([
        { name: 'Home', href: '/' },
        { name: cat.name, href: `/category/${cat.slug}/` }
      ]),
      {
        '@context': 'https://schema.org',
        '@type': 'CollectionPage',
        name: `${cat.name} - How-To Guides`,
        description: cat.description,
        url: config.url + `/category/${cat.slug}/`,
        mainEntity: {
          '@type': 'ItemList',
          numberOfItems: list.length,
          itemListElement: list.map((a, i) => ({
            '@type': 'ListItem',
            position: i + 1,
            url: config.url + a.url,
            name: a.title
          }))
        }
      }
    ]
  });
  write(`category/${cat.slug}/index.html`, html);
}

// ------------------------------------------------------------- static pages
for (const page of pages) {
  const html = tpl.staticPage({
    title: page.title,
    description: page.description,
    path: `/${page.slug}/`,
    bodyHtml: render(page.body),
    crumbs: [{ name: 'Home', href: '/' }, { name: page.title, href: `/${page.slug}/` }],
    jsonld: [
      tpl.breadcrumbJsonLd([
        { name: 'Home', href: '/' },
        { name: page.title, href: `/${page.slug}/` }
      ]),
      {
        '@context': 'https://schema.org',
        '@type': page.slug === 'contact' ? 'ContactPage' : 'WebPage',
        name: page.title,
        description: page.description,
        url: config.url + `/${page.slug}/`
      }
    ]
  });
  write(`${page.slug}/index.html`, html);
}

// ------------------------------------------------------------------ homepage
const featured = articles.filter((a) => a.featured).slice(0, 3);
const latest = articles.slice(0, 6);
const homeSections = config.categories
  .map((cat) => {
    const list = byCategory[cat.slug].slice(0, 6);
    if (!list.length) return '';
    return `
      <section class="home-section">
        <div class="container">
          <div class="section-head">
            <h2>${escapeHtml(cat.name)}</h2>
            <a class="section-more" href="/category/${cat.slug}/">View all ${byCategory[cat.slug].length} guides &rarr;</a>
          </div>
          <div class="card-grid">
            ${list.map((a) => tpl.postCard(a)).join('')}
          </div>
        </div>
      </section>`;
  })
  .join('');

const homeBody = `
      <section class="hero">
        <div class="container">
          <p class="hero-kicker">80+ free step-by-step guides</p>
          <h1>How to do anything - the clear, tested way</h1>
          <p class="hero-sub">${escapeHtml(config.description)}</p>
          <div class="hero-actions">
            <a class="btn btn--primary" href="/all-guides/">Browse all guides</a>
            <a class="btn btn--ghost" href="/about/">How we test</a>
          </div>
          <ul class="hero-topics">
            ${config.categories.map((c) => `<li><a href="/category/${c.slug}/">${escapeHtml(c.name)}</a></li>`).join('')}
          </ul>
        </div>
      </section>
      <div class="container">${tpl.adSlot('top-banner')}</div>
      <section class="home-section">
        <div class="container">
          <div class="section-head">
            <h2>Latest guides</h2>
            <a class="section-more" href="/all-guides/">All ${articles.length} guides &rarr;</a>
          </div>
          <div class="card-grid">
            ${latest.map((a) => tpl.postCard(a)).join('')}
          </div>
        </div>
      </section>
      ${homeSections}
      <section class="cta-band">
        <div class="container">
          <h2>Can't find what you need?</h2>
          <p>Browse the complete library of ${articles.length} how-to guides, or send us a question and our editors will point you to the right tutorial.</p>
          <div class="hero-actions">
            <a class="btn btn--primary" href="/all-guides/">All guides</a>
            <a class="btn btn--ghost" href="/contact/">Ask a question</a>
          </div>
        </div>
      </section>`;

write(
  'index.html',
  tpl.layout({
    title: `${config.siteName} - ${config.tagline}`,
    description: config.description,
    path: '/',
    jsonld: [
      {
        '@context': 'https://schema.org',
        '@type': 'WebSite',
        name: config.siteName,
        url: config.url + '/',
        description: config.description,
        potentialAction: {
          '@type': 'SearchAction',
          target: { '@type': 'EntryPoint', urlTemplate: config.url + '/all-guides/?q={search_term_string}' },
          'query-input': 'required name=search_term_string'
        }
      },
      {
        '@context': 'https://schema.org',
        '@type': 'Blog',
        name: `${config.siteName} Blog`,
        url: config.url + '/',
        publisher: { '@type': 'Organization', name: config.siteName }
      }
    ],
    body: homeBody
  })
);

// ---------------------------------------------------------- all-guides page
const sorted = [...articles].sort((a, b) => a.title.localeCompare(b.title));
write(
  'all-guides/index.html',
  tpl.listPage({
    title: `All ${articles.length} How-To Guides - Complete Library`,
    description: `Every how-to guide on ${config.siteName}: ${articles.length} step-by-step tutorials across technology, home & garden, cooking, DIY and productivity.`,
    path: '/all-guides/',
    heading: `All ${articles.length} guides`,
    intro: `Use the search box or filter by category. Every guide is written and reviewed by our editorial team.\n<input type="search" id="filter-input" class="filter-input" placeholder="Filter these guides..." aria-label="Filter guides">`,
    articles: sorted,
    jsonld: [
      {
        '@context': 'https://schema.org',
        '@type': 'ItemList',
        numberOfItems: articles.length,
        itemListElement: articles.slice(0, 50).map((a, i) => ({
          '@type': 'ListItem',
          position: i + 1,
          url: config.url + a.url,
          name: a.title
        }))
      }
    ]
  })
);

// --------------------------------------------------------------------- 404
write(
  '404.html',
  tpl.layout({
    title: 'Page not found',
    description: 'The page you requested could not be found.',
    path: '/404.html',
    noIndex: true,
    body: `
      <section class="container error-page">
        <h1>404 - Page not found</h1>
        <p>The guide you were looking for may have moved. Try the library instead.</p>
        <a class="btn btn--primary" href="/all-guides/">Browse all guides</a>
      </section>`
  })
);

// --------------------------------------------------------------- search index
write(
  'search-index.json',
  JSON.stringify(
    articles.map((a) => ({
      t: a.title,
      u: a.url,
      d: a.description,
      c: (config.categories.find((x) => x.slug === a.category) || {}).name || a.category
    }))
  )
);

// --------------------------------------------------------------------- RSS
const rssItems = articles
  .slice(0, 30)
  .map(
    (a) => `    <item>
      <title>${escapeHtml(a.title)}</title>
      <link>${config.url}${a.url}</link>
      <guid isPermaLink="true">${config.url}${a.url}</guid>
      <description>${escapeHtml(a.description)}</description>
      <pubDate>${new Date(a.date + 'T08:00:00Z').toUTCString()}</pubDate>
      <category>${escapeHtml(a.category)}</category>
    </item>`
  )
  .join('\n');
write(
  'rss.xml',
  `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${escapeHtml(config.siteName)}</title>
    <link>${config.url}/</link>
    <atom:link href="${config.url}/rss.xml" rel="self" type="application/rss+xml"/>
    <description>${escapeHtml(config.description)}</description>
    <language>en-us</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
${rssItems}
  </channel>
</rss>
`
);

// ------------------------------------------------------------------ sitemap
const staticPaths = [
  { loc: '/', priority: '1.0' },
  { loc: '/all-guides/', priority: '0.8' },
  ...pages.map((p) => ({ loc: `/${p.slug}/`, priority: p.slug === 'about' || p.slug === 'contact' ? '0.7' : '0.3' })),
  ...config.categories.map((c) => ({ loc: `/category/${c.slug}/`, priority: '0.8' }))
];
const postUrls = articles.map((a) => ({ loc: a.url, lastmod: a.updated || a.date, priority: '0.8' }));
const urlEntries = [...staticPaths, ...postUrls]
  .map((u) => `  <url>
    <loc>${config.url}${u.loc}</loc>${u.lastmod ? `\n    <lastmod>${u.lastmod}</lastmod>` : ''}
    <changefreq>weekly</changefreq>
    <priority>${u.priority}</priority>
  </url>`)
  .join('\n');
write('sitemap.xml', `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urlEntries}\n</urlset>\n`);

// ------------------------------------------------- robots.txt + ads.txt
const robotsTxt = `User-agent: *\nAllow: /\n\nSitemap: ${config.url}/sitemap.xml\n`;
write('robots.txt', robotsTxt);
if (config.adsenseClient) {
  write('ads.txt', `google.com, ${config.adsenseClient.replace(/^ca-/, '')}, DIRECT, f08c47fec0942fa0\n`);
}

// ------------------------------------------------------------ static assets
copyDir(path.join(ROOT, 'public'), DIST);
copyDir(path.join(ROOT, 'assets'), path.join(DIST, 'assets'));

// -------------------------------------------------------------------- report
const words = articles.reduce((sum, a) => sum + a.words, 0);
console.log(`Built ${articles.length} articles, ${pages.length} pages, ${config.categories.length} categories.`);
console.log(`Total words: ${words.toLocaleString('en-US')} (avg ${Math.round(words / articles.length).toLocaleString('en-US')} per article)`);
console.log(`Output: ${DIST}`);
