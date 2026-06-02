import { defineConfig } from 'sanity';
import { structureTool } from 'sanity/structure';
import { visionTool } from '@sanity/vision';
import { media, mediaAssetSource } from 'sanity-plugin-media';
import { schemaTypes } from './schemaTypes';

export default defineConfig({
  name: 'wairau-rowing-club',
  title: 'Wairau Rowing Club',

  projectId: 'or37t6vb',
  dataset: 'production',

  plugins: [structureTool(), visionTool(), media()],

  schema: { types: schemaTypes },

  // Use the Media plugin's browser whenever a user picks an image field —
  // gives them the full library instead of "Upload" + "Select" only.
  form: {
    image: {
      assetSources: (previous) => [...previous, mediaAssetSource],
    },
  },
});
