# Feature tests (Qwik City)

Validates the 11 Framework Compare labels for `qwik-city` against a production build.

```sh
npm run test:features            # vite build (client) + express adapter build, then Playwright
node feature-tests/run.mjs --skip-build   # reuse an existing build
```

- Server: `node server/entry.express.js` on `PORT=4123` (override with `FT_PORT`), started by Playwright's `webServer`.
- Browser: system Chrome at `/home/maxc/.local/bin/google-chrome` (override with `CHROME_PATH`); no browser download.
- Output: `feature-tests/results.json` (written by `results-reporter.ts`; labels/methods in `meta.ts`).
- Demo routes: `/feature-tests` and `/feature-tests/<featureId>` (`src/routes/feature-tests`).

| Spec | What it proves |
| --- | --- |
| css-inlining | `useStyles$(css?inline)` CSS is in an inline `<style>`; no `<link rel=stylesheet>` contains it; style applies. |
| font-optimization | Fontsource Lora served same-origin, 0 Google Fonts requests, `@font-face` has `font-display:swap`, qwikVite auto-emits `<link rel=preload as=font>`. |
| image-pipeline | `?jsx` import renders `<img>` with ≥2 srcset widths, width/height, `loading=lazy` offscreen; srcset URL is `image/webp`. |
| caching | `cacheControl()` sets `public, max-age=4, s-maxage=60, stale-while-revalidate=120`; browser reuses the cached counter within TTL, serves stale then fresh after max-age. |
| route-prefetching | No `q-data.json` for the target while the `<Link>` is offscreen; scrolling it into view fetches it before the click; SPA nav shows loader data. |
| islands | Counter works after resume; no fetched JS (or inline script) contains the static component's code marker, though the chunk exists in `dist/build`. |
| render-modes | `dist/feature-tests/render-modes/static/index.html` exists and is served with a stable stamp; `/ssr` stamp changes per request. |
| reactivity | `{signal}` binding updates text 3× with 0 client re-runs of the component; a control component that reads `.value` in its body does re-run. |
| bundle-analysis | `ANALYZE=1 vite build --outDir <tmp>` with rollup-plugin-visualizer writes `stats.html`. |
| third-party-scripts | Script only as `type="text/partytown"`; Partytown worker runs it (type → `text/partytown-x`, DOM write proxied to main thread). |
| multi-host-deployment | Builds express, vercel-edge and netlify-edge adapters in temp copies and checks their output dirs. |

Notes: `/feature-tests/render-modes/static` without a trailing slash falls through to SSR on the node adapter (its
static-path set uses the trailing-slash form). The vercel-edge adapter moves `dist/` into `.vercel/output`, which is why
multi-host builds run in temp copies.
