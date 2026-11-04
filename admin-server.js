'use strict';

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

const ADMIN_CATALOG_PATH = path.join(__dirname, 'public', 'admin', 'thumbnails.json');
const UPLOADS_PATH = path.join(__dirname, 'public', 'uploads');
const ALLOWED_IMAGE_EXTS = new Set(['.jpg', '.jpeg', '.png', '.webp', '.svg']);

function readBody(res, statusCode, body) {
  res.writeHead(statusCode, {
    'Content-Type': 'application/json; charset=utf-8',
    'Cache-Control': 'no-store'
  });
  res.end(String(body));
}

function parseJsonBody(req) {
  return new Promise((resolve, reject) => {
    const chunks = [];
    req.on('data', (c) => chunks.push(c));
    req.on('end', () => {
      try { resolve(JSON.parse(Buffer.concat(chunks).toString('utf8'))); }
      catch (err) { reject(new Error('Invalid JSON')); }
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

    if (req.method === 'POST' && urlPath === '/admin/upload-image') {
      return new Promise((resolvePromise) => {
        const chunks = [];
        req.on('data', (c) => chunks.push(c));
        req.on('end', () => {
          let rawBody = Buffer.concat(chunks);
          if (rawBody.length < 1) {
            return readBody(res, 400, JSON.stringify({ error: 'empty request body' }));
          }

          let parsed;
          let rawImage = null;
          const textBody = rawBody.toString('utf8');
          if (textBody.trim().startsWith('{')) {
            try { parsed = JSON.parse(textBody); }
            catch (err) { return readBody(res, 400, JSON.stringify({ error: 'Invalid JSON' })); }
            rawImage = parsed.file;
          } else {
            if (Buffer.isBuffer(rawBody)) { rawImage = rawBody; }
            else { rawImage = rawBody.toString('utf8'); }
            parsed = { file: rawImage };
          }

          const slug = String((parsed && parsed.slug) || '').trim();
          if (!slug) { return readBody(res, 400, JSON.stringify({ error: 'slug is required' })); }
          if (!rawImage || typeof rawImage !== 'string') { return readBody(res, 400, JSON.stringify({ error: 'file is required' })); }

          let bytes;
          if (typeof rawImage === 'string') {
            if (rawImage.startsWith('data:')) {
              const commaIdx = rawImage.indexOf(',');
              if (commaIdx < 0) { return readBody(res, 400, JSON.stringify({ error: 'unsupported data URL' })); }
              try { bytes = Buffer.from(rawImage.slice(commaIdx + 1), 'base64'); }
              catch (err) { return readBody(res, 400, JSON.stringify({ error: 'failed to decode image data' })); }
            } else {
              try { bytes = Buffer.from(rawImage, 'base64'); }
              catch (err) { return readBody(res, 400, JSON.stringify({ error: 'unsupported file format' })); }
            }
          } else if (Buffer.isBuffer(rawImage)) {
            bytes = rawImage;
          } else {
            bytes = Buffer.from(String(rawImage));
          }

          if (!bytes || bytes.length < 1) { return readBody(res, 400, JSON.stringify({ error: 'empty image' })); }
          if (bytes.length > 4 * 1024 * 1024) { return readBody(res, 400, JSON.stringify({ error: 'image is too large. please use a file under 4 mb' })); }

          const magic = (bytes[0] << 8) | (bytes[1] || 0);
          let finalExt = path.extname(slug).toLowerCase();
          if (!ALLOWED_IMAGE_EXTS.has(finalExt)) finalExt = '';
          if (magic === 0x8952 && finalExt !== '.svg') finalExt = '.webp';
          else if (magic >= 0xffd8 && magic <= 0xffd9 && finalExt !== '.svg') finalExt = '.jpg';
          else if (magic === 0x8950 && finalExt !== '.svg') finalExt = '.png';
          else if (finalExt === '.svg') finalExt = '.svg';
          else if (!finalExt) finalExt = '.png';
          const imagePath = path.join(UPLOADS_PATH, slug + finalExt);
          try {
            fs.mkdirSync(UPLOADS_PATH, { recursive: true });
            fs.writeFileSync(imagePath, bytes);
            const url = '/uploads/' + slug + finalExt;
            readBody(res, 200, JSON.stringify({ url }));
          } catch (err) {
            readBody(res, 500, JSON.stringify({ error: String(err.message || err) }));
          }
          resolvePromise();
        });
      });
    }

    let filePath;
    if (urlPath.startsWith('/uploads')) {
      filePath = path.join(__dirname, 'public', urlPath);
    } else {
      filePath = path.join(ROOT, urlPath);
      if (urlPath.endsWith('/')) filePath = path.join(filePath, 'index.html');
    }
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
    const ct = TYPES[ext] || 'application/octet-stream';
    const body = fs.readFileSync(filePath);
    res.writeHead(200, {
      'Content-Type': ct,
      'Content-Length': String(body.length),
      'Cache-Control': 'public, max-age=600'
    });
    res.end(body);
  })
  .listen(PORT, '127.0.0.1', () => console.log('Admin+preview server listening on http://localhost:' + PORT));
