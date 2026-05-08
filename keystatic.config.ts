import { config, fields, collection } from '@keystatic/core';
import { createElement } from 'react';

export default config({
  storage:
    process.env.NODE_ENV === 'development'
      ? { kind: 'local' }
      : { kind: 'github', repo: 'RobertGyorgy/JL-Design' },
  
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
      'Conținut': ['portfolio', 'categories', 'blog'],
    },
  },

  collections: {
    categories: collection({
      label: 'Categorii',
      slugField: 'name',
      path: 'src/content/categories/*',
      schema: {
        name: fields.slug({ 
          name: { 
            label: 'Nume Categorie',
            description: 'Ex: Bucătărie, Dormitor, Living'
          } 
        }),
      },
    }),

    portfolio: collection({
      label: 'Portofoliu',
      slugField: 'name',
      path: 'src/content/portfolio/*',
      format: { contentField: 'content' },
      entryLayout: 'content',
      schema: {
        name: fields.slug({ 
          name: { 
            label: 'Titlu Proiect (Opțional)',
            description: 'Numele care va apărea pe site'
          } 
        }),
        category: fields.relationship({
            label: 'Categorie',
            collection: 'categories',
            description: 'Alege categoria (adaugă una nouă în secțiunea Categorii dacă lipsește)',
            validation: { isRequired: true }
        }),
        image: fields.image({
          label: 'Imagine Principală',
          description: 'Fotografia premium a proiectului',
          directory: 'public/assets/portfolio',
          publicPath: '/assets/portfolio/',
          validation: { isRequired: true },
        }),
        content: fields.markdoc({
          label: 'Descriere Proiect',
          description: 'Povestea din spatele designului (opțional)',
        }),
      },
    }),

    blog: collection({
      label: 'Blog',
      slugField: 'title',
      path: 'src/content/blog/*',
      format: { contentField: 'content' },
      entryLayout: 'content',
      schema: {
        title: fields.slug({
          name: {
            label: 'Titlu Articol',
            description: 'Un titlu atractiv pentru cititori',
          },
        }),
        info: fields.object({
          publishedDate: fields.date({
            label: 'Data Publicării',
            validation: { isRequired: true },
          }),
          category: fields.select({
            label: 'Categorie',
            options: [
              { label: 'Inspirație & Design', value: 'inspiratie' },
              { label: 'Ghid Practic', value: 'ghid' },
              { label: 'Materiale & Tehnologii', value: 'materiale' },
              { label: 'Proiecte Finalizate', value: 'proiecte' },
              { label: 'Noutăți', value: 'noutati' },
            ],
            defaultValue: 'inspiratie',
          }),
          author: fields.text({
            label: 'Autor',
            defaultValue: 'JL Mobila',
          }),
        }, {
          label: 'Informații Articol',
          description: 'Detalii administrative',
        }),
        seo: fields.object({
          description: fields.text({
            label: 'Descriere SEO (Meta)',
            description: 'Descrierea care apare în Google (max 160 caractere)',
            multiline: true,
            validation: { isRequired: true },
          }),
        }, {
          label: 'SEO',
          description: 'Optimizare pentru motoarele de căutare',
        }),
        media: fields.object({
          coverImage: fields.image({
            label: 'Imagine de Copertă',
            description: 'Imaginea care va apărea în previzualizare',
            directory: 'public/assets/blog',
            publicPath: '/assets/blog/',
            validation: { isRequired: true },
          }),
          coverImageAlt: fields.text({
            label: 'Text Alternativ (SEO)',
            description: 'Descrie ce apare în imagine pentru Google',
            validation: { isRequired: true },
          }),
        }, {
          label: 'Media',
          description: 'Elemente vizuale',
        }),
        content: fields.markdoc({
          label: 'Conținut Articol',
          description: 'Scrie aici povestea articolului tău',
        }),
      },
    }),
  },
});
