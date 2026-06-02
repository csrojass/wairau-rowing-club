// Bulk-upload the local photo archive into Sanity's Media library.
// Run: node scripts/upload-media-archive.mjs
//
// - Uploads each *.jpg in /images/ as a Sanity image asset.
// - Sets title + alt text from the filename.
// - Idempotent: Sanity deduplicates by SHA-1, so re-running is safe.
// - Concurrency 5 to balance speed vs rate limits.

import { readFileSync, createReadStream, readdirSync, statSync } from 'node:fs';
import { homedir } from 'node:os';
import { resolve, basename, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { createClient } from '@sanity/client';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, '..');
const ARCHIVE = resolve(ROOT, 'images');

const cfg = JSON.parse(readFileSync(`${homedir()}/.config/sanity/config.json`, 'utf-8'));
const client = createClient({
  projectId: 'or37t6vb',
  dataset: 'production',
  apiVersion: '2024-01-01',
  token: cfg.authToken,
  useCdn: false,
});

// Build a friendly title from the filename.
function titleFor(filename) {
  const name = filename.replace(/\.jpg$/i, '');
  if (/^MBCROWING/i.test(name)) {
    const num = name.replace(/^MBCROWING/i, '');
    return `MBC Rowing — frame ${num}`;
  }
  if (/^mgc-/i.test(name)) {
    return 'MGC — ' + name.replace(/^mgc-/i, '').replace(/-/g, ' ');
  }
  return name.replace(/[-_]/g, ' ');
}

function altFor(filename) {
  if (/^MBCROWING/i.test(filename)) return 'Marlborough Boys’ College rowing crew';
  if (/^mgc-/i.test(filename)) return 'Marlborough Girls’ College rowing crew';
  return 'Wairau Rowing Club photo';
}

const files = readdirSync(ARCHIVE)
  .filter((f) => /\.(jpe?g|png)$/i.test(f))
  .sort();

console.log(`📸 Found ${files.length} files in ${ARCHIVE}`);
console.log(`   Will upload to Sanity (project or37t6vb, dataset production)`);
console.log('');

let done = 0;
let failed = 0;
const CONCURRENCY = 5;

async function uploadOne(filename) {
  const fullPath = resolve(ARCHIVE, filename);
  try {
    const stream = createReadStream(fullPath);
    const asset = await client.assets.upload('image', stream, {
      filename,
      title: titleFor(filename),
      description: titleFor(filename),
      altText: altFor(filename),
    });
    done++;
    if (done % 10 === 0 || done === files.length) {
      const pct = ((done / files.length) * 100).toFixed(0);
      console.log(`  ${done}/${files.length} (${pct}%) — ${filename}`);
    }
    return asset._id;
  } catch (err) {
    failed++;
    console.warn(`  ❌ ${filename}: ${err.message}`);
    return null;
  }
}

// Tiny concurrency runner
async function runInBatches(items, limit, worker) {
  const queue = items.slice();
  const running = [];
  while (queue.length || running.length) {
    while (running.length < limit && queue.length) {
      const item = queue.shift();
      const p = worker(item).then(() => {
        running.splice(running.indexOf(p), 1);
      });
      running.push(p);
    }
    if (running.length) await Promise.race(running);
  }
}

const startedAt = Date.now();
await runInBatches(files, CONCURRENCY, uploadOne);
const elapsed = ((Date.now() - startedAt) / 1000).toFixed(1);

console.log('');
console.log(`✅ Done: ${done} uploaded, ${failed} failed, in ${elapsed}s`);
console.log(`📖 Open the library: https://wairaurowing.sanity.studio (left sidebar → Media)`);
