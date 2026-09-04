# Moshakha Content Roadmap

**Date:** August 24, 2026
**Status:** Draft for review — no articles have been written from this file yet.
**Supersedes:** `content-backlog.md`, whose 24 queued topics are folded in below (one duplicate
pair merged — see §3). Once this roadmap is approved, `content-backlog.md` should be deleted so
there is one source of truth, per your workflow rule.

This is the **single file to reference** when you ask for "the next article" in chat. Pull the
highest-priority `queued` row whose cluster you want to fill next, or just ask and I'll pick.

**No search-volume or ranking-position numbers appear in this document**, for the same reason
they didn't in the original keyword research: no keyword tool is connected here, and inventing
plausible-looking numbers would be worse than having none. Priority below is reasoned from SERP
composition (checked live, see notes), competitive gap, and how directly each topic serves the
"decoded" positioning — not from volume estimates. **Before you commit real writing time to the
top of this list, pull Search Console's Performance report** — any existing page already getting
impressions for a related query should jump the queue over a brand-new topic, because "already
ranking on page 3" beats "ranking nowhere" every time, and only Search Console can tell you that.

---

## 1. How to use this file

- **Status** starts every row at `queued`. Mark `drafted` when I write it, `published` once you
  approve and push.
- **Type** is one of: `new-article`, `upgrade-existing`, `merge`, `technical`.
- Rows are grouped by priority tier, not alphabetically. Work top to bottom within a tier; tiers
  themselves are ordered by expected impact per unit of effort.

---

## 2. Tier 0 — Technical/structural fixes (not new content, do first)

These aren't articles — they're the highest-leverage items from the audit, listed here because
they directly affect how well every article above performs. Implementation-scoped separately in
`MOSHAKHA_AUDIT.md` §7; listed here so they're not lost between the two documents.

| Status | Item | Type | Why first |
|---|---|---|---|
| queued | Fix canonical/sitemap trailing-slash mismatch | technical | Site-wide, one config change, zero content risk |
| queued | Link all 4 reviews + remaining 9 unlinked articles from homepage | technical | Reviews are closest-to-purchase; currently 3/4 are 2 clicks deep |
| queued | Add `affiliate_click` GA4 event (page/product/category/CTA position) | technical | Can't prioritize future content by revenue without this |
| queued | Merge `can-you-use-fabric-softener-on-microfiber` into `microfibre-care-101` + redirect | merge | Two pages competing for one query intent |

---

## 3. Tier 1 — Upgrade existing pages (Priority 3 in your implementation order)

**Do this before writing anything new.** Every row here is an existing page with a specific,
bounded improvement — not a rewrite. Per your instruction, prioritized by realistic upward
potential, which without Search Console data I'm inferring from commercial intent + competitive
gap. **Re-rank this tier once you have Performance report data** — a page already at position 12
for its target query is a better use of an hour than one that isn't indexed yet.

| Status | Page | Target query | Upgrade needed | Priority reason |
|---|---|---|---|---|
| queued | `reviews/rag-company-gauntlet-drying-towel` | the rag company gauntlet review | Add product image, link from homepage | Money page, currently invisible from homepage, no photo |
| queued | `reviews/chemical-guys-woolly-mammoth-drying-towel` | chemical guys woolly mammoth review | Same | Same |
| queued | `reviews/rag-company-cyclone-wash-mitt` | rag company cyclone wash mitt review | Same | Same |
| queued | `guides/best-jump-starters` | best jump starter | Add product images to picks | High commercial intent, Cluster B flagship, zero imagery |
| queued | `guides/best-dash-cams` | best dash cam | Add product images to picks | Same reasoning |
| queued | `guides/best-tire-inflators` | best tire inflator | Add product images to picks | Same reasoning |
| queued | `guides/best-car-wash-mitts` | best car wash mitt | Add product images to picks | High-intent, established page, no photo |

---

## 4. Tier 2 — New commercial pages (Cluster B: Car Gear)

Cluster B is 13–18% of the site against a stated 3-cluster architecture — genuinely thin. These
close real gaps rather than pad the count; each was checked against the existing 38 for
cannibalization before inclusion (none found).

| Status | Slug | Type | Cluster | Target query | Search intent | Commercial intent | Suggested title | Content type | Internal links | Monetization |
|---|---|---|---|---|---|---|---|---|---|---|
| queued | best-portable-power-stations | new-article | B | best portable power station for car | Commercial | High | "Portable Power Stations for Cars: Watt-Hours vs Real Runtime" | guides | jump-starters, tire-inflators | Amazon picks |
| drafted (2026-08-25) | how-to-install-a-dash-cam | new-article | B | how to install a dash cam | Informational, high commercial adjacency | Medium | "How to Install a Dash Cam (Hardwire vs 12V)" | how-to | best-dash-cams | Amazon pick added inline (VIOFO A129, reused from best-dash-cams) |
| queued | dash-cam-memory-cards | new-article | B | best dash cam memory card | Commercial | Medium | "Dash Cam Memory Cards: Why Standard Cards Fail Silently" | guides | best-dash-cams | Amazon picks |
| drafted (2026-08-25) | 12v-socket-accessories-guide | new-article | B | does car 12v socket stay on with ignition off | Informational | Low-medium | "Does Your Car's 12V Socket Stay On With the Ignition Off?" | blog | jump-starters, tire-inflators, phone-mounts | Amazon pick added inline (AstroAI inflator, reused from best-tire-inflators) |
| drafted (2026-08-25) | best-car-emergency-kit | new-article | B | best car emergency kit | Commercial | High | "Car Emergency Kits: What's Actually Worth Carrying" | guides | jump-starters, tire-inflators | Amazon picks — all 3 reused from existing verified guide picks (NOCO GB40, AstroAI inflator, DRIVE organizer) |

---

## 5. Tier 3 — New commercial pages (Cluster C: Car Accessories)

Cluster C is the thinnest — 5–8% of the site. These are the queued `guides`-type topics from the
old backlog that need real product research (ASINs verified against live listings) before
writing, per the standing rule.

| Status | Slug | Type | Cluster | Target query | Search intent | Commercial intent | Suggested title | Content type | Internal links | Monetization |
|---|---|---|---|---|---|---|---|---|---|---|
| queued | best-windshield-sun-shades | new-article | C | best windshield sun shade | Commercial | Medium | "Best Windshield Sun Shades: Heat Reduction Claims vs. Reality" | guides | floor-mats, trunk-organizers | Amazon picks |
| queued | best-car-seat-covers | new-article | C | best car seat covers | Commercial | Medium | "Best Car Seat Covers: Why Universal Rarely Fits" | guides | floor-mats | Amazon picks |
| queued | best-car-detailing-brushes | new-article | C | best car detailing brush set | Commercial | Medium | "Best Detailing Brush Sets: Boar vs Synthetic, and Where Drill Brushes Are Safe" | guides | clay-bar, wheel-rim-care | Amazon picks |
| queued | best-car-air-purifiers | new-article | C | best car air purifier | Commercial | Low-medium | "Car Air Purifiers: Check the Cabin Filter First" | guides | interior-cleaning-products | Amazon picks |

---

## 6. Tier 4 — New informational "decoded" pages (Cluster A, reinforces the pillar)

These extend the existing GSM/care hub-and-spoke pattern that's already working (§3.5 of the
audit confirmed it isn't cannibalizing). Lower priority than B/C expansion since Cluster A is
already 74% of the site, but these are cheap, high-differentiation, and each links into an
existing money page.

| Status | Slug | Type | Cluster | Target query | Search intent | Commercial intent | Suggested title | Content type | Internal links | Monetization |
|---|---|---|---|---|---|---|---|---|---|---|
| drafted (2026-08-28) | how-to-restore-microfiber-absorbency | new-article | A | how to restore microfiber towel absorbency | Informational | Low | "How to Restore Microfiber Absorbency (Strip Wash, Explained)" | blog | microfibre-care-101 | Links only |
| drafted (2026-08-28) | microfiber-vs-chamois | new-article | A | microfiber vs chamois for drying | Informational, comparison | Low-medium | "Microfiber vs Chamois: Why Chamois Fell Out of Favor" | blog | best-car-drying-towels | Links, could add ASIN if a chamois pick fits |
| drafted (2026-08-28) | how-often-should-you-wash-your-car | new-article | A | how often should you wash your car | Informational | Low | "How Often You Should Actually Wash Your Car" | blog | two-bucket-method | Links only |
| drafted (2026-08-28) | foam-cannon-guide | new-article | A | how to use a foam cannon | Informational, commercial adjacent | Medium | "Foam Cannons: What Pre-Foaming Does and Doesn't Replace" | how-to | best-pressure-washers-for-cars | Links to pressure washer guide |
| drafted (2026-08-28) | how-to-remove-water-spots | new-article | A | how to remove water spots from car | Informational | Medium | "Removing Water Spots: Fresh vs Etched, and When You Need to Polish" | how-to | how-to-avoid-swirl-marks | Links only |
| queued | leather-seat-care | new-article | A | how to clean leather car seats | Informational | Medium | "Cleaning Leather Car Seats (Most 'Leather' Is Vinyl)" | how-to | interior-cleaning-products | Amazon picks possible (leather cleaner) |
| queued | winter-car-paint-protection | new-article | A | how to protect car paint in winter | Informational | Low-medium | "Protecting Car Paint in Winter: Rinsing Beats Waxing" | how-to | wheel-rim-care | Links only |
| queued | drying-towel-for-winter | new-article | A | drying a car in cold weather | Informational | Low | "Drying a Car in Freezing Weather (Door Seals, Not Just Towels)" | blog | best-car-drying-towels | Links only |
| queued | quick-detailer-when-to-use | new-article | A | when to use quick detailer spray | Informational | Low-medium | "Quick Detailer: The Dry-Panel Warning" | blog | waterless-wash-guide | Links only |
| queued | do-ceramic-coatings-work-on-wheels | new-article | A | ceramic coating for wheels | Informational | Medium | "Ceramic Coating Wheels: Higher Return Than Paint" | blog | ceramic-coating-guide, wheel-rim-care | Links only |
| queued | interior-detailer-vs-all-purpose-cleaner | new-article | A | interior detailer vs all purpose cleaner | Informational | Low-medium | "Interior Detailer vs All-Purpose Cleaner: What Damages Dashboards" | blog | interior-cleaning-products | Links only |
| queued | two-vs-three-bucket-method | new-article | A | three bucket wash method | Informational | Low | "Is a Third Wash Bucket Worth It?" | blog | two-bucket-method | Links only |
| queued | how-to-remove-pet-hair-from-car | new-article | A | how to remove pet hair from car seats | Informational | Low-medium | "Removing Pet Hair From Car Seats (Vacuums Alone Don't Work)" | how-to | thisworx-car-vacuum | Links to vacuum review |
| queued | iron-fallout-remover-explained | new-article | A | iron remover vs clay bar | Informational | Medium | "Iron Fallout Remover vs Clay Bar: Chemical or Mechanical First?" | blog | how-to-use-a-clay-bar | Links only — merged from two duplicate backlog entries, see §7 |
| queued | how-to-clean-car-seats-fabric | new-article | A | how to clean fabric car seats | Informational | Medium | "Cleaning Fabric Car Seats: Extraction, Not Soaking" | how-to | interior-cleaning-products | Links only |
| queued | dashboard-dressing-glare | new-article | A | why dashboard dressing causes glare | Informational | Low | "Why Dashboard Dressing Causes Windshield Glare" | blog | perfect-interior-detail | Links only |

---

## 7. Duplicates found and resolved

`content-backlog.md` queued two overlapping topics: `iron-fallout-remover-explained` (angle:
"the colour change explained; when it's needed") and `iron-fallout-remover-vs-clay` (angle:
"chemical vs mechanical decontamination — when each is right"). These would cannibalize each
other before either was even written. **Merged into one row** in Tier 4 above, combining both
angles into a single comparison piece — that's a stronger article than either half alone.

---

## 8. What's deliberately not on this list

Per your own instruction (§24 of the brief): every candidate topic was checked against "would a
US car owner reasonably consider this part of automotive gear?" before inclusion. Rejected
categories from adjacent brainstorming, and why:

- **General electronics** (phone cases not car-specific, generic power banks) — no automotive
  relevance beyond "it's electronic and could go in a car."
- **Home cleaning products re-badged as car products** — already covered properly by the
  existing car-specific interior cleaning cluster; a generic "best all-purpose cleaner" page
  would compete with big non-automotive sites for no benefit.
- **Vehicle-specific parts/repair content** (brakes, alternators, engine parts) — genuinely
  outside "gear and accessories," a different vertical with different buyer intent, best left
  alone rather than diluting the site's identity.

---

## 9. Growth model — realistic, not promised

Per your instruction not to promise revenue: this is a framework for judging whether the roadmap
above is working, not a forecast. Actual numbers depend on factors outside content (domain age,
backlink profile, seasonality) that this document has no visibility into.

| Stage | Revenue range | What it looks like | What to measure |
|---|---|---|---|
| 1 | $0–100/mo | Pages getting indexed and crawled; first impressions appear in Search Console for long-tail terms | Indexed page count, impressions |
| 2 | $100–500/mo | Some pages reach page one for their target query; first consistent affiliate clicks | Average position, clicks, affiliate CTR |
| 3 | $500–1,000/mo | Topical authority established across Clusters A/B/C; comparison/finder tools driving discovery | Organic sessions, conversion rate, revenue per visitor |
| 4 | $1,000+/mo | Diversified traffic sources, repeat visitors, brand searches for "Moshakha" itself | Direct traffic, branded search volume |

**Do not treat these as targets or timelines** — they're categories for recognizing which stage
you're actually in, so effort matches reality rather than expectation.
