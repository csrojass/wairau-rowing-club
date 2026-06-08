import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://wairaurowingclub.co.nz',
  integrations: [tailwind(), sitemap()],
  redirects: {
    '/alumni': '/about#alumni',
  },
});
