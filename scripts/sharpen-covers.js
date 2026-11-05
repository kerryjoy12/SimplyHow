/**
 * Bake a high-quality upscale + unsharp mask into the /uploads covers.
 *
 * The covers started life as Excel cell previews (179x100), so the browser has
 * to stretch them a long way and they read as blurry. A Lanczos3 resample with
 * a light unsharp mask keeps the same display size but is visibly crisper than
 * the browser's smooth stretch.
 *
 * Usage: node scripts/sharpen-covers.js [--width 1280] [--dry]
 */
const fs = require('fs');
const path = require('path');
const { chromium } = require('playwright');

const DIR = path.join(__dirname, '..', 'public', 'uploads');
const args = process.argv.slice(2);
const wIdx = args.indexOf('--width');
const WIDTH = wIdx === -1 ? 1280 : Number(args[wIdx + 1]) || 1280;
const DRY = args.includes('--dry');
const oIdx = args.indexOf('--only');
const ONLY = oIdx === -1 ? null : args[oIdx + 1];

const MIME = {
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.webp': 'image/webp',
  '.png': 'image/png',
};

// One file per slug: prefer nothing, just take every supported image.
function listCovers(dir) {
  return fs
    .readdirSync(dir)
    .sort()
    .filter((f) => MIME[path.extname(f).toLowerCase()])
    .filter((f) => !ONLY || f.includes(ONLY));
}

(async () => {
  const files = listCovers(DIR);
  // Use the installed Chrome: the bundled Playwright browser may not be downloaded.
  const browser = await chromium.launch({ channel: 'chrome' });
  const page = await browser.newPage();
  await page.setContent('<body></body>');

  for (const f of files) {
    const file = path.join(DIR, f);
    const mime = MIME[path.extname(f).toLowerCase()];
    const b64 = fs.readFileSync(file).toString('base64');

    const res = await page.evaluate(
      async ({ b64, mime, WIDTH }) => {
        const tStart = performance.now();
        const img = new Image();
        img.src = 'data:' + mime + ';base64,' + b64;
        await img.decode();
        const sw = img.naturalWidth;
        const sh = img.naturalHeight;
        if (sw >= WIDTH) return { skip: true, sw, sh };

        const c = document.createElement('canvas');
        c.width = sw;
        c.height = sh;
        const cx = c.getContext('2d');
        cx.drawImage(img, 0, 0);
        const src = cx.getImageData(0, 0, sw, sh).data;

        const tw = WIDTH;
        const th = Math.max(1, Math.round((sh * WIDTH) / sw));

        // --- separable Lanczos3 upsample -------------------------------
        const a = 3;
        const kernel = (x) => {
          if (x === 0) return 1;
          if (x <= -a || x >= a) return 0;
          const px = Math.PI * x;
          return (Math.sin(px) / px) * (Math.sin(px / a) / (px / a));
        };
        const taps = (dstN, srcN) => {
          const scale = srcN / dstN;
          const support = a * Math.max(1, scale);
          const list = [];
          for (let i = 0; i < dstN; i++) {
            const center = (i + 0.5) * scale - 0.5;
            const lo = Math.floor(center - support + 1);
            const hi = Math.ceil(center + support - 1);
            const w = [];
            let sum = 0;
            for (let j = lo; j <= hi; j++) {
              const k = kernel((j - center) / Math.max(1, scale));
              w.push([j, k]);
              sum += k;
            }
            list.push({ w, sum });
          }
          return list;
        };

        const hx = taps(tw, sw);
        const hy = taps(th, sh);

        const tmp = new Float32Array(tw * sh * 4);
        for (let y = 0; y < sh; y++) {
          for (let x = 0; x < tw; x++) {
            const { w, sum } = hx[x];
            let r = 0;
            let g = 0;
            let b = 0;
            for (let k = 0; k < w.length; k++) {
              const sx = Math.min(sw - 1, Math.max(0, w[k][0]));
              const o = (y * sw + sx) * 4;
              const wt = w[k][1] / sum;
              r += src[o] * wt;
              g += src[o + 1] * wt;
              b += src[o + 2] * wt;
            }
            const d = (y * tw + x) * 4;
            tmp[d] = r;
            tmp[d + 1] = g;
            tmp[d + 2] = b;
            tmp[d + 3] = 255;
          }
        }

        const out = new Float32Array(tw * th * 4);
        for (let y = 0; y < th; y++) {
          const { w, sum } = hy[y];
          for (let x = 0; x < tw; x++) {
            let r = 0;
            let g = 0;
            let b = 0;
            for (let k = 0; k < w.length; k++) {
              const sy = Math.min(sh - 1, Math.max(0, w[k][0]));
              const o = (sy * tw + x) * 4;
              const wt = w[k][1] / sum;
              r += tmp[o] * wt;
              g += tmp[o + 1] * wt;
              b += tmp[o + 2] * wt;
            }
            const d = (y * tw + x) * 4;
            out[d] = r;
            out[d + 1] = g;
            out[d + 2] = b;
            out[d + 3] = 255;
          }
        }

        // --- two-scale unsharp mask ------------------------------------
        // fine radius brings back edge definition, wide radius adds local
        // midtone contrast so the photo stops looking washed out.
        const clamp = (v) => (v < 0 ? 0 : v > 255 ? 255 : v);

        // Separable triple box blur == close enough to a gaussian of this radius.
        // Sliding window sums keep it O(1) per pixel.
        const blurChannel = (radius) => {
          const n = radius * 2 + 1;
          const cur = new Float32Array(tw * th * 3);
          for (let i = 0, j = 0; i < out.length; i += 4, j += 3) {
            cur[j] = out[i];
            cur[j + 1] = out[i + 1];
            cur[j + 2] = out[i + 2];
          }
          let next = new Float32Array(cur.length);
          const len = tw + radius * 2;
          // +1 padding slot stays 0 so the last window can still read ahead
          const buf = new Float32Array(len + 1);
          const vlen = th + radius * 2;
          const vbuf = new Float32Array(vlen + 1);

          for (let pass = 0; pass < 3; pass++) {
            // horizontal
            for (let y = 0; y < th; y++) {
              for (let ch = 0; ch < 3; ch++) {
                for (let k = 0; k < len; k++) {
                  const sx = Math.min(tw - 1, Math.max(0, k - radius));
                  buf[k] = cur[(y * tw + sx) * 3 + ch];
                }
                let sum = 0;
                for (let k = 0; k < n; k++) sum += buf[k];
                for (let x = 0; x < tw; x++) {
                  next[(y * tw + x) * 3 + ch] = sum / n;
                  sum += buf[x + n] - buf[x];
                }
              }
            }
            cur.set(next);
            // vertical
            for (let x = 0; x < tw; x++) {
              for (let ch = 0; ch < 3; ch++) {
                for (let k = 0; k < vlen; k++) {
                  const sy = Math.min(th - 1, Math.max(0, k - radius));
                  vbuf[k] = cur[(sy * tw + x) * 3 + ch];
                }
                let sum = 0;
                for (let k = 0; k < n; k++) sum += vbuf[k];
                for (let y = 0; y < th; y++) {
                  next[(y * tw + x) * 3 + ch] = sum / n;
                  sum += vbuf[y + n] - vbuf[y];
                }
              }
            }
            cur.set(next);
          }
          return cur;
        };

        const FINE_RADIUS = 1;
        const WIDE_RADIUS = 6;
        const FINE_AMOUNT = 0.7;
        const WIDE_AMOUNT = 0.28;
        const fine = blurChannel(FINE_RADIUS);
        const wide = blurChannel(WIDE_RADIUS);

        const sharp = new Uint8ClampedArray(out.length);
        for (let i = 0, j = 0; i < out.length; i += 4, j += 3) {
          for (let ch = 0; ch < 3; ch++) {
            const v = out[i + ch];
            sharp[i + ch] = clamp(
              v + FINE_AMOUNT * (v - fine[j + ch]) + WIDE_AMOUNT * (v - wide[j + ch])
            );
          }
          sharp[i + 3] = 255;
        }

        const o2 = document.createElement('canvas');
        o2.width = tw;
        o2.height = th;
        o2.getContext('2d').putImageData(new ImageData(sharp, tw, th), 0, 0);
        const type = mime === 'image/png' ? 'image/png' : mime;
        const blob = await new Promise((r) => o2.toBlob(r, type, type === 'image/jpeg' ? 0.86 : 0.9));
        const buf = new Uint8Array(await blob.arrayBuffer());
        let bin = '';
        const CH = 0x8000;
        for (let i = 0; i < buf.length; i += CH) {
          bin += String.fromCharCode.apply(null, buf.subarray(i, i + CH));
        }
        return { sw, sh, tw, th, ms: Math.round(performance.now() - tStart), dataUrl: btoa(bin) };
      },
      { b64, mime, WIDTH }
    );

    if (res.skip) {
      console.log('skip   ' + f + ' (already ' + res.sw + 'x' + res.sh + ')');
      continue;
    }
    const outBuf = Buffer.from(res.dataUrl, 'base64');
    console.log(
      (DRY ? 'would  ' : 'wrote  ') +
        f +
        '  ' +
        res.sw +
        'x' +
        res.sh +
        ' -> ' +
        res.tw +
        'x' +
        res.th +
        '  ' +
        (outBuf.length / 1024).toFixed(0) +
        'KB  (' +
        res.ms +
        'ms)'
    );
    if (!DRY) fs.writeFileSync(file, outBuf);
  }

  await browser.close();
})();
