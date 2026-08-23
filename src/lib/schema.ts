import { site } from '../config/site';

const abs = (path: string) => new URL(path, site.url).href;

const publisher = {
  '@type': 'Organization',
  name: site.name,
  url: site.url,
  logo: { '@type': 'ImageObject', url: abs('/favicon.svg') },
};

export function breadcrumbSchema(trail: { label: string; href: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: site.url },
      ...trail.map((item, i) => ({
        '@type': 'ListItem',
        position: i + 2,
        name: item.label,
        item: abs(item.href),
      })),
    ],
  };
}

export function articleSchema(opts: {
  title: string;
  description: string;
  path: string;
  publishDate: Date;
  updatedDate?: Date;
  author: string;
  image?: string;
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: opts.title,
    description: opts.description,
    mainEntityOfPage: { '@type': 'WebPage', '@id': abs(opts.path) },
    datePublished: opts.publishDate.toISOString(),
    dateModified: (opts.updatedDate ?? opts.publishDate).toISOString(),
    author: { '@type': 'Organization', name: opts.author, url: site.url },
    publisher,
    ...(opts.image ? { image: abs(opts.image) } : {}),
  };
}

/**
 * Only emit FAQPage markup when the answers are genuinely on the page —
 * Google treats markup describing invisible content as a violation.
 */
export function faqSchema(faq: { q: string; a: string }[]) {
  if (faq.length === 0) return null;
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faq.map((item) => ({
      '@type': 'Question',
      name: item.q,
      acceptedAnswer: { '@type': 'Answer', text: item.a },
    })),
  };
}

/**
 * Editorial review of a third-party product. We supply our own reviewRating
 * and deliberately omit aggregateRating — we have no aggregated user ratings,
 * and inventing them would be fabricated structured data.
 */
export function reviewSchema(opts: {
  productName: string;
  brand: string;
  description: string;
  rating: number;
  author: string;
  publishDate: Date;
  image?: string;
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Review',
    itemReviewed: {
      '@type': 'Product',
      name: opts.productName,
      brand: { '@type': 'Brand', name: opts.brand },
      ...(opts.image ? { image: abs(opts.image) } : {}),
    },
    reviewRating: {
      '@type': 'Rating',
      ratingValue: opts.rating,
      bestRating: 5,
      worstRating: 1,
    },
    name: `${opts.productName} review`,
    reviewBody: opts.description,
    author: { '@type': 'Organization', name: opts.author, url: site.url },
    datePublished: opts.publishDate.toISOString(),
    publisher,
  };
}

/** Ranked list of picks inside a best-of guide. */
export function itemListSchema(
  picks: { rank: number; name: string; brand: string }[],
  path: string,
) {
  if (picks.length === 0) return null;
  return {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: 'Our picks',
    itemListOrder: 'https://schema.org/ItemListOrderAscending',
    numberOfItems: picks.length,
    itemListElement: picks.map((p) => ({
      '@type': 'ListItem',
      position: p.rank,
      name: `${p.brand} ${p.name}`,
      url: `${abs(path)}#pick-${p.rank}`,
    })),
  };
}

export function howToSchema(opts: {
  title: string;
  description: string;
  steps: { name: string; text: string }[];
  supplies: string[];
  totalTime?: string;
  image?: string;
}) {
  if (opts.steps.length === 0) return null;
  return {
    '@context': 'https://schema.org',
    '@type': 'HowTo',
    name: opts.title,
    description: opts.description,
    ...(opts.totalTime ? { totalTime: opts.totalTime } : {}),
    ...(opts.image ? { image: abs(opts.image) } : {}),
    supply: opts.supplies.map((s) => ({ '@type': 'HowToSupply', name: s })),
    step: opts.steps.map((s, i) => ({
      '@type': 'HowToStep',
      position: i + 1,
      name: s.name,
      text: s.text,
    })),
  };
}

/** Rough reading time from rendered word count. */
export function readingTime(body: string): number {
  const words = body.trim().split(/\s+/).length;
  return Math.max(1, Math.round(words / 225));
}
