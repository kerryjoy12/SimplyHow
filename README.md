# SimplyHow - AdSense-ready how-to blog (80 articles)

A complete, zero-dependency static blog: 80 original how-to guides (2000+ words each),
five category hubs, full policy page set, SEO metadata + JSON-LD schema, sitemap, RSS,
site search and cookie consent - everything Google AdSense reviewers check for.

## Commands

```bash
npm run check   # content QA: word counts >= 2000, meta, FAQs, internal links
npm run build   # generates the site into dist/
npm run serve   # local preview at http://localhost:4173
npm run all     # check + build
```

Node 18+ required. No npm dependencies to install.

## Content

- `content/articles/*.md` - 80 guides (frontmatter + markdown body)
- `content/pages/*.md` - about, contact, privacy policy, terms, disclaimer, cookie policy, editorial policy

Article frontmatter:

```
---
title, slug, description (meta), keywords, category, tags, author, date, updated, featured
faqs:
  - q: Question?
    a: Answer (1-3 sentences, FAQPage schema generated automatically)
---
```

Body markdown: `##` / `###` headings, paragraphs, lists, `**bold**`, `*italic*`,
`[links](/posts/slug-or-page/)`, `> quotes`, `---` rules. Every article also gets an
auto-generated table of contents, FAQ section, author box and 3 related guides.

## Deploy

```bash
npm run all
# then publish the dist/ folder to your host
```

- **Netlify / Vercel / Cloudflare Pages**: connect the repo, build command `npm run all`, publish directory `dist`.
- **GitHub Pages**: upload `dist/` contents to the `gh-pages` branch (keep `404.html`).
- Any static host works - the site is plain HTML/CSS/JS.

## Go-live checklist (AdSense)

1. **Buy a custom domain** and serve the site over **HTTPS** (all major hosts do this automatically).
2. Edit `site.config.js`: set `url` to your real domain (no trailing slash) and rebuild.
3. Write a real author identity in `site.config.js` (`author.name`, `author.jobTitle`) - AdSense favors clear E-E-A-T ownership.
4. Verify the site in **Google Search Console** and submit `sitemap.xml`.
5. **Apply to AdSense** (ads.txt is NOT added until approved - see next step).
6. After approval: put your publisher ID in `site.config.js` → `adsenseClient: 'ca-pub-xxxxxxxxxxxxxxxx'`, rebuild. This enables the top-banner, in-article and below-content ad slots **and** generates a correct `ads.txt`.
7. Add a 1200x630 social image and set `og:image` in `lib/template.js` if you want richer social shares.

Pre-approval the site deliberately ships **without** ad code (the ad slots stay hidden),
so reviewers only see clean, fast-loading content.

## Already in place

- Privacy Policy, Terms, Disclaimer, Cookie Policy, Editorial Policy, About, Contact - all linked from the footer and navigable from the header menu
- Cookie consent banner (localStorage, GDPR-style accept/reject)
- Per-page title/description/canonical/OG/Twitter tags
- JSON-LD: WebSite, Blog, BlogPosting, FAQPage, BreadcrumbList, CollectionPage, ItemList, ContactPage
- `sitemap.xml`, `robots.txt` (points at the sitemap), `rss.xml`, `404.html`
- Client-side search, mobile hamburger nav, reading time + word counts
