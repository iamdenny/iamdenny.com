# iamdenny.com

Framework-free static site deployed from the repository root with GitHub Pages.
`index.html` loads the visual experience from `immersive.js`, `immersive.css`,
and the three.js space layer in `space.js`.

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

## Analytics

The site retains Cloudflare Web Analytics and uses Google Analytics 4 (GA4). The
dedicated `analytics.js` module loads GA4 only when the exact hostname is
`iamdenny.com`. Localhost, preview deployments, tests, and `www.iamdenny.com`
therefore do not enter GA4.

The GA4 Measurement ID is public configuration, not a secret. This no-bundler
site has no build-time public environment-variable mechanism, so it lives in
`analytics.js`:

- Google Analytics 4 Measurement ID: `G-7KHTY03D2F`

The Google tag sends one initial `page_view`; hash links navigate within one
document, so no synthetic SPA pageviews are sent. Tracked interactions include
primary navigation, external/contact links, concept opens, idea-topic changes,
and the Generate CTA. Download tracking is ready for any link carrying a
`download` attribute. Search, theme, and language events are not applicable
because the current UI has none.

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

After production deployment, use the browser Network panel to confirm
`gtag/js?id=G-7KHTY03D2F` loads on `iamdenny.com`. Then verify a `page_view` and
representative events such as `navigation_click`, `content_open`, and
`cta_click` in the GA4 Realtime report or DebugView.

## AdSense preparation

See [shared service readiness](docs/adsense-readiness.md) for ownership,
per-site activation prerequisites and the pending domain-review boundary.
