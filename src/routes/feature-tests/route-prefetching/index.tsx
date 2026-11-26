import { component$ } from '@builder.io/qwik'
import { Link, type DocumentHead } from '@builder.io/qwik-city'

export default component$(() => (
  <div class="px-6 py-5">
    <h1 class="mb-4 text-xl font-semibold">route-prefetching</h1>
    <p>Scroll down: the &lt;Link&gt; prefetches its route data when it becomes visible (and again on hover).</p>
    <div style={{ height: '2500px' }} />
    <Link id="prefetch-link" class="text-primary underline" href="/feature-tests/route-prefetching/target">
      Go to target
    </Link>
  </div>
))

export const head: DocumentHead = { title: 'route-prefetching · Feature tests' }
