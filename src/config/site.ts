/**
 * Central site configuration.
 *
 * IMPORTANT: The `monetization` and `analytics` blocks below are intentionally
 * left unset. Do NOT commit placeholder/fake IDs — Amazon Associates treats
 * malformed tracking IDs as a policy problem, and a wrong GA4 ID silently
 * pollutes a stranger's property. Fill these in only with real values.
 */

export const site = {
  name: 'Moshakha',
  tagline: 'Car Cleaning & Detailing, Tested and Explained',
  description:
    'Independent buying guides, how-tos and product reviews for car cleaning and detailing — microfibre towels, waxes, wash mitts and more.',
  url: 'https://www.moshakha.com',
  locale: 'en',
  author: 'Moshakha',
  email: 'hello@moshakha.com', // TODO: confirm the contact address you want published
} as const;

export const monetization = {
  /**
   * Amazon Associates store/tracking ID, e.g. 'moshakha-21'.
   * TODO: set after Amazon Associates approval. While null, affiliate CTAs
   * render as disabled placeholders instead of broken links.
   */
  amazonTrackingId: null as string | null,
  /** Amazon marketplace host to build links against. */
  amazonMarketplace: 'www.amazon.com',
} as const;

export const analytics = {
  /**
   * GA4 measurement ID, e.g. 'G-XXXXXXXXXX'.
   * TODO: set once you confirm which GA4 property this site should report to.
   * NOTE: the previous live site already shipped 'G-ZEP5BMKXNS'. Reuse it only
   * if that property is genuinely yours and you want continuity.
   */
  ga4MeasurementId: null as string | null,
  /**
   * Google Search Console HTML-tag verification token (the `content` value of
   * the google-site-verification meta tag). TODO: set if you verify by meta tag
   * rather than by DNS.
   */
  searchConsoleVerification: null as string | null,
} as const;

export const nav = [
  { label: 'Buying Guides', href: '/guides' },
  { label: 'How-To', href: '/how-to' },
  { label: 'Reviews', href: '/reviews' },
  { label: 'Blog', href: '/blog' },
  { label: 'About', href: '/about' },
] as const;

/** Shown wherever affiliate links appear, as Amazon Associates requires. */
export const AFFILIATE_DISCLOSURE =
  'Moshakha is reader-supported. When you buy through links on our site, we may earn an affiliate commission at no extra cost to you.';
