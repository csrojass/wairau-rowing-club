import { readFileSync, createReadStream } from 'node:fs';
import { homedir } from 'node:os';
import { createClient } from '@sanity/client';

const cfg = JSON.parse(readFileSync(`${homedir()}/.config/sanity/config.json`, 'utf-8'));
const client = createClient({
  projectId: 'or37t6vb',
  dataset: 'production',
  apiVersion: '2024-01-01',
  token: cfg.authToken,
  useCdn: false,
});

console.log('📄 Uploading the PDF to Sanity...');
const stream = createReadStream('/Users/carlos/Downloads/Minutes.pdf');
const asset = await client.assets.upload('file', stream, {
  filename: 'wairau-rowing-club-first-minutes-1910.pdf',
  contentType: 'application/pdf',
  title: 'First Minutes — 31 July 1910',
  description: 'The original committee meeting minutes from 31 July 1910 — the day the boat shed site was chosen at Grovetown.',
});
console.log(`✅ Uploaded: ${asset._id}`);
console.log(`   URL: ${asset.url}`);

console.log('');
console.log('🪶 Attaching to siteSettings → firstMinutesPdf field...');
const result = await client
  .patch('siteSettings')
  .set({
    firstMinutesPdf: {
      _type: 'file',
      asset: { _type: 'reference', _ref: asset._id },
    },
  })
  .commit({ visibility: 'sync' });
console.log('✅ siteSettings updated');
console.log('');
console.log('⏳ Sanity webhook will trigger a Cloudflare rebuild — Alumni page button should activate in ~60s.');
