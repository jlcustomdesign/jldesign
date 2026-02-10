import { c as createComponent, m as maybeRenderHead, d as addAttribute, r as renderComponent, a as renderScript, b as renderTemplate, h as createAstro } from '../chunks/astro/server_DE-htoAq.mjs';
import 'piccolore';
import { a as $$BubbleButton, $ as $$Layout } from '../chunks/Layout_C20eE-tO.mjs';
import 'clsx';
/* empty css                                 */
import { $ as $$FaqSection } from '../chunks/FaqSection_CStDgzyF.mjs';
import { $ as $$Footer } from '../chunks/Footer_Tua4kDG9.mjs';
export { renderers } from '../renderers.mjs';

const $$HeroSection = createComponent(($$result, $$props, $$slots) => {
  const heroImage = "/Images/hero-image.jpg";
  return renderTemplate`${maybeRenderHead()}<section class="relative min-h-screen flex items-center bg-secondary overflow-hidden transition-[height] duration-300" id="hero-section" data-theme="dark" style="z-index: 1;"> <!-- Hero Content Wrapper (for scale/blur animation) --> <div id="hero-content-wrapper" class="absolute inset-0 flex items-center" style="transform-origin: center center;"> <!-- Background SVG Container --> <div class="absolute inset-0 z-0 overflow-hidden flex justify-center items-center pointer-events-none"> <svg id="mySVG" xmlns="http://www.w3.org/2000/svg" width="100%" height="100%" preserveAspectRatio="xMidYMid meet" class="w-[98%] h-full opacity-0" style="transform-origin: center center; max-height: 100dvh;"> <defs> <clipPath id="heroClip"> <path id="heroPath" fill="white"></path> </clipPath> </defs> <!-- Image masked by the path --> <image${addAttribute(heroImage, "href")} width="100%" height="100%" preserveAspectRatio="xMidYMid slice" clip-path="url(#heroClip)" image-rendering="optimizeQuality"></image> <!-- Overlay for text contrast --> <rect width="100%" height="100%" fill="black" opacity="0.3" clip-path="url(#heroClip)"></rect> </svg> </div> <!-- Content Container --> <div class="container mx-auto px-4 md:px-8 relative z-10 flex flex-col justify-center h-full pointer-events-none"> <!-- Left: Text Content --> <div class="relative group pointer-events-auto" id="hero-title-container"> <!-- Main Title --> <h1 id="hero-title" class="font-serif font-normal text-4xl sm:text-5xl md:text-7xl lg:text-8xl xl:text-8xl 2xl:text-9xl leading-tight text-white mb-6 relative z-10 title-hover w-fit pointer-events-none opacity-0 invisible hero-text-element" data-cursor-scale="5.0">
Spațiul tău, <br> viziunea noastră
</h1> <p class="hero-subtitle text-lg md:text-xl text-white/80 max-w-2xl lg:max-w-4xl mb-10 opacity-0 invisible hero-text-element">
Mobilă creată să dăinuie. Design minimalist, finisaje premium și o
          atenție obsesivă la detalii.
</p> </div> </div> <!-- CTA Buttons (Centered low on mobile, Higher on tablet, Cutout on large desktop) --> <div class="absolute bottom-[40px] left-1/2 -translate-x-1/2 z-20 w-fit md:bottom-[144px] md:translate-y-1/2 xl:bottom-[72px] xl:left-[38.3%] xl:translate-y-1/2"> <div class="hero-cta flex flex-col xl:flex-row gap-4"> ${renderComponent($$result, "BubbleButton", $$BubbleButton, { "href": "/contact", "variant": "primary", "class": "hero-btn w-full xl:w-auto text-center invisible opacity-0 translate-y-4 !bg-[#1a1a1a] !text-white hover:!border-[#d4af37] border border-[#1a1a1a] !px-8 !py-4 md:!text-sm md:!px-12 md:!py-5 xl:!text-sm xl:!px-12" }, { "default": ($$result2) => renderTemplate`
Cere o ofertă
` })} ${renderComponent($$result, "BubbleButton", $$BubbleButton, { "href": "/portfolio", "id": "glass-btn", "class": "hero-btn w-full xl:w-auto text-center invisible opacity-0 translate-y-4 !border-white !text-white hover:!border-[#d4af37] !bg-white/20 backdrop-blur-md hover:!bg-white/30 !px-8 !py-4 md:!text-sm md:!px-12 md:!py-5 xl:!text-sm xl:!px-12" }, { "default": ($$result2) => renderTemplate`
Vezi proiecte
` })} </div> </div> <!-- Quality Badge / Corner Text (Bottom Right Void) --> <!-- REMOVED as per request --> <!-- Top Left Copy (Cutout) --> <div class="absolute top-[72px] left-[12.43%] -translate-x-1/2 -translate-y-1/2 z-20 hidden xl:block whitespace-nowrap"> <span class="text-xl lg:text-2xl xl:text-3xl 2xl:text-4xl font-serif font-black tracking-widest uppercase text-[#1A1A1A] opacity-0 invisible hero-top-left">
JL Design
</span> </div> <!-- Top Right Button (Cutout) --> <div class="absolute top-[72px] right-[12.43%] translate-x-1/2 -translate-y-1/2 z-20 hidden xl:block"> <a href="/contact" class="group flex items-center gap-3 xl:gap-4 opacity-0 invisible hero-top-right"> <div class="bg-transparent text-black border border-black px-6 py-3 xl:px-8 xl:py-4 rounded-full text-xs xl:text-sm font-extrabold uppercase tracking-wider transition-all duration-300 group-hover:bg-black group-hover:text-white group-hover:scale-105 shadow-none hover:shadow-xl">
Programează o intalnire
</div> <div class="w-12 h-12 xl:w-14 xl:h-14 bg-transparent text-black border border-black rounded-full flex items-center justify-center transition-all duration-300 group-hover:bg-black group-hover:text-white shadow-none hover:shadow-xl"> <svg width="18" height="18" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg" class="transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"> <path d="M1 13L13 1M13 1H4M13 1V10" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path> </svg> </div> </a> </div> <!-- Decorative Elements --> <!-- Scroll indicator removed --> </div><!-- End hero-content-wrapper --> </section> ${renderScript($$result, "/Users/robertgyorgy/JL Mobila/src/components/HeroSection.astro?astro&type=script&index=0&lang.ts")}`;
}, "/Users/robertgyorgy/JL Mobila/src/components/HeroSection.astro", void 0);

const $$AboutSection = createComponent(($$result, $$props, $$slots) => {
  return renderTemplate`${maybeRenderHead()}<section class="py-24 md:py-40 bg-secondary flex items-center justify-center min-h-screen relative overflow-hidden" id="about-section" data-theme="light" style="z-index: 10; position: relative;"> <div class="container mx-auto px-4 md:px-8 relative z-10 text-center"> <div class="max-w-5xl mx-auto p-12 md:p-16 w-full flex flex-col justify-center bg-white rounded-3xl md:rounded-[3rem] shadow-2xl about-card border border-gray-100 items-center gap-8" style="min-height: 80vh !important;"> <h2 class="font-serif text-4xl md:text-5xl lg:text-6xl text-primary leading-tight about-title">
Peste 15 ani de experiență în prelucrarea lemnului și a materialelor
        compozite.
</h2> <p class="text-gray-600 text-lg md:text-xl max-w-2xl about-subtext">
Fiecare piesă de mobilier pe care o creăm este rezultatul unei pasiuni
        pentru perfecțiune și al unui respect profund pentru tradiția
        mâneșugului, combinat cu tehnologii moderne de producție.
</p> <div class="mt-4 about-cta opacity-0 translate-y-4"> ${renderComponent($$result, "BubbleButton", $$BubbleButton, { "href": "/about", "variant": "primary", "class": "!px-10 !py-4 !border !border-primary/20" }, { "default": ($$result2) => renderTemplate`
Află mai multe
` })} </div> </div> </div> <!-- Subtle Decorative Background Shape --> </section> ${renderScript($$result, "/Users/robertgyorgy/JL Mobila/src/components/AboutSection.astro?astro&type=script&index=0&lang.ts")}`;
}, "/Users/robertgyorgy/JL Mobila/src/components/AboutSection.astro", void 0);

const $$Astro = createAstro("https://jl-design.vercel.app");
const $$ServicesSectionV2 = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$ServicesSectionV2;
  const services = [
    {
      id: "kitchen",
      title: "Buc\u0103t\u0103rii Custom",
      desc: "Inima casei tale, reg\xE2ndit\u0103. Func\u021Bionalitate des\u0103v\xE2r\u0219it\u0103 \xEEmbr\u0103cat\u0103 \xEEn materiale nobile.",
      img: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?q=80&w=800&auto=format&fit=crop"
      // Vertical kitchen
    },
    {
      id: "dressing",
      title: "Dressing & Wardrobes",
      desc: "Mai mult dec\xE2t depozitare. Un sanctuar al stilului t\u0103u. Iluminare ambiental\u0103 \u0219i finisaje de catifea.",
      img: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?q=80&w=800&auto=format&fit=crop"
      // Vertical wardrobe
    },
    {
      id: "living",
      title: "Living & Library",
      desc: "Povestea casei, scris\u0103 \xEEn lemn masiv. Biblioteci impun\u0103toare \u0219i piese care dau tonul conversa\u021Biei.",
      img: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?q=80&w=800&auto=format&fit=crop"
      // Vertical living
    },
    {
      id: "office",
      title: "Office & Comercial",
      desc: "Productivitate \u0219i stil. Spa\u021Bii de lucru ergonomice care impresioneaz\u0103 clien\u021Bii din prima clip\u0103.",
      img: "https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=800&auto=format&fit=crop"
      // Office
    },
    {
      id: "bathroom",
      title: "Baie & Wellness",
      desc: "Refugiul t\u0103u personal. Mobilier rezistent la umiditate, integrat perfect cu piatra \u0219i ceramica.",
      img: "https://images.unsplash.com/photo-1552321554-5fefe8c9ef14?q=80&w=800&auto=format&fit=crop"
      // Bathroom
    }
  ];
  return renderTemplate`${maybeRenderHead()}<section id="services-section" class="py-24 md:py-32 bg-secondary overflow-hidden" data-theme="light"> <div class="w-full px-4 pt-32 md:pt-48"> <div class="container mx-auto px-4 md:px-0 mb-12 md:mb-16"> <div class="flex flex-col md:flex-row justify-between items-center gap-12"> <!-- Left: Title --> <h2 class="services-title flex-shrink-0 font-serif text-4xl md:text-5xl lg:text-7xl text-primary leading-tight whitespace-nowrap">
Serviciile Noastre
</h2> <!-- Right: Buttons --> <div class="flex gap-4 flex-shrink-0"> <button id="services-prev" class="services-nav-btn w-20 h-20 md:w-24 md:h-24 flex-shrink-0 rounded-full bg-white shadow-xl border border-primary/10 flex items-center justify-center text-primary hover:bg-primary hover:text-white transition-all duration-300 group" aria-label="Previous"> <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-8 h-8 md:w-10 md:h-10 group-hover:-translate-x-1.5 transition-transform"> <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5"></path> </svg> </button> <button id="services-next" class="services-nav-btn w-20 h-20 md:w-24 md:h-24 flex-shrink-0 rounded-full bg-white shadow-xl border border-primary/10 flex items-center justify-center text-primary hover:bg-primary hover:text-white transition-all duration-300 group" aria-label="Next"> <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-8 h-8 md:w-10 md:h-10 group-hover:translate-x-1.5 transition-transform"> <path stroke-linecap="round" stroke-linejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5"></path> </svg> </button> </div> </div> </div> </div> <!-- Carousel Container --> <div class="relative"> <!-- Carousel Track --> <div id="services-carousel" class="flex gap-4 md:gap-6 px-6 md:px-8"> ${services.map((service, i) => renderTemplate`<div class="service-card w-[75vw] md:w-[40vw] lg:w-[27%] rounded-2xl overflow-hidden relative group flex-shrink-0 bg-white shadow-lg"${addAttribute(i, "data-index")}> <!-- Image (Vertical/Portrait Aspect Ratio) --> <div class="relative aspect-[4/5] overflow-hidden"> <img${addAttribute(service.img, "src")}${addAttribute(service.title, "alt")} loading="lazy" class="w-full h-[120%] object-cover absolute top-0 left-0" style="transform: translateY(-10%);"> <!-- Top Elements: Title & Arrow Button --> <div class="absolute top-4 left-0 w-full px-4 flex justify-between items-start z-20 pointer-events-none"> <!-- Title Pill --> <div class="bg-white/95 backdrop-blur-sm px-6 py-3 rounded-full shadow-md h-12 flex items-center"> <span class="text-base font-bold text-primary tracking-wide">${service.title}</span> </div> <!-- Arrow Button (In Top Right) --> <a${addAttribute(`/services/${service.id}`, "href")} class="bg-white w-12 h-12 rounded-full flex items-center justify-center shadow-lg hover:bg-accent hover:text-white transition-colors duration-300 pointer-events-auto"> <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-5 h-5"> <path stroke-linecap="round" stroke-linejoin="round" d="M4.5 19.5l15-15m0 0H8.25m11.25 0v11.25"></path> </svg> </a> </div> <!-- Hover Overlay (Blur + Description) --> <div class="absolute inset-0 bg-black/30 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-all duration-400 z-10 flex flex-col justify-end p-6"> <p class="text-white/95 text-base md:text-lg font-medium leading-relaxed translate-y-4 group-hover:translate-y-0 transition-transform duration-400 delay-100"> ${service.desc} </p> </div> </div> </div>`)} </div> </div> </section> ${renderScript($$result, "/Users/robertgyorgy/JL Mobila/src/components/ServicesSectionV2.astro?astro&type=script&index=0&lang.ts")}`;
}, "/Users/robertgyorgy/JL Mobila/src/components/ServicesSectionV2.astro", void 0);

const $$PortfolioSection = createComponent(($$result, $$props, $$slots) => {
  const portfolio = [
    {
      name: "Apartament B\u0103neasa",
      material: "Nuc American",
      image: "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?q=80&w=1600&auto=format&fit=crop"
    },
    {
      name: "Villa Pipera",
      material: "Stejar Masiv",
      image: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?q=80&w=1600&auto=format&fit=crop"
    },
    {
      name: "Penthouse Her\u0103str\u0103u",
      material: "MDF Vopsit & Marmur\u0103",
      image: "https://images.unsplash.com/photo-1600566752355-35792bedcfe1?q=80&w=1600&auto=format&fit=crop"
    },
    {
      name: "Loft Timpuri Noi",
      material: "Metal & Lemn Recuperat",
      image: "https://images.unsplash.com/photo-1507089947368-19c1da9775ae?q=80&w=1600&auto=format&fit=crop"
    },
    {
      name: "Cluj Residence",
      material: "Furnir Eucalipt",
      image: "https://images.unsplash.com/photo-1615529182904-14819c35db37?q=80&w=1600&auto=format&fit=crop"
    },
    {
      name: "Office Space Unirii",
      material: "Sticl\u0103 & O\u021Bel",
      image: "https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=1600&auto=format&fit=crop"
    },
    {
      name: "Duplex Prim\u0103verii",
      material: "Marmur\u0103 Carrara",
      image: "https://images.unsplash.com/photo-1600607687644-c7171b42498f?q=80&w=1600&auto=format&fit=crop"
    },
    {
      name: "Showroom Victoriei",
      material: "Compozit & Velvet",
      image: "https://images.unsplash.com/photo-1628744448840-55bdb2497bd4?q=80&w=1600&auto=format&fit=crop"
    }
  ];
  const columns = [[], [], [], []];
  portfolio.forEach((item, i) => {
    columns[i % 4].push(item);
  });
  return renderTemplate`${maybeRenderHead()}<section class="bg-secondary relative" id="portfolio-section" data-theme="light"> <div class="w-full relative min-h-screen py-32 px-4"> <div class="container mx-auto mb-20 md:mb-32 px-4 md:px-0"> <!-- Title Left Aligned --> <h2 class="font-serif text-4xl md:text-6xl text-primary text-left">
Portofoliu Selectiv
</h2> </div> <!-- 
      Grid Layout:
      - Mobile: 2 columns (grid-cols-2)
      - Desktop: 4 columns (md:grid-cols-4)
    --> <div class="grid grid-cols-2 md:grid-cols-4 gap-4 w-full max-w-[1800px] mx-auto" id="portfolio-grid"> ${columns.map((col, colIndex) => renderTemplate`<div class="flex flex-col gap-4 portfolio-column"${addAttribute(colIndex, "data-col-index")}> ${col.map((item) => renderTemplate`<div class="group relative w-full overflow-hidden rounded-3xl"> <!-- Image Container --> <div class="w-full aspect-[3/4] overflow-hidden relative bg-gray-200"> <img${addAttribute(item.image, "src")}${addAttribute(item.name, "alt")} loading="lazy" class="w-full h-[120%] object-cover absolute top-0 left-0 portfolio-img" style="transform: translateY(-10%);"> <!-- Overlay: Visible on Hover (Glassmorphism) --> <div class="absolute inset-0 bg-black/30 backdrop-blur-sm border border-white/20 opacity-0 group-hover:opacity-100 transition-all duration-500 z-10 flex flex-col justify-center items-center text-center p-6"> <h3 class="font-serif text-2xl text-accent translate-y-4 group-hover:translate-y-0 transition-transform duration-500 delay-100"> ${item.name} </h3> <p class="text-sm font-medium text-gray-300 mt-1 uppercase tracking-wider translate-y-4 group-hover:translate-y-0 transition-transform duration-500 delay-200"> ${item.material} </p> </div> </div> </div>`)} </div>`)} </div> </div> </section> ${renderScript($$result, "/Users/robertgyorgy/JL Mobila/src/components/PortfolioSection.astro?astro&type=script&index=0&lang.ts")}`;
}, "/Users/robertgyorgy/JL Mobila/src/components/PortfolioSection.astro", void 0);

const $$ProcessSectionV2 = createComponent(($$result, $$props, $$slots) => {
  const steps = [
    {
      step: "01",
      title: "Consultan\u021B\u0103",
      desc: "Discut\u0103m viziunea ta. Lu\u0103m m\u0103sur\u0103tori precise \u0219i \xEEn\u021Belegem fluxul spa\u021Biului.",
      // Meeting / Discussion
      img: "https://images.unsplash.com/photo-1600880292203-757bb62b4baf?q=80&w=800"
    },
    {
      step: "02",
      title: "Proiectare 3D",
      desc: "Rand\u0103ri fotorealiste. Vezi exact cum va ar\u0103ta mobilierul \xEEn casa ta.",
      // Blueprint / Sketch
      img: "https://images.unsplash.com/photo-1503387762-592deb58ef4e?q=80&w=800"
    },
    {
      step: "03",
      title: "Produc\u021Bie",
      desc: "Folosim utilaje CNC de ultim\u0103 genera\u021Bie \u0219i finisaje manuale pentru detalii impecabile.",
      // Workshop - Woodworking
      img: "https://images.unsplash.com/photo-1610557892470-55d9e80c0bce?q=80&w=800"
    },
    {
      step: "04",
      title: "Montaj",
      desc: "Echipa noastr\u0103 instaleaz\u0103 totul, regleaz\u0103 feroneria \u0219i las\u0103 totul curat.",
      // Modern Interior / Installation
      img: "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?q=80&w=800"
    }
  ];
  return renderTemplate`${maybeRenderHead()}<section class="bg-secondary py-24 overflow-hidden relative" id="process-section-v2" data-theme="light" data-astro-cid-xe7imnpf> <div class="container mx-auto px-4 md:px-8 relative z-10 hover-container" data-astro-cid-xe7imnpf> <!-- Title Section (Left Aligned) --> <div class="text-left mb-16 md:mb-24 max-w-2xl process-header" data-astro-cid-xe7imnpf> <h2 class="font-serif text-4xl md:text-6xl text-primary mb-6" data-astro-cid-xe7imnpf>
Procesul Nostru
</h2> </div> <!-- Layout Container --> <div class="flex flex-col lg:grid lg:grid-cols-[1fr_minmax(400px,550px)_1fr] gap-8 items-start relative h-full" data-astro-cid-xe7imnpf> <!-- DESKTOP STRUCTURE --> <!-- Left Column Texts (Steps 1 & 3) --> <div class="hidden lg:flex flex-col justify-between h-[450px] pt-12 text-right pr-8 gap-32" data-astro-cid-xe7imnpf> <!-- Step 1 Text --> <div class="process-text origin-right opacity-0 pointer-events-none blur-sm will-change-transform" data-step="0" data-astro-cid-xe7imnpf> <h3 class="font-serif text-2xl text-primary font-bold mb-3" data-astro-cid-xe7imnpf> ${steps[0].title} </h3> <p class="text-gray-500 text-sm leading-relaxed" data-astro-cid-xe7imnpf>${steps[0].desc}</p> </div> <!-- Step 3 Text --> <div class="process-text origin-right opacity-0 pointer-events-none blur-sm will-change-transform" data-step="2" data-astro-cid-xe7imnpf> <h3 class="font-serif text-2xl text-primary font-bold mb-3" data-astro-cid-xe7imnpf> ${steps[2].title} </h3> <p class="text-gray-500 text-sm leading-relaxed" data-astro-cid-xe7imnpf>${steps[2].desc}</p> </div> </div> <!-- Center Column: Images (Staggered 2x2 Grid) --> <!-- Reduced max-w and height for smaller images --> <div class="relative w-full max-w-lg mx-auto h-auto lg:h-[450px] grid grid-cols-1 md:grid-cols-2 gap-6 p-4 z-20 group/grid" data-astro-cid-xe7imnpf> <!-- Column 1 --> <div class="flex flex-col gap-6" data-astro-cid-xe7imnpf> <!-- Image 0 --> <div class="flex flex-col" data-astro-cid-xe7imnpf> <div class="w-full aspect-[4/3] relative overflow-hidden rounded-2xl transition-all duration-500 ease-out
                           transform process-image lg:opacity-0 lg:pointer-events-none lg:blur-sm lg:will-change-transform" data-step="0" data-astro-cid-xe7imnpf> <img${addAttribute(steps[0].img, "src")}${addAttribute(steps[0].title, "alt")} class="w-full h-full object-cover" loading="lazy" data-astro-cid-xe7imnpf> </div> <!-- Mobile Text (Sibling) - Static on Mobile --> <div class="lg:hidden mt-4 text-left" data-step-mobile="0" data-astro-cid-xe7imnpf> <h3 class="font-serif text-xl text-primary font-bold mb-2" data-astro-cid-xe7imnpf> ${steps[0].title} </h3> <p class="text-gray-500 text-sm leading-relaxed" data-astro-cid-xe7imnpf> ${steps[0].desc} </p> </div> </div> <!-- Image 2 --> <div class="flex flex-col" data-astro-cid-xe7imnpf> <div class="w-full aspect-[4/3] relative overflow-hidden rounded-2xl transition-all duration-500 ease-out
                           transform process-image lg:opacity-0 lg:pointer-events-none lg:blur-sm lg:will-change-transform" data-step="2" data-astro-cid-xe7imnpf> <img${addAttribute(steps[2].img, "src")}${addAttribute(steps[2].title, "alt")} class="w-full h-full object-cover" loading="lazy" data-astro-cid-xe7imnpf> </div> <!-- Mobile Text (Sibling) - Static on Mobile --> <div class="lg:hidden mt-4 text-left" data-step-mobile="2" data-astro-cid-xe7imnpf> <h3 class="font-serif text-xl text-primary font-bold mb-2" data-astro-cid-xe7imnpf> ${steps[2].title} </h3> <p class="text-gray-500 text-sm leading-relaxed" data-astro-cid-xe7imnpf> ${steps[2].desc} </p> </div> </div> </div> <!-- Column 2 (Offset down) --> <div class="flex flex-col gap-6 lg:pt-12" data-astro-cid-xe7imnpf> <!-- Image 1 --> <div class="flex flex-col" data-astro-cid-xe7imnpf> <div class="w-full aspect-[4/3] relative overflow-hidden rounded-2xl transition-all duration-500 ease-out
                           transform process-image lg:opacity-0 lg:pointer-events-none lg:blur-sm lg:will-change-transform" data-step="1" data-astro-cid-xe7imnpf> <img${addAttribute(steps[1].img, "src")}${addAttribute(steps[1].title, "alt")} class="w-full h-full object-cover" loading="lazy" data-astro-cid-xe7imnpf> </div> <!-- Mobile Text (Sibling) - Static on Mobile --> <div class="lg:hidden mt-4 text-left" data-step-mobile="1" data-astro-cid-xe7imnpf> <h3 class="font-serif text-xl text-primary font-bold mb-2" data-astro-cid-xe7imnpf> ${steps[1].title} </h3> <p class="text-gray-500 text-sm leading-relaxed" data-astro-cid-xe7imnpf> ${steps[1].desc} </p> </div> </div> <!-- Image 3 --> <div class="flex flex-col" data-astro-cid-xe7imnpf> <div class="w-full aspect-[4/3] relative overflow-hidden rounded-2xl transition-all duration-500 ease-out
                           transform process-image lg:opacity-0 lg:pointer-events-none lg:blur-sm lg:will-change-transform" data-step="3" data-astro-cid-xe7imnpf> <img${addAttribute(steps[3].img, "src")}${addAttribute(steps[3].title, "alt")} class="w-full h-full object-cover" loading="lazy" data-astro-cid-xe7imnpf> </div> <!-- Mobile Text (Sibling) - Static on Mobile --> <div class="lg:hidden mt-4 text-left" data-step-mobile="3" data-astro-cid-xe7imnpf> <h3 class="font-serif text-xl text-primary font-bold mb-2" data-astro-cid-xe7imnpf> ${steps[3].title} </h3> <p class="text-gray-500 text-sm leading-relaxed" data-astro-cid-xe7imnpf> ${steps[3].desc} </p> </div> </div> </div> </div> <!-- Right Column Texts (Steps 2 & 4) --> <div class="hidden lg:flex flex-col justify-between h-[450px] pt-24 pl-8 gap-32" data-astro-cid-xe7imnpf> <!-- Step 2 Text --> <div class="process-text origin-left opacity-0 pointer-events-none blur-sm will-change-transform" data-step="1" data-astro-cid-xe7imnpf> <h3 class="font-serif text-2xl text-primary font-bold mb-3" data-astro-cid-xe7imnpf> ${steps[1].title} </h3> <p class="text-gray-500 text-sm leading-relaxed" data-astro-cid-xe7imnpf>${steps[1].desc}</p> </div> <!-- Step 4 Text --> <div class="process-text origin-left opacity-0 pointer-events-none blur-sm will-change-transform" data-step="3" data-astro-cid-xe7imnpf> <h3 class="font-serif text-2xl text-primary font-bold mb-3" data-astro-cid-xe7imnpf> ${steps[3].title} </h3> <p class="text-gray-500 text-sm leading-relaxed" data-astro-cid-xe7imnpf>${steps[3].desc}</p> </div> </div> </div> <!-- CTA --> <div class="mt-16 text-center relative z-20" data-astro-cid-xe7imnpf> ${renderComponent($$result, "BubbleButton", $$BubbleButton, { "href": "/contact", "class": "!px-10 !py-4", "data-astro-cid-xe7imnpf": true }, { "default": ($$result2) => renderTemplate`Începe Proiectul` })} </div> </div> </section>  ${renderScript($$result, "/Users/robertgyorgy/JL Mobila/src/components/ProcessSectionV2.astro?astro&type=script&index=0&lang.ts")}`;
}, "/Users/robertgyorgy/JL Mobila/src/components/ProcessSectionV2.astro", void 0);

const $$Index = createComponent(($$result, $$props, $$slots) => {
  return renderTemplate`${renderComponent($$result, "Layout", $$Layout, { "title": "Mobil\u0103 la comand\u0103 | JL Mobila" }, { "default": ($$result2) => renderTemplate` ${maybeRenderHead()}<main> ${renderComponent($$result2, "HeroSection", $$HeroSection, {})} ${renderComponent($$result2, "AboutSection", $$AboutSection, {})} ${renderComponent($$result2, "ServicesSectionV2", $$ServicesSectionV2, {})} ${renderComponent($$result2, "PortfolioSection", $$PortfolioSection, {})} ${renderComponent($$result2, "ProcessSectionV2", $$ProcessSectionV2, {})} ${renderComponent($$result2, "FaqSection", $$FaqSection, {})} </main>  `, "footer": ($$result2) => renderTemplate`${renderComponent($$result2, "Footer", $$Footer, { "slot": "footer" })}` })} ${renderScript($$result, "/Users/robertgyorgy/JL Mobila/src/pages/index.astro?astro&type=script&index=0&lang.ts")}`;
}, "/Users/robertgyorgy/JL Mobila/src/pages/index.astro", void 0);

const $$file = "/Users/robertgyorgy/JL Mobila/src/pages/index.astro";
const $$url = "";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Index,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
