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

  // 1.5. Subtle zoom-out on the background image 
  const bgImg = section.querySelector(".overlay-bg");
  if (bgImg) {
    gsap.fromTo(bgImg, 
      { scale: 1.1 },
      { scale: 1, duration: 2.5, ease: "power2.out" }
    );
  }

  // 2. Animate massive Hero Marquees sequentially
  const heroMarquees = section.querySelectorAll(".hero-marquee");
  if (heroMarquees.length > 0) {
     tl.fromTo(heroMarquees,
        { y: 100, opacity: 0 },
        { y: 0, opacity: 1, duration: 1.2, ease: "power3.out", stagger: 0.15 },
        0.3 // Sync closely with navbar/page load
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

    // Apply consistent parallax exit animation for both Desktop and Mobile
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

    // 5. Navbar Theme Transition (Portfolio specific)
    // theme-transition.ts ignores the Portfolio page, so we manually handle the Light switch here
    const navbar = document.querySelector("#navbar-container");
    const cmsSection = document.querySelector("#portfolio-cms-section");
    
    // Only apply on mobile where the hero is Dark. On Desktop, the navbar is already Light.
    if (navbar && cmsSection && window.innerWidth < 1024) {
        ScrollTrigger.create({
            trigger: cmsSection,
            start: "top 12%", // Triggers when the white background CMS section reaches the navbar area
            onEnter: () => {
                navbar.classList.remove("nav-dark");
                navbar.classList.add("nav-light");
            },
            onLeaveBack: () => {
                navbar.classList.remove("nav-light");
                navbar.classList.add("nav-dark");
            }
        });
    }
}
