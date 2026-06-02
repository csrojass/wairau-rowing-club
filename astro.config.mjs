import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';

export default defineConfig({
  site: 'https://wairaurowing.org.nz',
  integrations: [tailwind()],
});
