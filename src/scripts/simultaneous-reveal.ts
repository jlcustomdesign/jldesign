import { gsap } from "gsap";
import { MorphSVGPlugin } from "gsap/MorphSVGPlugin";

gsap.registerPlugin(MorphSVGPlugin);

export async function initHeroAnim(svgUrl: string = "/svg1.svg") {
  const containerSvg = document.querySelector("#mySVG") as SVGSVGElement;
  const pathEl = document.querySelector("#heroPath") as SVGPathElement;
  const debugEl = document.querySelector(".container p");

  if (!containerSvg || !pathEl) return;

  try {
    if (debugEl) debugEl.textContent = "Loading SVG...";
    const response = await fetch(svgUrl);
    const text = await response.text();
    const parser = new DOMParser();
    const doc = parser.parseFromString(text, "image/svg+xml");

    // 1. Get the shapes
    // svg1.svg has flat IDs step-1, step-2, step-3
    // We only need the FINAL step (step-3) for the simultaneous reveal logic
    const endPathEl = doc.querySelector("#step-3");

    let endD = endPathEl?.getAttribute("d") || "";

    // MANUAL PATH SURGERY: Fix the "Fake Curve" on the right edge
    // svg1.svg has the right edge at x=1852.75.
    // Matches: C1852.75,224.15 1852.75,486.75 1852.75,570
    endD = endD.replace(
      /C1852\.75,224\.15 1852\.75,486\.75 1852\.75,570/i,
      "L1852.75,570"
    );

    if (!endD) throw new Error("Could not find required paths in svg1.svg.");

    // 2. Setup Container
    const viewBox =
      doc.documentElement.getAttribute("viewBox") || "0 0 1920 1080";
    containerSvg.setAttribute("viewBox", viewBox);

    // --- MATHEMATICAL PROJECTION HELPERS (The logic you liked) ---
    const rawFinal = MorphSVGPlugin.stringToRawPath(endD);

    // Calculate Body 5 reference points
    let eMinX = Infinity,
      eMaxX = -Infinity,
      eMinY = Infinity,
      eMaxY = -Infinity;
    rawFinal[0].forEach((val, i) => {
      if (i % 2 === 0) {
        if (val < eMinX) eMinX = val;
        if (val > eMaxX) eMaxX = val;
      } else {
        if (val < eMinY) eMinY = val;
        if (val > eMaxY) eMaxY = val;
      }
    });
    const eCenterX = (eMinX + eMaxX) / 2;
    const eCenterY = (eMinY + eMaxY) / 2;

    // SUBDIVISION (Ensures enough points for rounded card)
    function subdivide(raw: any[], maxLen: number) {
      return raw.map((segment) => {
        const newSeg = [segment[0], segment[1]];
        for (let i = 2; i < segment.length; i += 6) {
          const x0 = segment[i - 2],
            y0 = segment[i - 1];
          const cp1x = segment[i],
            cp1y = segment[i + 1];
          const cp2x = segment[i + 2],
            cp2y = segment[i + 3];
          const x1 = segment[i + 4],
            y1 = segment[i + 5];
          const dist = Math.sqrt(Math.pow(x1 - x0, 2) + Math.pow(y1 - y0, 2));
          if (dist > maxLen) {
            const steps = Math.ceil(dist / maxLen);
            for (let s = 1; s <= steps; s++) {
              const t = s / steps;
              const invT = 1 - t;
              const invT2 = invT * invT,
                invT3 = invT2 * invT;
              const t2 = t * t,
                t3 = t2 * t;
              const nx =
                invT3 * x0 +
                3 * invT2 * t * cp1x +
                3 * invT * t2 * cp2x +
                t3 * x1;
              const ny =
                invT3 * y0 +
                3 * invT2 * t * cp1y +
                3 * invT * t2 * cp2y +
                t3 * y1;
              newSeg.push(nx, ny, nx, ny, nx, ny);
            }
          } else {
            newSeg.push(cp1x, cp1y, cp2x, cp2y, x1, y1);
          }
        }
        return newSeg;
      });
    }

    // --- GEOMETRIC SANITIZIER (Fixes "Dirty" SVG data + Rectifies Linear Curves) ---
    function sanitize(raw: any[]) {
      return raw.map((segment) => {
        const cleaned = [segment[0], segment[1]];
        // Iterates bezier tuples (6 numbers each)
        for (let i = 2; i < segment.length; i += 6) {
          let x0 = segment[i - 2],
            y0 = segment[i - 1]; // Start point (from prev segment)
          let cp1x = segment[i],
            cp1y = segment[i + 1];
          let cp2x = segment[i + 2],
            cp2y = segment[i + 3];
          let x1 = segment[i + 4],
            y1 = segment[i + 5]; // End point

          const dist = Math.sqrt((x1 - x0) ** 2 + (y1 - y0) ** 2);

          // Keep segments with actual length (> 0.5px)
          if (dist > 0.5) {
            // 1. Vertical Line Rectification
            // If start, end, and CPs are all roughly same X, force them to match exactly
            const xValues = [x0, cp1x, cp2x, x1];
            const minX = Math.min(...xValues);
            const maxX = Math.max(...xValues);
            if (maxX - minX < 2) {
              // Tolerance for "straightness"
              const avgX = (x0 + x1) / 2; // Snap to avg X of anchors (or just x1)
              // Force straight vertical line
              cleaned.push(avgX, cp1y, avgX, cp2y, avgX, y1);
            }
            // 2. Horizontal Line Rectification
            // If start, end, and CPs are all roughly same Y, force them to match exactly
            else if (
              Math.abs(y0 - y1) < 2 &&
              Math.abs(cp1y - y0) < 2 &&
              Math.abs(cp2y - y0) < 2
            ) {
              const avgY = (y0 + y1) / 2;
              // Force straight horizontal line
              cleaned.push(cp1x, avgY, cp2x, avgY, x1, avgY);
            }
            // 3. Keep standard curve
            else {
              cleaned.push(cp1x, cp1y, cp2x, cp2y, x1, y1);
            }
          }
        }
        return cleaned;
      });
    }

    // --- START POINT ALIGNMENT (Prevents Twisting/Spikes) ---
    function reorderRawPath(
      rawPath: any[],
      targetX: number,
      targetY: number
    ) {
      // Find the segment/point closest to the target
      let bestDist = Infinity;
      let bestIndex = 0;

      const path = rawPath[0]; // Assuming single closed loop
      // Standard rawPath format: [x, y, x, y, x, y...]
      // We look at every anchor point (every 6th value after first 2, or just iterate structure)
      // Actually rawPath is [x, y,  cp1x, cp1y, cp2x, cp2y, x, y ...]

      // 1. Check Start Point
      const d0 = (path[0] - targetX) ** 2 + (path[1] - targetY) ** 2;
      if (d0 < bestDist) {
        bestDist = d0;
        bestIndex = 0;
      }

      // 2. Check all Anchors
      // i starts at 2. An anchor is at i+4 (index 6, 12, 18...)
      for (let i = 2; i < path.length; i += 6) {
        const ax = path[i + 4];
        const ay = path[i + 5];
        const d = (ax - targetX) ** 2 + (ay - targetY) ** 2;
        if (d < bestDist) {
          bestDist = d;
          bestIndex = i + 6; // Next command starts after this anchor
        }
      }

      if (bestIndex === 0 || bestIndex >= path.length) return rawPath;

      // Reconstruct path starting from bestIndex
      // The first 2 numbers are the M point. The rest are Cubic Beziers.
      // We need to cycle the Cubic Bezier commands.

      const newPath = [];
      // New Start Point is the anchor at bestIndex-2 (which was the End of previous)
      const startX = path[bestIndex - 2];
      const startY = path[bestIndex - 1];

      newPath.push(startX, startY);

      // Push everything from bestIndex to End
      for (let i = bestIndex; i < path.length; i++) newPath.push(path[i]);

      // Push everything from 2 to bestIndex
      for (let i = 2; i < bestIndex; i++) newPath.push(path[i]);

      return [newPath];
    }

    // --- PATH LOGIC: SEPARATE BODY AND HOLES ---
    // 1. Identify which sub-path is the Limit/Body (Largest Bounding Box)
    function findOuterBodyIndex(raw: any[]) {
      let maxArea = 0;
      let bestIndex = 0;
      raw.forEach((path, index) => {
        let minX = Infinity,
          maxX = -Infinity,
          minY = Infinity,
          maxY = -Infinity;
        for (let i = 0; i < path.length; i += 2) {
          const x = path[i];
          const y = path[i + 1];
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

    // COMPOSED SHAPES (With Sanitized Source Data)
    const rawFinalClean = sanitize(rawFinal);

    // FIND OUTER BODY (The card outline)
    const bodyIndex = findOuterBodyIndex(rawFinalClean);
    const holes = rawFinalClean.filter((_, i) => i !== bodyIndex);

    // ALIGNMENT: Rotates body to start at its actual Top-Right (1852, 224) to prevent twisting
    const outerBodyRaw = [rawFinalClean[bodyIndex]];
    const outerBodyAligned = reorderRawPath(outerBodyRaw, 1852, 224);

    const bodySegment = subdivide([outerBodyAligned[0]], 4)[0];

    // Re-Assemble: Body + Holes (all subdivided for clean morphing)
    const dFinalHoley = MorphSVGPlugin.rawPathToString(
      [bodySegment].concat(holes.map((h) => subdivide([h], 4)[0]))
    );

    const cardD = MorphSVGPlugin.rawPathToString([bodySegment]);

    // QUADRANT SNAP PROJECTION - Clean Edge Guarantee
    // We project ALL segments of the final holey shape
    const finalRaw = MorphSVGPlugin.stringToRawPath(dFinalHoley);
    const fullScreenD = MorphSVGPlugin.rawPathToString(
      finalRaw.map((seg) => {
        const newSeg: number[] = [];
        if (seg.length < 2) return newSeg;

        // Snap coordinates center - Use Artboard Center for perfect symmetry
        const eCenterX = 960;
        const eCenterY = 540;

        // EQUIDISTANT START BOUNDARIES
        // To make everything move at the same speed, they must start at the same distance
        // from their target destination.
        // Card bounds: ~67 to 1852 (X), ~62 to 1018 (Y)
        const OFFSET = 4000;
        const LEFT = 67 - OFFSET; // ~ -3933
        const RIGHT = 1852 + OFFSET; // ~ 5852
        const TOP = 62 - OFFSET; // ~ -3938
        const BOTTOM = 1018 + OFFSET; // ~ 5018

        let lastCorner = { x: RIGHT, y: BOTTOM };

        // 1. Initial Position for M (MoveTo)
        const startX = seg[0],
          startY = seg[1];
        const stx = startX < eCenterX ? LEFT : RIGHT;
        const sty = startY < eCenterY ? TOP : BOTTOM;
        newSeg.push(stx, sty);
        lastCorner = { x: stx, y: sty };

        // 2. Bezier Command Loops
        for (let i = 2; i < seg.length; i += 6) {
          const ax = seg[i + 4],
            ay = seg[i + 5];

          let atx = ax < eCenterX ? LEFT : RIGHT;
          let aty = ay < eCenterY ? TOP : BOTTOM;

          if (atx !== lastCorner.x && aty !== lastCorner.y) {
            aty = lastCorner.y;
          }

          newSeg.push(atx, aty, atx, aty, atx, aty);
          lastCorner = { x: atx, y: aty };
        }

        // 3. Close path cleanly
        if (newSeg.length >= 8) {
          newSeg[newSeg.length - 4] = newSeg[0];
          newSeg[newSeg.length - 3] = newSeg[1];
          newSeg[newSeg.length - 2] = newSeg[0];
          newSeg[newSeg.length - 1] = newSeg[1];
        }

        return newSeg;
      })
    );

    // 4. Sequence Animation (Consolidated for simultaneous reveal)
    pathEl.setAttribute("d", fullScreenD);
    gsap.set(containerSvg, { opacity: 0, scale: 1 }); // No zoom-in

    const tl = gsap.timeline({ defaults: { ease: "power3.inOut" } });

    tl.to(containerSvg, { opacity: 1, duration: 0.5 });

    // PHASE 2: Full -> Final Card (Simultaneous reveal)
    tl.to(
      pathEl,
      {
        morphSVG: { shape: dFinalHoley, shapeIndex: 0 },
        duration: 1.8,
        ease: "elastic.out(0.6, 0.85)", // Bouncy morph
      },
      "<"
    );

    // PHASE 3: Sliding reveal steps (Disabled for debugging)
    // Animation now stops after Card Reveal.
  } catch (e) {
    console.error(e);
  }
}
