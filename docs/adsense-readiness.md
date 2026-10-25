# Shared AdSense readiness — 2026-10-25

## Scope and evidence

The selected publisher for the Denny service network is
`ca-pub-3539037484563455`. The registered parent domain is `iamdenny.com`.
The owner-supplied AdSense screenshot updated on 2026-10-23 at 9:59 PM KST
shows **Needs attention / low-value content** for `iamdenny.com`; ads.txt is
**Authorized**. A separate `modutt.kr` entry is **Getting ready** and ads.txt
is **Not found** in that screenshot. This record does not claim site approval,
Google ad serving, or revenue.

| Service | Canonical host | Public ownership preparation | Serving preparation |
| --- | --- | --- | --- |
| Everyday Tools | tools.iamdenny.com | Denny meta and seller already live | Matching Denny units exist in a separate preset; the dormant older publisher and its units must be switched together after approval |
| Denny Games | games.iamdenny.com | Denny meta and seller already live | Follow the repository display/H5 adapter and consent gates; H5 eligibility is separate |
| Denny Print | print.iamdenny.com | Denny meta and seller already live | Verification mode; display slot and certified CMP are not configured |
| Denny Compare | compare.iamdenny.com | Denny meta and seller already live | Verification mode; display slot and certified CMP are not configured |
| Squishy Garden | squishy.iamdenny.com | Prepared in a separate PR: matching meta and generated seller | Ownership only; no Google ad adapter or display slot is enabled |

The pre-change live audit found HTTP 200 for all five Korean home, about and
privacy pages. Tools/Games/Print/Compare already linked their operating pages
and used the selected publisher. Tools and Squishy have ko/en/ja routes;
Games has ko/en. Print and Compare use `/` for English and ko/ja/es prefixes;
`/en/` is not a supported route and must not be submitted as one.
Squishy's ads.txt was missing before this change.

On 2026-10-25, read-only checks of the current apex returned HTTP 200 and the
older `Denny Lim — Human × AI` page. Its homepage loaded Cloudflare Web
Analytics; the initial HTML contained no GA4 or AdSense script. The currently
published `/privacy.html` returned 404. This checkout's new policy and content
are local only, so that 404 is expected until this branch is reviewed and
released. Do not describe the draft policy as already live.

The same read-only check found HTTP 200 for the Korean home page of each linked
service: Tools, Games, Print, Daily, Compare, Bracket, Spin, Type, Squishy
Garden, and MODU TT. Tested privacy pages on those services also returned HTTP
200. Tools' lecture-speed and completion-plan calculators and Games'
compatibility and input-diagnostics pages returned HTTP 200. The Games
input-diagnostics page is intentionally `noindex`; the other checked service
pages exposed canonical URLs, and the tested pages were indexable unless
noted. Squishy Garden uses default indexing rather than an explicit robots meta
tag.

The initial HTML for Print, Daily, and Compare referenced their Adsterra
loader. Games exposed an ad-preference control in its page UI and disclosed its
ad partners on its privacy page. Bracket, Spin, and Type linked to their own
privacy pages, each of which returned HTTP 200. A static HTML scan cannot prove
whether an ad was served, whether a consent choice was honored in every browser,
or whether a provider recorded revenue; those remain separate checks. The
separate `modutt.kr` service is not part of the `iamdenny.com` AdSense review.

The apex change aligns the verification meta with the selected publisher,
retains both existing authorized sellers, retains tools/print/daily/compare
declarations, and adds games/squishy declarations. It also gives visitors
crawlable descriptions and links to all five services. These are real services,
not duplicate application domains or new AdSense account applications.

## Content improvements in local review

The local branch adds original, service-specific explanations to the apex
directory and nine practical guides for tournament planning, printable answer
keys, UTC-based flag practice, proportion comparisons, study-time planning,
random draws and teams, typing metrics, browser-game input, and paper-squishy
printing. A small match-count calculator uses the same formulas explained in
the guide. A privacy page describes the apex site's analytics and the current
absence of an AdSense ad placement in this local source. The existing space/3D
animation remains; unsupported decorative latency and confidence numbers are
removed. No AdSense ad loader or placement is added to the apex.

The branch also moves nine original, service-specific guides immediately after
the service directory, adds direct links to three practical guides, and keeps
the animated homepage while removing scroll effects that dimmed body text. Each
guide now has an in-page contents list and links to related guides. Internal
documents stay in the current tab; service links open a new tab with
`noopener noreferrer`.

GA4 now requires an explicit visitor choice before loading. Rejecting or
withdrawing disables later GA4 events and clears first-party `_ga` cookies
where the browser allows it. The homepage's Cloudflare Web Analytics beacon is
still a separate provider and is described separately in the privacy policy.
The apex does not add an AdSense slot or loader.

These changes are local source only until separately reviewed and released.
They may address the content concern but do not guarantee Google approval.

## Activation procedure

1. Read the existing `iamdenny.com` review in the selected publisher account.
   Keep the existing request while it is pending. Record any actual rejection
   reason before choosing corrective work. Do not represent another account's
   approval or ads.txt authorization as this account's site approval.
2. When the domain is Ready, create/read back each site's actual display units.
   Keep publisher and slot IDs together. Do not reuse a Tools-specific unit as
   proof that another site's integration is complete.
3. Review the target site's privacy disclosure and applicable consent/CMP
   settings. Print and Squishy content requires an explicit audience and
   child-directed-content assessment; adult analytics consent alone is not an
   AdSense consent implementation. Games' optional H5 integration has its own
   provider eligibility requirements.
4. Keep automatic formats off initially. Enable one deliberate display
   placement in a reviewed release; retain existing Coupang/Adsterra/promotion
   behavior unless the owner requests a placement change.
5. Verify the deployed publisher/slot pair, consent withdrawal, mobile layout
   and real ad response without clicking the site's own ads. Report source,
   deployment, actual fill and earnings separately.

Use the current status shown in the publisher account as the source of truth.
If a review is pending, do not remove and recreate the application merely to
restart it. If a review is complete, preserve the exact current reason before
choosing a correction. No support message or AdSense application change was
made as part of this local implementation.

## Validation and rollback

Apex local verification: `npm run lint`, `npm run typecheck`, `npm test`, and
`npm run build` passed on the current branch. The 8 analytics tests cover
pre-consent blocking, explicit grant, duplicate-load prevention, withdrawal,
cookie clearing, property sanitization, storage failure, and nonproduction
hosts. Static build checks cover required pages, all nine guide contents and
related links, local link targets, safe external links, sitemap entries, and
robots directives. Chromium local preview showed no horizontal overflow at
the 487px mobile breakpoint and the 1455px default desktop viewport. The
browser viewport adapter reported 487px after a request for 390px, so no exact
390px viewport claim is made. Browser checks are not physical-device QA.

Squishy Garden's separate prior `npm run verify` passed ten tests and checked
867 indexable pages, matching publisher metadata, generated seller text and
absence of Google ad scripts. That is prior repository evidence, not a fresh
validation of this branch.

Release and public readback must be recorded after the PRs deploy. Prior apex
production baseline: `ffd539c`; prior Squishy baseline: `c0ef1d7`. Revert only the
scoped readiness commits through the normal PR flow if rollback is needed.
Other agents' primary-checkout changes are excluded from these PRs.

## References

- [Google: connect your site](https://support.google.com/adsense/answer/7584263?hl=en)
- [Google: site management](https://support.google.com/adsense/answer/12170421?hl=en)
- [Google: ads.txt](https://support.google.com/adsense/answer/12171612?hl=en)
- [Google: pages ready for AdSense](https://support.google.com/adsense/answer/7299563?hl=en)
- [Google: required privacy content](https://support.google.com/adsense/answer/1348695?hl=en)
- [Google: publisher privacy policies](https://support.google.com/adsense/answer/10502938?hl=en)

## Guide usability follow-up (2026-10-25)

All nine first table-of-contents links now target their corresponding body
heading instead of the table-of-contents heading. Build validation checks
heading text as well as target existence and rejects duplicate element IDs.
Each guide identifies the document operator and provides a correction email
link that includes its public URL. No email is sent automatically.

The study guide now compares lecture duration, playback speed, review allowance,
study days, and daily capacity directly in the page. It preserves the original
static examples when JavaScript is unavailable. Inputs remain in browser memory
and are not stored or submitted. Three calculation tests cover the published
0%/25% examples, fractional results, spare/exact capacity, and invalid ranges;
all 11 tests passed. Local browser checks verified calculation, Enter submission,
native invalid-input blocking, and a narrow single-column layout without
horizontal overflow (reported CSS viewport 487px).

This follow-up improves the public site while the existing review request is
pending; it does not create a duplicate AdSense application.
