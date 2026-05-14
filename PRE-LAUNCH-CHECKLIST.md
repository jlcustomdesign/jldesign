# 🚀 JL Mobila — Pre-Launch Checklist

Everything that needs to happen **before** the site goes live.

---

## 1. Client Must Provide

- [ ] **Real phone number** (replaces `+40700000000` in `src/config/site.ts`)
- [ ] **Real email** (verify `contact@jlmobila.ro` is correct, or update)
- [ ] **Street address** (e.g. "Strada Lungă 123") → `site.ts`
- [ ] **Postal code** (e.g. "500001") → `site.ts`
- [ ] **Social media links** (Facebook, Instagram, WhatsApp) → uncomment in `site.ts → sameAs`
- [ ] **Final domain name** (e.g. `jlmobila.ro`) → update `site.ts → url`

---

## 2. Domain & Hosting

- [ ] Purchase / configure the final custom domain
- [ ] Connect domain to Vercel (or hosting provider)
- [ ] Verify SSL/HTTPS is active on the final domain
- [ ] Update `site.ts → url` from `https://jl-design.vercel.app` to the real domain
- [ ] Update `robots.txt → Sitemap:` URL to the real domain
- [ ] Update `llms.txt` URLs to the real domain

---

## 3. Analytics & Tracking

- [ ] **Google Analytics 4:** Create a GA4 property with the final domain
- [ ] **Google Tag Manager:** Create a GTM container, get the `GTM-XXXXXXX` code
- [ ] Update `site.ts → gtmId` with the real GTM container ID
- [ ] **Verify:** GTM fires correctly on all pages (use GTM Preview mode)

---

## 4. Search Engine Registration

### Google

- [ ] **Google Search Console:** Add & verify the final domain
- [ ] Submit the sitemap URL (`https://mobilapersonalizatabrasov.ro/sitemap-index.xml`)
- [ ] Request indexing of the homepage

### Bing

- [ ] **Bing Webmaster Tools:** Add & verify the final domain
- [ ] Get the verification code → paste into `site.ts → bingVerification`
- [ ] Submit sitemap in Bing Webmaster dashboard
- [ ] _(Optional)_ Set up IndexNow for instant indexing on deploy

---

## 5. Google Business Profile (CRITICAL for Local SEO)

- [ ] Client creates (or claims) their Google Business Profile at [business.google.com](https://business.google.com)
- [ ] **NAP Consistency:** Business Name, Address, Phone MUST match `site.ts` exactly
- [ ] Add the final website URL to the Google Business Profile
- [ ] Upload high-quality photos of the workshop, showroom, and projects
- [ ] Set business hours, categories (e.g., "Furniture Store", "Interior Designer")
- [ ] Start collecting 5-star Google Reviews from past clients

---

## 6. Content Fixes Before Launch

- [ ] **Contact page (`src/pages/contact.astro`):** Build out or redirect to modal
- [ ] **Replace all placeholder images** with real client project photos
- [ ] **Review all blog posts** — ensure they are real, useful content (not placeholder)
- [ ] **Review FAQ answers** — confirm accuracy with client (prices, timelines, etc.)
- [ ] Delete or noindex `test-simultaneous.astro` (already blocked in robots.txt)

---

## 7. Final Technical Checks

- [ ] Run `npm run build` — confirm zero errors
- [ ] Run Lighthouse audit (Performance, Accessibility, SEO, Best Practices)
- [ ] Test on mobile (iPhone Safari + Android Chrome)
- [ ] Test contact form / modal submission
- [ ] Verify all internal links work (no 404s)
- [ ] Check that the sitemap generates all expected URLs

---

## 8. Post-Launch (First Week)

- [ ] Monitor Google Search Console for crawl errors
- [ ] Monitor Bing Webmaster Tools for indexing status
- [ ] Verify Google Analytics is receiving data
- [ ] Check that Google Business Profile links to the live site
- [ ] Publish 1st real blog post for fresh content signal
