import { defineCollection, z, type SchemaContext } from 'astro:content';
import { glob } from 'astro/loaders';

/**
 * Fields every article type shares.
 *
 * Takes SchemaContext so `image()` is available: images referenced this way are
 * run through Astro's asset pipeline (WebP/AVIF conversion, responsive srcset,
 * and inferred width/height so nothing shifts on load). Article images live in
 * src/assets/images/ and are referenced relative to the markdown file.
 */
const base = ({ image }: SchemaContext) => ({
  title: z.string().max(70, 'Keep titles under ~70 chars so Google does not truncate them'),
  description: z.string().min(70).max(165, 'Meta descriptions should be ~150-160 chars'),
  /** The primary keyword this page targets. Used for internal-link auditing. */
  targetKeyword: z.string(),
  publishDate: z.coerce.date(),
  updatedDate: z.coerce.date().optional(),
  author: z.string().default('Moshakha Editorial'),
  image: image().optional(),
  /** Required whenever an image is set — enforced by superRefine below. */
  imageAlt: z.string().optional(),
  draft: z.boolean().default(false),
  featured: z.boolean().default(false),
  /** "collection/slug" refs for the internal linking block. */
  related: z.array(z.string()).default([]),
  faq: z.array(z.object({ q: z.string(), a: z.string() })).default([]),
});

/** Fails the build if an image was set without alt text. */
const requireAlt = <T extends z.ZodRawShape>(schema: z.ZodObject<T>) =>
  schema.superRefine((data: any, ctx) => {
    if (data.image && !data.imageAlt) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['imageAlt'],
        message: 'imageAlt is required when image is set (accessibility + SEO).',
      });
    }
  });

const pick = ({ image }: SchemaContext) =>
  z.object({
    rank: z.number(),
    name: z.string(),
    brand: z.string(),
    award: z.string(),
    /** Amazon ASIN. Links are built from this + your Associates tag at build time. */
    asin: z.string().nullable().default(null),
    image: image().optional(),
    imageAlt: z.string().optional(),
    rating: z.number().min(0).max(5),
    gsm: z.string().optional(),
    price: z.string().optional(),
    bestFor: z.string(),
    /** Explicit "who should skip this" — optional, renders as a line next to bestFor when set. */
    skipIf: z.string().optional(),
    summary: z.string(),
    pros: z.array(z.string()),
    cons: z.array(z.string()),
  });

const guides = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/guides' }),
  schema: (ctx) =>
    requireAlt(
      z.object({
        ...base(ctx),
        picks: z.array(pick(ctx)).default([]),
        comparisonNote: z.string().optional(),
      }),
    ),
});

const howTo = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/how-to' }),
  schema: (ctx) =>
    requireAlt(
      z.object({
        ...base(ctx),
        /** Renders HowTo schema when present. */
        steps: z.array(z.object({ name: z.string(), text: z.string() })).default([]),
        totalTime: z.string().optional(),
        supplies: z.array(z.string()).default([]),
      }),
    ),
});

const reviews = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/reviews' }),
  schema: (ctx) =>
    requireAlt(
      z.object({
        ...base(ctx),
        productName: z.string(),
        brand: z.string(),
        asin: z.string().nullable().default(null),
        rating: z.number().min(0).max(5),
        price: z.string().optional(),
        pros: z.array(z.string()).default([]),
        cons: z.array(z.string()).default([]),
        verdict: z.string(),
      }),
    ),
});

const blog = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/blog' }),
  schema: (ctx) => requireAlt(z.object({ ...base(ctx) })),
});

export const collections = { guides, 'how-to': howTo, reviews, blog };
