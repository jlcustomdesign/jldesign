import { defineCollection, z } from 'astro:content';

const portfolio = defineCollection({
  schema: z.object({
    name: z.string(),
    material: z.string().optional(),
    image: z.string().optional(),
    category: z.string().optional().default('Altele'),
  }),
});

const blog = defineCollection({
  schema: z.object({
    title: z.string(),
    description: z.string(),
    coverImage: z.string().optional(),
    coverImageAlt: z.string(),
    category: z.string().default('inspiratie'),
    author: z.string().default('JL Mobila'),
    publishedDate: z.union([z.string(), z.date()]),
  }),
});

export const collections = {
  portfolio,
  blog,
};
