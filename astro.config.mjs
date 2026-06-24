// @ts-check
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
// @ts-ignore
import react from '@astrojs/react';
import markdoc from '@astrojs/markdoc';
import vercel from '@astrojs/vercel';
import sitemap from '@astrojs/sitemap';

// https://astro.build/config
export default defineConfig({
  site: 'https://mobilapersonalizatabrasov.ro/', // Updated to custom domain
  output: 'server',
  trailingSlash: 'ignore',
  adapter: vercel({ maxDuration: 60 }),
  integrations: [
    react(),
    markdoc(),
    sitemap({
      // Keep private admin tooling and client offers out of the sitemap.
      filter: (page) => !/\/(admin|oferta)(\/|$)/.test(page),
    })
  ].filter(Boolean),
  vite: {
    plugins: [tailwindcss()],
    ssr: {
      noExternal: ["gsap"],
      // Keep the headless-Chrome packages external so they aren't bundled
      // (the Vercel adapter traces + includes them for the PDF route).
      external: ["puppeteer-core", "@sparticuz/chromium-min"],
    },
    server: {
      watch: {
        // Don't hot-reload the dev server when the admin writes content/images —
        // otherwise saving/autosaving an offer would reload the whole admin SPA.
        // The /oferta page + PDF read offers straight from disk in dev instead.
        ignored: ["**/public/assets/**", "**/src/content/offers/**"]
      }
    }
  }
});