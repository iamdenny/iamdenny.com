# iamdenny.com

Framework-free static site deployed from the repository root with GitHub Pages. `index.html` loads the visual experience from `immersive.js` and `immersive.css`.

## Analytics

The site retains Cloudflare Web Analytics and also uses the self-hosted Umami instance at `analytics.iamdenny.com`. The dedicated `analytics.js` module loads Umami once, only when the exact hostname is `iamdenny.com`. Localhost, preview deployments, tests, and `www.iamdenny.com` therefore do not enter production statistics.

The Umami script URL and public Website ID are static public configuration, not secrets. This no-bundler site has no build-time public environment-variable mechanism, so they live in `analytics.js`:

- Script: `https://analytics.iamdenny.com/script.js`
- Website ID: `ea762dc9-a791-414e-890d-eb86e138dabd`

Tracked interactions include primary navigation, external/contact links, concept opens, idea-topic changes, and the Generate CTA. Download tracking is ready for any link carrying a `download` attribute. Search, theme, and language events are not applicable because the current UI has none. Hash links navigate within one document, so Umami's initial automatic pageview is sufficient and no synthetic SPA pageviews are sent.

Event metadata is allowlisted. The tracker sets `data-exclude-search` and `data-exclude-hash`, so automatic pageviews and events omit URL query strings and fragments. Search text, free-form input, and personal data are never sent. HTTP destinations are reduced to origin and path; email and phone destinations are reported only as `email` or `phone`.

## Verification

Requires a recent Node.js release; there are no package dependencies.

```sh
npm run lint
npm run typecheck
npm test
npm run build
```

Pull requests and pushes to `dev` run the same four commands in GitHub Actions. The repository has no existing application-version field or release-tag convention, so analytics changes do not invent a standalone version number; deployment history is represented by Git commits and GitHub Pages builds.

After production deployment, use the browser Network panel to confirm `analytics.iamdenny.com/script.js` loads with the Website ID above. Then verify a pageview and representative events such as `navigation_click`, `content_open`, and `cta_click` in the Umami dashboard.
