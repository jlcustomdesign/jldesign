/**
 * store.ts — Read content and apply changes, abstracting dev (filesystem) vs
 * production (GitHub-as-database).
 */
import fs from 'node:fs/promises';
import path from 'node:path';
import { IS_DEV, PATHS, type CollectionName } from './config';
import { parseEntry } from './content';
import { commitChanges, listDir, readFile, type FileChange, type GitHubUser } from './github';

const ROOT = process.cwd();

export interface Entry {
  slug: string;
  data: Record<string, any>;
  body: string;
}

async function readLocalDir(dir: string): Promise<{ name: string; raw: string }[]> {
  const abs = path.join(ROOT, dir);
  let names: string[];
  try {
    names = await fs.readdir(abs);
  } catch {
    return [];
  }
  const out: { name: string; raw: string }[] = [];
  for (const name of names) {
    if (name.startsWith('.')) continue;
    const raw = await fs.readFile(path.join(abs, name), 'utf-8').catch(() => null);
    if (raw != null) out.push({ name, raw });
  }
  return out;
}

async function readGithubDir(token: string, dir: string): Promise<{ name: string; raw: string }[]> {
  const names = await listDir(token, dir);
  const out: { name: string; raw: string }[] = [];
  for (const name of names) {
    if (name.startsWith('.')) continue;
    const raw = await readFile(token, `${dir}/${name}`);
    if (raw != null) out.push({ name, raw });
  }
  return out;
}

/** Read every entry of a collection. JSON collections (offers) parse the body as JSON. */
export async function readCollection(
  collection: CollectionName,
  token: string | null
): Promise<Entry[]> {
  const dir = PATHS[collection];
  const files = IS_DEV ? await readLocalDir(dir) : await readGithubDir(token!, dir);
  const entries: Entry[] = [];
  for (const { name, raw } of files) {
    const slug = name.replace(/\.(mdoc|md|json|yaml|yml)$/i, '');
    if (name.endsWith('.json')) {
      try {
        entries.push({ slug, data: JSON.parse(raw), body: '' });
      } catch {
        /* skip malformed */
      }
    } else {
      const { data, body } = parseEntry(raw);
      entries.push({ slug, data, body });
    }
  }
  entries.sort((a, b) => a.slug.localeCompare(b.slug));
  return entries;
}

/** Apply a set of file changes (dev → filesystem, prod → single GitHub commit). */
export async function applyChanges(
  changes: FileChange[],
  message: string,
  token: string | null,
  user: GitHubUser | null
): Promise<void> {
  if (!changes.length) return;

  if (IS_DEV) {
    for (const change of changes) {
      const abs = path.join(ROOT, change.path);
      if (change.delete) {
        await fs.rm(abs, { force: true });
      } else {
        await fs.mkdir(path.dirname(abs), { recursive: true });
        const data = Buffer.isBuffer(change.content) ? change.content : Buffer.from(change.content, 'utf-8');
        await fs.writeFile(abs, data);
      }
    }
    return;
  }

  await commitChanges(token!, changes, message, user);
}
