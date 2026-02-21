import { config, fields, collection } from '@keystatic/core';
import { createElement } from 'react';

export default config({
  storage:
    process.env.NODE_ENV === 'development'
      ? { kind: 'local' }
      : { kind: 'github', repo: 'RobertGyorgy/JL-Design' },
  
  // Branding
  ui: {
    brand: {
      name: 'JL Mobila',
      mark: () => {
        return createElement(
          'div',
          { style: { display: 'flex', alignItems: 'center' } },
          // Inject a script/style globally into the Keystatic DOM to fix Safari Safe Area overlapping
          createElement('div', {
            dangerouslySetInnerHTML: {
              __html: `
                <style>
                  /* Base padding for Safari notch */
                  body { 
                    padding-top: max(env(safe-area-inset-top), 20px) !important; 
                  }
                  /* Target Keystatic's fixed top navbars and panels by asserting a top margin */
                  body > div, header, nav, [role="banner"] {
                    margin-top: max(env(safe-area-inset-top), 20px) !important;
                  }
                </style>
                <script>
                  // Force viewport-fit=cover so iOS Safari honors safe-area-inset
                  (function() {
                    let meta = document.querySelector('meta[name="viewport"]');
                    if (!meta) {
                      meta = document.createElement('meta');
                      meta.name = 'viewport';
                      document.head.appendChild(meta);
                    }
                    meta.content = 'width=device-width, initial-scale=1, viewport-fit=cover';
                  })();
                </script>
              `
            }
          }),
          'JL Mobila'
        );
      }
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
        category: fields.select({
            label: 'Categorie',
            description: 'Categoria din care face parte proiectul',
            options: [
                { label: 'Living', value: 'Living' },
                { label: 'Dormitor', value: 'Dormitor' },
                { label: 'Bucătărie', value: 'Bucătărie' },
                { label: 'Baie', value: 'Baie' },
                { label: 'Office', value: 'Office' },
                { label: 'Commercial', value: 'Commercial' },
                { label: 'Hol', value: 'Hol' },
                { label: 'Altele', value: 'Altele' },
            ],
            defaultValue: 'Altele',
        }),
        content: fields.markdoc({
          label: 'Descriere',
          description: 'Detalii despre proiect (opțional)',
        }),
      },
    }),
  },
});
