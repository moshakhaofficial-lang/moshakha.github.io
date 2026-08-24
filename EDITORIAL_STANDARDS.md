# Moshakha Editorial Standards

**Date:** August 24, 2026

This document exists so the methodology behind every recommendation on Moshakha is written down
in one place — for readers who want to know how we decide what to recommend, and for anyone
writing future content who needs to keep the standard consistent. It describes what the site
**already does**, verified against the current 38 articles during the August 2026 audit, not an
aspiration.

---

## 1. The core position

Moshakha's stated identity is **"Car Gear, Decoded."** The thesis, repeated verbatim on the
homepage: *the headline spec is usually the wrong one.* Every category we cover has a number
that gets marketed hard and predicts less than buyers assume — GSM on microfiber, peak amps on
jump starters, resolution on dash cams, PSI on pressure washers, the sidewall figure on tires.

**The standard this creates:** before recommending anything in a category, identify what
number that category is actually sold on, and check whether it's the number that matters. If
it isn't — and it usually isn't — say so plainly, explain what does matter instead, and let that
become the spine of the article. This isn't a stylistic flourish applied to a few flagship
pieces; it's checked structurally in the site audit across every guide, including the ones with
the least "spec-heavy" categories (floor mats, phone mounts, wash soap), and confirmed present
in all of them.

## 2. How we evaluate a product

Two sources feed every recommendation, and every article states plainly which one applies:

**Specification analysis.** What a published spec actually measures, whether it correlates with
real performance, and what it doesn't tell you. This is the primary method for most guides —
reading the construction, materials, and stated design intent of a product against known
principles of how that category of product works (weave type and blend ratio for microfiber,
sensor generation and aperture for dash cams, flow rate vs. pressure for washers).

**Aggregated long-term owner feedback.** Where hands-on testing isn't available, we look
specifically for **failure patterns after extended use** — not star-rating averages, which are
noisy and easily gamed, but recurring, specific complaints or praise that show up consistently
across many independent owners over months of use. A product that's universally loved on day one
and universally complained about at month six tells you something a single unboxing review
can't.

**What we do not do:** claim hands-on testing that didn't happen. Every article that relies on
specification analysis and aggregated feedback says so, in those terms, on the page — not buried
in a methodology footnote. This was checked across all 38 articles during the audit: zero
instances of "we tested" language anywhere on the site.

## 3. What "decoded" means in practice, per article

Every commercial guide follows the same underlying structure, even when the surface topic
varies:

1. **Name the headline spec or claim** the category is sold on.
2. **Explain what it actually measures** — the mechanism, not just the definition.
3. **Show where it's genuinely useful** and where it misleads.
4. **Recommend based on the real driver of performance**, not the marketed number.

This is why a floor mat guide leads with a safety mechanism (mats that slide can trap a pedal)
rather than a features list, and why a wash-soap guide explains what "pH-neutral" actually
protects against rather than just asserting the product is gentle.

## 4. Trade-offs, compatibility, and limitations — stated, not hidden

Every product recommendation on the site includes an explicit **pros and cons** breakdown, and
every guide states who a pick is *not* for as clearly as who it's for. A pick with a genuine
downside — slower drying time, a compatibility requirement, a narrower use case — states that
downside in the same breath as the recommendation, not in fine print elsewhere on the page.
Where a cheaper or simpler option is honestly the better choice for most readers, the site says
so, even when it isn't the most expensive or most feature-complete pick in the roundup.

## 5. Manufacturer claims

Manufacturer-stated specifications (GSM, peak amps, PSI, resolution) are reported accurately, but
never presented as the basis for a recommendation on their own — per the core position in §1, the
entire premise of the site is that the marketed number often isn't the useful one. Where a
manufacturer's own marketing claim is checked against how the underlying mechanism actually
works and found to be misleading or incomplete, the article says so directly.

## 6. Ratings

Where a numeric rating appears on a product card, it is **editorial judgment**, explicitly
presented as such — not an aggregated customer-review score. This is enforced structurally, not
just by convention: the `Review` schema markup on every review page deliberately omits
`aggregateRating`, because the site has no aggregated user-review dataset to report, and
including one would misrepresent an editorial opinion as crowd data. This was verified during
the technical audit against every review page currently live.

## 7. Pricing

No article states a fixed price as fact. Prices are given as ranges with explicit framing that
they move and the reader should check the live listing — required both because Amazon Associates
policy prohibits presenting stale pricing as current, and because it's simply true: a printed
number goes wrong within days.

## 8. Practical relevance — the scope test

Before any new category is added to the site, it's checked against one question: **would a US
car owner reasonably consider this part of automotive gear?** Categories that are technically
purchasable "for a car" but aren't genuinely automotive in the reader's mind — general
electronics, home cleaning products re-badged for cars, vehicle repair parts — are out of scope,
regardless of affiliate potential. This standard is applied explicitly in `CONTENT_ROADMAP.md`
when evaluating candidate topics, with rejected categories listed and reasoned, not just quietly
omitted.

## 9. Corrections

When a recommendation turns out to be wrong — a product changes, a spec claim doesn't hold up, a
reader points out an error — the correction is made on the article itself and noted there,
rather than silently edited away. This standard exists on the live Affiliate Disclosure and About
pages already; this document restates it because it belongs alongside the rest of the editorial
methodology, not only in the trust/compliance pages.

## 10. What this document is not

This is not a claim that Moshakha operates a physical testing lab, has purchased every product
it recommends, or has hands-on experience with every pick on the site. It's the opposite: a
written commitment to being explicit about which of the two methods in §2 produced each
recommendation, so readers can weigh that information themselves rather than assume a level of
first-hand testing that isn't happening. That honesty is the actual product being sold here, more
than any individual pick.
