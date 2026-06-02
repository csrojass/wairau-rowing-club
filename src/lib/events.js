// Fetches the public Rowing NZ iCal feed at build time and parses it into
// our event objects. Falls back to the static list in src/data/site.js if
// the network is unavailable.
//
// Auto-update strategy: the site is statically built, so the feed is only
// re-fetched when Netlify rebuilds. Hook up a daily/weekly build (Netlify
// scheduled builds, or a GitHub Action cron) to keep this fresh.

import { events as fallback } from '../data/site.js';

const FEED_URL = 'https://rowingnz.kiwi/events/list/?ical=1';

// Parse an iCal DTSTART/DTEND value, with or without TZID.
// Examples:
//   "20260131T201500"
//   "TZID=Pacific/Auckland:20260131T071500"
//   "VALUE=DATE:20261031"
function parseICalDate(raw) {
  const value = raw.includes(':') ? raw.split(':').pop() : raw;
  const m = value.match(/^(\d{4})(\d{2})(\d{2})(?:T(\d{2})(\d{2})(\d{2}))?/);
  if (!m) return null;
  const [, y, mo, d, hh = '00', mm = '00'] = m;
  return new Date(`${y}-${mo}-${d}T${hh}:${mm}:00+12:00`);
}

function unescape(s) {
  return s
    .replace(/\\,/g, ',')
    .replace(/\\;/g, ';')
    .replace(/\\n/gi, ' · ')
    .replace(/\s+/g, ' ')
    .trim();
}

function unfold(text) {
  // iCal folds long lines with leading whitespace on the next line.
  return text.replace(/\r?\n[ \t]/g, '');
}

// Heuristics to classify event scope from title/location.
function classify(summary, location) {
  const s = `${summary} ${location}`.toLowerCase();
  if (s.includes('nz') || s.includes('new zealand') || s.includes('national')) return 'national';
  if (s.includes('north island') || s.includes('south island') || s.includes('n.i.') || s.includes('s.i.')) return 'national';
  if (s.includes('maadi') || s.includes('secondary school')) return 'national';
  if (s.includes('coaching course') || s.includes('coaches conference')) return 'training';
  if (s.includes('canterbury') || s.includes('wellington') || s.includes('marlborough') || s.includes('otago') || s.includes('waikato')) return 'regional';
  return 'regional';
}

function categorize(summary) {
  const s = summary.toLowerCase();
  if (s.includes('masters')) return 'Masters';
  if (s.includes('school') || s.includes('maadi')) return 'Schools';
  if (s.includes('coaching') || s.includes('coach')) return 'Coaching';
  if (s.includes('championship')) return 'Championship';
  if (s.includes('regatta')) return 'Regatta';
  return 'Event';
}

function tidyLocation(loc) {
  // iCal locations often repeat the venue and add NZ — trim it down.
  const cleaned = unescape(loc)
    .replace(/, New Zealand$/i, '')
    .replace(/, NZ$/i, '');
  const parts = cleaned.split(',').map((p) => p.trim()).filter(Boolean);
  // Drop duplicates while preserving order
  const seen = new Set();
  const dedup = parts.filter((p) => {
    const k = p.toLowerCase();
    if (seen.has(k)) return false;
    seen.add(k);
    return true;
  });
  return dedup.slice(0, 2).join(', ');
}

function parseICS(text) {
  const unfolded = unfold(text);
  const blocks = unfolded.split('BEGIN:VEVENT').slice(1);
  const out = [];
  for (const block of blocks) {
    const body = block.split('END:VEVENT')[0];
    const fields = {};
    for (const line of body.split(/\r?\n/)) {
      const idx = line.indexOf(':');
      if (idx === -1) continue;
      const keyPart = line.slice(0, idx);
      const value = line.slice(idx + 1);
      const key = keyPart.split(';')[0];
      fields[key] = (fields[key] || '') + value;
      // also keep full key incl params for DTSTART parsing
      if (key === 'DTSTART' || key === 'DTEND') fields[`__${key}_raw`] = line.slice(idx + 1);
    }
    if (!fields.SUMMARY || !fields.DTSTART) continue;
    const start = parseICalDate(fields.DTSTART);
    if (!start) continue;
    const summary = unescape(fields.SUMMARY);
    const location = tidyLocation(fields.LOCATION || '');
    out.push({
      title: summary,
      date: start.toISOString().slice(0, 10),
      time: start.toLocaleTimeString('en-NZ', { hour: 'numeric', minute: '2-digit' }),
      location: location || 'TBC',
      category: categorize(summary),
      scope: classify(summary, location),
      url: fields.URL || null,
    });
  }
  // Sort soonest first
  out.sort((a, b) => a.date.localeCompare(b.date));
  return out;
}

export async function fetchEvents() {
  try {
    const res = await fetch(FEED_URL, {
      headers: { 'User-Agent': 'WairauRowingClub/1.0 (site build)' },
      // 10s timeout via AbortController
      signal: AbortSignal.timeout?.(10000),
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const text = await res.text();
    const live = parseICS(text);
    if (live.length === 0) throw new Error('No events parsed');
    // Merge: prepend any club-only events from the static list (scope === 'club')
    const clubExtras = fallback.filter((e) => e.scope === 'club');
    const combined = [...clubExtras, ...live]
      .filter((e) => new Date(e.date) >= new Date(Date.now() - 86400000))
      .sort((a, b) => a.date.localeCompare(b.date));
    return { events: combined, source: 'live', count: live.length };
  } catch (err) {
    console.warn('[events] Live fetch failed, using static fallback:', err.message);
    return {
      events: fallback.filter((e) => new Date(e.date) >= new Date(Date.now() - 86400000)),
      source: 'fallback',
      count: 0,
    };
  }
}
