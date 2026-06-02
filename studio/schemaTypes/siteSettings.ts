import { defineField, defineType } from 'sanity';

export default defineType({
  name: 'siteSettings',
  title: 'Site Settings',
  type: 'document',
  description: 'Global settings used across the whole site.',
  fields: [
    defineField({ name: 'siteTitle', type: 'string', initialValue: 'Wairau Rowing Club' }),
    defineField({
      name: 'tagline',
      type: 'string',
      description: 'Short tagline shown in the hero and footer.',
      initialValue: 'Rowing the Wairau since 1910.',
    }),
    defineField({
      name: 'description',
      type: 'text',
      rows: 3,
      description: 'One-paragraph description used in the footer and meta tags.',
    }),

    defineField({
      name: 'programmeIntro',
      title: 'Programme intro (Programs page)',
      type: 'array',
      of: [{ type: 'block' }],
      description: 'The intro paragraphs at the top of the Programs page.',
    }),

    defineField({
      name: 'heroImage',
      type: 'image',
      options: { hotspot: true },
      description: 'Featured image on the homepage hero.',
    }),
    defineField({
      name: 'aboutImage',
      type: 'image',
      options: { hotspot: true },
      description: 'Image shown in the "Our home" section on the home page.',
    }),

    defineField({ name: 'contactEmail', type: 'string' }),
    defineField({ name: 'contactPhone', type: 'string' }),
    defineField({ name: 'address', type: 'text', rows: 2 }),

    defineField({
      name: 'facebookUrl',
      type: 'url',
      description: 'WRC Facebook page URL (the one with the old green shed cover photo).',
    }),
    defineField({ name: 'instagramUrl', type: 'url' }),

    defineField({
      name: 'rowingConnectUrl',
      type: 'url',
      description:
        'The Wairau RC Rowing Connect signup link. Until provided, points to the national info page.',
    }),
    defineField({
      name: 'firstMinutesPdf',
      type: 'file',
      options: { accept: '.pdf' },
      description: 'Scanned PDF of the original 1910 committee minutes (Alumni page).',
    }),
    defineField({
      name: 'corporateContactEmail',
      type: 'string',
      description: 'Where the "Corporate" CTA emails — currently Barry Chandler.',
    }),
  ],
  preview: { prepare: () => ({ title: 'Site Settings' }) },
});
