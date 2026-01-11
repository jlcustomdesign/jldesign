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
        const ctx = gsap.context(() => {
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
            const portfolioSection = document.querySelector("#portfolio-section");
            if (portfolioSection) backgroundElementsToBlack.push(portfolioSection as HTMLElement);
            if (processSection) backgroundElementsToBlack.push(processSection as HTMLElement);
            if (faqSection) backgroundElementsToBlack.push(faqSection as HTMLElement);
            if (footer) backgroundElementsToBlack.push(footer as HTMLElement);
            
            // --- B. Collect Text Elements ---
            if (main) {
                const selectors = [
                    "#portfolio-section h2", "#portfolio-section h3", "#portfolio-section p", "#portfolio-section span", "#portfolio-section .text-primary",
                    "#process-section > .container h2", "#process-section > .container p", 
                    "#faq-section-v2 h2", "#faq-section-v2 button", "#faq-section-v2 span", "#faq-section-v2 p", "#faq-section-v2 svg"
                ].join(", ");

                const elements = document.querySelectorAll(selectors);
                elements.forEach((el) => {
                     textElementsToWhite.push(el as HTMLElement);
                });
            }

            // --- C. Create Master Timeline (Paused) ---
            const tl = gsap.timeline({ paused: true });
            const duration = 0.5;
            const ease = "power2.inOut";

            // Build Animation: Light -> Dark
            backgroundElementsToBlack.forEach(el => {
                tl.to(el, { backgroundColor: "#050505", duration: duration, ease: ease, overwrite: "auto", force3D: true }, 0);
            });
            tl.to("body", { backgroundColor: "#050505", duration: duration, ease: ease, overwrite: "auto", force3D: true }, 0);

            textElementsToWhite.forEach(el => {
                tl.to(el, { color: "#ffffff", duration: duration, ease: ease, overwrite: "auto", force3D: true }, 0);
                if (el.tagName.toLowerCase() === 'svg' || el.tagName.toLowerCase() === 'path') {
                     tl.to(el, { stroke: "#ffffff", fill: "transparent", duration: duration, ease: ease, overwrite: "auto", force3D: true }, 0);
                }
            });
            
            const faqItems = document.querySelectorAll(".faq-item-v2");
            faqItems.forEach(item => {
                tl.to(item, { borderColor: "#333333", duration: duration, ease: ease, overwrite: "auto", force3D: true }, 0);
            });

            // --- D. Triggers ---

            // Trigger 1: Enter Dark Mode (at Process Section)
            // Restore exact logic: Process or Portfolio trigger
            const triggerEl = processSection || portfolioSection;
            if (triggerEl) {
                ScrollTrigger.create({
                    trigger: triggerEl,
                    start: "top 50%",
                    onEnter: () => tl.play(),
                    onLeaveBack: () => tl.reverse(),
                    id: "theme-enter"
                });
            }

            // Trigger 2: Turn LIGHT when scrolling DOWN (Late/Low)
            if (footer) {
                ScrollTrigger.create({
                    trigger: footer,
                    start: "top 95%", 
                    onEnter: () => tl.reverse(), 
                    id: "theme-to-light"
                });

                // Trigger 3: Turn DARK when scrolling UP (Sooner/High)
                ScrollTrigger.create({
                    trigger: footer,
                    start: "top 70%", 
                    onLeaveBack: () => tl.play(), 
                    id: "theme-to-dark"
                });
            }

            // Force refresh to handle pinning calculations
            ScrollTrigger.refresh();
        });

        // Cleanup
        const cleanup = () => {
             ctx.revert();
             document.removeEventListener("astro:before-preparation", cleanup);
        };
        document.addEventListener("astro:before-preparation", cleanup);

    }, 500);
  });
}
