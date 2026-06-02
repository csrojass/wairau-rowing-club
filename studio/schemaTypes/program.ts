import { defineField, defineType } from 'sanity';

export default defineType({
  name: 'program',
  title: 'Program / Pathway',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      type: 'string',
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'slug',
      type: 'slug',
      options: { source: 'title' },
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'featured',
      title: 'Show in main "Four ways" grid?',
      type: 'boolean',
      description:
        'If on, this program appears in the four-card grid on the home and Programs pages. If off, it appears in the "Pathways & events" callout strip.',
      initialValue: true,
    }),
    defineField({
      name: 'order',
      type: 'number',
      description: 'Display order. Lower numbers appear first.',
      initialValue: 0,
    }),
    defineField({
      name: 'tagline',
      type: 'string',
      description: 'Short tagline (e.g. "Open to all levels.")',
    }),
    defineField({
      name: 'summary',
      type: 'text',
      rows: 4,
      description: 'A paragraph describing the program.',
    }),
    defineField({
      name: 'points',
      title: 'Bullet points',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            { name: 'text', type: 'string', validation: (r) => r.required() },
            {
              name: 'url',
              type: 'url',
              title: 'Optional link',
              description: 'If set, this point becomes a clickable link.',
            },
          ],
          preview: { select: { title: 'text', subtitle: 'url' } },
        },
      ],
    }),
    defineField({
      name: 'icon',
      type: 'string',
      description: 'Which icon to show.',
      options: {
        list: [
          { title: 'Scull (single boat)', value: 'boat' },
          { title: 'Eight (long racing shell)', value: 'cap' },
          { title: 'Pair (two rowers)', value: 'people' },
          { title: 'Medal', value: 'peak' },
          { title: 'Waves', value: 'wave' },
          { title: 'Crossed oars (heritage)', value: 'tree' },
          { title: 'Single oar', value: 'flow' },
          { title: 'Boathouse', value: 'circle' },
        ],
        layout: 'dropdown',
      },
    }),
    defineField({
      name: 'image',
      type: 'image',
      options: { hotspot: true },
      description: 'Photo shown on the program card.',
    }),
    defineField({
      name: 'ctaLabel',
      title: 'Call-to-action button text',
      type: 'string',
      description: 'e.g. "Get involved", "Reconnect", "Email Barry"',
      initialValue: 'Get involved',
    }),
    defineField({
      name: 'ctaUrl',
      title: 'Call-to-action link',
      type: 'string',
      description:
        'Where the button goes. Use /membership, /alumni, /contact, or a full mailto:… or https://… URL.',
      initialValue: '/membership',
    }),
  ],
  orderings: [
    {
      title: 'Manual order',
      name: 'orderAsc',
      by: [{ field: 'order', direction: 'asc' }],
    },
  ],
  preview: {
    select: { title: 'title', subtitle: 'tagline', media: 'image' },
  },
});
