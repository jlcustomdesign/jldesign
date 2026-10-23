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
  site: 'https://www.mobilapersonalizatabrasov.ro/', // www is the canonical variant (all non-www URLs 301 here)
  output: 'server',
  trailingSlash: 'ignore',
  adapter: vercel(),
  integrations: [
    react(),
    markdoc(),
    sitemap({
      // Keep private admin tooling and client offers out of the sitemap.
      filter: (page) => !/\/(admin|oferta|test-simultaneous|brandbook)(\/|$)/.test(page),
    })
  ].filter(Boolean),
  vite: {
    plugins: [tailwindcss()],
    ssr: {
      noExternal: ["gsap"],
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