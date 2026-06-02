import { defineField, defineType } from 'sanity';

export default defineType({
  name: 'event',
  title: 'Event / Calendar',
  type: 'document',
  fields: [
    defineField({ name: 'title', type: 'string', validation: (r) => r.required() }),
    defineField({ name: 'date', type: 'date', validation: (r) => r.required() }),
    defineField({ name: 'time', type: 'string', description: 'e.g. "5:30 AM"' }),
    defineField({ name: 'location', type: 'string' }),
    defineField({ name: 'description', type: 'text', rows: 3 }),
    defineField({
      name: 'category',
      type: 'string',
      options: { list: ['Training', 'Regatta', 'Social', 'Working Bee', 'Other'] },
    }),
  ],
  orderings: [{ title: 'Soonest', name: 'dateAsc', by: [{ field: 'date', direction: 'asc' }] }],
});
