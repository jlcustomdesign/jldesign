/**
 * site.ts — Single source of truth for all SEO, schema, and brand data.
 *
 * ⚡ UPDATE THIS FILE when you change your real business info.
 * Every component, schema, meta tag, and footer reads from here.
 */

export const SITE = {
  /** Company / Brand */
  name: "JL Mobila",
  legalName: "JL Mobila S.R.L.",
  tagline: "Mobilier la comandă din lemn masiv",
  url: "https://jl-design.vercel.app",

  /** Contact */
  phone: "+40700000000",         // ← Replace with real phone
  email: "contact@jlmobila.ro",  // ← Replace with real email

  /** Primary Location */
  address: {
    street: "",                   // ← e.g. "Strada Lungă 123"
    city: "Brașov",
    region: "Brașov",
    postalCode: "",               // ← e.g. "500001"
    country: "RO",
  },

  /** Geo Coordinates for LocalBusiness schema */
  geo: {
    latitude: 45.6427,            // Brașov center — update if needed
    longitude: 25.5887,
  },

  /**
   * Target cities for hyper-local SEO.
   * These appear in areaServed schema and meta tags.
   */
  targetCities: [
    "Brașov",
    "Buzău",
    "Sibiu",
    "Sfântu Gheorghe",
    "Făgăraș",
    "Săcele",
    "Codlea",
    "Râșnov",
  ],

  /** Social / External profiles — uncomment and fill when ready */
  sameAs: [
    // "https://www.facebook.com/jlmobila",
    // "https://www.instagram.com/jlmobila",
    // "https://wa.me/40700000000",
  ],

  /** Google Tag Manager Container ID — replace with your real GTM-XXXXXXX */
  gtmId: "GTM-XXXXXXX",

  /** Images */
  defaultOgImage: "/Images/optimized/hero-image.webp",
  logo: "/favicon.svg",
} as const;

/** Helper: full absolute URL */
export function absoluteUrl(path: string): string {
  return `${SITE.url}${path.startsWith("/") ? path : `/${path}`}`;
}

/** Helper: comma-separated target cities for meta descriptions */
export function targetCitiesString(limit = 4): string {
  return SITE.targetCities.slice(0, limit).join(", ");
}
