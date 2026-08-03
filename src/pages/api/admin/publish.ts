/**
 * /api/admin/publish — batch publish every pending change in a single commit.
 * Edits, new entries, deletions and site-content changes all land in one GitHub
 * commit so the user never sees multiple pushes for one "Publică toate" action.
 */
import type { APIContext } from 'astro';
import { requireAuth } from '../../../lib/admin/auth';
import { buildSave, buildDelete } from '../../../lib/admin/collections';
import { readCollection, applyChanges } from '../../../lib/admin/store';
import { PATHS, type CollectionName } from '../../../lib/admin/config';
import { decodeDataUrl, toWebp } from '../../../lib/admin/content';
import type { FileChange } from '../../../lib/admin/github';

export const prerender = false;

const CONTENT_PATH = 'src/config/content.data.json';

interface BatchEdit {
  collection: CollectionName | 'site';
  slug?: string;
  data?: Record<string, any>;
  body?: string;
}

interface BatchDelete {
  collection: CollectionName;
  slug: string;
}

interface BatchPayload {
  edits: BatchEdit[];
  deletes: BatchDelete[];
}

function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), { status, headers: { 'Content-Type': 'application/json' } });
}

async function buildSiteChanges(data: any): Promise<FileChange[]> {
  const changes: FileChange[] = [];
  let counter = 0;
  const stamp = Date.now();
  const walk = async (node: any): Promise<any> => {
    if (Array.isArray(node)) return Promise.all(node.map(walk));
    if (node && typeof node === 'object') {
      const out: Record<string, any> = {};
      for (const [k, v] of Object.entries(node)) out[k] = await walk(v);
      return out;
    }
    if (typeof node === 'string' && node.startsWith('data:')) {
      const { buffer } = decodeDataUrl(node);
      const webp = await toWebp(buffer);
      const name = `img-${stamp}-${counter++}.webp`;
      changes.push({ path: `public/assets/site/${name}`, content: webp });
      return `/assets/site/${name}`;
    }
    return node;
  };
  const resolved = await walk(data);
  changes.push({ path: CONTENT_PATH, content: JSON.stringify(resolved, null, 2) });
  return changes;
}

export async function POST(ctx: APIContext) {
  const { auth, error } = await requireAuth(ctx);
  if (error) return error;

  let payload: BatchPayload;
  try {
    payload = (await ctx.request.json()) as BatchPayload;
  } catch {
    return json({ error: 'Invalid JSON' }, 400);
  }
  if (!Array.isArray(payload?.edits) || !Array.isArray(payload?.deletes)) {
    return json({ error: 'Missing edits or deletes arrays' }, 400);
  }

  const collectionsUsed = new Set<CollectionName | 'site'>();
  for (const e of payload.edits) collectionsUsed.add(e.collection);
  for (const d of payload.deletes) collectionsUsed.add(d.collection);

  // Read each touched collection once.
  const existing: Partial<Record<CollectionName, import('../../../lib/admin/store').Entry[]>> = {};
  for (const c of collectionsUsed) {
    if (c === 'site') continue;
    existing[c] = await readCollection(c, auth.token);
  }

  const allChanges: FileChange[] = [];
  let count = 0;

  try {
    // Apply edits first (new slugs may clash with each other if we don't track them).
    for (const edit of payload.edits) {
      if (edit.collection === 'site') {
        if (!edit.data) continue;
        allChanges.push(...(await buildSiteChanges(edit.data)));
        count++;
        continue;
      }
      const coll = edit.collection as CollectionName;
      const list = existing[coll]!;
      const result = await buildSave(
        { collection: coll, slug: edit.slug, data: edit.data || {}, body: edit.body },
        list
      );
      // Handle rename: remove the old file if the slug changed.
      if (edit.slug && result.slug !== edit.slug) {
        const old = list.find((e) => e.slug === edit.slug);
        if (old) {
          const ext = coll === 'offers' ? 'json' : 'mdoc';
          allChanges.push({ path: `${PATHS[coll]}/${edit.slug}.${ext}`, delete: true });
        }
      }
      allChanges.push(...result.changes);
      // Keep the in-memory list up to date so the next new item gets a unique slug.
      if (!edit.slug) {
        const ext = coll === 'offers' ? 'json' : 'mdoc';
        list.push({ slug: result.slug, data: edit.data || {}, body: edit.body || '' });
      }
      count++;
    }

    // Apply deletions.
    for (const del of payload.deletes) {
      const list = existing[del.collection];
      const entry = list?.find((e) => e.slug === del.slug);
      if (!entry) continue;
      allChanges.push(...buildDelete(del.collection, entry));
      count++;
    }

    if (allChanges.length === 0) {
      return json({ ok: true, count: 0 });
    }

    await applyChanges(allChanges, `Publicare ${count} modificări`, auth.token, auth.user);
    return json({ ok: true, count });
  } catch (e: any) {
    return json({ error: e?.message || 'Publish failed' }, 500);
  }
}
