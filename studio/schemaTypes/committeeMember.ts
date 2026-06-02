import { defineField, defineType } from 'sanity';

export default defineType({
  name: 'committeeMember',
  title: 'Committee Member',
  type: 'document',
  fields: [
    defineField({ name: 'name', type: 'string', validation: (r) => r.required() }),
    defineField({
      name: 'role',
      type: 'string',
      options: {
        list: [
          'Patron',
          'President',
          'Vice President',
          'Secretary',
          'Treasurer',
          'Club Captain',
          'Committee',
        ],
      },
    }),
    defineField({ name: 'photo', type: 'image', options: { hotspot: true } }),
    defineField({ name: 'bio', type: 'text', rows: 3 }),
    defineField({
      name: 'order',
      type: 'number',
      description: 'Display order. Lower numbers appear first.',
    }),
  ],
  orderings: [{ title: 'Manual order', name: 'orderAsc', by: [{ field: 'order', direction: 'asc' }] }],
  preview: { select: { title: 'name', subtitle: 'role', media: 'photo' } },
});
