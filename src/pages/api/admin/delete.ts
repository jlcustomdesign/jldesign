import type { APIContext } from 'astro';
import { requireAuth } from '../../../lib/admin/auth';
import { buildDelete } from '../../../lib/admin/collections';
import { readCollection, applyChanges } from '../../../lib/admin/store';
import { PATHS, type CollectionName } from '../../../lib/admin/config';

export const prerender = false;

export async function POST(ctx: APIContext) {
  const { auth, error } = await requireAuth(ctx);
  if (error) return error;

  let payload: { collection: CollectionName; slug: string };
  try {
    payload = (await ctx.request.json()) as any;
  } catch {
    return json({ error: 'Invalid JSON' }, 400);
  }
  if (!payload?.collection || !PATHS[payload.collection] || !payload.slug) {
    return json({ error: 'Missing collection or slug' }, 400);
  }

  try {
    const existing = await readCollection(payload.collection, auth.token);
    const entry = existing.find((e) => e.slug === payload.slug);
    if (!entry) return json({ error: 'Not found' }, 404);

    const changes = buildDelete(payload.collection, entry);
    await applyChanges(changes, `Ștergere ${payload.collection}: ${payload.slug}`, auth.token, auth.user);
    return json({ ok: true });
  } catch (e: any) {
    return json({ error: e?.message || 'Delete failed' }, 500);
  }
}

function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), { status, headers: { 'Content-Type': 'application/json' } });
}
