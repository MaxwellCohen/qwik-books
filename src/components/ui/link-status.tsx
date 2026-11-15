import { Slot, component$ } from '@builder.io/qwik'
import { useLocation } from '@builder.io/qwik-city'
import { SpinnerIcon } from '@/components/icons'

export const LinkStatus = component$<{ hint?: 'end' | 'start' }>(({ hint = 'end' }) => {
  const loc = useLocation()
  const slot = (
    <span
      aria-hidden="true"
      class="pending-hint inline-flex size-3.5 shrink-0 items-center justify-center"
      data-pending={loc.isNavigating ? '' : undefined}
    >
      {loc.isNavigating ? <SpinnerIcon class="size-3.5" /> : null}
    </span>
  )

  return (
    <span class="inline-flex items-center gap-2">
      {hint === 'start' ? slot : null}
      <Slot />
      {hint === 'end' ? slot : null}
    </span>
  )
})
