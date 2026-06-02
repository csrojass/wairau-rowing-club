import { defineField, defineType } from 'sanity';

export default defineType({
  name: 'sponsor',
  title: 'Sponsor / Partner',
  type: 'document',
  fields: [
    defineField({ name: 'name', type: 'string', validation: (r) => r.required() }),
    defineField({ name: 'logo', type: 'image' }),
    defineField({ name: 'website', type: 'url' }),
    defineField({
      name: 'tier',
      type: 'string',
      options: { list: ['Principal', 'Major', 'Supporting', 'Partner'] },
    }),
    defineField({ name: 'order', type: 'number' }),
  ],
});
