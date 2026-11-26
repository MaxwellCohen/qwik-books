import { component$ } from '@builder.io/qwik'
import type { DocumentHead } from '@builder.io/qwik-city'

export default component$(() => (
  <div class="px-6 py-5">
    <h1 class="mb-4 text-xl font-semibold">bundle-analysis</h1>
    <p>
      Build-time only. Qwik documents no analyzer, so this repo uses the third-party
      <code> rollup-plugin-visualizer</code>, enabled with <code>ANALYZE=1</code> in vite.config.ts:
    </p>
    <pre class="mt-2">ANALYZE=1 vite build --outDir &lt;dir&gt;  →  &lt;dir&gt;/stats.html</pre>
  </div>
))

export const head: DocumentHead = { title: 'bundle-analysis · Feature tests' }
