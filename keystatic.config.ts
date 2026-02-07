import { config, fields, collection } from '@keystatic/core';

export default config({
  storage:
    process.env.NODE_ENV === 'development'
      ? { kind: 'local' }
      : { kind: 'github', repo: 'RobertGyorgy/JL-Design' },
  
  // Branding
  ui: {
    brand: {
      name: 'JL Mobila',
    },
    navigation: {
      'Conținut': ['portfolio'],
    },
  },

  collections: {
    portfolio: collection({
      label: 'Portofoliu',
      slugField: 'name',
      path: 'src/content/portfolio/*',
      format: { contentField: 'content' },
      entryLayout: 'content',
      schema: {
        name: fields.slug({ 
          name: { 
            label: 'Nume Proiect',
            description: 'Numele proiectului care va apărea pe site'
          } 
        }),
        material: fields.text({ 
          label: 'Material',
          description: 'Ex: Lemn masiv de stejar, PAL melaminat, etc.',
          validation: { isRequired: false }
        }),
        image: fields.image({
          label: 'Imagine Proiect',
          description: 'Fotografia principală a proiectului',
          directory: 'public/assets/portfolio',
          publicPath: '/assets/portfolio/',
        }),
        content: fields.markdoc({
          label: 'Descriere',
          description: 'Detalii despre proiect (opțional)',
        }),
      },
    }),
  },
});
