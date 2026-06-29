import React, { useState, useMemo, useRef, useEffect } from 'react';
import type { Entry } from './api';
import { saveEntry, deleteEntry } from './api';
import { TextInput, TextArea, ImageInput, SectionHead, TagInput } from './ui';
import OfferDocument, { normalizeOffer, uid, DEFAULT_LABEL, type Offer, type Section, type SectionType } from '../offer/OfferDocument';
import { TEMPLATES } from './offerTemplates';
import { STYLE_LIST, getStyle, ACCENT_PRESETS } from '../offer/offerStyles';

interface Props {
  items: Entry[];
  notify: (msg: string, kind?: 'ok' | 'err') => void;
  reload: () => Promise<void>;
}
type EditOffer = Offer & { slug?: string };

const fromEntry = (e: Entry): EditOffer => ({ ...normalizeOffer(e.data), slug: e.slug });

// Offer drafts live in the BROWSER (localStorage) so edits are instant and never
// lost. Publishing to the site (a GitHub commit) happens only on "Salvează".
const DRAFT_PREFIX = 'jl-offer-draft:';
const draftKey = (slug?: string) => DRAFT_PREFIX + (slug || 'new');
function writeDraft(o: EditOffer) { try { localStorage.setItem(draftKey(o.slug), JSON.stringify(o)); } catch {} }
function readDraft(slug?: string): EditOffer | null { try { const s = localStorage.getItem(draftKey(slug)); return s ? (JSON.parse(s) as EditOffer) : null; } catch { return null; } }
function clearDraft(slug?: string) { try { localStorage.removeItem(draftKey(slug)); } catch {} }
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
    case 'description': return { ...base, heading: 'Descriere proiect', image: '', specs: [{ label: '', value: '' }] };
    case 'materials': return { ...base, heading: 'Materiale și finisaje', image: '', swatches: [{ label: '', code: '', image: '' }], finishes: [{ label: '', desc: '' }] };
    case 'accessories': return { ...base, heading: 'Accesorii și echipare', items: [{ image: '', title: '', description: '' }], benefits: [{ label: '', desc: '' }] };
    case 'sketches': return { ...base, heading: 'Schițe de concept', shots: [{ image: '', caption: '' }], dims: [{ title: '', lines: '' }] };
    case 'gallery': return { ...base, heading: 'Galerie foto', shots: [{ image: '', caption: '' }, { image: '', caption: '' }] };
    case 'text': return { ...base, heading: 'Titlu', image: '' };
  }
};

function scrollWithin(container: HTMLElement | null, el: Element | null) {
  if (!container || !el) return;
  const c = container.getBoundingClientRect();
  const e = el.getBoundingClientRect();
  const top = container.scrollTop + (e.top - c.top) - container.clientHeight / 2 + e.height / 2;
  container.scrollTo({ top: Math.max(0, top), behavior: 'smooth' });
}

export default function OfferManager({ items, notify, reload }: Props) {
  const [view, setView] = useState<'list' | 'pick' | 'edit'>('list');
  const [offer, setOffer] = useState<EditOffer | null>(null);
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
  const lastSaved = useRef<string>('');
  const [pdfBusy, setPdfBusy] = useState(false);
  offerRef.current = offer;

  const tplOffers = useMemo(() => TEMPLATES.map((t) => t.make()), []);
  const patch = (p: Partial<EditOffer>) => setOffer((o) => (o ? { ...o, ...p } : o));
  const setPages = (pages: Section[]) => patch({ pages });
  const setPage = (idx: number, p: Partial<Section>) => offer && setPages(offer.pages.map((s, i) => (i === idx ? { ...s, ...p } : s)));

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
    if (fid) focusFromForm(fid);
  };

  /* ---- CRUD ---- */
  const useTemplate = (i: number) => {
    const src = tplOffers[i];
    const clone: EditOffer = typeof structuredClone === 'function' ? structuredClone(src) : JSON.parse(JSON.stringify(src));
    clearDraft(undefined); // begin a fresh, unsaved offer
    setOffer(clone); lastSaved.current = ''; setAuto('');
    setClosed(new Set()); setActiveField(null); setView('edit'); setShowPreview(false);
  };
  const edit = (e: Entry) => {
    const server = fromEntry(e);
    const draft = readDraft(e.slug);
    const restored = draft && JSON.stringify(draft) !== JSON.stringify(server);
    setOffer(draft || server); lastSaved.current = JSON.stringify(server); setAuto('');
    setClosed(new Set()); setActiveField(null); setView('edit'); setShowPreview(false);
    if (restored) notify('Am restaurat modificările nesalvate din browser', 'ok');
  };
  const cancel = () => { setOffer(null); setView('list'); reload(); };
  const resumeNew = () => {
    const d = readDraft(undefined);
    if (!d) return;
    setOffer(d); lastSaved.current = ''; setAuto('');
    setClosed(new Set()); setActiveField(null); setView('edit'); setShowPreview(false);
  };

  // Publish to the site (the only place that writes to GitHub).
  const save = async () => {
    if (!offer) return;
    if (!offer.clientName.trim()) return notify('Adaugă numele clientului', 'err');
    const prevSlug = offer.slug;
    setBusy(true);
    try {
      const { slug } = await saveEntry({ collection: 'offers', slug: offer.slug, data: offer });
      await reload();
      const saved = { ...offer, slug };
      setOffer(saved); // keep editing, now with slug (enables PDF)
      lastSaved.current = JSON.stringify(saved);
      clearDraft(prevSlug); clearDraft(slug); clearDraft(undefined); // published → drop local drafts
      notify('Ofertă publicată pe site', 'ok');
    } catch (e) { notify((e as Error).message, 'err'); } finally { setBusy(false); }
  };

  // Build the PDF in the browser from the CURRENT edits (a hidden full-size copy
  // of the document) — instant, no save/redeploy needed, never touches the host.
  const buildPdf = async () => {
    const stage = pdfStageRef.current;
    if (!stage) return null;
    const [{ jsPDF }, { toJpeg }] = await Promise.all([import('jspdf'), import('html-to-image')]);
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
  // View the CURRENT edits as a PDF in a new tab (not the hosted/published one).
  const previewPdf = async () => {
    if (!offer) return;
    const win = window.open('', '_blank'); // open synchronously so it isn't blocked
    setPdfBusy(true);
    try {
      const pdf = await buildPdf();
      if (!pdf) { win?.close(); return; }
      const url = URL.createObjectURL(pdf.output('blob') as Blob);
      if (win) win.location.href = url; else window.open(url, '_blank');
      setTimeout(() => URL.revokeObjectURL(url), 60000);
    } catch (e) { win?.close(); notify('Eroare la generarea PDF: ' + (e as Error).message, 'err'); }
    finally { setPdfBusy(false); }
  };

  // Autosave to the BROWSER on every change — instant, offline, no commits.
  useEffect(() => {
    if (view !== 'edit' || !offer) return;
    if (JSON.stringify(offer) === lastSaved.current) return;
    const t = setTimeout(() => {
      const o = offerRef.current;
      if (!o) return;
      writeDraft(o);
      setAuto('saved');
      setTimeout(() => setAuto((a) => (a === 'saved' ? '' : a)), 1200);
    }, 400);
    return () => clearTimeout(t);
  }, [offer, view]);

  const remove = async (e: Entry) => {
    if (!window.confirm(`Ștergi oferta „${e.data.clientName || e.slug}”?`)) return;
    try { await deleteEntry('offers', e.slug); await reload(); notify('Ofertă ștearsă', 'ok'); }
    catch (err) { notify((err as Error).message, 'err'); }
  };

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
  if (view === 'pick') {
    return (
      <div>
        <SectionHead title="Alege un model" desc="Apasă pe un model pentru a începe — fiecare e un document complet, gata de personalizat."
          action={<button className="adm-btn ghost" onClick={() => setView('list')}>← Înapoi</button>} />
        <div className="adm-grid tpl-grid">
          {TEMPLATES.map((t, i) => (
            <button key={t.id} className="tpl-card" onClick={() => useTemplate(i)}>
              <div className="tpl-card-doc"><OfferDocument offer={tplOffers[i]} coverOnly /></div>
              <div className="tpl-card-meta">
                <span className="nm">{t.name}</span>
                <span className="ds">{t.description}</span>
                <span className="go">Folosește acest model →</span>
              </div>
            </button>
          ))}
        </div>
      </div>
    );
  }

  if (view === 'edit' && offer) {
    const o = offer;
    const dirty = JSON.stringify(o) !== lastSaved.current;
    return (
      <div className="adm-editor-fit">
        <div className="adm-editor-head" style={{ marginBottom: 14 }}>
          <h3 style={{ margin: 0 }}>{o.slug ? 'Editează oferta' : 'Ofertă nouă'}</h3>
          <span className={`auto-ind${dirty ? '' : ' ok'}`}>
            {auto === 'saved' ? '✓ Salvat în browser' : dirty ? 'Nepublicat — apasă „Salvează" pentru a publica' : (o.slug ? '✓ Publicat pe site' : 'Ofertă nouă')}
          </span>
          <div className="adm-spacer" />
          <button className="adm-btn ghost" onClick={previewPdf} disabled={pdfBusy} title="Vezi PDF cu modificările curente (nu versiunea publicată)">Previzualizează</button>
          <button className="adm-btn ghost" onClick={downloadPdf} disabled={pdfBusy} title="Descarcă PDF cu modificările curente" style={{ marginLeft: 8 }}>{pdfBusy ? 'Se generează…' : '⬇ PDF'}</button>
          <button className="adm-btn ghost" onClick={cancel} disabled={busy} style={{ marginLeft: 8 }}>Închide</button>
          <button className="adm-btn gold" onClick={save} disabled={busy} style={{ marginLeft: 8 }}>{busy ? 'Se publică…' : (dirty ? 'Salvează' : 'Salvat')}</button>
        </div>

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
                  {sf('cover:clientName', 'Nume client', <TextInput value={o.clientName} onChange={(e) => patch({ clientName: e.target.value })} placeholder="Familia Popescu" />)}
                  {sf('cover:tags', 'Etichete (opțional, mai multe)', <TagInput tags={o.tags || []} onChange={(tags) => patch({ tags })} />)}
                  <div className="adm-row">
                    {sf('cover:date', 'Dată afișată', <TextInput value={o.date} onChange={(e) => patch({ date: e.target.value })} placeholder="Iunie 2026" />)}
                    {sf('cover:coverSubtitle', 'Text mare copertă', <TextInput value={o.coverSubtitle} onChange={(e) => patch({ coverSubtitle: e.target.value })} />)}
                  </div>
                  {sf('cover:coverImage', 'Imagine copertă', <ImageInput value={o.coverImage} onChange={(v) => patch({ coverImage: v })} />)}
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
                      {([['right', 'Imagine dreapta'], ['left', 'Imagine stânga'], ['top', 'Imagine sus']] as const).map(([v, l]) => {
                        const cur = o.coverLayout || getStyle(o.style).layout;
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
                  <div className="pg-tools">
                    <button className="pg-tool" title="Mută sus" disabled={idx === 0} onClick={() => movePage(idx, -1)}>↑</button>
                    <button className="pg-tool" title="Mută jos" disabled={idx === o.pages.length - 1} onClick={() => movePage(idx, 1)}>↓</button>
                    <button className="pg-tool danger" title="Șterge pagina" onClick={() => delPage(idx)}>✕</button>
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
      </div>
    );

    /* ---- per-type field editors ---- */
    function renderPageFields(s: Section, idx: number) {
      const upd = (p: Partial<Section>) => setPage(idx, p);
      const arr = <T,>(key: keyof Section) => (s[key] as T[]) || [];
      const setArr = (key: keyof Section, next: any[]) => upd({ [key]: next } as Partial<Section>);
      const updRow = (key: keyof Section, i: number, p: any) => setArr(key, arr<any>(key).map((x, j) => (j === i ? { ...x, ...p } : x)));
      const addRowAt = (key: keyof Section, blank: any) => setArr(key, [...arr<any>(key), blank]);
      const delRowAt = (key: keyof Section, i: number) => setArr(key, arr<any>(key).filter((_, j) => j !== i));

      const headingPara = (
        <>
          {sf(`${s.id}:heading`, 'Titlu secțiune', <TextInput value={s.heading} onChange={(e) => upd({ heading: e.target.value })} />)}
          {sf(`${s.id}:paragraph`, s.type === 'text' ? 'Text (un paragraf pe rând)' : 'Paragraf', <TextArea value={s.paragraph} onChange={(e) => upd({ paragraph: e.target.value })} style={{ minHeight: s.type === 'text' ? 110 : 80 }} />)}
        </>
      );

      if (s.type === 'description') return (
        <>
          {headingPara}
          {sf(`${s.id}:image`, 'Imagine laterală (opțional)', <ImageInput value={s.image} onChange={(v) => upd({ image: v })} />)}
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
          {sf(`${s.id}:image`, 'Imagine laterală (opțional)', <ImageInput value={s.image} onChange={(v) => upd({ image: v })} />)}
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
              <ImageInput small value={x.image} onChange={(v) => updRow('items', i, { image: v })} />
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
          <label className="sf-block-label">Schițe / randări</label>
          {arr<any>('shots').map((x, i) => row(`${s.id}:shot:${i}`, `Imagine ${i + 1}`, () => delRowAt('shots', i),
            <>
              <ImageInput small value={x.image} onChange={(v) => updRow('shots', i, { image: v })} />
              <TextInput placeholder="Etichetă (opțional)" value={x.caption} onChange={(e) => updRow('shots', i, { caption: e.target.value })} />
            </>, true))}
          <button type="button" className="ro-add" onClick={() => addRowAt('shots', { image: '', caption: '' })}>＋ Imagine</button>
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
          <label className="sf-block-label">Imagini galerie</label>
          {arr<any>('shots').map((x, i) => row(`${s.id}:shot:${i}`, `Foto ${i + 1}`, () => delRowAt('shots', i),
            <>
              <ImageInput small value={x.image} onChange={(v) => updRow('shots', i, { image: v })} />
              <TextInput placeholder="Etichetă (opțional)" value={x.caption} onChange={(e) => updRow('shots', i, { caption: e.target.value })} />
            </>, true))}
          <button type="button" className="ro-add" onClick={() => addRowAt('shots', { image: '', caption: '' })}>＋ Imagine</button>
        </>
      );

      // text
      return (
        <>
          {headingPara}
          {sf(`${s.id}:image`, 'Imagine lată (opțional)', <ImageInput value={s.image} onChange={(v) => upd({ image: v })} />)}
        </>
      );
    }
  }

  /* ---------------- LIST ---------------- */
  return (
    <div>
      <SectionHead title="Generator oferte" desc={`${items.length} oferte · prezentări de proiect în brand JL Custom Design`}
        action={<>
          {readDraft(undefined) && <button className="adm-btn ghost" onClick={resumeNew} style={{ marginRight: 8 }}>Continuă oferta nesalvată</button>}
          <button className="adm-btn" onClick={() => { setPickIndex(0); setView('pick'); }}>+ Ofertă nouă</button>
        </>} />
      {items.length === 0 ? (
        <div className="adm-empty">Nicio ofertă încă. Apasă „Ofertă nouă”, alege un model și personalizează-l.</div>
      ) : (
        <div className="adm-grid">
          {items.map((e) => (
            <div className="adm-card" key={e.slug}>
              <div className={`thumb${e.data.coverImage ? '' : ' empty'}`} style={e.data.coverImage ? { backgroundImage: `url("${e.data.coverImage}")` } : undefined}>{!e.data.coverImage && 'fără copertă'}</div>
              <div className="body">
                <span className="badge">{(Array.isArray(e.data.tags) && e.data.tags.length ? e.data.tags.join(' · ') : e.data.category) || 'Proiect'}</span>
                <span className="title">{e.data.clientName || e.slug}</span>
                <span className="meta">{e.data.date} · {countPages(e.data)} pagini</span>
              </div>
              <div className="actions">
                <a className="adm-btn ghost sm" href={`/oferta/${e.slug}?pdf=1`} target="_blank" rel="noreferrer">⬇ PDF</a>
                <button className="adm-btn ghost sm" onClick={() => edit(e)}>Editează</button>
                <button className="adm-btn danger sm" onClick={() => remove(e)}>Șterge</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
