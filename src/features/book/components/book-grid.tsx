import { EmptyState } from '@/components/ui/empty-state'
import { PRIORITY_COVER_COUNT } from '@/features/book/book-constants'
import type { BookSummary } from '@/features/book/book-types'
import { BookCard } from '@/features/book/components/book-card'
import type { SearchParams } from '@/lib/url-state'

const gridClass = 'grid grid-cols-3 gap-4 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-7'

export function BookGrid({ books, searchParams }: { books: BookSummary[]; searchParams: SearchParams }) {
  if (books.length === 0) {
    return (
      <EmptyState
        body="Nothing matched these filters. Try widening the year range or clearing the search."
        title="No books found"
      />
    )
  }

  return (
    <div class={gridClass}>
      {books.map((book, index) => (
        <BookCard book={book} key={book.id} priority={index < PRIORITY_COVER_COUNT} searchParams={searchParams} />
      ))}
    </div>
  )
}
