import { component$, useSignal } from '@builder.io/qwik'
import type { DocumentHead } from '@builder.io/qwik-city'

// Static component: its code (including this marker) should never be downloaded by the browser.
const StaticPanel = component$(() => {
  const marker = ['ft', 'static', 'only', 'marker', '7f3a'].join('_')
  return (
    <section id="static-panel" data-marker={marker} class="mb-4 rounded border p-3">
      Static content computed on the server: {marker.toUpperCase()}
    </section>
  )
})

const Counter = component$(() => {
  const count = useSignal(0)
  return (
    <button id="island-button" class="rounded border px-3 py-1" onClick$={() => count.value++}>
      Clicked <span id="island-count">{count.value}</span> times
    </button>
  )
})

export default component$(() => (
  <div class="px-6 py-5">
    <h1 class="mb-4 text-xl font-semibold">islands (resumability)</h1>
    <StaticPanel />
    <Counter />
  </div>
))

export const head: DocumentHead = { title: 'islands · Feature tests' }
