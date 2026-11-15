import { Link } from '@builder.io/qwik-city'
import { ChevronLeftIcon, ChevronRightIcon } from '@/components/icons'
import { LinkStatus } from '@/components/ui/link-status'
import { buildHref, getCurrentPage, getTotalPages, withPage, type SearchParams } from '@/lib/url-state'
import { cn } from '@/lib/utils'

const stepClass =
  'text-muted hover:bg-card dark:hover:bg-card-dark focus-visible:ring-action/40 inline-flex h-8 items-center gap-1.5 rounded-full px-3 text-sm font-medium transition-colors hover:text-black focus-visible:ring-2 focus-visible:outline-none dark:hover:text-white'

export function BookPagination({
  searchParams,
  totalResults,
}: {
  searchParams: SearchParams
  totalResults: number
}) {
  const totalPages = getTotalPages(totalResults)
  const currentPage = getCurrentPage(searchParams, totalPages)
  const hasPrevious = currentPage > 1
  const hasNext = currentPage < totalPages

  return (
    <nav aria-label="Pagination" class="flex items-center justify-between gap-4">
      {hasPrevious ? (
        <Link
          aria-label="Previous page"
          class={stepClass}
          href={buildHref(withPage(searchParams, currentPage - 1))}
        >
          <LinkStatus>
            <ChevronLeftIcon class="size-4" />
            Previous
          </LinkStatus>
        </Link>
      ) : (
        <span aria-disabled="true" class={cn(stepClass, 'pointer-events-none opacity-40')}>
          <ChevronLeftIcon class="size-4" />
          Previous
        </span>
      )}

      <p class="text-muted flex items-center gap-2 text-xs tabular-nums sm:text-sm">
        <span class="hidden sm:inline">
          <span class="font-medium text-black dark:text-white">{totalResults.toLocaleString()}</span> books
        </span>
        <span aria-hidden="true" class="bg-divider dark:bg-divider-dark hidden h-3 w-px sm:block" />
        <span>
          Page {currentPage.toLocaleString()} of {totalPages.toLocaleString()}
        </span>
      </p>

      {hasNext ? (
        <Link
          aria-label="Next page"
          class={stepClass}
          href={buildHref(withPage(searchParams, currentPage + 1))}
        >
          <LinkStatus hint="start">
            Next
            <ChevronRightIcon class="size-4" />
          </LinkStatus>
        </Link>
      ) : (
        <span aria-disabled="true" class={cn(stepClass, 'pointer-events-none opacity-40')}>
          Next
          <ChevronRightIcon class="size-4" />
        </span>
      )}
    </nav>
  )
}
