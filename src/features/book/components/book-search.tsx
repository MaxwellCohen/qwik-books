import { $, component$, isBrowser, useId, useSignal, useTask$ } from '@builder.io/qwik'
import { useLocation } from '@builder.io/qwik-city'
import { SearchIcon, SpinnerIcon, XIcon } from '@/components/icons'
import { IconButton } from '@/components/ui/icon-button'
import { inputClasses } from '@/components/ui/input'
import { replaceCatalog, useCatalogParams } from '@/hooks/use-catalog-params'
import { withFilters } from '@/lib/url-state'

const DEBOUNCE_MS = 220

export const BookSearch = component$(() => {
  const { current, nav, pending } = useCatalogParams()
  const inputRef = useSignal<HTMLInputElement>()
  const timer = useSignal<number>()
  const inputId = useId()
  const loc = useLocation()

  // Keep the box in sync with the URL (e.g. "Clear all filters") unless the user is typing.
  useTask$(({ track }) => {
    const search = track(() => loc.url.searchParams.get('search')) ?? ''
    const input = inputRef.value
    if (isBrowser && input && document.activeElement !== input) input.value = search
  })

  const navigate = $((value: string) => {
    const query = value.trim()
    return replaceCatalog(nav, withFilters(current, { search: query || undefined }))
  })

  return (
    <form
      aria-busy={pending}
      class="relative flex-1"
      data-filtering={pending ? '' : undefined}
      onSubmit$={() => {
        window.clearTimeout(timer.value)
        return navigate(inputRef.value?.value ?? '')
      }}
      preventdefault:submit
      role="search"
    >
      <label class="sr-only" for={inputId}>
        Search books
      </label>
      <span
        aria-hidden="true"
        class="text-muted pointer-events-none absolute top-1/2 left-3.5 flex size-4 -translate-y-1/2 items-center justify-center"
      >
        {pending ? <SpinnerIcon class="size-4" /> : <SearchIcon class="size-4" />}
      </span>
      <input
        class={inputClasses('search', 'peer')}
        id={inputId}
        name="search"
        onInput$={(_, el) => {
          window.clearTimeout(timer.value)
          timer.value = window.setTimeout(() => navigate(el.value), DEBOUNCE_MS)
        }}
        placeholder="Search books…"
        ref={inputRef}
        type="search"
        value={current.search ?? ''}
      />
      <IconButton
        class="absolute top-1/2 right-1.5 -translate-y-1/2 peer-placeholder-shown:hidden"
        label="Clear search"
        onClick$={() => {
          window.clearTimeout(timer.value)
          if (inputRef.value) {
            inputRef.value.value = ''
            inputRef.value.focus()
          }
          return navigate('')
        }}
      >
        <XIcon class="size-4" />
      </IconButton>
    </form>
  )
})
