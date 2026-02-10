import { c as createComponent, m as maybeRenderHead, a as renderScript, b as renderTemplate } from './astro/server_DE-htoAq.mjs';
import 'piccolore';
import 'clsx';

const $$FaqSection = createComponent(($$result, $$props, $$slots) => {
  const faqs = [
    {
      q: "C\xE2t dureaz\u0103 execu\u021Bia unei comenzi?",
      a: "\xCEn func\u021Bie de complexitatea proiectului, termenul de livrare variaz\u0103 \xEEntre 4 \u0219i 8 s\u0103pt\u0103m\xE2ni de la semnarea contractului \u0219i stabilirea detaliilor tehnice finale."
    },
    {
      q: "Oferi\u021Bi garan\u021Bie pentru mobilier?",
      a: "Da, oferim o garan\u021Bie comercial\u0103 de 24 de luni pentru mobilier \u0219i garan\u021Bia produc\u0103torului pentru feronerie (care poate ajunge p\xE2n\u0103 la 20 de ani la branduri precum Blum)."
    },
    {
      q: "Realiza\u021Bi \u0219i proiectare 3D?",
      a: "Absolut. Fiecare proiect \xEEncepe cu o etap\u0103 de consultan\u021B\u0103 \u0219i proiectare 3D, astfel \xEEnc\xE2t s\u0103 pute\u021Bi vizualiza exact cum va ar\u0103ta spa\u021Biul dumneavoastr\u0103 final."
    },
    {
      q: "Ce tipuri de materiale folosi\u021Bi?",
      a: "Lucr\u0103m cu o gam\u0103 variat\u0103 de materiale premium: MDF vopsit sau \xEEnfoliat, PAL melaminat Egger/Kronospan, furnir natural, lemn masiv, sticl\u0103, metal \u0219i compozit."
    },
    {
      q: "Este necesar\u0103 o programare pentru vizita \xEEn showroom?",
      a: "Pentru a ne asigura c\u0103 un designer v\u0103 poate acorda \xEEntreaga aten\u021Bie, recomand\u0103m programarea unei vizite \xEEn prealabil, telefonic sau prin email."
    },
    {
      q: "V\u0103 ocupa\u021Bi \u0219i de integrarea electrocasnicelor?",
      a: "Desigur. Mobilierul este proiectat milimetric pentru a \xEEncorpora perfect electrocasnicele dumneavoastr\u0103, indiferent de marc\u0103 sau dimensiuni."
    },
    {
      q: "Care sunt condi\u021Biile de plat\u0103?",
      a: "Standardul nostru este un avans de 50% la semnarea contractului pentru a demara produc\u021Bia, iar restul de 50% se achit\u0103 \xEEnainte de livrare \u0219i montaj."
    },
    {
      q: "Livra\u021Bi mobilier \u0219i \xEEn afara Bucure\u0219tiului?",
      a: "Da, realiz\u0103m proiecte la nivel na\u021Bional. Pentru livr\u0103rile \xEEn afara zonei Bucure\u0219ti-Ilfov, se va calcula un cost suplimentar de transport \u0219i logistic\u0103."
    }
  ];
  return renderTemplate`${maybeRenderHead()}<section class="py-24 bg-secondary" id="faq-section-v2" data-theme="light"> <div class="container mx-auto px-4 md:px-8"> <div class="flex flex-col lg:flex-row gap-16 items-start relative wrapper-v2"> <!-- Left: Sidebar (Will be animated manually) --> <div class="lg:w-1/3 z-10 relative" id="faq-sidebar-v2"> <h2 class="font-serif text-4xl md:text-5xl text-primary mb-6">
Întrebări Frecvente
</h2> </div> <!-- Right: Accordion --> <div class="lg:w-2/3 w-full" id="faq-list-v2"> <div class="space-y-4"> ${faqs.map((faq, index) => renderTemplate`<div class="group pb-4 faq-item-v2 cursor-pointer relative will-change-transform will-change-opacity"> <button class="w-full flex justify-between items-center py-4 text-left focus:outline-none faq-trigger-v2" aria-expanded="false"> <span class="text-2xl md:text-3xl font-medium text-primary group-hover:text-accent transition-colors"> ${faq.q} </span> <span class="ml-4 transform transition-transform duration-300 faq-icon-v2"> <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-8 h-8 md:w-10 md:h-10"> <path stroke-linecap="round" stroke-linejoin="round" d="M12 4.5v15m7.5-7.5h-15"></path> </svg> </span> </button> <div class="h-0 overflow-hidden faq-content-v2 opacity-0"> <p class="text-gray-600 leading-relaxed pb-4 pr-8 text-lg"> ${faq.a} </p> </div> <!-- Animated Separator Line --> <div class="absolute bottom-0 left-0 w-full h-[1px] bg-gray-200 origin-left transform scale-x-0 faq-line"></div> </div>`)} </div> </div> </div> </div> </section> ${renderScript($$result, "/Users/robertgyorgy/JL Mobila/src/components/FaqSection.astro?astro&type=script&index=0&lang.ts")}`;
}, "/Users/robertgyorgy/JL Mobila/src/components/FaqSection.astro", void 0);

export { $$FaqSection as $ };
