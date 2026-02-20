import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { MorphSVGPlugin } from "gsap/MorphSVGPlugin";

gsap.registerPlugin(ScrollTrigger, MorphSVGPlugin);

const widthTarget = 1110;
const desktopResolution = { width: 1890, height: 916 };
const mobileResolution = { width: 1020, height: 882 };

let heroAnimInitialized = false;
let heroExitInitialized = false;

export function initHeroAnimations() {
  if (document.readyState === "complete") {
    requestAnimationFrame(() => {
        safeInitHeroAnim();
        safeInitHeroExitAnimation();
    });
  } else {
    window.addEventListener("load", () => {
        safeInitHeroAnim();
        safeInitHeroExitAnimation();
    });
  }

  // Also hook into Astro's page transition events
  document.addEventListener("astro:page-load", () => {
    heroAnimInitialized = false;
    heroExitInitialized = false;
    safeInitHeroAnim();
    safeInitHeroExitAnimation();
  });
}

function safeInitHeroAnim() {
  if (heroAnimInitialized) return;
  const section = document.querySelector("#hero-section");
  if (!section || (section as HTMLElement).dataset.heroAnimInit) return;
  heroAnimInitialized = true;
  runHeroEnterAnimation(section);
}

function safeInitHeroExitAnimation() {
  if (heroExitInitialized) return;
  const heroSection = document.querySelector("#hero-section");
  if (heroSection && (heroSection as HTMLElement).dataset.exitAnimInit) return;
  heroExitInitialized = true;
  runHeroExitAnimation();
}

function runHeroEnterAnimation(section: Element) {
  const svg = document.querySelector("#mySVG");
  if (!section || !svg) return;

  // Mark as initialized
  (section as HTMLElement).dataset.heroAnimInit = "true";

  // Custom split specifically for this known title structure
  const splitHeroCardTitle = () => {
    const titleEl = section.querySelector(".hero-card-title");
    if (titleEl) {
      const html = `
            <span class="inline-block overflow-hidden"><span class="inline-block translate-y-full opacity-0 will-change-transform">Calitate</span></span>
            <span class="inline-block overflow-hidden"><span class="inline-block translate-y-full opacity-0 will-change-transform">Fără</span></span>
            <br />
            <span class="text-accent inline-block overflow-hidden"><span class="inline-block translate-y-full opacity-0 will-change-transform">Compromis</span></span>
           `;
      titleEl.innerHTML = html;
    }
  };

  splitHeroCardTitle();

  // Ensure parent is visible immediately after split, children are hidden
  const titleEl = section.querySelector(".hero-card-title");
  if (titleEl) gsap.set(titleEl, { opacity: 1 });

  // Use Context for easy cleanup
  const ctx = gsap.context(() => {
    const masterTl = gsap.timeline({ defaults: { ease: "power3.out" } });

    // --- 1. SVG & Background Setup ---
    try {
      const width = window.innerWidth;
      const height = window.innerHeight;

      svg.setAttribute("viewBox", `0 0 ${width} ${height}`);

      // Select Path (now inside clipPath)
      let path = svg.querySelector("#heroPath");
      if (!path) {
        path = document.createElementNS("http://www.w3.org/2000/svg", "path");
        path.id = "heroPath";
        svg.appendChild(path);
      }

      // Initial State (Rectangle)
      path.setAttribute("d", rectangle(width, height));

      // Fade in SVG
      gsap.to(svg, { opacity: 1, duration: 0.3 });

      // SVG Animation
      if (gsap.plugins.morphSVG) {
        masterTl.add(runSvgAnim(path, width, height));
        masterTl.addLabel("svgComplete"); // Mark end of SVG anim
      } else {
        console.warn("GSAP MorphSVGPlugin not loaded. Skipping morph.");
        masterTl.addLabel("svgComplete"); // Fallback mark
      }

      // Resize Listener
      let lastWidth = window.innerWidth;
      let rafId: number;
      const onResize = () => {
        const w = window.innerWidth;
        const h = window.innerHeight;
        if (w === lastWidth) return;
        lastWidth = w;

        if (rafId) cancelAnimationFrame(rafId);
        rafId = requestAnimationFrame(() => {
          svg.setAttribute("viewBox", `0 0 ${w} ${h}`);
          path.setAttribute("d", cross(w, h));
        });
      };
      window.addEventListener("resize", onResize);
    } catch (e) {
      console.warn("Hero Background Animation Error:", e);
    }

    // --- 3. Synchronized Content (Navbar, Buttons, Top Elements) ---
    const navbar = document.querySelector("#navbar-container");
    
    // Navbar Reveal
    if (navbar) {
      // FORCE REMOVE CSS TRANSITIONS to allow GSAP full control of physics
      gsap.set(navbar, { css: { transition: "none" } });
      
      masterTl.to(navbar, { opacity: 1, duration: 0.05 }, "svgComplete");
      masterTl.to(
        navbar,
        {
          scale: 1,
          duration: 1.0, 
          ease: "back.out(1.7)", // Standard "One Bounce"
          force3D: true,
          onComplete: () => {
            gsap.set(navbar, { clearProps: "transition" });
          }
        },
        "svgComplete"
      );
    }
    
    // CTA Buttons Reveal
    masterTl.to(".hero-btn", { 
      y: 0, 
      autoAlpha: 1, 
      duration: 0.8,
      stagger: 0.1
    }, "svgComplete+=0.2");

    // Top Elements Reveal - DIVERSIFIED & SAFE (Animates Children)
    // Top Left (Logo) - Slide in from Left
    masterTl.fromTo(".hero-top-left", 
        { x: -60, autoAlpha: 0 },
        { x: 0, autoAlpha: 1, duration: 1.0, ease: "back.out(1.7)" },
        "svgComplete+=0.1"
    );

    // Top Right (Button) - Slide in from Right
    masterTl.fromTo(".hero-top-right", 
        { x: 60, autoAlpha: 0 },
        { x: 0, autoAlpha: 1, duration: 1.0, ease: "back.out(1.7)" },
        "svgComplete+=0.1"
    );

    // Main Text Reveal (Title & Subtitle) - Synced
    masterTl.fromTo(".hero-text-element", 
        { y: 50, autoAlpha: 0 },
        { y: 0, autoAlpha: 1, duration: 1.0, stagger: 0.2, ease: "power3.out" },
        "svgComplete"
    );

    // Enable interaction on Title ONLY after animation completes (approx 1.8s delay + 1.5s anim)
    masterTl.call(() => {
        const title = document.querySelector("#hero-title");
        if(title) title.classList.remove("pointer-events-none");
    }, undefined, "+=1.0"); // Add a little buffer after buttons appear

    // Smooth scroll for About button
    const aboutBtn = section.querySelector("#hero-about-btn");
    if (aboutBtn) {
      aboutBtn.addEventListener("click", (e) => {
        e.preventDefault();
        // @ts-ignore
        if (window.smoother) {
          // @ts-ignore
          window.smoother.scrollTo("#about-section", true, "top top");
        } else {
          const target = document.querySelector("#about-section");
          target?.scrollIntoView({ behavior: "smooth" });
        }
      });
    }





  }, section);
}



function runSvgAnim(path: Element, width: number, height: number) {
  const tl = gsap.timeline();
  tl.from("#mySVG", {
    scale: 1.5,
    duration: 1,
    ease: "power4.out",
  }).to(path, {
    scale: 1,
    duration: width > widthTarget ? 1.8 : 0.6,
    morphSVG: cross(width, height),
    ease: width > widthTarget ? "elastic.out(1, 0.9)" : "back.out(1.7)",
  });
  return tl;
}

function runHeroExitAnimation() {
    const heroSection = document.querySelector("#hero-section");
    const heroContent = document.querySelector("#hero-content-wrapper");
    if (!heroSection) return;

    const isMobile = window.innerWidth < 1024;

    if (isMobile) {
      // On mobile: NO pin (prevents Safari from detecting cream content behind pinned hero).
      // Just let the hero scroll away naturally — no parallax blur.
      // This avoids exposing the About section behind a fixed-positioned hero.
      (heroSection as HTMLElement).dataset.exitAnimInit = "true";
      return;
    }

    // Desktop: full parallax exit with pin
    gsap.to(heroContent || heroSection, {
      scale: 0.9,
      filter: "blur(8px)",
      opacity: 0.5,
      ease: "none",
      force3D: true,
      scrollTrigger: {
        trigger: heroSection,
        start: "top top",
        end: "bottom top",
        scrub: 0.5,
        pin: true, 
        pinSpacing: false,
        invalidateOnRefresh: true,
      },
    });

    (heroSection as HTMLElement).dataset.exitAnimInit = "true";
  }

export function rectangle(w: number, h: number) {
  const displayCond = w > widthTarget;
  let w1 = mobileResolution.width;
  let h1 = mobileResolution.height;

  if (displayCond) {
    w1 = desktopResolution.width;
    h1 = desktopResolution.height;
  }

  const rw = (val: number) => (val / w1) * w;
  const rh = (val: number) => (val / h1) * h;

  return displayCond
    ? `M${rw(12)} ${rh(1)} H${rw(12)} C${rw(4)} ${rh(1)} ${rw(1)} ${rh(4)} ${rw(1)} ${rh(12)} V${rh(905)} C${rw(1)} ${rh(913)} ${rw(4)} ${h} ${rw(12)} ${h} H${rw(1879)} C${rw(1879)} ${h} ${rw(1879)} ${h} ${rw(1879)} ${h} V${h} C${rw(1879)} ${h} ${rw(1879)} ${h} ${rw(1879)} ${h} H${rw(1879)} C${rw(1879)} ${h} ${rw(1879)} ${h} ${rw(1879)} ${h} V${h} C${rw(1879)} ${h} ${rw(1879)} ${h} ${rw(1879)} ${h} H${rw(1879)} C${rw(1887)} ${h} ${w} ${rh(913)} ${w} ${rh(905)} V${rh(12)} C${w} ${rh(12)} ${w} ${rh(12)} ${w} ${rh(12)} H${w} C${w} ${rh(4)} ${rw(1887)} ${rh(1)} ${rw(1879)} ${rh(1)} V${rh(1)} C${rw(1879)} ${rh(1)} ${rw(1879)} ${rh(1)} ${rw(1879)} ${rh(1)} H${rw(12)} V${rh(1)} C${rw(4)} ${rh(1)} ${rw(1)} ${rh(4)} ${rw(1)} ${rh(12)} Z`
    : `M${rw(1000)} ${rh(15)} H${rw(21)} C${rw(9.9543)} ${rh(15)} ${rw(1)} ${rh(24.9543)} ${rw(1)} ${rh(35)} V${rh(845)} C${rw(1)} ${rh(845)} ${rw(1)} ${rh(845)} ${rw(1)} ${rh(845)} H${rw(1)} C${rw(1)} ${rh(860)} ${rw(6)} ${rh(867)} ${rw(21)} ${rh(867)} V${rh(867)} C${rw(21)} ${rh(867)} ${rw(21)} ${rh(867)} ${rw(21)} ${rh(867)} H${rw(997)} C${rw(997)} ${rh(867)} ${rw(997)} ${rh(867)} ${rw(997)} ${rh(867)} V${rh(867)} C${rw(1016)} ${rh(867)} ${w} ${rh(862)} ${w} ${rh(845)} H${w} C${w} ${rh(845)} ${w} ${rh(845)} ${w} ${rh(845)} V${rh(35)} C${w} ${rh(24.9543)} ${rw(1011.05)} ${rh(15)} ${rw(1000)} ${rh(15)} Z`;
}

export function cross(w: number, h: number) {
  const displayCond = w > widthTarget;
  let w1 = mobileResolution.width;
  let h1 = mobileResolution.height;

  if (displayCond) {
    w1 = desktopResolution.width;
    h1 = desktopResolution.height;
  }

  const rw = (val: number) => (val / w1) * w;
  const rh = (val: number) => (val / h1) * h;

  return displayCond
    ? `M${rw(470)} ${rh(145)} H${rw(19)} C${rw(9)} ${rh(145)} ${rw(1)} ${rh(153)} ${rw(1)} ${rh(163)} V${rh(754)} C${rw(1)} ${rh(763)} ${rw(9)} ${rh(772)} ${rw(19)} ${rh(772)} H${rw(320)} C${rw(330)} ${rh(772)} ${rw(338)} ${rh(780)} ${rw(338)} ${rh(790)} V${rh(898)} C${rw(338)} ${rh(907)} ${rw(346)} ${h} ${rw(356)} ${h} H${rw(1092)} C${rw(1102)} ${h} ${rw(1110)} ${rh(907)} ${rw(1110)} ${rh(898)} V${rh(789)} C${rw(1110)} ${rh(779)} ${rw(1118)} ${rh(771)} ${rw(1128)} ${rh(771)} H${rw(1872)} C${rw(1881)} ${rh(771)} ${w} ${rh(763)} ${w} ${rh(753)} V${rh(164)} C${w} ${rh(154)} ${rw(1881)} ${rh(146)} ${rw(1872)} ${rh(146)} H${rw(1420)} C${rw(1410)} ${rh(146)} ${rw(1402)} ${rh(137)} ${rw(1402)} ${rh(128)} V${rh(19)} C${rw(1402)} ${rh(9)} ${rw(1394)} ${rh(1)} ${rw(1384)} ${rh(1)} H${rw(506)} C${rw(496)} ${rh(1)} ${rw(488)} ${rh(9)} ${rw(488)} ${rh(19)} V${rh(127)} C${rw(488)} ${rh(137)} ${rw(480)} ${rh(145)} ${rw(470)} ${rh(145)} Z`
    : `M${rw(1000)} ${rh(15)} H${rw(21)} C${rw(9.9543)} ${rh(15)} ${rw(1)} ${rh(24.9543)} ${rw(1)} ${rh(35)} V${rh(680)} C${rw(1)} ${rh(691.046)} ${rw(9.9543)} ${rh(700)} ${rw(21)} ${rh(700)} H${rw(220)} C${rw(231.046)} ${rh(700)} ${rw(240)} ${rh(708.954)} ${rw(240)} ${rh(720)} V${rh(846.869)} C${rw(240)} ${rh(857.915)} ${rw(248.954)} ${rh(866.869)} ${rw(260)} ${rh(866.869)} H${rw(741)} C${rw(752.046)} ${rh(866.869)} ${rw(761)} ${rh(857.915)} ${rw(761)} ${rh(846.869)} V${rh(720)} C${rw(761)} ${rh(708.954)} ${rw(769.954)} ${rh(700)} ${rw(781)} ${rh(700)} H${rw(1000)} C${rw(1011.05)} ${rh(700)} ${w} ${rh(691.046)} ${w} ${rh(680)} V${rh(35)} C${w} ${rh(24.9543)} ${rw(1011.05)} ${rh(15)} ${rw(1000)} ${rh(15)} Z`;
}
