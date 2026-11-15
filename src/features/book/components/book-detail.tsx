import type { JSXChildren } from '@builder.io/qwik'
import { BookOpenIcon, Building2Icon, CalendarDaysIcon, GlobeIcon, HashIcon } from '@/components/icons'
import { StarRating } from '@/components/ui/star-rating'
import type { BookDetails } from '@/features/book/book-types'
import { formatCount, getLanguageLabel } from '@/features/book/book-utils'
import { BookCover } from '@/features/book/components/book-cover'
import { BookNotFound } from '@/features/book/components/book-not-found'

const DETAIL_SIZES = '(min-width: 768px) 18rem, 60vw'

export function BookDetail({ book }: { book: BookDetails | null }) {
  if (!book) return <BookNotFound />

  const rating = Number(book.average_rating)
  const hasRating = book.average_rating !== null && !Number.isNaN(rating)

  return (
    <article class="flex flex-col gap-8 md:flex-row md:gap-10">
      <div class="mx-auto w-40 shrink-0 sm:w-48 md:mx-0 md:w-72">
        <BookCover
          class="shadow-soft ring-divider/70 dark:ring-divider-dark/70 ring-1"
          priority
          sizes={DETAIL_SIZES}
          src={book.image_url}
          thumbhash={book.thumbhash}
          title={book.title}
        />
      </div>

      <div class="min-w-0 flex-1">
        <h1>{book.title}</h1>
        {book.authors.length > 0 ? (
          <p class="text-muted mt-2 text-base sm:text-lg">{book.authors.join(', ')}</p>
        ) : null}

        {hasRating ? (
          <div class="mt-4 flex flex-wrap items-center gap-x-3 gap-y-1">
            <StarRating rating={rating} />
            <span class="text-sm font-semibold tabular-nums">{rating.toFixed(1)}</span>
            {book.ratings_count ? (
              <span class="text-muted text-sm tabular-nums">{formatCount(book.ratings_count)} ratings</span>
            ) : null}
          </div>
        ) : null}

        {book.description ? (
          <p class="text-muted mt-6 max-w-prose text-sm leading-7">{book.description}</p>
        ) : null}

        <dl class="border-divider dark:border-divider-dark mt-8 grid grid-cols-1 gap-x-8 gap-y-4 border-t pt-6 sm:grid-cols-2">
          <Fact icon={<BookOpenIcon class="size-4" />} label="Pages">
            {book.num_pages ? book.num_pages.toLocaleString() : 'Unknown'}
          </Fact>
          <Fact icon={<GlobeIcon class="size-4" />} label="Language">
            {getLanguageLabel(book.language_code)}
          </Fact>
          <Fact icon={<CalendarDaysIcon class="size-4" />} label="Published">
            {book.publication_year ?? 'Unknown'}
          </Fact>
          <Fact icon={<Building2Icon class="size-4" />} label="Publisher">
            {book.publisher ?? 'Unknown'}
          </Fact>
          <Fact icon={<HashIcon class="size-4" />} label="ISBN">
            <span class="font-mono text-xs">{book.isbn ?? 'None'}</span>
          </Fact>
        </dl>
      </div>
    </article>
  )
}

function Fact({ children, icon, label }: { children: JSXChildren; icon: JSXChildren; label: string }) {
  return (
    <div class="flex items-start gap-3">
      <span class="text-muted mt-0.5 shrink-0">{icon}</span>
      <div class="min-w-0">
        <dt class="text-muted text-xs font-semibold tracking-wide uppercase">{label}</dt>
        <dd class="mt-0.5 truncate text-sm">{children}</dd>
      </div>
    </div>
  )
}
