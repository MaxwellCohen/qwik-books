import { component$ } from '@builder.io/qwik'
import { routeLoader$, type DocumentHead } from '@builder.io/qwik-city'
import { Button } from '@/components/ui/button'
import { ErrorState } from '@/components/ui/error-state'
import type { BookDetails } from '@/features/book/book-types'
import { BackToBooksLink } from '@/features/book/components/back-to-books-link'
import { BookDetail } from '@/features/book/components/book-detail'
import { getApiDelayMs } from '@/lib/url-state'

type BookData = { error: string | null; book: BookDetails | null }

export const useBook = routeLoader$<BookData>(async ({ params, status, url }) => {
  try {
    const { waitForApiDelay } = await import('@/lib/api-delay')
    const { getBookById } = await import('@/features/book/book-queries.server')
    await waitForApiDelay(getApiDelayMs({ delay: url.searchParams.get('delay') ?? undefined }))
    const book = await getBookById(params.id)
    if (!book) status(404)
    return { error: null, book }
  } catch (error) {
    status(500)
    return { error: error instanceof Error ? error.message : 'Unknown error', book: null }
  }
})

export default component$(() => {
  const data = useBook().value

  return (
    <div class="flex flex-1 flex-col px-4 py-5 sm:px-6">
      <BackToBooksLink class="mb-6" />
      {data.error !== null ? (
        <ErrorState body={data.error} title="Can't load this book">
          <Button class="mt-1" onClick$={() => window.location.reload()} size="sm" variant="secondary">
            Try again
          </Button>
        </ErrorState>
      ) : (
        <BookDetail book={data.book} />
      )}
    </div>
  )
})

export const head: DocumentHead = ({ resolveValue }) => {
  const { book } = resolveValue(useBook)
  return { title: `${book?.title ?? 'Book'} · Qwik Books` }
}
