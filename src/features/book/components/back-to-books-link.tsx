import { Link } from '@builder.io/qwik-city'
import { ArrowLeftIcon } from '@/components/icons'
import { useCatalogParams } from '@/hooks/use-catalog-params'
import { buildHref } from '@/lib/url-state'
import { cn } from '@/lib/utils'
import { component$ } from '@builder.io/qwik'

const linkClass =
  'text-muted hover:bg-card dark:hover:bg-card-dark -ml-1.5 inline-flex w-fit items-center gap-2 rounded-full px-3 py-1.5 text-sm font-medium transition-colors hover:text-black dark:hover:text-white'

// The detail URL carries the catalog query string, so linking back to `/?<same query>` restores the list.
export const BackToBooksLink = component$<{ class?: string }>((props) => {
  const { current } = useCatalogParams()

  return (
    <Link class={cn(linkClass, props.class)} href={buildHref(current)}>
      <ArrowLeftIcon class="size-4" />
      Back to books
    </Link>
  )
})
