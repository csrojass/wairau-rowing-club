// Curated 2026/27 regatta calendar maintained by the Wairau Rowing Club.
// Source data lives in src/data/site.js — edit there to add/remove regattas.

import { events as curated } from '../data/site.js';

export async function fetchEvents() {
  const today = new Date(Date.now() - 86400000); // include events from today
  const events = curated
    .filter((e) => new Date(e.date) >= today)
    .sort((a, b) => a.date.localeCompare(b.date));
  return { events, source: 'curated' };
}
