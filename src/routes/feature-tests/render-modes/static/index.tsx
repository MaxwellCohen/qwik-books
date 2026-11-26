import { component$ } from '@builder.io/qwik'
import { routeLoader$, type DocumentHead } from '@builder.io/qwik-city'

export const useStamp = routeLoader$(() => `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`)

export default component$(() => {
  const stamp = useStamp()
  return (
    <div class="px-6 py-5">
      <h1 class="mb-4 text-xl font-semibold">render-modes: static</h1>
      <p>Rendered at: <code id="stamp">{stamp.value}</code></p>
    </div>
  )
})

export const head: DocumentHead = { title: 'render-modes static · Feature tests' }
