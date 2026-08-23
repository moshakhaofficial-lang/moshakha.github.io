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
  email: 'moshakhaofficial@gmail.com',
} as const;

export const monetization = {
  /**
   * Amazon Associates store/tracking ID. While null, affiliate CTAs render as
   * disabled placeholders instead of broken links.
   */
  amazonTrackingId: 'moshakha20-20' as string | null,
  /** Amazon marketplace host to build links against. */
  amazonMarketplace: 'www.amazon.com',
} as const;

export const analytics = {
  /**
   * GA4 measurement ID. Carried over from the previous site so the property
   * keeps its historical data rather than starting from zero.
   */
  ga4MeasurementId: 'G-ZEP5BMKXNS' as string | null,
  /**
   * Google Search Console HTML-tag verification token. Stays null: the domain
   * was verified by DNS, which survives redeploys and needs no markup.
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
