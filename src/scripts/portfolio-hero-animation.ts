import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

let heroAnimInitialized = false;

export function initPortfolioHeroAnimations() {
  if (document.readyState === "complete") {
    requestAnimationFrame(() => safeInitHeroAnim());
  } else {
    window.addEventListener("load", () => safeInitHeroAnim());
  }

  document.addEventListener("astro:page-load", () => {
    heroAnimInitialized = false;
    safeInitHeroAnim();
  });
}

function safeInitHeroAnim() {
  const section = document.querySelector("#portfolio-hero-section");
  if (!section) return;
  
  // Always run if section exists (Astro handles cleanup via page replacement)
  runHeroEnterAnimation(section);
}

function runHeroEnterAnimation(section: Element) {
  // Clear any existing markers if needed, but mainly just run.

  const cards = section.querySelectorAll(".portfolio-card");
  const navbar = document.querySelector("#navbar-container");

  // Reset state first to ensure clean animation
  gsap.set(cards, { y: 30, opacity: 0 }); 

  const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

  // 1. Reveal Navbar (if hidden)
  if (navbar) {
    tl.to(navbar, { opacity: 1, scale: 1, duration: 0.8, ease: "back.out(1.7)" }, 0.2);
  }

  // 2. Minimalist Directional Card Slides
  const mainCard = section.querySelector(".hero-card-main");
  const descCard = section.querySelector(".hero-card-desc");
  const ctaCard = section.querySelector(".hero-card-cta");

  // Main Card: Left -> Center (Long Slide, Elastic Bounce)
  if (mainCard) {
    tl.fromTo(mainCard,
      { xPercent: -100, x: 0, opacity: 0 }, // Start further out
      { xPercent: 0, x: 0, y: 0, opacity: 1, duration: 1.5, ease: "elastic.out(1, 0.75)" },
      0.1
    );
  }

  // Desc Card: Top -> Center
  if (descCard) {
    tl.fromTo(descCard,
      { yPercent: -100, y: 0, opacity: 0 },
      { yPercent: 0, y: 0, opacity: 1, duration: 1.5, ease: "elastic.out(1, 0.75)" },
      0.4
    );
  }

  // CTA Card: Bottom -> Center
  if (ctaCard) {
    tl.fromTo(ctaCard,
      { yPercent: 100, y: 0, opacity: 0 },
      { yPercent: 0, y: 0, opacity: 1, duration: 1.5, ease: "elastic.out(1, 0.75)" },
      0.7
    );
  }

  // 2b. Mobile Marquees (If Visible)
  const mobileMarquees = section.querySelectorAll(".mobile-marquee");
  if (mobileMarquees.length > 0) {
     tl.fromTo(mobileMarquees,
        { y: 50, opacity: 0 },
        { y: 0, opacity: 1, duration: 1.0, ease: "power3.out", stagger: 0.15 },
        0.3 // Sync closely with navbar/page load
     );
  }

  // 3. Text Reveal (Services Page Style - Build Animation)
  // ... (existing text reveal code) ...
  const textElements = section.querySelectorAll(".reveal-text");
  
  if (textElements.length > 0) {
    tl.fromTo(textElements,
       { y: "100%", opacity: 0 },
       { 
         y: "0%", 
         opacity: 1, 
         duration: 1.0, 
         ease: "power3.out",
         stagger: 0.08
       },
       "-=1.0" // Sync deeper with card slide
    );
  }

  // 4. Parallax Exit Animation (Like Home/About)
  runPortfolioHeroExitAnimation(section);
}

function runPortfolioHeroExitAnimation(section: Element) {
    // Animate both Desktop and Mobile containers out if they exist
    const desktopContainer = section.querySelector(".container");
    const mobileContainer = section.querySelector(".mobile-hero-container");
    
    const targets = [];
    if (desktopContainer) targets.push(desktopContainer);
    if (mobileContainer) targets.push(mobileContainer);

    if (targets.length === 0) return;

    // Optional: Only pin on Desktop to prevent Safari mobile address bar issues, similar to About page
    const isMobile = window.innerWidth < 1024;

    if (!isMobile) {
      gsap.to(targets, {
        scale: 0.9,
        filter: "blur(8px)", 
        opacity: 0,
        ease: "none",
        scrollTrigger: {
          trigger: section,
          start: "bottom bottom",
          end: "bottom top",
          scrub: 0.5,
          pin: true,
          pinSpacing: false,
          invalidateOnRefresh: true,
        },
      });
    } else {
       // Mobile: just fade out slightly without a heavy pin
       gsap.to(targets, {
        opacity: 0.3,
        ease: "none",
        scrollTrigger: {
          trigger: section,
          start: "bottom bottom",
          end: "bottom top",
          scrub: true,
        },
      });
    }
}
