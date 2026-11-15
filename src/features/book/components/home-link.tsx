import { component$ } from '@builder.io/qwik'
import { Link } from '@builder.io/qwik-city'
import { BookMark } from '@/components/book-mark'
import { useCatalogParams } from '@/hooks/use-catalog-params'
import { buildHref } from '@/lib/url-state'

export const HomeLink = component$(() => {
  const { current } = useCatalogParams()
  const href = buildHref({ delay: current.delay })

  return (
    <Link
      aria-label="Qwik Books home"
      class="inline-flex items-center gap-2 text-base font-semibold tracking-tight"
      href={href}
    >
      <BookMark class="text-action size-5" />
      Qwik Books
    </Link>
  )
})
