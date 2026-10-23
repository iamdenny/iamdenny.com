# Shared AdSense readiness — 2026-10-23

## Scope and evidence

The selected publisher for the Denny service network is
`ca-pub-3539037484563455`. The registered parent domain is `iamdenny.com`.
Its latest authenticated status on 2026-10-23 was **Getting ready / under review**;
ads.txt was **Authorized**. Review was requested on October 8. This record does
not claim site approval, Google ad serving, or revenue.

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

The apex change aligns the verification meta with the selected publisher,
retains both existing authorized sellers, retains tools/print/daily/compare
declarations, and adds games/squishy declarations. It also gives visitors
crawlable descriptions and links to all five services. These are real services,
not duplicate application domains or new AdSense account applications.

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

The official review guidance says a few days, sometimes 2–4 weeks. November 5
is the four-week follow-up point for the October 8 request, not a promised
approval date. If still pending then, inspect the account's available support
options; do not remove and recreate the application merely to restart it.
No support message was sent as part of this preparation.

## Validation and rollback

Apex: lint, typecheck, five tests and static build passed. Chromium checked the
new service section at 1280×800 and 360×800 with no section horizontal overflow.
Squishy: `npm run verify` passed ten tests and checked 867 indexable pages,
matching publisher metadata, generated seller text and absence of Google ad
scripts. Browser screenshots are local evidence, not physical-device QA.

Release and public readback must be recorded after the PRs deploy. Prior apex
production baseline: `ffd539c`; prior Squishy baseline: `c0ef1d7`. Revert only the
scoped readiness commits through the normal PR flow if rollback is needed.
Other agents' primary-checkout changes are excluded from these PRs.

## References

- [Google: connect your site](https://support.google.com/adsense/answer/7584263?hl=en)
- [Google: site management](https://support.google.com/adsense/answer/12170421?hl=en)
- [Google: ads.txt](https://support.google.com/adsense/answer/12171612?hl=en)
