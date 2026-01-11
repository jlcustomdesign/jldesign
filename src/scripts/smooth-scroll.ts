import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
// @ts-ignore - Importing from outside src is tricky in Astro, but this works for local files
import { ScrollSmoother } from "../../gsap-public/esm/ScrollSmoother.js";

export function initSmoothScroll() {
  if (typeof window === 'undefined') return;

  gsap.registerPlugin(ScrollTrigger, ScrollSmoother);

  // Skip ScrollSmoother on mobile for performance
  // Mobile devices struggle with the smooth scrolling calculations
  const isMobile = window.innerWidth < 1024 || 'ontouchstart' in window;
  
  if (isMobile) {
    // Just register ScrollTrigger without smooth scrolling
    ScrollTrigger.refresh();
    return;
  }

  // Initialize ScrollSmoother only on desktop
  // Note: Layout.astro must have #smooth-wrapper and #smooth-content
  /* @ts-ignore */
  const smoother = ScrollSmoother.create({
    wrapper: "#smooth-wrapper",
    content: "#smooth-content",
    smooth: 1.5, // Reduced from 2 for better performance
    effects: true, 
    smoothTouch: false, // Disabled for performance
  });

  /* @ts-ignore */
  window.smoother = smoother;
}
