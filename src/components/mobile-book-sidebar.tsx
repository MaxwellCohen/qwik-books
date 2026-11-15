import { Slot, component$, createContextId, useContext, useContextProvider, type Signal, useSignal } from '@builder.io/qwik'
import { SlidersHorizontalIcon, XIcon } from '@/components/icons'
import { Button } from '@/components/ui/button'
import { BookSidebar } from '@/features/book/components/book-sidebar'

export const MobileSidebarContext = createContextId<Signal<boolean>>('qwik-books.mobile-sidebar')

export const MobileBookSidebarProvider = component$(() => {
  const open = useSignal(false)
  useContextProvider(MobileSidebarContext, open)

  return (
    <>
      <Slot />
      <div
        class={open.value ? 'md:hidden' : 'hidden'}
        document:onKeyDown$={(event) => {
          if (event.key === 'Escape') open.value = false
        }}
      >
        <div
          class="fixed inset-0 z-40 bg-black/45 backdrop-blur-[2px] md:hidden"
          onClick$={() => {
            open.value = false
          }}
          style={{ viewTransitionName: 'mobile-sidebar-backdrop' }}
        />
        <aside
          aria-label="Book filters"
          aria-modal="true"
          class="border-divider bg-surface dark:border-divider-dark dark:bg-surface-dark fixed inset-y-0 left-0 z-50 flex w-[min(20rem,calc(100vw-3rem))] max-w-full touch-pan-y flex-col overflow-x-hidden border-r pt-[max(1rem,env(safe-area-inset-top))] pr-4 pb-[max(1rem,env(safe-area-inset-bottom))] pl-[max(1rem,env(safe-area-inset-left))] shadow-2xl outline-none md:hidden"
          onClick$={(event) => {
            if ((event.target as HTMLElement).closest('a[href]')) open.value = false
          }}
          role="dialog"
          style={{ viewTransitionName: 'mobile-sidebar' }}
        >
          <button
            aria-label="Close filters"
            class="text-muted hover:bg-card focus-visible:ring-accent dark:hover:bg-card-dark absolute top-[max(0.75rem,env(safe-area-inset-top))] right-3 grid size-9 place-items-center rounded-md hover:text-black focus-visible:ring-2 focus-visible:outline-none dark:hover:text-white"
            onClick$={() => {
              open.value = false
            }}
            type="button"
          >
            <XIcon class="size-5" />
          </button>
          <BookSidebar idPrefix="mobile" mobile />
        </aside>
      </div>
    </>
  )
})

export const MobileBookSidebarTrigger = component$(() => {
  const open = useContext(MobileSidebarContext)

  return (
    <Button
      aria-label="Open filters"
      aria-expanded={open.value}
      class="md:hidden"
      onClick$={() => {
        open.value = true
      }}
      size="icon"
      variant="ghost"
    >
      <SlidersHorizontalIcon class="size-4" />
    </Button>
  )
})
