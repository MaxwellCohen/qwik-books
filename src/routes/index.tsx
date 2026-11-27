import { Resource, component$ } from '@builder.io/qwik'
import { routeLoader$, type DocumentHead } from '@builder.io/qwik-city'
import { Button } from '@/components/ui/button'
import { ErrorState } from '@/components/ui/error-state'
import { toBookFilters, toBookQuery } from '@/features/book/book-utils'
import type { BookSummary } from '@/features/book/book-types'
import { BookGrid } from '@/features/book/components/book-grid'
import { BookPagination } from '@/features/book/components/book-pagination'
import { cleanSearch } from '@/lib/search-schema'
import { getApiDelayMs, parseSearchParams, type SearchParams } from '@/lib/url-state'

type CatalogData =
  | { error: null; books: BookSummary[]; totalResults: number; searchParams: SearchParams }
  | { error: string; books: BookSummary[]; totalResults: number; searchParams: SearchParams }

// Returning a function defers the loader (Qwik City streaming/deferred loaders): the document
// head, sidebar and header stream first, and the grid streams in when the queries resolve.
export const useCatalog = routeLoader$(({ url }) => {
  const searchParams = cleanSearch(parseSearchParams(Object.fromEntries(url.searchParams)))
  return async (): Promise<CatalogData> => {
    try {
      const { waitForApiDelay } = await import('@/lib/api-delay')
      const { getBooksCount, getBooksPage } = await import('@/features/book/book-queries.server')
      const query = toBookQuery(searchParams)
      const delayMs = getApiDelayMs(searchParams)
      const [books, totalResults] = await Promise.all([
        waitForApiDelay(delayMs).then(() => getBooksPage(query)),
        waitForApiDelay(delayMs).then(() => getBooksCount(toBookFilters(query))),
      ])
      return { error: null, books, totalResults, searchParams }
    } catch (error) {
      return {
        error: error instanceof Error ? error.message : 'Unknown error',
        books: [],
        totalResults: 0,
        searchParams,
      }
    }
  }
})

export default component$(() => {
  const catalog = useCatalog()
  return <Resource value={catalog} onResolved={(data) => <Catalog data={data} />} />
})

function Catalog({ data }: { data: CatalogData }) {
  if (data.error !== null) {
    return (
      <ErrorState body={data.error} title="Can't load books">
        <Button class="mt-1" onClick$={() => window.location.reload()} size="sm" variant="secondary">
          Try again
        </Button>
      </ErrorState>
    )
  }

  return (
    <div class="flex min-h-0 flex-1 flex-col">
      <div class="flex-1 px-4 py-5 transition-opacity duration-200 ease-out group-has-[[data-filtering]]:opacity-60 sm:px-6">
        <BookGrid books={data.books} searchParams={data.searchParams} />
      </div>
      <footer class="border-divider dark:border-divider-dark mt-auto border-t px-4 py-3 sm:px-6">
        <BookPagination searchParams={data.searchParams} totalResults={data.totalResults} />
      </footer>
    </div>
  )
}

export const head: DocumentHead = {
  title: 'Books · Qwik Books',
}
