import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export function initThemeTransition() {
  const processSection = document.querySelector("#process-section");
  const faqSection = document.querySelector("#faq-section-v2");
  const footer = document.querySelector("footer");
  // const portfolioSection = document.querySelector("#portfolio-section"); // Target via selector string to be safe if variable not needed globally

  if (!processSection) return;

  requestAnimationFrame(() => {
    const ctx = gsap.context(() => {
        // --- Shared Configuration ---
        const transitionDuration = 0.6; 
        
        // --- 1. Light -> Dark (Entering Process) ---
        // Trigger: Start transition as soon as Process approaches center-bottom
        const tlEnterDark = gsap.timeline({
            scrollTrigger: {
                trigger: processSection,
                start: "top 75%", 
                end: "top 25%",
                scrub: 0.5, 
                toggleActions: "play none none reverse",
                invalidateOnRefresh: true, 
                id: "theme-enter-dark"
            }
        });

        const darkColor = "#050505";
        const lightColor = "#ffffff";
        
        // 1. Body & Text
        tlEnterDark.to("body", { 
            backgroundColor: darkColor, 
            color: lightColor, 
            duration: transitionDuration, 
            ease: "none", 
            overwrite: "auto"
        });
        
        // 2. SECTIONS: Process, FAQ, AND Portfolio (Previous Section)
        // This ensures the section BEFORE the dark zone also turns dark so the transition is seamless
        const sectionsToDark = [processSection, faqSection, "#portfolio-section"];
        tlEnterDark.to(sectionsToDark, {
            backgroundColor: darkColor,
            color: lightColor,
            duration: transitionDuration, 
            ease: "none",
            overwrite: "auto"
        }, "<");
        
        // 3. FAQ Borders
        tlEnterDark.to(".faq-item-v2", {
            borderColor: "#333333",
            duration: transitionDuration,
            ease: "none",
            overwrite: "auto"
        }, "<");


        // --- 2. Dark -> Light (Entering Footer) ---
        if (footer) {
             const tlExitDark = gsap.timeline({
                scrollTrigger: {
                    trigger: footer,
                    start: "top 85%", 
                    end: "top 45%", 
                    scrub: 1,
                    toggleActions: "play none none reverse",
                    id: "theme-exit-dark"
                }
            });

            const secondaryColor = "#f5f5f7"; // The light gray bg

            // 1. Body & Text Back to Light
            tlExitDark.to("body", {
                backgroundColor: secondaryColor, // Match footer/secondary bg
                color: "#000000",
                duration: transitionDuration,
                ease: "none", // Linear scrub
                overwrite: "auto"
            });

            // 2. Sections: Footer AND FAQ (Previous Section)
            // Ensure FAQ fades back to light as we leave it
            const sectionsToLight = [footer, faqSection, "#portfolio-section"]; 
            tlExitDark.to(sectionsToLight, {
                backgroundColor: secondaryColor,
                color: "#1a1a1a",
                duration: transitionDuration,
                overwrite: "auto"
            }, "<");
            
            // 3. FAQ Borders Back to Light
             tlExitDark.to(".faq-item-v2", {
                borderColor: "rgba(0,0,0,0.1)", // Restore light border
                duration: transitionDuration,
                overwrite: "auto"
            }, "<");
        }

    });
  });
}
