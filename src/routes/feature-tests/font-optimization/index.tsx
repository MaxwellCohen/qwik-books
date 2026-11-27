import { component$ } from '@builder.io/qwik'
import type { DocumentHead } from '@builder.io/qwik-city'
// Third-party: Fontsource self-hosts the font files and its CSS sets font-display: swap.
// Preload: qwikVite's automatic font preload is off in vite.config.ts (it preloaded every font
// in the build on every page), so this route adds its own through Qwik City's head `links`.
import '@fontsource/lora/latin-700.css'
import loraUrl from '@fontsource/lora/files/lora-latin-700-normal.woff2?url'

export default component$(() => (
  <div class="px-6 py-5">
    <h1 class="mb-4 text-xl font-semibold">font-optimization</h1>
    <p id="font-target" style={{ fontFamily: "'Lora', serif", fontWeight: 700, fontSize: '28px' }}>
      Lora 700 via Fontsource (self-hosted)
    </p>
  </div>
))

export const head: DocumentHead = {
  title: 'font-optimization · Feature tests',
  links: [{ rel: 'preload', href: loraUrl, as: 'font', type: 'font/woff2', crossorigin: '' }],
}
