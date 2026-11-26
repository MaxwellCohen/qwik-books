// Claimed labels come from framework-compare capability.json (frameworkId: qwik-city).
export type Meta = { claimedLabel: string; method: string; suggestedLabel?: string }

export const META: Record<string, Meta> = {
  'css-inlining': {
    claimedLabel: 'first-party',
    method: "useStyles$(css) with a `?inline` CSS import; Qwik SSR emits it as <style q:style> (built-in, no package)",
  },
  'font-optimization': {
    claimedLabel: 'third-party',
    method: "@fontsource/lora (self-hosted, font-display: swap); preload added automatically by qwikVite's built-in font preload (disableFontPreload opt-out)",
  },
  'image-pipeline': {
    claimedLabel: 'first-party',
    method: "Built-in `import Img from './hero.jpg?jsx'` (qwikCity() bundles vite-imagetools)",
  },
  caching: {
    claimedLabel: 'first-party',
    method: 'cacheControl({ public, maxAge: 4, sMaxAge: 60, staleWhileRevalidate: 120 }) in onGet (page + JSON endpoint)',
  },
  'route-prefetching': {
    claimedLabel: 'first-party',
    method: '<Link> from @builder.io/qwik-city with default prefetch (visible task + hover/focus)',
  },
  islands: {
    claimedLabel: 'first-party',
    method: 'Resumability: a static component$ and an interactive component$ counter; no islands API needed',
  },
  'render-modes': {
    claimedLabel: 'first-party',
    method: "nodeServerAdapter({ ssg: { include: ['/feature-tests/render-modes/static'] } }) + staticFile middleware; other route SSR per request",
  },
  reactivity: {
    claimedLabel: 'first-party',
    method: 'useSignal passed directly into JSX ({count}) vs. reading count.value in render (contrast)',
  },
  'bundle-analysis': {
    claimedLabel: 'third-party',
    method: 'rollup-plugin-visualizer added to vite.config.ts when ANALYZE=1; `ANALYZE=1 vite build --outDir <tmp>`',
  },
  'third-party-scripts': {
    claimedLabel: 'first-party',
    method: "@qwik.dev/partytown: partytownSnippet() in route head (as QwikPartytown does), partytownVite copies lib, script type=\"text/partytown\"",
  },
  'multi-host-deployment': {
    claimedLabel: 'first-party',
    method: 'Qwik City adapters in adapters/*: node-server (express), vercel-edge, netlify-edge; built in an isolated copy',
  },
}
