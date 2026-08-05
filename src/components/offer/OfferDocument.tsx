/**
 * OfferDocument.tsx — renders an offer as a branded, minimalist multi-page
 * presentation. COVER (editorial split: image + text panel) + ordered `pages`.
 * Optional "editable" mode used by the admin live preview: every editable
 * element carries a `data-fid` and is clickable so the editor can sync
 * form ⇄ preview. Styles: src/styles/offer.css. Palette: offerThemes.
 *
 * Auto-fit: each page body is wrapped in <FitBox> which measures content vs
 * available height and scales it down (transform) so nothing is ever cut off.
 * Per-page text size (--fs) and heading weight come from Section fields.
 */
import React from 'react';
import { getStyle } from './offerStyles';
import { fillArrangement, GAL_BUDGET, GAL_W } from './galleryLayout';

export type SectionType = 'description' | 'materials' | 'accessories' | 'sketches' | 'gallery' | 'text';
export type Orient = 'portrait' | 'landscape';
export type TextLayout = 'bottom' | 'top' | 'left' | 'right' | 'none';

export interface Spec { label: string; value: string; }
export interface Swatch { label: string; code: string; image?: string; }
export interface Badge { label: string; desc?: string; }
export interface AccItem { image?: string; title: string; description: string; orient?: Orient; focus?: string; }
export interface Shot { image?: string; caption?: string; orient?: Orient; focus?: string; }
export interface DimBlock { title: string; lines: string; }

export interface Section {
  id: string; type: SectionType; label?: string; heading: string; paragraph: string; image?: string; imageFocus?: string;
  specs?: Spec[]; swatches?: Swatch[]; finishes?: Badge[]; items?: AccItem[]; benefits?: Badge[]; shots?: Shot[]; dims?: DimBlock[];
  /** Additional text blocks for the text/mesaj page. */
  paragraphs?: string[];
  /** Orientation of the side/wide image (auto-detected at upload). */
  imageOrient?: Orient;
  /** Per-page text scale, 0.8–1.3 (default 1). Edited with A−/A+ in the admin. */
  fontScale?: number;
  /** Extra-bold section heading. */
  headingBold?: boolean;
  /** Text page arrangement (image placement). Default 'bottom'. */
  textLayout?: TextLayout;
  /** Description page image placement: 'side' (default) or 'wide' (full width). */
  imageLayout?: 'side' | 'wide';
}

export interface Offer {
  clientName: string; category?: string; tags?: string[]; date: string; websiteUrl?: string;
  coverImage?: string; coverImageFocus?: string; coverSubtitle?: string;
  /** Custom logo for the cover + page headers (defaults to the JL logo). */
  logoImage?: string;
  style?: string; accent?: string; coverLayout?: 'right' | 'left' | 'top' | 'full';
  /** Cover image framing: 'auto' (contain for landscape in side slots), 'cover' fill, 'contain' fit. */
  coverFit?: 'auto' | 'cover' | 'contain';
  coverImageOrient?: Orient;
  isTemplate?: boolean; templateName?: string; templateDescription?: string;
  pages: Section[];
}

export const DEFAULT_LABEL: Record<SectionType, string> = {
  description: 'DESCRIERE PROIECT', materials: 'MATERIALE ȘI FINISAJE', accessories: 'ACCESORII ȘI ECHIPARE',
  sketches: 'SCHIȚE DE CONCEPT', gallery: 'GALERIE FOTO', text: 'DETALII',
};

const has = (s?: string) => !!(s && s.trim());
let counter = 0;
export const uid = (prefix = 'id') => `${prefix}-${(counter++).toString(36)}${Math.floor(Math.random() * 1e4).toString(36)}`;

/** Accept both the new {pages:[]} shape and the old {description,materials,...} shape. */
export function normalizeOffer(raw: any): Offer {
  if (!raw) return { clientName: '', category: '', date: '', pages: [] };
  if (Array.isArray(raw.pages)) return raw as Offer;
  const o = raw; const pages: Section[] = [];
  if (o.description?.enabled) pages.push({ id: 's-description', type: 'description', heading: o.description.heading || '', paragraph: o.description.paragraph || '', image: o.description.image || '', specs: o.description.specs || [] });
  if (o.materials?.enabled) pages.push({ id: 's-materials', type: 'materials', heading: o.materials.heading || '', paragraph: o.materials.paragraph || '', image: o.materials.image || '', swatches: o.materials.swatches || [], finishes: o.materials.finishes || [] });
  if (o.accessories?.enabled) pages.push({ id: 's-accessories', type: 'accessories', heading: o.accessories.heading || '', paragraph: o.accessories.paragraph || '', items: o.accessories.items || [], benefits: o.accessories.benefits || [] });
  if (o.sketches?.enabled) pages.push({ id: 's-sketches', type: 'sketches', heading: o.sketches.heading || '', paragraph: o.sketches.paragraph || '', shots: o.sketches.sketches || [], dims: o.sketches.dims || [] });
  return { clientName: o.clientName || '', category: o.category || '', tags: o.tags || [], date: o.date || '', websiteUrl: o.websiteUrl || '', coverImage: o.coverImage || '', coverSubtitle: o.coverSubtitle || 'MOBILIER PERSONALIZAT', style: o.style || 'editorial', accent: o.accent, coverLayout: o.coverLayout, isTemplate: o.isTemplate, templateName: o.templateName, templateDescription: o.templateDescription, pages };
}

const useIsoLayoutEffect = typeof window !== 'undefined' ? React.useLayoutEffect : React.useEffect;

/**
 * useOrient — resolves an image's orientation. A value stored in the offer
 * (set at upload) wins; otherwise it is detected at runtime from the natural
 * dimensions once the image loads (covers offers saved before this existed).
 */
function useOrient(src?: string, stored?: Orient): Orient | undefined {
  const [o, setO] = React.useState<Orient | undefined>(stored);
  React.useEffect(() => {
    if (stored) { setO(stored); return; }
    if (!src) { setO(undefined); return; }
    let alive = true;
    const im = new Image();
    im.onload = () => { if (alive) setO(im.naturalHeight > im.naturalWidth ? 'portrait' : 'landscape'); };
    im.src = src;
    return () => { alive = false; };
  }, [src, stored]);
  return o;
}

/** Frame image: rounded corners + blurred background fill for images that
    don't fully cover their frame. The foreground image keeps its original
    fit behaviour (contain/cover) set via the wrapper class. */
function FitImage({ src, alt = '', className, imgClassName, style, imgStyle, ...rest }: { src?: string; alt?: string; className?: string; imgClassName?: string; style?: React.CSSProperties; imgStyle?: React.CSSProperties } & Record<string, any>) {
  if (!src) return null;
  return (
    <div className={`img-frame${className ? ' ' + className : ''}`} style={{ ...style, '--img-bg': `url(${src})` } as React.CSSProperties} {...rest}>
      <img className={`img-fg${imgClassName ? ' ' + imgClassName : ''}`} src={src} alt={alt} style={imgStyle} />
    </div>
  );
}

/** Side image (description/materials): frame adapts to the image orientation. */
function SideImg({ s, fid }: { s: Section; fid: Record<string, any> }) {
  const o = useOrient(s.image, s.imageOrient);
  if (!has(s.image)) return <div className="col-right-empty" {...fid} />;
  return <FitImage src={s.image} alt="" className={`side-img-frame${o === 'portrait' ? ' portrait' : ''}`} imgStyle={{ objectPosition: s.imageFocus || 'center' }} {...fid} />;
}

/** Sketch figure: portrait images get a portrait frame. */
function SketchFigure({ x, fid }: { x: Shot; fid: Record<string, any> }) {
  const o = useOrient(x.image, x.orient);
  return (
    <figure className="sketch" {...fid}>
      {x.image ? <FitImage src={x.image} alt={x.caption || ''} className={`sketch-img-frame${o === 'portrait' ? ' portrait' : ''}`} imgStyle={{ objectPosition: x.focus || 'center' }} /> : <div className="sketch-empty" />}
      {has(x.caption) && <figcaption>{x.caption}</figcaption>}
    </figure>
  );
}

/** Gallery: measures each image's aspect ratio + the free body area, then
   fills the ENTIRE rectangle (full width × full height) with cover-fit cells
   via fillArrangement — zero free space for any count/aspect mix; the row
   split is chosen for the least crop. */
function Gallery({ shots, F, sid }: { shots: Shot[]; F: (fid: string) => Record<string, any>; sid: string }) {
  const [ratios, setRatios] = React.useState<(number | null)[]>([]);
  const [budget, setBudget] = React.useState(GAL_BUDGET);
  const [galW, setGalW] = React.useState(GAL_W);
  const wrapRef = React.useRef<HTMLDivElement>(null);
  const key = shots.map((x) => x.image).join('|');
  React.useEffect(() => {
    let alive = true;
    setRatios(shots.map(() => null));
    shots.forEach((x, i) => {
      if (!x.image) return;
      const im = new Image();
      im.onload = () => {
        if (!alive || !im.naturalWidth) return;
        const r = im.naturalWidth / im.naturalHeight;
        setRatios((cur) => { const n = cur.slice(); n[i] = r; return n; });
      };
      im.src = x.image;
    });
    return () => { alive = false; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key]);
  // Measure the real free area on this page (body minus the paragraph) so the
  // gallery fills it exactly without triggering FitBox.
  useIsoLayoutEffect(() => {
    const el = wrapRef.current;
    if (!el) return;
    const page = el.closest('.offer-page');
    const main = el.closest('.sheet-main');
    if (!page || !main) return;
    const cqwPx = (page as HTMLElement).clientWidth / 100;
    if (!cqwPx) return;
    let used = 0;
    const fit = el.parentElement as HTMLElement;
    Array.from(fit.children).forEach((ch) => { if (ch !== el) used += (ch as HTMLElement).offsetHeight; });
    const b = Math.round(((main as HTMLElement).clientHeight - used) / cqwPx - 2.2); // 2 = margin-top, 0.2 rounding safety
    if (b > 10 && Math.abs(b - budget) > 1) setBudget(b);
    const w = Math.round((main as HTMLElement).clientWidth / cqwPx);
    if (w > 40 && Math.abs(w - galW) > 1) setGalW(w);
  });
  const rs = shots.map((_, i) => ratios[i] ?? 1.5);
  const arr = fillArrangement(rs, budget, galW);
  return (
    <div className="gal-rows gal-fill gal-media" ref={wrapRef}>
      {arr.rows.map((row, ri) => (
        <div className="gal-row" style={{ flex: `${arr.weights[ri]} 1 0` }} key={ri}>
          {row.map((idx) => {
            const x = shots[idx];
            return (
              <figure className="gal" style={{ flex: `${rs[idx]} 1 0` }} key={idx} {...F(`${sid}:shot:${idx}`)}>
                {x.image ? <FitImage src={x.image} alt={x.caption || ''} className="gal-img-frame" imgStyle={{ objectPosition: x.focus || 'center' }} /> : <div className="gal-img empty" />}
                {has(x.caption) && <figcaption>{x.caption}</figcaption>}
              </figure>
            );
          })}
        </div>
      ))}
    </div>
  );
}

/** Accessory card image: frame follows the item image orientation. */
function AccImg({ it }: { it: AccItem }) {
  const o = useOrient(it.image, it.orient);
  return it.image
    ? <FitImage src={it.image} alt="" className={`acc-img-frame${o === 'portrait' ? ' portrait' : ''}`} imgStyle={{ objectPosition: it.focus || 'center' }} />
    : <div className="acc-img empty" />;
}

/** Text-page image block: frame follows the image orientation. */
function TextImage({ s, fid }: { s: Section; fid: Record<string, any> }) {
  const o = useOrient(s.image, s.imageOrient);
  return (
    <div className={`text-image${o === 'portrait' ? ' port' : ''}`} {...fid}>
      {has(s.image)
        ? <FitImage src={s.image!} alt="" className="text-img-frame" imgClassName={o === 'portrait' ? 'img-contain' : ''} imgStyle={{ objectPosition: s.imageFocus || 'center' }} />
        : <div className="text-image-empty" />}
    </div>
  );
}

/**
 * FitBox — guarantees its content never overflows vertically: it measures the
 * natural content height against the available height and scales the box down
 * (transform, with width compensation) when needed. If even the minimum scale
 * (0.55) is not enough, it marks itself with data-over="true" so the editor
 * can warn the user to shorten the text.
 */
function FitBox({ className, children }: { className?: string; children: React.ReactNode }) {
  const ref = React.useRef<HTMLDivElement>(null);
  useIsoLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    const apply = () => {
      const avail = el.clientHeight;
      const need = el.scrollHeight;
      let f = avail > 0 && need > 0 ? Math.min(1, avail / need) : 1;
      const clamped = f < 0.55;
      if (clamped) f = 0.55;
      f = Math.round(f * 1000) / 1000;
      // Scale only — never widen: with aspect-ratio boxes (image frames), a
      // wider layout is also TALLER, which feeds back and defeats the fit.
      // (Transforms don't affect layout, so no reset is needed to measure.)
      const next = f < 1 ? `scale(${f})` : '';
      if (el.style.transform !== next) el.style.transform = next;
      if (clamped) el.dataset.over = 'true';
      else if (el.dataset.over) delete el.dataset.over;
    };
    const schedule = () => requestAnimationFrame(apply);
    apply();
    const t = setTimeout(apply, 250);
    (document as any).fonts?.ready?.then(apply).catch(() => {});
    // Re-measure when content changes after mount: orientation detection sets
    // classes, images finish loading, captions render, etc.
    const mo = new MutationObserver(schedule);
    mo.observe(el, { attributes: true, childList: true, subtree: true, characterData: true });
    el.addEventListener('load', schedule, true);
    return () => { clearTimeout(t); mo.disconnect(); el.removeEventListener('load', schedule, true); };
  });
  return <div className={className} ref={ref} style={{ transformOrigin: 'top center' }}>{children}</div>;
}

const LOGO_SRC = '/Images/logos/Fara%20fundal%202.png';

interface DocProps {
  offer: Offer; coverOnly?: boolean;
  editable?: boolean; activeField?: string | null; onFieldClick?: (fid: string) => void;
}

export default function OfferDocument({ offer: raw, coverOnly, editable, activeField, onFieldClick }: DocProps) {
  const offer = normalizeOffer(raw);
  const st = getStyle(offer.style);
  const rootClass = `offer-doc style-${st.id}`;
  // The palette comes from the style class in offer.css; only the accent is
  // overridden inline when the user picks a custom colour.
  const docStyle = (offer.accent ? { '--gold': offer.accent, '--gold-2': offer.accent } : {}) as React.CSSProperties;

  const F = (fid: string): Record<string, any> =>
    editable ? { 'data-fid': fid, 'data-active': activeField === fid ? 'true' : undefined, onClick: (e: React.MouseEvent) => { e.stopPropagation(); onFieldClick?.(fid); } } : {};

  const subtitle = offer.coverSubtitle || 'MOBILIER PERSONALIZAT';
  const words = subtitle.split(' ');
  const date = offer.date || '';
  const coverTags = offer.tags && offer.tags.length ? offer.tags : (has(offer.category) ? [offer.category!] : []);

  const logoSrc = offer.logoImage || LOGO_SRC;
  const logo = (
    <div className="cover-logo" {...F('cover:logoImage')}>
      <div className="logo-text">
        <span className="cl-jl">JL</span>
        <span className="cl-sub">CUSTOM<br />DESIGN</span>
      </div>
      <img className="logo-img" src={logoSrc} alt="Logo" />
    </div>
  );

  // Landscape covers don't fit tall side slots: show the whole image (contain)
  // unless the user explicitly chose "Umplere" (cover fill). Orientation comes
  // from the offer or is detected at runtime for older offers.
  const detectedCoverOrient = useOrient(offer.coverImage, offer.coverImageOrient);
  const coverFit = offer.coverFit || 'auto';
  // Landscape covers default to the full-width layout (image spans the whole
  // top, logo sits bottom-right next to the title) unless the user picked a
  // composition explicitly.
  const layout = offer.coverLayout || (detectedCoverOrient === 'landscape' ? 'full' : st.layout);
  // In tall side slots a landscape image would be cropped: show it whole
  // (contain) unless the user explicitly chose "Umplere" (cover fill).
  const containCover = coverFit === 'contain' || (coverFit === 'auto' && detectedCoverOrient === 'landscape' && (layout === 'left' || layout === 'right'));

  const coverTitle = (
    <div className="cover-title" {...F('cover:coverSubtitle')}>
      <span className="ct-thin">{words[0]}</span>
      {words.length > 1 && <> <span className="ct-bold">{words.slice(1).join(' ')}</span></>}
    </div>
  );

  const cover = (
    <section className={`offer-page cover lay-${layout}`}>
      <div className={`cover-media${containCover ? ' contain' : ''}`} {...F('cover:coverImage')}>
        {offer.coverImage ? <FitImage src={offer.coverImage} alt="" className="cover-img-frame" imgClassName={containCover ? 'img-contain' : ''} imgStyle={{ objectPosition: offer.coverImageFocus || 'center' }} /> : <div className="cover-media-empty" />}
      </div>
      <FitBox className="cover-panel">
        {layout === 'full' ? (
          <>
            {/* Full-width image: title bottom-left, logo bottom-right, same row. */}
            <div className="cf-row">
              <div className="cf-text">
                {coverTitle}
                <div className="cover-client">
                  <div className="cc-name" {...F('cover:clientName')}>{offer.isTemplate ? offer.templateName || 'Nume șablon' : offer.clientName || 'Nume client'}</div>
                  {coverTags.length > 0 && <div className="cc-cat" {...F('cover:tags')}>{coverTags.join(' · ')}</div>}
                </div>
              </div>
              {logo}
            </div>
            <div className="cover-foot">
              <span {...F('cover:websiteUrl')}>{offer.websiteUrl}</span>
              <span {...F('cover:date')}>{date}</span>
            </div>
          </>
        ) : (
          <>
            {logo}
            <div className="cover-spacer" />
            {coverTitle}
            <div className="cover-client">
              <div className="cc-name" {...F('cover:clientName')}>{offer.isTemplate ? offer.templateName || 'Nume șablon' : offer.clientName || 'Nume client'}</div>
              {coverTags.length > 0 && <div className="cc-cat" {...F('cover:tags')}>{coverTags.join(' · ')}</div>}
            </div>
            <div className="cover-foot">
              <span {...F('cover:websiteUrl')}>{offer.websiteUrl}</span>
              <span {...F('cover:date')}>{date}</span>
            </div>
          </>
        )}
      </FitBox>
    </section>
  );

  if (coverOnly) return <div className={rootClass} style={docStyle}>{cover}</div>;

  return (
    <div className={rootClass} style={docStyle}>
      {cover}
      {offer.pages.map((s, idx) => <Page key={s.id} s={s} num={String(idx + 1).padStart(2, '0')} date={date} F={F} editable={!!editable} logoSrc={logoSrc} />)}
    </div>
  );
}

function Page({ s, num, date, F, editable, logoSrc }: { s: Section; num: string; date: string; F: (fid: string) => Record<string, any>; editable: boolean; logoSrc: string }) {
  const para = (cls = '') => <p className={`s-para ${cls}`} {...F(`${s.id}:paragraph`)}>{s.paragraph}</p>;

  let textContent: React.ReactNode = null;
  let mediaContent: React.ReactNode = null;
  let bodyDir: 'col' | 'row' = 'col';
  let mediaBeforeText = false;
  let finishesContent: React.ReactNode = null;
  /** For text pages with image-on-top, the strip is hoisted above the header. */
  let topImg: React.ReactNode = null;

  if (s.type === 'description') {
    const wide = s.imageLayout === 'wide' && (has(s.image) || editable);
    textContent = (
      <>
        {para()}
        <div className="block-label">Specificații tehnice</div>
        <div className="spec-list">
          {(s.specs || []).filter((x) => x.label || x.value).map((x, i) => (
            <div className="spec" key={i} {...F(`${s.id}:spec:${i}`)}><span className="spec-label">{x.label}</span><span className="spec-value">{x.value}</span></div>
          ))}
        </div>
      </>
    );
    if (wide) {
      bodyDir = 'col';
      mediaBeforeText = true;
      mediaContent = <div className="desc-wide-img"><SideImg s={s} fid={F(`${s.id}:image`)} /></div>;
    } else if (has(s.image) || editable) {
      bodyDir = 'row';
      mediaContent = <div className="sheet-media side-media"><SideImg s={s} fid={F(`${s.id}:image`)} /></div>;
    }
  } else if (s.type === 'materials') {
    const visibleSwatches = (s.swatches || []).filter((x) => x.label || x.code || x.image);
    const swatchCols = visibleSwatches.length <= 3 ? 1 : 2;
    textContent = (
      <>
        {para()}
        <div className={`swatches swatches-cols-${swatchCols}`}>
          {visibleSwatches.map((x, i) => (
            <div className="swatch" key={i} {...F(`${s.id}:swatch:${i}`)}>
              {x.image ? <FitImage src={x.image} alt="" className="swatch-img-frame" /> : <div className="swatch-img empty" />}
              <div className="swatch-label">{x.label}</div><div className="swatch-code">{x.code}</div>
            </div>
          ))}
        </div>
      </>
    );
    finishesContent = (
      <div className="materials-finishes-bar">
        <div className="block-label materials-finishes-label">Finisaje</div>
        <div className="badges materials-finishes">
          {(s.finishes || []).filter((b) => b.label).map((b, i) => (
            <div className="badge-pill" key={i} {...F(`${s.id}:finish:${i}`)}><span className="bp-dot" /><div><div className="bp-label">{b.label}</div>{has(b.desc) && <div className="bp-desc">{b.desc}</div>}</div></div>
          ))}
        </div>
      </div>
    );
    if (has(s.image) || editable) {
      bodyDir = 'row';
      mediaContent = <div className="sheet-media side-media mat-side"><SideImg s={s} fid={F(`${s.id}:image`)} /></div>;
    }
  } else if (s.type === 'accessories') {
    textContent = (
      <>
        {para('wide')}
        <div className="block-label">Beneficii</div>
        <div className="badges">
          {(s.benefits || []).filter((b) => b.label).map((b, i) => (
            <div className="badge-pill" key={i} {...F(`${s.id}:benefit:${i}`)}><span className="bp-dot" /><div><div className="bp-label">{b.label}</div></div></div>
          ))}
        </div>
      </>
    );
    bodyDir = 'col';
    mediaContent = (
      <div className="acc-grid sheet-media acc-media">
        {(s.items || []).filter((i) => editable || i.title || i.image || i.description).map((it, i) => (
          <div className={`acc-card${it.image ? '' : ' no-img'}`} key={i} {...F(`${s.id}:item:${i}`)}>
            <AccImg it={it} />
            {(it.title || it.description) && <div className="acc-body"><div className="acc-title">{it.title}</div><div className="acc-desc">{it.description}</div></div>}
          </div>
        ))}
      </div>
    );
  } else if (s.type === 'sketches') {
    const shots = (editable ? (s.shots || []) : (s.shots || []).filter((x) => x.image)).slice(0, 6); // max 6 per page
    textContent = (
      <>
        {para('wide')}
        <div className="block-label">Date tehnice</div>
        <div className="dims">
          {(s.dims || []).filter((d) => d.title || d.lines).map((d, i) => (
            <div className="dim" key={i} {...F(`${s.id}:dim:${i}`)}><div className="dim-title">{d.title}</div>{d.lines.split('\n').filter(Boolean).map((l, j) => <div className="dim-line" key={j}>{l}</div>)}</div>
          ))}
        </div>
      </>
    );
    bodyDir = 'col';
    mediaContent = (
      <div className="sketch-row sheet-media sketch-media">
        {shots.map((x, i) => <SketchFigure key={i} x={x} fid={F(`${s.id}:shot:${i}`)} />)}
      </div>
    );
  } else if (s.type === 'gallery') {
    const all = editable ? (s.shots || []) : (s.shots || []).filter((x) => x.image);
    const shots = all.slice(0, 5); // max 5 images per gallery page
    textContent = para('wide');
    bodyDir = 'col';
    mediaContent = <Gallery shots={shots} F={F} sid={s.id} />;
  } else {
    const tl: TextLayout = s.textLayout || 'bottom';
    const imgBlock = tl !== 'none' && (has(s.image) || editable) ? <TextImage s={s} fid={F(`${s.id}:image`)} /> : null;
    if (tl === 'top') topImg = imgBlock ? <div className="sheet-topimg">{imgBlock}</div> : null;
    // Combine the main paragraph with optional extra text blocks.
    const blocks = [s.paragraph, ...(s.paragraphs || [])].filter((b): b is string => !!b);
    const blockEls = blocks.map((block, bidx) => {
      const lines = (typeof block === 'string' ? block : '').split('\n').filter(Boolean);
      const paras = lines.filter((l) => !l.trimStart().startsWith('- '));
      const items = lines.filter((l) => l.trimStart().startsWith('- ')).map((l) => l.trimStart().slice(2));
      return (
        <div className="text-block" key={bidx}>
          <div className="text-body" {...(bidx === 0 ? F(`${s.id}:paragraph`) : {})}>
            {paras.map((l, j) => <p key={j}>{l}</p>)}
          </div>
          {items.length > 0 && (
            <ul className="text-list">
              {items.map((l, j) => <li key={j}>{l}</li>)}
            </ul>
          )}
        </div>
      );
    });
    textContent = <div className={`text-blocks lay-${tl}`}>{blockEls}</div>;
    if (tl === 'left') { bodyDir = 'row'; mediaBeforeText = true; mediaContent = imgBlock ? <div className="sheet-media text-media-side">{imgBlock}</div> : null; }
    else if (tl === 'right') { bodyDir = 'row'; mediaContent = imgBlock ? <div className="sheet-media text-media-side">{imgBlock}</div> : null; }
    else if (tl === 'bottom') { bodyDir = 'col'; mediaContent = imgBlock ? <div className="sheet-media text-media-bottom">{imgBlock}</div> : null; }
    else { bodyDir = 'col'; }
  }

  return (
    <section className="offer-page sheet" style={{ '--fs': s.fontScale ?? 1 } as React.CSSProperties}>
      {topImg}
      <div className="sheet-head">
        <span className="num">{num}</span>
        <h2 className={`s-heading${s.headingBold ? ' xb' : ''}`} {...F(`${s.id}:heading`)}>{s.heading}</h2>
        <img className="sheet-logo" src={logoSrc} alt="" {...F('cover:logoImage')} />
      </div>
      {s.type === 'materials' && finishesContent ? (
        <div className="sheet-body col mat-body">
          <div className="sheet-body row mat-top">
            <FitBox className="sheet-fit">{textContent}</FitBox>
            {mediaContent}
          </div>
          {finishesContent}
        </div>
      ) : (
        <div className={`sheet-body ${bodyDir === 'row' ? 'row' : 'col'}`}>
          {mediaBeforeText && mediaContent}
          <FitBox className={`sheet-fit${s.type === 'gallery' || s.type === 'accessories' || s.type === 'sketches' ? ' fit-compact' : ''}`}>{textContent}</FitBox>
          {!mediaBeforeText && mediaContent}
        </div>
      )}
      <div className="sheet-foot"><span>{date}</span></div>
    </section>
  );
}
