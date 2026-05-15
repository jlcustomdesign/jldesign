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

function waitForLCP(timeout = 700) {
  return new Promise<void>((resolve) => {
    if (typeof window === "undefined" || !(window as any).PerformanceObserver) {
      setTimeout(resolve, 250);
      return;
    }

    let resolved = false;
    const to = setTimeout(() => {
      if (!resolved) {
        resolved = true;
        obs.disconnect();
        resolve();
      }
    }, timeout);

    const obs = new (window as any).PerformanceObserver((list: any) => {
      const entries = list.getEntries();
      if (entries && entries.length) {
        if (!resolved) {
          resolved = true;
          clearTimeout(to);
          obs.disconnect();
          resolve();
        }
      }
    });

    try {
      obs.observe({ type: "largest-contentful-paint", buffered: true });
    } catch (e) {
      clearTimeout(to);
      resolve();
    }
  });
}

export function initHeroAnimations() {
  if (document.readyState === "complete" || document.readyState === "interactive") {
    requestAnimationFrame(() => {
        safeInitHeroAnim();
        safeInitHeroExitAnimation();
    });
  } else {
    document.addEventListener("DOMContentLoaded", () => {
        requestAnimationFrame(() => {
          safeInitHeroAnim();
          safeInitHeroExitAnimation();
        });
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
  // Delay enter animation until after LCP is recorded (or timeout)
  waitForLCP(700).then(() => runHeroEnterAnimation(section));
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
  const heroImage = document.querySelector("#hero-image");
  if (!section || !svg) return;
  const isMobile = window.innerWidth < 1024;

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

    // Subtle drop for the hero content wrapper to provide an initial motion
    try {
      const contentWrapper = document.querySelector('#hero-content-wrapper');
      if (contentWrapper) {
        masterTl.fromTo(contentWrapper, { y: -24, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 0.6, ease: 'power2.out' });
      }
    } catch (e) {
      // ignore
    }

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

      // Prepare the hero image for a subtle post-LCP zoom (do not change initial painted bounds)
      if (heroImage) {
        gsap.set(heroImage, { transformOrigin: "center center" });
      }

      if (isMobile) {
        gsap.set(svg, { opacity: 1 });
      } else {
        gsap.to(svg, { opacity: 1, duration: 0.3 });
      }

      // SVG Animation (morph/cutout) — sequence after the drop animation
      masterTl.add(runSvgAnim(path, width, height), ">=0.15");
      masterTl.addLabel("svgComplete"); // Mark end of SVG anim

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

     // Main Text Reveal (Title & Subtitle)
     const textElements = section.querySelectorAll(".hero-text-element");

     if (isMobile) {
      textElements.forEach((el) => {
        gsap.set(el, { opacity: 1, visibility: "visible" });
      });

      masterTl.fromTo(
        textElements,
        { y: 24, autoAlpha: 0 },
        { y: 0, autoAlpha: 1, duration: 0.6, stagger: 0.08, ease: "power2.out" },
        "svgComplete+=0.05"
      );
     } else {
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
     }

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

  const plugins = (gsap as any).plugins || {};
  const hasMorphSvg = Boolean(plugins.morphSVG || plugins.MorphSVGPlugin);

  // Only scale on desktop to avoid LCP invalidation on mobile (LCP element shifted outside viewport)
  if (window.innerWidth > 1024) {
    // Gentle settle (1.06 -> 1) so we keep LCP-safe initial paint
    tl.fromTo(
      "#hero-image",
      { scale: 1.06 },
      { scale: 1, duration: 1.0, ease: "power4.out" }
    );
  }

  if (hasMorphSvg) {
    tl.to(path, {
      scale: 1,
      duration: width > widthTarget ? 1.8 : 0.8,
      morphSVG: cross(width, height),
      ease: width > widthTarget ? "elastic.out(1, 0.85)" : "back.out(1.7)",
    });
  } else {
    // Lightweight fallback: avoid dead morph work when MorphSVG plugin is unavailable.
    tl.to(path, {
      scale: 1,
      duration: 0.45,
      ease: "power2.out",
      attr: { d: cross(width, height) },
    });
  }

  // Small post-morph pop to sell the effect (scale up then settle)
  if (window.innerWidth > 1024) {
    tl.to("#hero-image", {
      scale: 1.03,
      duration: 0.45,
      ease: "power2.out",
      yoyo: true,
      repeat: 1,
    });
  }

  return tl;

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

