/**
 * /api/admin/site — read & write the site content (src/config/content.data.json).
 * GET returns the JSON; POST saves it, converting any uploaded image (data URL)
 * to WebP under public/assets/site/ and rewriting the value to the served path.
 */
import type { APIContext } from 'astro';
import fs from 'node:fs/promises';
import path from 'node:path';
import { requireAuth } from '../../../lib/admin/auth';
import { IS_DEV } from '../../../lib/admin/config';
import { applyChanges } from '../../../lib/admin/store';
import { decodeDataUrl, toWebp } from '../../../lib/admin/content';
import { readFile as ghReadFile, type FileChange } from '../../../lib/admin/github';

export const prerender = false;
const CONTENT_PATH = 'src/config/content.data.json';

function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), { status, headers: { 'Content-Type': 'application/json' } });
}

export async function GET(ctx: APIContext) {
  const { auth, error } = await requireAuth(ctx);
  if (error) return error;
  let raw: string | null = null;
  if (IS_DEV) raw = await fs.readFile(path.join(process.cwd(), CONTENT_PATH), 'utf-8').catch(() => null);
  else raw = await ghReadFile(auth.token!, CONTENT_PATH);
  return new Response(raw || '{}', { status: 200, headers: { 'Content-Type': 'application/json' } });
}

export async function POST(ctx: APIContext) {
  const { auth, error } = await requireAuth(ctx);
  if (error) return error;

  let payload: { data?: any };
  try {
    payload = await ctx.request.json();
  } catch {
    return json({ error: 'Invalid JSON' }, 400);
  }
  if (!payload?.data || typeof payload.data !== 'object') return json({ error: 'Missing data' }, 400);

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

  try {
    const resolved = await walk(payload.data);
    changes.push({ path: CONTENT_PATH, content: JSON.stringify(resolved, null, 2) });
    await applyChanges(changes, 'Actualizare conținut site', auth.token, auth.user);
    return json({ ok: true });
  } catch (e: any) {
    return json({ error: e?.message || 'Save failed' }, 500);
  }
}
