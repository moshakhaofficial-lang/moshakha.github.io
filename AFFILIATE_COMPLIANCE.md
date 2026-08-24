# Amazon Associates Compliance Review

**Date:** August 24, 2026
**Scope:** Every affiliate link and disclosure on the live site, checked programmatically
against the built HTML — not sampled.

**Bottom line: the implementation is clean.** No fabricated data, no missing disclosures, no
mistagged links. The gaps found are about what's *missing* (imagery, click tracking), not about
anything non-compliant that's currently live.

---

## 1. Link integrity

| Check | Result |
|---|---|
| Total unique ASINs in the live build | 48 |
| ASINs correctly tagged `tag=moshakha20-20` | 48 / 48 |
| ASINs with any other or missing tag | 0 |
| Marketplace | `www.amazon.com` exclusively — confirmed in `src/config/site.ts`, no `amazon.in` or other marketplace reference anywhere in live content |
| Link attributes | Every affiliate `<a>` carries `rel="nofollow sponsored noopener"` — hardcoded in `AffiliateButton.astro`, not left to per-article discretion |
| Broken/placeholder links | None possible by design — when `asin` is `null`, the component renders a visibly disabled "Link pending" element instead of a link, so there is no code path that ships a dead or fake `href` |

**Method:** extracted every `amazon.com/dp/...` URL from the full production build (48 pages),
cross-referenced each ASIN against the list of ASINs originally sourced from live Amazon listing
searches (documented at the time each article was written), and confirmed the tag parameter on
every single one.

## 2. Disclosure placement — the specific FTC check requested

The brief specifically asked to verify disclosure is "near the top of any page with affiliate
links (not just in the footer)" — checked per-page, distinguishing the actual disclosure
component from the sitewide footer text (which independently also mentions being
"reader-supported," so a naive text search would have produced a false pass).

| Metric | Result |
|---|---|
| Pages carrying at least one affiliate link | 17 (13 guides with product picks, 4 reviews) |
| Of those, pages with a disclosure banner **near the top of the article** (immediately after the byline, before any content) | 17 / 17 |
| Pages with an affiliate link and **no** top-of-page disclosure | 0 |
| Pages showing the banner **without** an affiliate link present (over-application) | 0 |

The banner text reads: *"Moshakha is reader-supported. When you buy through links on our site,
we may earn an affiliate commission at no extra cost to you. [How we make money]."* — plain
language, states the mechanism, links to the full `/affiliate-disclosure` page. This satisfies
the FTC's "clear and conspicuous" placement standard as commonly interpreted (before the
affiliate link itself, not buried below it) — this is not legal advice, but the placement itself
is verifiably correct.

The sitewide footer (every page, regardless of affiliate content) also carries the same
disclosure sentence plus a link to the full disclosure page — belt-and-braces, not a substitute
for the per-page banner.

## 3. Fabrication check

Grepped every article for the specific things Amazon Associates policy and FTC guidance treat as
serious violations if fabricated:

| Fabrication type | Found? |
|---|---|
| Specific prices stated as fact (e.g. "$24.99") | 0 — every guide uses price *ranges* with explicit framing ("prices move constantly — we link out for live pricing") |
| Claims of hands-on testing ("we tested") | 0 — every article explicitly states its method is "specification analysis plus aggregated owner feedback," and says so on the page, not just in this compliance doc |
| Fabricated star ratings implying aggregated user reviews | 0 — `Review` schema explicitly omits `aggregateRating`; the numeric rating shown is presented as editorial judgment, not a review count |
| Implied Amazon endorsement | 0 — no page uses "Amazon's pick," "Amazon recommends," or similar phrasing |
| Fake urgency / scarcity ("only 3 left," countdown timers) | 0 |

## 4. Amazon Associates Operating Agreement — specific clauses checked

- **No price/availability caching that could go stale and mislead:** confirmed — no prices are
  hardcoded anywhere, so there's nothing to go stale.
- **No scraping of prohibited data** (review counts, exact pricing, stock status): confirmed —
  every ASIN was sourced from a live product listing via search at the time of writing, and only
  the ASIN itself, brand, and product name were retained; no review counts or prices were copied
  from Amazon.
- **Links must not be disguised or cloaked:** confirmed — every affiliate link visibly shows an
  `amazon.com` destination; there is no link-shortening or redirect layer.

## 5. Findings requiring action (not compliance violations — quality/UX gaps)

These don't put the account at risk, but they're worth listing here since they're specifically
about how affiliate links are presented, which is this document's scope:

1. **No product images on any affiliate CTA except drying towels and interior cleaning picks.**
   A reader clicking "Check price on Amazon" for a jump starter or dash cam they've never seen a
   photo of is a real conversion gap, covered in `MOSHAKHA_AUDIT.md` §4.3 and prioritized in
   `CONTENT_ROADMAP.md` Tier 1.
2. **No click tracking.** Not a compliance issue, but it means there's currently no way to
   measure whether the compliant, well-placed CTAs are actually converting — see
   `MOSHAKHA_AUDIT.md` §4.5.

## 6. Recommendation

No remediation required for compliance. The two items in §5 are monetization/UX improvements,
already reflected in the roadmap at the appropriate priority tier — they don't belong in this
document as violations because they aren't any.

One process note for ongoing content: every future article with product picks must have its
ASINs verified against a **live** Amazon listing at write time, per the existing standing rule in
`content-backlog.md`/`CONTENT_ROADMAP.md` — this compliance review found zero violations of that
rule in the current 38 articles, and it should stay a hard requirement for anything added later.
