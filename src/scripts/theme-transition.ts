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
        const processSection = document.querySelector("#process-section");
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
                // Process: Only target the intro text, not the cards (which stay white)
                "#process-section > .container h2", "#process-section > .container p", 
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
            start: "top 50%", // Adjusted trigger point
            onEnter: () => tl.play(),
            onLeaveBack: () => tl.reverse(),
            id: "theme-enter"
        });

        // Create Scoped Footer Timeline (Dark -> Light)
        // Optimization: Only animate elements visible near the footer to reduce simple recalc overhead on mobile.
        const footerTl = gsap.timeline({ paused: true });
        
        // 1. Backgrounds (Visible) to White
        // We only care about Body and Footer here. Portfolio/Process are off-screen.
        footerTl.to("body, footer", { backgroundColor: "#ffffff", duration: duration, ease: ease }, 0);
        
        // 2. Navbar (Visible) to Black
        const navTexts = document.querySelectorAll(".nav-text");
        navTexts.forEach(el => {
             footerTl.to(el, { color: "#1a1a1a", duration: duration, ease: ease }, 0);
        });

        // 3. FAQ Text (Visible) to Black
        // Filter the main list to only include FAQ elements
        const faqTexts = textElementsToWhite.filter(el => el.closest("#faq-section-v2"));
        
        faqTexts.forEach(el => {
             footerTl.to(el, { color: "#1a1a1a", duration: duration, ease: ease }, 0);
             if (el.tagName.toLowerCase() === 'svg' || el.tagName.toLowerCase() === 'path') {
                 footerTl.to(el, { stroke: "#1a1a1a", fill: "transparent", duration: duration, ease: ease }, 0);
             }
        });
        
        // FAQ Borders
        faqItems.forEach(item => {
             footerTl.to(item, { borderColor: "#e5e7eb", duration: duration, ease: ease }, 0);
        });

        // Trigger 2: Footer Entry
        ScrollTrigger.create({
            trigger: footer,
            start: "top 90%",
            onEnter: () => footerTl.play(),
            onLeaveBack: () => footerTl.reverse(),
            id: "theme-footer-override"
        });

        // Force refresh to handle pinning calculations
        ScrollTrigger.refresh();

    }, 500);
  });
}
