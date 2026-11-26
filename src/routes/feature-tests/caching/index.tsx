import { component$ } from '@builder.io/qwik'
import { routeLoader$, type DocumentHead, type RequestHandler } from '@builder.io/qwik-city'

export const CACHE_MAX_AGE = 4

// First-party HTTP caching: cacheControl() in onGet (overrides the books layout header).
export const onGet: RequestHandler = ({ cacheControl }) => {
  cacheControl({ public: true, maxAge: CACHE_MAX_AGE, sMaxAge: 60, staleWhileRevalidate: 120 })
}

export const useStamp = routeLoader$(() => `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`)

export default component$(() => {
  const stamp = useStamp()
  return (
    <div class="px-6 py-5">
      <h1 class="mb-4 text-xl font-semibold">caching</h1>
      <p>
        Rendered at: <code id="stamp">{stamp.value}</code>
      </p>
      <p>
        JSON endpoint: <a class="underline" href="/feature-tests/caching/data">/feature-tests/caching/data</a>
      </p>
    </div>
  )
})

export const head: DocumentHead = { title: 'caching · Feature tests' }
