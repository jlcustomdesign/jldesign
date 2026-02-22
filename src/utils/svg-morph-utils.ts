/**
 * SVG Morph Utilities
 *
 * Pure geometry functions for preparing SVG raw-path data for clean
 * MorphSVG animations. All functions are side-effect-free: they take
 * raw path arrays and return raw path arrays.
 *
 * Previously hardcoded inside simultaneous-reveal.ts.
 * Now reusable for any SVG morph animation.
 */

// ─── Types ───────────────────────────────────────────────────────────

/** A single sub-path: [x, y, cp1x, cp1y, cp2x, cp2y, x, y, ...] */
export type RawSegment = number[];

/** A full raw path (array of sub-paths). */
export type RawPath = RawSegment[];

// ─── Subdivision ─────────────────────────────────────────────────────

/**
 * Subdivide long Bézier segments into shorter ones.
 * This guarantees enough anchor points for smooth morphing into
 * shapes with rounded corners.
 *
 * @param raw    - The raw path to subdivide.
 * @param maxLen - Maximum allowed segment length in SVG units.
 */
export function subdivide(raw: RawPath, maxLen: number): RawPath {
  return raw.map((segment) => {
    const newSeg: number[] = [segment[0], segment[1]];
    for (let i = 2; i < segment.length; i += 6) {
      const x0 = segment[i - 2], y0 = segment[i - 1];
      const cp1x = segment[i],   cp1y = segment[i + 1];
      const cp2x = segment[i + 2], cp2y = segment[i + 3];
      const x1 = segment[i + 4], y1 = segment[i + 5];

      const dist = Math.hypot(x1 - x0, y1 - y0);
      if (dist > maxLen) {
        const steps = Math.ceil(dist / maxLen);
        for (let s = 1; s <= steps; s++) {
          const t = s / steps;
          const invT = 1 - t;
          const invT2 = invT * invT, invT3 = invT2 * invT;
          const t2 = t * t, t3 = t2 * t;
          const nx = invT3 * x0 + 3 * invT2 * t * cp1x + 3 * invT * t2 * cp2x + t3 * x1;
          const ny = invT3 * y0 + 3 * invT2 * t * cp1y + 3 * invT * t2 * cp2y + t3 * y1;
          newSeg.push(nx, ny, nx, ny, nx, ny);
        }
      } else {
        newSeg.push(cp1x, cp1y, cp2x, cp2y, x1, y1);
      }
    }
    return newSeg;
  });
}

// ─── Sanitization ────────────────────────────────────────────────────

/**
 * Clean up "dirty" SVG data by:
 *  1. Removing zero-length segments (< 0.5px).
 *  2. Straightening nearly-vertical curves (all X within 2px).
 *  3. Straightening nearly-horizontal curves (all Y within 2px).
 *
 * @param raw - The raw path to sanitize.
 */
export function sanitize(raw: RawPath): RawPath {
  return raw.map((segment) => {
    const cleaned: number[] = [segment[0], segment[1]];
    for (let i = 2; i < segment.length; i += 6) {
      const x0 = segment[i - 2], y0 = segment[i - 1];
      const cp1x = segment[i],   cp1y = segment[i + 1];
      const cp2x = segment[i + 2], cp2y = segment[i + 3];
      const x1 = segment[i + 4], y1 = segment[i + 5];

      const dist = Math.hypot(x1 - x0, y1 - y0);
      if (dist <= 0.5) continue; // Skip zero-length

      const xValues = [x0, cp1x, cp2x, x1];
      const minX = Math.min(...xValues), maxX = Math.max(...xValues);

      if (maxX - minX < 2) {
        // Vertical line — snap all X to average
        const avgX = (x0 + x1) / 2;
        cleaned.push(avgX, cp1y, avgX, cp2y, avgX, y1);
      } else if (
        Math.abs(y0 - y1) < 2 &&
        Math.abs(cp1y - y0) < 2 &&
        Math.abs(cp2y - y0) < 2
      ) {
        // Horizontal line — snap all Y to average
        const avgY = (y0 + y1) / 2;
        cleaned.push(cp1x, avgY, cp2x, avgY, x1, avgY);
      } else {
        cleaned.push(cp1x, cp1y, cp2x, cp2y, x1, y1);
      }
    }
    return cleaned;
  });
}

// ─── Path Reordering ─────────────────────────────────────────────────

/**
 * Rotate a closed path's start point to the anchor closest to
 * (targetX, targetY). This prevents morphing "twist" artifacts
 * when the start/end shapes have different winding orders.
 *
 * Only operates on the first sub-path (index 0).
 *
 * @param rawPath - Single-loop raw path.
 * @param targetX - Desired start-point X.
 * @param targetY - Desired start-point Y.
 */
export function reorderRawPath(
  rawPath: RawPath,
  targetX: number,
  targetY: number
): RawPath {
  let bestDist = Infinity;
  let bestIndex = 0;

  const path = rawPath[0];

  // Check the M point
  const d0 = (path[0] - targetX) ** 2 + (path[1] - targetY) ** 2;
  if (d0 < bestDist) {
    bestDist = d0;
    bestIndex = 0;
  }

  // Check all anchor endpoints
  for (let i = 2; i < path.length; i += 6) {
    const ax = path[i + 4], ay = path[i + 5];
    const d = (ax - targetX) ** 2 + (ay - targetY) ** 2;
    if (d < bestDist) {
      bestDist = d;
      bestIndex = i + 6;
    }
  }

  if (bestIndex === 0 || bestIndex >= path.length) return rawPath;

  const newPath: number[] = [];
  const startX = path[bestIndex - 2];
  const startY = path[bestIndex - 1];
  newPath.push(startX, startY);

  for (let i = bestIndex; i < path.length; i++) newPath.push(path[i]);
  for (let i = 2; i < bestIndex; i++) newPath.push(path[i]);

  return [newPath];
}

// ─── Body / Hole Separation ──────────────────────────────────────────

/**
 * Find the sub-path index with the largest bounding-box area.
 * In a compound path (body + cutout holes), this is the outer card outline.
 */
export function findOuterBodyIndex(raw: RawPath): number {
  let maxArea = 0;
  let bestIndex = 0;

  raw.forEach((path, index) => {
    let minX = Infinity, maxX = -Infinity;
    let minY = Infinity, maxY = -Infinity;
    for (let i = 0; i < path.length; i += 2) {
      const x = path[i], y = path[i + 1];
      if (x < minX) minX = x;
      if (x > maxX) maxX = x;
      if (y < minY) minY = y;
      if (y > maxY) maxY = y;
    }
    const area = (maxX - minX) * (maxY - minY);
    if (area > maxArea) {
      maxArea = area;
      bestIndex = index;
    }
  });

  return bestIndex;
}

// ─── Quadrant Snap Projection ────────────────────────────────────────

export interface ProjectionConfig {
  /** Center X of the artboard (e.g. 960 for 1920-wide). */
  centerX: number;
  /** Center Y of the artboard (e.g. 540 for 1080-tall). */
  centerY: number;
  /** How far offscreen to project points (px). Larger = more uniform speed. */
  offset: number;
  /** Left edge of the card body (for computing LEFT boundary). */
  cardLeft: number;
  /** Right edge of the card body (for computing RIGHT boundary). */
  cardRight: number;
  /** Top edge of the card body (for computing TOP boundary). */
  cardTop: number;
  /** Bottom edge of the card body (for computing BOTTOM boundary). */
  cardBottom: number;
}

/**
 * Project every point of a raw path to equidistant offscreen positions
 * based on which quadrant it falls in. This guarantees all segments
 * slide in at the same speed during a morph animation.
 *
 * @param raw    - The final (target) raw path data.
 * @param config - Projection parameters.
 * @returns A new raw path where every point is offscreen.
 */
export function projectToQuadrantSnap(
  raw: RawPath,
  config: ProjectionConfig
): RawPath {
  const { centerX, centerY, offset, cardLeft, cardRight, cardTop, cardBottom } = config;

  const LEFT   = cardLeft - offset;
  const RIGHT  = cardRight + offset;
  const TOP    = cardTop - offset;
  const BOTTOM = cardBottom + offset;

  return raw.map((seg) => {
    const newSeg: number[] = [];
    if (seg.length < 2) return newSeg;

    let lastCorner = { x: RIGHT, y: BOTTOM };

    // M point
    const stx = seg[0] < centerX ? LEFT : RIGHT;
    const sty = seg[1] < centerY ? TOP : BOTTOM;
    newSeg.push(stx, sty);
    lastCorner = { x: stx, y: sty };

    // Bézier commands
    for (let i = 2; i < seg.length; i += 6) {
      const ax = seg[i + 4], ay = seg[i + 5];
      let atx = ax < centerX ? LEFT : RIGHT;
      let aty = ay < centerY ? TOP : BOTTOM;

      // Prevent diagonal jumps
      if (atx !== lastCorner.x && aty !== lastCorner.y) {
        aty = lastCorner.y;
      }

      newSeg.push(atx, aty, atx, aty, atx, aty);
      lastCorner = { x: atx, y: aty };
    }

    // Close path cleanly
    if (newSeg.length >= 8) {
      newSeg[newSeg.length - 4] = newSeg[0];
      newSeg[newSeg.length - 3] = newSeg[1];
      newSeg[newSeg.length - 2] = newSeg[0];
      newSeg[newSeg.length - 1] = newSeg[1];
    }

    return newSeg;
  });
}
