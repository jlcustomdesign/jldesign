/**
 * OfferDocument.tsx — renders an offer as a branded, minimalist multi-page
 * presentation. COVER (editorial split: image + text panel) + ordered `pages`.
 * Optional "editable" mode used by the admin live preview: every editable
 * element carries a `data-fid` and is clickable so the editor can sync
 * form ⇄ preview. Styles: src/styles/offer.css. Palette: offerThemes.
 */
import React from 'react';
import { getStyle } from './offerStyles';

export type SectionType = 'description' | 'materials' | 'accessories' | 'sketches' | 'gallery' | 'text';

export interface Spec { label: string; value: string; }
export interface Swatch { label: string; code: string; image?: string; }
export interface Badge { label: string; desc?: string; }
export interface AccItem { image?: string; title: string; description: string; }
export interface Shot { image?: string; caption?: string; }
export interface DimBlock { title: string; lines: string; }

export interface Section {
  id: string; type: SectionType; label?: string; heading: string; paragraph: string; image?: string;
  specs?: Spec[]; swatches?: Swatch[]; finishes?: Badge[]; items?: AccItem[]; benefits?: Badge[]; shots?: Shot[]; dims?: DimBlock[];
}

export interface Offer {
  clientName: string; category?: string; tags?: string[]; date: string; websiteUrl?: string;
  coverImage?: string; coverSubtitle?: string;
  style?: string; accent?: string; coverLayout?: 'right' | 'left' | 'top';
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

interface DocProps {
  offer: Offer; coverOnly?: boolean;
  editable?: boolean; activeField?: string | null; onFieldClick?: (fid: string) => void;
}

export default function OfferDocument({ offer: raw, coverOnly, editable, activeField, onFieldClick }: DocProps) {
  const offer = normalizeOffer(raw);
  const st = getStyle(offer.style);
  const layout = offer.coverLayout || st.layout;
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

  const logo = (
    <div className="cover-logo">
      <div className="logo-text">
        <span className="cl-jl">JL</span>
        <span className="cl-sub">CUSTOM<br />DESIGN</span>
      </div>
      <img className="logo-img" src="/Images/logos/Fara%20fundal%202.png" alt="JL Custom Design Logo" />
    </div>
  );

  const cover = (
    <section className={`offer-page cover lay-${layout}`}>
      <div className="cover-media" {...F('cover:coverImage')}>
        {offer.coverImage ? <img src={offer.coverImage} alt="" /> : <div className="cover-media-empty" />}
      </div>
      <div className="cover-panel">
        {logo}
        <div className="cover-spacer" />
        <div className="cover-title" {...F('cover:coverSubtitle')}>
          {words.map((w, i) => <span key={i} className={i === 0 ? 'ct-thin' : 'ct-bold'}>{w}</span>)}
        </div>
        <div className="cover-client">
          <div className="cc-name" {...F('cover:clientName')}>{offer.isTemplate ? offer.templateName || 'Nume șablon' : offer.clientName || 'Nume client'}</div>
          {coverTags.length > 0 && <div className="cc-cat" {...F('cover:tags')}>{coverTags.join(' · ')}</div>}
        </div>
        <div className="cover-foot">
          <span {...F('cover:websiteUrl')}>{offer.websiteUrl}</span>
          <span {...F('cover:date')}>{date}</span>
        </div>
      </div>
    </section>
  );

  if (coverOnly) return <div className={rootClass} style={docStyle}>{cover}</div>;

  return (
    <div className={rootClass} style={docStyle}>
      {cover}
      {offer.pages.map((s, idx) => <Page key={s.id} s={s} num={String(idx + 1).padStart(2, '0')} date={date} F={F} editable={!!editable} />)}
    </div>
  );
}

function Page({ s, num, date, F, editable }: { s: Section; num: string; date: string; F: (fid: string) => Record<string, any>; editable: boolean }) {
  const label = s.label || DEFAULT_LABEL[s.type];
  const para = (cls = '') => <p className={`s-para ${cls}`} {...F(`${s.id}:paragraph`)}>{s.paragraph}</p>;

  let main: React.ReactNode = null;

  if (s.type === 'description') {
    main = (
      <div className={`cols${has(s.image) || editable ? '' : ' no-img'}`}>
        <div className="col-left">
          {para()}
          <div className="block-label">Specificații tehnice</div>
          <div className="spec-list">
            {(s.specs || []).filter((x) => x.label || x.value).map((x, i) => (
              <div className="spec" key={i} {...F(`${s.id}:spec:${i}`)}><span className="spec-label">{x.label}</span><span className="spec-value">{x.value}</span></div>
            ))}
          </div>
        </div>
        {(has(s.image) || editable) && <div className="col-right">{has(s.image) ? <img src={s.image} alt="" {...F(`${s.id}:image`)} /> : <div className="col-right-empty" {...F(`${s.id}:image`)} />}</div>}
      </div>
    );
  } else if (s.type === 'materials') {
    main = (
      <div className={`cols${has(s.image) || editable ? '' : ' no-img'}`}>
        <div className="col-left">
          {para()}
          <div className="swatches">
            {(s.swatches || []).filter((x) => x.label || x.code || x.image).map((x, i) => (
              <div className="swatch" key={i} {...F(`${s.id}:swatch:${i}`)}>
                <div className={`swatch-img${x.image ? '' : ' empty'}`} style={x.image ? { backgroundImage: `url(${x.image})` } : undefined} />
                <div className="swatch-label">{x.label}</div><div className="swatch-code">{x.code}</div>
              </div>
            ))}
          </div>
          <div className="block-label">Finisaje</div>
          <div className="badges">
            {(s.finishes || []).filter((b) => b.label).map((b, i) => (
              <div className="badge-pill" key={i} {...F(`${s.id}:finish:${i}`)}><span className="bp-dot" /><div><div className="bp-label">{b.label}</div>{has(b.desc) && <div className="bp-desc">{b.desc}</div>}</div></div>
            ))}
          </div>
        </div>
        {(has(s.image) || editable) && <div className="col-right">{has(s.image) ? <img src={s.image} alt="" {...F(`${s.id}:image`)} /> : <div className="col-right-empty" {...F(`${s.id}:image`)} />}</div>}
      </div>
    );
  } else if (s.type === 'accessories') {
    main = (
      <>
        {para('wide')}
        <div className="acc-grid">
          {(s.items || []).filter((i) => i.title || i.image || i.description).map((it, i) => (
            <div className={`acc-card${it.image || editable ? '' : ' no-img'}`} key={i} {...F(`${s.id}:item:${i}`)}>
              {(it.image || editable) && <div className={`acc-img${it.image ? '' : ' empty'}`} style={it.image ? { backgroundImage: `url(${it.image})` } : undefined} />}
              <div className="acc-body"><div className="acc-title">{it.title}</div><div className="acc-desc">{it.description}</div></div>
            </div>
          ))}
        </div>
        <div className="block-label">Beneficii</div>
        <div className="badges">
          {(s.benefits || []).filter((b) => b.label).map((b, i) => (
            <div className="badge-pill" key={i} {...F(`${s.id}:benefit:${i}`)}><span className="bp-dot" /><div className="bp-label">{b.label}</div></div>
          ))}
        </div>
      </>
    );
  } else if (s.type === 'sketches') {
    const shots = editable ? (s.shots || []) : (s.shots || []).filter((x) => x.image);
    main = (
      <>
        {para('wide')}
        <div className="sketch-row">
          {shots.map((x, i) => (
            <figure className="sketch" key={i} {...F(`${s.id}:shot:${i}`)}>
              {x.image ? <img src={x.image} alt={x.caption || ''} /> : <div className="sketch-empty" />}
              {has(x.caption) && <figcaption>{x.caption}</figcaption>}
            </figure>
          ))}
        </div>
        <div className="block-label">Date tehnice</div>
        <div className="dims">
          {(s.dims || []).filter((d) => d.title || d.lines).map((d, i) => (
            <div className="dim" key={i} {...F(`${s.id}:dim:${i}`)}><div className="dim-title">{d.title}</div>{d.lines.split('\n').filter(Boolean).map((l, j) => <div className="dim-line" key={j}>{l}</div>)}</div>
          ))}
        </div>
      </>
    );
  } else if (s.type === 'gallery') {
    const shots = editable ? (s.shots || []) : (s.shots || []).filter((x) => x.image);
    main = (
      <>
        {para('wide')}
        <div className={`gallery-grid g${Math.min(shots.length, 4) || 1}`}>
          {shots.map((x, i) => (
            <figure className="gal" key={i} {...F(`${s.id}:shot:${i}`)}>
              <div className={`gal-img${x.image ? '' : ' empty'}`} style={x.image ? { backgroundImage: `url(${x.image})` } : undefined} />
              {has(x.caption) && <figcaption>{x.caption}</figcaption>}
            </figure>
          ))}
        </div>
      </>
    );
  } else {
    main = (
      <div className="text-wrap">
        <div className="text-body" {...F(`${s.id}:paragraph`)}>
          {s.paragraph.split('\n').filter(Boolean).map((l, j) => <p key={j}>{l}</p>)}
        </div>
        {(has(s.image) || editable) && <div className="text-image">{has(s.image) ? <img src={s.image} alt="" {...F(`${s.id}:image`)} /> : <div className="text-image-empty" {...F(`${s.id}:image`)} />}</div>}
      </div>
    );
  }

  return (
    <section className="offer-page sheet">
      <div className="sheet-head">
        <div className="eyebrow"><span className="num">{num}</span> {label}</div>
        <h2 className="s-heading" {...F(`${s.id}:heading`)}>{s.heading}</h2>
      </div>
      <div className="sheet-main">{main}</div>
      <div className="sheet-foot"><span className="ft-mono">JL</span><span>{date}</span></div>
    </section>
  );
}
