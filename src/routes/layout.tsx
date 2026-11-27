import { Slot, component$ } from '@builder.io/qwik'
import type { RequestHandler } from '@builder.io/qwik-city'
import { MobileBookSidebarProvider, MobileBookSidebarTrigger } from '@/components/mobile-book-sidebar'
import { isVercelHost } from '@/lib/catalog-cache'
import { BookSearch } from '@/features/book/components/book-search'
import { BookSidebar } from '@/features/book/components/book-sidebar'

// Matches next-books per host: Vercel revalidates every request, the other hosts don't store HTML.
// (cacheControl() drops `maxAge: 0`, so `noCache` carries the revalidate-every-time meaning.)
export const onGet: RequestHandler = async ({ cacheControl }) => {
  cacheControl(
    isVercelHost() ? { public: true, noCache: true } : { private: true, noCache: true, noStore: true },
  )
}

export default component$(() => {
  return (
    <MobileBookSidebarProvider>
      <div class="group flex min-h-dvh">
        <aside
          class="border-divider bg-surface dark:border-divider-dark dark:bg-surface-dark sticky top-0 hidden h-dvh w-72 shrink-0 flex-col border-r px-5 py-5 md:flex"
          style={{ viewTransitionName: 'sidebar' }}
        >
          <BookSidebar idPrefix="desktop" />
        </aside>

        <div class="flex min-w-0 flex-1 flex-col">
          <header
            class="border-divider bg-surface/80 dark:border-divider-dark dark:bg-surface-dark/80 sticky top-0 z-20 flex items-center gap-2 border-b px-4 py-3 backdrop-blur-md backdrop-saturate-150 sm:gap-3 sm:px-6"
            style={{ viewTransitionName: 'site-header' }}
          >
            <MobileBookSidebarTrigger />
            <BookSearch />
          </header>

          <main class="flex min-w-0 flex-1 flex-col">
            <Slot />
          </main>
        </div>
      </div>
    </MobileBookSidebarProvider>
  )
})
