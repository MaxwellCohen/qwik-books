import { component$ } from '@builder.io/qwik'
import { GitHubIcon } from '@/components/icons'
import { ThemeToggle } from '@/components/theme/theme-toggle'
import { ApiDelay } from '@/features/book/components/api-delay'
import { BookFilters } from '@/features/book/components/book-filters'
import { CatalogSize } from '@/features/book/components/catalog-size'
import { HomeLink } from '@/features/book/components/home-link'

export const BookSidebar = component$<{ idPrefix: string; mobile?: boolean }>(({ idPrefix, mobile = false }) => {
  return (
    <>
      <div class="flex items-center justify-between gap-2">
        <HomeLink />
      </div>
      <div class="border-divider dark:border-divider-dark mt-6 border-b pb-5">
        <CatalogSize />
      </div>
      <div class="mt-5 mb-4">
        <ApiDelay idPrefix={idPrefix} />
      </div>
      <p class="text-muted mb-4 text-xs font-semibold tracking-wide uppercase">Filters</p>
      <BookFilters idPrefix={idPrefix} />
      {mobile ? null : (
        <div class="border-divider dark:border-divider-dark mt-4 flex items-center justify-between gap-2 border-t pt-4">
          <ThemeToggle variant="inline" />
          <a
            aria-label="View source on GitHub"
            class="text-muted rounded-full p-1.5 transition-colors hover:text-black dark:hover:text-white"
            href="https://github.com/MaxwellCohen/qwik-books"
            rel="noopener noreferrer"
            target="_blank"
          >
            <GitHubIcon class="size-4" />
          </a>
        </div>
      )}
    </>
  )
})
