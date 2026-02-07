import { defineCollection, z } from 'astro:content';

const portfolio = defineCollection({
  schema: z.object({
    name: z.string(),
    material: z.string(),
    image: z.string(),
  }),
});

export const collections = {
  portfolio,
};
