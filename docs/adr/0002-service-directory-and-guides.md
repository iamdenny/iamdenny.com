---
title: "ADR-0002: Service directory and practical guides"
summary: "Records the apex content model and preservation of its animated identity."
read_when:
  - You are changing homepage structure or the role of linked services.
---

- Status: Accepted
- Recorded: 2026-10-25
- Implemented by: PRs #18–#23

## Context

The apex combines a personal maker identity and independently operated services.
The observed AdSense rejection was low-value content; it did not establish that
personal homepages are categorically ineligible. Visitors need useful content
and a clear path from a task to an actual service.

## Decision

Retain the animated lunar identity and framework-free static architecture.
Place nine service cards before nine original guides, followed by a distinct
MODU TT feature, making approach, task selection, FAQ and operator information
available below. MODU TT has its own domain and review boundary.

Each service card has an original SVG functional example, a service launch link
and a related guide. Label illustrations as examples; do not imply they are
screenshots, current quiz data or observed user activity. External services open
in new tabs with `noopener noreferrer`; internal documents use the current tab.

Guides provide concrete examples, limitations, contents, related documents and
a correction contact. Static content remains readable without JavaScript;
calculators progressively enhance it. Calculations remain in browser memory.

## Alternatives and consequences

A full redesign would discard an approved identity. A link-only directory would
provide less help with task selection. Arbitrary article counts and word quotas
would not establish usefulness or approval. The chosen approach requires ongoing
verification against separately deployed services and honest example labeling.
Animation must not obscure text or block navigation; preserve reduced-motion and
WebGL fallback behavior. Content quality and deployment are separate from the
provider's approval decision.

See [design](../../DESIGN.md) and [content maintenance](../content-maintenance.md).
