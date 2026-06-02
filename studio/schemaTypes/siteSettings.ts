import { defineField, defineType } from 'sanity';

export default defineType({
  name: 'siteSettings',
  title: 'Site Settings',
  type: 'document',
  fields: [
    defineField({ name: 'siteTitle', type: 'string' }),
    defineField({ name: 'tagline', type: 'string' }),
    defineField({ name: 'description', type: 'text', rows: 3 }),
    defineField({
      name: 'heroImage',
      type: 'image',
      options: { hotspot: true },
      description: 'Featured image on the homepage hero.',
    }),
    defineField({ name: 'contactEmail', type: 'string' }),
    defineField({ name: 'contactPhone', type: 'string' }),
    defineField({ name: 'address', type: 'text', rows: 2 }),
    defineField({ name: 'facebookUrl', type: 'url' }),
    defineField({ name: 'instagramUrl', type: 'url' }),
  ],
  preview: { prepare: () => ({ title: 'Site Settings' }) },
});
