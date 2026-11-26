import { component$ } from '@builder.io/qwik'
import { routeLoader$, type DocumentHead } from '@builder.io/qwik-city'

export const useTargetData = routeLoader$(() => ({ message: 'prefetch-target-loader-data' }))

export default component$(() => {
  const data = useTargetData()
  return (
    <div class="px-6 py-5">
      <h1 class="mb-4 text-xl font-semibold" id="target-heading">Prefetch target</h1>
      <p id="target-data">{data.value.message}</p>
    </div>
  )
})

export const head: DocumentHead = { title: 'prefetch target · Feature tests' }
