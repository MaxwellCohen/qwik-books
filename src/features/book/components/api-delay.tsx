import { $, component$ } from '@builder.io/qwik'
import { Range } from '@/components/ui/range'
import { replaceCatalog, useCatalogParams } from '@/hooks/use-catalog-params'
import { API_DELAY_VALUES, formatApiDelay, getApiDelayMs } from '@/lib/url-state'

const READOUTS = API_DELAY_VALUES.map(formatApiDelay)

export const ApiDelay = component$<{ idPrefix: string }>(({ idPrefix }) => {
  const { current, nav, pending } = useCatalogParams()

  const commit = $((next: number) => {
    const params = { ...current, delay: next === 0 ? undefined : String(next) }
    return replaceCatalog(nav, params)
  })

  return (
    <div data-filtering={pending ? '' : undefined}>
      <Range
        hint={['Off', '3s']}
        id={`${idPrefix}-api-delay`}
        label="API delay"
        onValueChange$={commit}
        readouts={READOUTS}
        value={getApiDelayMs(current)}
        values={API_DELAY_VALUES}
      />
    </div>
  )
})
