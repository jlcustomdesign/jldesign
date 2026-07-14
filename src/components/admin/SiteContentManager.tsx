import React, { useEffect, useRef, useState } from 'react';
import { TextInput, TextArea, ImageInput } from './ui';

interface Props { notify: (msg: string, kind?: 'ok' | 'err') => void; }

/* Sections grouped by the page they appear on. */
const PAGES: { id: string; label: string; url: string; sections: string[] }[] = [
  { id: 'acasa', label: 'Acasă', url: '/', sections: ['NAV', 'HERO', 'ABOUT_SECTION', 'SERVICES_SECTION', 'PORTFOLIO_SECTION', 'PROCESS', 'BLOG_PREVIEW', 'FAQ', 'FOOTER', 'CONTACT_MODAL', 'CONTACT_FAB', 'BREADCRUMBS'] },
  { id: 'despre', label: 'Despre', url: '/about', sections: ['ABOUT_PAGE'] },
  { id: 'servicii', label: 'Servicii', url: '/services', sections: ['SERVICES_PAGE'] },
  { id: 'portofoliu', label: 'Portofoliu', url: '/portfolio', sections: ['PORTFOLIO_PAGE'] },
  { id: 'blog', label: 'Blog', url: '/blog', sections: ['BLOG_PAGE'] },
  { id: 'brandbook', label: 'Brandbook', url: '/brandbook', sections: ['BRANDBOOK_PAGE'] },
  { id: 'seo', label: 'SEO & Meta', url: '/', sections: [] },
];

// SEO/meta fields live on their own page so the content pages stay clean.
const SEO_SECTIONS = ['HOME', 'SERVICES_PAGE', 'ABOUT_PAGE', 'PORTFOLIO_PAGE', 'BLOG_PAGE', 'BRANDBOOK_PAGE'];
const SEO_FIELDS = new Set(['title', 'description', 'seoFabric']);
const SEO_SECTION_LABEL: Record<string, string> = {
  HOME: 'Pagina principală', SERVICES_PAGE: 'Pagina Servicii', ABOUT_PAGE: 'Pagina Despre',
  PORTFOLIO_PAGE: 'Pagina Portofoliu', BLOG_PAGE: 'Pagina Blog', CONTACT_PAGE: 'Pagina Contact', BRANDBOOK_PAGE: 'Pagina Brandbook',
};

const SECTION_LABELS: Record<string, string> = {
  NAV: 'Navigație', HOME: 'SEO pagină', HERO: 'Hero', ABOUT_SECTION: 'Despre (secțiune)', SERVICES_SECTION: 'Servicii (secțiune)',
  PORTFOLIO_SECTION: 'Portofoliu (secțiune)', PROCESS: 'Proces de lucru', BLOG_PREVIEW: 'Blog (secțiune)', FAQ: 'Întrebări frecvente',
  FOOTER: 'Footer', CONTACT_MODAL: 'Fereastră de contact', CONTACT_FAB: 'Buton contact', BREADCRUMBS: 'Breadcrumbs',
  ABOUT_PAGE: 'Conținut pagină', SERVICES_PAGE: 'Conținut pagină', PORTFOLIO_PAGE: 'Conținut pagină', BLOG_PAGE: 'Conținut pagină',
  CONTACT_PAGE: 'Conținut pagină', BRANDBOOK_PAGE: 'Conținut pagină', TEST_PAGE: 'Test',
};

const prettify = (k: string) => k.replace(/([a-z])([A-Z])/g, '$1 $2').replace(/[_-]/g, ' ').replace(/^\w/, (c) => c.toUpperCase());

// Plain-Romanian labels so a non-technical user understands every field.
const FIELD_LABELS: Record<string, string> = {
  title: 'Titlu', subtitle: 'Subtitlu', desc: 'Descriere', description: 'Descriere', text: 'Text', paragraph: 'Text',
  img: 'Imagine', image: 'Imagine', heading: 'Titlu', name: 'Nume', href: 'Link', url: 'Link',
  ctaText: 'Text buton', ctaLabel: 'Text buton', ctaHref: 'Link buton', cta: 'Buton',
  question: 'Întrebare', answer: 'Răspuns', value: 'Valoare', code: 'Cod', caption: 'Descriere imagine',
  eyebrow: 'Etichetă mică', logo: 'Logo', copyright: 'Drepturi de autor', phone: 'Telefon', email: 'Email', address: 'Adresă',
  viewProjectLabel: 'Text buton', placeholder: 'Text exemplu', label: 'Etichetă',
  cards: 'Carduri', links: 'Linkuri', items: 'Elemente', steps: 'Pași', projects: 'Proiecte',
  swatches: 'Materiale', specs: 'Specificații', shots: 'Imagini', benefits: 'Beneficii', finishes: 'Finisaje',
};
const fieldLabel = (k: string) => FIELD_LABELS[k] || prettify(k);
// Accessibility / internal plumbing — hidden so beginners see only real content.
const TECHNICAL = /aria|alt$|^id$|ariaLabel/i;
const visibleEntries = (obj: any): [string, any][] => Object.entries(obj).filter(([k]) => !TECHNICAL.test(k));
// A human title for a repeated item ("Bucătării" instead of "Card 1").
const itemTitle = (item: any, label: string | undefined, i: number): string => {
  if (item && typeof item === 'object') {
    const t = item.title || item.name || item.heading || item.question || item.label || item.caption;
    if (t && typeof t === 'string' && t.trim()) return t.trim().slice(0, 48);
  }
  return (label || 'Element') + ' ' + (i + 1);
};
const isImage = (s: any) => typeof s === 'string' && (/\.(webp|jpe?g|png|svg|avif|gif)(\?.*)?$/i.test(s) || s.startsWith('data:image'));
const isLong = (s: string) => s.includes('\n') || s.length > 80;
function setIn(obj: any, p: (string | number)[], value: any): any {
  if (!p.length) return value;
  const [k, ...rest] = p;
  const clone = Array.isArray(obj) ? obj.slice() : { ...obj };
  clone[k as any] = setIn(obj[k as any], rest, value);
  return clone;
}

// Edits autosave to the BROWSER (localStorage); publishing happens on "Salvează tot".
const SITE_DRAFT_KEY = 'jl-site-draft';
const readSiteDraft = (): any | null => { try { const s = localStorage.getItem(SITE_DRAFT_KEY); return s ? JSON.parse(s) : null; } catch { return null; } };
const clearSiteDraft = () => { try { localStorage.removeItem(SITE_DRAFT_KEY); } catch {} };

export default function SiteContentManager({ notify }: Props) {
  const [content, setContent] = useState<Record<string, any> | null>(null);
  const [err, setErr] = useState('');
  const [busy, setBusy] = useState(false);
  const [pageId, setPageId] = useState('acasa');
  const [activeField, setActiveField] = useState<string | null>(null);
  const [closed, setClosed] = useState<Set<string>>(new Set());
  const [mobileTab, setMobileTab] = useState<'form' | 'preview'>('form');
  const [device, setDevice] = useState<'desktop' | 'mobile'>('desktop');

  const contentRef = useRef<Record<string, any> | null>(null);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const formRef = useRef<HTMLDivElement>(null);
  const wrapRef = useRef<HTMLDivElement>(null);
  const tabsRef = useRef<HTMLDivElement>(null);
  const syncing = useRef(false);
  const [scale, setScale] = useState(1);
  const [ind, setInd] = useState({ left: 0, width: 0 });
  const savedRef = useRef('');
  const [dirty, setDirty] = useState(false);
  contentRef.current = content;

  // Slide the active-tab highlight smoothly between page tabs.
  useEffect(() => {
    const measure = () => {
      const el = tabsRef.current?.querySelector(`[data-page="${pageId}"]`) as HTMLElement | null;
      if (el) setInd({ left: el.offsetLeft, width: el.offsetWidth });
    };
    const id = requestAnimationFrame(measure);
    window.addEventListener('resize', measure);
    return () => { cancelAnimationFrame(id); window.removeEventListener('resize', measure); };
  }, [pageId, !!content]);

  // Preview rendered at a real device size, scaled to fit.
  // Mobile: real phone aspect (9:19.5); Desktop: 16:9. Both scaled to fit the
  // column width AND the remaining viewport height, so the whole frame is visible.
  const base = device === 'mobile' ? { w: 390, h: 844 } : { w: 1440, h: 810 };
  useEffect(() => {
    const el = wrapRef.current;
    if (!el) return; // SEO page has no preview — nothing to scale
    const compute = () => {
      const availW = el.clientWidth;
      // Ignore transient 0-width (e.g. the pane being detached) so we never
      // shrink the preview to the minimum and get stuck tiny.
      if (availW < 50) return;
      const top = el.getBoundingClientRect().top;
      const availH = window.innerHeight - top - 20;
      setScale(Math.max(0.1, Math.min(availW / base.w, availH / base.h, 1)));
    };
    compute();
    const ro = new ResizeObserver(compute);
    ro.observe(el);
    window.addEventListener('resize', compute);
    return () => { ro.disconnect(); window.removeEventListener('resize', compute); };
    // Re-attach + recompute when the preview reappears (e.g. after SEO & Meta).
  }, [device, !!content, pageId]);

  const page = PAGES.find((p) => p.id === pageId)!;

  useEffect(() => {
    fetch('/api/admin/site').then((r) => r.json()).then((server) => {
      savedRef.current = JSON.stringify(server);
      const draft = readSiteDraft();
      if (draft && JSON.stringify(draft) !== savedRef.current) {
        setContent(draft); contentRef.current = draft; setDirty(true);
        notify('Am restaurat modificările nesalvate din browser', 'ok');
      } else { setContent(server); contentRef.current = server; }
    }).catch((e) => setErr(String(e)));
  }, []);

  // Autosave the whole content draft to the browser on every change.
  useEffect(() => {
    if (!content) return;
    const json = JSON.stringify(content);
    if (json === savedRef.current) { setDirty(false); return; }
    setDirty(true);
    const t = setTimeout(() => { try { localStorage.setItem(SITE_DRAFT_KEY, json); } catch {} }, 700);
    return () => clearTimeout(t);
  }, [content]);

  const toIframe = (msg: any) => iframeRef.current?.contentWindow?.postMessage({ target: 'cms', ...msg }, '*');

  // Receive messages from the preview overlay.
  useEffect(() => {
    const onMsg = (e: MessageEvent) => {
      const m = e.data || {};
      if (m.source !== 'cms') return;
      if (m.type === 'ready') toIframe({ type: 'data', content: contentRef.current });
      else if (m.type === 'select') selectFromPreview(m.path);
    };
    window.addEventListener('message', onMsg);
    return () => window.removeEventListener('message', onMsg);
  }, []);

  const update = (pathArr: (string | number)[], value: any) => {
    setContent((prev) => setIn(prev, pathArr, value));
    if (typeof value === 'string') toIframe({ type: 'update', path: pathArr.join('.'), value });
  };

  const focusFromForm = (path: string) => {
    setActiveField(path);
    if (syncing.current) { syncing.current = false; return; }
    toIframe({ type: 'focus', path });
  };
  const selectFromPreview = (path: string) => {
    const sec = path.split('.')[0];
    setClosed((prev) => { if (!prev.has(sec)) return prev; const n = new Set(prev); n.delete(sec); return n; });
    setActiveField(path);
    setMobileTab('form');
    // The section may need to expand first; poll a few frames until the field
    // exists, then scroll to it exactly once (multiple smooth-scrolls fight each
    // other and make the panel feel "stuck").
    let tries = 0;
    const go = () => {
      const c = formRef.current;
      const wrap = c?.querySelector(`[id="f-${path}"]`) as HTMLElement | null;
      if (!c || !wrap) { if (tries++ < 12) return setTimeout(go, 30); return; }
      const r = wrap.getBoundingClientRect();
      const cr = c.getBoundingClientRect();
      const target = c.scrollTop + (r.top - cr.top) - cr.height / 2 + r.height / 2;
      c.scrollTo({ top: Math.max(0, target), behavior: 'smooth' });
      const input = wrap.querySelector('input, textarea') as HTMLElement | null;
      if (input) { syncing.current = true; input.focus({ preventScroll: true }); }
    };
    requestAnimationFrame(go);
  };
  const onFormFocus = (e: React.FocusEvent | React.MouseEvent) => {
    const w = (e.target as HTMLElement).closest?.('[data-cms-path]');
    const p = w?.getAttribute('data-cms-path');
    if (p) focusFromForm(p);
  };

  const save = async () => {
    if (!content) return;
    setBusy(true);
    try {
      const res = await fetch('/api/admin/site', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ data: content }) });
      const j = await res.json();
      if (!res.ok) throw new Error(j.error || 'Salvare eșuată');
      savedRef.current = JSON.stringify(content);
      setDirty(false);
      clearSiteDraft();
      notify('Conținut publicat — apare pe site după redeploy', 'ok');
      iframeRef.current?.contentWindow?.location.reload();
    } catch (e) { notify((e as Error).message, 'err'); } finally { setBusy(false); }
  };

  /* recursive field renderer (each leaf carries data-cms-path + id for sync) */
  const renderValue = (value: any, pathArr: (string | number)[], label?: string): React.ReactNode => {
    const path = pathArr.join('.');
    const wrap = (node: React.ReactNode) => (
      <div className="sf" key={path} data-cms-path={path} id={`f-${path}`} data-active={activeField === path ? 'true' : undefined}>
        {label && <label>{label}</label>}
        {node}
      </div>
    );
    if (isImage(value)) return wrap(<ImageInput value={value} onChange={(v) => update(pathArr, v)} />);
    if (typeof value === 'string')
      return wrap(isLong(value)
        ? <TextArea value={value} onChange={(e) => update(pathArr, e.target.value)} style={{ minHeight: value.length > 200 ? 120 : 70 }} />
        : <TextInput value={value} onChange={(e) => update(pathArr, e.target.value)} />);
    if (typeof value === 'number') return wrap(<TextInput type="number" value={value} onChange={(e) => update(pathArr, Number(e.target.value))} />);
    if (typeof value === 'boolean')
      return (
        <div className="sf" key={path} data-cms-path={path} id={`f-${path}`} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <input type="checkbox" checked={value} onChange={(e) => update(pathArr, e.target.checked)} />{label && <label style={{ margin: 0 }}>{label}</label>}
        </div>
      );
    if (Array.isArray(value)) {
      const blank = () => {
        const f = value[0];
        if (f && typeof f === 'object' && !Array.isArray(f)) { const o: any = {}; for (const k in f) o[k] = typeof f[k] === 'string' ? '' : typeof f[k] === 'number' ? 0 : Array.isArray(f[k]) ? [] : f[k]; return o; }
        return typeof f === 'number' ? 0 : '';
      };
      return (
        <div className="sf" key={path} style={{ background: 'none', boxShadow: 'none', padding: 0 }}>
          {label && <label className="sf-block-label">{label}</label>}
          <div className="adm-repeat">
            {value.map((item, i) => (
              <div className="ro" key={i}>
                <div className="ro-head"><span className="ro-tag">{itemTitle(item, label, i)}</span>
                  <button type="button" className="ro-del" onClick={() => update(pathArr, value.filter((_, j) => j !== i))}>✕</button>
                </div>
                <div className="ro-body">{renderValue(item, [...pathArr, i])}</div>
              </div>
            ))}
            <button type="button" className="ro-add" onClick={() => update(pathArr, [...value, blank()])}>＋ Adaugă</button>
          </div>
        </div>
      );
    }
    if (value && typeof value === 'object')
      return (
        <div key={path} style={{ borderLeft: label ? '2px solid var(--line)' : undefined, paddingLeft: label ? 12 : 0, marginBottom: label ? 10 : 0 }}>
          {label && <div className="sf-block-label" style={{ color: 'var(--ink-2)' }}>{label}</div>}
          {visibleEntries(value).map(([k, v]) => renderValue(v, [...pathArr, k], fieldLabel(k)))}
        </div>
      );
    return null;
  };

  if (err) return <div className="adm-empty" style={{ color: 'var(--danger)' }}>Eroare: {err}</div>;
  if (!content) return <div className="adm-loading"><span className="adm-spin" /> Se încarcă conținutul…</div>;

  return (
    <div className="adm-editor-fit">
      <div className="adm-editor-head" style={{ marginBottom: 12 }}>
        <h3 style={{ margin: 0 }}>Conținut site</h3>
        <span className={`auto-ind${dirty ? '' : ' ok'}`} style={{ marginLeft: 12 }}>
          {dirty ? 'Nepublicat — apasă „Salvează tot" pentru a publica' : '✓ Publicat pe site'}
        </span>
        <div className="adm-spacer" />
        <a className="adm-btn ghost" href={page.url} target="_blank" rel="noreferrer">Deschide pagina</a>
        <button className="adm-btn gold" onClick={save} disabled={busy || !dirty} style={{ marginLeft: 8 }}>{busy ? 'Se publică…' : (dirty ? 'Salvează tot' : 'Salvat')}</button>
      </div>

      {/* Page tabs */}
      <div className="adm-tabs" ref={tabsRef} style={{ margin: '0 0 14px', display: 'inline-flex' }}>
        <span className="adm-tab-ind" style={{ transform: `translateX(${ind.left}px)`, width: ind.width }} />
        {PAGES.map((p) => (
          <button key={p.id} data-page={p.id} className="adm-tab" aria-selected={pageId === p.id} onClick={() => { setPageId(p.id); setActiveField(null); }}>{p.label}</button>
        ))}
      </div>

      {pageId === 'seo' ? (
        <div className="ofb-form-col ofb-seo" ref={formRef} onFocusCapture={onFormFocus} onClickCapture={onFormFocus}>
          <p className="ofb-preview-tip" style={{ margin: '0 0 14px' }}>Titluri și descrieri pentru Google + cuvinte cheie. Apar în rezultatele de căutare, nu pe pagină.</p>
          {SEO_SECTIONS.filter((k) => k in content).map((key) => {
            const fields = Object.entries(content[key]).filter(([k]) => SEO_FIELDS.has(k));
            if (!fields.length) return null;
            const isOpen = !closed.has('seo:' + key);
            return (
              <div className="pg-card" key={key}>
                <div className="pg-card-head">
                  <button type="button" className="pg-card-toggle" onClick={() => setClosed((prev) => { const k2 = 'seo:' + key; const n = new Set(prev); n.has(k2) ? n.delete(k2) : n.add(k2); return n; })}>
                    <span className="pg-title">{SEO_SECTION_LABEL[key] || prettify(key)} <span className="chev" style={{display: 'inline-flex', verticalAlign: 'middle', marginLeft: 6}}>{isOpen ? <svg width="1.2em" height="1.2em" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6"/></svg> : <svg width="1.2em" height="1.2em" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6"/></svg>}</span></span>
                  </button>
                </div>
                {isOpen && <div className="pg-card-body">{fields.map(([k, v]) => renderValue(v, [key, k], prettify(k)))}</div>}
              </div>
            );
          })}
        </div>
      ) : (
      <>
      <div className="ofb-mobile-switch" role="group">
        <button aria-pressed={mobileTab === 'form'} onClick={() => setMobileTab('form')}>Editează</button>
        <button aria-pressed={mobileTab === 'preview'} onClick={() => setMobileTab('preview')}>Previzualizare</button>
      </div>

      <div className={`ofb${mobileTab === 'preview' ? ' show-preview' : ''}`}>
        <div className="ofb-form-col" ref={formRef} onFocusCapture={onFormFocus} onClickCapture={onFormFocus}>
          <p className="ofb-preview-tip" style={{ margin: '0 0 10px' }}>Apasă pe orice text sau imagine din previzualizare pentru a-l edita aici.</p>
          {page.sections.filter((k) => k in content).map((key) => {
            const entries = Object.entries(content[key]).filter(([k]) => !TECHNICAL.test(k) && !(SEO_SECTIONS.includes(key) && SEO_FIELDS.has(k)));
            if (!entries.length) return null;
            const isOpen = !closed.has(key);
            return (
              <div className="pg-card" key={key}>
                <div className="pg-card-head">
                  <button type="button" className="pg-card-toggle" onClick={() => setClosed((prev) => { const n = new Set(prev); n.has(key) ? n.delete(key) : n.add(key); return n; })}>
                    <span className="pg-title">{SECTION_LABELS[key] || prettify(key)} <span className="chev" style={{display: 'inline-flex', verticalAlign: 'middle', marginLeft: 6}}>{isOpen ? <svg width="1.2em" height="1.2em" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6"/></svg> : <svg width="1.2em" height="1.2em" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6"/></svg>}</span></span>
                  </button>
                </div>
                {isOpen && <div className="pg-card-body">{entries.map(([k, v]) => renderValue(v, [key, k], fieldLabel(k)))}</div>}
              </div>
            );
          })}
        </div>

        <div className="ofb-preview-col">
          <div className="cms-toolbar">
            <span className="ofb-preview-tip" style={{ margin: 0 }}>{page.url}</span>
            <div className="seg" style={{ marginLeft: 'auto' }}>
              <button className={`seg-btn${device === 'desktop' ? ' on' : ''}`} onClick={() => setDevice('desktop')}>Desktop</button>
              <button className={`seg-btn${device === 'mobile' ? ' on' : ''}`} onClick={() => setDevice('mobile')}>Mobil</button>
            </div>
          </div>
          <div className="cms-frame-wrap" ref={wrapRef}>
            <div className={`cms-frame-scaler${device === 'mobile' ? ' mobile' : ''}`} style={{ width: Math.round(base.w * scale), height: Math.round(base.h * scale) }}>
              <iframe ref={iframeRef} className="cms-frame" src={`${page.url}?cms=1`} title="Previzualizare"
                style={{ width: base.w, height: base.h, transform: `scale(${scale})`, transformOrigin: 'top left' }} />
            </div>
          </div>
        </div>
      </div>
      </>
      )}
    </div>
  );
}
