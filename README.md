# Wairau Rowing Club Website

Modern, fast website for the Wairau Rowing Club — built with Astro, Tailwind CSS, and Sanity CMS.

## What's here

- **`src/`** — the website (Astro pages, components, data)
- **`studio/`** — the Sanity CMS schemas (content editing for non-technical users)
- **`public/`** — static files (favicon, photos, logos)

## Running locally

```bash
npm install
npm run dev
```

Then open http://localhost:4321/

## Pages

- `/` — Home (hero, programs, news, events, join CTA)
- `/programs` — Club, College, Corporate, High Performance pathway
- `/membership` — Become a member, with enquiry form
- `/committee` — Our People (executive + committee)
- `/news` — News and announcements
- `/about` — Club history and the Wairau River
- `/contact` — Contact form + key people

## Adding photos

Drop image files into `public/images/` and reference them as `/images/your-file.jpg`.
The placeholder gradient panels on the homepage and programs page are ready to be swapped for real photos.

## Connecting the CMS (Sanity)

The site works right now with placeholder content in `src/data/site.js`. To let
committee members update content without touching code:

1. Create a free account at https://sanity.io
2. Create a new project and dataset (`production`)
3. Copy the project ID into `.env`:
   ```
   PUBLIC_SANITY_PROJECT_ID=your-project-id
   PUBLIC_SANITY_DATASET=production
   ```
4. Deploy the studio in `studio/` (instructions in Sanity's docs — `npx sanity deploy`)
5. Committee members log in at the studio URL to add news, events, sponsors, etc.

The schemas are already defined in `studio/schemaTypes/`:
- **Announcement** — news and updates
- **Event** — calendar / upcoming events
- **Committee Member** — people on the executive
- **Sponsor** — sponsors and partners
- **Site Settings** — global site info (tagline, contact, social links)

## Deploying (free hosting)

The site is a static Astro build, so it deploys for free to:

- **Netlify** (recommended — also handles the contact/membership forms)
- **Cloudflare Pages**
- **Vercel**
- **GitHub Pages**

For Netlify:

1. Push this folder to a GitHub repo
2. Sign in to https://netlify.com → "Add new site" → "Import from Git"
3. Pick the repo. Build command: `npm run build`. Publish directory: `dist`
4. Done — site goes live at `your-site.netlify.app`. Add a custom domain in Netlify settings.

The contact and membership forms use Netlify Forms (`data-netlify="true"`) — submissions
appear in your Netlify dashboard with no backend needed.

## Auto-updating the regatta calendar

The Regattas page and the "Upcoming" section on the home page pull live from
[Rowing NZ's iCal feed](https://rowingnz.kiwi/events/list/?ical=1) at **build time**.

That means the site only refreshes when Netlify rebuilds. To keep it
auto-updating, you have two free options:

### Option A — Netlify scheduled build (simplest)
In Netlify: Site settings → Build & deploy → Build hooks → "Add build hook".
Copy the URL, then use a free cron service like
[cron-job.org](https://cron-job.org) to POST to that URL daily or weekly.

### Option B — GitHub Action cron
If the repo lives on GitHub, add `.github/workflows/rebuild.yml`:
```yaml
on:
  schedule: [{ cron: "0 6 * * 1" }]   # Mondays 6am UTC = 6pm NZ
jobs:
  trigger:
    runs-on: ubuntu-latest
    steps:
      - run: curl -X POST -d {} ${{ secrets.NETLIFY_BUILD_HOOK }}
```

Either way, the iCal feed is re-fetched on every build. If the feed is
unreachable, the static fallback in `src/data/site.js` is used.

## Tech stack

- **Astro 4** — static site framework
- **Tailwind CSS 3** — utility-first styling
- **Sanity** (optional) — headless CMS for committee editing
- **Netlify** (recommended) — free hosting + form handling

## Brand

- Navy `#0A1628` — primary
- Ocean `#0077B6` — secondary
- Teal `#00B4D8` — accent
- Coral `#F77F00` — CTA / highlight
- Headings: Montserrat • Body: Inter

## Build

```bash
npm run build      # produces /dist
npm run preview    # preview the production build locally
```
