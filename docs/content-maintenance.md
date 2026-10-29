---
title: "Content maintenance and verification"
summary: "Defines how guides, examples and service links are maintained."
read_when:
  - You are editing a guide, calculator, preview or linked service.
---

## Update from actual behavior

Check the linked service before describing input handling, storage, sharing or
output. Record the tested URL and scope; a date means an actual check, not a
bulk freshness update. Mark demonstration data as examples. Never manufacture
usage metrics, testimonials, rights claims or approval guarantees.

Keep nine guide topics aligned with the card links in `index.html`. Each guide
needs a table of contents targeting body headings, related guide links, operator
identification and a correction email with its public URL. Internal links stay
in the same tab. Service links open a new tab with `noopener noreferrer`.

The guide screenshots in `assets/guides/` are captures of live services, not
illustrations. On 2026-10-29 the bracket image was captured from the anonymous
eight-participant example linked in the tournament guide, and the print image
from `https://print.iamdenny.com/ko/` using math, 1 더하기, generation 1,
one sheet and visible answers. When the referenced screens change, recapture
and verify those exact example settings, update the captions and checked dates,
and never include real participant names or user data.

For printable material, distinguish free access from redistribution permission.
The original bunny illustration in `assets/previews/squishy.svg` is explanatory
artwork, not a copied catalog character or downloadable pattern.

## Calculator contracts

The study calculator uses viewing = minutes / speed; required = viewing ×
(1 + reviewPercent / 100); capacity = days × dailyMinutes; balance = capacity −
required. Keep precision until display. The published 180-minute, 1.5×, 3-day,
30-minute-per-day example requires 120 minutes without review (30 short), or
150 minutes with 25% review (60 short).

`guide-calculations.js` rejects nonfinite inputs, minutes outside 1–100000,
speed outside 0.25–4, noninteger days outside 1–366, daily minutes outside
1–1440 and review percent outside 0–200. Static worked examples remain when
JavaScript is unavailable. Inputs are not persisted or submitted.

The match calculator accepts integer participant counts 2–256. Single
elimination requires n−1 matches; a single round robin requires n(n−1)/2.
For 8 players that is 7 and 28. These are match counts, not duration estimates;
consolation games and repeated round robins are outside the formulas.

## Validation

Run the four README verification commands. Build checks validate local page and
image references, safe external targets, guide contents and heading IDs,
sitemap entries and robots directives. Syntax checks are not static typing;
`typecheck` currently uses `node --check`.

For UI changes, inspect desktop and narrow layouts, keyboard focus, category
filter announcements, reduced motion, service new-tab links and guide same-tab
links. Check image dimensions and alt text. Report the actual CSS viewport;
a requested size is not evidence of that size. For analytics changes, verify
pre-consent blocking, grant, rejection and withdrawal separately.

After deployment, verify public URLs and content against the release, not just
CI. Use [AdSense readiness](adsense-readiness.md) for provider-state boundaries.
