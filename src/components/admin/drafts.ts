/** drafts.ts — browser-local drafts for any admin collection. */

const PREFIX = 'jl-admin-draft:';

export const draftKey = (collection: string, slug?: string) => PREFIX + collection + ':' + (slug || 'new');

export function readDraft<T>(collection: string, slug?: string): T | null {
  try {
    const s = localStorage.getItem(draftKey(collection, slug));
    return s ? (JSON.parse(s) as T) : null;
  } catch {
    return null;
  }
}

function notifyDraftChange() {
  if (typeof window !== 'undefined') window.dispatchEvent(new Event('jl-draft-change'));
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
