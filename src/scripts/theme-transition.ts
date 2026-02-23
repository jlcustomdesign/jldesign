import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export function initThemeTransition() {
  const portfolioSection = document.querySelector("#portfolio-section");
  if (!portfolioSection) {
     // Check if we are on the portfolio page by URL to be safe, as ID might be missing
     if (window.location.pathname.includes("/portfolio")) return;
     // Otherwise continue (might be Home page with ID issues, or other pages)
  }
  
  if (!portfolioSection && !document.querySelector("#process-section-v2")) return; // Exit if no known sections

  // Use requestAnimationFrame to ensure DOM is ready
  requestAnimationFrame(() => {
    // Add delay to allow Process Section pinning to settle layout
    setTimeout(() => {
        // 1. Identify Sections AFTER Portfolio
        // Order: Portfolio -> Process -> FAQ -> Footer
        const processSection = document.querySelector("#process-section-v2");
        const blogPreview = document.querySelector("#blog-preview");
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
        if (blogPreview) backgroundElementsToBlack.push(blogPreview as HTMLElement);
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
                "#blog-preview h2", "#blog-preview h3", "#blog-preview p", "#blog-preview span",
                "#faq-section-v2 h2", "#faq-section-v2 button", "#faq-section-v2 span", "#faq-section-v2 p", "#faq-section-v2 svg",
                ".nav-text", // Added back
                ".fab-text", // FAB Ring Text
                ".fab-bg"    // FAB Circle Background
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

        // Animate Text/Elements to White (Dark Mode)
        textElementsToWhite.forEach(el => {
            if (el.classList.contains("fab-bg")) {
                // FAB Circle: Gold -> White Background, Icon -> Black
                tl.to(el, { backgroundColor: "#ffffff", color: "#000000", duration: duration, ease: ease }, 0);
            } else if (el.classList.contains("fab-text")) {
                // FAB Ring Text: Black -> White Fill
                 tl.to(el, { fill: "#ffffff", duration: duration, ease: ease }, 0);
            } else {
                // Standard Text
                tl.to(el, { color: "#ffffff", duration: duration, ease: ease }, 0);
                
                if (el.tagName.toLowerCase() === 'svg' || el.tagName.toLowerCase() === 'path') {
                     tl.to(el, { stroke: "#ffffff", fill: "transparent", duration: duration, ease: ease }, 0);
                }
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

        // Trigger 2: Revert to Light Mode (at FAQ Section) -> REMOVED
        // User requested FAQ to stay Dark (same as Process)
        /* 
        if (faqSection) { ... } 
        */

        // Trigger 3: Footer Reveal (Light Mode)
        // Switch from Black (FAQ) to White (Footer) as requested
        if (faqSection) {
            ScrollTrigger.create({
                trigger: faqSection,
                start: "bottom bottom", 
                onEnter: () => tl.reverse(), // Go Light (White)
                onLeaveBack: () => tl.play(), // Go Dark (Back to FAQ)
                id: "theme-footer-light"
            });
        } else {
             // Fallback if no FAQ, trigger on Main end
             ScrollTrigger.create({
                trigger: "main",
                start: "bottom bottom",
                onEnter: () => tl.play(),
                onLeaveBack: () => tl.reverse(),
                id: "theme-footer-dark-fallback"
            });
        }

        // Force refresh to handle pinning calculations
        ScrollTrigger.refresh();

    }, 500);
  });
}
