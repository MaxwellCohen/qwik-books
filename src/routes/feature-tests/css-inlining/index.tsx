import { component$, useStyles$ } from '@builder.io/qwik'
import type { DocumentHead } from '@builder.io/qwik-city'
// First-party: useStyles$ with a ?inline CSS string. Qwik SSR emits it as <style q:style> in the HTML
// (no <link rel=stylesheet>). Plain `import './x.css'` is also auto-inlined, but only when the
// merged client CSS is under inlineStylesUpToBytes (20 KB); this app's Tailwind CSS is larger.
import routeCss from './route.css?inline'

export default component$(() => {
  useStyles$(routeCss)
  return (
    <div class="px-6 py-5">
      <h1 class="mb-4 text-xl font-semibold">css-inlining</h1>
      <p class="ft-css-inline-marker" id="css-target">
        This paragraph is styled by route.css, which Qwik inlines as a &lt;style&gt; tag.
      </p>
    </div>
  )
})

export const head: DocumentHead = { title: 'css-inlining · Feature tests' }
