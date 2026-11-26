import { component$ } from '@builder.io/qwik'
import type { DocumentHead } from '@builder.io/qwik-city'
// Built-in Qwik City image pipeline: the ?jsx suffix returns an optimized <img> component.
import HeroAbove from '@/media/feature-tests/hero.jpg?jsx'
import HeroBelow from '@/media/feature-tests/hero.jpg?jsx'

export default component$(() => (
  <div class="px-6 py-5">
    <h1 class="mb-4 text-xl font-semibold">image-pipeline</h1>
    <HeroAbove id="img-above" alt="Gradient (above the fold)" loading="eager" style={{ maxWidth: '100%', height: 'auto' }} />
    <div style={{ height: '2500px' }} />
    <HeroBelow id="img-below" alt="Gradient (offscreen)" style={{ maxWidth: '100%', height: 'auto' }} />
  </div>
))

export const head: DocumentHead = { title: 'image-pipeline · Feature tests' }
