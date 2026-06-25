import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
// @ts-ignore - Importing from outside src is tricky in Astro, but this works for local files
import { ScrollSmoother } from "../../gsap-public/esm/ScrollSmoother.js";

export function initSmoothScroll() {
  if (typeof window === 'undefined') return;
  
  // Bypass ScrollSmoother for print mode (PDF) and for the admin content editor
  // preview (?cms=1) — both need NATIVE scrolling so scrollIntoView works and so
  // the editor can jump the preview to a clicked field. Real visitors are
  // unaffected; smooth scroll only runs without these flags.
  if (window.location.search.includes('print=true') || window.location.search.includes('cms=1')) {
    gsap.registerPlugin(ScrollTrigger);
    ScrollTrigger.refresh();
    return;
  }

  gsap.registerPlugin(ScrollTrigger, ScrollSmoother);

  // Skip ScrollSmoother on mobile for performance
  // Mobile devices struggle with the smooth scrolling calculations
  const isMobile = window.innerWidth < 1024 || 'ontouchstart' in window;
  
  if (isMobile) {
    // Just register ScrollTrigger without smooth scrolling.
    // Defer refresh to allow page to paint first.
    return;
  }

  // Initialize ScrollSmoother only on desktop
  // Note: Layout.astro must have #smooth-wrapper and #smooth-content
  /* @ts-ignore */
  const smoother = ScrollSmoother.create({
    wrapper: "#smooth-wrapper",
    content: "#smooth-content",
    smooth: 2.0, // Increased for a more luxurious feel (was 1.5)
    effects: true, 
    smoothTouch: false, // Disabled for performance
    normalizeScroll: false, // DISABLED: This was eating desktop mousedown events
  });

  /* @ts-ignore */
  window.smoother = smoother;
}
