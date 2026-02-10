import { renderers } from './renderers.mjs';
import { c as createExports, s as serverEntrypointModule } from './chunks/_@astrojs-ssr-adapter_BC8D4_wQ.mjs';
import { manifest } from './manifest_DWd-7l23.mjs';

const serverIslandMap = new Map();;

const _page0 = () => import('./pages/_image.astro.mjs');
const _page1 = () => import('./pages/about.astro.mjs');
const _page2 = () => import('./pages/api/keystatic/github/login.astro.mjs');
const _page3 = () => import('./pages/api/keystatic/github/oauth/callback.astro.mjs');
const _page4 = () => import('./pages/api/keystatic/_---params_.astro.mjs');
const _page5 = () => import('./pages/contact.astro.mjs');
const _page6 = () => import('./pages/keystatic/_---params_.astro.mjs');
const _page7 = () => import('./pages/portfolio.astro.mjs');
const _page8 = () => import('./pages/services.astro.mjs');
const _page9 = () => import('./pages/index.astro.mjs');
const pageMap = new Map([
    ["node_modules/astro/dist/assets/endpoint/generic.js", _page0],
    ["src/pages/about.astro", _page1],
    ["src/pages/api/keystatic/github/login.ts", _page2],
    ["src/pages/api/keystatic/github/oauth/callback.ts", _page3],
    ["node_modules/@keystatic/astro/internal/keystatic-api.js", _page4],
    ["src/pages/contact.astro", _page5],
    ["node_modules/@keystatic/astro/internal/keystatic-astro-page.astro", _page6],
    ["src/pages/portfolio.astro", _page7],
    ["src/pages/services.astro", _page8],
    ["src/pages/index.astro", _page9]
]);

const _manifest = Object.assign(manifest, {
    pageMap,
    serverIslandMap,
    renderers,
    actions: () => import('./noop-entrypoint.mjs'),
    middleware: () => import('./_noop-middleware.mjs')
});
const _args = {
    "middlewareSecret": "14ec4052-d0b6-4a24-8607-8e64ed0cff24",
    "skewProtection": false
};
const _exports = createExports(_manifest, _args);
const __astrojsSsrVirtualEntry = _exports.default;
const _start = 'start';
if (Object.prototype.hasOwnProperty.call(serverEntrypointModule, _start)) ;

export { __astrojsSsrVirtualEntry as default, pageMap };
