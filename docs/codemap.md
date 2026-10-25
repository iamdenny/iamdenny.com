# Code map

This is a framework-free static site; GitHub Pages publishes the repository
root. There is no application server or bundling step.

| Area | Responsibility |
| --- | --- |
| `index.html`, `immersive.css` | Homepage, service directory, guide entry points, MODU TT feature and shared visual styles |
| `immersive.js` | Homepage interaction, service filters, task/concept UI and analytics wiring |
| `space.js`, `assets/vendor/three/` | Single WebGL context, scene rendering, reduced-motion and fallback handling |
| `analytics.js`, `analytics-consent.js` | Host-gated GA4, event sanitization, consent state and withdrawal |
| `guides/`, `guides.js`, `guide-calculations.js` | Static guides, progressive calculators and shared consent initialization |
| `privacy.html` | Visitor-facing provider and privacy disclosures |
| `assets/previews/` | Nine original example SVGs used by service cards |
| `assets/projects/`, `assets/textures/` | Existing project illustrations and licensed lunar textures |
| `scripts/build.mjs` | Static content/link/image/metadata validation; no generated application bundle |
| `test/` | Analytics/consent and study calculation regression coverage |
| `ads.txt`, `robots.txt`, `sitemap.xml`, `CNAME` | Seller declarations, crawling, canonical page inventory and custom domain |
| `.github/workflows/ci.yml` | Node 22 verification job for PRs and dev/main pushes |

Read [content maintenance](content-maintenance.md) for behavior contracts,
[design](../DESIGN.md) for UI decisions and [releases](branching-and-releases.md)
for deployment. Subdomain services are separate repositories, not routes served
by this site.
