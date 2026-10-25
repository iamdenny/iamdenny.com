# iamdenny.com

Framework-free static site deployed from the repository root with GitHub Pages.
`index.html` loads the visual experience from `immersive.js`, `immersive.css`,
and the three.js space layer in `space.js`.

The homepage is the service directory for Denny's independently operated web
services. It explains what each service does, provides an interactive task
finder, and links to nine practical guides under `guides/`. The guide pages use
the same visual language with a quieter reading layout; the tournament guide
includes a client-side match-count calculator, and the study guide includes a
lecture-time comparison calculator. Calculator values stay in memory and are
not persisted or sent to a server. Each guide identifies its document operator
and provides an email correction link. `privacy.html` describes the
analytics and outbound-service behavior of this apex site.

## Visual experience

`space.js` renders every 3D visual through a single WebGL context on the fixed
`#world` canvas using [three.js](https://threejs.org) r185, vendored at
`assets/vendor/three/` (MIT, no CDN dependency):

- A parallax starfield with twinkle and occasional meteors behind every section
- The lunar hero — a photoreal Moon built from NASA-derived color and elevation
  maps
- The mind core — a wireframe icosahedron with a fresnel-glow core and particle
  orbits
- The contact globe — a dotted sphere wrapped in an atmosphere rim

Each object is scissor-rendered into the DOM rect of its host element, so one
renderer serves the whole page. Reduced-motion visitors get a static single-frame
render that repaints only on scroll/resize. When WebGL is unavailable or the
context is lost, the CSS sculpture fallbacks return automatically.

### Asset licensing

- `assets/textures/moon-color.jpg` — Moon color map by
  [Solar System Scope](https://www.solarsystemscope.com/textures/) (CC BY 4.0),
  derived from NASA LRO data; recompressed for the web.
- `assets/textures/moon-ldem.jpg` — Lunar elevation map from the
  [NASA SVS CGI Moon Kit](https://svs.gsfc.nasa.gov/4720) (public domain).
- `assets/vendor/three/` — three.js r185 build files (MIT).

## Analytics and visitor choice

The homepage retains Cloudflare Web Analytics. Its beacon loads only on the
canonical `iamdenny.com` hostname and is described separately in `privacy.html`.
Google Analytics 4 (GA4) loads only after the visitor explicitly allows it in
`analytics-consent.js`. The choice is stored as `granted` or `denied` in this
browser. Unknown or blocked storage fails closed; rejecting or withdrawing
disables further GA events and removes first-party `_ga` cookies this site can
clear. Localhost, preview deployments, tests, `www.iamdenny.com`, and the
privacy page do not load the Google tag.

The GA4 Measurement ID is public configuration, not a secret. This no-bundler
site has no build-time public environment-variable mechanism, so it lives in
`analytics.js`:

- Google Analytics 4 Measurement ID: `G-7KHTY03D2F`

After consent, each homepage or guide visit sends one initial `page_view`; hash
links navigate within one document, so no synthetic SPA pageviews are sent.
Homepage interaction events include primary navigation, external/contact
links, concept opens, and idea-topic changes. Download tracking is ready for
any link carrying a `download` attribute. Search, theme, and language events
are not applicable because the current UI has none.

Custom event metadata passed through `analytics.track()` is allowlisted.
The initial `page_view` uses a `page_location` containing only the origin and
path, without query strings or fragments. Search text and free-form input are
not sent as custom event parameters. HTTP destinations in custom events are
reduced to origin and path; email and phone destinations are reported only as
`email` or `phone`. GA4 property settings and automatically collected fields,
including the default page referrer, are managed separately from this module.

## Branching and deployment

Use `dev` for integration and `main` for production. The initial migration
copied the existing Pages source from `dev` to `main`, then moved the default
branch and GitHub Pages source to `main` while preserving the live site. Open
feature pull requests against `dev` and promote reviewed releases with a
separate `dev` to `main` pull request. See
[Branching and Releases](docs/branching-and-releases.md) and
[ADR-0001](docs/adr/0001-development-and-production-branches.md).

## Verification

Requires a recent Node.js release; there are no package dependencies.

```sh
npm run lint
npm run typecheck
npm test
npm run build
```

Pull requests and pushes to `dev` and `main` are configured to run the same
four commands in GitHub Actions. The repository has no application-version
field or release-tag convention, so analytics changes do not invent a
standalone version number.
Deployment history is represented by Git commits and GitHub Pages builds.

On a production review, confirm the Google tag makes no request before consent
or after rejection; allowing should load `gtag/js?id=G-7KHTY03D2F`, and
withdrawing should disable subsequent events. Then verify a consented
`page_view` and representative homepage events in GA4 Realtime or DebugView.

## AdSense preparation

See [shared service readiness](docs/adsense-readiness.md) for ownership,
per-site activation prerequisites and the pending domain-review boundary.

## Project directory

The lunar hero links to `#projects`, a responsive directory of ten services:
Everyday Tools, Denny Games, Denny Print, Denny Daily, Denny Compare,
Denny Bracket, Denny Spin, Denny Type, 말랑모아, and MODU TT (`modutt.kr`).
BUSU is not listed. Lightweight decorative illustrations live in `assets/projects/`;
the existing moon, MIND, EPOCH, and co-creation interactions remain in place.
All external HTTPS links open a new tab with `noopener noreferrer`. In-page
navigation stays in the current tab. The directory announces the new-tab behavior,
has visible keyboard focus, and respects reduced-motion preferences.
