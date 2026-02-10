import { c as createComponent, m as maybeRenderHead, d as addAttribute, a as renderScript, b as renderTemplate, A as AstroError, U as UnknownContentCollectionError, R as RenderUndefinedEntryError, u as unescapeHTML, e as renderUniqueStylesheet, f as renderScriptElement, g as createHeadAndContent, r as renderComponent } from '../chunks/astro/server_DE-htoAq.mjs';
import 'piccolore';
import { $ as $$Layout } from '../chunks/Layout_C20eE-tO.mjs';
import 'clsx';
import { escape } from 'html-escaper';
import { Traverse } from 'neotraverse/modern';
import pLimit from 'p-limit';
import { z } from 'zod';
import { r as removeBase, i as isRemotePath, p as prependForwardSlash } from '../chunks/path_tbLlI_c1.mjs';
import { V as VALID_INPUT_FORMATS } from '../chunks/consts_BmVDRGlB.mjs';
import * as devalue from 'devalue';
import { $ as $$Footer } from '../chunks/Footer_Tua4kDG9.mjs';
export { renderers } from '../renderers.mjs';

const $$PortfolioHero = createComponent(($$result, $$props, $$slots) => {
  const heroImage = "/Images/Proiecte-JL Custom Design-02.jpg";
  return renderTemplate`${maybeRenderHead()}<section class="relative min-h-screen bg-secondary flex items-center justify-center p-4 pt-24 md:p-8 md:pt-32 overflow-hidden" id="portfolio-hero-section" data-theme="light"> <!-- Bent Grid Container --> <div class="container mx-auto h-full w-full max-w-[1800px]"> <div class="grid grid-cols-1 lg:grid-cols-12 grid-rows-1 lg:grid-rows-2 gap-4 md:gap-6 h-[85vh] lg:h-[80vh]"> <!-- Card 1: Main Hero (Large, Left) --> <div class="portfolio-card hero-card-main col-span-1 lg:col-span-8 row-span-1 lg:row-span-2 relative rounded-[2.5rem] overflow-hidden group opacity-0 translate-y-8"> <!-- Background Image --> <img${addAttribute(heroImage, "src")} alt="Selected Works" class="absolute inset-0 w-full h-full object-cover transition-transform duration-700 ease-out"> <!-- Overlay --> <div class="absolute inset-0 bg-black/20 transition-colors duration-500"></div> <!-- Title (No Glassmorphism) --> <div class="absolute bottom-10 left-6 right-6 md:bottom-14 md:left-10 md:w-fit"> <div class="p-2 md:p-0 relative"> <div class="overflow-hidden pt-4 -mt-4"> <!-- Fix for clipped ascenders/accents --> <h1 class="reveal-text font-serif text-5xl sm:text-6xl md:text-7xl lg:text-8xl xl:text-9xl leading-[0.9] text-white uppercase drop-shadow-lg translate-y-full">
Lucrări
</h1> </div> <div class="overflow-hidden"> <span class="reveal-text block font-serif text-5xl sm:text-6xl md:text-7xl lg:text-8xl xl:text-9xl leading-[0.9] text-accent uppercase drop-shadow-lg translate-y-full">Selectate</span> </div> </div> </div> </div> <!-- Card 2: Description (Top Right) --> <div class="portfolio-card hero-card-desc col-span-1 lg:col-span-4 row-span-1 relative rounded-[2.5rem] overflow-hidden bg-[#1a1a1a] border border-white/5 flex flex-col justify-center p-8 md:p-10 opacity-0 translate-y-8 group hover:border-white/10 transition-colors"> <div class="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-50"></div> <div class="overflow-hidden"> <h2 class="reveal-text relative z-10 font-serif text-2xl md:text-3xl text-white mb-4 block translate-y-full">
Viziune &
</h2> </div> <div class="overflow-hidden"> <h2 class="reveal-text relative z-10 font-serif text-2xl md:text-3xl text-white mb-4 block translate-y-full">
Măiestrie
</h2> </div> <div class="overflow-hidden"> <p class="reveal-text relative z-10 text-white/70 text-base md:text-lg leading-relaxed block translate-y-full">
O colecție de mobilier și spații interioare, create să ridice
            cotidianul prin eleganță discretă și finisaje premium.
</p> </div> <!-- Decoration --> <div class="absolute top-4 right-4 text-white/10"> <svg width="40" height="40" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2L2 19H22L12 2ZM12 5.8L18.5 17H5.5L12 5.8Z"></path></svg> </div> </div> <!-- Card 3: CTA (Bottom Right) --> <a href="/contact" class="portfolio-card hero-card-cta col-span-1 lg:col-span-4 row-span-1 relative rounded-[2.5rem] overflow-hidden bg-accent group cursor-pointer flex flex-col justify-between p-8 md:p-10 opacity-0 translate-y-8"> <!-- Background Hover Effect --> <div class="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300"></div> <div class="relative z-10"> <div class="overflow-hidden mb-4"> <span class="reveal-text inline-block px-4 py-1.5 rounded-full border border-black/20 text-xs font-bold uppercase tracking-wider text-black translate-y-full">
Contact
</span> </div> <div class="overflow-hidden"> <h3 class="reveal-text font-serif text-3xl md:text-4xl text-black leading-tight translate-y-full">
Începe un
</h3> </div> <div class="overflow-hidden"> <h3 class="reveal-text font-serif text-3xl md:text-4xl text-black leading-tight translate-y-full">
Proiect
</h3> </div> </div> <div class="relative z-10 self-end"> <div class="w-14 h-14 rounded-full bg-black text-white flex items-center justify-center group-hover:scale-110 transition-transform duration-300"> <svg width="24" height="24" viewBox="0 0 24 24" fill="none" class="transform -rotate-45 group-hover:rotate-0 transition-transform duration-300"> <path d="M5 12H19M19 12L12 5M19 12L12 19" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path> </svg> </div> </div> </a> </div> </div> </section> ${renderScript($$result, "/Users/robertgyorgy/JL Mobila/src/components/PortfolioHero.astro?astro&type=script&index=0&lang.ts")}`;
}, "/Users/robertgyorgy/JL Mobila/src/components/PortfolioHero.astro", void 0);

const CONTENT_IMAGE_FLAG = "astroContentImageFlag";
const IMAGE_IMPORT_PREFIX = "__ASTRO_IMAGE_";

function imageSrcToImportId(imageSrc, filePath) {
  imageSrc = removeBase(imageSrc, IMAGE_IMPORT_PREFIX);
  if (isRemotePath(imageSrc)) {
    return;
  }
  const ext = imageSrc.split(".").at(-1)?.toLowerCase();
  if (!ext || !VALID_INPUT_FORMATS.includes(ext)) {
    return;
  }
  const params = new URLSearchParams(CONTENT_IMAGE_FLAG);
  if (filePath) {
    params.set("importer", filePath);
  }
  return `${imageSrc}?${params.toString()}`;
}

class ImmutableDataStore {
  _collections = /* @__PURE__ */ new Map();
  constructor() {
    this._collections = /* @__PURE__ */ new Map();
  }
  get(collectionName, key) {
    return this._collections.get(collectionName)?.get(String(key));
  }
  entries(collectionName) {
    const collection = this._collections.get(collectionName) ?? /* @__PURE__ */ new Map();
    return [...collection.entries()];
  }
  values(collectionName) {
    const collection = this._collections.get(collectionName) ?? /* @__PURE__ */ new Map();
    return [...collection.values()];
  }
  keys(collectionName) {
    const collection = this._collections.get(collectionName) ?? /* @__PURE__ */ new Map();
    return [...collection.keys()];
  }
  has(collectionName, key) {
    const collection = this._collections.get(collectionName);
    if (collection) {
      return collection.has(String(key));
    }
    return false;
  }
  hasCollection(collectionName) {
    return this._collections.has(collectionName);
  }
  collections() {
    return this._collections;
  }
  /**
   * Attempts to load a DataStore from the virtual module.
   * This only works in Vite.
   */
  static async fromModule() {
    try {
      const data = await import('../chunks/_astro_data-layer-content_DZgC_9Sn.mjs');
      if (data.default instanceof Map) {
        return ImmutableDataStore.fromMap(data.default);
      }
      const map = devalue.unflatten(data.default);
      return ImmutableDataStore.fromMap(map);
    } catch {
    }
    return new ImmutableDataStore();
  }
  static async fromMap(data) {
    const store = new ImmutableDataStore();
    store._collections = data;
    return store;
  }
}
function dataStoreSingleton() {
  let instance = void 0;
  return {
    get: async () => {
      if (!instance) {
        instance = ImmutableDataStore.fromModule();
      }
      return instance;
    },
    set: (store) => {
      instance = store;
    }
  };
}
const globalDataStore = dataStoreSingleton();

const __vite_import_meta_env__ = {"ASSETS_PREFIX": undefined, "BASE_URL": "/", "DEV": false, "MODE": "production", "PROD": true, "SITE": "https://jl-design.vercel.app", "SSR": true};
function createCollectionToGlobResultMap({
  globResult,
  contentDir
}) {
  const collectionToGlobResultMap = {};
  for (const key in globResult) {
    const keyRelativeToContentDir = key.replace(new RegExp(`^${contentDir}`), "");
    const segments = keyRelativeToContentDir.split("/");
    if (segments.length <= 1) continue;
    const collection = segments[0];
    collectionToGlobResultMap[collection] ??= {};
    collectionToGlobResultMap[collection][key] = globResult[key];
  }
  return collectionToGlobResultMap;
}
z.object({
  tags: z.array(z.string()).optional(),
  lastModified: z.date().optional()
});
function createGetCollection({
  contentCollectionToEntryMap,
  dataCollectionToEntryMap,
  getRenderEntryImport,
  cacheEntriesByCollection,
  liveCollections
}) {
  return async function getCollection(collection, filter) {
    if (collection in liveCollections) {
      throw new AstroError({
        ...UnknownContentCollectionError,
        message: `Collection "${collection}" is a live collection. Use getLiveCollection() instead of getCollection().`
      });
    }
    const hasFilter = typeof filter === "function";
    const store = await globalDataStore.get();
    let type;
    if (collection in contentCollectionToEntryMap) {
      type = "content";
    } else if (collection in dataCollectionToEntryMap) {
      type = "data";
    } else if (store.hasCollection(collection)) {
      const { default: imageAssetMap } = await import('../chunks/content-assets_DleWbedO.mjs');
      const result = [];
      for (const rawEntry of store.values(collection)) {
        const data = updateImageReferencesInData(rawEntry.data, rawEntry.filePath, imageAssetMap);
        let entry = {
          ...rawEntry,
          data,
          collection
        };
        if (entry.legacyId) {
          entry = emulateLegacyEntry(entry);
        }
        if (hasFilter && !filter(entry)) {
          continue;
        }
        result.push(entry);
      }
      return result;
    } else {
      console.warn(
        `The collection ${JSON.stringify(
          collection
        )} does not exist or is empty. Please check your content config file for errors.`
      );
      return [];
    }
    const lazyImports = Object.values(
      type === "content" ? contentCollectionToEntryMap[collection] : dataCollectionToEntryMap[collection]
    );
    let entries = [];
    if (!Object.assign(__vite_import_meta_env__, { _: process.env._ })?.DEV && cacheEntriesByCollection.has(collection)) {
      entries = cacheEntriesByCollection.get(collection);
    } else {
      const limit = pLimit(10);
      entries = await Promise.all(
        lazyImports.map(
          (lazyImport) => limit(async () => {
            const entry = await lazyImport();
            return type === "content" ? {
              id: entry.id,
              slug: entry.slug,
              body: entry.body,
              collection: entry.collection,
              data: entry.data,
              async render() {
                return render({
                  collection: entry.collection,
                  id: entry.id,
                  renderEntryImport: await getRenderEntryImport(collection, entry.slug)
                });
              }
            } : {
              id: entry.id,
              collection: entry.collection,
              data: entry.data
            };
          })
        )
      );
      cacheEntriesByCollection.set(collection, entries);
    }
    if (hasFilter) {
      return entries.filter(filter);
    } else {
      return entries.slice();
    }
  };
}
function emulateLegacyEntry({ legacyId, ...entry }) {
  const legacyEntry = {
    ...entry,
    id: legacyId,
    slug: entry.id
  };
  return {
    ...legacyEntry,
    // Define separately so the render function isn't included in the object passed to `renderEntry()`
    render: () => renderEntry(legacyEntry)
  };
}
const CONTENT_LAYER_IMAGE_REGEX = /__ASTRO_IMAGE_="([^"]+)"/g;
async function updateImageReferencesInBody(html, fileName) {
  const { default: imageAssetMap } = await import('../chunks/content-assets_DleWbedO.mjs');
  const imageObjects = /* @__PURE__ */ new Map();
  const { getImage } = await import('../chunks/_astro_assets_DwSILDiV.mjs').then(n => n._);
  for (const [_full, imagePath] of html.matchAll(CONTENT_LAYER_IMAGE_REGEX)) {
    try {
      const decodedImagePath = JSON.parse(imagePath.replaceAll("&#x22;", '"'));
      let image;
      if (URL.canParse(decodedImagePath.src)) {
        image = await getImage(decodedImagePath);
      } else {
        const id = imageSrcToImportId(decodedImagePath.src, fileName);
        const imported = imageAssetMap.get(id);
        if (!id || imageObjects.has(id) || !imported) {
          continue;
        }
        image = await getImage({ ...decodedImagePath, src: imported });
      }
      imageObjects.set(imagePath, image);
    } catch {
      throw new Error(`Failed to parse image reference: ${imagePath}`);
    }
  }
  return html.replaceAll(CONTENT_LAYER_IMAGE_REGEX, (full, imagePath) => {
    const image = imageObjects.get(imagePath);
    if (!image) {
      return full;
    }
    const { index, ...attributes } = image.attributes;
    return Object.entries({
      ...attributes,
      src: image.src,
      srcset: image.srcSet.attribute,
      // This attribute is used by the toolbar audit
      ...Object.assign(__vite_import_meta_env__, { _: process.env._ }).DEV ? { "data-image-component": "true" } : {}
    }).map(([key, value]) => value ? `${key}="${escape(value)}"` : "").join(" ");
  });
}
function updateImageReferencesInData(data, fileName, imageAssetMap) {
  return new Traverse(data).map(function(ctx, val) {
    if (typeof val === "string" && val.startsWith(IMAGE_IMPORT_PREFIX)) {
      const src = val.replace(IMAGE_IMPORT_PREFIX, "");
      const id = imageSrcToImportId(src, fileName);
      if (!id) {
        ctx.update(src);
        return;
      }
      const imported = imageAssetMap?.get(id);
      if (imported) {
        ctx.update(imported);
      } else {
        ctx.update(src);
      }
    }
  });
}
async function renderEntry(entry) {
  if (!entry) {
    throw new AstroError(RenderUndefinedEntryError);
  }
  if ("render" in entry && !("legacyId" in entry)) {
    return entry.render();
  }
  if (entry.deferredRender) {
    try {
      const { default: contentModules } = await import('../chunks/content-modules_BCZp91sS.mjs');
      const renderEntryImport = contentModules.get(entry.filePath);
      return render({
        collection: "",
        id: entry.id,
        renderEntryImport
      });
    } catch (e) {
      console.error(e);
    }
  }
  const html = entry?.rendered?.metadata?.imagePaths?.length && entry.filePath ? await updateImageReferencesInBody(entry.rendered.html, entry.filePath) : entry?.rendered?.html;
  const Content = createComponent(() => renderTemplate`${unescapeHTML(html)}`);
  return {
    Content,
    headings: entry?.rendered?.metadata?.headings ?? [],
    remarkPluginFrontmatter: entry?.rendered?.metadata?.frontmatter ?? {}
  };
}
async function render({
  collection,
  id,
  renderEntryImport
}) {
  const UnexpectedRenderError = new AstroError({
    ...UnknownContentCollectionError,
    message: `Unexpected error while rendering ${String(collection)} → ${String(id)}.`
  });
  if (typeof renderEntryImport !== "function") throw UnexpectedRenderError;
  const baseMod = await renderEntryImport();
  if (baseMod == null || typeof baseMod !== "object") throw UnexpectedRenderError;
  const { default: defaultMod } = baseMod;
  if (isPropagatedAssetsModule(defaultMod)) {
    const { collectedStyles, collectedLinks, collectedScripts, getMod } = defaultMod;
    if (typeof getMod !== "function") throw UnexpectedRenderError;
    const propagationMod = await getMod();
    if (propagationMod == null || typeof propagationMod !== "object") throw UnexpectedRenderError;
    const Content = createComponent({
      factory(result, baseProps, slots) {
        let styles = "", links = "", scripts = "";
        if (Array.isArray(collectedStyles)) {
          styles = collectedStyles.map((style) => {
            return renderUniqueStylesheet(result, {
              type: "inline",
              content: style
            });
          }).join("");
        }
        if (Array.isArray(collectedLinks)) {
          links = collectedLinks.map((link) => {
            return renderUniqueStylesheet(result, {
              type: "external",
              src: prependForwardSlash(link)
            });
          }).join("");
        }
        if (Array.isArray(collectedScripts)) {
          scripts = collectedScripts.map((script) => renderScriptElement(script)).join("");
        }
        let props = baseProps;
        if (id.endsWith("mdx")) {
          props = {
            components: propagationMod.components ?? {},
            ...baseProps
          };
        }
        return createHeadAndContent(
          unescapeHTML(styles + links + scripts),
          renderTemplate`${renderComponent(
            result,
            "Content",
            propagationMod.Content,
            props,
            slots
          )}`
        );
      },
      propagation: "self"
    });
    return {
      Content,
      headings: propagationMod.getHeadings?.() ?? [],
      remarkPluginFrontmatter: propagationMod.frontmatter ?? {}
    };
  } else if (baseMod.Content && typeof baseMod.Content === "function") {
    return {
      Content: baseMod.Content,
      headings: baseMod.getHeadings?.() ?? [],
      remarkPluginFrontmatter: baseMod.frontmatter ?? {}
    };
  } else {
    throw UnexpectedRenderError;
  }
}
function isPropagatedAssetsModule(module) {
  return typeof module === "object" && module != null && "__astroPropagation" in module;
}

// astro-head-inject

const liveCollections = {};

const contentDir = '/src/content/';

const contentEntryGlob = "";
const contentCollectionToEntryMap = createCollectionToGlobResultMap({
	globResult: contentEntryGlob,
	contentDir,
});

const dataEntryGlob = "";
const dataCollectionToEntryMap = createCollectionToGlobResultMap({
	globResult: dataEntryGlob,
	contentDir,
});
createCollectionToGlobResultMap({
	globResult: { ...contentEntryGlob, ...dataEntryGlob },
	contentDir,
});

let lookupMap = {};
lookupMap = {};

new Set(Object.keys(lookupMap));

function createGlobLookup(glob) {
	return async (collection, lookupId) => {
		const filePath = lookupMap[collection]?.entries[lookupId];

		if (!filePath) return undefined;
		return glob[collection][filePath];
	};
}

const renderEntryGlob = "";
const collectionToRenderEntryMap = createCollectionToGlobResultMap({
	globResult: renderEntryGlob,
	contentDir,
});

const cacheEntriesByCollection = new Map();
const getCollection = createGetCollection({
	contentCollectionToEntryMap,
	dataCollectionToEntryMap,
	getRenderEntryImport: createGlobLookup(collectionToRenderEntryMap),
	cacheEntriesByCollection,
	liveCollections,
});

const $$PortfolioCMSGrid = createComponent(async ($$result, $$props, $$slots) => {
  const portfolioEntries = await getCollection("portfolio");
  const portfolio = portfolioEntries.map((entry) => entry.data);
  const columns = [[], [], []];
  portfolio.forEach((item, i) => {
    columns[i % 3].push(item);
  });
  return renderTemplate`${maybeRenderHead()}<section class="bg-secondary relative w-full py-20 px-4 md:px-8" id="portfolio-cms-section"> <div class="container mx-auto"> ${portfolio.length === 0 ? renderTemplate`<div class="text-center py-20"> <p class="text-xl text-gray-500">Nu există proiecte în portofoliu.</p> <p class="text-sm text-gray-400 mt-2">Adaugă proiecte din <a href="/keystatic" class="text-accent underline">panoul de administrare</a>.</p> </div>` : renderTemplate`<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 w-full max-w-[1800px] mx-auto"> ${columns.map((col, colIndex) => renderTemplate`<div class="flex flex-col gap-12 portfolio-cms-column will-change-transform"${addAttribute(colIndex, "data-col-index")}> ${col.map((item, i) => renderTemplate`<div class="group relative w-full cursor-pointer"> <!-- Image Wrapper --> <div class="relative w-full overflow-hidden rounded-[2rem] bg-gray-900 aspect-[3/4] md:aspect-[4/5]"> <img${addAttribute(item.image, "src")}${addAttribute(item.name, "alt")} decoding="async"${addAttribute(colIndex < 2 && i < 2 ? "eager" : "lazy", "loading")} class="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105 will-change-transform"> <!-- Overlay (Minimalist) --> <div class="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors duration-500"></div> </div> <!-- Info Below Image --> <div class="mt-6 flex justify-between items-end opacity-80 group-hover:opacity-100 transition-opacity duration-500"> <div> <h3 class="font-serif text-2xl text-primary leading-tight"> ${item.name} </h3> <p class="text-sm text-accent uppercase tracking-widest mt-2 font-medium"> ${item.material} </p> </div> <!-- Arrow Icon --> <div class="w-10 h-10 rounded-full border border-white/20 flex items-center justify-center transform -rotate-45 group-hover:rotate-0 transition-transform duration-500 text-primary"> <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg> </div> </div> </div>`)} </div>`)} </div>`} </div> <!-- Lightbox Modal --> <div id="portfolio-lightbox" class="fixed inset-0 z-[100] bg-black/95 opacity-0 pointer-events-none flex items-center justify-center p-4"> <!-- Close Button --> <button id="lightbox-close" class="absolute top-6 right-6 z-50 p-2 text-white/50 hover:text-white transition-colors bg-black/20 hover:bg-black/50 rounded-full"> <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg> </button> <!-- Prev Button --> <button id="lightbox-prev" class="absolute left-4 md:left-8 top-1/2 -translate-y-1/2 z-50 p-3 text-white/50 hover:text-white transition-colors bg-black/20 hover:bg-black/50 rounded-full hidden md:block"> <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="15 18 9 12 15 6"></polyline></svg> </button> <!-- Image --> <img id="lightbox-img" src="" alt="Project Fullscreen" class="max-w-full max-h-[90vh] object-contain rounded-lg shadow-2xl"> <!-- Next Button --> <button id="lightbox-next" class="absolute right-4 md:right-8 top-1/2 -translate-y-1/2 z-50 p-3 text-white/50 hover:text-white transition-colors bg-black/20 hover:bg-black/50 rounded-full hidden md:block"> <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 18 15 12 9 6"></polyline></svg> </button> </div> </section> ${renderScript($$result, "/Users/robertgyorgy/JL Mobila/src/components/PortfolioCMSGrid.astro?astro&type=script&index=0&lang.ts")}`;
}, "/Users/robertgyorgy/JL Mobila/src/components/PortfolioCMSGrid.astro", void 0);

const $$Portfolio = createComponent(($$result, $$props, $$slots) => {
  return renderTemplate`${renderComponent($$result, "Layout", $$Layout, { "title": "Portfolio | JL Mobila" }, { "default": ($$result2) => renderTemplate` ${maybeRenderHead()}<main> ${renderComponent($$result2, "PortfolioHero", $$PortfolioHero, {})} ${renderComponent($$result2, "PortfolioCMSGrid", $$PortfolioCMSGrid, {})} </main>  `, "footer": ($$result2) => renderTemplate`${renderComponent($$result2, "Footer", $$Footer, { "slot": "footer" })}` })}`;
}, "/Users/robertgyorgy/JL Mobila/src/pages/portfolio.astro", void 0);

const $$file = "/Users/robertgyorgy/JL Mobila/src/pages/portfolio.astro";
const $$url = "/portfolio";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Portfolio,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
