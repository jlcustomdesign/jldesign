import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
// @ts-ignore - Importing from outside src is tricky in Astro, but this works for local files
import { ScrollSmoother } from "../../gsap-public/esm/ScrollSmoother.js";

export function initSmoothScroll() {
  if (typeof window === 'undefined') return;

  gsap.registerPlugin(ScrollTrigger, ScrollSmoother);

  // Initialize ScrollSmoother
  // Note: Layout.astro must have #smooth-wrapper and #smooth-content
  /* @ts-ignore */
  const smoother = ScrollSmoother.create({
    wrapper: "#smooth-wrapper",
    content: "#smooth-content",
    smooth: 2, // Reverted to 2 for better responsiveness (3 was too slow)
    effects: true, 
    smoothTouch: false, // DISABLED to allow Services Observer to control touch events
  });

  /* @ts-ignore */
  window.smoother = smoother;
}
