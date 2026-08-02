# PDF / Admin Changes Tracker

Status legend: `not done` | `in progress` | `done`

## Tasks

- [x] **1. Landscape cover images** — `done`
  Cover supports landscape images: `coverFit` (Auto / Umplere / Imagine întreagă) + auto orientation detection (stored at upload AND runtime detection for old offers).

- [x] **2. Text size editing mode** — `done`
  Per-page A− / A+ controls in each page card header (`fontScale` 0.8–1.3, shown as %). Applied via `--fs` on the page.

- [x] **3. Smaller PDF padding** — `done`
  `.sheet` padding 5/7/3.6 → 3.6/5/2.6 cqw; cover panel 7/6 → 5/4.5 cqw.

- [x] **4. Remove image crop, auto-arrange** — `done`
  `object-fit: contain` everywhere (neutral panel background); frames adapt to image orientation: side images 4/3 ↔ 4/5, sketches, accessories cards (16/10 ↔ 4/5), text images, gallery.

- [x] **5. Fix text/image overflow — nothing is ever cut** — `done`
  `FitBox` auto-fit: measures each page and scales content down (min 0.55) so it always fits. Re-measures on any content change (MutationObserver + image load). Scale-only, never widens (aspect-ratio frames would grow taller). `overflow: hidden` only on `.offer-page` (page-level guardrail), NOT on `.sheet-main` (would clip before the scale applies). Editor shows a red warning listing pages that still overflow at min scale.

- [x] **6. Preview jumps to edited page** — `done`
  „Previzualizează” tracks the last edited page and scrolls the full-screen preview directly to it.

- [x] **7. User-friendly editing tools** — `done`
  Page tool row: A− / % / A+ text size, **B** heading bold, **✕** delete page.

- [x] **8. Inline page logo** — `done`
  Round JL footer badge removed; cover logo image sits inline at the right of each page header. Slim footer: date + page number.

- [x] **9. Gallery (portfolio) redesign** — `done`
  Max 4 images. 6-column grid, dense flow: landscape images span 3 cols (16/10 frames), portraits span 2 cols (4/5 frames) — each image's frame and placement follows its own orientation; rows repack automatically. Single image = hero (21/9 or centred portrait).

- [x] **10. Text-section arrangement options** — `done`
  „Aranjare pagină”: Imagine jos / sus / stânga / dreapta / Doar text (`textLayout`).

- [x] **11. Copy template function** — `done`
  „Duplică” on template cards and offer cards — clones everything into a „… (copie)” draft.

- [x] **12. Landscape cover = full-width + logo bottom-right** — `done`
  New composition `lay-full`: landscape covers default to full-width image on top; panel below has title + client on the left and the logo bottom-right on the same row. Selectable in „Compoziție copertă” („Imagine lată sus”); auto-applied when a horizontal cover image is detected (hint shown in editor).

- [x] **13. Cover title max 2 rows** — `done`
  Title flows naturally (no per-word line breaks) and is clamped to 2 lines (`line-clamp: 2`) — long subtitles can never break the cover layout. First word stays thin/gold, the rest bold.

- [x] **14. Delete section button** — `done`
  ✕ button in each page card's tool row (with confirm).

- [x] **15. Mobile mode** — `done`
  Public offer page: compact top bar + tighter stage padding under 640px; the document scales proportionally (cqw units).

- [x] **16. Section images wiped on select (empty placeholder)** — `done` (needs your interactive re-test)
  Root cause: stale-closure race in OfferManager — `onChange` saved the image, then the async orientation `onMeta` wrote state built from the old render's `offer`, wiping the image. Fix: `setPage`/`setArr`/`updRow`/`addRowAt`/`delRowAt` all use functional `setOffer` updaters. (I can't log into `/admin` locally, so please confirm by adding an image in descriere/detalii/schițe/galerie.)

- [x] **17. Changeable logo** — `done`
  `logoImage` on the offer; picker in the cover card („Logo — opțional, implicit cel JL”). Used on the cover and every page header; persists as before when left empty.

- [x] **18. Text layouts actually change the layout (cover-like)** — `done`
  Rewrote text-page CSS: Imagine jos/sus = full-width 21/9 strips; stânga/dreapta = full-height side panels (image contained, panel background), like the cover. Verified by screenshots.

- [x] **19. „Imagine sus" = image at the very top of the page** — `done`
  The top strip is hoisted above the page header (eyebrow + title), capped at 38cqw tall.

- [x] **20. Dynamic aspect ratio everywhere — no visible placeholder card** — `done`
  Removed the darker-cream `var(--panel)` background behind contained images. Frames now follow each image's natural aspect (no fixed-ratio letterboxing) on: description side image, sketches, materials swatches, accessories cards, gallery, text strips/panels. Background-image divs converted to real `<img>` (gallery, accessories, swatches). Empty (no-image) editor placeholders keep their dashed boxes.

- [x] **21. „Imagine sus" = full-bleed banner** — `done`
  Landscape image spans the page edge-to-edge above the header (like a landscape cover), capped at 42cqw; portrait stays centred/narrow.

- [x] **22. Descriere: așezare imagine Alăturat / Pe toată lățimea** — `done`
  New `imageLayout` option (seg control shown once an image is set). „Pe toată lățimea" renders the image full-width above the text + specs, which then span the whole page.

- [x] **23. Detalii (text): full-width lists + image-left/text-right** — `done`
  Lines starting with „- " in the text area become a two-column, full-width bullet list under the text/image row (hint added in the editor label). „Imagine stânga" puts the image on the left and the text on the right (existing behaviour, kept).

- [x] **24. Gallery smart arrangement for mixed aspects** — `done`
  Masonry grid: column span follows measured aspect (wide ≥1.35 → 4 cols, square → 3, tall ≤0.8 → 2) and each item gets a computed row span (gap-aware) so any tall/wide combination packs without gaps. Verified: 4-image mixed layout fills the grid cleanly.

- [x] **25. Schițe: portrait rejection + 3 per row + max 6** — `done`
  Admin rejects portrait images with an inline warning (image is cleared). Grid is 3 per row, uniform 4/3 frames (contain, transparent letterbox), max 6 per page (add button replaced by a cap note; document slices to 6).

- [x] **26. Text never leaves the page — all sections** — `done` (re-verified)
  FitBox auto-fit covers every section body; the hoisted top banner and wide description image are height-capped so they can't push content out. Screenshots confirm no clipping in any section type.

- [x] **27. Gallery: optimal packing with reordering + recommendations** — `done`
  `galleryLayout.ts`: justified rows (every row fills the full width, uniform height per row, natural aspect — no crop). Tries every image ordering × every row split and scores by the REAL on-page image size (after FitBox scaling): biggest possible images, with a width-consistency tax so the page padding matches the other pages, even row heights, absurd-height rejection; ties keep the user's order. A single image is capped at 45cqw and centred (hero). A single row of 3+ images is only allowed when it's already tall — 3 landscape become hero + pair, 2H+2V becomes 2×2, 5 mixed reorder to 3+2, 1W+2V stays one big row. Admin shows live advice: whether another image fits and which orientation packs best, warns when the page is full (max 6).

- [x] **28. Rounded corners on all images** — `done`
  Every image in every section has rounded corners (0.6–1cqw by context): cover, full-bleed top banner, description side/wide, swatches, accessories cards, sketches, gallery, text strips/panels. Only the logos stay sharp on purpose.

- [x] **29. Gallery full width first — padding identical on every page** — `done`
  User decision (AskUserQuestion): full width beats multi-row when they conflict. The Gallery now measures the real free height on its page at runtime (body area − paragraph) and bestArrangement picks the biggest arrangement that FITS without FitBox scaling — so rows always span the exact standard margins. Only when nothing fits (e.g. two very tall portraits) it takes the least-overflowing one. Consequence: combos like 3 landscape fall back to one full-width row.

- [x] **30. Gallery balance: multi-row back, shrink bounded at 0.7** — `done`
  Strict fit collapsed everything to one small row. Final policy: fitting arrangements still win (padding identical); multi-row layouts that overflow slightly are allowed but never beyond a 0.7 FitBox shrink; a single row of 3+ images only if it's tall (≥26cqw). Lone images: centred hero capped 45cqw (single) / 35cqw (in multi-row). Results: 3 wide → pair + centred hero, 2H+2V → row of 3 + hero, 5 mix → 4 + hero, 6 mix → 3+3, 1W+2T / 3 tall / 4 tall → one big full-width row.

- [x] **31. Gallery scoring = maximum used space (final model)** — `done`
  Replaced all special-case rules with one objective: maximize the real displayed image AREA after FitBox scaling (Σ row height × row width × scale²). Area peaks when the gallery height matches the available space, so small single-row strips lose automatically. Lone images capped (45 single / 35 multi-row) and centred. Results: 3 wide → hero + pair, 2H+2V → 2×2, 5 mix → 3+2 reordered, 6 mix → 3+3, 4 wide → 2+2, 1W+2T / 3 tall / 4 tall / 2 wide / 2 tall → one big row (they genuinely have the most area that way).

- [x] **32. Gallery: measured width in the optimizer** — `done`
  `bestArrangement`/`itemWidth`/`rowHeight` take a width parameter (default 90); the Gallery component measures the real content width (and height budget) at runtime and passes it in. (A wider 3cqw-padding variant for gallery pages was tried and reverted — gallery pages keep the standard 5cqw margins so image edges align with every other section.)

- [x] **33. Gallery: featured-column layout (full width AND full height)** — `done` (superseded by 34)
  Rows-only layouts of landscape images can't fill a landscape page both ways — multi-row arrangements overflowed the height budget and FitBox shrank the whole block (~0.7 scale), leaving big empty side margins. First fix: featured hero column + side rows.

- [x] **34. Gallery: two-column solver — least free space for ANY combination** — `done` (superseded by 35)
  Column widths solved so both columns have equal height. Worked for many combos but the area score allowed degenerate splits (one huge image, sliver rest) and still left free space when no candidate matched the budget.

- [x] **35. Gallery: full-bleed fill — the block ALWAYS covers the whole body area** — `done` (final model, user directive)
  User: images must entirely occupy the available area no matter the count (1–5, max 5 now) or aspect mix. `galleryLayout.ts` rewritten: `fillArrangement` splits images into ≤3 rows of ≤3 (every ordering tried), each row gets a height share proportional to its ideal (uncropped) height, and every image cover-fills its cell — zero free space anywhere, uniform crop factor across images (even spread, no dominating/sliver images), row split chosen for the least crop. Captions are overlaid bottom-left on the image. Max raised/lowered to **5 images** (`GAL_MAX`) in the document, the add button, and the advice; `GalleryAdvice` now recommends the orientation that crops least (warns when the set would crop heavily).

- [x] **36. Gallery: full body HEIGHT via flex, no JS budget for sizing** — `done`
  The gallery container no longer sizes itself from the JS-measured budget (which left slack above the footer). Gallery pages' `.sheet-main` is now a flex column (`.gal-main`) and `.gal-rows` stretches with `flex: 1 1 auto` — the gallery always occupies every remaining cqw of body height, reactively. Row heights are flex weights (`arr.weights` = ideal heights) instead of fixed cqw, so the split proportions hold at any size. The runtime measurement is kept only for the crop metric / arrangement choice.

- [x] **38. Header redesign + remove bottom page number** — `done`
  Replaced the duplicated section label ("01 DESCRIERE PROIECT" eyebrow + big "Descriere proiect" heading) with a single compact header line: page-number badge + the editable heading inline, logo on the right. Removed the page number from the footer (date stays).

- [x] **39. Admin panes: less bottom cutoff + locked scroll chaining** — `done`
  Increased the preview/edit pane height (`calc(100vh - 132px)` instead of `-160px`) so the bottoms no longer look cut off; added `overscroll-behavior: contain` to each pane and `overscroll-behavior: none` to the wrapper so wheel events stay inside their own viewport instead of scrolling the whole admin page from the gap between panes.

- [x] **40. Section reorder buttons** — `done`
  The `movePage` helper already existed; now each page card has ↑/↓ buttons that swap the section up/down. Page numbers update automatically because they are rendered from array index + 1.

- [x] **41. Draggable focal-point picker for images** — `done`
  `ImageInput` now accepts `focus` (CSS object-position string) and `onFocusChange`. It renders a draggable thumbnail with a crosshair grid and a gold dot — drag to move the visible area on X/Y. Added `focus`/`imageFocus`/`coverImageFocus` fields to `Shot`, `AccItem`, `Section`, and `Offer`; applied `object-position` in the document for cover, description/materials/text side images, gallery shots, sketches, and accessory cards.

- [x] **42. Schițe: allow vertical images with crop warning** — `done`
  Removed the hard portrait rejection. Now when a portrait image is added to schițe, a `confirm` popup explains that landscape is recommended and the image will be cropped; the user can keep it (stored as portrait) or cancel (image cleared). Label changed from "doar orizontale" to "orizontale recomandate".

- [x] **43. Materiale și finisaje: same image handling** — `done`
  The materials section image input also gets the draggable focal picker (`imageFocus`) so the user can control which part of the material/finish image is visible.

- [x] **44. Accesorii și echipare: image preview/placeholder before upload** — `done`
  Empty accessory cards now render in the editable preview with a single dashed gold border and a "Imagine" placeholder, so the user sees where the image will go.

- [x] **45. Admin layout scroll fix** — `done`
  `.adm-shell` only locks scroll when it contains a split editor (`.adm-editor-fit`); list pages (Portofoliu, Oferte, Blog) scroll normally again.

- [x] **46. Save/publish choice everywhere** — `done`
  Portofoliu, Blog, Conținut site and Generator oferte now autosave to browser and show the same "Salvează local / Publică pe site" popup on their Save buttons. Unpublished changes trigger a `beforeunload` warning and a confirm on Close.

- [x] **47. Global "Publică toate modificările" button** — `done`
  Offer manager shows a count badge of offers with local drafts and a button to publish them all at once.

- [x] **48. Tooltips on admin buttons** — `done`
  All primary action buttons (Save, Publish all, Edit, Delete, Duplicate, New, Cancel, Open page) now expose descriptive `title` tooltips on hover.

- [x] **49. Portfolio preview adapts to image orientation** — `done`
  In the portfolio editor the preview card switches to `aspect-ratio: 16/9` for landscape images and stays `4/5` for portraits.

## Files changed

- `src/styles/offer.css` — layouts, gallery grid, contain frames, lay-full, title clamp, paddings
- `src/styles/admin.css` — pg-tools, overflow warning, hint, cap note styles
- `src/components/offer/OfferDocument.tsx` — model (`coverFit`, `coverImageOrient`, `imageOrient`, `orient`, `fontScale`, `headingBold`, `textLayout`, `coverLayout: 'full'`), FitBox auto-fit, useOrient runtime detection, adaptive image components (SideImg, SketchFigure, GalItem, AccImg, TextImage), inline sheet logo
- `src/components/admin/OfferManager.tsx` — cover fit/composition controls, page tools, preview jump, duplicate, gallery cap, overflow warning, delete page
- `src/components/admin/ui.tsx` — ImageInput `onMeta` orientation callback
- `src/pages/oferta/[slug].astro` — hydrates OfferDocument (auto-fit on public page/PDF), mobile CSS, longer settle before auto-PDF

## Verification

- [x] `npx astro build` compiles clean (first round)
- [x] Screenshot-verified (dev server + puppeteer): mixed-orientation gallery (4 images, none clipped), portrait/landscape side images, accessories cards, text page with portrait image, full-width landscape cover, mobile viewport
- [x] `npx astro build` after second round of fixes
- [x] Screenshot-verified round 3: all 5 text layouts (strips top/bottom, full-height side panels), custom logo on cover + headers; `npx astro build` after round 3
- [x] Screenshot-verified round 4: hoisted top image above header, natural-aspect frames with no placeholder background (text strips, side panels, gallery); `npx astro build` after round 4
- [x] Screenshot-verified round 5: full-bleed top banner, description wide image, full-width 2-col lists, mixed-aspect gallery masonry (fixed a row-span gap bug found during verification), 3/row sketches; `npx astro build` after round 5
- [x] Screenshot-verified round 6: gallery optimizer — 5 mixed reorder to 3+2, 3 landscape become hero+pair (no more single small row), 2H+2V becomes 2×2; `npx astro build` after round 6
- [x] Screenshot-verified round 7: optimizer rescored to real on-page image size (FitBox-aware) — hero+pair for 3 wide, one big row for 1W+2V, 2×2 for 2H+2V, 3+2 for 5 mix; single-image hero capped/centred; rows fill full width; `npx astro build` after round 7
- [x] Screenshot-verified round 8: gallery pages use the wider 3cqw margins (rows span ~94cqw), arrangements stay sane (3 wide → hero+pair, 2L+2V → 2×2); `npx astro build` after round 8 — REVERTED: gallery keeps standard 5cqw margins so edges align with all other sections
- [x] Screenshot-verified round 9: featured-column gallery layout — 3 landscape render hero-left + two stacked right at full width/height with no FitBox shrink; 2L+2V renders wide hero + tall pair over wide row; `npx astro build` after round 9
- [x] Screenshot-verified round 10: two-column solver — 2 wide side-by-side full width, 2L+2V hero + 3 stacked (full page rectangle), 6 mix full-width 3+3; `npx astro build` after round 10
- [x] Screenshot-verified round 11: full-bleed fill gallery — 1/2/3/4/5 images all cover the entire body area edge-to-edge (1 full-bleed, 2 side-by-side, 3 hero+pair, 4 pair+pair, 5 triple+pair), captions overlaid; `npx astro build` after round 11
- [x] Screenshot-verified round 12: gallery stretches to full body height via flex (`.gal-main`) — rows reach the footer line on 3-image and 5-image pages; probe confirms gallery = entire `.sheet-main` minus 2cqw margin; `npx astro build` after round 12
- [x] Screenshot-verified round 13: reduced page padding (3/3.5/2.2cqw) — cover, description, sketches, gallery pages all use the wider content area, edges aligned across sections; `npx astro build` after round 13
- [x] Screenshot-verified round 14: padding tightened even more (2.4/3/1.8cqw, 94cqw content area) — cover/image bleeds further, all inner sections reach the new narrower margins; `npx astro build` after round 14
- [x] Screenshot-verified round 15: compact inline header (number + title), footer number removed, draggable focus picker applied — cover focus shifted to top-right, gallery cells focus shifted to chosen zones; `npx astro build` after round 15
- [ ] Manual check in `/admin#offers`: portrait rejection in schițe, „Pe toată lățimea" toggle, list syntax in detalii
- [ ] Manual check in `/admin#offers`: add images in sections, PDF download, duplicate template, preview jump

## Notes

- Update statuses here as work progresses.
