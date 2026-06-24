# JL Custom Design — Admin & Content System

This document explains the **custom admin panel** that replaced Keystatic, the
**offer maker** (branded PDF generator), and the **site content editor**. It is
the map a developer needs to navigate everything that was added.

---

## 1. Overview

The site is an **Astro 5 SSR app** (`output: 'server'`) deployed on **Vercel**,
with **GitHub as the database**: every content change is committed to the repo
(`RobertGyorgy/JL-Design`), which triggers a Vercel redeploy.

A custom admin lives at **`/admin`** with four sections:

| Tab | What it manages | Stored as |
|---|---|---|
| **Portofoliu** | Projects (name, category, image, description) | `src/content/portfolio/*.mdoc` |
| **Blog** | Articles (title, SEO, cover, markdown body) | `src/content/blog/*.mdoc` |
| **Generator oferte** | Branded project offers / PDFs | `src/content/offers/*.json` |
| **Conținut site** | All site text + images | `src/config/content.data.json` |

Keystatic was removed (`keystatic.config.ts` deleted, integration removed from
`astro.config.mjs`). The two OAuth route files under
`src/pages/api/keystatic/github/` were **kept and generalized** — only the
*path* still says "keystatic" because that exact callback URL is registered in
the GitHub OAuth app. **Do not rename those routes.**

---

## 2. Authentication

GitHub OAuth, reusing the existing OAuth app (no new secrets).

- **Login:** `/api/keystatic/github/login?from=/admin` → GitHub →
  `/api/keystatic/github/oauth/callback` → stores the token in the
  `keystatic-gh-access-token` cookie → redirects to `/admin`.
- **Gate:** `src/lib/admin/auth.ts`. In **production** a request must have a
  valid token **and** push access to the repo (`canPush`) — so only real
  collaborators can edit. In **development** auth is bypassed (you're "Local Dev").
- Env vars (already in `.env` / Vercel): `KEYSTATIC_GITHUB_CLIENT_ID`,
  `KEYSTATIC_GITHUB_CLIENT_SECRET`.

---

## 3. Backend libraries — `src/lib/admin/`

| File | Responsibility |
|---|---|
| `config.ts` | Repo constants, paths, `IS_DEV`, token cookie name |
| `auth.ts` | `getAuth` / `requireAuth` (dev bypass; prod token + push check) |
| `github.ts` | GitHub REST helpers: read files, list dir, **atomic multi-file commit** (Git Data API) |
| `store.ts` | `readCollection` / `applyChanges` — abstracts **dev = filesystem**, **prod = GitHub commit** |
| `content.ts` | Pure helpers: slugify, frontmatter (de)serialize, **image → WebP** (sharp) |
| `collections.ts` | Per-collection rules: turn form data into repo files (`buildSave`) and figure out what to delete (`buildDelete`) |

**Important — `buildDelete` only deletes images an entry OWNS** (offers → files
under `/assets/offers/<slug>/`; portfolio/blog → the slug-named image). It must
**never** delete a shared image (an offer can reuse a portfolio photo).

### API routes — `src/pages/api/admin/`
- `me.ts` — auth status (used by the admin UI)
- `data.ts` — returns all collections (portfolio, blog, categories, offers)
- `save.ts` — create/update an entry (converts uploaded `data:` images to WebP)
- `delete.ts` — delete an entry (+ its owned images)
- `site.ts` — GET/POST the **site content** (`content.data.json`)
- `logout.ts` — clears the token cookie

Images arrive as `data:` URLs (downscaled client-side), are re-encoded to WebP
by `sharp` server-side, and written under `public/assets/<collection>/`.

---

## 4. Admin UI — `src/components/admin/`

A React app mounted in `src/pages/admin/index.astro` (`client:only="react"`),
styled by `src/styles/admin.css` (self-contained, brand-matched, independent of
the site's Tailwind theme).

| File | Responsibility |
|---|---|
| `AdminApp.tsx` | Shell: pill navbar, tab routing, data loading, toasts. Persists the active tab in `sessionStorage`. |
| `api.ts` | Client fetch helpers + **client-side image downscale** before upload |
| `ui.tsx` | Shared controls: `Field`, `TextInput`, `TextArea`, `ImageInput`, `MarkdownEditor`, `Toast`, `SectionHead` |
| `PortfolioManager.tsx` | Portfolio CRUD (+ inline category creation) |
| `BlogManager.tsx` | Blog CRUD (markdown editor, SEO fields) |
| `OfferManager.tsx` | The offer maker (see §5) |
| `SiteContentManager.tsx` | The site content editor (see §6) |
| `offerTemplates.ts` | The 5 starting templates (one per design style) |

---

## 5. Offer maker (branded PDFs)

### Document model
An offer = **cover + ordered `pages[]`**. Each page (`Section`) has a `type`:
`description | materials | accessories | sketches | gallery | text`. Old
fixed-shape offers are migrated by `normalizeOffer()`.

- `src/components/offer/OfferDocument.tsx` — renders the document. Pure render +
  an **editable mode** (adds `data-fid` + click handlers for form ⇄ preview sync).
  Used by the admin preview **and** the public page.
- `src/components/offer/offerStyles.ts` — **5 design styles**: `editorial`
  (light/gold), `noir` (dark), `bold` (white/mono), `classic` (ivory/serif),
  `minimal`. A style is applied via a `.style-<id>` class in `offer.css` that
  re-defines the palette CSS vars (so **dark mode is a clean var swap**). Each
  offer can override the **accent colour** and **cover composition** (right/left/top).
- `src/styles/offer.css` — all document styles. Sizes use **container units
  (`cqw`)** so the document scales identically on screen and in print.

### Editing UX (`OfferManager.tsx`)
- **Split screen**: form left, **live preview** right (instant updates).
- **Bidirectional click-to-edit**: click an element in the preview → the matching
  form field is focused/scrolled; focusing a field scrolls the preview to it.
- **Templates** are shown as a **card grid** (like the projects list); click a
  card to start.
- **Autosave**: debounced (~1.8 s) once the offer has a client name. A status
  indicator shows "Se salvează… / Salvat automat".

### Output
- Public page: **`/oferta/<slug>`** (`src/pages/oferta/[slug].astro`) —
  shareable, `noindex`.
- PDF: **`/oferta/<slug>.pdf`** (`src/pages/oferta/[slug].pdf.ts`) — a **real
  download** rendered with headless Chrome. Dev uses the system Chrome
  (`CHROME_PATH` overridable); prod uses `puppeteer-core` + `@sparticuz/chromium`
  (kept external in `astro.config.mjs` → `vite.ssr.external`). PDFs can be large
  because they embed full-res images.

---

## 6. Site content editor ("Conținut site")

All user-facing copy + images were moved out of `src/config/content.ts` into
**`src/config/content.data.json`**. `content.ts` now just re-exports the JSON, so
every existing `import { HERO } from '../config/content'` keeps working.

> To regenerate the JSON from a `.ts` content file: strip ` as <Type>` casts,
> import the file as `.mjs`, then `JSON.stringify` the exports.

### Editor (`SiteContentManager.tsx`)
- **Page-based**: tabs (Acasă / Despre / Servicii / …); each shows that page's
  sections.
- **Split screen**: form left, **live `<iframe>` of the page** right, with a
  **Desktop / Mobil** device toggle (desktop = scaled 16:9 frame; mobile = a
  fixed phone frame, centered).
- **Click-to-edit across the iframe**, powered by **`public/cms-overlay.js`**:
  the overlay is injected by `Layout.astro` **only when the URL has `?cms=1`**.
  It matches rendered text/images to content paths, so:
  - click an element in the preview → its form field is selected;
  - focus a field → the preview scrolls/flashes that element;
  - edit a field → the preview **updates live** (postMessage).
  Communication: `{source:'cms'}` iframe→editor, `{target:'cms'}` editor→iframe.
- In `?cms=1` mode the custom cursor is hidden and the **system cursor** is shown
  (`body.cms-preview` overrides the `cursor:none` rule in `Layout.astro`).

---

## 7. Dev notes & gotchas

- **The dev watcher ignores `src/content/offers/**`** (`astro.config.mjs` →
  `vite.server.watch.ignored`). Without this, saving/autosaving an offer would
  hot-reload the whole admin and bounce you to the list. Because of this,
  `/oferta` and the PDF route **read offers straight from disk in dev** (prod
  uses the bundled `getCollection`). New offers are therefore viewable instantly
  in dev.
- **Offers are an Astro `data` collection** (`glob` JSON loader in
  `src/content/config.ts`).
- **Blog frontmatter is flat** (matches `src/content/config.ts`), e.g.
  `title, description, coverImage, coverImageAlt, category, author, publishedDate`.
- **Portfolio `category`** is the *slug* of a file in `src/content/categories/`.
- Uploaded images become **WebP**; `preferWebp()` swaps `.jpg/.png` → `.webp`
  when a webp twin exists.
- In production, content changes go live **after the commit triggers a Vercel
  redeploy** (same model Keystatic used). Autosave therefore produces one commit
  per save burst — increase the debounce in `OfferManager.tsx` if that's noisy.

### Run it
```bash
npm run dev      # http://localhost:4321  (admin at /admin, auth bypassed in dev)
npm run build    # production build
```
PDF generation in dev needs Chrome at the default macOS path, or set
`CHROME_PATH`.

---

## 8. Where to change things

| I want to… | Edit |
|---|---|
| Add an offer page type | `OfferDocument.tsx` (renderer) + `OfferManager.tsx` (editor) + `offer.css` |
| Add/tweak an offer design style | `offerStyles.ts` + `.style-<id>` block in `offer.css` |
| Add an offer template | `offerTemplates.ts` |
| Change how images are stored/deleted | `collections.ts` |
| Change site copy/images | the admin (Conținut site) or `content.data.json` |
| Add a new admin section | new `*Manager.tsx` + tab in `AdminApp.tsx` (+ API route if needed) |
| Adjust the GitHub commit logic | `github.ts` (`commitChanges`) |
