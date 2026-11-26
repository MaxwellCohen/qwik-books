import { component$ } from '@builder.io/qwik'
import { Link, type DocumentHead } from '@builder.io/qwik-city'
import { FEATURES } from './features'

export default component$(() => (
  <div class="px-6 py-5">
    <h1 class="mb-4 text-xl font-semibold">Feature tests</h1>
    <ul class="list-disc space-y-1 pl-6">
      {FEATURES.map(([id, desc]) => (
        <li key={id}>
          <Link class="text-primary underline" href={`/feature-tests/${id}`} prefetch={false}>
            {id}
          </Link>{' '}
          — {desc}
        </li>
      ))}
    </ul>
  </div>
))

export const head: DocumentHead = { title: 'Feature tests · Qwik Books' }
