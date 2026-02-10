import { c as createComponent, m as maybeRenderHead, d as addAttribute, r as renderComponent, a as renderScript, b as renderTemplate } from '../chunks/astro/server_DE-htoAq.mjs';
import 'piccolore';
import { a as $$BubbleButton, $ as $$Layout } from '../chunks/Layout_C20eE-tO.mjs';
/* empty css                                    */
import { $ as $$Footer } from '../chunks/Footer_Tua4kDG9.mjs';
export { renderers } from '../renderers.mjs';

const $$ServicesContent = createComponent(($$result, $$props, $$slots) => {
  const servicesRaw = [
    {
      id: "kitchen",
      title: "Buc\u0103t\u0103rii Custom",
      desc: "Inima casei tale, reg\xE2ndit\u0103. Func\u021Bionalitate des\u0103v\xE2r\u0219it\u0103 \xEEmbr\u0103cat\u0103 \xEEn materiale nobile.",
      img: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?q=80&w=1200"
    },
    {
      id: "dressing",
      title: "Dressing & Wardrobes",
      desc: "Mai mult dec\xE2t depozitare. Un sanctuar al stilului t\u0103u.",
      img: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?q=80&w=1200"
    },
    {
      id: "living",
      title: "Living & Library",
      desc: "Povestea casei, scris\u0103 \xEEn lemn masiv. Biblioteci impun\u0103toare.",
      img: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?q=80&w=1200"
    },
    {
      id: "office",
      title: "Office & Comercial",
      desc: "Productivitate \u0219i stil. Spa\u021Bii de lucru ergonomice.",
      img: "https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=1200"
    },
    {
      id: "bathroom",
      title: "Baie & Wellness",
      desc: "Refugiul t\u0103u personal. Mobilier rezistent la umiditate.",
      img: "https://images.unsplash.com/photo-1552321554-5fefe8c9ef14?q=80&w=1200"
    }
  ];
  const [firstService, ...restServices] = servicesRaw;
  const col1 = restServices.filter((_, i) => i % 2 === 0);
  const col2 = restServices.filter((_, i) => i % 2 !== 0);
  return renderTemplate`${maybeRenderHead()}<section id="services-detailed" class="bg-secondary min-h-screen py-24 md:py-32 w-full overflow-hidden" data-astro-cid-aapc437d> <div class="container mx-auto px-4 md:px-8" data-astro-cid-aapc437d> <div class="flex flex-col gap-16 md:gap-32" data-astro-cid-aapc437d> <!-- 1. FEATURED HERO ITEM (Full Width) --> <!-- Solves the "5 items" odd number issue by giving the first one prominence --> <!-- 1. FEATURED HERO ITEM (Full Width) --> <!-- Solves the "5 items" odd number issue by giving the first one prominence --> <!-- We make the Hero Item also a Flip Card for consistency, or keep it static? 
           User said "for each image". So we apply to all. --> <div class="group service-card w-full h-[60vh] md:h-[80vh] perspective-1000" data-astro-cid-aapc437d> <div class="flip-card-inner relative w-full h-full transition-transform duration-700 transform-style-3d" data-astro-cid-aapc437d> <!-- FRONT --> <div class="flip-card-front absolute inset-0 w-full h-full backface-hidden rounded-[2.5rem] overflow-hidden shadow-2xl" data-astro-cid-aapc437d> <img${addAttribute(firstService.img, "src")}${addAttribute(firstService.title, "alt")} class="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" loading="lazy" data-astro-cid-aapc437d> <div class="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-60 group-hover:opacity-80 transition-opacity duration-500" data-astro-cid-aapc437d></div> <div class="absolute bottom-8 left-8 md:bottom-16 md:left-16 text-white max-w-2xl px-4" data-astro-cid-aapc437d> <h2 class="font-serif font-medium text-4xl md:text-7xl leading-none mb-6" data-astro-cid-aapc437d> ${firstService.title} </h2> <p class="font-sans text-lg md:text-2xl text-white/90 leading-relaxed max-w-xl mb-8" data-astro-cid-aapc437d> ${firstService.desc} </p> <button class="flip-trigger inline-block bg-white/10 backdrop-blur-md border border-white/30 text-white px-8 py-3 rounded-full hover:bg-white hover:text-black transition-all duration-300" data-astro-cid-aapc437d>
Citește mai multe
</button> </div> </div> <!-- BACK --> <div class="flip-card-back absolute inset-0 w-full h-full backface-hidden rotate-y-180 bg-secondary rounded-[2.5rem] overflow-hidden p-8 md:p-16 flex flex-col justify-center items-start shadow-2xl" data-astro-cid-aapc437d> <h3 class="font-serif text-3xl md:text-5xl text-primary mb-6" data-astro-cid-aapc437d>${firstService.title}</h3> <p class="font-sans text-lg md:text-xl text-gray-600 leading-relaxed mb-8 max-w-3xl" data-astro-cid-aapc437d>
Aici poti adauga detalii specifice despre ${firstService.title.toLowerCase()}. 
                    Abordarea noastra se concentreaza pe materiale premium, finisaje impecabile si un design care 
                    rezista testului timului. Fiecare proiect este unic si personalizat.
</p> <ul class="font-sans text-gray-500 space-y-2 mb-12 list-disc list-inside" data-astro-cid-aapc437d> <li data-astro-cid-aapc437d>Consultanta personalizata</li> <li data-astro-cid-aapc437d>Proiectare 3D detaliata</li> <li data-astro-cid-aapc437d>Materiale de cea mai inalta calitate</li> <li data-astro-cid-aapc437d>Montaj profesionist</li> </ul> <button class="flip-close text-primary border-b border-primary pb-1 hover:text-accent hover:border-accent transition-colors" data-astro-cid-aapc437d>
&larr; Înapoi la imagine
</button> </div> </div> </div> <!-- 2. MASONRY GRID (Remaining 4 Items) --> <div class="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-16 items-start" data-astro-cid-aapc437d> <!-- Column 1 --> <div class="flex flex-col gap-12 md:gap-24 masonry-col" data-speed="1" data-astro-cid-aapc437d> ${col1.map((service, i) => renderTemplate`<div class="group service-card perspective-1000 h-[600px] w-full" data-astro-cid-aapc437d> <!-- Fixed height for flip to work well --> <div class="flip-card-inner relative w-full h-full transition-transform duration-700 transform-style-3d" data-astro-cid-aapc437d> <!-- FRONT --> <div class="flip-card-front absolute inset-0 w-full h-full backface-hidden rounded-[2.5rem] overflow-hidden shadow-2xl" data-astro-cid-aapc437d> <img${addAttribute(service.img, "src")}${addAttribute(service.title, "alt")} class="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" loading="lazy" data-astro-cid-aapc437d> <div class="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-80 group-hover:opacity-90 transition-opacity duration-500" data-astro-cid-aapc437d></div> <div class="absolute bottom-0 left-0 w-full p-8 md:p-10 transform transition-transform duration-500 translate-y-2 group-hover:translate-y-0" data-astro-cid-aapc437d> <h2 class="font-serif font-medium text-3xl md:text-5xl text-white leading-tight mb-3" data-astro-cid-aapc437d> ${service.title} </h2> <p class="font-sans text-gray-200 text-lg leading-relaxed max-w-sm opacity-90 group-hover:opacity-100 transition-opacity mb-6" data-astro-cid-aapc437d> ${service.desc} </p> <button class="flip-trigger inline-block bg-white/10 backdrop-blur-md border border-white/30 text-white px-6 py-2 rounded-full hover:bg-white hover:text-black transition-all duration-300 text-sm" data-astro-cid-aapc437d>
Citește mai multe
</button> </div> </div> <!-- BACK --> <div class="flip-card-back absolute inset-0 w-full h-full backface-hidden rotate-y-180 bg-white rounded-[2.5rem] overflow-hidden p-8 md:p-12 flex flex-col justify-center shadow-2xl" data-astro-cid-aapc437d> <h3 class="font-serif text-2xl md:text-4xl text-primary mb-4" data-astro-cid-aapc437d>${service.title}</h3> <p class="font-sans text-gray-600 leading-relaxed mb-6" data-astro-cid-aapc437d>
Detalii extinse despre ${service.title.toLowerCase()}. Solutii adaptate spatiului tau, 
                            optimizand functionalitatea fara a compromite estetica.
</p> <button class="flip-close text-primary text-sm border-b border-primary pb-1 w-max hover:text-accent hover:border-accent transition-colors" data-astro-cid-aapc437d>
&larr; Înapoi
</button> </div> </div> </div>`)} </div> <!-- Column 2 --> <div class="flex flex-col gap-12 md:gap-24 masonry-col md:pt-32" data-speed="1.1" data-astro-cid-aapc437d> ${col2.map((service, i) => renderTemplate`<div class="group service-card perspective-1000 h-[600px] w-full" data-astro-cid-aapc437d> <div class="flip-card-inner relative w-full h-full transition-transform duration-700 transform-style-3d" data-astro-cid-aapc437d> <!-- FRONT --> <div class="flip-card-front absolute inset-0 w-full h-full backface-hidden rounded-[2.5rem] overflow-hidden shadow-2xl" data-astro-cid-aapc437d> <img${addAttribute(service.img, "src")}${addAttribute(service.title, "alt")} class="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" loading="lazy" data-astro-cid-aapc437d> <div class="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-80 group-hover:opacity-90 transition-opacity duration-500" data-astro-cid-aapc437d></div> <div class="absolute bottom-0 left-0 w-full p-8 md:p-10 transform transition-transform duration-500 translate-y-2 group-hover:translate-y-0" data-astro-cid-aapc437d> <h2 class="font-serif font-medium text-3xl md:text-5xl text-white leading-tight mb-3" data-astro-cid-aapc437d> ${service.title} </h2> <p class="font-sans text-gray-200 text-lg leading-relaxed max-w-sm opacity-90 group-hover:opacity-100 transition-opacity mb-6" data-astro-cid-aapc437d> ${service.desc} </p> <button class="flip-trigger inline-block bg-white/10 backdrop-blur-md border border-white/30 text-white px-6 py-2 rounded-full hover:bg-white hover:text-black transition-all duration-300 text-sm" data-astro-cid-aapc437d>
Citește mai multe
</button> </div> </div> <!-- BACK --> <div class="flip-card-back absolute inset-0 w-full h-full backface-hidden rotate-y-180 bg-white rounded-[2.5rem] overflow-hidden p-8 md:p-12 flex flex-col justify-center shadow-2xl" data-astro-cid-aapc437d> <h3 class="font-serif text-2xl md:text-4xl text-primary mb-4" data-astro-cid-aapc437d>${service.title}</h3> <p class="font-sans text-gray-600 leading-relaxed mb-6" data-astro-cid-aapc437d>
Detalii extinse despre ${service.title.toLowerCase()}. Solutii adaptate spatiului tau, 
                            optimizand functionalitatea fara a compromite estetica.
</p> <button class="flip-close text-primary text-sm border-b border-primary pb-1 w-max hover:text-accent hover:border-accent transition-colors" data-astro-cid-aapc437d>
&larr; Înapoi
</button> </div> </div> </div>`)} </div> </div> </div> <!-- Final CTA --> <div class="cta-wrapper h-screen flex items-center justify-center" data-astro-cid-aapc437d> <!-- Wrapper for Pinning --> <div class="text-center cta-container relative z-10" data-astro-cid-aapc437d> <h3 class="cta-headline font-serif text-5xl md:text-8xl text-primary font-medium mb-12 leading-tight flex flex-wrap justify-center gap-x-4 md:gap-x-8 gap-y-2" data-astro-cid-aapc437d> ${"Ai un proiect unic \xEEn minte?".split(" ").map((word) => renderTemplate`<span class="inline-block cta-word" data-astro-cid-aapc437d>${word}</span>`)} </h3> <div class="cta-button-wrapper opacity-0 translate-y-20" data-astro-cid-aapc437d> ${renderComponent($$result, "BubbleButton", $$BubbleButton, { "href": "/contact", "variant": "dark", "class": "text-xl px-16 py-6 rounded-full", "data-astro-cid-aapc437d": true }, { "default": ($$result2) => renderTemplate`
Inițiază Conversația
` })} </div> </div> </div> </div> </section>  ${renderScript($$result, "/Users/robertgyorgy/JL Mobila/src/components/ServicesContent.astro?astro&type=script&index=0&lang.ts")}`;
}, "/Users/robertgyorgy/JL Mobila/src/components/ServicesContent.astro", void 0);

const $$Services = createComponent(($$result, $$props, $$slots) => {
  return renderTemplate`${renderComponent($$result, "Layout", $$Layout, { "title": "Services | JL Mobila" }, { "default": ($$result2) => renderTemplate` ${maybeRenderHead()}<div id="services-hero-section" class="relative w-full h-screen overflow-hidden bg-secondary"> <!-- Text Content (Behind SVG) --> <div class="absolute inset-0 w-full h-full z-0 pointer-events-none"> <div class="relative w-full h-full max-w-[1920px] mx-auto"> <!-- DESKTOP TEXT (Hidden on Mobile) --> <div class="hidden md:block"> <!-- Text for Cutout 1: SERVICIILE --> <div class="absolute left-[4%] top-[16%] -translate-y-1/2 overflow-hidden"> <h1 class="font-serif text-[clamp(3.5rem,7vw,8rem)] leading-none text-primary uppercase whitespace-nowrap pl-4 desktop-headline-text opacity-0">
SERVICIILE
</h1> </div> <!-- Text for Cutout 2: PE CARE NOI --> <div class="absolute left-[4%] top-[36%] -translate-y-1/2 overflow-hidden"> <h2 class="font-serif text-[clamp(3.5rem,7vw,8rem)] leading-none text-primary uppercase whitespace-nowrap pl-4 desktop-headline-text opacity-0">
PE CARE NOI
</h2> </div> <!-- Text for Cutout 3: LE OFERIM --> <div class="absolute left-[4%] top-[56%] -translate-y-1/2 overflow-hidden"> <h2 class="font-serif text-[clamp(3.5rem,7vw,8rem)] leading-none text-primary uppercase whitespace-nowrap pl-4 desktop-headline-text opacity-0">
LE OFERIM
</h2> </div> </div> </div> </div> <!-- SVG Background Container --> <div class="absolute inset-0 w-full h-full flex justify-center items-center pointer-events-none"> <svg id="servicesHeroSVG" width="101%" height="101%" viewBox="0 0 1920 1080" preserveAspectRatio="xMidYMid slice" class="w-full h-full" style="transform-origin: center center;"> <defs> <clipPath id="servicesHeroClip"> <path id="servicesHeroPath" d=""></path> </clipPath> </defs> <!-- The background image content --> <image href="/Images/Gemini_Generated_Image_s64ql8s64ql8s64q.png" x="0" y="0" width="1920" height="1080" preserveAspectRatio="xMidYMid slice" clip-path="url(#servicesHeroClip)"></image> </svg> </div> <!-- Overlay: Right Text (Hidden on Mobile) --> <!-- MOBILE TEXT (Moved here for Z-Index/Visibility) --> <div class="md:hidden absolute inset-0 flex flex-col justify-between px-6 pt-40 pb-24 z-30 pointer-events-auto"> <h1 class="font-serif text-6xl sm:text-7xl text-white uppercase leading-none">
SERVICIILE<br>
PE CARE NOI<br>
LE OFERIM
</h1> <!-- Bottom Content Group --> <div class="flex flex-col items-start gap-8"> <p class="font-sans text-lg font-light text-white/90 leading-relaxed max-w-xs">
Transform your home with elegant, functional, and timeless interior
          designs tailored to your style.
</p> <div> <a href="/contact" class="inline-block bg-white text-primary px-8 py-3 rounded-full font-medium hover:bg-accent hover:text-white transition-colors shadow-lg">
Book a Consultation &rarr;
</a> </div> </div> </div> <!-- Overlay: Right Text (Hidden on Mobile) --> <div class="hidden md:block absolute right-[4%] xl:right-[10%] 2xl:right-[15%] top-[10%] 2xl:top-[8%] max-w-sm 2xl:max-w-2xl text-right z-20 pointer-events-auto opacity-0 hero-overlay-element"> <h3 class="text-white font-sans text-xl md:text-2xl 2xl:text-4xl font-light leading-relaxed mb-6 shadow-sm">
Transform your home with elegant, functional, and timeless interior
        designs tailored to your style.
</h3> <a href="/contact" class="inline-block bg-white text-primary px-8 py-3 2xl:px-10 2xl:py-4 2xl:text-lg rounded-full font-medium hover:bg-accent hover:text-white transition-colors shadow-lg">
Book a Consultation &rarr;
</a> </div> <!-- Overlay: Bottom Card (Hidden on Mobile) --> <div class="hidden md:block absolute bottom-[12%] 2xl:bottom-[15%] right-[4%] xl:right-[10%] 2xl:right-[15%] w-80 2xl:w-[28rem] bg-white rounded-3xl p-4 2xl:p-6 shadow-2xl z-20 pointer-events-auto opacity-0 hero-overlay-element"> <div class="w-full aspect-video rounded-xl overflow-hidden mb-4"> <img src="https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?q=80&w=600" class="w-full h-full object-cover" alt="Custom Design"> </div> <h4 class="font-serif text-xl 2xl:text-2xl text-primary mb-2">
Custom Design Solutions
</h4> <p class="text-xs 2xl:text-base text-gray-500 mb-4 leading-relaxed">
Personalized interiors crafted to reflect your vision.
</p> <a href="/services" class="inline-flex items-center text-sm 2xl:text-base font-medium text-primary hover:text-accent border border-gray-200 px-4 py-2 rounded-full transition-colors">
More info &rarr;
</a> </div> </div> ${renderComponent($$result2, "ServicesContent", $$ServicesContent, {})} ${renderComponent($$result2, "Footer", $$Footer, {})} ${renderScript($$result2, "/Users/robertgyorgy/JL Mobila/src/pages/services.astro?astro&type=script&index=0&lang.ts")} ` })}`;
}, "/Users/robertgyorgy/JL Mobila/src/pages/services.astro", void 0);

const $$file = "/Users/robertgyorgy/JL Mobila/src/pages/services.astro";
const $$url = "/services";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Services,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
