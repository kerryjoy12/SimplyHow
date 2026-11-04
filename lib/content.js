'use strict';

const fs = require('fs');
const path = require('path');

function parseFaqs(lines, start) {
  const faqs = [];
  let current = null;
  let i = start;
  while (i < lines.length) {
    const line = lines[i];
    if (!/\S/.test(line)) break;
    let m = line.match(/^\s+-\s+q:\s*(.*)$/);
    if (m) {
      current = { q: m[1].trim(), a: '' };
      faqs.push(current);
      i++;
      continue;
    }
    m = line.match(/^\s+a:\s*(.*)$/);
    if (m && current) {
      current.a = m[1].trim();
      i++;
      continue;
    }
    m = line.match(/^\s{4,}(\S.*)$/);
    if (m && current && current.a) {
      current.a += ' ' + m[1].trim();
      i++;
      continue;
    }
    break;
  }
  return { faqs, next: i };
}

function parseFrontmatter(raw) {
  const normalized = String(raw).replace(/\r\n/g, '\n');
  const match = normalized.match(/^---\n([\s\S]*?)\n---\n?([\s\S]*)$/);
  if (!match) return { data: {}, body: normalized.trim() };

  const lines = match[1].split('\n');
  const data = {};
  let i = 0;
  while (i < lines.length) {
    const line = lines[i];
    if (!/\S/.test(line)) {
      i++;
      continue;
    }
    const kv = line.match(/^([A-Za-z][A-Za-z0-9_]*):\s*(.*)$/);
    if (!kv) {
      i++;
      continue;
    }
    const key = kv[1];
    const value = kv[2].trim();
    if (value === '') {
      if (key === 'faqs') {
        const parsed = parseFaqs(lines, i + 1);
        data.faqs = parsed.faqs;
        i = parsed.next;
      } else {
        const arr = [];
        i++;
        while (i < lines.length && /^\s+-\s+/.test(lines[i])) {
          arr.push(lines[i].replace(/^\s+-\s+/, '').trim());
          i++;
        }
        data[key] = arr;
      }
      continue;
    }
    data[key] = value;
    i++;
  }

  const body = match[2].trim();
  if (typeof data.tags === 'string') data.tags = data.tags.split(',').map((s) => s.trim()).filter(Boolean);
  if (typeof data.keywords === 'string') data.keywords = data.keywords.split(',').map((s) => s.trim()).filter(Boolean);
  if (typeof data.featured === 'string') data.featured = data.featured === 'true';
  return { data, body };
}

function readingTime(body, faqs = []) {
  const words = (body + ' ' + faqs.map((f) => f.a).join(' ')).split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(words / 200));
}

function countWords(body, faqs = []) {
  return (body + ' ' + faqs.map((f) => `${f.q} ${f.a}`).join(' ')).split(/\s+/).filter(Boolean).length;
}

function loadArticles(dir) {
  const files = fs.readdirSync(dir).filter((f) => f.endsWith('.md'));
  const articles = files.map((file) => {
    const raw = fs.readFileSync(path.join(dir, file), 'utf8');
    const { data, body } = parseFrontmatter(raw);
    return {
      ...data,
      body,
      file,
      url: `/posts/${data.slug}/`,
      words: countWords(body, data.faqs || []),
      readingTime: readingTime(body, data.faqs || []),
      outline: require('./markdown').outline(body)
    };
  });
  articles.sort((a, b) => String(b.date).localeCompare(String(a.date)));
  return articles;
}

function loadPages(dir) {
  const files = fs.readdirSync(dir).filter((f) => f.endsWith('.md'));
  return files.map((file) => {
    const raw = fs.readFileSync(path.join(dir, file), 'utf8');
    const { data, body } = parseFrontmatter(raw);
    return { ...data, body, file };
  });
}

module.exports = { parseFrontmatter, loadArticles, loadPages, countWords, readingTime };
