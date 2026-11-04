'use strict';

// Local preview + admin server for SimplyHow.
// Serves dist/ as the site, adds /admin image uploads and persists the cover
// catalog in public/admin/thumbnails.json (the file `node build.js` reads).

const http = require('http');
const fs = require('fs');
const path = require('path');

const ROOT = __dirname;
const DIST = path.join(ROOT, 'dist');
const PORT = Number(process.env.PORT || 4173);
const HOST = process.env.HOST || '127.0.0.1';

const PUBLIC_DIR = path.join(ROOT, 'public');
const UPLOADS_DIR = path.join(PUBLIC_DIR, 'uploads');
const CATALOG_SRC = path.join(PUBLIC_DIR, 'admin', 'thumbnails.json');
const CATALOG_DIST = path.join(DIST, 'admin', 'thumbnails.json');

const TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.xml': 'application/xml; charset=utf-8',
  '.txt': 'text/plain; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.webp': 'image/webp',
  '.gif': 'image/gif',
  '.ico': 'image/x-icon'
};

const IMAGE_EXTS = new Set(['.jpg', '.jpeg', '.png', '.webp', '.gif', '.svg']);
const MAX_UPLOAD_BYTES = 8 * 1024 * 1024;

function send(res, status, type, body, extra) {
  const headers = Object.assign({ 'Content-Type': type, 'Content-Length': Buffer.byteLength(body) }, extra || {});
  res.writeHead(status, headers);
  res.end(body);
}

function sendJson(res, status, value) {
  send(res, status, 'application/json; charset=utf-8', JSON.stringify(value), { 'Cache-Control': 'no-store' });
}

function notFound(res) {
  const page = path.join(DIST, '404.html');
  const body = fs.existsSync(page) ? fs.readFileSync(page) : Buffer.from('404 - Page not found');
  send(res, 404, 'text/html; charset=utf-8', body);
}

function readJsonBody(req) {
  return new Promise((resolve, reject) => {
    const chunks = [];
    let size = 0;
    req.on('data', (chunk) => {
      size += chunk.length;
      if (size > 40 * 1024 * 1024) {
        reject(new Error('request body too large'));
        req.destroy();
        return;
      }
      chunks.push(chunk);
    });
    req.on('end', () => {
      try { resolve(JSON.parse(Buffer.concat(chunks).toString('utf8'))); }
      catch { reject(new Error('invalid JSON body')); }
    });
    req.on('error', reject);
  });
}

function normalizeCatalog(value) {
  const rows = (value && Array.isArray(value.rows) ? value.rows : [])
    .map((row) => ({
      slug: String((row && row.slug) || '').trim(),
      coverImage: row && row.coverImage != null ? String(row.coverImage).trim() : ''
    }))
    .filter((row) => row.slug);
  return { columns: ['slug', 'coverImage'], rows };
}

function readCatalog() {
  const file = fs.existsSync(CATALOG_SRC) ? CATALOG_SRC : CATALOG_DIST;
  if (!fs.existsSync(file)) return { columns: ['slug', 'coverImage'], rows: [] };
  try { return normalizeCatalog(JSON.parse(fs.readFileSync(file, 'utf8'))); }
  catch { return { columns: ['slug', 'coverImage'], rows: [] }; }
}

function writeCatalog(catalog) {
  const json = JSON.stringify(catalog, null, 2) + '\n';
  fs.mkdirSync(path.dirname(CATALOG_SRC), { recursive: true });
  fs.writeFileSync(CATALOG_SRC, json, 'utf8');
  if (fs.existsSync(path.dirname(CATALOG_DIST))) {
    fs.writeFileSync(CATALOG_DIST, json, 'utf8');
  }
}

function safeSlug(value) {
  return String(value || '')
    .trim()
    .toLowerCase()
    .replace(/\.[a-z0-9]+$/, '')
    .replace(/[^a-z0-9-]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 120);
}

// Pick the real image extension from the bytes, so a .png that is really a
// JPEG still gets served with a content type the browser accepts.
function detectExt(bytes) {
  if (bytes.length >= 3 && bytes[0] === 0xff && bytes[1] === 0xd8 && bytes[2] === 0xff) return '.jpg';
  if (bytes.length >= 8 && bytes[0] === 0x89 && bytes[1] === 0x50 && bytes[2] === 0x4e && bytes[3] === 0x47) return '.png';
  if (bytes.length >= 12 && bytes.slice(0, 4).toString('latin1') === 'RIFF' && bytes.slice(8, 12).toString('latin1') === 'WEBP') return '.webp';
  if (bytes.length >= 4 && bytes.slice(0, 3).toString('latin1') === 'GIF') return '.gif';
  const head = bytes.slice(0, 400).toString('utf8');
  if (head.includes('<svg') || head.includes('<?xml')) return '.svg';
  return '.png';
}

function handleUpload(req, res) {
  readJsonBody(req)
    .then((body) => {
      const slug = safeSlug(body && body.slug);
      if (!slug) return sendJson(res, 400, { error: 'an article slug is required' });

      const raw = body && body.file;
      if (typeof raw !== 'string' || !raw) return sendJson(res, 400, { error: 'an image file is required' });

      let bytes;
      if (raw.startsWith('data:')) {
        const comma = raw.indexOf(',');
        if (comma < 0) return sendJson(res, 400, { error: 'unsupported image data' });
        bytes = Buffer.from(raw.slice(comma + 1), 'base64');
      } else {
        bytes = Buffer.from(raw, 'base64');
      }
      if (!bytes.length) return sendJson(res, 400, { error: 'the uploaded image was empty' });
      if (bytes.length > MAX_UPLOAD_BYTES) {
        return sendJson(res, 400, { error: 'that image is larger than 8 MB - please use a smaller file' });
      }

      let ext = String((body && body.filename) || '').toLowerCase();
      ext = path.extname(ext);
      if (!IMAGE_EXTS.has(ext)) ext = detectExt(bytes);

      const name = slug + ext;
      fs.mkdirSync(UPLOADS_DIR, { recursive: true });
      fs.writeFileSync(path.join(UPLOADS_DIR, name), bytes);
      sendJson(res, 200, { url: '/uploads/' + name, bytes: bytes.length });
    })
    .catch((err) => sendJson(res, 400, { error: String(err.message || err) }));
}

function serveFile(req, res, filePath, urlPath) {
  const stat = fs.statSync(filePath);
  const type = TYPES[path.extname(filePath).toLowerCase()] || 'application/octet-stream';
  const etag = 'W/"' + stat.size.toString(16) + '-' + Math.floor(stat.mtimeMs).toString(16) + '"';
  // Images and stylesheets rarely change under the same path, HTML changes on
  // every build: cache the heavy stuff and revalidate the pages cheaply.
  const longLived = urlPath.startsWith('/uploads/') || urlPath.startsWith('/assets/');
  const cacheControl = longLived ? 'public, max-age=604800, stale-while-revalidate=86400' : 'no-cache';

  if (req.headers['if-none-match'] === etag) {
    res.writeHead(304, { ETag: etag, 'Cache-Control': cacheControl });
    res.end();
    return;
  }

  res.writeHead(200, {
    'Content-Type': type,
    'Content-Length': String(stat.size),
    'Cache-Control': cacheControl,
    ETag: etag,
    'Last-Modified': stat.mtime.toUTCString()
  });
  if (req.method === 'HEAD') {
    res.end();
    return;
  }
  fs.createReadStream(filePath).pipe(res);
}

function resolveStatic(urlPath) {
  if (urlPath === '/uploads' || urlPath === '/uploads/') return path.join(UPLOADS_DIR, 'index.html');
  if (urlPath.startsWith('/uploads/')) return path.join(PUBLIC_DIR, urlPath);
  return path.join(DIST, urlPath);
}

const server = http.createServer((req, res) => {
  const urlPath = decodeURIComponent((req.url || '/').split('?')[0]);
  const method = req.method || 'GET';

  if (method === 'OPTIONS') {
    res.writeHead(204, {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type'
    });
    res.end();
    return;
  }

  // Cover catalog: always read/write the copy build.js consumes.
  if (urlPath === '/admin/thumbnails.json') {
    if (method === 'GET') return sendJson(res, 200, readCatalog());
    if (method === 'PUT' || method === 'POST') {
      return readJsonBody(req)
        .then((body) => {
          const catalog = normalizeCatalog(body);
          writeCatalog(catalog);
          sendJson(res, 200, catalog);
        })
        .catch((err) => sendJson(res, 400, { error: String(err.message || err) }));
    }
  }

  if (urlPath === '/admin/upload-image' && (method === 'POST' || method === 'PUT')) {
    return handleUpload(req, res);
  }

  if (method !== 'GET' && method !== 'HEAD') {
    return sendJson(res, 405, { error: 'method not allowed' });
  }

  let filePath = resolveStatic(urlPath);

  // Keep requests inside the directory they are meant to serve.
  const allowedRoots = [DIST, PUBLIC_DIR];
  const insideAllowed = allowedRoots.some((root) => path.resolve(filePath).startsWith(path.resolve(root)));
  if (!insideAllowed) return notFound(res);

  if (fs.existsSync(filePath) && fs.statSync(filePath).isDirectory()) {
    filePath = path.join(filePath, 'index.html');
  }
  if (!fs.existsSync(filePath) && !path.extname(filePath)) {
    const asHtml = filePath + '.html';
    if (fs.existsSync(asHtml)) filePath = asHtml;
  }
  if (!fs.existsSync(filePath) || !fs.statSync(filePath).isFile()) return notFound(res);

  serveFile(req, res, filePath, urlPath);
});

server.listen(PORT, HOST, () => {
  console.log('SimplyHow preview + admin running at http://' + HOST + ':' + PORT + '/admin');
});
