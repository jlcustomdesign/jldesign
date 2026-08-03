/** drafts.ts — browser-local drafts for any admin collection.
 *
 * Existing (published) entries are keyed by slug. New, unsaved entries are
 * keyed by a temporary id so several of them can coexist before publishing. */

const PREFIX = 'jl-admin-draft:';

/** Key for an existing entry draft. */
export const draftKey = (collection: string, slug?: string) =>
  PREFIX + collection + ':' + (slug || 'new');

/** Key for a new (not-yet-published) entry draft. */
export const newDraftKey = (collection: string, tempId: string) =>
  PREFIX + collection + ':new:' + tempId;

function notifyDraftChange() {
  if (typeof window !== 'undefined') window.dispatchEvent(new Event('jl-draft-change'));
}

export function readDraft<T>(collection: string, slug?: string): T | null {
  try {
    const s = localStorage.getItem(draftKey(collection, slug));
    return s ? (JSON.parse(s) as T) : null;
  } catch {
    return null;
  }
}

export function writeDraft<T>(collection: string, slug: string | undefined, draft: T) {
  try {
    localStorage.setItem(draftKey(collection, slug), JSON.stringify(draft));
  } catch {}
  notifyDraftChange();
}

export function clearDraft(collection: string, slug?: string) {
  try {
    localStorage.removeItem(draftKey(collection, slug));
  } catch {}
  notifyDraftChange();
}

/** All new drafts for a collection. */
export function readNewDrafts<T>(collection: string): { tempId: string; draft: T }[] {
  const prefix = PREFIX + collection + ':new:';
  const out: { tempId: string; draft: T }[] = [];
  try {
    for (let i = 0; i < localStorage.length; i++) {
      const k = localStorage.key(i);
      if (!k?.startsWith(prefix)) continue;
      const raw = localStorage.getItem(k);
      if (!raw) continue;
      out.push({ tempId: k.slice(prefix.length), draft: JSON.parse(raw) as T });
    }
  } catch {}
  // Newest first (key order is roughly insertion order in most browsers).
  return out.reverse();
}

export function writeNewDraft<T>(collection: string, tempId: string, draft: T) {
  try {
    localStorage.setItem(newDraftKey(collection, tempId), JSON.stringify(draft));
  } catch {}
  notifyDraftChange();
}

export function clearNewDraft(collection: string, tempId: string) {
  try {
    localStorage.removeItem(newDraftKey(collection, tempId));
  } catch {}
  notifyDraftChange();
}
