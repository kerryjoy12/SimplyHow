# SimplyHow - how-to guides website

A zero-dependency static site with how-to guides, category hubs, policy pages, SEO
metadata, JSON-LD, a sitemap, RSS, and site search. Passing project checks does not
guarantee AdSense approval; Google reviews the deployed site and its content.

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

1. Provide the real public domain, configure it in `site.config.js` (without a trailing slash), and deploy over HTTPS.
2. Verify that domain in **Google Search Console** and submit the deployed sitemap.
3. Use accurate publisher/author information and review articles for originality, accuracy, sources, safety, and real editorial practices. Do not claim testing or credentials that did not occur.
4. Confirm the contact email works and all policies describe the services actually used.
5. Apply to AdSense and complete Google's site-ownership verification.
6. Ads are currently disabled. **Do not enable ads by only setting `adsenseClient`**: this project does not implement a consent management platform. Before serving ads, configure the appropriate Google-certified CMP and regional consent behavior, then verify the privacy disclosures and generated `ads.txt` against the publisher ID in your AdSense account.

## Already in place

- Privacy Policy, Terms, Disclaimer, Cookie Policy, Editorial Policy, About, Contact - all linked from the footer and navigable from the header menu
- No analytics, ad code, cookies, or local-storage consent banner are currently enabled
- Per-page title/description/canonical/OG/Twitter tags
- JSON-LD: WebSite, Blog, BlogPosting, FAQPage, BreadcrumbList, CollectionPage, ItemList, ContactPage
- `sitemap.xml`, `robots.txt` (points at the sitemap), `rss.xml`, `404.html`
- Client-side search, mobile hamburger nav, reading time + word counts
