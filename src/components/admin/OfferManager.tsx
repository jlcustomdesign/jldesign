import React, { useState, useMemo, useRef, useEffect } from 'react';
import type { Entry } from './api';
import { saveEntry } from './api';
import { TextInput, TextArea, ImageInput, SectionHead, TagInput } from './ui';
import OfferDocument, { normalizeOffer, uid, DEFAULT_LABEL, type Offer, type Section, type SectionType } from '../offer/OfferDocument';
import { fillCrop, GAL_MAX } from '../offer/galleryLayout';
import * as drafts from './drafts';
import { isBlankNewOffer } from './pending';
import { addPendingDelete } from './deletes';

/** Gallery advice: measures the current images' aspect ratios and tells the
   user whether another image (and which orientation) would pack well. The
   gallery always fills the whole area, so the advice is about CROP: adding
   an image whose orientation keeps the crop factor low. */
function GalleryAdvice({ urls }: { urls: string[] }) {
  const [ratios, setRatios] = useState<(number | null)[]>([]);
  const key = urls.join('|');
  useEffect(() => {
    let alive = true;
    setRatios(urls.map(() => null));
    urls.forEach((u, i) => {
      const im = new Image();
      im.onload = () => {
        if (!alive || !im.naturalWidth) return;
        const r = im.naturalWidth / im.naturalHeight;
        setRatios((cur) => { const n = cur.slice(); n[i] = r; return n; });
      };
      im.src = u;
    });
    return () => { alive = false; };
  }, [key]);
  if (urls.length === 0) return null;
  if (ratios.some((r) => r == null)) return <div className="of-cap-note">Se analizează aranjarea imaginilor…</div>;
  const rs = ratios as number[];
  if (fillCrop(rs) > 2.2) return <div className="of-cap-note">Atenție: aceste imagini se decupează mult pe o singură pagină — recomandat mai puține sau alte proporții.</div>;
  if (rs.length >= GAL_MAX) return <div className="of-cap-note">Maximum {GAL_MAX} imagini pe o pagină de galerie.</div>;
  const cropL = fillCrop([...rs, 1.5]);
  const cropP = fillCrop([...rs, 0.75]);
  if (Math.abs(cropL - cropP) < 0.15) return <div className="of-cap-note">Mai poți adăuga o imagine — orizontală sau verticală, ambele se aranjează bine.</div>;
  if (cropL < cropP) return <div className="of-cap-note">Mai poți adăuga o imagine — recomandat una orizontală (se decupează cel mai puțin).</div>;
  return <div className="of-cap-note">Mai poți adăuga o imagine — recomandat una verticală (se decupează cel mai puțin).</div>;
}
import { TEMPLATES } from './offerTemplates';
import { STYLE_LIST, getStyle, ACCENT_PRESETS } from '../offer/offerStyles';

interface Props {
  items: Entry[];
  notify: (msg: string, kind?: 'ok' | 'err') => void;
  reload: () => Promise<void>;
  onPublishAll?: () => Promise<void>;
  openTarget?: { collection: 'offers'; slug?: string; tempId?: string; isNew?: boolean } | null;
  onOpenHandled?: () => void;
}
type EditOffer = Offer & { slug?: string };

const fromEntry = (e: Entry): EditOffer => ({ ...normalizeOffer(e.data), slug: e.slug });

// Offer drafts live in the BROWSER (localStorage) so edits are instant and never
// lost. Publishing to the site (a GitHub commit) happens only on "Salvează".
// Existing entries are keyed by slug; new, unsaved entries are keyed by tempId
// so several of them can coexist before publishing.
const LEGACY_PREFIX = 'jl-offer-draft:';
const legacyKey = (slug?: string) => LEGACY_PREFIX + (slug || 'new');
const makeTempId = () => 'new_' + Math.random().toString(36).slice(2, 9) + '_' + Date.now().toString(36);

function readExistingDraft(slug?: string): EditOffer | null {
  const d = drafts.readDraft<EditOffer>('offers', slug);
  if (d) return d;
  try {
    const s = localStorage.getItem(legacyKey(slug));
    if (!s) return null;
    const parsed = JSON.parse(s) as EditOffer;
    drafts.writeDraft('offers', slug, parsed);
    try { localStorage.removeItem(legacyKey(slug)); } catch {}
    return parsed;
  } catch { return null; }
}
function writeOfferDraft(o: EditOffer, tempId?: string | null) {
  if (tempId) drafts.writeNewDraft('offers', tempId, o);
  else drafts.writeDraft('offers', o.slug, o);
  try { localStorage.removeItem(legacyKey(o.slug)); } catch {}
}
function clearOfferDraft(tempId?: string | null, slug?: string) {
  if (tempId) drafts.clearNewDraft('offers', tempId);
  else drafts.clearDraft('offers', slug);
  try { localStorage.removeItem(legacyKey(slug)); } catch {}
}
const countPages = (o: any): number => 1 + (Array.isArray(o?.pages) ? o.pages.length : ['description', 'materials', 'accessories', 'sketches'].filter((k) => o?.[k]?.enabled).length);

const PAGE_TYPES: { type: SectionType; name: string }[] = [
  { type: 'description', name: 'Descriere & specificații' },
  { type: 'materials', name: 'Materiale & finisaje' },
  { type: 'accessories', name: 'Accesorii & echipare' },
  { type: 'sketches', name: 'Schițe & dimensiuni' },
  { type: 'gallery', name: 'Galerie foto' },
  { type: 'text', name: 'Text / mesaj' },
];

const blankSection = (type: SectionType): Section => {
  const base = { id: uid(type), type, heading: '', paragraph: '' };
  switch (type) {
    case 'description': return { ...base, heading: 'Descriere proiect', image: '', specs: [
      { label: 'Specificație 1', value: '' },
      { label: 'Specificație 2', value: '' },
      { label: 'Specificație 3', value: '' }
    ] };
    case 'materials': return { ...base, heading: 'Materiale și finisaje', image: '', 
      swatches: [
        { label: 'Finisaj 1', code: '', image: '' },
        { label: 'Finisaj 2', code: '', image: '' },
        { label: 'Blat / Accent', code: '', image: '' }
      ], 
      finishes: [
        { label: 'Tip Finisaj', desc: '' },
        { label: 'Feronerie', desc: '' },
        { label: 'Alte detalii', desc: '' }
      ] 
    };
    case 'accessories': return { ...base, heading: 'Accesorii și echipare', 
      items: [
        { image: '', title: '', description: '' },
        { image: '', title: '', description: '' },
        { image: '', title: '', description: '' }
      ], 
      benefits: [
        { label: 'Avantaj 1', desc: '' },
        { label: 'Avantaj 2', desc: '' }
      ] 
    };
    case 'sketches': return { ...base, heading: 'Schițe de concept', 
      shots: [
        { image: '', caption: 'Vedere 1' },
        { image: '', caption: 'Vedere 2' }
      ], 
      dims: [
        { title: 'Dimensiuni generale', lines: 'L=... / H=... / A=...' },
        { title: 'Note tehnice', lines: '' }
      ] 
    };
    case 'gallery': return { ...base, heading: 'Galerie foto', 
      shots: [
        { image: '', caption: '' }, 
        { image: '', caption: '' },
        { image: '', caption: '' },
        { image: '', caption: '' }
      ] 
    };
    case 'text': return { ...base, heading: 'Titlu secțiune', image: '' };
  }
};

function scrollWithin(container: HTMLElement | null, el: Element | null) {
  if (!container || !el) return;
  const c = container.getBoundingClientRect();
  const e = el.getBoundingClientRect();
  const top = container.scrollTop + (e.top - c.top) - container.clientHeight / 2 + e.height / 2;
  container.scrollTo({ top: Math.max(0, top), behavior: 'smooth' });
}

export default function OfferManager({ items, notify, reload, onPublishAll, openTarget, onOpenHandled }: Props) {
  const [view, setViewRaw] = useState<'list' | 'pick_offer' | 'pick_template' | 'edit'>(() => {
    if (typeof window !== 'undefined') {
      const h = window.location.hash.replace('#', '');
      if (h === 'offers-edit') return 'edit';
      if (h === 'offers-pick_offer') return 'pick_offer';
    }
    return 'list';
  });

  const setView = (v: typeof view) => {
    setViewRaw(v);
    window.location.hash = v === 'list' ? 'offers' : `offers-${v}`;
  };

  useEffect(() => {
    const onHashChange = () => {
      const h = window.location.hash.replace('#', '');
      if (h === 'offers-edit') setViewRaw('edit');
      else if (h === 'offers-pick_offer') setViewRaw('pick_offer');
      else if (h === 'offers') setViewRaw('list');
    };
    window.addEventListener('hashchange', onHashChange);
    return () => window.removeEventListener('hashchange', onHashChange);
  }, []);

  const [offer, setOffer] = useState<EditOffer | null>(null);
  const [tempId, setTempId] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [pickIndex, setPickIndex] = useState(0);
  const [activeField, setActiveField] = useState<string | null>(null);
  const [closed, setClosed] = useState<Set<string>>(new Set());
  const [showPreview, setShowPreview] = useState(false);
  const [addOpen, setAddOpen] = useState(false);
  const [auto, setAuto] = useState<'' | 'saving' | 'saved'>('');

  const formRef = useRef<HTMLDivElement>(null);
  const previewRef = useRef<HTMLDivElement>(null);
  const pdfStageRef = useRef<HTMLDivElement>(null);
  const syncing = useRef(false);
  const offerRef = useRef<EditOffer | null>(null);
  const tempIdRef = useRef<string | null>(null);
  const lastSaved = useRef<string>('');
  const [pdfBusy, setPdfBusy] = useState(false);
  const [preview, setPreview] = useState(false);
  const [savePrompt, setSavePrompt] = useState(false);
  const [hiddenSlugs, setHiddenSlugs] = useState<Set<string>>(new Set());
  const hideSlug = (slug: string) => setHiddenSlugs((prev) => new Set(prev).add(slug));
  // Index of the page being edited (0 = cover) — the full preview jumps to it.
  const lastPage = useRef(0);
  const [overflowPages, setOverflowPages] = useState<number[]>([]);
  const [imgWarn, setImgWarn] = useState('');

  offerRef.current = offer;
  tempIdRef.current = tempId;

  const tplOffers = useMemo(() => TEMPLATES.map((t) => t.make()), []);
  const patch = (p: Partial<EditOffer>) => setOffer((o) => (o ? { ...o, ...p } : o));
  const setPages = (pages: Section[]) => patch({ pages });
  // Functional update: async callbacks (e.g. image orientation detection)
  // must always merge into the LATEST state, never a stale render closure —
  // otherwise they silently wipe the image the user just selected.
  const setPage = (idx: number, p: Partial<Section> | ((s: Section) => Partial<Section>)) =>
    setOffer((o) => (o ? { ...o, pages: o.pages.map((s, i) => (i === idx ? { ...s, ...(typeof p === 'function' ? (p as (s: Section) => Partial<Section>)(s) : p) } : s)) } : o));

  const isOpen = (id: string) => !closed.has(id);
  const toggleOpen = (id: string) => setClosed((prev) => { const n = new Set(prev); n.has(id) ? n.delete(id) : n.add(id); return n; });

  /* ---- form ⇄ preview sync ---- */
  const focusFromForm = (fid: string) => {
    setActiveField(fid);
    if (syncing.current) { syncing.current = false; return; }
    requestAnimationFrame(() => scrollWithin(previewRef.current, previewRef.current?.querySelector(`[data-fid="${fid}"]`) || null));
  };
  const focusFromPreview = (fid: string) => {
    const sec = fid.split(':')[0];
    setClosed((prev) => { if (!prev.has(sec)) return prev; const n = new Set(prev); n.delete(sec); return n; });
    setActiveField(fid);
    setShowPreview(false);
    requestAnimationFrame(() => requestAnimationFrame(() => {
      const wrap = formRef.current?.querySelector(`[id="f-${fid}"]`);
      if (wrap) {
        scrollWithin(formRef.current, wrap);
        const input = wrap.querySelector('input, textarea') as HTMLElement | null;
        if (input) { syncing.current = true; input.focus({ preventScroll: true }); }
      }
    }));
  };
  const onFormFocus = (e: React.FocusEvent | React.MouseEvent) => {
    const w = (e.target as HTMLElement).closest?.('[data-fid]');
    const fid = w?.getAttribute('data-fid');
    if (fid) { focusFromForm(fid); trackPage(fid); }
  };
  // Remember which page the user is working on so the preview can jump there.
  const trackPage = (fid: string) => {
    const sec = fid.split(':')[0];
    if (sec === 'cover') { lastPage.current = 0; return; }
    const idx = (offerRef.current?.pages || []).findIndex((p) => p.id === sec);
    if (idx >= 0) lastPage.current = idx + 1;
  };
  const openPreview = () => {
    setPreview(true);
    requestAnimationFrame(() => requestAnimationFrame(() => {
      const cont = document.querySelector('.ofr-preview-scroll');
      const pages = cont?.querySelectorAll('.offer-page');
      if (!cont || !pages || !pages.length) return;
      const el = pages[Math.min(lastPage.current, pages.length - 1)];
      if (el) scrollWithin(cont as HTMLElement, el);
    }));
  };

  /* ---- CRUD ---- */
  const useTemplate = (i: number) => {
    const src = tplOffers[i];
    const clone: EditOffer = typeof structuredClone === 'function' ? structuredClone(src) : JSON.parse(JSON.stringify(src));
    const id = makeTempId();
    setTempId(id);
    setOffer(clone); lastSaved.current = ''; setAuto('');
    setClosed(new Set()); setActiveField(null); setView('edit'); setShowPreview(false);
  };
  const edit = (e: Entry) => {
    setTempId(null);
    const server = fromEntry(e);
    const draft = readExistingDraft(e.slug);
    const restored = draft && JSON.stringify(draft) !== JSON.stringify(server);
    setOffer(draft || server); lastSaved.current = JSON.stringify(server); setAuto('');
    setClosed(new Set()); setActiveField(null); setShowPreview(false);
    // Set hash before state so a remount (if any) also lands on the editor.
    window.location.hash = 'offers-edit';
    setViewRaw('edit');
    if (restored) notify('Am restaurat modificările nesalvate din browser', 'ok');
  };
  const cancel = () => {
    const cur = offerRef.current;
    const tid = tempIdRef.current;
    if (!cur) { setOffer(null); setTempId(null); setView('list'); reload(); return; }
    const draft = tid
      ? drafts.readNewDrafts<EditOffer>('offers').find((x) => x.tempId === tid)?.draft || null
      : readExistingDraft(cur.slug);
    const curJson = JSON.stringify(cur);
    const dirty = curJson !== lastSaved.current && curJson !== JSON.stringify(draft);
    if (dirty && !window.confirm('Ai modificări nepublicate. Dacă închizi, rămân salvate în browser. Continui?')) return;
    setOffer(null); setTempId(null); setView('list'); reload();
  };

  // Publish to the site. If onPublishAll is provided, the current offer is
  // saved locally and all pending modifications are published in one batch.
  const save = async () => {
    if (!offer) return;
    if (offer.isTemplate && !(offer.templateName || '').trim()) return notify('Adaugă numele șablonului', 'err');
    if (!offer.isTemplate && !(offer.clientName || '').trim()) return notify('Adaugă numele clientului', 'err');
    const prevSlug = offer.slug;
    const prevTempId = tempId;
    const wasTemplate = offer.isTemplate;
    setBusy(true);
    try {
      if (onPublishAll) {
        // Include current offer in the global batch publish (single build).
        writeOfferDraft(offer, prevTempId);
        await onPublishAll();
        setOffer(null); setTempId(null); setView(wasTemplate ? 'pick_offer' : 'list');
      } else {
        const { slug } = await saveEntry({ collection: 'offers', slug: offer.slug, data: offer });
        await reload();
        const saved = { ...offer, slug };
        setOffer(saved); // keep editing, now with slug (enables PDF)
        setTempId(null);
        lastSaved.current = JSON.stringify(saved);
        if (prevTempId) clearOfferDraft(prevTempId, undefined);
        clearOfferDraft(undefined, prevSlug);
        clearOfferDraft(undefined, slug);
        notify('Ofertă publicată pe site', 'ok');
      }
    } catch (e) { notify((e as Error).message, 'err'); } finally { setBusy(false); }
  };

  const openSavePrompt = () => {
    if (!offer) return;
    if (offer.isTemplate && !(offer.templateName || '').trim()) return notify('Adaugă numele șablonului', 'err');
    if (!offer.isTemplate && !(offer.clientName || '').trim()) return notify('Adaugă numele clientului', 'err');
    setSavePrompt(true);
  };

  const saveLocal = () => {
    if (!offer) return;
    writeOfferDraft(offer, tempId);
    setAuto('saved');
    setSavePrompt(false);
    notify('Salvat în browser', 'ok');
    setOffer(null); setTempId(null);
    setView(offer.isTemplate ? 'pick_offer' : 'list');
    reload();
  };

  // Publish every offer that has a local draft different from the server copy.
  const publishAll = async () => {
    if (!window.confirm('Vrei să publici toate ofertele cu modificări nesalvate?')) return;
    setBusy(true);
    let count = 0;
    try {
      for (const e of items) {
        const draft = readExistingDraft(e.slug);
        if (!draft) continue;
        const server = fromEntry(e);
        if (JSON.stringify(draft) === JSON.stringify(server)) continue;
        const { slug } = await saveEntry({ collection: 'offers', slug: e.slug, data: draft });
        clearOfferDraft(undefined, e.slug); clearOfferDraft(undefined, slug);
        count++;
      }
      for (const { tempId: tid, draft } of drafts.readNewDrafts<EditOffer>('offers')) {
        if (isBlankNewOffer(draft)) continue;
        const { slug } = await saveEntry({ collection: 'offers', slug: undefined, data: draft });
        clearOfferDraft(tid, undefined); clearOfferDraft(undefined, slug);
        count++;
      }
      await reload();
      notify(count ? `${count} ofertă/oferte publicate` : 'Nu sunt modificări de publicat', 'ok');
    } catch (e) { notify((e as Error).message, 'err'); } finally { setBusy(false); }
  };

  // Build the PDF in the browser from the CURRENT edits (a hidden full-size copy
  // of the document) — instant, no save/redeploy needed, never touches the host.
  const buildPdf = async () => {
    const stage = pdfStageRef.current;
    if (!stage) return null;
    const [{ jsPDF }, { toJpeg }] = await Promise.all([import('jspdf'), import('html-to-image')]);
    // Wait for images and let the auto-fit pass settle before rasterizing.
    const imgs = Array.from(stage.querySelectorAll('img')) as HTMLImageElement[];
    await Promise.all(imgs.map((i) => (i.complete ? Promise.resolve() : new Promise((r) => { i.onload = i.onerror = () => r(null); }))));
    await new Promise((r) => setTimeout(r, 350));
    const pages = Array.from(stage.querySelectorAll('.offer-page')) as HTMLElement[];
    const pdf = new jsPDF({ orientation: 'landscape', unit: 'mm', format: 'a4', compress: true });
    for (let i = 0; i < pages.length; i++) {
      const el = pages[i];
      const dataUrl = await toJpeg(el, { quality: 0.9, pixelRatio: 2, cacheBust: true, width: el.offsetWidth, height: el.offsetHeight, backgroundColor: '#ffffff' });
      if (i > 0) pdf.addPage('a4', 'landscape');
      pdf.addImage(dataUrl, 'JPEG', 0, 0, 297, 210);
    }
    return pdf;
  };
  const pdfName = () => ((offer?.clientName || 'Oferta').trim().replace(/[^a-z0-9]+/gi, '-').replace(/^-+|-+$/g, '') || 'Oferta');

  const downloadPdf = async () => {
    if (!offer) return;
    setPdfBusy(true);
    try { const pdf = await buildPdf(); pdf?.save(pdfName() + '.pdf'); }
    catch (e) { notify('Eroare la generarea PDF: ' + (e as Error).message, 'err'); }
    finally { setPdfBusy(false); }
  };

  // Autosave to the BROWSER on every change — instant, offline, no commits.
  useEffect(() => {
    if (view !== 'edit' || !offer) return;
    if (JSON.stringify(offer) === lastSaved.current) return;
    const t = setTimeout(() => {
      const o = offerRef.current;
      const tid = tempIdRef.current;
      if (!o) return;
      writeOfferDraft(o, tid);
      setAuto('saved');
      setTimeout(() => setAuto((a) => (a === 'saved' ? '' : a)), 1200);
    }, 400);
    return () => clearTimeout(t);
  }, [offer, view]);

  const remove = async (e: Entry) => {
    const title = e.data.clientName || e.data.templateName || e.slug;
    const kind = e.data.isTemplate ? 'șablonul' : 'oferta';
    if (!window.confirm(`Ștergi ${kind} „${title}"?`)) return;
    hideSlug(e.slug);
    addPendingDelete({ collection: 'offers', slug: e.slug, title });
    notify('Ștergere adăugată în coșul de publicare', 'ok');
  };

  const openDraft = (tid: string) => {
    const d = drafts.readNewDrafts<EditOffer>('offers').find((x) => x.tempId === tid)?.draft;
    if (!d) return;
    setTempId(tid);
    setOffer(d); lastSaved.current = ''; setAuto('');
    setClosed(new Set()); setActiveField(null); setView('edit'); setShowPreview(false);
  };

  const removeDraft = (tid: string) => {
    if (!window.confirm('Ștergi oferta/șablonul nou nesalvat?')) return;
    drafts.clearNewDraft('offers', tid);
    notify('Draft șters', 'ok');
  };

  const duplicateDraft = (tid: string) => {
    const d = drafts.readNewDrafts<EditOffer>('offers').find((x) => x.tempId === tid)?.draft;
    if (!d) return;
    const clone: EditOffer = typeof structuredClone === 'function' ? structuredClone(d) : JSON.parse(JSON.stringify(d));
    const id = makeTempId();
    if (clone.isTemplate) clone.templateName = `${clone.templateName || 'Șablon'} (copie)`;
    else clone.clientName = `${clone.clientName || 'Ofertă'} (copie)`;
    setTempId(id);
    setOffer(clone); lastSaved.current = ''; setAuto('');
    setClosed(new Set()); setActiveField(null); setView('edit'); setShowPreview(false);
    notify('Copie creată — apasă „Salvează” pentru a o publica', 'ok');
  };

  // Copy an offer/template exactly — start a new one from the same content.
  const duplicate = (e: Entry) => {
    const src = fromEntry(e);
    const clone: EditOffer = typeof structuredClone === 'function' ? structuredClone(src) : JSON.parse(JSON.stringify(src));
    delete clone.slug;
    if (clone.isTemplate) clone.templateName = `${clone.templateName || 'Șablon'} (copie)`;
    else clone.clientName = `${clone.clientName || 'Ofertă'} (copie)`;
    const id = makeTempId();
    setTempId(id);
    setOffer(clone); lastSaved.current = ''; setAuto('');
    setClosed(new Set()); setActiveField(null); setView('edit'); setShowPreview(false);
    notify('Copie creată — apasă „Salvează” pentru a o publica', 'ok');
  };

  // Convert the template currently being edited into a new offer draft.
  const createOfferFromTemplate = () => {
    if (!offer || !offer.isTemplate) return;
    const clone: EditOffer = typeof structuredClone === 'function' ? structuredClone(offer) : JSON.parse(JSON.stringify(offer));
    delete clone.slug;
    clone.isTemplate = false;
    clone.clientName = '';
    const id = makeTempId();
    setTempId(id);
    setOffer(clone); lastSaved.current = ''; setAuto('');
    setClosed(new Set()); setActiveField(null); setView('edit'); setShowPreview(false);
    notify('Ofertă nouă creată din șablon — adaugă numele clientului', 'ok');
  };

  // Detect pages whose content still overflows even after auto-fit, and warn.
  useEffect(() => {
    if (view !== 'edit' || !offer) return;
    const t = setTimeout(() => {
      const pages = Array.from(previewRef.current?.querySelectorAll('.offer-page') || []);
      const bad = pages.map((p, i) => (p.querySelector('[data-over="true"]') ? i + 1 : 0)).filter(Boolean);
      setOverflowPages(bad);
    }, 450);
    return () => clearTimeout(t);
  }, [offer, view]);

  // Open a specific pending item requested from the global pending bar.
  useEffect(() => {
    if (!openTarget || offer) return;
    if (openTarget.tempId) {
      const d = drafts.readNewDrafts<EditOffer>('offers').find((x) => x.tempId === openTarget.tempId)?.draft;
      if (d) {
        setTempId(openTarget.tempId);
        setOffer(d); lastSaved.current = ''; setAuto('');
        setClosed(new Set()); setActiveField(null); setView('edit'); setShowPreview(false);
        onOpenHandled?.();
      }
    } else if (openTarget.slug) {
      const e = items.find((x) => x.slug === openTarget.slug);
      if (e) {
        const server = fromEntry(e);
        const draft = readExistingDraft(e.slug);
        const restored = draft && JSON.stringify(draft) !== JSON.stringify(server);
        setOffer(draft || server); lastSaved.current = JSON.stringify(server); setAuto('');
        setTempId(null); setClosed(new Set()); setActiveField(null); setView('edit'); setShowPreview(false);
        if (restored) notify('Am restaurat modificările nesalvate din browser', 'ok');
        onOpenHandled?.();
      }
    } else if (openTarget.isNew) {
      const id = makeTempId();
      setTempId(id);
      setOffer({ clientName: '', date: '', pages: [blankSection('description')] });
      lastSaved.current = ''; setAuto('');
      setClosed(new Set()); setActiveField(null); setView('edit'); setShowPreview(false);
      onOpenHandled?.();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [openTarget]);

  // Warn before closing the tab only if the current edits are neither
  // published (lastSaved) nor saved locally in the browser draft.
  useEffect(() => {
    const handler = (e: BeforeUnloadEvent) => {
      const cur = offerRef.current;
      const tid = tempIdRef.current;
      if (!cur) return;
      const draft = tid
        ? drafts.readNewDrafts<EditOffer>('offers').find((x) => x.tempId === tid)?.draft || null
        : readExistingDraft(cur.slug);
      const curJson = JSON.stringify(cur);
      if (curJson === lastSaved.current || curJson === JSON.stringify(draft)) return;
      e.preventDefault();
      e.returnValue = '';
    };
    window.addEventListener('beforeunload', handler);
    return () => window.removeEventListener('beforeunload', handler);
  }, []);

  /* ---- page ops ---- */
  const addPage = (type: SectionType) => { if (!offer) return; setPages([...offer.pages, blankSection(type)]); setAddOpen(false); };
  const delPage = (idx: number) => { if (!offer) return; if (!window.confirm('Ștergi această pagină?')) return; setPages(offer.pages.filter((_, i) => i !== idx)); };
  const movePage = (idx: number, dir: -1 | 1) => {
    if (!offer) return; const j = idx + dir; if (j < 0 || j >= offer.pages.length) return;
    const next = offer.pages.slice(); [next[idx], next[j]] = [next[j], next[idx]]; setPages(next);
  };

  /* ---- field wrappers (carry data-fid + id for sync) ---- */
  const sf = (fid: string, label: React.ReactNode, children: React.ReactNode) => (
    <div className="sf" data-fid={fid} id={`f-${fid}`} data-active={activeField === fid ? 'true' : undefined}>
      <label>{label}<span className="sf-jump">în previzualizare</span></label>
      {children}
    </div>
  );
  const row = (fid: string, tag: string, onDel: () => void, body: React.ReactNode, media = false) => (
    <div className={`ro${media ? ' media' : ''}`} data-fid={fid} id={`f-${fid}`} data-active={activeField === fid ? 'true' : undefined} key={fid}>
      <div className="ro-head"><span className="ro-tag">{tag}</span><button type="button" className="ro-del" title="Elimină" onClick={onDel}>✕</button></div>
      <div className="ro-body">{body}</div>
    </div>
  );

  /* ===================== RENDER ===================== */
  if (view === 'pick_offer') {
    const userTemplates = items.filter(e => e.data.isTemplate && !hiddenSlugs.has(e.slug));
    const newTemplates = drafts.readNewDrafts<EditOffer>('offers').filter(({ draft: d }) => d.isTemplate);
    return (
      <div>
        <SectionHead title="Crează ofertă" desc="Alege unul din șabloanele salvate anterior pentru a începe o ofertă nouă."
          action={<button className="adm-btn ghost" onClick={() => setView('list')}>← Înapoi</button>} />
        <div className="adm-grid tpl-grid">
          <div className="tpl-card">
             <div className="tpl-card-doc" style={{ cursor: 'pointer' }} onClick={() => {
                const id = makeTempId();
                setTempId(id);
                setOffer({ clientName: '', date: '', pages: [blankSection('description')] });
                lastSaved.current = ''; setAuto('');
                setClosed(new Set()); setActiveField(null); setView('edit'); setShowPreview(false);
             }}>
                <div style={{
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center', 
                  background: 'var(--surface-2, #f5f5f5)',
                  border: '2px dashed var(--border, #ccc)',
                  borderRadius: '6px',
                  aspectRatio: '297 / 210',
                  width: '100%',
                  boxSizing: 'border-box'
                }}>
                  <span style={{fontSize: 64, color: 'var(--text-muted, #999)', fontWeight: 300}}>+</span>
                </div>
             </div>
             <div className="tpl-card-meta">
               <span className="nm">Ofertă goală</span>
               <span className="ds">Începe de la zero cu o ofertă complet nouă.</span>
               <div style={{ marginTop: 12 }}>
                 <button className="adm-btn gold sm" onClick={() => {
                   const id = makeTempId();
                   setTempId(id);
                   setOffer({ clientName: '', date: '', pages: [blankSection('description')] });
                   lastSaved.current = ''; setAuto('');
                   setClosed(new Set()); setActiveField(null); setView('edit'); setShowPreview(false);
                 }}>Creează →</button>
               </div>
             </div>
          </div>
          {newTemplates.map(({ tempId: tid, draft: d }) => (
            <div key={`new-${tid}`} className="tpl-card">
              <div className="tpl-card-doc" style={{ cursor: 'pointer' }} onClick={() => openDraft(tid)}>
                <OfferDocument offer={d} coverOnly />
              </div>
              <div className="tpl-card-meta">
                <span className="nm">{d.templateName || 'Șablon nou'}</span>
                <span className="ds" style={{ color: 'var(--warning, #e6a817)' }}>Nepublicat încă · draft</span>
                <span className="ds">{d.templateDescription || `${countPages(d)} pagini`}</span>
                <div style={{ display: 'flex', gap: 8, marginTop: 12, flexWrap: 'wrap' }}>
                  <button className="adm-btn ghost sm" onClick={(ev) => { ev.stopPropagation(); openDraft(tid); }} title="Editează șablonul">Editează</button>
                  <button className="adm-btn ghost sm" onClick={(ev) => { ev.stopPropagation(); duplicateDraft(tid); }} title="Creează o copie a șablonului">Duplică</button>
                  <div className="adm-spacer" style={{ flexGrow: 1 }} />
                  <button className="adm-btn gold sm" onClick={(ev) => { ev.stopPropagation(); const clone = typeof structuredClone === 'function' ? structuredClone(d) : JSON.parse(JSON.stringify(d)); delete clone.slug; clone.isTemplate = false; clone.clientName = ''; const id = makeTempId(); setTempId(id); setOffer(clone); lastSaved.current = ''; setAuto(''); setClosed(new Set()); setActiveField(null); setView('edit'); setShowPreview(false); }} title="Creează o ofertă nouă pornind de la acest șablon">Folosește →</button>
                  <button className="adm-btn danger sm" onClick={(ev) => { ev.stopPropagation(); removeDraft(tid); }} title="Șterge draftul local">Șterge</button>
                </div>
              </div>
            </div>
          ))}
          {userTemplates.map((e) => {
            const local = readExistingDraft(e.slug);
            const display = local || e.data;
            const displayOffer = local || fromEntry(e);
            const hasDraft = !!local;
            return (
              <div key={e.slug} className="tpl-card">
                <div className="tpl-card-doc" style={{ cursor: 'pointer' }} onClick={() => {
                  const src = displayOffer;
                  const clone = typeof structuredClone === 'function' ? structuredClone(src) : JSON.parse(JSON.stringify(src));
                  delete clone.slug;
                  clone.isTemplate = false;
                  clone.clientName = '';
                  const id = makeTempId();
                  setTempId(id);
                  setOffer(clone); lastSaved.current = ''; setAuto('');
                  setClosed(new Set()); setActiveField(null); setView('edit'); setShowPreview(false);
                }}><OfferDocument offer={displayOffer} coverOnly /></div>
                <div className="tpl-card-meta">
                  <span className="nm">{display.templateName || display.clientName || 'Șablon'}</span>
                  <span className="ds">{hasDraft ? 'Modificat · ' : ''}{display.templateDescription || `${countPages(display)} pagini`}</span>
                  <div style={{ display: 'flex', gap: 8, marginTop: 12, flexWrap: 'wrap' }}>
                    <button className="adm-btn ghost sm" onClick={(ev) => { ev.stopPropagation(); edit(e); }} title="Editează șablonul">Editează</button>
                    <button className="adm-btn ghost sm" onClick={(ev) => { ev.stopPropagation(); duplicate(e); }} title="Creează o copie identică a șablonului">Duplică</button>
                    <button className="adm-btn danger sm" onClick={(ev) => { ev.stopPropagation(); remove(e); }} title="Șterge șablonul definitiv">Șterge</button>
                    <div className="adm-spacer" style={{ flexGrow: 1 }} />
                    <button className="adm-btn gold sm" onClick={() => {
                      const src = displayOffer;
                      const clone = typeof structuredClone === 'function' ? structuredClone(src) : JSON.parse(JSON.stringify(src));
                      delete clone.slug;
                      clone.isTemplate = false;
                      clone.clientName = '';
                      const id = makeTempId();
                      setTempId(id);
                      setOffer(clone); lastSaved.current = ''; setAuto('');
                      setClosed(new Set()); setActiveField(null); setView('edit'); setShowPreview(false);
                    }} title="Creează o ofertă nouă pornind de la acest șablon">Folosește →</button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  }



  if (view === 'edit' && offer) {
    const o = offer;
    const dirty = JSON.stringify(o) !== lastSaved.current;
    return (
      <div className="adm-editor-fit">
        <div className="adm-editor-head" style={{ marginBottom: 14, padding: '2px 0 10px', borderBottom: '1px solid var(--line)' }}>
          <h3 style={{ margin: 0, display: 'flex', alignItems: 'center', gap: 10 }}>
            {o.slug ? 'Editează oferta' : (o.isTemplate ? 'Editează șablonul' : 'Ofertă nouă')}
            {o.isTemplate && !o.slug && <span className="badge" style={{ background: 'var(--warning, #e6a817)', color: '#111' }}>Draft</span>}
          </h3>
          <span className={`auto-ind${dirty ? '' : ' ok'}`}>
            {auto === 'saved' ? '✓ Salvat în browser' : dirty ? 'Nepublicat — apasă „Salvează" pentru a publica' : (o.slug ? '✓ Publicat pe site' : 'Ofertă nouă')}
          </span>
          <div className="adm-spacer" />
          {o.isTemplate && (
            <button className="adm-btn gold" onClick={createOfferFromTemplate} disabled={busy} title="Creează o ofertă nouă pornind de la acest șablon" style={{ marginRight: 8 }}>
              Folosește pentru ofertă
            </button>
          )}
          <button className="adm-btn ghost" onClick={openPreview} title="Vezi cum arată oferta cu modificările curente">Previzualizează</button>
          <button className="adm-btn ghost" onClick={downloadPdf} disabled={pdfBusy} title="Descarcă PDF cu modificările curente" style={{ marginLeft: 8 }}>{pdfBusy ? 'Se generează…' : '⬇ PDF'}</button>
          <button className="adm-btn ghost" onClick={cancel} disabled={busy} title="Închide editorul și întoarce-te la listă" style={{ marginLeft: 8 }}>Închide</button>
          <button className="adm-btn gold" onClick={openSavePrompt} disabled={busy || !dirty} title={dirty ? 'Alege: salvează local în browser sau publică pe site' : 'Toate modificările sunt publicate'} style={{ marginLeft: 8 }}>{dirty ? 'Salvează' : 'Salvat'}</button>
        </div>

        {overflowPages.length > 0 && (
          <div className="of-overflow">Atenție: {overflowPages.length === 1 ? `pagina ${overflowPages[0]}` : `paginile ${overflowPages.join(', ')}`} are prea mult conținut — textul a fost micșorat la maxim și tot nu încape. Scurtați textul sau eliminați elemente.</div>
        )}

        <div className="ofb-mobile-switch" role="group">
          <button aria-pressed={!showPreview} onClick={() => setShowPreview(false)}>Editează</button>
          <button aria-pressed={showPreview} onClick={() => setShowPreview(true)}>Previzualizare</button>
        </div>

        <div className={`ofb${showPreview ? ' show-preview' : ''}`}>
          {/* ---------------- FORM ---------------- */}
          <div className="ofb-form-col" ref={formRef} onFocusCapture={onFormFocus} onClickCapture={onFormFocus}>
            {/* Cover */}
            <div className="pg-card">
              <div className="pg-card-head">
                <button type="button" className="pg-card-toggle" onClick={() => toggleOpen('cover')}>
                  <span className="pg-num pg-num-cover">00</span><span className="pg-title">Copertă & client <span className="chev">{isOpen('cover') ? '▾' : '▸'}</span></span>
                </button>
              </div>
              {isOpen('cover') && (
                <div className="pg-card-body">
                  {o.isTemplate ? (
                    <div className="adm-row">
                      {sf('cover:templateName', 'Nume șablon', <TextInput value={o.templateName || ''} onChange={(e) => patch({ templateName: e.target.value })} placeholder="ex: Ofertă Bucătării Premium" />)}
                      {sf('cover:category', 'Categorie', <TextInput value={o.category || ''} onChange={(e) => patch({ category: e.target.value })} placeholder="ex: Bucătărie" />)}
                    </div>
                  ) : (
                    <>
                      {sf('cover:clientName', 'Nume client', <TextInput value={o.clientName} onChange={(e) => patch({ clientName: e.target.value })} placeholder="Familia Popescu" />)}
                      {sf('cover:category', 'Categorie', <TextInput value={o.category || ''} onChange={(e) => patch({ category: e.target.value })} placeholder="ex: Bucătărie" />)}
                    </>
                  )}
                  {sf('cover:tags', 'Etichete (opțional, mai multe)', <TagInput tags={o.tags || []} onChange={(tags) => patch({ tags })} />)}
                  {!o.isTemplate && (
                    <div className="adm-row">
                      {sf('cover:date', 'Dată afișată', <TextInput value={o.date} onChange={(e) => patch({ date: e.target.value })} placeholder="Iunie 2026" />)}
                      {sf('cover:coverSubtitle', 'Text mare copertă', <TextInput value={o.coverSubtitle} onChange={(e) => patch({ coverSubtitle: e.target.value })} />)}
                    </div>
                  )}
                  {o.isTemplate && sf('cover:coverSubtitle', 'Text mare copertă', <TextInput value={o.coverSubtitle} onChange={(e) => patch({ coverSubtitle: e.target.value })} />)}
                  {sf('cover:coverImage', 'Imagine copertă', <ImageInput value={o.coverImage} focus={o.coverImageFocus} onFocusChange={(v) => patch({ coverImageFocus: v })} onChange={(v) => patch({ coverImage: v })} onMeta={(m) => patch({ coverImageOrient: m.orient })} />)}
                  {sf('cover:logoImage', 'Logo (opțional — implicit cel JL)', <ImageInput value={o.logoImage || ''} onChange={(v) => patch({ logoImage: v || undefined })} />)}
                  <div className="sf"><label>Încadrare imagine copertă</label>
                    <div className="seg">
                      {([['auto', 'Auto'], ['cover', 'Umplere'], ['contain', 'Imagine întreagă']] as const).map(([v, l]) => (
                        <button key={v} type="button" className={`seg-btn${(o.coverFit || 'auto') === v ? ' on' : ''}`} onClick={() => patch({ coverFit: v as Offer['coverFit'] })}>{l}</button>
                      ))}
                    </div>
                  </div>
                  {o.coverImageOrient === 'landscape' && !o.coverLayout && (
                    <div className="of-hint">Imaginea de copertă este orizontală — am aplicat automat compoziția „Imagine lată sus”, care o afișează pe toată lățimea paginii.</div>
                  )}
                  <div className="sf"><label>Stil document</label>
                    <div className="theme-row">
                      {STYLE_LIST.map((st) => {
                        const bg = st.mode === 'dark' ? '#15120e' : '#efeadf';
                        return (
                          <button key={st.id} type="button" className={`theme-chip${(o.style || 'editorial') === st.id ? ' on' : ''}`} title={st.blurb} onClick={() => patch({ style: st.id })}>
                            <div className="sw" style={{ background: `linear-gradient(135deg, ${bg} 56%, ${st.accent} 56%)` }} />
                            <div className="tn">{st.name}</div>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                  <div className="sf"><label>Culoare accent</label>
                    <div className="accent-row">
                      {ACCENT_PRESETS.map((c) => (
                        <button key={c} type="button" className={`accent-sw${(o.accent || getStyle(o.style).accent) === c ? ' on' : ''}`} style={{ background: c }} onClick={() => patch({ accent: c })} />
                      ))}
                      <input type="color" className="accent-input" value={o.accent || getStyle(o.style).accent} onChange={(e) => patch({ accent: e.target.value })} title="Alege o culoare" />
                      {o.accent && <button type="button" className="adm-btn ghost sm" onClick={() => patch({ accent: undefined })}>Resetează</button>}
                    </div>
                  </div>
                  <div className="sf"><label>Compoziție copertă</label>
                    <div className="seg">
                      {([['full', 'Imagine lată sus'], ['right', 'Imagine dreapta'], ['left', 'Imagine stânga']] as const).map(([v, l]) => {
                        const cur = o.coverLayout || (o.coverImageOrient === 'landscape' ? 'full' : getStyle(o.style).layout);
                        return <button key={v} type="button" className={`seg-btn${cur === v ? ' on' : ''}`} onClick={() => patch({ coverLayout: v })}>{l}</button>;
                      })}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Pages */}
            {o.pages.map((s, idx) => (
              <div className="pg-card" key={s.id}>
                <div className="pg-card-head">
                  <button type="button" className="pg-card-toggle" onClick={() => toggleOpen(s.id)}>
                    <span className="pg-num">{idx + 1}</span>
                    <span className="pg-title">{s.label || DEFAULT_LABEL[s.type]} <span className="chev">{isOpen(s.id) ? '▾' : '▸'}</span></span>
                  </button>
                  <div className="pg-tools" onClick={(e) => e.stopPropagation()}>
                    <button type="button" className="pg-tool" title="Micșorează textul paginii" onClick={() => setPage(idx, { fontScale: Math.max(0.8, Math.round(((s.fontScale ?? 1) - 0.1) * 100) / 100) })}>A−</button>
                    <span className="pg-fs">{Math.round((s.fontScale ?? 1) * 100)}%</span>
                    <button type="button" className="pg-tool" title="Mărește textul paginii" onClick={() => setPage(idx, { fontScale: Math.min(1.3, Math.round(((s.fontScale ?? 1) + 0.1) * 100) / 100) })}>A+</button>
                    <button type="button" className={`pg-tool${s.headingBold ? ' on' : ''}`} title="Titlu îngroșat" onClick={() => setPage(idx, { headingBold: !s.headingBold })}><b>B</b></button>
                    <button type="button" className="pg-tool" title="Mută mai sus" disabled={idx === 0} onClick={() => movePage(idx, -1)}>↑</button>
                    <button type="button" className="pg-tool" title="Mută mai jos" disabled={idx >= (offer?.pages.length ?? 1) - 1} onClick={() => movePage(idx, 1)}>↓</button>
                    <button type="button" className="pg-tool danger" title="Șterge pagina" onClick={() => delPage(idx)}>✕</button>
                  </div>
                </div>
                {isOpen(s.id) && <div className="pg-card-body">{renderPageFields(s, idx)}</div>}
              </div>
            ))}

            {/* Add page */}
            <div className="addpage">
              {!addOpen ? (
                <button type="button" className="ro-add" onClick={() => setAddOpen(true)}>＋ Adaugă pagină</button>
              ) : (
                <div className="addpage-grid">
                  {PAGE_TYPES.map((p) => (
                    <button key={p.type} type="button" className="addpage-opt" onClick={() => addPage(p.type)}>{p.name}</button>
                  ))}
                  <button type="button" className="addpage-opt" style={{ gridColumn: '1 / -1', justifyContent: 'center', color: 'var(--muted)' }} onClick={() => setAddOpen(false)}>Anulează</button>
                </div>
              )}
            </div>
          </div>

          {/* ---------------- PREVIEW ---------------- */}
          <div className="ofb-preview-col">
            <div className="ofb-preview-tip">Previzualizare live — apasă pe orice element pentru a-l edita</div>
            <div className="ofb-preview" ref={previewRef}>
              <OfferDocument offer={o} editable activeField={activeField} onFieldClick={focusFromPreview} />
            </div>
          </div>
        </div>
        {/* Hidden full-size copy, used to render a crisp PDF of the CURRENT edits */}
        <div className="pdf-stage" aria-hidden="true" ref={pdfStageRef}>
          <OfferDocument offer={o} />
        </div>

        {/* Full-screen preview of the CURRENT edits (same as the PDF) — no popup. */}
        {preview && (
          <div className="ofr-preview" onClick={() => setPreview(false)}>
            <div className="ofr-preview-bar" onClick={(e) => e.stopPropagation()}>
              <span className="ofr-preview-tag">Previzualizare — modificările curente (nepublicate)</span>
              <div className="adm-spacer" />
              <button className="adm-btn ghost sm" onClick={downloadPdf} disabled={pdfBusy}>{pdfBusy ? 'Se generează…' : '⬇ Descarcă PDF'}</button>
              <button className="adm-btn gold sm" onClick={() => setPreview(false)} style={{ marginLeft: 8 }}>Închide</button>
            </div>
            <div className="ofr-preview-scroll" onClick={(e) => e.stopPropagation()}>
              <OfferDocument offer={o} />
            </div>
          </div>
        )}

        {/* Save choice: publish now or keep as local browser draft. */}
        {savePrompt && (
          <div className="adm-dialog" onClick={() => setSavePrompt(false)}>
            <div className="adm-dialog-box" onClick={(e) => e.stopPropagation()}>
              <h4>Publici modificările acum?</h4>
              <p>Modificările sunt deja salvate în browser. Poți să le publici pe site acum sau să le păstrezi locale și să publici mai târziu.</p>
              <div className="adm-dialog-actions">
                <button className="adm-btn ghost" onClick={() => setSavePrompt(false)}>Anulează</button>
                <button className="adm-btn" onClick={saveLocal}>Salvează local și închide</button>
                <button className="adm-btn gold" onClick={() => { setSavePrompt(false); save(); }}>Publică pe site</button>
              </div>
            </div>
          </div>
        )}
      </div>
    );

    /* ---- per-type field editors ---- */
    function renderPageFields(s: Section, idx: number) {
      const upd = (p: Partial<Section>) => setPage(idx, p);
      const arr = <T,>(key: keyof Section) => (s[key] as T[]) || [];
      // All array edits go through the functional setPage so async updates
      // (onMeta) can never resurrect a stale copy of the rows.
      const setArr = (key: keyof Section, next: (cur: any[]) => any[]) => setPage(idx, (s) => ({ [key]: next(((s as any)[key] as any[]) || []) } as Partial<Section>));
      const updRow = (key: keyof Section, i: number, p: any) => setArr(key, (cur) => cur.map((x, j) => (j === i ? { ...x, ...p } : x)));
      const addRowAt = (key: keyof Section, blank: any) => setArr(key, (cur) => [...cur, blank]);
      const delRowAt = (key: keyof Section, i: number) => setArr(key, (cur) => cur.filter((_, j) => j !== i));

      const headingPara = (
        <>
          {sf(`${s.id}:heading`, 'Titlu secțiune', <TextInput value={s.heading} onChange={(e) => upd({ heading: e.target.value })} />)}
          {sf(`${s.id}:paragraph`, s.type === 'text' ? 'Text (un paragraf pe rând; liniile care încep cu „- " devin listă pe toată lățimea)' : 'Paragraf', <TextArea value={s.paragraph} onChange={(e) => upd({ paragraph: e.target.value })} style={{ minHeight: s.type === 'text' ? 110 : 80 }} />)}
        </>
      );

      if (s.type === 'description') return (
        <>
          {headingPara}
          {sf(`${s.id}:image`, 'Imagine (opțional)', <ImageInput value={s.image} focus={s.imageFocus} onFocusChange={(v) => upd({ imageFocus: v })} onChange={(v) => upd({ image: v })} onMeta={(m) => upd({ imageOrient: m.orient })} />)}
          {!!s.image && sf(`${s.id}:imageLayout`, 'Așezare imagine', (
            <div className="seg">
              {([['side', 'Alăturat (implicit)'], ['wide', 'Pe toată lățimea']] as const).map(([v, l]) => (
                <button key={v} type="button" className={`seg-btn${(s.imageLayout || 'side') === v ? ' on' : ''}`} onClick={() => upd({ imageLayout: v })}>{l}</button>
              ))}
            </div>
          ))}
          <label className="sf-block-label">Specificații tehnice</label>
          {arr<any>('specs').map((x, i) => row(`${s.id}:spec:${i}`, `Specificație ${i + 1}`, () => delRowAt('specs', i),
            <div className="adm-row">
              <TextInput placeholder="Etichetă (ex: FRONTURI)" value={x.label} onChange={(e) => updRow('specs', i, { label: e.target.value })} />
              <TextInput placeholder="Valoare" value={x.value} onChange={(e) => updRow('specs', i, { value: e.target.value })} />
            </div>))}
          <button type="button" className="ro-add" onClick={() => addRowAt('specs', { label: '', value: '' })}>＋ Specificație</button>
        </>
      );

      if (s.type === 'materials') return (
        <>
          {headingPara}
          {sf(`${s.id}:image`, 'Imagine laterală (opțional)', <ImageInput value={s.image} focus={s.imageFocus} onFocusChange={(v) => upd({ imageFocus: v })} onChange={(v) => upd({ image: v })} onMeta={(m) => upd({ imageOrient: m.orient })} />)}
          <label className="sf-block-label">Mostre material</label>
          {arr<any>('swatches').map((x, i) => row(`${s.id}:swatch:${i}`, `Mostră ${i + 1}`, () => delRowAt('swatches', i),
            <>
              <ImageInput small value={x.image} onChange={(v) => updRow('swatches', i, { image: v })} />
              <div>
                <TextInput placeholder="Etichetă (ex: FRONTURI)" value={x.label} onChange={(e) => updRow('swatches', i, { label: e.target.value })} style={{ marginBottom: 8 }} />
                <TextInput placeholder="Cod / decor" value={x.code} onChange={(e) => updRow('swatches', i, { code: e.target.value })} />
              </div>
            </>, true))}
          <button type="button" className="ro-add" onClick={() => addRowAt('swatches', { label: '', code: '', image: '' })}>＋ Mostră</button>
          <label className="sf-block-label" style={{ marginTop: 14 }}>Calități finisaj</label>
          {arr<any>('finishes').map((x, i) => row(`${s.id}:finish:${i}`, `Finisaj ${i + 1}`, () => delRowAt('finishes', i),
            <div className="adm-row">
              <TextInput placeholder="Titlu (ex: REZISTENȚĂ)" value={x.label} onChange={(e) => updRow('finishes', i, { label: e.target.value })} />
              <TextInput placeholder="Descriere scurtă" value={x.desc} onChange={(e) => updRow('finishes', i, { desc: e.target.value })} />
            </div>))}
          <button type="button" className="ro-add" onClick={() => addRowAt('finishes', { label: '', desc: '' })}>＋ Finisaj</button>
        </>
      );

      if (s.type === 'accessories') return (
        <>
          {headingPara}
          <label className="sf-block-label">Accesorii</label>
          {arr<any>('items').map((x, i) => row(`${s.id}:item:${i}`, `Accesoriu ${i + 1}`, () => delRowAt('items', i),
            <>
              <ImageInput small value={x.image} focus={x.focus} onFocusChange={(v) => updRow('items', i, { focus: v })} onChange={(v) => updRow('items', i, { image: v })} onMeta={(m) => updRow('items', i, { orient: m.orient })} />
              <div>
                <TextInput placeholder="Titlu" value={x.title} onChange={(e) => updRow('items', i, { title: e.target.value })} style={{ marginBottom: 8 }} />
                <TextArea placeholder="Descriere" value={x.description} onChange={(e) => updRow('items', i, { description: e.target.value })} style={{ minHeight: 50 }} />
              </div>
            </>, true))}
          <button type="button" className="ro-add" onClick={() => addRowAt('items', { image: '', title: '', description: '' })}>＋ Accesoriu</button>
          <label className="sf-block-label" style={{ marginTop: 14 }}>Beneficii</label>
          {arr<any>('benefits').map((x, i) => row(`${s.id}:benefit:${i}`, `Beneficiu ${i + 1}`, () => delRowAt('benefits', i),
            <TextInput placeholder="Beneficiu (ex: Funcționare silențioasă)" value={x.label} onChange={(e) => updRow('benefits', i, { label: e.target.value })} />))}
          <button type="button" className="ro-add" onClick={() => addRowAt('benefits', { label: '', desc: '' })}>＋ Beneficiu</button>
        </>
      );

      if (s.type === 'sketches') return (
        <>
          {headingPara}
          <label className="sf-block-label">Schițe / randări (imagini orizontale recomandate, maximum 6)</label>
          {imgWarn && <div className="of-cap-note">{imgWarn}</div>}
          {arr<any>('shots').map((x, i) => row(`${s.id}:shot:${i}`, `Imagine ${i + 1}`, () => delRowAt('shots', i),
            <>
              <ImageInput small value={x.image} focus={x.focus} onFocusChange={(v) => updRow('shots', i, { focus: v })} onChange={(v) => updRow('shots', i, { image: v })} onMeta={(m) => {
                if (m.orient === 'portrait') {
                  if (window.confirm('Pentru schițe sunt recomandate imagini orizontale (landscape). O imagine verticală va fi decupată. O păstrezi?')) {
                    updRow('shots', i, { orient: m.orient });
                    setImgWarn('');
                  } else {
                    updRow('shots', i, { image: '', orient: undefined });
                  }
                } else {
                  updRow('shots', i, { orient: m.orient });
                  setImgWarn('');
                }
              }} />
              <TextInput placeholder="Etichetă (opțional)" value={x.caption} onChange={(e) => updRow('shots', i, { caption: e.target.value })} />
            </>, true))}
          {arr<any>('shots').length < 6 ? (
            <button type="button" className="ro-add" onClick={() => addRowAt('shots', { image: '', caption: '' })}>＋ Imagine</button>
          ) : (
            <div className="of-cap-note">Maximum 6 imagini pe o pagină de schițe (câte 3 pe rând).</div>
          )}
          <label className="sf-block-label" style={{ marginTop: 14 }}>Date tehnice (dimensiuni)</label>
          {arr<any>('dims').map((x, i) => row(`${s.id}:dim:${i}`, `Bloc ${i + 1}`, () => delRowAt('dims', i),
            <>
              <TextInput placeholder="Titlu (ex: DULAP HAINE)" value={x.title} onChange={(e) => updRow('dims', i, { title: e.target.value })} style={{ marginBottom: 8 }} />
              <TextArea placeholder="O dimensiune pe rând" value={x.lines} onChange={(e) => updRow('dims', i, { lines: e.target.value })} style={{ minHeight: 64 }} />
            </>))}
          <button type="button" className="ro-add" onClick={() => addRowAt('dims', { title: '', lines: '' })}>＋ Bloc dimensiuni</button>
        </>
      );

      if (s.type === 'gallery') return (
        <>
          {headingPara}
          <label className="sf-block-label">Imagini galerie (până la {GAL_MAX} — aranjare automată după forma fiecărei imagini)</label>
          <GalleryAdvice urls={arr<any>('shots').map((x) => x.image).filter(Boolean)} />
          {arr<any>('shots').map((x, i) => row(`${s.id}:shot:${i}`, `Foto ${i + 1}`, () => delRowAt('shots', i),
            <>
              <ImageInput small value={x.image} focus={x.focus} onFocusChange={(v) => updRow('shots', i, { focus: v })} onChange={(v) => updRow('shots', i, { image: v })} onMeta={(m) => updRow('shots', i, { orient: m.orient })} />
              <TextInput placeholder="Etichetă (opțional)" value={x.caption} onChange={(e) => updRow('shots', i, { caption: e.target.value })} />
            </>, true))}
          {arr<any>('shots').length < GAL_MAX ? (
            <button type="button" className="ro-add" onClick={() => addRowAt('shots', { image: '', caption: '' })}>＋ Imagine</button>
          ) : (
            <div className="of-cap-note">Maximum {GAL_MAX} imagini pe o pagină de galerie.</div>
          )}
        </>
      );

      // text
      return (
        <>
          {headingPara}
          {sf(`${s.id}:textLayout`, 'Aranjare pagină', (
            <div className="seg">
              {([['bottom', 'Imagine jos'], ['top', 'Imagine sus'], ['left', 'Imagine stânga'], ['right', 'Imagine dreapta'], ['none', 'Doar text']] as const).map(([v, l]) => (
                <button key={v} type="button" className={`seg-btn${(s.textLayout || 'bottom') === v ? ' on' : ''}`} onClick={() => upd({ textLayout: v })}>{l}</button>
              ))}
            </div>
          ))}
          {(s.textLayout || 'bottom') !== 'none' && sf(`${s.id}:image`, 'Imagine', <ImageInput value={s.image} focus={s.imageFocus} onFocusChange={(v) => upd({ imageFocus: v })} onChange={(v) => upd({ image: v })} onMeta={(m) => upd({ imageOrient: m.orient })} />)}
        </>
      );
    }
  }

  /* ---------------- LIST ---------------- */
  const newOffers = drafts.readNewDrafts<EditOffer>('offers').filter(({ draft: d }) => !d.isTemplate);
  const visibleOffers = items.filter(e => !e.data.isTemplate && !hiddenSlugs.has(e.slug));
  return (
    <div>
      <SectionHead title="Generator oferte" desc={`${items.length} oferte · prezentări de proiect în brand JL Custom Design`}
        action={<>
          <button className="adm-btn" onClick={() => { setPickIndex(0); setView('pick_offer'); }} style={{ marginRight: 8 }} title="Creează o ofertă nouă">+ Ofertă nouă</button>
          <button className="adm-btn ghost" onClick={() => {
            const id = makeTempId();
            setTempId(id);
            setOffer({ clientName: '', templateName: 'Șablon Nou', category: '', isTemplate: true, style: 'editorial', date: '', pages: [blankSection('description')] });
            lastSaved.current = ''; setAuto('');
            setClosed(new Set()); setActiveField(null); setView('edit'); setShowPreview(false);
          }} title="Creează un șablon nou">+ Șablon nou</button>
        </>} />
      {visibleOffers.length === 0 && newOffers.length === 0 ? (
        <div className="adm-empty">Nicio ofertă încă. Apasă „Ofertă nouă", alege un model și personalizează-l.</div>
      ) : (
        <div className="adm-grid">
          {newOffers.map(({ tempId: tid, draft: d }) => (
            <div className="adm-card" key={`new-${tid}`}>
              <div className={`thumb${d.coverImage ? '' : ' empty'}`} style={d.coverImage ? { backgroundImage: `url("${d.coverImage}")` } : undefined}>{!d.coverImage && 'fără copertă'}</div>
              <div className="body">
                <span className="badge" style={{ background: 'var(--warning, #e6a817)', color: '#111' }}>Draft</span>
                <span className="title">{d.clientName || 'Ofertă nouă'}</span>
                <span className="meta">{d.date} · {countPages(d)} pagini</span>
              </div>
              <div className="actions">
                <button className="adm-btn ghost sm" onClick={() => openDraft(tid)} title="Continuă editarea draftului">Editează</button>
                <button className="adm-btn danger sm" onClick={() => removeDraft(tid)} title="Șterge draftul local">Șterge</button>
              </div>
            </div>
          ))}
          {visibleOffers.map((e) => {
            const local = readExistingDraft(e.slug);
            const display = local || e.data;
            const hasDraft = !!local;
            return (
              <div className="adm-card" key={e.slug}>
                <div className={`thumb${display.coverImage ? '' : ' empty'}`} style={display.coverImage ? { backgroundImage: `url("${display.coverImage}")` } : undefined}>{!display.coverImage && 'fără copertă'}</div>
                <div className="body">
                  <span className="badge" style={hasDraft ? { background: 'var(--warning, #e6a817)', color: '#111' } : undefined}>
                    {hasDraft ? 'Modificat' : ((Array.isArray(display.tags) && display.tags.length ? display.tags.join(' · ') : display.category) || 'Proiect')}
                  </span>
                  <span className="title">{display.clientName || e.slug}</span>
                  <span className="meta">{display.date} · {countPages(display)} pagini</span>
                </div>
                <div className="actions">
                  <a className="adm-btn ghost sm" href={`/oferta/${e.slug}?pdf=1`} target="_blank" rel="noreferrer" title="Descarcă PDF-ul publicat">⬇ PDF</a>
                  <button className="adm-btn ghost sm" onClick={() => edit(e)} title="Editează oferta">Editează</button>
                  <button className="adm-btn ghost sm" onClick={() => duplicate(e)} title="Creează o copie identică a ofertei">Duplică</button>
                  <button className="adm-btn danger sm" onClick={() => remove(e)} title="Șterge oferta definitiv">Șterge</button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
