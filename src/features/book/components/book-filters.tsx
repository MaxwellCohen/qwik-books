import { $, component$ } from '@builder.io/qwik'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Range } from '@/components/ui/range'
import { Select } from '@/components/ui/select'
import {
  LANGUAGES,
  LISTS,
  MAX_PAGES,
  MAX_RATING,
  MAX_YEAR,
  MIN_PAGES,
  MIN_RATING,
  MIN_YEAR,
  PAGE_FILTER_VALUES,
  RATING_FILTER_VALUES,
  YEAR_FILTER_VALUES,
} from '@/features/book/book-constants'
import { replaceCatalog, useCatalogParams } from '@/hooks/use-catalog-params'
import { withFilters, type SearchParams } from '@/lib/url-state'

const YEAR_READOUTS = YEAR_FILTER_VALUES.map((value) => (value === MAX_YEAR ? 'Any year' : String(value)))
const RATING_READOUTS = RATING_FILTER_VALUES.map((value) => (value === MIN_RATING ? 'Any rating' : `${value}+`))
const PAGE_READOUTS = PAGE_FILTER_VALUES.map((value) => (value === MAX_PAGES ? 'Any length' : String(value)))

export const BookFilters = component$<{ idPrefix: string }>(({ idPrefix }) => {
  const { current: filters, nav, pending } = useCatalogParams()

  const activeCount = Object.entries(filters).filter(
    ([key, value]) => key !== 'page' && key !== 'delay' && Boolean(value),
  ).length

  const commit = $((patch: Partial<SearchParams>) => replaceCatalog(nav, withFilters(filters, patch)))

  return (
    <div class="flex min-h-0 flex-1 flex-col" data-filtering={pending ? '' : undefined}>
      <div class="min-h-0 flex-1 touch-pan-y [scrollbar-gutter:stable] overflow-x-hidden overflow-y-auto overscroll-contain px-1 pb-6">
        <div class="flex flex-col gap-6">
          <Range
            hint={[String(MIN_YEAR), String(MAX_YEAR)]}
            id={`${idPrefix}-filter-year`}
            label="Published before"
            onValueChange$={(value) => commit({ year: value === MAX_YEAR ? undefined : String(value) })}
            readouts={YEAR_READOUTS}
            value={Number(filters.year ?? MAX_YEAR)}
            values={YEAR_FILTER_VALUES}
          />

          <Range
            hint={['Any', `${MAX_RATING} stars`]}
            id={`${idPrefix}-filter-rating`}
            label="Minimum rating"
            onValueChange$={(value) => commit({ rating: value === MIN_RATING ? undefined : String(value) })}
            readouts={RATING_READOUTS}
            value={Number(filters.rating ?? MIN_RATING)}
            values={RATING_FILTER_VALUES}
          />

          <Range
            hint={[String(MIN_PAGES), String(MAX_PAGES)]}
            id={`${idPrefix}-filter-pages`}
            label="Max pages"
            onValueChange$={(value) => commit({ pages: value === MAX_PAGES ? undefined : String(value) })}
            readouts={PAGE_READOUTS}
            value={Number(filters.pages ?? MAX_PAGES)}
            values={PAGE_FILTER_VALUES}
          />

          <div class="flex flex-col gap-2">
            <label
              class="text-muted text-xs font-semibold tracking-wide uppercase"
              for={`${idPrefix}-filter-language`}
            >
              Language
            </label>
            <Select
              id={`${idPrefix}-filter-language`}
              onChange$={(_, el) => commit({ language: el.value })}
            >
              {LANGUAGES.map((language) => (
                <option
                  key={language.value}
                  selected={(filters.language ?? 'en') === language.value}
                  value={language.value}
                >
                  {language.label}
                </option>
              ))}
            </Select>
          </div>

          <fieldset class="flex flex-col gap-2">
            <legend class="text-muted mb-2 text-xs font-semibold tracking-wide uppercase">Book lists</legend>
            {LISTS.map((list) => (
              <label
                class="hover:bg-card dark:hover:bg-card-dark -mx-2 flex cursor-pointer items-center gap-2.5 rounded-md px-2 py-1.5 text-sm transition-colors"
                key={list.name}
              >
                <Input
                  checked={filters.list === list.slug}
                  onChange$={() => commit({ list: filters.list === list.slug ? undefined : list.slug })}
                  type="checkbox"
                  variant="checkbox"
                />
                {list.name}
              </label>
            ))}
          </fieldset>
        </div>
      </div>

      {activeCount > 0 ? (
        <div class="border-divider dark:border-divider-dark border-t pt-3">
          <Button
            class="w-full"
            onClick$={() => replaceCatalog(nav, filters.delay ? { delay: filters.delay } : {})}
            variant="secondary"
          >
            Clear all filters
          </Button>
        </div>
      ) : null}
    </div>
  )
})
