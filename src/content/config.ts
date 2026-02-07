import { defineCollection, z } from 'astro:content';

const portfolio = defineCollection({
  schema: z.object({
    name: z.string(),
    material: z.string().optional(),
    image: z.string().optional(),
  }),
});

export const collections = {
  portfolio,
};
