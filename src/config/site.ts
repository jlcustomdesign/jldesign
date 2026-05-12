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
  url: "https://mobilapersonalizatabrasov.ro",

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

  /** Google Analytics ID (GA4) — e.g., G-XXXXXXXXXX */
  gaId: "G-37EMRHJ958",

  /** Bing Webmaster Tools Verification Code (optional, used for meta tag) */
  bingVerification: "", // ← Replace with your actual Bing Webmaster code (e.g., "ABCD1234EFGH5678")

  /**
   * Target keywords (used in meta tags and internal linking).
   * Covers brand, service, product, material, and location variations.
   */
  keywords: [
    // Brand
    "JL Mobila", "JL Design", "JL Custom Design",
    // Service
    "mobilă la comandă", "mobilier custom", "mobilier personalizat", "mobilier pe comandă",
    "design interior", "proiectare 3D", "montaj profesional",
    // Product
    "bucătării la comandă", "dressinguri", "biblioteci", "mobilier living",
    "mobilier dormitor", "mobilier baie", "mobilier birouri", "mobilier comercial",
    // Material
    "lemn masiv", "MDF vopsit", "PAL melaminat", "furnir natural",
    "Egger", "Kronospan", "feronerie Blum", "Hettich", "Hafele",
    // Location (prioritize exact search term)
    "mobilapersonalizatabrasov.ro", "mobilapersonalizatabrasov", "mobila personalizata brasov",
    "mobilă personalizată Brașov", "mobilă la comandă Brașov", "mobilier personalizat Brașov",
    "mobilă Brașov", "mobilier Brașov", "mobilier la comandă Brașov", "mobilier custom Brașov",
    "mobilă pe comandă Brașov", "mobilier Buzău", "mobilier Sibiu", "mobilier Sfântu Gheorghe",
    "mobilier Făgăraș",
  ],

  /** Images */
  defaultOgImage: "/Poze JL Custom Design - Site/LP/Hero/Desktop.webp",
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
