import type { APIContext } from 'astro';
import { requireAuth } from '../../../lib/admin/auth';
import { readCollection } from '../../../lib/admin/store';

export const prerender = false;

export async function GET(ctx: APIContext) {
  const { auth, error } = await requireAuth(ctx);
  if (error) return error;

  const token = auth.token;
  const [portfolio, blog, categories, offers] = await Promise.all([
    readCollection('portfolio', token),
    readCollection('blog', token),
    readCollection('categories', token),
    readCollection('offers', token),
  ]);

  return new Response(JSON.stringify({ portfolio, blog, categories, offers }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  });
}
