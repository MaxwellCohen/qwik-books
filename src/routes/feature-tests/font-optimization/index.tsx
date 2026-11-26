import { component$ } from '@builder.io/qwik'
import type { DocumentHead } from '@builder.io/qwik-city'
// Third-party: Fontsource self-hosts the font files and its CSS sets font-display: swap.
// Preload: no code here. qwikVite automatically adds <link rel="preload" as="font"> for every
// font asset in the build output (opt-out: qwikVite({ disableFontPreload: true })).
import '@fontsource/lora/latin-700.css'

export default component$(() => (
  <div class="px-6 py-5">
    <h1 class="mb-4 text-xl font-semibold">font-optimization</h1>
    <p id="font-target" style={{ fontFamily: "'Lora', serif", fontWeight: 700, fontSize: '28px' }}>
      Lora 700 via Fontsource (self-hosted)
    </p>
  </div>
))

export const head: DocumentHead = { title: 'font-optimization · Feature tests' }
