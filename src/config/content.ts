/**
 * content.ts — single source of truth for ALL user-facing text & images.
 *
 * The VALUES now live in `content.data.json` so they can be edited from the
 * admin panel (/admin → "Conținut site") — text and images alike. This file
 * just re-exports them, so every existing `import { HERO } from '../config/content'`
 * keeps working exactly as before.
 *
 * ✏️  To change site copy/images: use the admin, or edit content.data.json.
 */
import data from './content.data.json';

export const NAV = data.NAV;
export const HOME = data.HOME;
export const HERO = data.HERO;
export const ABOUT_SECTION = data.ABOUT_SECTION;
export const SERVICES_SECTION = data.SERVICES_SECTION;
export const PORTFOLIO_SECTION = data.PORTFOLIO_SECTION;
export const PROCESS = data.PROCESS;
export const BLOG_PREVIEW = data.BLOG_PREVIEW;
export const BREADCRUMBS = data.BREADCRUMBS;
export const FAQ = data.FAQ;
export const FOOTER = data.FOOTER;
export const SERVICES_PAGE = data.SERVICES_PAGE;
export const ABOUT_PAGE = data.ABOUT_PAGE;
export const PORTFOLIO_PAGE = data.PORTFOLIO_PAGE;
export const BLOG_PAGE = data.BLOG_PAGE;
export const CONTACT_PAGE = data.CONTACT_PAGE;
export const CONTACT_FAB = data.CONTACT_FAB;
export const BRANDBOOK_PAGE = data.BRANDBOOK_PAGE;
export const CONTACT_MODAL = data.CONTACT_MODAL;
export const TEST_PAGE = data.TEST_PAGE;
