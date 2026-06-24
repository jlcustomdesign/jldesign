/**
 * collections.ts — Per-collection rules: turn admin form data into the exact
 * repo files the live site expects, and figure out what to delete.
 *
 * Image fields arrive as `data:` URLs (fresh uploads) or as existing public
 * paths ("/assets/..."). Fresh uploads are converted to WebP and stored; the
 * field value is rewritten to the served path.
 */
import { ASSETS, PATHS, type CollectionName } from './config';
import { decodeDataUrl, serializeEntry, slugify, toWebp } from './content';
import type { FileChange } from './github';
import type { Entry } from './store';

const isDataUrl = (v: unknown): v is string => typeof v === 'string' && v.startsWith('data:');
const publicToRepo = (p: string) => `public${p.startsWith('/') ? '' : '/'}${p}`;

async function encodeImage(dataUrl: string, repoPath: string): Promise<FileChange> {
  const { buffer } = decodeDataUrl(dataUrl);
  const webp = await toWebp(buffer);
  return { path: repoPath, content: webp };
}

export interface SavePayload {
  collection: CollectionName;
  slug?: string;
  data: Record<string, any>;
  body?: string;
}

export interface SaveResult {
  slug: string;
  changes: FileChange[];
  /** Public URL where the entry can be viewed, if any. */
  viewUrl?: string;
}

/** Build the file changes for creating/updating one entry. */
export async function buildSave(payload: SavePayload, existing: Entry[]): Promise<SaveResult> {
  const { collection, data, body } = payload;
  const changes: FileChange[] = [];

  switch (collection) {
    case 'portfolio': {
      const slug = payload.slug || uniqueSlug(data.name || 'proiect', existing);
      const fm: Record<string, unknown> = {
        name: data.name || '',
        category: data.category || 'altele',
      };
      if (isDataUrl(data.image)) {
        const repoPath = `${ASSETS.portfolio}/${slug}.webp`;
        changes.push(await encodeImage(data.image, repoPath));
        fm.image = `/assets/portfolio/${slug}.webp`;
      } else if (data.image) {
        fm.image = data.image;
      }
      changes.push({ path: `${PATHS.portfolio}/${slug}.mdoc`, content: serializeEntry(fm, body) });
      return { slug, changes };
    }

    case 'blog': {
      const slug = payload.slug || uniqueSlug(data.title || 'articol', existing);
      const fm: Record<string, unknown> = {
        title: data.title || '',
        description: data.description || '',
        coverImageAlt: data.coverImageAlt || '',
        category: data.category || 'inspiratie',
        author: data.author || 'JL Custom Design',
        publishedDate: data.publishedDate || new Date().toISOString().slice(0, 10),
      };
      if (isDataUrl(data.coverImage)) {
        const repoPath = `${ASSETS.blog}/${slug}.webp`;
        changes.push(await encodeImage(data.coverImage, repoPath));
        fm.coverImage = `/assets/blog/${slug}.webp`;
      } else if (data.coverImage) {
        fm.coverImage = data.coverImage;
      }
      changes.push({ path: `${PATHS.blog}/${slug}.mdoc`, content: serializeEntry(fm, body) });
      return { slug, changes, viewUrl: `/blog/${slug}` };
    }

    case 'categories': {
      const slug = payload.slug || slugify(data.name || 'categorie');
      changes.push({
        path: `${PATHS.categories}/${slug}.mdoc`,
        content: serializeEntry({ name: data.name || slug }),
      });
      return { slug, changes };
    }

    case 'offers': {
      const slug = payload.slug || uniqueSlug(data.clientName || data.title || 'oferta', existing);
      // Deep-walk: convert any uploaded image to WebP under this offer's folder.
      let counter = 0;
      const walk = async (node: any): Promise<any> => {
        if (Array.isArray(node)) return Promise.all(node.map(walk));
        if (node && typeof node === 'object') {
          const out: Record<string, any> = {};
          for (const [k, v] of Object.entries(node)) out[k] = await walk(v);
          return out;
        }
        if (isDataUrl(node)) {
          const name = `${counter++}.webp`;
          const repoPath = `${ASSETS.offers}/${slug}/${name}`;
          changes.push(await encodeImage(node, repoPath));
          return `/assets/offers/${slug}/${name}`;
        }
        return node;
      };
      const resolved = await walk({ ...data, slug });
      changes.push({
        path: `${PATHS.offers}/${slug}.json`,
        content: JSON.stringify(resolved, null, 2),
      });
      return { slug, changes, viewUrl: `/oferta/${slug}` };
    }
  }
}

/** Build the file changes for deleting one entry (entry file + its images). */
export function buildDelete(collection: CollectionName, entry: Entry): FileChange[] {
  const changes: FileChange[] = [];
  const ext = collection === 'offers' ? 'json' : 'mdoc';
  changes.push({ path: `${PATHS[collection]}/${entry.slug}.${ext}`, delete: true });

  // Only remove images this entry OWNS — never shared images (e.g. an offer that
  // reuses a portfolio photo must not delete that photo). Owned = under the
  // entry's dedicated folder/name.
  const refs = new Set<string>();
  const collect = (node: any) => {
    if (Array.isArray(node)) return node.forEach(collect);
    if (node && typeof node === 'object') return Object.values(node).forEach(collect);
    if (typeof node === 'string') refs.add(node);
  };
  collect(entry.data);

  if (collection === 'offers') {
    // Offer images live under /assets/offers/<slug>/
    const own = `/assets/offers/${entry.slug}/`;
    for (const p of refs) if (p.startsWith(own)) changes.push({ path: publicToRepo(p), delete: true });
  } else {
    // Admin-created portfolio/blog images follow /assets/<collection>/<slug>.webp.
    const own = `/assets/${collection}/${entry.slug}.webp`;
    if (refs.has(own)) changes.push({ path: publicToRepo(own), delete: true });
  }

  return changes;
}

function uniqueSlug(base: string, existing: Entry[]): string {
  const taken = new Set(existing.map((e) => e.slug));
  const root = slugify(base);
  if (!taken.has(root)) return root;
  let i = 2;
  while (taken.has(`${root}-${i}`)) i++;
  return `${root}-${i}`;
}
