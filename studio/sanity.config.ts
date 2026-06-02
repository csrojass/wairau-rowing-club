import { defineConfig } from 'sanity';
import { structureTool } from 'sanity/structure';
import { visionTool } from '@sanity/vision';
import { schemaTypes } from './schemaTypes';

export default defineConfig({
  name: 'wairau-rowing-club',
  title: 'Wairau Rowing Club',

  projectId: 'or37t6vb',
  dataset: 'production',

  plugins: [structureTool(), visionTool()],

  schema: { types: schemaTypes },
});
