# Content backlog

Topics queued for future articles. **There is no automated publishing** — no scheduled
job runs against this file. The process is: ask Claude in chat to write the next
article, review the draft, then say the word to push it live.

`node scripts/next-topic.mjs` still works if you want the next queued topic printed
without reading the table — it's a convenience picker, not a trigger for anything.

## How to add a topic

Append a row. Keep the collection to one of `blog`, `how-to`, `guides`, `reviews`.

> ⚠️ **`guides` and `reviews` need real product research.** They involve ASINs and
> prices that must be checked against live Amazon listings — never invented. `blog`
> and `how-to` topics don't have this constraint.

## Queue

| Status | Slug | Collection | Target keyword | Angle |
|---|---|---|---|---|
| queued | how-to-restore-microfiber-absorbency | blog | how to restore microfiber towel absorbency | The strip wash in depth — what it fixes, what it can't, how to tell heat damage from contamination |
| queued | how-to-remove-water-spots | how-to | how to remove water spots from car | Fresh vs etched spots, why vinegar works, when it needs polishing |
| queued | microfiber-vs-chamois | blog | microfiber vs chamois for drying | Why chamois fell out of favour; where it still makes sense |
| queued | how-often-should-you-wash-your-car | blog | how often should you wash your car | Honest answer by climate and storage, not a fixed number |
| queued | foam-cannon-guide | how-to | how to use a foam cannon | What pre-foaming does and doesn't replace |
| queued | iron-fallout-remover-explained | blog | what is iron fallout remover | The colour change explained; when it's needed |
| queued | leather-seat-care | how-to | how to clean leather car seats | Coated vs uncoated; why most "leather" is vinyl |
| queued | winter-car-paint-protection | how-to | how to protect car paint in winter | Road salt, why rinsing matters more than waxing |
| queued | drying-towel-for-winter | blog | drying a car in cold weather | Freezing water, door seals, why not to wash below zero |
| queued | quick-detailer-when-to-use | blog | when to use quick detailer spray | The dry-panel warning; it is not a waterless wash |
| queued | do-ceramic-coatings-work-on-wheels | blog | ceramic coating for wheels | Higher return than paint coating; why heat matters |
| queued | interior-detailer-vs-all-purpose-cleaner | blog | interior detailer vs all purpose cleaner | Dilution, UV coatings, what damages dashboards |
| queued | two-vs-three-bucket-method | blog | three bucket wash method | Whether the third bucket is worth it |
| queued | how-to-remove-pet-hair-from-car | how-to | how to remove pet hair from car seats | Why vacuums fail at it; rubber brush and squeegee methods |
| queued | iron-fallout-remover-vs-clay | blog | iron remover vs clay bar | Chemical vs mechanical decontamination — when each is right |
| queued | how-to-clean-car-seats-fabric | how-to | how to clean fabric car seats | Extraction not soaking; why over-wetting causes odour |
| queued | dashboard-dressing-glare | blog | why dashboard dressing causes glare | The visibility argument against gloss interior products |
| queued | 12v-socket-accessories-guide | blog | does car 12v socket stay on with ignition off | The compatibility trap behind most corded car accessories |
| queued | best-windshield-sun-shades | guides | best windshield sun shade | Heat reduction claims vs reality; fit matters more than reflectivity |
| queued | best-car-seat-covers | guides | best car seat covers | Airbag-compatible seams; why universal covers rarely fit |
| queued | best-car-detailing-brushes | guides | best car detailing brush set | Boar vs synthetic; where drill brushes are safe and where they are not |
| queued | how-to-install-a-dash-cam | how-to | how to install a dash cam | Hardwiring vs 12V, cable tucking, parking mode voltage cut-off |
| queued | best-car-air-purifiers | guides | best car air purifier | Cabin filter first; when a purifier adds anything |
| queued | dash-cam-memory-cards | blog | best dash cam memory card | High-endurance vs standard; why cards fail silently |

## Published

Moved here automatically once a generated PR is merged.

| Slug | Collection | Published |
|---|---|---|
| how-to-use-a-clay-bar | how-to | 2026-08-24 (written by hand) |
