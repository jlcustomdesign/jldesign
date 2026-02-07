import { config, fields, collection } from '@keystatic/core';

export default config({
  storage: {
    kind: 'github',
    repo: 'RobertGyorgy/JL-Design',
  },
  collections: {
    portfolio: collection({
      label: 'Portfolio',
      slugField: 'name',
      path: 'src/content/portfolio/*',
      format: { contentField: 'content' },
      schema: {
        name: fields.slug({ name: { label: 'Project Name' } }),
        material: fields.text({ label: 'Material' }),
        image: fields.image({
          label: 'Project Image',
          directory: 'public/assets/portfolio',
          publicPath: '/assets/portfolio/',
        }),
        content: fields.markdoc({
          label: 'Content',
        }),
      },
    }),
  },
});
