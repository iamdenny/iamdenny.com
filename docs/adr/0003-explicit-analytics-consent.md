---
title: "ADR-0003: Explicit analytics consent"
summary: "Records fail-closed GA4 loading and the separate provider boundaries."
read_when:
  - You are modifying analytics, privacy disclosures or consent controls.
---

- Status: Accepted
- Recorded: 2026-10-25
- Implemented by: PR #18, released by PR #19

## Context

Loading GA4 immediately did not give visitors an explicit choice. Analytics,
site functionality and advertising require separate configuration boundaries.

## Decision

Use `analytics-consent.js` to persist `granted` or `denied` under
`iamdenny.analytics-consent.v1`. Unknown preference or unavailable storage
fails closed. GA4 loads only after a saved grant, on the allowed production
hostname. The homepage and guides initialize this control; the privacy page
does not initialize GA4. Settings let visitors reject or withdraw consent.

Withdrawal disables subsequent events and clears first-party `_ga` cookies
where possible. It cannot undo previously transmitted data or guarantee
cancellation of an already in-flight request. Site features remain usable.

Keep event fields allowlisted; remove query/fragment values from tracked URLs,
reduce email/phone targets to type labels, and do not track calculator inputs.
Cloudflare Web Analytics remains separately disclosed and is not governed by
this GA4 toggle. The apex has no AdSense placement or loader; this control is
not an advertising CMP or a claim of Google certification.

## Alternatives and consequences

Immediate GA4 loading was rejected in favor of an explicit choice. Blocking the
whole site until acceptance would unnecessarily couple analytics to utility.
Fail-closed storage may reduce analytics coverage, which is intentional.
Changes must retain the analytics tests and production request checks described
in the [README](../../README.md). Subdomain analytics and ad consent require
review in their own repositories.
