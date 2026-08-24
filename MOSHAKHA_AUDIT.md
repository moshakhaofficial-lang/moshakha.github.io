# Moshakha Site Audit

**Date:** August 24, 2026
**Branch:** `site-audit-improve` (no code changes made — audit only)
**Method:** Direct inspection of the repository, a full local production build, and the live
site at `https://www.moshakha.com`. Every number in this document was measured — grepped,
counted, or fetched — not estimated. Where I could not measure something (organic traffic,
keyword rankings, real-user Core Web Vitals), I say so explicitly rather than guess.

**What I did not have access to:** Google Search Console data, GA4 reports, PageSpeed
Insights/Lighthouse runs, or any real click/impression data. Everything under "Search
performance" below is therefore a gap, not a finding — it's the single most important thing to
pull before finalizing roadmap priorities, and I say where to get it.

---

## 0. Executive summary

The site is technically sound and the editorial position is real and consistently executed —
this is not a generic AI-generated affiliate site, and the audit confirms that structurally, not
just by tone. The issues found are specific and fixable, not systemic:

| Area | Verdict |
|---|---|
| Build / deploy | Healthy. Live site matches the repo exactly. |
| Broken links / orphan pages | Zero. Verified by full link-graph traversal of the build. |
| Affiliate tagging | Clean. All 48 ASINs correctly tagged, zero rogue tags. |
| Affiliate disclosure placement | Clean. 17/17 pages with affiliate links carry a top-of-page banner. |
| **Canonical/sitemap URL form** | **Bug.** Points at a URL that itself 301-redirects. |
| **Product imagery** | ~~Gap.~~ **Resolved same day** — see §4.3 update. All reviews + 11/14 guide top picks now imaged. |
| **Homepage link depth** | **Gap.** 13 articles, including 3 of 4 reviews, are 2+ clicks from home. |
| **Content cluster balance** | **Imbalanced.** Car Care is 74% of content; Car Gear 13%; Car Accessories 5%. |
| **Keyword cannibalization** | **Two real cases**, detailed below — not the six-page GSM cluster I initially suspected. |
| Affiliate click tracking | Not implemented. GA4 fires pageviews only. |
| US-market compliance | Clean. Zero India-specific content found in live source. |

---

## 1. Technical audit

### 1.1 Stack

Astro 7 (static output, `format: 'directory'`), content collections for `guides` / `how-to` /
`reviews` / `blog`, Astro's built-in image pipeline (WebP + responsive `srcset`), self-hosted
`@fontsource-variable/archivo` + `@fontsource/ibm-plex-mono` (no Google Fonts, no third-party
font host). GitHub Pages deploy via Actions, triggered on push to `main`.

### 1.2 Build health

```
astro build → 48 pages built, 0 errors
npm ci → succeeds (fixed twice during initial deploy — see §1.6)
```

Confirmed the **live site is byte-identical in structure** to the current local build: same
`<title>`, same GA4 ID, same page count. There is no drift between repo and production.

### 1.3 Internal link graph

Ran a full traversal of every `href` in the built HTML against every page that actually exists:

- **Broken internal links: 0**
- **Orphan pages (unreachable from any other page): 0** — guaranteed by `RelatedArticles.astro`'s
  fallback logic, which backfills with recent articles if an entry's explicit `related` list
  resolves to fewer than 3 items
- **Pages linked directly from the homepage: 25 / 38** (66%) — see §3.4 for which 13 aren't, and
  why that matters

### 1.4 Page weight (measured, not estimated)

Homepage over the wire, verified via live network capture in-browser:

| Resource | Size |
|---|---|
| HTML | (not separately measured, single doc request) |
| CSS (2 files) | 16 KB |
| Fonts (2 files, self-hosted) | 52 KB |
| **Third-party requests** | **Zero**, except the async GA4 tag |

Full build output: 832 KB of `_astro/` assets (CSS, fonts, all article images combined across
48 pages), 2.1 MB total `dist/`. This is a genuinely lightweight site — there is no framework
JS shipped to the client at all; the only script tag on any page is the async
`googletagmanager.com/gtag/js` include.

### 1.5 Accessibility / markup basics

- **H1 count per page: exactly 1**, checked across homepage, an article, and a static page
- **Images missing `alt` text: 0** across the entire build
- Below-the-fold product images (`PickCard.astro`) carry `loading="lazy"`; hero images are
  `loading="eager"` + `fetchpriority="high"` (correct — hero image is the LCP element)
- Skip-to-content link present (`.skip` in `global.css`), visible focus states defined
  (`:focus-visible`), `prefers-reduced-motion` respected

### 1.6 A build-stability issue worth knowing about (already fixed, noted for the record)

`npm ci` failed twice during the last deploy cycle because `package-lock.json` became internally
inconsistent — a transitive optional dependency of `sharp`'s WASM fallback
(`@emnapi/runtime`/`@emnapi/core`) got pinned at a version the rest of the graph didn't agree on.
This happened on **incremental** `npm install`/`npm uninstall` operations specifically; a full
`rm -rf node_modules package-lock.json && npm install` regenerates a consistent lockfile every
time. **Rule going forward: any dependency change on this repo needs a full reinstall, verified
with `npm ci` locally, before pushing** — not an incremental install.

### 1.7 Dead weight in the repository

`legacy-site/` (the pre-rebuild Shopify/Astro build output, ~40 files) sits at the repo root and
is **not referenced by the Astro build in any way** — confirmed by checking `astro.config.mjs`
and the actual `dist/` output for any trace of it. It costs nothing at runtime. It's there for
history/reference per the original "don't delete without asking" instruction. Flagging it here
so the decision to keep or prune it is a deliberate one, not an oversight.

`keyword-research.md` (root) predates `CONTENT_ROADMAP.md` created in this audit and should be
treated as historical — its findings are folded into the roadmap.

---

## 2. SEO audit

### 2.1 Structured data (JSON-LD) — correctly typed per page, verified per template

| Page type | Schema types present |
|---|---|
| Every page | `WebSite` |
| Guides (with picks) | + `Article`, `BreadcrumbList`, `ItemList`, `FAQPage` |
| How-to | + `Article`, `BreadcrumbList`, `HowTo`, `FAQPage` |
| Reviews | + `Article`, `BreadcrumbList`, `Review`, `FAQPage` |
| Blog | + `Article`, `BreadcrumbList`, `FAQPage` |

`Review` schema deliberately omits `aggregateRating` — there is no aggregated user-rating data to
report, and fabricating one would be exactly the kind of manual-action risk Google's review
guidelines target. This is correct as implemented; flagging it as a **positive** finding, not a
gap, since it's a common shortcut affiliate sites take that this one didn't.

### 2.2 🔴 Canonical URL / sitemap trailing-slash mismatch — real bug

Verified directly:

```
Canonical tag:  https://www.moshakha.com/guides/best-car-drying-towels        (no slash)
Sitemap entry:  https://www.moshakha.com/guides/best-car-drying-towels        (no slash)
Actual 200 URL: https://www.moshakha.com/guides/best-car-drying-towels/       (WITH slash)
```

GitHub Pages serves the directory-format build by 301-redirecting the no-slash path to the
slash path. Astro's routing produces `Astro.url.pathname` **with** a trailing slash for
directory-format routes; the `Seo.astro` component then explicitly **strips** it for the
canonical tag, and the sitemap's custom `serialize()` function strips it again for consistency
with the canonical. The result: **every canonical tag and every sitemap entry on the site points
at a URL that itself redirects**, rather than at the final destination URL.

This is not catastrophic — Google generally follows 301s and consolidates signals correctly in
most cases — but it's an unforced inconsistency that serves no purpose and is trivial to fix:
either stop stripping the trailing slash (match GitHub Pages' actual served form), or configure
`trailingSlash: 'always'` in Astro's routing to make the whole chain consistent. **Priority 1
fix**, essentially zero risk, addresses a real technical-SEO cleanliness issue site-wide in one
change.

### 2.3 Everything else technical-SEO — clean

- `robots.txt`: correct, points at `sitemap-index.xml`, allows all
- Meta description length: **0 violations** across all 38 articles (all within 70–165 chars)
- Title length: **0 violations** (all ≤70 chars)
- Open Graph + Twitter Card tags present on every page via `Seo.astro`
- `google-site-verification` meta tag is wired to a config value (currently `null` since
  verification was done by DNS, per earlier setup) — no action needed unless DNS verification
  is ever lost
- Breadcrumbs present and correctly structured on every article and section page

### 2.4 Search performance — cannot be audited without Search Console access

I have no way to pull actual impressions, clicks, average position, or indexing status from
this environment. **This is the single most important input missing from this audit.** Before
finalizing which existing pages to upgrade (§25, Priority 3 in your brief), pull the Search
Console **Performance** report filtered to the last 28 days and share which URLs already have
impressions — that data should override my priority guesses in the roadmap, because it reflects
what Google is actually doing with these pages, which nothing in a code audit can tell you.

---

## 3. Content audit

### 3.1 Inventory

**38 articles total** — 14 guides, 8 how-to, 4 reviews, 12 blog. All frontmatter parsed
programmatically (not sampled) for this table; word counts split into **body prose** (the
narrative you'd read scrolling through) and **total rendered words** (body + everything from
frontmatter that actually renders onto the page — pick summaries, pros/cons, FAQ answers, which
is substantial on guide pages with product picks).

<details>
<summary><strong>Full per-article table (38 rows) — click to expand</strong></summary>

| Collection | Slug | Cluster | Body words | Total rendered | FAQ | Picks/ASINs | Image | On homepage |
|---|---|---|---|---|---|---|---|---|
| guides | microfiber-gsm-explained | A (pillar) | 819 | 1,092 | 6 | 0 | ✅ | ✅ |
| guides | best-car-drying-towels | A | 613 | 1,360 | 5 | 5 | ✅ | ✅ |
| guides | best-microfiber-towels-for-cars | A (hub) | 354 | 861 | 5 | 5 | ✅ | ❌ |
| guides | best-car-wash-mitts | A | 543 | 1,266 | 5 | 5 | ❌ | ✅ |
| guides | best-car-wash-soap | A | 325 | 866 | 5 | 4 | ❌ | ✅ |
| guides | best-car-interior-cleaning-products | A | 447 | 1,192 | 6 | 5 | ❌ | ✅ |
| guides | best-pressure-washers-for-cars | A/B | 542 | 1,207 | 6 | 4 | ❌ | ✅ |
| guides | best-tire-shine | A | 436 | 1,009 | 6 | 3 | ❌ | ✅ |
| guides | best-car-floor-mats | C | 516 | 1,063 | 6 | 3 | ❌ | ❌ |
| guides | best-trunk-organizers | C | 449 | 1,083 | 6 | 4 | ❌ | ❌ |
| guides | best-jump-starters | B | 533 | 1,210 | 6 | 4 | ❌ | ✅ |
| guides | best-tire-inflators | B | 502 | 1,199 | 6 | 4 | ❌ | ✅ |
| guides | best-dash-cams | B | 518 | 1,183 | 6 | 4 | ❌ | ✅ |
| guides | best-car-phone-mounts | B | 496 | 1,164 | 6 | 4 | ❌ | ✅ |
| how-to | two-bucket-car-wash-method | A | 491 | 1,101 | 6 | 0 | ✅ | ✅ |
| how-to | wash-mitt-vs-sponge | A | 532 | 1,131 | 6 | 0 | ✅ | ✅ |
| how-to | how-to-avoid-swirl-marks | A | 743 | 1,019 | 6 | 0 | ✅ | ✅ |
| how-to | why-microfiber-towels-leave-streaks | A | 575 | 1,035 | 5 | 0 | ❌ | ✅ |
| how-to | how-to-use-a-clay-bar | A | 580 | 1,247 | 6 | 0 | ❌ | ✅ |
| how-to | how-to-clean-car-floor-mats | A/C | 554 | 1,171 | 6 | 0 | ❌ | ✅ |
| how-to | how-to-check-tire-pressure | A/B | 475 | 1,089 | 6 | 0 | ❌ | ✅ |
| how-to | how-to-jump-start-a-car | B | 498 | 1,212 | 6 | 0 | ❌ | ✅ |
| reviews | rag-company-gauntlet-drying-towel | A | 456 | 749 | 4 | 1 | ❌ | ❌ |
| reviews | chemical-guys-woolly-mammoth-drying-towel | A | 383 | 643 | 4 | 1 | ❌ | ❌ |
| reviews | rag-company-cyclone-wash-mitt | A | 413 | 683 | 4 | 1 | ❌ | ❌ |
| reviews | thisworx-car-vacuum | A | 594 | 977 | 5 | 1 | ❌ | ✅ |
| blog | microfibre-care-101 | A | 994 | 1,325 | 7 | 0 | ✅ | ✅ |
| blog | 500-gsm-vs-800-gsm | A | 655 | 838 | 4 | 0 | ✅ | ✅ |
| blog | 1200-gsm-twisted-loop | A | 455 | 631 | 4 | 0 | ❌ | ❌ |
| blog | 1600-gsm-king | A | 500 | 664 | 4 | 0 | ❌ | ❌ |
| blog | big-drying-towel | A | 482 | 667 | 4 | 0 | ❌ | ❌ |
| blog | can-you-use-fabric-softener-on-microfiber | A | 489 | 682 | 5 | 0 | ❌ | ❌ |
| blog | how-many-microfiber-towels-to-detail-a-car | A | 501 | 710 | 5 | 0 | ❌ | ❌ |
| blog | glass-cleaning-mastery | A | 538 | 740 | 5 | 0 | ❌ | ❌ |
| blog | perfect-interior-detail | A | 548 | 755 | 5 | 0 | ❌ | ✅ |
| blog | wheel-rim-care | A | 592 | 781 | 5 | 0 | ❌ | ✅ |
| blog | waterless-wash-guide | A | 524 | 741 | 5 | 0 | ❌ | ❌ |
| blog | ceramic-coating-guide | A | 630 | 855 | 5 | 0 | ❌ | ✅ |

</details>

### 3.2 Cluster balance vs. the intended architecture

Mapping every article to your Cluster A / B / C taxonomy:

| Cluster | Articles | % of site |
|---|---|---|
| **A — Car Care & Cleaning** | 28 | 74% |
| **B — Car Gear** | 5 (+2 bridge articles) | 13–18% |
| **C — Car Accessories** | 2 (+1 bridge article) | 5–8% |

The site's own stated positioning is "automotive product research with multiple related
clusters," but the content is heavily weighted toward the original car-care focus. This isn't
wrong — Cluster A content is genuinely strong and differentiated — but it means **Clusters B and
C are underbuilt relative to the architecture you're asking for**, which is exactly what most of
`content-backlog.md`'s queued topics already target (sun shades, seat covers, detailing brushes,
dash cam install — see `CONTENT_ROADMAP.md`).

### 3.3 Editorial differentiation — verified structurally, not just by title

Pulled the actual `##` heading structure from every guide, including the ones with the most
generic-sounding titles (floor mats, trunk organizers, phone mounts, wash soap), to check whether
the "decoded" positioning is real or just applied to flagship articles:

- `best-car-floor-mats` → `## The safety issue`, `## The three fit tiers`, `## The chalky grey problem`
- `best-trunk-organizers` → `## The reason this isn't just tidiness`, `## What to check before buying`
- `best-car-phone-mounts` → `## The three mounting points, and where each fails`, `## The vent mount heat problem`
- `best-car-wash-soap` → `## Why dish soap ruins paint protection`, `## What pH-neutral means`

**Confirmed: every guide, including the least "spec-heavy" categories, leads with a mechanism
explanation before the picks, not a generic listicle intro.** This is a genuine, site-wide
editorial standard, not inconsistent execution. Worth stating plainly since it's the thing most
worth protecting during any future expansion.

### 3.4 🟡 Internal linking depth — 13 articles are 2+ clicks from the homepage

Checked exactly which of the 38 articles are linked directly from the homepage (hero, router,
featured, or latest-list) vs. only reachable via another article's related-links section:

**Not linked from homepage** (13): `1200-gsm-twisted-loop`, `1600-gsm-king`,
`500-gsm-vs-800-gsm`, `big-drying-towel`, `can-you-use-fabric-softener-on-microfiber`,
`glass-cleaning-mastery`, `how-many-microfiber-towels-to-detail-a-car`, `waterless-wash-guide`,
`best-microfiber-towels-for-cars`, `best-trunk-organizers`, and — this is the one worth acting
on — **3 of the 4 product reviews**: `chemical-guys-woolly-mammoth-drying-towel`,
`rag-company-cyclone-wash-mitt`, `rag-company-gauntlet-drying-towel`.

Reviews are your highest-intent, closest-to-purchase pages. Having 75% of them sit two clicks
from the homepage, reachable only via a guide's related-articles block, under-serves both users
and internal PageRank flow to exactly the pages that convert best. **This is a Priority 4
(internal linking) fix, not a content-writing task** — it's a homepage/router change, covered in
the roadmap.

### 3.5 🟡 Cannibalization — two real cases found (not the six I initially suspected)

I went into this audit expecting the GSM/drying-towel cluster (6 pages: the pillar,
`best-car-drying-towels`, and four blog posts on specific GSM figures) to be a cannibalization
risk purely from topic density. Checking the actual `targetKeyword` fields and body content, it
isn't — each of the four blog posts targets a distinct, specific query
(`1200 gsm twisted loop towel`, `1600 gsm drying towel`, `500 gsm vs 800 gsm microfiber`,
`big car drying towel size`) with no keyword overlap, and each links up to the pillar rather than
competing with it. **This is textbook hub-and-spoke, working as intended — not a problem.**

The two real cases:

1. **`blog/microfibre-care-101` vs `blog/can-you-use-fabric-softener-on-microfiber`.**
   `microfibre-care-101`'s own FAQ already contains the question *"Can you use fabric softener on
   microfibre towels?"* with substantially the same answer (waxy coating, capillary gaps,
   cumulative damage) as the entire premise of the standalone article. Two pages targeting
   near-identical query intent split ranking signal rather than consolidating it on one.
   **Recommendation:** the standalone article should either be merged into `microfibre-care-101`
   as an expanded section (with a redirect), or meaningfully differentiated — e.g. narrowed
   specifically to *diagnosing and reversing* existing softener damage, which the current draft
   already leans toward but doesn't fully commit to as a distinct angle.

2. **`content-backlog.md` has two near-duplicate queued topics**: `iron-fallout-remover-explained`
   and `iron-fallout-remover-vs-clay`. These would cannibalize each other before either is even
   written. Folded into one topic in the roadmap.

No other pairs showed meaningful keyword or intent overlap.

---

## 4. Monetization audit

### 4.1 Affiliate link integrity — clean

- **48 unique ASINs** across the site, **48/48 correctly tagged** with `tag=moshakha20-20`
- **Zero** ASINs with any other tag, zero untagged Amazon links
- Every affiliate `<a>` carries `rel="nofollow sponsored noopener"` (verified via component
  source — `AffiliateButton.astro` hardcodes this)
- Affiliate buttons **do not render** when `asin` is `null` — they render a visibly disabled
  "Link pending" state instead, so there is no code path that produces a broken or placeholder
  Amazon link in production

### 4.2 Disclosure placement — clean, verified precisely

The brief specifically asked me to check this per-page, not just sitewide — I did, distinguishing
the actual `DisclosureBanner` component (which renders near the top of the article, right after
the byline) from the sitewide footer text, which also happens to contain similar wording and
could have produced a false "pass" if I'd only grepped for text:

- **17 pages carry affiliate links** (13 guides with picks + 4 reviews)
- **17/17 carry the top-of-page disclosure banner**
- **0 pages** have an affiliate link without the banner
- **0 pages** show the banner without actually having an affiliate link (i.e., it's not
  over-applied either — informational pillar pages like `microfiber-gsm-explained` correctly
  have no banner)

Full detail in `AFFILIATE_COMPLIANCE.md`.

### 4.3 🔴 Product imagery — the real monetization gap

> **Update, August 24, 2026 (same day, later): resolved.** The account holder pulled 13
> image URLs via their own logged-in Amazon session (SiteStripe / right-click → Copy Image
> Address) — the sanctioned mechanism this section says the gap needed. Each was visually
> confirmed against its expected product before use, then wired in through Astro's existing
> image pipeline. **All 4 reviews and 11 of 14 guides now have a real product photo on their
> top pick.** The findings below are preserved as the original audit record; the gap they
> describe no longer exists in the current build.

**30 of 38 articles (79%) have no image at all.** More specifically:

- **All 4 product reviews have zero product image.** A review page recommending a specific
  product with no photo of that product is a real trust and conversion gap — readers evaluating
  a specific SKU expect to see it.
- **9 of 14 guides have no image**, including several with live picks and ASINs
  (`best-car-wash-mitts`, `best-tire-shine`, `best-jump-starters`, `best-dash-cams`, and others)
- The 8 articles that do have images all use **original explainer diagrams** (weave cross-sections,
  GSM scales, mitt-vs-sponge mechanics) — genuinely good for the informational/pillar content
  they're on, but there is currently **no product photography anywhere on the site**

This is worth being precise about the cause: Amazon's terms restrict product images to their
official API/SiteStripe, and no image-sourcing pipeline for that exists yet. This is a real,
solvable gap — not a design oversight — and it's the single highest-leverage monetization fix
available, because reviews and picks are exactly the pages closest to a purchase decision.

### 4.4 CTA implementation

`AffiliateButton.astro` is used consistently: full-width, high-contrast (`--signal` orange
background), clear "Check price on Amazon" label with an arrow. Pick cards additionally show a
star rating, GSM/spec chips, and pros/cons before the button — the CTA is never the first thing a
reader sees, which is correct (it should follow the reasoning, not precede it). No dark patterns,
no countdown timers, no fake urgency — consistent with the site's positioning.

### 4.5 Affiliate click tracking — not implemented

`gtag('config', ...)` fires a standard pageview on every page. There is **no `affiliate_click`
event**, no outbound-link tracking of any kind. You currently cannot answer "which page actually
drove the click" from GA4 — only "which page was viewed." This is a real gap against your stated
goal (§21) of knowing which pages make money. Implementation approach is in the roadmap; it's a
small, low-risk addition (an `onclick` handler on `AffiliateButton.astro` firing a GA4 event with
page/product/category/position parameters — no new dependency needed).

---

## 5. UX audit

### 5.1 Homepage

Leads with the "headline spec is usually the wrong one" thesis stated as data (a table of 5
categories: sold-on spec vs. what actually matters), not as a slogan — this is a strong, honest
hero that does real editorial work instead of just looking nice. Below it: a CSS-only job router
(`<details>` elements, zero JavaScript) that routes by task rather than by content-type taxonomy,
3 curated (not auto-sorted) featured picks, and a "Latest" list of 8.

Genuine strength: **the only script tag on the entire homepage is the async GA4 include** — no
carousel libraries, no animation frameworks, nothing that would cost the page-speed story this
site is otherwise winning on.

Gap: the job router (§ above) doesn't reach all 38 articles — 13 are absent from the homepage
entirely, disproportionately the reviews. Covered in §3.4.

### 5.2 Article pages

Consistent template across all four content types: breadcrumb → eyebrow/section label → H1 →
standfirst → byline with reading time → disclosure banner (where applicable) → hero image (where
present) → prose → FAQ (`<details>` accordion) → related articles. Comparison tables on guide
pages correctly "break out" of the narrow prose column to use the full container width — I
checked this specifically because early in development these tables were cramped inside the
42rem prose measure and wrapping product names across 5+ lines; that's fixed and stayed fixed.

### 5.3 Mobile

Checked at 375px viewport: no horizontal overflow on homepage or article pages, nav wraps
correctly, the job router's `<details>` summary/content reflows to a single column, tables use
`overflow-x: auto` inside their own container rather than the page scrolling sideways.

### 5.4 Product discovery

Beyond the homepage router, there is no filtering, faceting, or comparison tool — a reader has
to know roughly what they're looking for and navigate to it. This is the gap the "Car Gear
Finder" tool in your brief directly addresses; not currently present in any form. Scoped in the
roadmap as a later-priority build (per your own Priority 7 ordering) rather than something to
rush.

---

## 6. What's genuinely working — said plainly

It's easy for an audit to read as a list of problems. Worth stating clearly: the technical
foundation is sound (zero broken links, zero orphans, clean affiliate tagging, correct schema,
minimal page weight, zero third-party bloat), and the editorial differentiation is real and
consistently applied across all 38 articles, not just the flagship ones. The issues found are
specific, bounded, and fixable — a canonical URL bug, a product-imagery gap, some internal-link
redistribution, and two content pages that should be merged. None of them require reworking the
architecture, the design system, or the editorial voice.

---

## 7. Summary of findings by priority

| # | Finding | Section | Severity | Effort |
|---|---|---|---|---|
| 1 | Canonical/sitemap trailing-slash mismatch | 2.2 | Real bug, low impact | Trivial |
| 2 | ~~79% of articles have no image; 100% of reviews have none~~ **Resolved same day** | 4.3 | High (conversion) | Done — 13 images sourced via SiteStripe |
| 3 | 13 articles, incl. 3/4 reviews, not linked from homepage | 3.4 | Medium (link equity) | Low |
| 4 | No affiliate click tracking in GA4 | 4.5 | Medium (can't measure what works) | Low |
| 5 | Fabric-softener article duplicates existing FAQ content | 3.5 | Low-medium (dilutes ranking signal) | Low |
| 6 | Cluster B/C underbuilt vs. stated 3-cluster architecture | 3.2 | Strategic, not urgent | Ongoing (content) |
| 7 | Two duplicate topics in backlog | 3.5 | Trivial | Trivial |
| 8 | No Search Console data available to this audit | 2.4 | Blocks accurate prioritization | Needs your input |

See `CONTENT_ROADMAP.md` for the prioritized action plan built from these findings, and
`AFFILIATE_COMPLIANCE.md` / `EDITORIAL_STANDARDS.md` for the two other required deliverables.

**No code has been changed.** This branch (`site-audit-improve`) contains only these four new
markdown files. Waiting for your review before touching anything else.
