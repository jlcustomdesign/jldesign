/** pending.ts — compute unpublished browser drafts across all admin sections. */
import type { AllData, Entry } from './api';
import { readDraft, draftKey } from './drafts';
import { readPendingDeletes, removePendingDelete } from './deletes';
import type { Offer } from '../offer/OfferDocument';

export type EditOffer = Offer & { slug?: string };

const SITE_DRAFT_KEY = 'jl-site-draft';

export type PendingItem =
  | { kind: 'offer-new'; collection: 'offers'; title: string; slug?: undefined; draft: EditOffer }
  | { kind: 'offer-edit'; collection: 'offers'; title: string; slug: string; draft: EditOffer }
  | { kind: 'offer-delete'; collection: 'offers'; title: string; slug: string; draft: null }
  | { kind: 'portfolio-new'; collection: 'portfolio'; title: string; slug?: undefined; draft: any }
  | { kind: 'portfolio-edit'; collection: 'portfolio'; title: string; slug: string; draft: any }
  | { kind: 'portfolio-delete'; collection: 'portfolio'; title: string; slug: string; draft: null }
  | { kind: 'blog-new'; collection: 'blog'; title: string; slug?: undefined; draft: any }
  | { kind: 'blog-edit'; collection: 'blog'; title: string; slug: string; draft: any }
  | { kind: 'blog-delete'; collection: 'blog'; title: string; slug: string; draft: null }
  | { kind: 'site'; collection: 'site'; title: string; slug?: undefined; draft: any };

export function readSiteDraft(): any | null {
  try { const s = localStorage.getItem(SITE_DRAFT_KEY); return s ? JSON.parse(s) : null; } catch { return null; }
}

function hasText(s: unknown) {
  return typeof s === 'string' && s.trim().length > 0;
}

function hasAnyText(obj: any): boolean {
  if (!obj || typeof obj !== 'object') return false;
  for (const v of Object.values(obj)) {
    if (typeof v === 'string' && v.trim()) return true;
    if (typeof v === 'number' && v !== 0) return true;
    if (Array.isArray(v) && v.length > 0) return true;
    if (v && typeof v === 'object' && hasAnyText(v)) return true;
  }
  return false;
}

/** A new offer is considered blank if it has no identifying text and no real content. */
export function isBlankNewOffer(o: EditOffer | null): boolean {
  if (!o) return true;
  if (hasText(o.clientName) || hasText(o.templateName) || hasText(o.coverImage) || hasText(o.coverSubtitle)) return false;
  if (Array.isArray(o.tags) && o.tags.length > 0) return false;
  if (!Array.isArray(o.pages) || o.pages.length === 0) return true;
  return !o.pages.some((p) => hasAnyText(p));
}

function offerFromEntry(e: Entry): EditOffer {
  const o = e.data as Offer;
  return { ...o, slug: e.slug } as EditOffer;
}

export function computePending(data: AllData | null, siteServer: any | null): PendingItem[] {
  const pending: PendingItem[] = [];
  if (!data) return pending;

  // Offers
  for (const e of data.offers) {
    const draft = readDraft<EditOffer>('offers', e.slug);
    if (!draft) continue;
    if (JSON.stringify(draft) !== JSON.stringify(offerFromEntry(e))) {
      pending.push({ kind: 'offer-edit', collection: 'offers', title: e.data.clientName || e.data.templateName || e.slug, slug: e.slug, draft });
    }
  }
  const newOffer = readDraft<EditOffer>('offers', undefined);
  if (newOffer && !isBlankNewOffer(newOffer)) {
    pending.push({ kind: 'offer-new', collection: 'offers', title: newOffer.clientName || newOffer.templateName || 'Ofertă nouă', draft: newOffer });
  }

  // Portfolio
  for (const e of data.portfolio) {
    const draft = readDraft<any>('portfolio', e.slug);
    if (!draft) continue;
    const server = { slug: e.slug, name: e.data.name || '', category: e.data.category || '', image: e.data.image || '', body: e.body || '' };
    if (JSON.stringify(draft) !== JSON.stringify(server)) {
      pending.push({ kind: 'portfolio-edit', collection: 'portfolio', title: draft.name || e.data.name || e.slug, slug: e.slug, draft });
    }
  }
  const newPortfolio = readDraft<any>('portfolio', undefined);
  if (newPortfolio && (newPortfolio.name || newPortfolio.image || newPortfolio.body)) {
    pending.push({ kind: 'portfolio-new', collection: 'portfolio', title: newPortfolio.name || 'Proiect nou', draft: newPortfolio });
  }

  // Blog
  for (const e of data.blog) {
    const draft = readDraft<any>('blog', e.slug);
    if (!draft) continue;
    const server = {
      slug: e.slug,
      title: e.data.title || '',
      description: e.data.description || '',
      category: e.data.category || 'inspiratie',
      author: e.data.author || 'JL Custom Design',
      publishedDate: String(e.data.publishedDate || '').slice(0, 10),
      coverImage: e.data.coverImage || '',
      coverImageAlt: e.data.coverImageAlt || '',
      body: e.body || '',
    };
    if (JSON.stringify(draft) !== JSON.stringify(server)) {
      pending.push({ kind: 'blog-edit', collection: 'blog', title: draft.title || e.data.title || e.slug, slug: e.slug, draft });
    }
  }
  const newBlog = readDraft<any>('blog', undefined);
  if (newBlog && (newBlog.title || newBlog.coverImage || newBlog.body)) {
    pending.push({ kind: 'blog-new', collection: 'blog', title: newBlog.title || 'Articol nou', draft: newBlog });
  }

  // Site content
  const siteDraft = readSiteDraft();
  if (siteDraft && JSON.stringify(siteDraft) !== JSON.stringify(siteServer)) {
    pending.push({ kind: 'site', collection: 'site', title: 'Conținut site', draft: siteDraft });
  }

  // Pending deletions (staged locally, published in bulk)
  const serverSlugs = {
    offers: new Set(data.offers.map((e) => e.slug)),
    portfolio: new Set(data.portfolio.map((e) => e.slug)),
    blog: new Set(data.blog.map((e) => e.slug)),
  };
  for (const d of readPendingDeletes()) {
    if (!serverSlugs[d.collection].has(d.slug)) {
      removePendingDelete(d.collection, d.slug);
      continue;
    }
    pending.push({ kind: `${d.collection}-delete` as PendingItem['kind'], collection: d.collection, title: d.title, slug: d.slug, draft: null });
  }

  return pending;
}

export function hasPending(data: AllData | null, siteServer: any | null): boolean {
  return computePending(data, siteServer).length > 0;
}

/** Clear the local drafts for a list of pending items. */
export function clearPendingDrafts(items: PendingItem[]) {
  for (const it of items) {
    try {
      if (it.collection === 'site') localStorage.removeItem(SITE_DRAFT_KEY);
      else localStorage.removeItem(draftKey(it.collection, it.slug));
    } catch {}
  }
  if (typeof window !== 'undefined') window.dispatchEvent(new Event('jl-draft-change'));
}
