import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export function initThemeTransition() {
  const processSection = document.querySelector("#process-section");
  const faqSection = document.querySelector("#faq-section-v2");
  const footer = document.querySelector("footer");

  if (!processSection) return;

  requestAnimationFrame(() => {
    const ctx = gsap.context(() => {
        // --- Shared Configuration (The "Settings") ---
        const transitionDuration = 0.6; 
        const transitionEase = "power2.inOut";
        
        // --- 1. Light -> Dark (Entering Process) ---
        // Trigger: Start transition as soon as Process approaches center-bottom
        const tlEnterDark = gsap.timeline({
            scrollTrigger: {
                trigger: processSection,
                start: "top 75%", 
                end: "top 25%",
                scrub: 0.5, // Reduced scrub lag for responsiveness
                toggleActions: "play none none reverse",
                invalidateOnRefresh: true, // Recalculate on resize (crucial due to pins)
                id: "theme-enter-dark"
            }
        });

        tlEnterDark.to("body", { 
            backgroundColor: "#050505", 
            color: "#ffffff", 
            duration: transitionDuration, 
            ease: "none", // Linear mapping to scroll is often smoother for scrubs
            overwrite: "auto"
        });
        
        // Also animate known light sections to dark if they aren't transparent
        tlEnterDark.to([processSection, faqSection], {
            backgroundColor: "#050505",
            color: "#ffffff",
            duration: transitionDuration, 
            ease: "none",
             overwrite: "auto"
        }, "<");
        
        // Target FAQ borders explicitly
        tlEnterDark.to(".faq-item-v2", {
            borderColor: "#333333",
            duration: transitionDuration,
            ease: "none",
            overwrite: "auto"
        }, "<");


        // --- 2. Dark -> Light (Entering Footer) ---
        // "Exact same settings as the first one" -> Mirror the scrub/trigger logic
        // Trigger: When Footer enters (top 90%? or end of FAQ)
        if (footer) {
             const tlExitDark = gsap.timeline({
                scrollTrigger: {
                    trigger: footer,
                    start: "top 85%", // Late trigger to keep FAQ dark as long as possible
                    end: "top 45%",   // Scrub transition over this distance
                    scrub: 1,
                    toggleActions: "play none none reverse",
                    id: "theme-exit-dark"
                }
            });

            tlExitDark.to("body", {
                backgroundColor: "#ffffff", // Back to White
                color: "#000000",
                duration: transitionDuration,
                ease: transitionEase,
                overwrite: "auto"
            });

            // Ensure footer stays light (though it has its own bg usually)
             tlExitDark.to(footer, {
                backgroundColor: "#f5f5f7", // Secondary light color
                color: "#1a1a1a",
                duration: transitionDuration,
                overwrite: "auto"
            }, "<");
        }

    });
  });
}
