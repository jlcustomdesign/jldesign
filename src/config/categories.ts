/**
 * categories.ts — conținut pentru paginile de categorie (landing SEO).
 *
 * Paginile NU apar în meniul principal — sunt descoperite de Google prin
 * sitemap și prin linkuri contextuale. Fiecare țintește o căutare locală
 * distinctă (ex. „bucătărie la comandă Brașov”).
 */

export interface CategoryFaq {
  q: string;
  a: string;
}

export interface CategoryPage {
  /** Folosit în breadcrumbs și titluri interne */
  name: string;
  /** URL-ul paginii (fără slash la final) */
  slug: string;
  h1: string;
  /** <title> și og:title */
  title: string;
  /** meta description */
  description: string;
  /** Fraza de serviciu pentru schema Service */
  serviceName: string;
  lead: string;
  paragraphs: string[];
  highlights: { title: string; desc: string }[];
  materials: string[];
  faqs: CategoryFaq[];
  image: string;
  imageAlt: string;
}

const MATERIALS_COMMON =
  "Feronerie premium Blum, Hettich și Hafele, cu sisteme soft-close și glisiere tandem.";

export const CATEGORIES: Record<string, CategoryPage> = {
  bucatarii: {
    name: "Bucătării",
    slug: "bucatarii-la-comanda-brasov",
    h1: "Bucătării la comandă în Brașov",
    title: "Bucătării la Comandă Brașov | Bucătărie Personalizată — JL Custom Design",
    description:
      "Bucătării la comandă în Brașov, proiectate milimetric pentru spațiul tău: MDF vopsit, PAL Egger, lemn masiv, feronerie Blum. Proiectare 3D, execuție și montaj.",
    serviceName: "Bucătării la comandă în Brașov",
    lead: "Proiectăm și executăm bucătării la comandă în Brașov, adaptate milimetric spațiului, electrocasnicelor tale și modului în care gătești.",
    paragraphs: [
      "O bucătărie la comandă pornește de la măsurători la fața locului și de la o discuție despre cum folosești spațiul: zona de gătit, depozitarea, poziția electrocasnicelor și fluxul de lucru. Pe baza acestora realizăm proiectarea 3D, cu randări fotorealiste, astfel încât vezi exact cum va arăta bucătăria înainte de producție.",
      "Execuția se face în atelierul nostru din Brașov, din materiale premium — MDF vopsit mat sau lucios în orice cod RAL, MDF frezat, PAL melaminat Egger și Kronospan sau lemn masiv — iar montajul este asigurat de echipa noastră. " +
        MATERIALS_COMMON,
    ],
    highlights: [
      { title: "Proiectare 3D inclusă", desc: "Randări fotorealiste înainte de execuție, cu materialele și culorile reale." },
      { title: "Integrare electrocasnice", desc: "Corpuri proiectate milimetric pentru cuptor, plită, hotă, frigider și mașina de spălat." },
      { title: "Materiale premium", desc: "MDF vopsit în orice cod RAL, PAL Egger/Kronospan, furnir natural sau lemn masiv." },
      { title: "Blaturi și soluții smart", desc: "Compartimentări eficiente, sertare tandem, colțuri cu sisteme LeMans sau Magic Corner." },
      { title: "Montaj profesional", desc: "Livrare și montaj realizate de echipa proprie, cu finisaje impecabile." },
    ],
    materials: [
      "MDF vopsit mat / lucios (orice cod RAL)",
      "MDF frezat și înfoliat",
      "PAL melaminat Egger / Kronospan",
      "Lemn masiv (stejar, fag, frasin)",
      "Furnir natural",
      "Feronerie Blum, Hettich, Hafele",
    ],
    faqs: [
      {
        q: "Cât costă o bucătărie la comandă în Brașov?",
        a: "Prețul depinde de dimensiuni, materiale și nivelul de personalizare — fronturile din MDF vopsit, MDF frezat sau PAL melaminat, feroneria și soluțiile de organizare influențează costul final. Nu calculăm „la metru liniar”: fiecare proiect primește o ofertă individuală, după măsurători și proiectare.",
      },
      {
        q: "Cât durează execuția unei bucătării la comandă?",
        a: "În funcție de complexitate, termenul de livrare este de 4–8 săptămâni de la semnarea contractului și stabilirea detaliilor tehnice finale.",
      },
      {
        q: "Realizați bucătării din MDF vopsit?",
        a: "Da, bucătăriile din MDF vopsit sunt printre cele mai solicitate proiecte ale noastre. Oferim finisaje mate, lucioase sau texturate, cu vopsire în orice cod RAL.",
      },
    ],
    image: "/Poze JL Custom Design - Site/Services/Bucatarii.webp",
    imageAlt: "Bucătărie la comandă realizată de JL Custom Design în Brașov — fronturi MDF vopsit",
  },

  dressinguri: {
    name: "Dressinguri",
    slug: "dressinguri-la-comanda-brasov",
    h1: "Dressinguri la comandă în Brașov",
    title: "Dressing la Comandă Brașov | Dulapuri și Dressinguri Personalizate — JL Custom Design",
    description:
      "Dressinguri și dulapuri la comandă în Brașov, cu compartimentare adaptată garderobei tale: uși glisante, MDF vopsit, oglindă, iluminare LED. Proiectare 3D și montaj.",
    serviceName: "Dressinguri la comandă în Brașov",
    lead: "Realizăm dressinguri și dulapuri la comandă în Brașov, cu compartimentare gândită pe volumul real de haine, pantofi și accesorii.",
    paragraphs: [
      "Un dressing bun nu pornește de la un catalog, ci de la ce ai de depozitat. Analizăm împreună nevoile tale — haine pe umeraș, haine pliate, pantofi, accesorii, valize — și proiectăm compartimentarea astfel încât fiecare centimetru să fie folosit eficient, inclusiv în spații atipice, mansarde sau nișe.",
      "Executăm dressinguri walk-in, dulapuri cu uși glisante sau cu balamale, cu fronturi din MDF vopsit, PAL melaminat, oglindă sau combinații cu sticlă și profile de aluminiu. Putem integra iluminare LED cu senzori, bare telescopice, sertare cu separatori și pantofare dedicate.",
    ],
    highlights: [
      { title: "Compartimentare personalizată", desc: "Zone pentru haine lungi, scurte, pliate, pantofi și accesorii, adaptate garderobei tale." },
      { title: "Spații atipice", desc: "Soluții pentru mansarde, nișe, pereți înclinați sau colțuri dificile." },
      { title: "Uși glisante sau batante", desc: "Sisteme glisante cu amortizare sau uși cu balamale soft-close, la alegere." },
      { title: "Iluminare LED integrată", desc: "Benzi LED cu senzor de mișcare, pentru vizibilitate perfectă." },
      { title: "Oglindă și sticlă", desc: "Fronturi cu oglindă, sticlă vopsită sau profile slim de aluminiu." },
    ],
    materials: [
      "MDF vopsit mat / lucios",
      "PAL melaminat Egger / Kronospan",
      "Oglindă și sticlă vopsită",
      "Profile aluminiu pentru uși glisante",
      "Iluminare LED cu senzori",
      "Feronerie Blum, Hettich, Hafele",
    ],
    faqs: [
      {
        q: "Cât costă un dressing la comandă?",
        a: "Costul depinde de dimensiuni, fronturi, compartimentare și accesorii (iluminare LED, sisteme glisante, organizatoare). După măsurători primești o ofertă personalizată, nu un preț generic la metru.",
      },
      {
        q: "Puteți amenaja un dressing walk-in într-o cameră mică?",
        a: "Da, proiectăm dressinguri walk-in chiar și în spații compacte, cu compartimentare verticală eficientă și iluminare integrată, precum și dulapuri pentru apartamente mici.",
      },
      {
        q: "Oferiți garanție pentru dressinguri?",
        a: "Da, oferim 24 de luni garanție pentru mobilier și garanția producătorului pentru feronerie — până la 20 de ani pentru sistemele Blum.",
      },
    ],
    image: "/Poze JL Custom Design - Site/Services/Dressing.webp",
    imageAlt: "Dressing la comandă cu compartimentare personalizată — JL Custom Design Brașov",
  },

  dormitor: {
    name: "Dormitor",
    slug: "mobila-dormitor-brasov",
    h1: "Mobilă de dormitor la comandă în Brașov",
    title: "Mobilă Dormitor la Comandă Brașov | Paturi, Dulapuri, Noptiere — JL Custom Design",
    description:
      "Mobilier de dormitor la comandă în Brașov: paturi, dulapuri, noptiere și comode, proiectate pe dimensiunile camerei tale. Materiale premium, proiectare 3D, montaj inclus.",
    serviceName: "Mobilier de dormitor la comandă în Brașov",
    lead: "Proiectăm mobilier de dormitor la comandă în Brașov — paturi, dulapuri, noptiere și comode adaptate exact dimensiunilor și stilului camerei tale.",
    paragraphs: [
      "Dormitorul este camera în care dimensiunile contează cel mai mult: un dulap care ajunge până în tavan, noptiere la înălțimea potrivită sau un pat cu spațiu de depozitare integrat pot transforma complet funcționalitatea camerei. Fiecare proiect pornește de la măsurători precise și de la proiectare 3D.",
      "Executăm paturi cu somieră și depozitare, tablii tăpite sau din lemn, dulapuri cu compartimentare personalizată, noptiere suspendate sau clasice și comode cu sertare soft-close. Materialele variază de la PAL melaminat Egger la MDF vopsit și lemn masiv, în funcție de buget și de estetică.",
    ],
    highlights: [
      { title: "Dulapuri până în tavan", desc: "Folosire maximă a înălțimii camerei, fără spații moarte deasupra dulapului." },
      { title: "Paturi cu depozitare", desc: "Somieră rabatabilă sau sertare integrate pentru lenjerie și pilote." },
      { title: "Noptiere suspendate", desc: "Aspect modern și curățenie ușoară, cu sertare soft-close." },
      { title: "Tablii personalizate", desc: "Lemn, furnir, țesătură sau combinații cu iluminare ambientală." },
      { title: "Compartimentare pe măsura ta", desc: "Interiorul dulapului gândit pentru garderoba ta reală." },
    ],
    materials: [
      "PAL melaminat Egger / Kronospan",
      "MDF vopsit mat / lucios",
      "Lemn masiv (stejar, fag, frasin)",
      "Furnir natural",
      "Țesături și piele pentru tablii",
      "Feronerie Blum, Hettich",
    ],
    faqs: [
      {
        q: "Realizați mobilier de dormitor pentru camere mici?",
        a: "Da, proiectăm mobilier personalizat pentru apartamente și dormitoare compacte: dulapuri până în tavan, paturi cu depozitare și noptiere suspendate care optimizează fiecare zonă.",
      },
      {
        q: "Pot comanda doar un dulap, nu tot dormitorul?",
        a: "Desigur. Realizăm și piese individuale — dulapuri, comode, noptiere sau paturi — nu doar seturi complete de dormitor.",
      },
      {
        q: "Cât durează producția unui dormitor la comandă?",
        a: "Termenul standard este de 4–8 săptămâni de la semnarea contractului, în funcție de complexitatea proiectului.",
      },
    ],
    image: "/Poze JL Custom Design - Site/Services/Dormitor.webp",
    imageAlt: "Mobilier de dormitor la comandă — dulap și noptiere realizate de JL Custom Design Brașov",
  },

  living: {
    name: "Living",
    slug: "mobilier-living-brasov",
    h1: "Mobilier de living și biblioteci la comandă în Brașov",
    title: "Mobilier Living la Comandă Brașov | Biblioteci și Comode TV — JL Custom Design",
    description:
      "Mobilier de living la comandă în Brașov: biblioteci, comode TV, rafturi și sisteme de depozitare proiectate milimetric. Integrare echipamente media, proiectare 3D, montaj.",
    serviceName: "Mobilier de living la comandă în Brașov",
    lead: "Realizăm mobilier de living și biblioteci la comandă în Brașov — de la comode TV suspendate la biblioteci pe tot peretele, integrate cu echipamentele tale media.",
    paragraphs: [
      "Zona de living adună cele mai multe cerințe contradictorii: trebuie să arate bine, să ascundă cablurile, să integreze televizorul și sistemul audio și să ofere depozitare reală. De aceea proiectăm fiecare ansamblu milimetric, pornind de la echipamentele tale și de la dimensiunile camerei.",
      "Executăm biblioteci pe întregul perete, comode TV suspendate, vitrine cu sticlă și iluminare LED, rafturi modulare și panouri decorative din lemn sau furnir. Proiectarea 3D îți arată din start cum se îmbină materialele și culorile cu restul casei.",
    ],
    highlights: [
      { title: "Integrare media completă", desc: "Spații dedicate pentru TV, soundbar, console și router, cu management al cablurilor." },
      { title: "Biblioteci pe tot peretele", desc: "Rafturi și corpuri proiectate milimetric, de la podea la tavan." },
      { title: "Iluminare LED", desc: "Vitrine și rafturi cu iluminare integrată pentru un efect spectaculos." },
      { title: "Corpuri suspendate", desc: "Comode TV și rafturi flotante, pentru un aer modern și ușor de întreținut." },
      { title: "Panouri decorative", desc: "Riflaj din lemn, furnir sau MDF frezat pentru accente arhitecturale." },
    ],
    materials: [
      "MDF vopsit mat / lucios",
      "Furnir natural de stejar",
      "Lemn masiv",
      "PAL melaminat Egger",
      "Sticlă și profile aluminiu",
      "Iluminare LED integrată",
    ],
    faqs: [
      {
        q: "Puteți integra televizorul și sistemul audio în mobilier?",
        a: "Da, proiectăm mobilierul pentru integrarea echipamentelor media: spații ventilate, treceri de cabluri, console pentru receivere și suport pentru TV, totul ascuns elegant.",
      },
      {
        q: "Realizați biblioteci pe întregul perete?",
        a: "Da, bibliotecile de la podea la tavan sunt printre proiectele noastre frecvente. Compartimentarea este adaptată cărților, obiectelor decorative și depozitării închise.",
      },
      {
        q: "Ce stiluri de mobilier de living realizați?",
        a: "Orice stil: modern minimalist cu push-to-open, clasic cu profile, industrial cu metal și lemn sau scandinav cu tonuri calde.",
      },
    ],
    image: "/Poze JL Custom Design - Site/Services/Living.webp",
    imageAlt: "Mobilier de living la comandă — bibliotecă și comodă TV realizate de JL Custom Design Brașov",
  },

  baie: {
    name: "Baie",
    slug: "mobila-baie-brasov",
    h1: "Mobilă de baie la comandă în Brașov",
    title: "Mobilă Baie la Comandă Brașov | Mobilier Rezistent la Umiditate — JL Custom Design",
    description:
      "Mobilier de baie la comandă în Brașov: baze lavoar, dulapuri și corpuri suspendate din materiale rezistente la umiditate. Proiectare pe instalațiile tale, montaj profesional.",
    serviceName: "Mobilier de baie la comandă în Brașov",
    lead: "Proiectăm mobilier de baie la comandă în Brașov, din materiale și sisteme de prindere rezistente la umiditate, configurate pe instalațiile sanitare existente.",
    paragraphs: [
      "Baia este cel mai pretentios spațiu pentru mobilier: umiditate ridicată, instalații fixe și dimensiuni adesea mici. De aceea folosim materiale rezistente la umiditate — MDF laccuit, PAL compact, fronturi înfoliate — și feronerie cu tratament anticoroziv, iar fiecare corp este proiectat în jurul poziției reale a instalațiilor.",
      "Executăm baze lavoar suspendate sau pe picioare, dulapuri înalte pentru depozitare, oglinzi cu iluminare, corpuri pentru mașina de spălat și mascarea instalațiilor, toate cu sertare și sisteme de organizare interioară.",
    ],
    highlights: [
      { title: "Rezistență la umiditate", desc: "Materiale și adezivi speciali, canturi sigilate și feronerie anticorozivă." },
      { title: "Proiectare pe instalații", desc: "Corpuri gândite în jurul poziției reale a țevilor, sifoanelor și robinetelor." },
      { title: "Corpuri suspendate", desc: "Baze lavoar flotante, ușor de curățat, cu senzor de spațiu mai mare." },
      { title: "Depozitare inteligentă", desc: "Sertare cu decupaje pentru sifon, organizatoare și dulapuri înalte." },
      { title: "Oglinzi cu LED", desc: "Oglinzi cu iluminare integrată și opțional sistem anti-aburire." },
    ],
    materials: [
      "MDF laccuit rezistent la umiditate",
      "Fronturi înfoliate (ușor de întreținut)",
      "PAL compact / HPL",
      "Feronerie cu tratament anticoroziv",
      "Sticlă și oglinzi cu LED",
      "Blaturi din compozit sau quarț",
    ],
    faqs: [
      {
        q: "Mobilierul de baie rezistă la umiditate?",
        a: "Da. Folosim materiale speciale — MDF laccuit, PAL compact, fronturi înfoliate — cu canturi sigilate și feronerie anticorozivă, gândite pentru spații cu umiditate ridicată.",
      },
      {
        q: "Puteți realiza o bază lavoar pe dimensiune atipică?",
        a: "Da, exact acesta este avantajul mobilei la comandă: proiectăm baza lavoar pe dimensiunea băii tale și pe poziția instalațiilor existente.",
      },
      {
        q: "Vă ocupați și de montaj?",
        a: "Da, ne ocupăm de întregul proces — proiectare, producție, livrare și montaj final al mobilierului de baie.",
      },
    ],
    image: "/Poze JL Custom Design - Site/Services/Baie.webp",
    imageAlt: "Mobilier de baie la comandă rezistent la umiditate — JL Custom Design Brașov",
  },

  birouri: {
    name: "Birouri & Comercial",
    slug: "mobilier-birouri-brasov",
    h1: "Mobilier pentru birouri și spații comerciale la comandă în Brașov",
    title: "Mobilier Birouri și Spații Comerciale Brașov | HoReCa — JL Custom Design",
    description:
      "Mobilier la comandă pentru birouri, recepții, cabinete și spații HoReCa în Brașov: birouri executive, open-space, amenajări cafenele și pensiuni. Proiecte complete, montaj inclus.",
    serviceName: "Mobilier pentru birouri și spații comerciale în Brașov",
    lead: "Realizăm mobilier la comandă pentru birouri, recepții și spații comerciale sau HoReCa în Brașov — proiecte gândite pentru utilizare intensă și imagine profesională.",
    paragraphs: [
      "Mobilierul comercial are alte reguli decât cel rezidențial: trafic intens, uzură zilnică și nevoia de a transmite o imagine coerentă a brandului. Am livrat proiecte pentru birouri executive, recepții, cabinete, cafenele, restaurante și pensiuni în Brașov, Sibiu și Buzău.",
      "Executăm birouri executive, stații de lucru open-space, recepții, mobilier de arhivare, amenajări complete pentru camere de hotel și pensiuni, mese și mobilier pentru cafenele și restaurante. Oferim proiectare 3D, planificare pe faze și montaj programat astfel încât activitatea ta să fie întreruptă cât mai puțin.",
    ],
    highlights: [
      { title: "Proiecte comerciale complete", desc: "De la recepții și birouri la amenajări HoReCa complete, cu un singur partener." },
      { title: "Materiale pentru uz intens", desc: "PAL compact, HPL și feronerie profesională, gândite pentru trafic ridicat." },
      { title: "Imagine de brand", desc: "Mobilier adaptat identității vizuale a afacerii tale — culori, materiale, finisaje." },
      { title: "Montaj pe faze", desc: "Planificăm montajul astfel încât să nu-ți oprești activitatea." },
      { title: "Experiență dovedită", desc: "Proiecte comerciale livrate în Brașov, Sibiu și Buzău." },
    ],
    materials: [
      "PAL compact / HPL pentru uz intens",
      "PAL melaminat Egger / Kronospan",
      "MDF vopsit",
      "Lemn masiv și furnir pentru zone premium",
      "Metal și sticlă",
      "Feronerie profesională Blum, Hettich",
    ],
    faqs: [
      {
        q: "Realizați mobilier comercial și pentru birouri?",
        a: "Da, realizăm mobilier comercial la comandă: recepții, birouri executive, soluții open-space, rafturi comerciale și amenajări HoReCa. Avem experiență cu proiecte comerciale în Brașov, Sibiu și Buzău.",
      },
      {
        q: "Lucrați și cu termene strânse pentru spații comerciale?",
        a: "Planificăm producția și montajul pe faze, în funcție de calendarul deschiderii sau al renovării tale. Termenul standard este de 4–8 săptămâni, iar pentru proiecte comerciale stabilim împreună un grafic detaliat.",
      },
      {
        q: "Realizați mobilier pentru pensiuni și hoteluri?",
        a: "Da, amenajăm camere de cazare, recepții și zone de servire pentru pensiuni și hoteluri, cu mobilier gândit pentru utilizare frecventă.",
      },
    ],
    image: "/Poze JL Custom Design - Site/Services/Horeca.webp",
    imageAlt: "Mobilier comercial și HoReCa la comandă realizat de JL Custom Design în Brașov",
  },
};
