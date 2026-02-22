import { gsap } from "gsap";
import { MorphSVGPlugin } from "gsap/MorphSVGPlugin";
import {
  subdivide,
  sanitize,
  reorderRawPath,
  findOuterBodyIndex,
  projectToQuadrantSnap,
} from "../utils/svg-morph-utils";

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

    // 1. Get the final shape from the SVG file
    const endPathEl = doc.querySelector("#step-3");
    let endD = endPathEl?.getAttribute("d") || "";

    // Fix "fake curve" on the right edge
    endD = endD.replace(
      /C1852\.75,224\.15 1852\.75,486\.75 1852\.75,570/i,
      "L1852.75,570"
    );

    if (!endD) throw new Error("Could not find required paths in SVG file.");

    // 2. Setup Container
    const viewBox =
      doc.documentElement.getAttribute("viewBox") || "0 0 1920 1080";
    containerSvg.setAttribute("viewBox", viewBox);

    // 3. Process raw path data using shared utilities
    const rawFinal = MorphSVGPlugin.stringToRawPath(endD);
    const rawFinalClean = sanitize(rawFinal);

    // Separate body (card outline) from holes (cutouts)
    const bodyIndex = findOuterBodyIndex(rawFinalClean);
    const holes = rawFinalClean.filter((_, i) => i !== bodyIndex);

    // Align body start-point to top-right to prevent twisting
    const outerBodyRaw = [rawFinalClean[bodyIndex]];
    const outerBodyAligned = reorderRawPath(outerBodyRaw, 1852, 224);
    const bodySegment = subdivide([outerBodyAligned[0]], 4)[0];

    // Re-assemble: body + holes (all subdivided)
    const dFinalHoley = MorphSVGPlugin.rawPathToString(
      [bodySegment].concat(holes.map((h) => subdivide([h], 4)[0]))
    );

    // 4. Generate offscreen start state using quadrant snap projection
    const finalRaw = MorphSVGPlugin.stringToRawPath(dFinalHoley);
    const startRaw = projectToQuadrantSnap(finalRaw, {
      centerX: 960,
      centerY: 540,
      offset: 4000,
      cardLeft: 67,
      cardRight: 1852,
      cardTop: 62,
      cardBottom: 1018,
    });
    const fullScreenD = MorphSVGPlugin.rawPathToString(startRaw);

    // 5. Animate
    pathEl.setAttribute("d", fullScreenD);
    gsap.set(containerSvg, { opacity: 0, scale: 1 });

    const tl = gsap.timeline({ defaults: { ease: "power3.inOut" } });

    tl.to(containerSvg, { opacity: 1, duration: 0.5 });

    tl.to(
      pathEl,
      {
        morphSVG: { shape: dFinalHoley, shapeIndex: 0 },
        duration: 1.8,
        ease: "elastic.out(0.6, 0.85)",
      },
      "<"
    );
  } catch (e) {
    console.error(e);
  }
}
