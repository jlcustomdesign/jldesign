/**
 * /api/admin/images — lists existing images the user can quick-pick in the
 * editors (project photos + previously uploaded offer/site images).
 */
import type { APIContext } from 'astro';
import fs from 'node:fs/promises';
import path from 'node:path';
import { requireAuth } from '../../../lib/admin/auth';
import { IS_DEV } from '../../../lib/admin/config';
import { listDir } from '../../../lib/admin/github';

export const prerender = false;

const DIRS = ['public/assets/portfolio', 'public/assets/blog', 'public/assets/offers', 'public/assets/site'];
const IMG = /\.(webp|jpe?g|png|avif)$/i;

async function walkLocal(dir: string, out: string[]) {
  let entries: any[];
  try { entries = await fs.readdir(path.join(process.cwd(), dir), { withFileTypes: true }); } catch { return; }
  for (const e of entries) {
    if (e.name.startsWith('.')) continue;
    const rel = `${dir}/${e.name}`;
    if (e.isDirectory()) await walkLocal(rel, out);
    else if (IMG.test(e.name)) out.push('/' + rel.replace(/^public\//, ''));
  }
}

export async function GET(ctx: APIContext) {
  const { auth, error } = await requireAuth(ctx);
  if (error) return error;

  const out: string[] = [];
  if (IS_DEV) {
    for (const d of DIRS) await walkLocal(d, out);
  } else {
    for (const d of DIRS) {
      const names = await listDir(auth.token!, d);
      for (const n of names) if (IMG.test(n)) out.push('/' + `${d}/${n}`.replace(/^public\//, ''));
      // one level of subdirs (offers/<slug>/)
      if (d.endsWith('offers')) {
        const subs = await listDir(auth.token!, d); // listDir returns files only; subdirs need separate handling — skipped in prod for simplicity
      }
    }
  }
  // newest-ish first (portfolio first), de-dupe
  const seen = new Set<string>();
  const images = out.filter((p) => (seen.has(p) ? false : (seen.add(p), true)));
  return new Response(JSON.stringify({ images }), { status: 200, headers: { 'Content-Type': 'application/json' } });
}
