import type { ImageMetadata } from 'astro';

export type CardImage = { src: ImageMetadata; alt: string } | null;

/**
 * Thumbnail for any content entry. Guides without their own hero fall back to
 * the rank-1 pick's image (then the best-ranked pick that has one). Reviews
 * and how-tos use their own `image`. Returns null when there is none.
 */
export function entryImage(entry: { collection: string; data: any }): CardImage {
  const d = entry.data;
  if (d.image) return { src: d.image, alt: d.imageAlt ?? d.title };
  if (entry.collection === 'guides') {
    const p = [...(d.picks ?? [])]
      .sort((a: any, b: any) => a.rank - b.rank)
      .find((x: any) => x.image);
    if (p) return { src: p.image, alt: p.imageAlt ?? `${p.brand} ${p.name}` };
  }
  return null;
}

export const COLLECTION_LABEL: Record<string, string> = {
  guides: 'Buying guide',
  'how-to': 'How-to',
  reviews: 'Review',
  blog: 'Blog',
};
