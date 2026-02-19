import { defineCollection, z } from 'astro:content';

const portfolio = defineCollection({
  schema: z.object({
    name: z.string(),
    material: z.string().optional(),
    image: z.string().optional(),
    category: z.string().optional().default('Altele'), // Add category
  }),
});

export const collections = {
  portfolio,
};
