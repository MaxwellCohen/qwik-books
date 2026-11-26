export const FEATURES = [
  ['css-inlining', 'Route CSS inlined automatically (<20KB) into a <style> tag'],
  ['font-optimization', 'Fontsource self-hosting; qwikVite auto font preload'],
  ['image-pipeline', 'Built-in ?jsx image import (vite-imagetools)'],
  ['caching', 'cacheControl() in onGet'],
  ['route-prefetching', '<Link> prefetch on visible/hover'],
  ['islands', 'Resumability: static component code never downloaded'],
  ['render-modes', 'SSG (static adapter option) + SSR per request'],
  ['reactivity', 'Signal bound to text without re-running the component'],
  ['bundle-analysis', 'rollup-plugin-visualizer (third-party)'],
  ['third-party-scripts', 'Partytown (@qwik.dev/partytown)'],
  ['multi-host-deployment', 'Qwik City adapters: express, vercel-edge, netlify-edge'],
] as const
