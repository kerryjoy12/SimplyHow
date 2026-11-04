'use strict';

// Tiny static file server for local preview (zero dependencies).
const http = require('http');
const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, 'dist');
const PORT = process.env.PORT || 4173;

const TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.xml': 'application/xml; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.txt': 'text/plain; charset=utf-8'
};

// Source-of-truth catalog lives in the project (not in dist), so edits survive rebuilds.
const ADMIN_CATALOG_PATH = path.join(__dirname, 'public', 'admin', 'thumbnails.json');

function readBody(res, statusCode, body) {
  const chunk = String(body);
  res.writeHead(statusCode, {
    'Content-Type': 'application/json; charset=utf-8',
    'Cache-Control': 'no-store'
  });
  res.end(chunk);
}

function parseJsonBody(req) {
  return new Promise((resolve, reject) => {
    const chunks = [];
    req.on('data', (c) => chunks.push(c));
    req.on('end', () => {
      try {
        resolve(JSON.parse(Buffer.concat(chunks).toString('utf8')));
      } catch (err) {
        reject(new Error('Invalid JSON'));
      }
    });
    req.on('error', reject);
  });
}

function isValidCatalog(value) {
  if (!value || typeof value !== 'object') return false;
  if (!Array.isArray(value.rows)) return false;
  for (const row of value.rows) {
    if (!row || typeof row !== 'object') return false;
    if (typeof row.slug !== 'string' || !row.slug.trim()) return false;
    if (row.coverImage !== undefined && row.coverImage !== null && typeof row.coverImage !== 'string') return false;
  }
  return true;
}

function withCors(res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, PUT, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
}

http
  .createServer((req, res) => {
    withCors(res);

    if (req.method === 'OPTIONS') {
      res.writeHead(204);
      res.end();
      return;
    }

    const urlPath = decodeURIComponent(req.url.split('?')[0]);

    // Persist admin thumbnail catalog.
    if ((req.method === 'PUT' || req.method === 'POST') && urlPath === '/admin/thumbnails.json') {
      parseJsonBody(req)
        .then((body) => {
          if (!isValidCatalog(body)) {
            return readBody(res, 400, JSON.stringify({ error: 'Invalid catalog payload' }));
          }

          const normalized = {
            columns: ['slug', 'coverImage'],
            rows: body.rows
              .map((r) => ({
                slug: String(r.slug).trim(),
                coverImage: r.coverImage == null ? '' : String(r.coverImage).trim()
              }))
              .filter((r) => r.slug)
          };

          try {
            fs.mkdirSync(path.dirname(ADMIN_CATALOG_PATH), { recursive: true });
            fs.writeFileSync(ADMIN_CATALOG_PATH, JSON.stringify(normalized, null, 2) + '\n', 'utf8');
            readBody(res, 200, JSON.stringify(normalized));
          } catch (err) {
            readBody(res, 500, JSON.stringify({ error: String(err.message || err) }));
          }
        })
        .catch(() => readBody(res, 400, JSON.stringify({ error: 'Invalid JSON' })));
        return;
    }

    // Static file serving.
    let filePath = path.join(ROOT, urlPath);
    if (urlPath.endsWith('/')) filePath = path.join(filePath, 'index.html');
    if (!fs.existsSync(filePath) || fs.statSync(filePath).isDirectory()) {
      if (fs.existsSync(filePath + 'index.html')) filePath = path.join(filePath, 'index.html');
      else {
        const notFound = path.join(ROOT, '404.html');
        res.writeHead(404, { 'Content-Type': 'text/html; charset=utf-8' });
        res.end(fs.existsSync(notFound) ? fs.readFileSync(notFound) : '404');
        return;
      }
    }
    const ext = path.extname(filePath).toLowerCase();
    res.writeHead(200, { 'Content-Type': TYPES[ext] || 'application/octet-stream' });
    res.end(fs.readFileSync(filePath));
  })
  .listen(PORT, () => console.log(`Preview: http://localhost:${PORT}`));
