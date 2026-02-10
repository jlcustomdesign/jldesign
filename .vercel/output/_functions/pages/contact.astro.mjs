import { c as createComponent, r as renderComponent, b as renderTemplate, m as maybeRenderHead } from '../chunks/astro/server_DE-htoAq.mjs';
import 'piccolore';
import { $ as $$Layout } from '../chunks/Layout_C20eE-tO.mjs';
export { renderers } from '../renderers.mjs';

const $$Contact = createComponent(($$result, $$props, $$slots) => {
  return renderTemplate`${renderComponent($$result, "Layout", $$Layout, { "title": "Contact | JL Mobila" }, { "default": ($$result2) => renderTemplate` ${maybeRenderHead()}<main class="pt-32 px-4 md:px-8 max-w-7xl mx-auto" data-theme="light"> <h1 class="text-4xl md:text-6xl font-serif text-primary mb-6">
Get in Touch
</h1> </main> ` })}`;
}, "/Users/robertgyorgy/JL Mobila/src/pages/contact.astro", void 0);

const $$file = "/Users/robertgyorgy/JL Mobila/src/pages/contact.astro";
const $$url = "/contact";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Contact,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
