import { gsap } from "gsap";
import { MorphSVGPlugin } from "gsap/MorphSVGPlugin";
import { rectangle, WIDTH_TARGET, DESKTOP_RESOLUTION, MOBILE_RESOLUTION } from "../utils/svg-shapes";

gsap.registerPlugin(MorphSVGPlugin);

// Re-export rectangle for consumers
export { rectangle };

let servicesAnimInitialized = false;

// ViewBox dimensions
const vbWidth = 1920;
const vbHeight = 1080;

// Card geometry - Pulled in from 60/1020 to 140/940 to prevent Windows clipping
const cardLeft = 76.5;
const cardRight = 1843.5;
const cardTop = 140;
const cardBottom = 940;
const outerRadius = 48;

// Cutout dimensions
const fullCutoutRadius = 55.4;

// Cutout 1 (Top) - Shifted down by 80px
const c1Top = 140;
const c1Bottom = 361.5;
const c1FinalX = 777;

// Cutout 2 (Middle) - Shifted down by 80px
const c2Top = 361.5;
const c2Bottom = 583;
const c2FinalX = 984;

// Cutout 3 (Bottom) - Shifted down by 80px
const c3Top = 583;
const c3Bottom = 804.5;
const c3FinalX = 840;

// Bezier Constant
const K_FACTOR = 0.55228475;

/**
 * Services-specific cross shape.
 * Uses adjusted mobile heights compared to the home page cross.
 */
export function cross(w: number, h: number): string {
  const isDesktop = w > WIDTH_TARGET;
  const ref = isDesktop ? DESKTOP_RESOLUTION : MOBILE_RESOLUTION;
  const rw = (val: number) => (val / ref.width) * w;
  // Cap vertical scaling to prevent clipping on short Windows screens
  const hScale = Math.max(h, isDesktop ? 680 : 600);
  const rh = (val: number) => (val / ref.height) * hScale;

  return isDesktop
    ? `M${rw(470)} ${rh(145)} H${rw(19)} C${rw(9)} ${rh(145)} ${rw(1)} ${rh(153)} ${rw(1)} ${rh(163)} V${rh(754)} C${rw(1)} ${rh(763)} ${rw(9)} ${rh(772)} ${rw(19)} ${rh(772)} H${rw(320)} C${rw(330)} ${rh(772)} ${rw(338)} ${rh(780)} ${rw(338)} ${rh(790)} V${rh(898)} C${rw(338)} ${rh(907)} ${rw(346)} ${h} ${rw(356)} ${h} H${rw(1092)} C${rw(1102)} ${h} ${rw(1110)} ${rh(907)} ${rw(1110)} ${rh(898)} V${rh(789)} C${rw(1110)} ${rh(779)} ${rw(1118)} ${rh(771)} ${rw(1128)} ${rh(771)} H${rw(1872)} C${rw(1881)} ${rh(771)} ${w} ${rh(763)} ${w} ${rh(753)} V${rh(164)} C${w} ${rh(154)} ${rw(1881)} ${rh(146)} ${rw(1872)} ${rh(146)} H${rw(1420)} C${rw(1410)} ${rh(146)} ${rw(1402)} ${rh(137)} ${rw(1402)} ${rh(128)} V${rh(19)} C${rw(1402)} ${rh(9)} ${rw(1394)} ${rh(1)} ${rw(1384)} ${rh(1)} H${rw(506)} C${rw(496)} ${rh(1)} ${rw(488)} ${rh(9)} ${rw(488)} ${rh(19)} V${rh(127)} C${rw(488)} ${rh(137)} ${rw(480)} ${rh(145)} ${rw(470)} ${rh(145)} Z`
    : `M${rw(1000)} ${rh(15)} H${rw(21)} C${rw(9.95)} ${rh(15)} ${rw(1)} ${rh(25)} ${rw(1)} ${rh(35)} ` +
      `V${rh(780)} ` +
      `C${rw(1)} ${rh(790)} ${rw(10)} ${rh(800)} ${rw(21)} ${rh(800)} ` +
      `H${rw(220)} ` +
      `C${rw(231)} ${rh(800)} ${rw(240)} ${rh(809)} ${rw(240)} ${rh(820)} ` +
      `V${rh(830)} ` +
      `C${rw(240)} ${rh(840)} ${rw(249)} ${rh(847)} ${rw(260)} ${rh(847)} ` +
      `H${rw(741)} ` +
      `C${rw(752)} ${rh(847)} ${rw(761)} ${rh(840)} ${rw(761)} ${rh(830)} ` +
      `V${rh(820)} ` + 
      `C${rw(761)} ${rh(809)} ${rw(770)} ${rh(800)} ${rw(781)} ${rh(800)} ` +
      `H${rw(1000)} ` +
      `C${rw(1011)} ${rh(800)} ${w} ${rh(790)} ${w} ${rh(780)} ` +
      `V${rh(35)} C${w} ${rh(25)} ${rw(1011)} ${rh(15)} ${rw(1000)} ${rh(15)} Z`;
}

export function initServicesHeroAnimations() {
  if (document.readyState === "complete") {
    requestAnimationFrame(safeInitServicesAnim);
  } else {
    window.addEventListener("load", safeInitServicesAnim);
  }

  document.addEventListener("astro:page-load", () => {
    servicesAnimInitialized = false;
    safeInitServicesAnim();
  });
}

function safeInitServicesAnim() {
  if (servicesAnimInitialized) return;
  const section = document.querySelector("#services-hero-section");
  if (!section || (section as HTMLElement).dataset.animInit) return;
  
  servicesAnimInitialized = true;
  runServicesHeroAnimation(section);
}

// Helper: Custom Cutout Path Generator (Desktop)
function generatePath(
  c1X: number, c1R: number,
  c2X: number, c2R: number,
  c3X: number, c3R: number,
  c1BottomR?: number
): string {
  const r = outerRadius;
  const k = r * K_FACTOR;
  const rSafe = Math.max(0.1, r);

  const c1Rt = c1R;
  const c1Rb = c1BottomR ?? c1R; 

  const c1kt = c1Rt * K_FACTOR;
  const c1kb = c1Rb * K_FACTOR;
  const c2k = c2R * K_FACTOR;
  const c3k = c3R * K_FACTOR;

  // Start Point (Top of C1)
  const startX = c1X + c1Rt;
  
  let d = `M ${startX} ${cardTop}`;
  
  // Card Outline
  d += ` H ${cardRight - rSafe}`;
  d += ` C ${cardRight - rSafe + k} ${cardTop} ${cardRight} ${cardTop + rSafe - k} ${cardRight} ${cardTop + rSafe}`;
  d += ` V ${cardBottom - rSafe}`;
  d += ` C ${cardRight} ${cardBottom - rSafe + k} ${cardRight - rSafe + k} ${cardBottom} ${cardRight - rSafe} ${cardBottom}`;
  d += ` H ${cardLeft + rSafe}`;
  d += ` C ${cardLeft + rSafe - k} ${cardBottom} ${cardLeft} ${cardBottom - rSafe + k} ${cardLeft} ${cardBottom - rSafe}`;
  d += ` V ${c3Bottom + c3R}`;

  // C3 (Bottom) ENTRY
  d += ` C ${cardLeft} ${c3Bottom + c3R - c3k} ${cardLeft + c3R - c3k} ${c3Bottom} ${cardLeft + c3R} ${c3Bottom}`;
  d += ` H ${c3X - c3R}`;
  // Floating Corner Up
  d += ` C ${c3X - c3R + c3k} ${c3Bottom} ${c3X} ${c3Bottom - c3R + c3k} ${c3X} ${c3Bottom - c3R}`;

  // C3 Wall
  d += ` V ${c3Top + c3R}`;

  // TRANSITION C3 -> C2 (Widening)
  d += ` C ${c3X} ${c3Top + c3R - c3k} ${c3X + c3R - c3k} ${c3Top} ${c3X + c3R} ${c3Top}`;
  d += ` H ${c2X - c2R}`;
  d += ` C ${c2X - c2R + c2k} ${c2Bottom} ${c2X} ${c2Bottom - c2R + c2k} ${c2X} ${c2Bottom - c2R}`;

  // C2 Wall
  d += ` V ${c2Top + c2R}`;

  // TRANSITION C2 -> C1 (Narrowing to c1Rb)
  d += ` C ${c2X} ${c2Top + c2R - c2k} ${c2X - c2R + c2k} ${c2Top} ${c2X - c2R} ${c2Top}`;
  d += ` H ${c1X + c1Rb}`;
  // Inner Fillet Right to C1 Bottom Wall (using c1Rb)
  d += ` C ${c1X + c1Rb - c1kb} ${c1Bottom} ${c1X} ${c1Bottom - c1Rb + c1kb} ${c1X} ${c1Bottom - c1Rb}`;

  // C1 Wall (Variable Width)
  d += ` V ${c1Top + c1Rt}`;

  // C1 Top Finish (TopMerge/InverseFillet using c1Rt)
  d += ` C ${c1X} ${c1Top + c1Rt - c1kt} ${c1X + c1Rt - c1kt} ${c1Top} ${c1X + c1Rt} ${c1Top}`;
  
  d += ` Z`;
  return d;
}

function runServicesHeroAnimation(section: Element) {
  const containerSvg = section.querySelector("#servicesHeroSVG") as SVGSVGElement;
  const pathEl = section.querySelector("#servicesHeroPath") as SVGPathElement;

  if (!containerSvg || !pathEl) return;

  (section as HTMLElement).dataset.animInit = "true";

  // CHECK MOBILE (Simple width check for initial load)
  const isMobile = window.innerWidth < 1024;
  
  let finalPath = "";
  let startPath = "";

  if (isMobile) {
     const w = window.innerWidth;
     const h = window.innerHeight; // Or fixed container height
     
     // IMPORTANT: The original implementation in hero-animation.ts relies on window size for SVG viewBox.
     // Here in Services, we often use 1920x1080 fixed.
     // To strictly copy, we should use dynamic viewBox if mobile?
     // Or just use the mobileResolution constants.
     
     containerSvg.setAttribute("viewBox", `0 0 ${w} ${h}`);
     
    // Start = Rectangle, End = Cross (using updated helper)
    startPath = rectangle(w, h);
    finalPath = cross(w, h);

  } else {
     // ... Existing Desktop Logic ...
     containerSvg.setAttribute("viewBox", `0 0 ${vbWidth} ${vbHeight}`);
     // ... (rest of desktop logic) ...
     const collapsedR = 0.1; 
     const collapsedX = cardLeft + 0.1;

     startPath = generatePath(
       cardLeft, outerRadius,
       collapsedX, collapsedR,
       collapsedX, collapsedR,
       0.1 
     );
    
     // State 3: All Cutouts
     finalPath = generatePath(
       c1FinalX, fullCutoutRadius,
       c2FinalX, fullCutoutRadius,
       c3FinalX, fullCutoutRadius
     );
  }

  pathEl.setAttribute("d", startPath);
  gsap.set(containerSvg, { opacity: 1, scale: 1.3 });

  const tl = gsap.timeline({ defaults: { ease: "power2.inOut" } });

  // PHASE 1: Zoom to normal with Bounce
  // Scale down slightly on mobile (0.94) so the rounded corners aren't clipped by the physical phone screen curves
  tl.to(containerSvg, { scale: isMobile ? 0.94 : 1, duration: 1.5, ease: "elastic.out(1, 0.75)" });

  // PHASE 2: Simultaneous Reveal (Quicker: 0.8s)
  tl.to(pathEl, {
    morphSVG: { shape: finalPath, shapeIndex: 0 },
    duration: 1.2, // Slightly more time for the subtler ease
    ease: "back.out(1.2)"
  }, "-=0.5");

  // DESKTOP TITLE TEXT REVEAL
  // "Text does not load before the svg" -> We sequence it AFTER the morph starts or completes.
  // We'll anchor it to the end of the morph minus a small overlap for smoothness, or strictly after.
  const desktopTitles = section.querySelectorAll(".desktop-headline-text");
  if (desktopTitles.length > 0 && !isMobile) {
      tl.fromTo(desktopTitles,
        { y: "100%", opacity: 0 },
        { 
          y: "0%", 
          opacity: 1, 
          duration: 1.0, 
          stagger: 0.2, 
          ease: "power3.out" 
        },
        "-=0.2" // Slight overlap with end of SVG morph
      );
  }

  // NAVBAR REVEAL (Synced with Reveal Start - kept as is, or adjust if user wants strictly after)
  // ... existing navbar ...
  const navbar = document.querySelector("#navbar-container");
  if (navbar) {
    gsap.set(navbar, { css: { transition: "none" } });
    
    // Fade In
    tl.to(navbar, { opacity: 1, duration: 0.05 }, "<");
    
    // Pop In
    tl.to(navbar, {
      scale: 1,
      duration: 1.0,
      ease: "back.out(1.7)",
      force3D: true,
      onComplete: () => {
        gsap.set(navbar, { clearProps: "transition" });
      }
    }, "<");
  }

  // OVERLAY ELEMENTS REVEAL (Right Text & Bottom Card)
  // Only animate if they exist/are visible (Mobile hides them, but we check anyway)
  const overlays = section.querySelectorAll(".hero-overlay-element");
  if (overlays.length > 0) {
    tl.fromTo(overlays, 
      { opacity: 0, y: 30 },
      {
        opacity: 1,
        y: 0,
        duration: 1.2,
        stagger: 0.2,
        ease: "power2.out"
      }, 
      "-=1.0" 
    );
  }
}
