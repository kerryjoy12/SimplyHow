import { chromium } from 'playwright';

const WIDTH = 375;
const PAGES = [
  '/',
  '/category/productivity/',
  '/posts/how-to-focus-when-everything-is-distracting/',
  '/posts/how-to-speed-up-a-slow-laptop/',
  '/all-guides/',
  '/admin/'
];

const results = [];
let browser;
try {
  browser = await chromium.launch({ headless: true });
  const ctx = await browser.newContext({ viewport: { width: WIDTH, height: 800 } });
  const page = await ctx.newPage();
  for (const path of PAGES) {
    const url = `http://localhost:4173${path}`;
    try {
      const consoleErrors = [];
      page.on('console', (msg) => {
        if (msg.type() === 'error') consoleErrors.push(String(msg.text()));
      });
      page.on('pageerror', (e) => consoleErrors.push(String(e)));
      await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 25000 });
      await page.waitForTimeout(700);
      const overflow = await page.evaluate(() => {
        const w = document.documentElement.scrollWidth;
        const cw = document.documentElement.clientWidth;
        return w > cw + 1;
      });
      results.push({ path, overflow, consoleErrors: consoleErrors.slice(0, 3) });
    } catch (err) {
      results.push({ path, overflow: null, consoleErrors: [], error: String(err) });
    }
  }
} catch (err) {
  results.push({ path: '', overflow: null, consoleErrors: [], error: String(err) });
} finally {
  await browser?.close();
}
for (const r of results) console.log(JSON.stringify(r));
