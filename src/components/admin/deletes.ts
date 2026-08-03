/** deletes.ts — pending deletions that are staged locally and published in bulk. */

import { clearDraft } from './drafts';

export interface PendingDelete {
  collection: 'portfolio' | 'blog' | 'offers';
  slug: string;
  title: string;
}

const KEY = 'jl-admin-deletes';

function notify() {
  if (typeof window !== 'undefined') window.dispatchEvent(new Event('jl-draft-change'));
}

export function readPendingDeletes(): PendingDelete[] {
  try {
    const s = localStorage.getItem(KEY);
    return s ? (JSON.parse(s) as PendingDelete[]) : [];
  } catch {
    return [];
  }
}

export function addPendingDelete(item: PendingDelete) {
  const list = readPendingDeletes().filter(
    (d) => !(d.collection === item.collection && d.slug === item.slug)
  );
  list.unshift(item);
  try {
    localStorage.setItem(KEY, JSON.stringify(list));
  } catch {}
  // A deletion makes any edit draft for the same item irrelevant.
  clearDraft(item.collection, item.slug);
  notify();
}

export function removePendingDelete(collection: string, slug: string) {
  const list = readPendingDeletes().filter(
    (d) => !(d.collection === collection && d.slug === slug)
  );
  try {
    localStorage.setItem(KEY, JSON.stringify(list));
  } catch {}
  notify();
}

export function clearPendingDeletes(items?: PendingDelete[]) {
  if (!items) {
    try { localStorage.removeItem(KEY); } catch {}
  } else {
    const set = new Set(items.map((d) => `${d.collection}:${d.slug}`));
    const list = readPendingDeletes().filter((d) => !set.has(`${d.collection}:${d.slug}`));
    try { localStorage.setItem(KEY, JSON.stringify(list)); } catch {}
  }
  notify();
}
