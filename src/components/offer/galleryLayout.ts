/**
 * galleryLayout.ts — full-bleed gallery packing for the offer pages.
 *
 * The gallery always fills the ENTIRE body area (full width × full height),
 * for 1–5 images, no matter the aspect combination. Images are arranged in
 * rows; each row gets a share of the height proportional to its "ideal"
 * height (the height at which every image in the row would show uncropped at
 * full width). Every image then cover-fills its cell, so there is zero free
 * space anywhere — the only cost is crop, and the row split is chosen to
 * minimize it (uniform crop factor for all images = Σideal/budget).
 *
 * Reordering is allowed (permutations × row splits, n ≤ 5 so it stays fast);
 * ties keep the user's original order. All sizes in cqw — pure math.
 */

/** Usable width of the page body in cqw (100 − left/right sheet padding).
   Measured at runtime; this is only the default/fallback. */
export const GAL_W = 94;
/** Horizontal/vertical gap between images, cqw. */
export const GAL_GAP = 1.6;
/** Fallback height budget for the gallery, cqw (measured at runtime). */
export const GAL_BUDGET = 50;
/** Max images per gallery page. */
export const GAL_MAX = 5;

export interface FillArrangement {
  /** Original image indices, row by row (may be reordered). */
  rows: number[][];
  /** Flex weight of each row (its ideal uncropped height) — rows share the
     container height proportionally to these. */
  weights: number[];
  /** Uniform crop factor: 1 = no crop, 2 = half the image cropped away. */
  crop: number;
}

function permutations<T>(arr: T[]): T[][] {
  if (arr.length <= 1) return [arr.slice()];
  const out: T[][] = [];
  for (let i = 0; i < arr.length; i++) {
    const rest = arr.slice(0, i).concat(arr.slice(i + 1));
    for (const p of permutations(rest)) out.push([arr[i], ...p]);
  }
  return out;
}

/** All ways to split n ordered items into ≤3 consecutive rows of ≤3 items. */
function* compositions(n: number): Generator<number[]> {
  if (n === 0) { yield []; return; }
  for (let first = 1; first <= Math.min(3, n); first++) {
    for (const rest of compositions(n - first)) {
      if (rest.length < 3) yield [first, ...rest];
    }
  }
}

/** Ideal height of a row (uncropped, full width), cqw. */
function idealRowH(ratios: number[], idx: number[], W: number): number {
  const sumR = idx.reduce((a, i) => a + ratios[i], 0);
  return (W - (idx.length - 1) * GAL_GAP) / sumR;
}

/** Crop factor of the best row split for these ratios (1 = perfect). */
export function fillCrop(ratios: number[], budget: number = GAL_BUDGET, W: number = GAL_W): number {
  return fillArrangement(ratios, budget, W).crop;
}

/**
 * Picks the row split + ordering with the least crop while filling the whole
 * budget × width rectangle exactly. Crop is uniform across images (every row
 * is scaled by the same factor), so the spread stays even — no image
 * dominates and none shrinks to a sliver.
 */
export function fillArrangement(ratios: number[], budget: number = GAL_BUDGET, W: number = GAL_W): FillArrangement {
  const n = ratios.length;
  if (n === 0) return { rows: [], weights: [], crop: 1 };
  const usable = budget - 0; // row heights below already exclude inter-row gaps
  let best: { rows: number[][]; ideals: number[]; metric: number } | null = null;
  permutations([...Array(n).keys()]).forEach((order, pi) => {
    for (const comp of compositions(n)) {
      const rows: number[][] = [];
      let at = 0;
      for (const len of comp) { rows.push(order.slice(at, at + len)); at += len; }
      const ideals = rows.map((r) => idealRowH(ratios, r, W));
      const total = ideals.reduce((a, h) => a + h, 0) + (rows.length - 1) * GAL_GAP;
      const s = total / usable;
      const crop = Math.max(s, 1 / s);
      // Least crop wins; prefer fewer rows, then the user's original order.
      const metric = Math.log(crop) + rows.length * 0.02 + pi * 0.001;
      if (!best || metric < best.metric) best = { rows, ideals, metric };
    }
  });
  const { rows, ideals } = best!;
  const sumIdeal = ideals.reduce((a, h) => a + h, 0);
  const s = (sumIdeal + (rows.length - 1) * GAL_GAP) / usable;
  return { rows, weights: ideals, crop: Math.max(s, 1 / s) };
}
