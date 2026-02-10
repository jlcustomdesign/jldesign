import { c as createComponent, r as renderComponent, a as renderScript, b as renderTemplate, m as maybeRenderHead } from '../chunks/astro/server_DE-htoAq.mjs';
import 'piccolore';
import { $ as $$Layout, a as $$BubbleButton } from '../chunks/Layout_C20eE-tO.mjs';
import { $ as $$FaqSection } from '../chunks/FaqSection_CStDgzyF.mjs';
import { $ as $$Footer } from '../chunks/Footer_Tua4kDG9.mjs';
/* empty css                                 */
export { renderers } from '../renderers.mjs';

const $$About = createComponent(($$result, $$props, $$slots) => {
  return renderTemplate`${renderComponent($$result, "Layout", $$Layout, { "title": "Despre Noi | JL Mobila" }, { "default": ($$result2) => renderTemplate` ${maybeRenderHead()}<main class="w-full relative z-10"> <!-- Hero Section --> <!-- Hero Section --> <section id="about-hero-section" class="min-h-screen lg:min-h-[110vh] flex flex-col justify-center bg-secondary px-4 md:px-8 overflow-hidden relative pb-10 lg:pb-12" style="min-height: 110vh !important;"> <!-- Background SVG Container (COMMENTED OUT) --> <!-- <div
        id="about-hero-bg"
        class="absolute inset-0 z-0 overflow-hidden flex justify-center items-center pointer-events-none"
      >
        <svg
          id="aboutHeroSVG"
          xmlns="http://www.w3.org/2000/svg"
          width="100%"
          height="100%"
          preserveAspectRatio="xMidYMid meet"
          class="w-[98%] h-full opacity-0"
          style="transform-origin: center center;"
        >
          <path id="aboutHeroPath" fill="white" fill-opacity="1"></path>
        </svg>
      </div> --> <div id="about-hero-content" class="container mx-auto h-[80vh] w-full"> <div class="grid grid-cols-1 lg:grid-cols-12 gap-6 h-full relative"> <!-- Left: Title Bottom Left --> <div class="order-2 lg:order-1 lg:col-span-5 flex flex-col justify-end pb-0 relative z-20"> <div class="space-y-6"> <p class="text-primary/60 text-lg md:text-xl max-w-md reveal-text" data-reveal="slide">
Our family's dedication to this noble material reflects a deep
                respect for its history and potential.
</p> <h1 id="about-hero-title" class="font-serif text-[12vw] lg:text-[10rem] leading-[0.8] text-primary whitespace-nowrap opacity-0 -ml-1 md:-ml-2 lg:-ml-3 -mb-1 md:-mb-2 lg:-mb-4" style="transform: translateY(100%);">
DESPRE NOI
</h1> </div> </div> <!-- Right: 4 Slices Image (Continuous) --> <div class="order-1 lg:order-2 lg:col-span-7 h-full grid grid-cols-4 gap-4 z-10"> <!-- Slice 1 (Left) - SHORTENED --> <div class="relative overflow-hidden h-[75%] lg:h-[70%] w-full reveal-roll rounded-2xl" data-delay="0.1" style="clip-path: inset(0 0 100% 0);"> <img src="/Images/hero-image.jpg" class="absolute inset-x-0 w-[400%] max-w-none h-[142.86%] object-cover top-0 left-0" alt="Slice 1"> </div> <!-- Slice 2 (Center Left) - SHORTENED --> <div class="relative overflow-hidden h-[75%] lg:h-[70%] w-full reveal-roll rounded-2xl" data-delay="0.3" style="clip-path: inset(0 0 100% 0);"> <img src="/Images/hero-image.jpg" class="absolute inset-x-0 w-[400%] max-w-none h-[142.86%] object-cover top-0 -left-[100%]" alt="Slice 2"> </div> <!-- Slice 3 (Center Right) - FULL --> <div class="relative overflow-hidden h-full w-full reveal-roll rounded-2xl" data-delay="0.5" style="clip-path: inset(0 0 100% 0);"> <img src="/Images/hero-image.jpg" class="absolute inset-x-0 w-[400%] max-w-none h-full object-cover top-0 -left-[200%]" alt="Slice 3"> </div> <!-- Slice 4 (Right) - FULL --> <div class="relative overflow-hidden h-full w-full reveal-roll rounded-2xl" data-delay="0.7" style="clip-path: inset(0 0 100% 0);"> <img src="/Images/hero-image.jpg" class="absolute inset-x-0 w-[400%] max-w-none h-full object-cover top-0 -left-[300%]" alt="Slice 4"> </div> </div> </div> </div> </section> <!-- Story / Values Section: Geometric Bento --> <section class="py-24 md:py-32 bg-secondary text-primary relative z-10 -mt-10 rounded-t-[3rem] overflow-hidden" id="about-story-section"> <div class="container mx-auto px-4 md:px-8"> <!-- Bento Grid --> <div class="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 auto-rows-min"> <!-- Cell 1: Header & Quote (Large Block) --> <div class="lg:col-span-8 p-8 md:p-12 bg-white rounded-3xl relative overflow-hidden group border border-primary/5 bento-card"> <div class="absolute top-0 right-0 w-32 h-32 bg-secondary rounded-bl-full -mr-8 -mt-8 opacity-50 transition-transform duration-700 group-hover:scale-110"></div> <span class="block text-accent uppercase tracking-[0.2em] text-sm font-bold mb-8 relative z-10">Filozofia Noastră</span> <h2 class="text-3xl md:text-5xl lg:text-6xl font-serif text-primary mb-8 leading-tight relative z-10">
Calitatea nu este un act, ci un obicei.
</h2> <div class="h-1 w-24 bg-accent mt-8 transform origin-left transition-all duration-700 group-hover:w-full"></div> </div> <!-- Cell 2: Stat 1 (Square) --> <div class="lg:col-span-4 p-8 bg-[#1a1a1a] text-white rounded-3xl flex flex-col justify-center items-center text-center bento-card group relative overflow-hidden"> <span class="text-6xl md:text-7xl font-serif text-accent mb-2 block scale-100 group-hover:scale-110 transition-transform duration-500 stat-number">15+</span> <span class="text-sm uppercase tracking-widest text-white/60">Ani de experiență</span> </div> <!-- Cell 3: Manifesto (Medium Block) --> <div class="lg:col-span-5 p-8 md:p-10 bg-secondary border border-primary/10 rounded-3xl flex flex-col justify-center relative bento-card group"> <p class="text-lg md:text-xl text-primary/80 leading-relaxed">
Într-o lume dominată de "fast furniture", noi am ales calea opusă.
              Credem în piese care îmbătrânesc frumos, în materiale care se simt
              bine la atingere.
</p> </div> <!-- Cell 4: Stat 2 (Rectangle) --> <div class="lg:col-span-3 p-8 bg-white border border-primary/5 rounded-3xl flex flex-col justify-between bento-card hover:shadow-lg transition-shadow duration-300"> <span class="text-sm uppercase tracking-widest text-primary/40 block text-right">Proiecte</span> <span class="text-5xl md:text-6xl font-serif text-primary block stat-number">500+</span> <div class="w-full bg-secondary h-1 mt-4 rounded-full overflow-hidden"> <div class="bg-primary h-full w-[85%]"></div> </div> </div> <!-- Cell 5: Stat 3 & 4 (Combined or Split) --> <div class="lg:col-span-4 grid grid-cols-2 gap-4"> <div class="p-6 bg-white rounded-3xl border border-primary/5 flex flex-col justify-center items-center text-center bento-card"> <span class="text-4xl font-serif text-primary mb-1 stat-number">100%</span> <span class="text-[10px] uppercase tracking-wider text-primary/60">Dedicare</span> </div> <div class="p-6 bg-[#d4af37] text-white rounded-3xl flex flex-col justify-center items-center text-center bento-card relative overflow-hidden"> <span class="text-4xl font-serif text-white mb-1 relative z-10 stat-number">24h</span> <span class="text-[10px] uppercase tracking-wider text-white/80 relative z-10">Suport Rapid</span> </div> </div> <!-- Cell 6: Collaboration Text --> <div class="lg:col-span-12 p-10 md:p-16 bg-white rounded-3xl border border-primary/5 mt-4 relative overflow-hidden bento-card items-center flex flex-col md:flex-row gap-8 md:gap-16"> <div class="md:w-1/2 relative z-10"> <h3 class="text-2xl md:text-4xl font-serif text-primary mb-4">
Nu vindem mobilă din stoc.
</h3> </div> <div class="md:w-1/2 relative z-10"> <p class="text-2xl md:text-3xl text-primary/80 leading-relaxed">
Fiecare proiect este o colaborare strânsă între client și echipa
                noastră de designeri. Transformăm viziunea ta în realitate
                tangibilă, milimetru cu milimetru.
</p> </div> </div> </div> </div> </section> <!-- Atelier / Craftsmanship Section: Hyper-Minimalist --> <section class="py-32 md:py-48 bg-secondary text-primary relative z-10" id="about-atelier-section"> <div class="container mx-auto px-4 md:px-8"> <!-- Moment 3: The Philosophy (Redesigned Text-Only) --> <div class="flex flex-col gap-12 md:gap-24 items-start pb-32"> <!-- Title: Full Width --> <div class="w-full"> <h2 class="text-5xl md:text-7xl lg:text-8xl font-serif font-bold text-primary leading-[1.05] scrub-words uppercase">
Nu producem mobilă.<br>
Creăm liniște.
</h2> </div> <!-- Moment 2: The Manifesto (Left 50%) & Visuals (Right 50%) --> <div class="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-24 w-full items-start"> <!-- Left Col: Text --> <div class="md:col-span-1 md:pr-12 md:sticky md:top-32"> <p class="text-4xl md:text-6xl text-primary leading-tight scrub-words mb-16">
În atelierul nostru, timpul curge altfel. Lemnul este lăsat să
                respire.
</p> <p class="text-4xl md:text-6xl text-primary leading-tight scrub-words mb-16">
Fiecare îmbinare este o promisiune de durabilitate onorată
                manual.
</p> </div> <!-- Right Col: Landscape Images --> <div class="md:col-span-1 flex flex-col gap-12 md:gap-24 pt-12 md:pt-0"> <!-- Image 1 --> <div class="fancy-card overflow-hidden rounded-2xl aspect-[16/10] relative group shadow-xl"> <div class="absolute inset-0 bg-primary/10 z-20 transition-opacity duration-700 group-hover:opacity-0 mixed-blend-overlay"></div> <img src="/Images/Proiecte-JL Custom Design-09.jpg" alt="Workshop Process" class="object-cover w-full h-full scale-[1.15] fancy-image will-change-transform"> </div> <!-- Image 2 --> <div class="fancy-card overflow-hidden rounded-2xl aspect-[16/10] relative group shadow-xl"> <div class="absolute inset-0 bg-primary/10 z-20 transition-opacity duration-700 group-hover:opacity-0 mixed-blend-overlay"></div> <img src="/Images/Proiecte-JL Custom Design-05.jpg" alt="Finished Detail" class="object-cover w-full h-full scale-[1.15] fancy-image will-change-transform"> </div> </div> </div> <!-- CTA (Dark Banner) --> <div class="w-full mt-24"> <div class="bg-primary text-[#EAE6DF] p-10 md:p-16 rounded-[2rem] flex flex-col md:flex-row items-center justify-between gap-12 relative overflow-hidden shadow-2xl scrub-card opacity-0 translate-y-24 will-change-transform"> <div class="flex flex-col gap-4 text-center md:text-left max-w-3xl"> <p class="text-[#EAE6DF]/60 uppercase tracking-widest text-sm font-bold scrub-fade">
Portofoliu
</p> <h3 class="text-3xl md:text-4xl lg:text-5xl font-serif font-bold leading-tight scrub-words">
Rezultatul? O colecție de piese care vorbesc de la sine.
</h3> </div> <div class="shrink-0 scrub-fade"> ${renderComponent($$result2, "BubbleButton", $$BubbleButton, { "href": "/portfolio", "variant": "primary", "class": "!px-12 !py-5 !text-lg" }, { "default": ($$result3) => renderTemplate`
Vezi Proiectele
` })} </div> </div> </div> </div> </div> </section> ${renderComponent($$result2, "FaqSection", $$FaqSection, {})} </main>  `, "footer": ($$result2) => renderTemplate`${renderComponent($$result2, "Footer", $$Footer, { "slot": "footer" })}` })} ${renderScript($$result, "/Users/robertgyorgy/JL Mobila/src/pages/about.astro?astro&type=script&index=0&lang.ts")} `;
}, "/Users/robertgyorgy/JL Mobila/src/pages/about.astro", void 0);

const $$file = "/Users/robertgyorgy/JL Mobila/src/pages/about.astro";
const $$url = "/about";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$About,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
