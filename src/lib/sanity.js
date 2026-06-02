import { createClient } from '@sanity/client';
import { announcements as fallbackAnnouncements } from '../data/site.js';

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

// Helper: fall back to placeholder data when Sanity isn't configured or unreachable.
export async function fetchOrFallback(query, fallback, params = {}) {
  if (!sanity) return fallback;
  try {
    const result = await sanity.fetch(query, params);
    return result == null || (Array.isArray(result) && result.length === 0) ? fallback : result;
  } catch (err) {
    console.warn('[sanity] fetch failed, using fallback:', err.message);
    return fallback;
  }
}

// Build a CDN URL for a Sanity image reference.
//   asset = { _ref: 'image-abc123-1200x800-jpg' }
export function imageUrl(asset, { width, height } = {}) {
  if (!asset?._ref || !projectId) return null;
  const ref = asset._ref;
  const match = ref.match(/^image-([a-f0-9]+)-(\d+x\d+)-([a-z]+)$/);
  if (!match) return null;
  const [, id, dim, ext] = match;
  let url = `https://cdn.sanity.io/images/${projectId}/${dataset}/${id}-${dim}.${ext}`;
  const params = [];
  if (width) params.push(`w=${width}`);
  if (height) params.push(`h=${height}`);
  if (params.length) url += '?' + params.join('&');
  return url;
}

// ---- Announcements / club notices ----

const ANNOUNCEMENT_QUERY = `*[_type == "announcement"] | order(date desc) [0...$limit] {
  _id,
  title,
  "slug": slug.current,
  category,
  date,
  excerpt,
  image,
  body
}`;

export async function fetchAnnouncements({ limit = 12 } = {}) {
  const docs = await fetchOrFallback(ANNOUNCEMENT_QUERY, null, { limit });
  if (!docs || docs.length === 0) {
    // Convert static fallback to the same shape
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
    stories: docs.map((d) => ({
      title: d.title,
      slug: d.slug,
      date: d.date,
      category: d.category,
      excerpt: d.excerpt,
      image: imageUrl(d.image, { width: 800 }) || null,
    })),
    source: 'sanity',
  };
}
