import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

/** Fields every article type shares. */
const base = {
  title: z.string().max(70, 'Keep titles under ~70 chars so Google does not truncate them'),
  description: z.string().min(70).max(165, 'Meta descriptions should be ~150-160 chars'),
  /** The primary keyword this page targets. Used for internal-link auditing. */
  targetKeyword: z.string(),
  publishDate: z.coerce.date(),
  updatedDate: z.coerce.date().optional(),
  author: z.string().default('Moshakha Editorial'),
  image: z.string().optional(),
  imageAlt: z.string().optional(),
  draft: z.boolean().default(false),
  featured: z.boolean().default(false),
  /** Slugs of related articles, for the internal linking block. */
  related: z.array(z.string()).default([]),
  faq: z
    .array(z.object({ q: z.string(), a: z.string() }))
    .default([]),
};

/** A single ranked pick inside a best-of guide. */
const pick = z.object({
  rank: z.number(),
  name: z.string(),
  brand: z.string(),
  award: z.string(),
  /** Amazon ASIN. Links are built from this + your Associates tag at build time. */
  asin: z.string().nullable().default(null),
  image: z.string().optional(),
  imageAlt: z.string().optional(),
  rating: z.number().min(0).max(5),
  gsm: z.string().optional(),
  price: z.string().optional(),
  bestFor: z.string(),
  summary: z.string(),
  pros: z.array(z.string()),
  cons: z.array(z.string()),
});

const guides = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/guides' }),
  schema: z.object({
    ...base,
    picks: z.array(pick).default([]),
    /** Column headers + rows for the at-a-glance comparison table. */
    comparisonNote: z.string().optional(),
  }),
});

const howTo = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/how-to' }),
  schema: z.object({
    ...base,
    /** Renders HowTo schema when present. */
    steps: z
      .array(z.object({ name: z.string(), text: z.string() }))
      .default([]),
    totalTime: z.string().optional(),
    supplies: z.array(z.string()).default([]),
  }),
});

const reviews = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/reviews' }),
  schema: z.object({
    ...base,
    productName: z.string(),
    brand: z.string(),
    asin: z.string().nullable().default(null),
    rating: z.number().min(0).max(5),
    price: z.string().optional(),
    pros: z.array(z.string()).default([]),
    cons: z.array(z.string()).default([]),
    verdict: z.string(),
  }),
});

const blog = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/blog' }),
  schema: z.object({ ...base }),
});

export const collections = { guides, 'how-to': howTo, reviews, blog };
