import { createClient } from '@sanity/client';
import imageUrlBuilder from '@sanity/image-url';
import {
  announcements as fallbackAnnouncements,
  programs as fallbackPrograms,
  pathways as fallbackPathways,
  committee as fallbackCommittee,
  contacts as fallbackContacts,
  programmeIntro as fallbackProgrammeIntro,
  rowingConnect as fallbackRowingConnect,
  social as fallbackSocial,
  heritage as fallbackHeritage,
  corporateContact as fallbackCorporateContact,
  site as fallbackSite,
} from '../data/site.js';

// Sanity client. Configured via .env at the project root:
//   PUBLIC_SANITY_PROJECT_ID=or37t6vb
//   PUBLIC_SANITY_DATASET=production
const projectId = import.meta.env.PUBLIC_SANITY_PROJECT_ID;
const dataset = import.meta.env.PUBLIC_SANITY_DATASET || 'production';

export const sanity = projectId
  ? createClient({
      projectId,
      dataset,
      apiVersion: '2024-01-01',
      useCdn: true,
      perspective: 'published',
    })
  : null;

async function fetchOr(query, fallback, params = {}) {
  if (!sanity) return { data: fallback, source: 'fallback' };
  try {
    const result = await sanity.fetch(query, params);
    if (result == null || (Array.isArray(result) && result.length === 0)) {
      return { data: fallback, source: 'fallback' };
    }
    return { data: result, source: 'sanity' };
  } catch (err) {
    console.warn('[sanity] fetch failed, using fallback:', err.message);
    return { data: fallback, source: 'fallback' };
  }
}

const builder = projectId
  ? imageUrlBuilder({ projectId, dataset })
  : null;

// Build a CDN URL for a Sanity image — supports the full image object
// (asset + crop + hotspot) or a bare asset reference.
// Accepts either:
//   imageUrl({ asset: { _ref }, crop, hotspot }, { width })
//   imageUrl({ _ref }, { width })              // legacy callers
export function imageUrl(source, { width, height } = {}) {
  if (!builder) return null;
  // Legacy: callers pass `p.image?.asset` — wrap it back to a full image obj.
  if (source && source._ref && !source.asset) {
    source = { asset: source };
  }
  if (!source?.asset?._ref) return null;
  try {
    let b = builder.image(source).auto('format').fit('crop');
    if (width) b = b.width(width);
    if (height) b = b.height(height);
    return b.url();
  } catch (err) {
    console.warn('[sanity] image url failed:', err.message);
    return null;
  }
}

// Resolve a Sanity image, or fall back to a local path.
export function resolveImage(image, fallbackPath, opts) {
  return imageUrl(image, opts) || fallbackPath;
}

// Block content → plain paragraphs (good enough for the simple intro field).
function blocksToParagraphs(blocks) {
  if (!Array.isArray(blocks)) return [];
  return blocks
    .filter((b) => b._type === 'block')
    .map((b) => (b.children || []).map((c) => c.text).join(''))
    .filter(Boolean);
}

// ===== announcements =====

const ANNOUNCEMENT_QUERY = `*[_type == "announcement"] | order(date desc) [0...$limit] {
  _id, title, "slug": slug.current, category, date, excerpt, image, body
}`;

export async function fetchAnnouncements({ limit = 12 } = {}) {
  const { data, source } = await fetchOr(ANNOUNCEMENT_QUERY, null, { limit });
  if (data == null) {
    return {
      stories: fallbackAnnouncements.map((a, i) => ({
        title: a.title,
        slug: a.slug,
        date: a.date,
        category: a.category,
        excerpt: a.excerpt,
        image: `/images/news-${i + 1}.jpg`,
      })),
      source: 'fallback',
    };
  }
  return {
    stories: data.map((d) => ({
      title: d.title,
      slug: d.slug,
      date: d.date,
      category: d.category,
      excerpt: d.excerpt,
      image: imageUrl(d.image, { width: 800 }) || null,
    })),
    source,
  };
}

// ===== programs =====

const PROGRAM_QUERY = `*[_type == "program"] | order(order asc, _createdAt asc) {
  _id, title, "slug": slug.current, featured, order, tagline, summary, points,
  icon, image, ctaLabel, ctaUrl
}`;

export async function fetchPrograms() {
  const { data, source } = await fetchOr(PROGRAM_QUERY, null);
  if (data == null) {
    return { featured: fallbackPrograms, pathways: fallbackPathways, source: 'fallback' };
  }
  const normalize = (p) => ({
    slug: p.slug || p._id,
    title: p.title,
    tagline: p.tagline,
    summary: p.summary,
    points: (p.points || []).map((pt) => ({ text: pt.text, url: pt.url })),
    icon: p.icon || 'wave',
    image: p.image,
    ctaLabel: p.ctaLabel,
    ctaUrl: p.ctaUrl,
  });
  return {
    featured: data.filter((p) => p.featured !== false).map(normalize),
    pathways: data.filter((p) => p.featured === false).map(normalize),
    source,
  };
}

// ===== committee =====

const COMMITTEE_QUERY = `*[_type == "committeeMember"] | order(order asc, _createdAt asc) {
  _id, name, role, tbc, photo, order
}`;

export async function fetchCommittee() {
  const { data, source } = await fetchOr(COMMITTEE_QUERY, fallbackCommittee);
  return { members: data, source };
}

// ===== contacts =====

const CONTACT_QUERY = `*[_type == "contact"] | order(order asc, _createdAt asc) {
  _id, name, role, email, phone, tbc, order
}`;

export async function fetchContacts() {
  const { data, source } = await fetchOr(CONTACT_QUERY, fallbackContacts);
  return { contacts: data, source };
}

// ===== site settings =====

const SETTINGS_QUERY = `*[_type == "siteSettings"][0] {
  siteTitle, tagline, description, programmeIntro, heroImage, aboutImage,
  contactEmail, contactPhone, address, facebookUrl, instagramUrl,
  rowingConnectUrl, "firstMinutesPdfUrl": firstMinutesPdf.asset->url,
  corporateContactEmail
}`;

export async function fetchSettings() {
  const { data, source } = await fetchOr(SETTINGS_QUERY, null);
  if (!data) {
    return {
      site: fallbackSite,
      programmeIntro: fallbackProgrammeIntro,
      heroImage: '/images/hero.jpg',
      aboutImage: '/images/about.jpg',
      social: fallbackSocial,
      rowingConnect: fallbackRowingConnect,
      heritage: fallbackHeritage,
      corporateContact: fallbackCorporateContact,
      source: 'fallback',
    };
  }
  return {
    site: {
      name: data.siteTitle || fallbackSite.name,
      tagline: data.tagline || fallbackSite.tagline,
      description: data.description || fallbackSite.description,
      email: data.contactEmail || fallbackSite.email,
      phone: data.contactPhone || fallbackSite.phone,
      location: data.address || fallbackSite.location,
      founded: fallbackSite.founded,
      shortName: fallbackSite.shortName,
    },
    programmeIntro: blocksToParagraphs(data.programmeIntro).length
      ? blocksToParagraphs(data.programmeIntro)
      : fallbackProgrammeIntro,
    heroImage: resolveImage(data.heroImage, '/images/hero.jpg', { width: 2000 }),
    aboutImage: resolveImage(data.aboutImage, '/images/about.jpg', { width: 1200 }),
    social: {
      facebookUrl: data.facebookUrl || fallbackSocial.facebookUrl,
      instagramUrl: data.instagramUrl || fallbackSocial.instagramUrl,
    },
    rowingConnect: {
      url: data.rowingConnectUrl || fallbackRowingConnect.url,
      generalInfoUrl: fallbackRowingConnect.generalInfoUrl,
      noCost: true,
    },
    heritage: {
      firstMinutesPdf: data.firstMinutesPdfUrl || fallbackHeritage.firstMinutesPdf,
    },
    corporateContact: {
      ...fallbackCorporateContact,
      email: data.corporateContactEmail || fallbackCorporateContact.email,
    },
    source,
  };
}
