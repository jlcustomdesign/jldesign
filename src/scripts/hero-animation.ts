import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { MorphSVGPlugin } from "gsap/MorphSVGPlugin";
import { rectangle, cross, WIDTH_TARGET } from "../utils/svg-shapes";

gsap.registerPlugin(ScrollTrigger, MorphSVGPlugin);

// Re-export for consumers (e.g. about.astro)
export { rectangle, cross };

const widthTarget = WIDTH_TARGET;

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

    // Main Text Reveal (Title & Subtitle) - Word by Word
    const textElements = section.querySelectorAll(".hero-text-element");
    textElements.forEach((el) => {
      const parent = document.createElement("div");
      // move all children to arbitrary parent
      while (el.firstChild) {
         parent.appendChild(el.firstChild);
      }
      
      const processNode = (node: ChildNode) => {
         if (node.nodeType === Node.TEXT_NODE) {
            const text = node.textContent || "";
            const words = text.split(/\s+/);
            words.forEach(word => {
               if(!word) return;
               const span = document.createElement("span");
               span.className = "hero-word inline-block will-change-transform";
               span.textContent = word;
               el.appendChild(span);
               el.appendChild(document.createTextNode(" "));
            });
         } else if (node.nodeType === Node.ELEMENT_NODE) {
            const element = node as Element;
            if (element.tagName.toLowerCase() === "br") {
               el.appendChild(document.createElement("br"));
            } else {
               el.appendChild(element.cloneNode(true));
            }
         }
      };
      
      Array.from(parent.childNodes).forEach(processNode);

      // Remove the hardcoded utility classes that hide the parent
      el.classList.remove("opacity-0", "invisible");
      gsap.set(el, { opacity: 1, visibility: "visible" });
    });

    masterTl.fromTo(
      ".hero-word",
      { y: 50, autoAlpha: 0 },
      { y: 0, autoAlpha: 1, duration: 0.8, stagger: 0.05, ease: "power3.out" },
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
    scale: width > widthTarget ? 1.5 : 1.15,
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
      (heroSection as HTMLElement).dataset.exitAnimInit = "true";
      return;
    }

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

