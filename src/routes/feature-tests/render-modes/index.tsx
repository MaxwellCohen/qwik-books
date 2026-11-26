import { component$ } from '@builder.io/qwik'
import type { DocumentHead } from '@builder.io/qwik-city'

export default component$(() => (
  <div class="px-6 py-5">
    <h1 class="mb-4 text-xl font-semibold">render-modes</h1>
    <ul class="list-disc pl-6">
      <li><a class="underline" href="/feature-tests/render-modes/static">static</a> — prerendered at build time (adapter ssg.include)</li>
      <li><a class="underline" href="/feature-tests/render-modes/ssr">ssr</a> — server-rendered on every request</li>
    </ul>
  </div>
))

export const head: DocumentHead = { title: 'render-modes · Feature tests' }
