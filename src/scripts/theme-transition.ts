import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export function initThemeTransition() {
  const portfolioSection = document.querySelector("#portfolio-section");
  if (!portfolioSection) return;

  // Use requestAnimationFrame to ensure DOM is ready
  requestAnimationFrame(() => {
    // Add delay to allow Process Section pinning to settle layout
    setTimeout(() => {
        // 1. Identify Sections AFTER Portfolio
        // Order: Portfolio -> Process -> FAQ -> Footer
        const processSection = document.querySelector("#process-section-v2");
        const faqSection = document.querySelector("#faq-section-v2");
        const footer = document.querySelector("footer");
        const main = document.querySelector("main");

        // Elements groups
        const backgroundElementsToBlack: HTMLElement[] = [];
        const textElementsToWhite: HTMLElement[] = [];

        // --- A. Collect Background Elements ---
        // Include Portfolio because it might still be visible
        if (portfolioSection) backgroundElementsToBlack.push(portfolioSection as HTMLElement);
        if (processSection) backgroundElementsToBlack.push(processSection as HTMLElement);
        if (faqSection) backgroundElementsToBlack.push(faqSection as HTMLElement);
        if (footer) backgroundElementsToBlack.push(footer as HTMLElement);
        
        // --- B. Collect Text Elements ---
        if (main) {
            // Selectors for text in Portfolio, Process, FAQ
            // Re-added .nav-text to ensure Global Theme Sync (First Transition & Footer)
            const selectors = [
                "#portfolio-section h2", "#portfolio-section h3", "#portfolio-section p", "#portfolio-section span", "#portfolio-section .text-primary",
                // Process V2: Text is already white by default spread, but we ensure consistency
                "#process-section-v2 h2", "#process-section-v2 p", "#process-section-v2 h3",
                "#faq-section-v2 h2", "#faq-section-v2 button", "#faq-section-v2 span", "#faq-section-v2 p", "#faq-section-v2 svg",
                ".nav-text" // Added back
            ].join(", ");

            const elements = document.querySelectorAll(selectors);
            elements.forEach((el) => {
                 textElementsToWhite.push(el as HTMLElement);
            });
        }

        // --- C. Create Master Timeline (Paused) ---
        const tl = gsap.timeline({ paused: true });
        const duration = 0.5; // Faster transition (was 0.8)
        const ease = "power2.inOut";

        // Build Animation: Light -> Dark
        // Animate Backgrounds to Black
        backgroundElementsToBlack.forEach(el => {
            tl.to(el, { backgroundColor: "#050505", duration: duration, ease: ease }, 0);
        });
        // Animate Body to Black
        tl.to("body", { backgroundColor: "#050505", duration: duration, ease: ease }, 0);

        // Animate Text to White
        textElementsToWhite.forEach(el => {
            tl.to(el, { color: "#ffffff", duration: duration, ease: ease }, 0);
            
            if (el.tagName.toLowerCase() === 'svg' || el.tagName.toLowerCase() === 'path') {
                 tl.to(el, { stroke: "#ffffff", fill: "transparent", duration: duration, ease: ease }, 0);
            }
        });
        
        // FAQ Borders
        const faqItems = document.querySelectorAll(".faq-item-v2");
        faqItems.forEach(item => {
            tl.to(item, { borderColor: "#333333", duration: duration, ease: ease }, 0);
        });

        // --- D. Triggers ---

        // Trigger 1: Enter Dark Mode (at Process Section)
        ScrollTrigger.create({
            trigger: processSection || portfolioSection,
            start: "top 80%", // Adjusted trigger point: Early switch
            onEnter: () => tl.play(),
            onLeaveBack: () => tl.reverse(),
            id: "theme-enter"
        });

        // Trigger 2: Revert to Light Mode (at FAQ Section)
        // This ensures the requested "Color Transition" is visible (Dark Process -> Light FAQ)
        if (faqSection) {
             ScrollTrigger.create({
                trigger: faqSection,
                start: "top 70%", // Switch to Light as FAQ becomes dominant
                onEnter: () => tl.reverse(), // Go Light
                onLeaveBack: () => tl.play(), // Go Dark (back to Process)
                id: "theme-faq-light"
            });
        }

        // Trigger 3: Footer Reveal (Dark Mode)
        // Triggered by the physical spacer element created by the Footer script
        // This ensures the Footer Card (Dark) is matched by the Global Theme
        const footerSpacer = document.getElementById("footer-spacer");
        ScrollTrigger.create({
            trigger: footerSpacer || "main", // Fallback to main end
            start: footerSpacer ? "top 80%" : "bottom bottom", // Reveal Dark slightly before full bottom
            onEnter: () => tl.play(), // Go Dark
            onLeaveBack: () => tl.reverse(), // Go Light (back to FAQ)
            id: "theme-footer-dark"
        });

        // Force refresh to handle pinning calculations
        ScrollTrigger.refresh();

    }, 500);
  });
}
