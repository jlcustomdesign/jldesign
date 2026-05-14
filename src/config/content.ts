/**
 * content.ts — Single source of truth for ALL user-facing text on the website.
 *
 * ✏️  EDIT THIS FILE to change any text on the website.
 *     You do NOT need to touch any .astro component files.
 *     All animations, layouts, and styles will stay exactly the same.
 *
 * 📝  TIPS:
 *     - Keep text concise and natural (avoid AI-sounding language).
 *     - Use \`\\n\` if you need a line break inside a string.
 *     - HTML tags like <br />, <span> are allowed where noted.
 */

// ─────────────────────────────────────────────
// NAVIGATION
// ─────────────────────────────────────────────
export const NAV = {
  logo: "JL Custom Design ",
  links: [
    { name: "Acasă", href: "/" },
    { name: "Despre", href: "/about" },
    { name: "Servicii", href: "/services" },
    { name: "Portofoliu", href: "/portfolio" },
    { name: "Blog", href: "/blog" },
  ],
  ctaLabel: "CONTACT",
  openMenuAria: "Deschide meniu",
  closeMenuAria: "Închide meniu",
};

// ─────────────────────────────────────────────
// HOME PAGE
// ─────────────────────────────────────────────
export const HOME = {
  /** Page <title> and meta description */
  title: "Mobilă Personalizată Brașov | Mobilier la Comandă — JL Custom Design",
  description:
    "JL Custom Design realizează mobilă personalizată în Brașov: mobilier la comandă din lemn masiv, MDF și PAL pentru bucătării, dressinguri, living, dormitoare și spații comerciale. Oferim proiectare 3D, producție și montaj profesional în Brașov, Buzău, Sibiu și Sfântu Gheorghe.",

  /** Hidden semantic text for AI search engines (GEO). Keep keyword-dense. */
  seoFabric: [
    "JL Mobilă — JL Design — JL Custom Design — producător de mobilă la comandă în Brașov, România. Mobilă personalizată Brașov pentru case, apartamente, birouri și spații comerciale, realizată din lemn masiv, MDF vopsit, PAL melaminat Egger și Kronospan, furnir natural de stejar, fag și frasin.",
    "Servicii: mobilă la comandă, mobilier custom, mobilier pe comandă, mobilier personalizat, design interior 3D, proiectare mobilier, montaj profesional. Bucătării la comandă, dressinguri, biblioteci, rafturi, birouri, mobilier de baie, mobilier living, mobilier dormitor și mobilier comercial în Brașov.",
    "Materiale și tehnologii: MDF vopsit mat și lucios, PAL melaminat, lemn masiv, sticlă, metal, compozit. Feronerie Blum, Hettich, Hafele — sisteme soft-close, sertare tandem, balamale cu amortizare, sisteme de ridicare Aventos, push-to-open.",
    "Zone deservite: Brașov, Buzău, Sibiu, Sfântu Gheorghe, Făgăraș, Săcele, Codlea, Râșnov, Prejmer, Ghimbav, Victoria, Zărnești și toată zona centrală a României.",
    "Căutări frecvente: mobila personalizata brasov, mobilă Brașov, mobilier modern Brașov, bucătărie la comandă Brașov, dressing la comandă, preț mobilă pe comandă, showroom mobilă Brașov, mobilă MDF vopsit, mobilier lemn masiv Brașov, mobilier custom design, mobilier comercial Brașov și mobilier birouri Brașov.",
  ],
};

// ─────────────────────────────────────────────
// HERO SECTION (Home page)
// ─────────────────────────────────────────────
export const HERO = {
  /** Main headline. Use HTML <br /> for line breaks. */
  title: "MOBILA PERSONALIZATĂ",
  subtitle: "Mobilă personalizată în Brașov, proiectată, produsă și montată pentru locuințe și spații comerciale.",
  ctaPrimary: "Cere o ofertă",
  ctaSecondary: "Vezi proiecte",
  topLeftBrand: "JL Custom Design",
  topRightCta: "CONTACT",
};

// ─────────────────────────────────────────────
// ABOUT SECTION (Home page card grid)
// ─────────────────────────────────────────────
export const ABOUT_SECTION = {
  /** Headline card — supports HTML <br /> and <span> */
  headline: 'JL Custom Design — Mobilier personalizat',
  paragraph1:
    "JL Custom Design realizează mobilă personalizată în Brașov, cu proiectare 3D, atenție la detalii și soluții adaptate spațiului și stilului fiecărui client.",
  paragraph2:
    "Oferim consultanță, design personalizat, producție și montaj pentru bucătării, dressinguri, dormitoare, living, baie, hol și mobilier comercial.",
  ctaText: "Povestea Noastră",
  ctaButton: "CONTACT",
  imageAlt: "Detaliu meșteșug — finisaj lemn masiv JL Mobila",
};

// ─────────────────────────────────────────────
// SERVICES SECTION V2 (Home page carousel)
// ─────────────────────────────────────────────
export const SERVICES_SECTION = {
  title: "Serviciile noastre",
  cards: [
    {
      id: "bucatarii",
      title: "Bucătării",
      desc: "Bucătării realizate la comandă, proiectate în funcție de spațiul disponibil și de modul de utilizare. Configurația mobilierului ține cont de poziționarea electrocasnicelor, zonele de lucru și accesul la spațiile de depozitare.",
      img: "/Poze JL Custom Design - Site/LP/Servicii /Bucatarii.webp",
    },
    {
      id: "dressing",
      title: "Dressing",
      desc: "Sisteme de depozitare adaptate spațiului disponibil. Compartimentarea este stabilită în funcție de tipurile de obiecte depozitate: haine, încălțăminte, accesorii sau bagaje.",
      img: "/Poze JL Custom Design - Site/LP/Servicii /Dressing.webp",
    },
    {
      id: "dormitor",
      title: "Dormitor",
      desc: "Mobilier pentru dormitor realizat la comandă: paturi, noptiere, comode sau dulapuri. Dimensiunile și compartimentarea sunt adaptate spațiului și modului de utilizare.",
      img: "/Poze JL Custom Design - Site/LP/Servicii /Dormitor.webp",
    },
    {
      id: "living",
      title: "Living / Library",
      desc: "Mobilier pentru zona de living sau bibliotecă, configurat pentru integrarea echipamentelor media, rafturilor și spațiilor de depozitare. Dimensiunile și compartimentarea sunt adaptate spațiului camerei.",
      img: "/Poze JL Custom Design - Site/LP/Servicii /Living.webp",
    },
    {
      id: "baie",
      title: "Mobilier pentru Baie",
      desc: "Corpuri de mobilier proiectate pentru spații cu umiditate ridicată, cu materiale și sisteme de prindere adecvate. Configurația ține cont de poziția instalațiilor sanitare și de spațiul disponibil.",
      img: "/Poze JL Custom Design - Site/LP/Servicii /Baie.webp",
    },
    {
      id: "hol",
      title: "Hol",
      desc: "Mobilier pentru zona de intrare: dulapuri, pantofare, băncuțe sau panouri cuier. Configurația este adaptată spațiului disponibil și necesarului de depozitare.",
      img: "/Poze JL Custom Design - Site/LP/Servicii /Hol.webp",
    },
    {
      id: "office",
      title: "Office",
      desc: "Mobilier pentru birouri, spații de lucru sau zone de recepție. Proiectele sunt orientate către organizarea documentelor, integrarea echipamentelor și utilizarea eficientă a spațiului.",
      img: "/Poze JL Custom Design - Site/LP/Servicii /Birou director.webp",
    },
    {
      id: "horeca",
      title: "HoReCa",
      desc: "Mobilier pentru pensiuni, hoteluri, cafenele sau restaurante. Soluțiile sunt adaptate utilizării frecvente și configurate în funcție de tipul spațiului: camere de cazare, zone de servire sau recepție.",
      img: "/Poze JL Custom Design - Site/LP/Servicii /Horeca.webp",
    },
  ],
  navPrevAria: "Previous",
  navNextAria: "Next",
  flipCardAria: "Flip Card",
  flipBackAria: "Flip Back",
  viewProjectLabel: "Vezi Proiect",
};

// ─────────────────────────────────────────────
// PORTFOLIO SECTION (Home page masonry)
// ─────────────────────────────────────────────
export const PORTFOLIO_SECTION = {
  title: "Portofoliu selectiv → Poze",
  /** These are example/placeholder projects for the home page grid */
  projects: [
    { name: "Dormitor", material: "JL Custom Design", image: "/Poze JL Custom Design - Site/LP/Portfolio/Portfolio 5.webp" },
    { name: "Baie", material: "JL Custom Design", image: "/Poze JL Custom Design - Site/LP/Portfolio/Portfolio 2.webp" },
    { name: "Bucatarie", material: "JL Custom Design", image: "/Poze JL Custom Design - Site/LP/Portfolio/Portfolio 6.webp" },
    { name: "Hol", material: "JL Custom Design", image: "/Poze JL Custom Design - Site/LP/Portfolio/Portfolio 4.webp" },
    { name: "Dormitor", material: "JL Custom Design", image: "/Poze JL Custom Design - Site/LP/Portfolio/Portfolio 1.webp" },
    { name: "Dormitor", material: "JL Custom Design", image: "/Poze JL Custom Design - Site/LP/Portfolio/Portfolio 3.webp" },
    { name: "Birou", material: "JL Custom Design", image: "/Poze JL Custom Design - Site/LP/Portfolio/Portfolio 7.webp" },
    { name: "Showroom", material: "JL Custom Design", image: "/Poze JL Custom Design - Site/LP/Portfolio/Portfolio 8.webp" },
  ],
};

// ─────────────────────────────────────────────
// PROCESS SECTION (Home page steps)
// ─────────────────────────────────────────────
export const PROCESS = {
  title: "Procesul nostru",
  ctaButton: "Începe Proiectul",
  steps: [
    {
      step: "01",
      title: "Consultanță și măsurători",
      desc: "Fiecare proiect începe cu o întâlnire unde ascultăm cu atenție dorințele și nevoile tale, identificând cerințele și realizând măsurătorile necesare.",
      img: "/Poze JL Custom Design - Site/LP/Proces/masuratori.webp",
    },
    {
      step: "02",
      title: "Proiectare tehnică și randări",
      desc: "Creăm designul proiectului și modelarea 3D, oferind o viziune clară și randări fotorealiste ale rezultatului final înainte de execuție.",
      img: "/Poze JL Custom Design - Site/LP/Proces/desen tehnic.webp",
    },
    {
      step: "03",
      title: "Producție",
      desc: "Materialele sunt pregătite cu precizie în atelierul nostru, respectând cele mai înalte standarde de calitate și atenție la detalii.",
      img: "/Poze JL Custom Design - Site/LP/Proces/Decupare.webp",
    },
    {
      step: "04",
      title: "Livrare și montaj",
      desc: "Finalizăm proiectul cu o instalare profesionistă, garantând satisfacția deplină și transformând spațiul tău într-o operă de artă.",
      img: "/Poze JL Custom Design - Site/LP/Proces/Montaj.webp",
    },
  ],
};

// ─────────────────────────────────────────────
// BLOG PREVIEW (Home page latest posts)
// ─────────────────────────────────────────────
export const BLOG_PREVIEW = {
  /** Title — supports HTML <span> */
  title: 'Din Atelierul de <span class="text-accent">Idei</span>',
  subtitle:
    "Descoperă ultimele tendințe în design interior, ghiduri despre materiale premium și proiecte care prind viață în mâinile meșterilor noștri.",
  ctaButton: "Vezi Tot Blogul",
  categoryLabels: {
    inspiratie: "Inspirație & Design",
    ghid: "Ghid Practic",
    materiale: "Materiale & Tehnologii",
    proiecte: "Proiecte Finalizate",
    noutati: "Noutăți",
  } as Record<string, string>,
};

// ─────────────────────────────────────────────
// BREADCRUMBS
// ─────────────────────────────────────────────
export const BREADCRUMBS = {
  home: "Acasă",
  about: "Despre Noi",
  services: "Servicii",
  portfolio: "Portofoliu",
  blog: "Blog",
};

// ─────────────────────────────────────────────
// FAQ SECTION
// ─────────────────────────────────────────────
export const FAQ = {
  title: "Întrebări Frecvente",
  items: [
    {
      q: "Cât durează execuția unei comenzi?",
      a: "În funcție de complexitatea proiectului, termenul de livrare variază între 4 și 8 săptămâni de la semnarea contractului și stabilirea detaliilor tehnice finale.",
    },
    {
      q: "Oferiți garanție pentru mobilier?",
      a: "Da, oferim o garanție comercială de 24 de luni pentru mobilier și garanția producătorului pentru feronerie (care poate ajunge până la 20 de ani la branduri precum Blum).",
    },
    {
      q: "Realizați și proiectare 3D?",
      a: "Absolut. Fiecare proiect începe cu o etapă de consultanță și proiectare 3D, astfel încât să puteți vizualiza exact cum va arăta spațiul dumneavoastră final.",
    },
    {
      q: "Ce tipuri de materiale folosiți?",
      a: "Lucrăm cu o gamă variată de materiale premium: MDF vopsit sau înfoliat, PAL melaminat Egger/Kronospan, furnir natural, lemn masiv, sticlă, metal și compozit.",
    },
    {
      q: "Este necesară o programare pentru vizita în showroom?",
      a: "Pentru a ne asigura că un designer vă poate acorda întreaga atenție, recomandăm programarea unei vizite în prealabil, telefonic sau prin email.",
    },
    {
      q: "Vă ocupați și de integrarea electrocasnicelor?",
      a: "Desigur. Mobilierul este proiectat milimetric pentru a încorpora perfect electrocasnicele dumneavoastră, indiferent de marcă sau dimensiuni.",
    },
    {
      q: "Care sunt condițiile de plată?",
      a: "Standardul nostru este un avans de 50% la semnarea contractului pentru a demara producția, iar restul de 50% se achită înainte de livrare și montaj.",
    },
    {
      q: "Livrați mobilier și în afara Brașovului?",
      a: "Da, livrăm și montăm în toată zona: Buzău, Sibiu, Sfântu Gheorghe, Făgăraș, Săcele, Codlea, Râșnov și împrejurimi. De asemenea, realizăm proiecte la nivel național cu un cost suplimentar de transport.",
    },
    {
      q: "Cât costă mobila la comandă în Brașov?",
      a: "Prețul variază în funcție de materiale, dimensiuni și complexitate. O bucătărie completă din MDF vopsit pornește de la aproximativ 8.000 lei, iar un dressing din PAL melaminat de la 4.000 lei. Oferim deviz detaliat gratuit după măsurători.",
    },
    {
      q: "Ce stiluri de mobilier realizați?",
      a: "Realizăm mobilier în orice stil: modern minimalist cu linii drepte și sisteme push-to-open, clasic cu profile și mânere elegante, industrial cu metal și lemn, sau scandinav cu tonuri calde și forme organice.",
    },
    {
      q: "Realizați bucătării din MDF vopsit?",
      a: "Da, bucătăriile din MDF vopsit sunt printre cele mai solicitate produse ale noastre. Oferim finisaje mate, lucioase sau texturate, cu posibilitate de vopsire în orice cod RAL pentru a se potrivi perfect designului dumneavoastră.",
    },
    {
      q: "Lucrați cu lemn masiv sau PAL?",
      a: "Lucrăm cu ambele, în funcție de proiect. Lemnul masiv (stejar, fag, frasin) oferă durabilitate și textură naturală, iar PAL melaminat Egger/Kronospan oferă un raport calitate-preț excelent cu o varietate largă de decoruri.",
    },
    {
      q: "Cum se desfășoară procesul de comandă?",
      a: "Procesul constă în 4 etape: (1) Consultanță — discutăm nevoile și luăm măsurători la fața locului; (2) Proiectare 3D — vedeți randări fotorealistice; (3) Producție — utilaje CNC și finisaje manuale; (4) Montaj — echipa noastră instalează totul la locație.",
    },
    {
      q: "Ce feronerie folosiți pentru mobilier?",
      a: "Folosim feronerie premium de la branduri precum Blum, Hettich și Hafele. Aceasta include balamale cu amortizare soft-close, sertare cu glisiere tandem, sisteme de ridicare Aventos și organizatoare interne de înaltă calitate.",
    },
    {
      q: "Aveți showroom în Brașov?",
      a: "Da, avem un spațiu de prezentare în Brașov unde puteți vedea și atinge materialele, testa sistemele de feronerie și discuta direct cu designerii noștri. Recomandăm programarea unei vizite pentru o experiență completă.",
    },
    {
      q: "Realizați mobilier comercial și pentru birouri?",
      a: "Da, realizăm mobilier comercial la comandă: recepții, birouri executive, soluții open-space, rafturi comerciale și amenajări HoReCa. Avem experiență cu proiecte comerciale în Brașov, Sibiu și Buzău.",
    },
  ],
};

// ─────────────────────────────────────────────
// FOOTER
// ─────────────────────────────────────────────
export const FOOTER = {
  headline: 'Transformăm <br /><span class="text-accent">viziunea ta</span> în realitate.',
  ctaPrimary: "Sună-ne Acum",
  ctaSecondary: "Scrie-ne",
  menuTitle: "Meniu",
  menuLinks: [
    { name: "Acasă", href: "/" },
    { name: "Portofoliu", href: "/portfolio" },
    { name: "Servicii", href: "/services" },
    { name: "Despre Noi", href: "/about" },
    { name: "Blog", href: "/blog" },
  ],
  contactTitle: "Contact",
  contactLocation: "Brașov, România",
  contactPhone: "+40 700 000 000",
  contactPhoneHref: "tel:+40700000000",
  contactEmail: "contact@jlmobila.ro",
  contactEmailHref: "mailto:contact@jlmobila.ro",
  copyright: "JL Mobila. Toate drepturile rezervate.",
  designCredit: "Designed and made by",
  designCreditLink: "achieve.ro",
  designCreditUrl: "https://achieve.ro",
  privacyLink: "Politica de Confidențialitate",
  termsLink: "Termeni și Condiții",
};

// ─────────────────────────────────────────────
// SERVICES PAGE
// ─────────────────────────────────────────────
export const SERVICES_PAGE = {
  title: "Servicii Mobilier la Comandă | JL Mobila - Design, Producție și Montaj",
  description:
    "Descoperă serviciile complete JL Mobila: Consultanță & Design 3D, Producție Custom cu materiale premium și Montaj Profesional. Fiecare proiect de mobilier la comandă este unic.",

  seoFabric: [
    "JL Mobila oferă servicii complete de mobilier la comandă în Brașov, Buzău, Sibiu și Sfântu Gheorghe: Consultanță & Design 3D, Producție Custom din lemn masiv cu materiale premium, și Montaj Profesional. Fiecare proiect include măsurători la fața locului, randări fotorealistice, și o garanție de 24 de luni.",
    "Servicii mobilier: bucătării custom, dressinguri și wardrobes, living și biblioteci, birouri și mobilier comercial, mobilier de baie rezistent la umiditate. Materiale: MDF vopsit mat/lucios, PAL melaminat Egger, lemn masiv stejar/fag/frasin, furnir natural, sticlă, metal. Feronerie Blum soft-close, Hettich, Hafele. Utilaje CNC de ultimă generație.",
  ],

  heroH1: "Servicii mobilier la comandă Brașov: Design, Producție, Montaj —",
  heroDesktopLines: ["SERVICIILE", "PE CARE NOI", "LE OFERIM"],
  heroMobileLines: ["Serviciile", "pe care noi", "le oferim"],
  heroSubtitle:
    "Transformă-ți casa cu design interior elegant, funcțional și atemporal, adaptat stilului tău unic.",
  heroCta: "Programează o Consultanță →",
  heroCardTitle: "Soluții de Design Personalizate",
  heroCardDesc: "Interioare create special pentru a reflecta viziunea ta.",
  heroCardCta: "Programează o Consultanță →",

  /** Process-oriented services (the 5 blocks) */
  process: [
    {
      id: "mobilier-personalizat",
      title: "Mobilier Personalizat",
      desc: "Realizăm mobilier la comandă din PAL, MDF, lemn masiv și alte materiale complementare, adaptat perfect spațiului și nevoilor fiecărui client.",
      backDesc:
        "Creăm mobilier pentru locuințe, birouri, spații comerciale sau HoReCa, fiecare proiect fiind gândit astfel încât să îmbine funcționalitatea cu estetica.",
      img: "/Poze JL Custom Design - Site/Services/Mobilier Personalizat.webp",
    },
    {
      id: "proiectare-3d",
      title: "Proiectare 3D",
      desc: "Fiecare piesă de mobilier este proiectată în programe de modelare 3D.",
      backDesc:
        "Acest proces ne permite să analizăm detaliile tehnice înainte de execuție și oferă clientului o imagine clară asupra modului în care va fi construit mobilierul.",
      img: "/Poze JL Custom Design - Site/Services/Proiectare.webp",
    },
    {
      id: "randari-virtuale",
      title: "Randări Virtuale Realiste",
      desc: "Prin randări fotorealiste, clientul poate vedea încă din faza de proiect cum va arăta spațiul final.",
      backDesc:
        "Aceste vizualizări prezintă atât aspectul arhitectural al mobilierului, cât și combinațiile cromatice, materialele și atmosfera generală a încăperii.",
      img: "/Poze JL Custom Design - Site/Services/Randare 3d.webp",
    },
    {
      id: "consultanta-tehnica",
      title: "Consultanță Tehnică",
      desc: "Un proiect reușit începe cu o înțelegere corectă a modului în care va fi folosit spațiul.",
      backDesc:
        "Discutăm cu fiecare client pentru a identifica nevoile reale și pentru a crea soluții practice – de la organizarea bucătăriei și poziționarea electrocasnicelor, până la optimizarea fluxului de lucru.",
      img: "/Poze JL Custom Design - Site/Services/Consultare.webp",
    },
    {
      id: "design-concept",
      title: "Design și Concept",
      desc: "Venim cu propuneri de design care îmbină formele, materialele și culorile.",
      backDesc:
        "Scopul nostru este să creăm mobilier care nu doar completează spațiul, ci contribuie la personalitatea și atmosfera întregului interior.",
      img: "/Poze JL Custom Design - Site/Services/Design & Concept.webp",
    },
  ],

  /** Product-oriented services (the 8 blocks) */
  services: [
    {
      id: "kitchen",
      title: "Bucătării",
      desc: "Bucătării realizate la comandă, proiectate în funcție de spațiul disponibil și de modul de utilizare.",
      backDesc:
        "Configurația mobilierului ține cont de poziționarea electrocasnicelor, zonele de lucru și accesul la spațiile de depozitare. Oferim soluții complete de design și execuție.",
      img: "/Poze JL Custom Design - Site/Services/Bucatarii.webp",
    },
    {
      id: "dressing",
      title: "Dressing",
      desc: "Sisteme de depozitare adaptate spațiului disponibil și nevoilor tale.",
      backDesc:
        "Compartimentarea este stabilită în funcție de tipurile de obiecte depozitate: haine, încălțăminte, accesorii sau bagaje. Organizare eficientă pentru un stil de viață ordonat.",
      img: "/Poze JL Custom Design - Site/Services/Dressing.webp",
    },
    {
      id: "dormitor",
      title: "Dormitor",
      desc: "Mobilier pentru dormitor realizat la comandă: paturi, noptiere, comode sau dulapuri.",
      backDesc:
        "Dimensiunile și compartimentarea sunt adaptate spațiului și modului de utilizare, asigurând un ambient relaxant și funcțional.",
      img: "/Poze JL Custom Design - Site/Services/Dormitor.webp",
    },
    {
      id: "living",
      title: "Living / Library",
      desc: "Mobilier pentru zona de living sau bibliotecă, configurat pentru integrarea echipamentelor media.",
      backDesc:
        "Sisteme de rafturi și spații de depozitare proiectate milimetric. Dimensiunile și compartimentarea sunt adaptate spațiului camerei.",
      img: "/Poze JL Custom Design - Site/Services/Living.webp",
    },
    {
      id: "bathroom",
      title: "Mobilier pentru Baie",
      desc: "Corpuri de mobilier proiectate pentru spații cu umiditate ridicată.",
      backDesc:
        "Utilizăm materiale și sisteme de prindere adecvate. Configurația ține cont de poziția instalațiilor sanitare și de spațiul disponibil.",
      img: "/Poze JL Custom Design - Site/Services/Baie.webp",
    },
    {
      id: "hol",
      title: "Hol",
      desc: "Mobilier pentru zona de intrare: dulapuri, pantofare, băncuțe sau panouri cuier.",
      backDesc:
        "Configurația este adaptată spațiului disponibil și necesarului de depozitare, oferind o primă impresie excelentă.",
      img: "/Poze JL Custom Design - Site/Services/Hol.webp",
    },
    {
      id: "office",
      title: "Office",
      desc: "Mobilier pentru birouri, spații de lucru sau zone de recepție.",
      backDesc:
        "Proiectele sunt orientate către organizarea documentelor, integrarea echipamentelor și utilizarea eficientă a spațiului de lucru.",
      img: "/Poze JL Custom Design - Site/Services/Birou director.webp",
    },
    {
      id: "horeca",
      title: "HoReCa",
      desc: "Mobilier pentru pensiuni, hoteluri, cafenele sau restaurante.",
      backDesc:
        "Soluțiile sunt adaptate utilizării frecvente și configurate în funcție de tipul spațiului: camere de cazare, zone de servire sau recepție.",
      img: "/Poze JL Custom Design - Site/Services/Horeca.webp",
    },
  ],

  /** Flip card back common items */
  flipBackItems: [
    "Consultanta personalizata",
    "Proiectare 3D detaliata",
    "Materiale de cea mai inalta calitate",
    "Montaj profesionist",
  ],
  flipReadMore: "Citește mai multe",
  flipBack: "← Înapoi",
  flipBackDesktop: "← Înapoi la imagine",

  /** CTA at bottom of services page */
  ctaHeadline: "Ai un proiect unic în minte?",
  ctaButton: "Inițiază Conversația",
};

// ─────────────────────────────────────────────
// ABOUT PAGE
// ─────────────────────────────────────────────
export const ABOUT_PAGE = {
  title: "Despre Noi | JL Custom Design - Mobilier Personalizat și Interior",
  description:
    "Descoperă povestea JL Custom Design. O echipă cu peste 15 ani de experiență, absolvenți ai Facultății de Industria Lemnului, dedicați transformării ideilor în mobilier de artă.",

  seoFabric: [
    "JL Custom Design s-a născut din pasiunea comună a doi prieteni de peste 20 de ani, amândoi absolvenți ai Facultății de Industria Lemnului din Brașov. Cu o experiență valoroasă de peste 15 ani în proiecte de mobilier personalizat și design interior, oferim soluții complete de la consultanță la montaj.",
    "Atelierul nostru este dedicat calității, inovației și atenției la detalii. Misiunea noastră este de a transforma viziunea fiecărui client în realitate, creând mobilier care nu doar ocupă un spațiu, ci îi oferă personalitate și atmosfera dorită.",
  ],

  heroTitle: "DESPRE NOI",
  heroSubtitle:
    "Fiecare proiect reflectă pasiunea noastră pentru lemn și atenția acordată detaliilor, oferind clienților un produs final unic și personalizat.",

  /** Philosophy / Bento grid */
  philosophyLabel: "Filozofia Noastră",
  philosophyQuote: "Transformăm viziunea ta în realitate prin expertiză tehnică și pasiune pentru detalii.",
  stat1Value: "15+",
  stat1Label: "Ani de Experiență",
  stat2Value: "20+",
  stat2Label: "Ani de Prietenie",
  stat3Value: "Brașov",
  stat3Label: "Locație Atelier",
  stat4Value: "100%",
  stat4Label: "Proiecte Custom",
  manifesto:
    "Povestea noastră a început acum 20 de ani. Amândoi am ales să urmăm cursurile Facultății de Industria Lemnului din Brașov, locul unde am pus bazele cunoștințelor tehnice care astăzi ne permit să abordăm orice provocare în designul de mobilier.",
  collaborationTitle: "O Echipă, O Viziune",
  collaborationText:
    "După 15 ani de proiecte diverse, de la reamenajări rezidențiale la spații comerciale complexe, am fondat JL Custom Design pentru a oferi clienților noștri nu doar mobilier, ci o experiență completă bazată pe încredere, inovație și excelență tehnică.",

  /** Values section */
  valuesTitle: "Valorile Noastre",
  values: [
    {
      title: "Calitate Fără Compromis",
      desc: "Fiecare îmbinare și finisaj este verificat riguros. Folosim doar materiale premium și accesorii de ultimă generație pentru a garanta durabilitatea proiectului.",
    },
    {
      title: "Inovație Tehnologică",
      desc: "De la iluminare LED inteligentă la sisteme de deschidere silențioase și ergonomie avansată, integrăm tehnologia pentru a ridica standardul de confort.",
    },
    {
      title: "Design Unic",
      desc: "Nu credem în soluții de serie. Fiecare proiect începe cu o foaie albă și este adaptat milimetric nevoilor tale, stilului tău de viață și arhitecturii spațiului.",
    },
    {
      title: "Sustenabilitate",
      desc: "Respectăm lemnul ca resursă. Lucrăm eficient, minimizăm pierderile și alegem furnizori care împărtășesc respectul nostru pentru mediul înconjurător.",
    },
  ],

  /** Atelier section */
  atelierHeadline: ["Pasiune", "pentru lemn.", "Atenție la detalii."],
  atelierSubtitle: "Atelierul JL Custom Design este locul unde tehnologia modernă întâlnește măiestria artizanală.",
  atelierLabel: "Atelierul Nostru",
  atelierQuote: "Fiecare proiect este o operă de artă personalizată, creată să reziste testului timpului.",
  atelierDesc:
    "În atelierul nostru din Brașov, transformăm materialele brute în piese de mobilier remarcabile. Combinăm precizia proiectării 3D cu finețea finisajelor manuale pentru a livra rezultate care depășesc așteptările.",
  atelierCta: "Vezi Portofoliu",
  atelierImageAlt: "Atelier JL Custom Design — detaliu producție mobilier premium Brașov",
};

// ─────────────────────────────────────────────
// PORTFOLIO PAGE
// ─────────────────────────────────────────────
export const PORTFOLIO_PAGE = {
  title: "Portofoliu Proiecte | JL Mobila - Mobilă la Comandă Brașov",
  description:
    "Explorează portofoliul JL Mobila de mobilier la comandă și design interior. Descoperă proiectele noastre rezidențiale și comerciale premium realizate în Brașov și împrejurimi.",

  seoFabric:
    "Portofoliu JL Mobila — proiecte de mobilier la comandă realizate în Brașov, Buzău, Sibiu și Sfântu Gheorghe. Bucătării custom, dressinguri, biblioteci, birouri, mobilier living, mobilier comercial. Fotografii reale din proiecte finalizate cu materiale premium: lemn masiv, MDF vopsit, PAL melaminat Egger, furnir natural.",

  /** Portfolio hero */
  heroMarquee: "LUCRĂRI SELECTATE",
  heroDesktopTitleLines: ["LUCRĂRI", "SELECTATE"],
  heroMobileMarquee1: "LUCRĂRI",
  heroMobileMarquee2: "SELECTATE",
  heroDescTitle1: "Viziune &",
  heroDescTitle2: "Măiestrie",
  heroDescText:
    "O colecție de mobilier și spații interioare, create să ridice cotidianul prin eleganță discretă și finisaje premium.",
  heroCtaLabel: "Contact",
  heroCtaTitle1: "Începe un",
  heroCtaTitle2: "Consultanță",
  heroMobileCta: "Programează o Consultanță",
  heroImageAlt: "Transformă-ți casa cu design interior elegant, funcțional și atemporal, adaptat stilului tău unic",

  services: [
    {
      id: "mobilier-personalizat",
      title: "Mobilier Personalizat",
      desc: "Realizăm mobilier la comandă din PAL, MDF, lemn masiv și alte materiale complementare, adaptat perfect spațiului și nevoilor fiecărui client.",
      backDesc:
        "Creăm mobilier pentru locuințe, birouri, spații comerciale sau HoReCa, fiecare proiect fiind gândit astfel încât să îmbine funcționalitatea cu estetica.",
    },
    {
      id: "proiectare-3d",
      title: "Proiectare 3D",
      desc: "Fiecare piesă de mobilier este proiectată în programe de modelare 3D.",
      backDesc:
        "Acest proces ne permite să analizăm detaliile tehnice înainte de execuție și oferă clientului o imagine clară asupra modului în care va fi construit mobilierul.",
    },
    {
      id: "randari-virtuale",
      title: "Randări Virtuale Realiste",
      desc: "Prin randări fotorealiste, clientul poate vedea încă din faza de proiect cum va arăta spațiul final.",
      backDesc:
        "Aceste vizualizări prezintă atât aspectul arhitectural al mobilierului, cât și combinațiile cromatice, materialele și atmosfera generală a încăperii.",
    },
    {
      id: "consultanta-tehnica",
      title: "Consultanță Tehnică",
      desc: "Un proiect reușit începe cu o înțelegere corectă a modului în care va fi folosit spațiul.",
      backDesc:
        "Discutăm cu fiecare client pentru a identifica nevoile reale și pentru a crea soluții practice – de la organizarea bucătăriei și poziționarea electrocasnicelor, până la optimizarea fluxului de lucru într-o locuință sau într-un spațiu HoReCa.",
    },
    {
      id: "design-concept",
      title: "Design și Concept",
      desc: "Venim cu propuneri de design care îmbină formele, materialele și culorile.",
      backDesc:
        "Scopul nostru este să creăm mobilier care nu doar completează spațiul, ci contribuie la personalitatea și atmosfera întregului interior.",
    },
  ],
  portfolio: "Portofoliu",
  blog: "Blog",

  // Missing keys used in PortfolioCMSGrid.astro
  emptyState: "Momentan nu avem proiecte în această categorie.",
  emptyStateAdmin: "Adaugă proiecte din CMS pentru a le vedea aici.",
  emptyImage: "Imagine Indisponibilă",
  viewMore: "Vezi mai multe",
  viewLess: "Vezi mai puțin",
  closeGallery: "Închide galeria",
  defaultProjectAlt: "Proiect JL Mobila",
};

// ─────────────────────────────────────────────
// BLOG PAGE
// ─────────────────────────────────────────────
export const BLOG_PAGE = {
  title: "Blog | JL Mobila - Inspirație și Sfaturi pentru Mobilier la Comandă",
  description: "Descoperă ultimele tendințe în design interior, ghiduri despre materiale și proiecte care prind viață în atelierul nostru din Brașov.",
  seoFabric: [
    "Blog JL Mobila — sursa ta de inspirație pentru design interior și mobilier la comandă în Brașov. Articole despre MDF vopsit, lemn masiv, optimizarea spațiului și tendințe 2024.",
    "Sfaturi practice pentru alegerea bucătăriei ideale, organizarea dressingului și întreținerea mobilierului din lemn. Noutăți din atelierul nostru de producție mobilier."
  ],
  heroTitle: "Atelierul de Idei",
  heroSubtitle: "Gânduri, procese și inspirație din inima atelierului nostru.",
  emptyState: "Momentan nu am publicat niciun articol. Revino curând!",
  categoryLabels: {
    inspiratie: "Inspirație & Design",
    ghid: "Ghid Practic",
    materiale: "Materiale & Tehnologii",
    proiecte: "Proiecte Finalizate",
    noutati: "Noutăți",
  },
  backLink: "← Înapoi la Blog",
  authorPrefix: "Scris de",
  backToList: "← Înapoi la toate articolele",
};

// ─────────────────────────────────────────────
// CONTACT PAGE
// ─────────────────────────────────────────────
export const CONTACT_PAGE = {
  title: "Contact | JL Mobila",
  description:
    "Contacteaza JL Mobila pentru consultanta si oferta personalizata de mobilier la comanda.",
  heading: "Get in Touch",
};

// ─────────────────────────────────────────────
// CONTACT FAB
// ─────────────────────────────────────────────
export const CONTACT_FAB = {
  ariaLabel: "Contact Us",
  ringText: "• CONTACT • CONTACT • CONTACT",
};

// ─────────────────────────────────────────────
// BRANDBOOK PAGE
// ─────────────────────────────────────────────
export const BRANDBOOK_PAGE = {
  title: "Brandbook | JL Custom Design",
  description: "Visual Identity Guidelines",
  madeByLabel: "Made with excellence by",
  madeByLinkLabel: "achieve.ro",
  madeByLinkUrl: "https://achieve.ro",
  versionLabel: "Official Identity Guidelines v1.0",
  heroTitleMain: "JL Custom Design",
  heroTitleAccent: "Brandbook",
  visionLine1: "Viziunea ta,",
  visionLine2: "Excelența",
  visionLine3: "noastră.",
  introParagraph:
    "A design system built for the intersection of traditional woodworking and digital precision. Focused on high-contrast typography, warm organic foundations, and fluid motion.",
  paletteTitle: "The Palette",
  typographyTitle: "Typography System",
  primaryFaceLabel: "Primary Face",
  primaryFaceValue: "Grift Variable",
  primaryTags: ["Serif Axis", "Sans Axis", "VF Support"],
  specimenTemplate: "This is a specimen of {tag} style",
  dynamicComponentsTitle: "Dynamic Components",
  interactiveStatesLabel: "Interactive States",
  componentButtons: ["Primary Call", "Dark Alternate", "Glass Contrast"],
  radiiLabel: "Radii & Forms",
  roundedLabel: "rounded-2xl (1rem)",
  interactionModelTitle: "The Interaction Model",
  interactionModelText:
    "Liquid animations driven by GSAP and dynamic SVG path morphing.",
  endingTitle: "Creat să dăinuie.",
  endingParagraph:
    "Identitatea vizuală JL Custom Design nu este doar un set de reguli, ci o promisiune a calității. Fiecare pixel, la fel ca fiecare piesă de mobilier, este proiectat cu intenție și respect pentru material.",
  endingYearLabel: "JL CUSTOM DESIGN - 2026",
  footerLabel: "Identity Systems & Guidelines Development",
  colors: [
    {
      name: "Carbon Noir",
      hex: "#000000",
      rgb: "0, 0, 0",
      usage: "Primary Text, Backgrounds",
      text: "text-white",
    },
    {
      name: "Heirloom Cream",
      hex: "#F4F1EA",
      rgb: "244, 241, 234",
      usage: "Main Background, Organic Base",
      text: "text-black",
    },
    {
      name: "Liquid Gold",
      hex: "#FFC800",
      rgb: "255, 200, 0",
      usage: "Accents, CTAs, Marks",
      text: "text-black",
    },
    {
      name: "Obsidian 1A",
      hex: "#1A1A1A",
      rgb: "26, 26, 26",
      usage: "Hero Depth, UI Contrast",
      text: "text-white",
    },
  ],
  typography: [
    {
      tag: "H1",
      size: "8rem",
      weight: "400",
      tracking: "-0.02em",
      font: "font-serif",
    },
    {
      tag: "H2",
      size: "4rem",
      weight: "400",
      tracking: "-0.01em",
      font: "font-sans",
    },
    {
      tag: "H3",
      size: "2rem",
      weight: "600",
      tracking: "0",
      font: "font-sans",
    },
    {
      tag: "p",
      size: "1rem",
      weight: "400",
      tracking: "0",
      font: "font-sans",
    },
    {
      tag: "small",
      size: "0.75rem",
      weight: "900",
      tracking: "0.25em",
      font: "font-sans",
      uppercase: true,
    },
  ],
};

// ─────────────────────────────────────────────
// CONTACT MODAL
// ─────────────────────────────────────────────
export const CONTACT_MODAL = {
  title: "Să începem proiectul",
  subtitle: "Povestește-ne despre spațiul tău ideal.",
  servicesLabel: "Ce te interesează?",
  serviceOptions: [
    "Mobilier la Comandă",
    "Bucătării Premium",
    "Dressing & Depozitare",
    "Spații Comerciale / Horeca",
    "Proiectare 3D & Design",
    "Altele",
  ],
  namePlaceholder: "Numele tău",
  emailPlaceholder: "Email",
  phonePlaceholder: "Telefon (Opțional)",
  projectPlaceholder: "Detalii despre proiect...",
  callButton: "Sună Direct",
  sendButton: "Trimite",
  successMessage: "Mesajul a fost trimis! Vă vom contacta în curând.",
  closeAriaLabel: "Close modal",
};

// ─────────────────────────────────────────────
// TEST PAGE
// ─────────────────────────────────────────────
export const TEST_PAGE = {
  title: "Test Simultaneous Reveal",
  heading: "Test Page",
  status: "Initializing...",
};
