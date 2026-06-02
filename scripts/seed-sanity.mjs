// Seeds the Sanity dataset with the current site content + photos.
// Run once: `node scripts/seed-sanity.mjs`
//
// Uses the local Sanity CLI auth token. Safe to re-run — each document has a
// deterministic _id so it's overwritten rather than duplicated.

import { readFileSync, createReadStream } from 'node:fs';
import { homedir } from 'node:os';
import { basename, resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { createClient } from '@sanity/client';

import {
  programs,
  pathways,
  committee,
  contacts,
  announcements,
  programmeIntro,
  rowingConnect,
  social,
  heritage,
  corporateContact,
  site,
} from '../src/data/site.js';

const __dirname = dirname(fileURLToPath(import.meta.url));
const PROJECT_ROOT = resolve(__dirname, '..');

const cfg = JSON.parse(readFileSync(`${homedir()}/.config/sanity/config.json`, 'utf-8'));

const client = createClient({
  projectId: 'or37t6vb',
  dataset: 'production',
  apiVersion: '2024-01-01',
  token: cfg.authToken,
  useCdn: false,
});

// ---------- helpers ----------

// Convert a slug-like string into a safe Sanity _id.
const docId = (prefix, slug) =>
  `${prefix}-${slug.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')}`;

// Upload an image file to Sanity, returns an asset reference object.
async function uploadImage(localPath) {
  const fullPath = resolve(PROJECT_ROOT, localPath.replace(/^\//, ''));
  try {
    const filename = basename(fullPath);
    const stream = createReadStream(fullPath);
    const asset = await client.assets.upload('image', stream, { filename });
    return { _type: 'image', asset: { _type: 'reference', _ref: asset._id } };
  } catch (err) {
    console.warn(`  ⚠️  could not upload ${localPath}: ${err.message}`);
    return null;
  }
}

async function uploadFile(localPath) {
  const fullPath = resolve(PROJECT_ROOT, localPath.replace(/^\//, ''));
  try {
    const filename = basename(fullPath);
    const stream = createReadStream(fullPath);
    const asset = await client.assets.upload('file', stream, { filename });
    return { _type: 'file', asset: { _type: 'reference', _ref: asset._id } };
  } catch (err) {
    console.warn(`  ⚠️  could not upload file ${localPath}: ${err.message}`);
    return null;
  }
}

// Convert a single string of text to portable text blocks.
const toBlocks = (paragraphs) =>
  paragraphs.map((text, i) => ({
    _type: 'block',
    _key: `intro-${i}`,
    style: 'normal',
    children: [{ _type: 'span', _key: `intro-${i}-s`, text, marks: [] }],
    markDefs: [],
  }));

// ---------- seed ----------

const allDocs = [];
const uploadedImages = {};

async function getImage(slug) {
  if (uploadedImages[slug] !== undefined) return uploadedImages[slug];
  const img = await uploadImage(`public/images/${slug}.jpg`);
  uploadedImages[slug] = img;
  return img;
}

async function getPng(slug) {
  if (uploadedImages[slug] !== undefined) return uploadedImages[slug];
  const img = await uploadImage(`public/images/${slug}.png`);
  uploadedImages[slug] = img;
  return img;
}

console.log('🚣  Seeding Wairau Rowing Club Sanity dataset...');
console.log('');

// === Site settings ===
console.log('• Site settings (with hero + about images)...');
const heroImage = await getImage('hero');
const aboutImage = await getImage('about');
allDocs.push({
  _id: 'siteSettings',
  _type: 'siteSettings',
  siteTitle: site.name,
  tagline: site.tagline,
  description: site.description,
  programmeIntro: toBlocks(programmeIntro),
  heroImage,
  aboutImage,
  contactEmail: site.email,
  contactPhone: site.phone,
  address: site.location,
  facebookUrl: social.facebookUrl || undefined,
  instagramUrl: social.instagramUrl || undefined,
  rowingConnectUrl: rowingConnect.url || rowingConnect.generalInfoUrl,
  corporateContactEmail: corporateContact.email,
});

// === Programs (4 featured + 2 pathways) ===
console.log('• Programs + pathways...');
for (let i = 0; i < programs.length; i++) {
  const p = programs[i];
  const imageSlug = `program-${p.slug.replace('-rowing', '')}`;
  const image = await getImage(imageSlug);
  const ctaLabel =
    p.slug === 'alumni' ? 'Reconnect' :
    p.slug === 'corporate-rowing' ? 'Email Barry' :
    'Get involved';
  const ctaUrl =
    p.slug === 'alumni' ? '/alumni' :
    p.slug === 'corporate-rowing' ? `mailto:${corporateContact.email}` :
    '/membership';
  allDocs.push({
    _id: docId('program', p.slug),
    _type: 'program',
    title: p.title,
    slug: { _type: 'slug', current: p.slug },
    featured: true,
    order: i * 10,
    tagline: p.tagline,
    summary: p.summary,
    points: p.points.map((pt, j) => ({
      _key: `pt-${j}`,
      _type: 'object',
      text: typeof pt === 'string' ? pt : pt.text,
      url: typeof pt === 'string' ? undefined : pt.url,
    })),
    icon: p.icon,
    image,
    ctaLabel,
    ctaUrl,
  });
}
for (let i = 0; i < pathways.length; i++) {
  const p = pathways[i];
  allDocs.push({
    _id: docId('program', p.slug),
    _type: 'program',
    title: p.title,
    slug: { _type: 'slug', current: p.slug },
    featured: false,
    order: 100 + i,
    summary: p.summary,
    icon: p.icon,
  });
}

// === Committee members ===
console.log('• Committee members (16)...');
for (let i = 0; i < committee.length; i++) {
  const m = committee[i];
  allDocs.push({
    _id: docId('committee', `${m.role}-${m.name}-${i}`),
    _type: 'committeeMember',
    name: m.name,
    role: m.role,
    tbc: m.tbc || false,
    order: i,
  });
}

// === Contacts ===
console.log('• Public contacts (4)...');
for (let i = 0; i < contacts.length; i++) {
  const c = contacts[i];
  allDocs.push({
    _id: docId('contact', `${c.role}-${c.name}`),
    _type: 'contact',
    name: c.name,
    role: c.role,
    email: c.email,
    phone: c.phone,
    tbc: c.tbc || false,
    order: i,
  });
}

// === Announcements (demo) ===
console.log('• Announcements (3 demo)...');
for (let i = 0; i < announcements.length; i++) {
  const a = announcements[i];
  const image = await getImage(`news-${i + 1}`);
  allDocs.push({
    _id: docId('announcement', a.slug),
    _type: 'announcement',
    title: a.title,
    slug: { _type: 'slug', current: a.slug },
    date: a.date,
    category: a.category,
    excerpt: a.excerpt,
    image,
  });
}

// ---------- write to Sanity ----------

console.log('');
console.log(`🪶  Writing ${allDocs.length} documents...`);

const tx = client.transaction();
for (const doc of allDocs) tx.createOrReplace(doc);

const result = await tx.commit({ visibility: 'sync' });
console.log(`✅ Wrote ${result.results.length} docs`);
console.log('');
console.log('📖 Open the studio: https://wairaurowing.sanity.studio');
