import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export function initThemeTransition() {
  const processSection = document.querySelector("#process-section");
  const faqSection = document.querySelector("#faq-section-v2");

  if (!processSection) return;

  // Use requestAnimationFrame to ensure DOM is ready and layout settled
  requestAnimationFrame(() => {
    const ctx = gsap.context(() => {
        // Define the "Dark Zone"
        // Start: When Process Section hits 50% of viewport
        // End: When FAQ Section leaves (or Footer enters)
        // Since Process and FAQ are adjacent, we can treat them as a contiguous block if possible.
        // Or simpler: Toggle class on body based on the combined range.
        
        // Find the END element (FAQ section or Process if FAQ missing)
        const endTrigger = faqSection || processSection;

        ScrollTrigger.create({
            trigger: processSection,
            endTrigger: endTrigger, // Extend to end of FAQ
            start: "top 60%",       // Turn Dark when Process top hits 60% of viewport
            end: "bottom 40%",      // Turn Light when FAQ bottom hits 40% of viewport (simulating separate light footer)
            toggleClass: { className: "theme-dark", targets: "body" },
            // markers: true, // Debug if needed
            id: "theme-controller"
        });

    });
  });
}
