import { component$ } from '@builder.io/qwik'
import type { DocumentHead } from '@builder.io/qwik-city'
import { partytownSnippet } from '@qwik.dev/partytown/integration'

export default component$(() => (
  <div class="px-6 py-5">
    <h1 class="mb-4 text-xl font-semibold" id="tps-heading">third-party-scripts</h1>
    <p>A stand-in third-party script is loaded with type="text/partytown" and runs in a web worker.</p>
    <script type="text/partytown" src="/feature-tests/third-party.js" />
  </div>
))

// What `qwik add partytown` generates (QwikPartytown): the Partytown snippet in <head>.
export const head: DocumentHead = {
  title: 'third-party-scripts · Feature tests',
  scripts: [{ key: 'partytown', props: { dangerouslySetInnerHTML: partytownSnippet({ forward: [] }) } }],
}
