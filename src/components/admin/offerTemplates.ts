/** offerTemplates.ts — 5 ready-to-edit starting points, one per DESIGN STYLE.
 *  Each returns a full Offer (cover + ordered content pages). The user can then
 *  change the style, accent colour and cover composition freely. */
import type { Offer, Section, Spec, Swatch, Badge, AccItem, DimBlock } from '../offer/OfferDocument';
import { uid } from '../offer/OfferDocument';

const monthYear = () => {
  const m = ['Ianuarie','Februarie','Martie','Aprilie','Mai','Iunie','Iulie','August','Septembrie','Octombrie','Noiembrie','Decembrie'];
  const d = new Date();
  return `${m[d.getMonth()]} ${d.getFullYear()}`;
};
const WEB = 'www.mobilapersonalizatabrasov.ro';

const descPage = (heading: string, paragraph: string, specs: Spec[]): Section =>
  ({ id: uid('description'), type: 'description', heading, paragraph, image: '', specs });
const matPage = (paragraph: string, swatches: Swatch[], finishes: Badge[]): Section =>
  ({ id: uid('materials'), type: 'materials', heading: 'Materiale atent selectate pentru estetică și durabilitate.', paragraph, image: '', swatches: swatches.map((s) => ({ ...s, image: '' })), finishes });
const accPage = (paragraph: string, items: AccItem[], benefits: string[]): Section =>
  ({ id: uid('accessories'), type: 'accessories', heading: 'Accesorii selectate pentru confort și durabilitate.', paragraph, items: items.map((i) => ({ ...i, image: '' })), benefits: benefits.map((label) => ({ label, desc: '' })) });
const galleryPage = (heading: string, paragraph: string): Section =>
  ({ id: uid('gallery'), type: 'gallery', heading, paragraph, shots: [{ image: '', caption: '' }, { image: '', caption: '' }, { image: '', caption: '' }] });
const textPage = (heading: string, paragraph: string): Section =>
  ({ id: uid('text'), type: 'text', heading, paragraph, image: '' });

const offer = (style: string, category: string, pages: Section[], opts: { accent?: string; coverLayout?: 'right' | 'left' | 'top' } = {}): Offer => ({
  clientName: '', category, date: monthYear(), websiteUrl: WEB, coverImage: '', coverSubtitle: 'MOBILIER PERSONALIZAT',
  style, accent: opts.accent, coverLayout: opts.coverLayout, pages,
});

const FINISHES_STD: Badge[] = [
  { label: 'SUPRAFAȚĂ', desc: 'Textură mată' }, { label: 'REZISTENȚĂ', desc: 'Rezistent la zgârieturi' },
  { label: 'ÎNTREȚINERE UȘOARĂ', desc: 'Ușor de curățat' }, { label: 'MATERIALE SIGURE', desc: 'Materiale certificate' },
];

export interface Template { id: string; name: string; icon: string; description: string; make: () => Offer; }

export const TEMPLATES: Template[] = [
  {
    id: 'editorial', name: 'Editorial', icon: '📜', description: 'Cald, crem, accent auriu — stilul clasic JL.',
    make: () => offer('editorial', 'Bucătărie', [
      descPage('Bucătărie personalizată pentru un spațiu elegant și organizat.',
        'Bucătărie concepută cu atenție la detalii, folosind materiale și soluții constructive moderne. Accentul este pus pe calitatea execuției, funcționalitate și durabilitate.',
        [
          { label: 'FRONTURI', value: 'MDF frezat vopsit / lăcuit mat' },
          { label: 'CORPURI', value: 'PAL Egger 18 mm, cant ABS' },
          { label: 'BLAT', value: 'Blat compact / piatră la alegere' },
          { label: 'FERONERIE', value: 'BLUM premium — soft close' },
          { label: 'ILUMINARE', value: 'Bandă LED sub corpuri suspendate' },
          { label: 'ELECTROCASNICE', value: 'Pregătit pentru integrare completă' },
        ]),
      matPage('Decorurile și finisajele au fost alese pentru integrare armonioasă și rezistență la utilizarea zilnică.',
        [{ label: 'FRONTURI', code: 'MDF vopsit mat' }, { label: 'CORPURI', code: 'PAL Egger U702 ST9' }, { label: 'BLAT', code: 'Blat la alegere' }], FINISHES_STD),
      accPage('Echiparea bucătăriei a fost configurată în funcție de fluxul de lucru și de spațiile disponibile.',
        [{ title: 'Bandă LED COB', description: 'Lumină caldă 24 V sub corpurile suspendate.' }, { title: 'Sertare Blum', description: 'Extragere totală, cu amortizare soft-close.' }, { title: 'Cărucior de colț', description: 'Organizare optimă a spațiului de colț.' }],
        ['Funcționare silențioasă', 'Acces facil', 'Închidere confortabilă', 'Componente premium BLUM']),
    ]),
  },
  {
    id: 'noir', name: 'Noir', icon: '🌑', description: 'Negru dramatic, accent auriu — premium.',
    make: () => offer('noir', 'Living', [
      descPage('Living premium, conceput pentru rafinament și confort.',
        'Un ansamblu sofisticat de mobilier pentru zona de zi, gândit pentru a crea un punct focal elegant, cu accente de iluminare și finisaje premium.',
        [
          { label: 'CORP TV', value: 'Suspendat, push-to-open' },
          { label: 'CORPURI', value: 'PAL Egger 18 mm, cant ABS' },
          { label: 'FRONTURI', value: 'MDF vopsit mat premium' },
          { label: 'FERONERIE', value: 'BLUM premium — soft close' },
          { label: 'ILUMINARE', value: 'LED ambiental în nișe' },
          { label: 'ACCENTE', value: 'Profile metalice fine' },
        ]),
      galleryPage('Galerie proiect.', 'O selecție de imagini din proiectul finalizat.'),
      accPage('Echiparea pune în valoare zona de living, cu iluminare ambientală și deschidere fără mânere.',
        [{ title: 'LED ambiental', description: 'Iluminare caldă în nișe și rafturi.' }, { title: 'Push-to-open', description: 'Deschidere fără mânere, aspect curat.' }, { title: 'Sertare Blum', description: 'Cu amortizare și extragere totală.' }],
        ['Aspect premium', 'Iluminare ambientală', 'Închidere silențioasă', 'Componente BLUM']),
    ]),
  },
  {
    id: 'bold', name: 'Bold', icon: '⬛', description: 'Tipografie mare, alb-negru, modern.',
    make: () => offer('bold', 'Dormitor', [
      descPage('Dormitor modern, proiectat pentru confort și organizare.',
        'Configurația include dulap, dressing și piese complementare, gândite pentru depozitare amplă și o utilizare zilnică plăcută.',
        [
          { label: 'DULAP', value: 'Uși batante / glisante' },
          { label: 'CORPURI', value: 'PAL Egger 18 mm, cant ABS' },
          { label: 'ORGANIZARE', value: 'Bare, sertare și polițe interioare' },
          { label: 'FERONERIE', value: 'BLUM premium — soft close' },
          { label: 'ILUMINARE', value: 'LED integrat în dressing' },
          { label: 'OGLINDĂ', value: 'Opțional, integrată pe ușă' },
        ]),
      matPage('Decorurile au fost alese pentru o atmosferă caldă și relaxantă, cu rezistență în timp.',
        [{ label: 'DECOR PRINCIPAL', code: 'Egger U702 ST9' }, { label: 'DECOR ACCENT', code: 'Egger H3133 ST12' }, { label: 'MÂNERE', code: 'Profil gola' }], FINISHES_STD),
      textPage('De la idee la realitate.',
        'Fiecare proiect pornește de la nevoile tale și se transformă într-un spațiu care îți reflectă stilul.\nÎți mulțumim pentru încredere — suntem gata să începem.'),
    ]),
  },
  {
    id: 'classic', name: 'Clasic', icon: '🏛️', description: 'Elegant, centrat, cu titluri serif.',
    make: () => offer('classic', 'Spațiu comercial', [
      descPage('Mobilier comercial proiectat pentru durabilitate și imagine de brand.',
        'Soluție de mobilier pentru spații comerciale și de birou, gândită pentru rezistență la trafic intens și o imagine profesională.',
        [
          { label: 'STRUCTURĂ', value: 'PAL / MDF de uz intens' },
          { label: 'FRONTURI', value: 'Vopsit / melaminat rezistent' },
          { label: 'BLAT', value: 'HPL / compact de trafic intens' },
          { label: 'FERONERIE', value: 'BLUM / Hettich profesional' },
          { label: 'ILUMINARE', value: 'LED de accent pe brand' },
          { label: 'PERSONALIZARE', value: 'Logo și culori de brand' },
        ]),
      matPage('Materiale alese pentru rezistență la uzură intensă și pentru a reflecta identitatea brandului.',
        [{ label: 'STRUCTURĂ', code: 'PAL de uz intens' }, { label: 'ACCENT BRAND', code: 'Culoare personalizată' }, { label: 'BLAT', code: 'HPL / compact' }],
        [{ label: 'TRAFIC INTENS', desc: 'Rezistent la uzură' }, { label: 'SUPRAFAȚĂ', desc: 'Ușor de igienizat' }, { label: 'PERSONALIZARE', desc: 'Adaptat brandului' }, { label: 'FERONERIE PRO', desc: 'Durabilitate ridicată' }]),
      accPage('Echiparea susține funcționalitatea zilnică și experiența clienților.',
        [{ title: 'LED de brand', description: 'Iluminare de accent pe logo și rafturi.' }, { title: 'Feronerie pro', description: 'Sisteme rezistente la utilizare intensă.' }, { title: 'Organizare modulară', description: 'Configurabilă pentru spațiu.' }],
        ['Rezistent la trafic', 'Imagine de brand', 'Durabilitate ridicată', 'Mentenanță redusă']),
    ]),
  },
  {
    id: 'minimal', name: 'Minimal', icon: '⬜', description: 'Mult spațiu alb, linii fine, discret.',
    make: () => offer('minimal', 'Baie', [
      descPage('Mobilier de baie rezistent la umiditate și ușor de întreținut.',
        'Corp pentru lavoar și piese complementare, realizate din materiale rezistente la umiditate, adaptate spațiului.',
        [
          { label: 'FRONTURI', value: 'MDF vopsit hidrofug' },
          { label: 'CORPURI', value: 'PAL hidrofug 18 mm' },
          { label: 'BLAT', value: 'Compact rezistent la apă' },
          { label: 'FERONERIE', value: 'BLUM — soft close, inox' },
          { label: 'ILUMINARE', value: 'Oglindă cu LED și dezaburire' },
          { label: 'LAVOAR', value: 'Pregătit pentru lavoar la alegere' },
        ]),
      matPage('Materiale special selectate pentru rezistență la umiditate și un aspect curat.',
        [{ label: 'FRONTURI', code: 'MDF vopsit hidrofug' }, { label: 'CORPURI', code: 'PAL hidrofug' }, { label: 'BLAT', code: 'Compact' }],
        [{ label: 'REZISTENȚĂ APĂ', desc: 'Materiale hidrofuge' }, { label: 'SUPRAFAȚĂ', desc: 'Rezistent la abur' }, { label: 'ÎNTREȚINERE', desc: 'Ușor de curățat' }, { label: 'FERONERIE INOX', desc: 'Anticorozivă' }]),
      textPage('Simplitate, în fiecare detaliu.',
        'Un design discret, gândit pentru a aduce ordine și liniște în spațiul tău.\nContactează-ne pentru a stabili următorii pași.'),
    ]),
  },
];
