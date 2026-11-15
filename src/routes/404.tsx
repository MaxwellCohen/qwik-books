import { component$ } from '@builder.io/qwik'
import { Link, type DocumentHead } from '@builder.io/qwik-city'
import { buttonClasses } from '@/components/ui/button'
import { EmptyState } from '@/components/ui/empty-state'

export default component$(() => (
  <EmptyState body="The page you're looking for doesn't exist." title="Page not found">
    <Link class={buttonClasses({ className: 'mt-1', variant: 'secondary' })} href="/">
      Back to the shelf
    </Link>
  </EmptyState>
))

export const head: DocumentHead = {
  title: 'Not found · Qwik Books',
}
