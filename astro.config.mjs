// @ts-check
import { defineConfig } from 'astro/config';
import keystatic from '@keystatic/astro';
import tailwindcss from '@tailwindcss/vite';
// @ts-ignore
import react from '@astrojs/react';
import markdoc from '@astrojs/markdoc';
import vercel from '@astrojs/vercel';

// https://astro.build/config
export default defineConfig({
  site: 'https://jl-design.vercel.app',
  output: 'server',
  adapter: vercel(),
  integrations: [
    react(),
    markdoc(),
    keystatic()
  ].filter(Boolean),
  vite: {
    plugins: [tailwindcss()],
    ssr: {
      noExternal: ["gsap"],
    },
    server: {
      watch: {
        ignored: ["**/public/assets/**"]
      }
    }
  }
});