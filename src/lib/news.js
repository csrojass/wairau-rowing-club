// Fetches the latest stories from Rowing New Zealand at build time via the
// WordPress REST API.  Falls back to the static club announcements in
// src/data/site.js when the network is unavailable.
//
// Auto-update strategy: same as events — re-fetched whenever the site
// rebuilds.  Set up a Netlify scheduled build or GitHub Action cron to keep
// it fresh (see README).

import { announcements as fallback } from '../data/site.js';

const API_URL = 'https://rowingnz.kiwi/wp-json/wp/v2/posts?per_page=6&_embed=1';

// Strip HTML, decode common entities, collapse whitespace.
function stripHtml(html = '') {
  return html
    .replace(/<[^>]+>/g, ' ')
    .replace(/&nbsp;/g, ' ')
    .replace(/&#8211;|&ndash;/g, '–')
    .replace(/&#8217;/g, '’')
    .replace(/&#8220;|&#8221;|&ldquo;|&rdquo;/g, '"')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&#(\d+);/g, (_, n) => String.fromCharCode(parseInt(n, 10)))
    .replace(/\s+/g, ' ')
    .trim();
}

function pickImage(post) {
  const media = post._embedded?.['wp:featuredmedia']?.[0];
  if (!media) return null;
  const sizes = media.media_details?.sizes || {};
  return (
    sizes.medium_large?.source_url ||
    sizes.large?.source_url ||
    sizes.medium?.source_url ||
    media.source_url ||
    null
  );
}

// Heuristic category from title/excerpt.
function categorize(title, excerpt) {
  const s = `${title} ${excerpt}`.toLowerCase();
  if (s.includes('maadi') || s.includes('schools') || s.includes('secondary')) return 'Schools';
  if (s.includes('masters')) return 'Masters';
  if (s.includes('coaching') || s.includes('coach')) return 'Coaching';
  if (s.includes('beach sprint')) return 'Beach Sprints';
  if (s.includes('championship')) return 'Championships';
  if (s.includes('club') || s.includes('community')) return 'Community';
  return 'News';
}

async function fetchWithRetry(url, attempts = 3, timeoutMs = 15000) {
  let lastErr;
  for (let i = 0; i < attempts; i++) {
    try {
      const res = await fetch(url, {
        headers: { 'User-Agent': 'WairauRowingClub/1.0 (site build)' },
        signal: AbortSignal.timeout?.(timeoutMs),
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      return await res.json();
    } catch (err) {
      lastErr = err;
      console.warn(`[news] fetch attempt ${i + 1} failed: ${err.message}`);
      // Small backoff between attempts
      if (i < attempts - 1) await new Promise((r) => setTimeout(r, 1000 * (i + 1)));
    }
  }
  throw lastErr;
}

export async function fetchNews() {
  try {
    const posts = await fetchWithRetry(API_URL);
    if (!Array.isArray(posts) || posts.length === 0) throw new Error('No posts');

    const stories = posts.map((p) => {
      const title = stripHtml(p.title?.rendered || '');
      const excerptHtml = p.excerpt?.rendered || '';
      const excerpt = stripHtml(excerptHtml).replace(/\s+\[\.\.\.\]?$/, '').slice(0, 220);
      return {
        title,
        slug: p.slug,
        url: p.link,
        date: p.date?.slice(0, 10),
        excerpt,
        image: pickImage(p),
        category: categorize(title, excerpt),
      };
    });

    return { stories, source: 'live' };
  } catch (err) {
    console.warn('[news] Live fetch failed — RNZ section will be hidden:', err.message);
    // Return empty array — the news.astro template hides the section if there are
    // no stories rather than rendering broken/loop-back internal links.
    return { stories: [], source: 'unavailable' };
  }
}
