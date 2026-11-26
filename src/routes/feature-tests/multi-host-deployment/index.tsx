import { component$ } from '@builder.io/qwik'
import type { DocumentHead } from '@builder.io/qwik-city'

export default component$(() => (
  <div class="px-6 py-5">
    <h1 class="mb-4 text-xl font-semibold">multi-host-deployment</h1>
    <p>Build-time only. The same app builds with Qwik City adapters in <code>adapters/*</code>:</p>
    <ul class="list-disc pl-6">
      <li>express (node-server adapter) → <code>server/entry.express.js</code></li>
      <li>vercel-edge → <code>.vercel/output/functions/_qwik-city.func</code></li>
      <li>netlify-edge → <code>.netlify/edge-functions/entry.netlify-edge</code></li>
    </ul>
  </div>
))

export const head: DocumentHead = { title: 'multi-host-deployment · Feature tests' }
