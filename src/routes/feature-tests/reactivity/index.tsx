import { component$, useSignal } from '@builder.io/qwik'
import type { DocumentHead } from '@builder.io/qwik-city'

declare global {
  interface Window {
    __ftRenders?: Record<string, number>
  }
}

function countRender(name: string) {
  if (typeof window === 'undefined') return 1
  const r = (window.__ftRenders ??= {})
  return (r[name] = (r[name] ?? 0) + 1)
}

// Fine-grained: the signal object is passed to JSX, so Qwik updates the text node directly.
const FineGrained = component$(() => {
  const count = useSignal(0)
  countRender('fine')
  return (
    <div class="mb-3">
      <button id="fine-button" class="rounded border px-3 py-1" onClick$={() => count.value++}>
        increment
      </button>{' '}
      count: <span id="fine-count">{count}</span>
    </div>
  )
})

// Control: reading .value in the component body (not inside JSX, which the optimizer would turn
// into a derived signal) subscribes the whole component, so it re-runs on each change.
const Coarse = component$(() => {
  const count = useSignal(0)
  const label = `${count.value}`
  countRender('coarse')
  return (
    <div>
      <button id="coarse-button" class="rounded border px-3 py-1" onClick$={() => count.value++}>
        increment
      </button>{' '}
      count: <span id="coarse-count">{label}</span>
    </div>
  )
})

export default component$(() => (
  <div class="px-6 py-5">
    <h1 class="mb-4 text-xl font-semibold">reactivity</h1>
    <p class="mb-3">Client render counts are stored in window.__ftRenders (server render is the 1st render).</p>
    <FineGrained />
    <Coarse />
  </div>
))

export const head: DocumentHead = { title: 'reactivity · Feature tests' }
