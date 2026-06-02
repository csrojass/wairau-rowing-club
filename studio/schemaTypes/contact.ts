import { defineField, defineType } from 'sanity';

export default defineType({
  name: 'contact',
  title: 'Public Contact',
  type: 'document',
  description:
    'People shown on the Contact page and in the footer. (Use Committee Member for board roster.)',
  fields: [
    defineField({
      name: 'name',
      type: 'string',
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'role',
      type: 'string',
      description: 'e.g. "Club Captain", "Secretary", "MBC Coach"',
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'email',
      type: 'string',
    }),
    defineField({
      name: 'phone',
      type: 'string',
      description: 'Include country/area code, e.g. "0275 780 011"',
    }),
    defineField({
      name: 'tbc',
      title: 'Position vacant / to be confirmed?',
      type: 'boolean',
      description: 'If on, the card shows "To be confirmed" instead of the name.',
      initialValue: false,
    }),
    defineField({
      name: 'order',
      type: 'number',
      description: 'Display order. Lower numbers appear first.',
      initialValue: 0,
    }),
  ],
  orderings: [
    { title: 'Manual order', name: 'orderAsc', by: [{ field: 'order', direction: 'asc' }] },
  ],
  preview: { select: { title: 'name', subtitle: 'role' } },
});
