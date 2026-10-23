import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const categories = defineCollection({
  schema: z.object({
    name: z.string(),
  }),
});

const portfolio = defineCollection({
  schema: z.object({
    name: z.string().optional(),
    image: z.string().optional(),
    category: z.string().optional().default('altele'),
  }),
});

const blog = defineCollection({
  schema: z.object({
    title: z.string().default('Articol nou'),
    description: z.string().default(''),
    coverImage: z.string().default('/Images/placeholder-vertical.jpg'),
    coverImageAlt: z.string().default(''),
    category: z.string().default('inspiratie'),
    author: z.string().default('JL Custom Design'),
    publishedDate: z.union([z.string(), z.date()]).default(() => new Date().toISOString().slice(0, 10)),
  }),
});

// Offers are structured JSON (managed by the custom admin / offer maker).
const offers = defineCollection({
  loader: glob({ pattern: '*.json', base: './src/content/offers' }),
  schema: z.object({}).passthrough(),
});

export const collections = {
  portfolio,
  blog,
  categories,
  offers,
};
