# Content backlog

Topics queued for the weekly article job. The automation takes the **first entry
whose status is `queued`**, generates a draft, opens a PR, and marks it `drafted`.

**The job fails loudly when fewer than 4 `queued` topics remain.** That's deliberate —
a silently empty backlog means the weekly cadence stops without anyone noticing.

## How to add a topic

Append a row. Keep the collection to one of `blog`, `how-to`, `guides`, `reviews`.

> ⚠️ **Only `blog` and `how-to` should be automated.** `guides` and `reviews` involve
> product picks, ASINs and prices — those must be researched by a human against live
> Amazon listings. The generator is explicitly instructed not to invent product data,
> and will refuse to write a roundup.

## Queue

| Status | Slug | Collection | Target keyword | Angle |
|---|---|---|---|---|
| queued | how-to-restore-microfiber-absorbency | blog | how to restore microfiber towel absorbency | The strip wash in depth — what it fixes, what it can't, how to tell heat damage from contamination |
| queued | how-to-remove-water-spots | how-to | how to remove water spots from car | Fresh vs etched spots, why vinegar works, when it needs polishing |
| queued | microfiber-vs-chamois | blog | microfiber vs chamois for drying | Why chamois fell out of favour; where it still makes sense |
| queued | how-often-should-you-wash-your-car | blog | how often should you wash your car | Honest answer by climate and storage, not a fixed number |
| queued | clay-bar-guide | how-to | how to use a clay bar | Decontamination before polishing; the lubrication rule |
| queued | foam-cannon-guide | how-to | how to use a foam cannon | What pre-foaming does and doesn't replace |
| queued | iron-fallout-remover-explained | blog | what is iron fallout remover | The colour change explained; when it's needed |
| queued | leather-seat-care | how-to | how to clean leather car seats | Coated vs uncoated; why most "leather" is vinyl |
| queued | winter-car-paint-protection | how-to | how to protect car paint in winter | Road salt, why rinsing matters more than waxing |
| queued | drying-towel-for-winter | blog | drying a car in cold weather | Freezing water, door seals, why not to wash below zero |
| queued | quick-detailer-when-to-use | blog | when to use quick detailer spray | The dry-panel warning; it is not a waterless wash |
| queued | do-ceramic-coatings-work-on-wheels | blog | ceramic coating for wheels | Higher return than paint coating; why heat matters |
| queued | interior-detailer-vs-all-purpose-cleaner | blog | interior detailer vs all purpose cleaner | Dilution, UV coatings, what damages dashboards |
| queued | two-vs-three-bucket-method | blog | three bucket wash method | Whether the third bucket is worth it |

## Published

Moved here automatically once a generated PR is merged.

| Slug | Collection | Published |
|---|---|---|
| _(none yet — the 24 launch articles were written by hand)_ | | |
