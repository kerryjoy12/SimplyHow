'use strict';

const fs = require('fs');
const path = require('path');

// Seed Unsplash cover URLs for articles that currently have no coverImage.
const SEED = {
  'how-to-back-up-your-iphone': 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=1200&q=80&auto=format&fit=crop',
  'how-to-connect-a-wireless-printer': 'https://images.unsplash.com/photo-1581094131552-74b7c79cca3c?w=1200&q=80&auto=format&fit=crop',
  'how-to-convert-a-pdf-to-word': 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=1200&q=80&auto=format&fit=crop',
  'how-to-declutter-your-digital-life': 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=1200&q=80&auto=format&fit=crop',
  'how-to-edit-videos-on-your-phone': 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=1200&q=80&auto=format&fit=crop',
  'how-to-factory-reset-a-laptop': 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=1200&q=80&auto=format&fit=crop',
  'how-to-free-up-space-on-your-android-phone': 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=1200&q=80&auto=format&fit=crop',
  'how-to-improve-wifi-signal-throughout-your-house': 'https://images.unsplash.com/photo-1558098329-a11cff621c80?w=1200&q=80&auto=format&fit=crop',
  'how-to-make-a-website': 'https://images.unsplash.com/photo-1497366216548-633587f6b108?w=1200&q=80&auto=format&fit=crop',
  'how-to-overcome-procrastination': 'https://images.unsplash.com/photo-1478115041060-422e7f0a3270?w=1200&q=80&auto=format&fit=crop',
  'how-to-plan-your-week': 'https://images.unsplash.com/photo-1487654896293-20c9e00c3e5e?w=1200&q=80&auto=format&fit=crop',
  'how-to-recover-deleted-files': 'https://images.unsplash.com/photo-1533908515957-6b549f5daee8?w=1200&q=80&auto=format&fit=crop',
  'how-to-secure-your-home-wifi-network': 'https://images.unsplash.com/photo-1558098329-a11cff621c80?w=1200&q=80&auto=format&fit=crop',
  'how-to-set-up-dual-monitors': 'https://images.unsplash.com/photo-1593284625817-2078b34d7a3c?w=1200&q=80&auto=format&fit=crop',
  'how-to-set-up-parental-controls': 'https://images.unsplash.com/photo-1571260899304-425eee4c7ebf?w=1200&q=80&auto=format&fit=crop',
  'how-to-speed-up-a-slow-laptop': 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=1200&q=80&auto=format&fit=crop',
  'how-to-start-a-youtube-channel': 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=1200&q=80&auto=format&fit=crop',
  'how-to-take-effective-notes': 'https://images.unsplash.com/photo-1499750310107-5fef28678136?w=1200&q=80&auto=format&fit=crop',
  'how-to-transfer-whatsapp-chats-to-a-new-phone': 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=1200&q=80&auto=format&fit=crop',
  'how-to-use-google-drive': 'https://images.unsplash.com/photo-1581094131552-74b7c79cca3c?w=1200&q=80&auto=format&fit=crop'
};

const ROOT = process.cwd();
const CATALOG_PATH = path.join(ROOT, 'public', 'admin', 'thumbnails.json');

function main() {
  if (!fs.existsSync(CATALOG_PATH)) {
    console.error('thumbnails.json not found at', CATALOG_PATH);
    process.exit(1);
  }

  const catalog = JSON.parse(fs.readFileSync(CATALOG_PATH, 'utf8'));
  const existing = Object.fromEntries(
    (catalog.rows || []).map((r) => [r.slug, String(r.coverImage || '').trim()])
  );

  let added = 0;
  for (const [slug, url] of Object.entries(SEED)) {
    if (!url) continue;
    if (existing[slug] && existing[slug] !== url) {
      console.log(`skip ${slug}: already has a different coverImage in catalog`);
      continue;
    }
    if (existing[slug] === url) {
      console.log(`skip ${slug}: already seeded`);
      continue;
    }
    existing[slug] = url;
    added++;
  }

  catalog.rows = Object.keys(existing)
    .sort()
    .map((slug) => ({ slug, coverImage: existing[slug] }));

  fs.writeFileSync(CATALOG_PATH, JSON.stringify(catalog, null, 2) + '\n', 'utf8');
  console.log(`Seeded ${added} cover images into public/admin/thumbnails.json`);
  console.log(`Total catalog rows now: ${catalog.rows.length}`);
}

main();
