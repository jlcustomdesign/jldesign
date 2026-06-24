import type { APIContext } from 'astro';
import { requireAuth } from '../../../lib/admin/auth';
import { buildSave, type SavePayload } from '../../../lib/admin/collections';
import { readCollection, applyChanges } from '../../../lib/admin/store';
import { PATHS, type CollectionName } from '../../../lib/admin/config';

export const prerender = false;

const LABELS: Record<CollectionName, string> = {
  portfolio: 'proiect portofoliu',
  blog: 'articol blog',
  categories: 'categorie',
  offers: 'ofertă',
};

export async function POST(ctx: APIContext) {
  const { auth, error } = await requireAuth(ctx);
  if (error) return error;

  let payload: SavePayload;
  try {
    payload = (await ctx.request.json()) as SavePayload;
  } catch {
    return json({ error: 'Invalid JSON' }, 400);
  }
  if (!payload?.collection || !PATHS[payload.collection]) {
    return json({ error: 'Unknown collection' }, 400);
  }

  try {
    const existing = await readCollection(payload.collection, auth.token);
    const result = await buildSave(payload, existing);

    // Handle rename: editing under a new slug should remove the old file.
    if (payload.slug && result.slug !== payload.slug) {
      const old = existing.find((e) => e.slug === payload.slug);
      if (old) {
        const ext = payload.collection === 'offers' ? 'json' : 'mdoc';
        result.changes.push({ path: `${PATHS[payload.collection]}/${payload.slug}.${ext}`, delete: true });
      }
    }

    const verb = payload.slug ? 'Actualizare' : 'Adăugare';
    await applyChanges(result.changes, `${verb} ${LABELS[payload.collection]}: ${result.slug}`, auth.token, auth.user);

    return json({ ok: true, slug: result.slug, viewUrl: result.viewUrl });
  } catch (e: any) {
    return json({ error: e?.message || 'Save failed' }, 500);
  }
}

function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), { status, headers: { 'Content-Type': 'application/json' } });
}
