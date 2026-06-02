import { defineField, defineType } from 'sanity';

const ROLES = [
  'Patron',
  'President',
  'Senior Vice President',
  'Junior Vice President',
  'Secretary',
  'Treasurer',
  'Co-Treasurer',
  'Club Captain',
  'Vice Club Captain (Men)',
  'Vice Club Captain (Women)',
  'Health & Safety Officer',
  'Committee',
  'Girls’ College Delegate',
  'Boys’ College Delegate',
];

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
        list: ROLES.map((r) => ({ title: r, value: r })),
      },
    }),
    defineField({ name: 'photo', type: 'image', options: { hotspot: true } }),
    defineField({ name: 'bio', type: 'text', rows: 3 }),
    defineField({
      name: 'tbc',
      title: 'Position vacant / TBC?',
      type: 'boolean',
      initialValue: false,
    }),
    defineField({
      name: 'order',
      type: 'number',
      description: 'Display order. Lower numbers appear first.',
      initialValue: 100,
    }),
  ],
  orderings: [
    { title: 'Manual order', name: 'orderAsc', by: [{ field: 'order', direction: 'asc' }] },
  ],
  preview: { select: { title: 'name', subtitle: 'role', media: 'photo' } },
});
