/**
 * offerStyles.ts — five distinct DESIGN styles for offer documents.
 * A style controls mode (light/dark), typography, cover composition and accent.
 * The palette is applied via a `.style-<id>` class in offer.css (which re-defines
 * the CSS vars); the accent colour is overridable per-offer (color picker).
 */
export interface OfferStyle {
  id: string;
  name: string;
  mode: 'light' | 'dark';
  /** Default accent (gold/colour). Overridable via offer.accent. */
  accent: string;
  /** Cover composition. */
  layout: 'right' | 'left' | 'top';
  /** Short description for the picker. */
  blurb: string;
}

export const STYLES: Record<string, OfferStyle> = {
  editorial: { id: 'editorial', name: 'Editorial', mode: 'light', accent: '#b8975a', layout: 'right', blurb: 'Cald, crem, accent auriu — stilul clasic JL.' },
  noir: { id: 'noir', name: 'Noir', mode: 'dark', accent: '#caa96a', layout: 'right', blurb: 'Negru dramatic, text deschis, accent auriu.' },
  bold: { id: 'bold', name: 'Bold', mode: 'light', accent: '#161616', layout: 'top', blurb: 'Tipografie mare, alb-negru, modern.' },
  classic: { id: 'classic', name: 'Clasic', mode: 'light', accent: '#9c7c4f', layout: 'top', blurb: 'Elegant, centrat, cu titluri serif.' },
  minimal: { id: 'minimal', name: 'Minimal', mode: 'light', accent: '#8a8276', layout: 'left', blurb: 'Mult spațiu alb, linii fine, discret.' },
};

export const STYLE_LIST = Object.values(STYLES);
export const getStyle = (id?: string): OfferStyle => STYLES[id || 'editorial'] || STYLES.editorial;

/** Preset accent colours offered in the editor (plus a free color picker). */
export const ACCENT_PRESETS = ['#b8975a', '#caa96a', '#9c7c4f', '#161616', '#8a8276', '#7e8b96', '#8a7d4e', '#a9603f'];
