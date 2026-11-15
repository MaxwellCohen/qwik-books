import { useLocation, useNavigate } from '@builder.io/qwik-city'
import { cleanSearch } from '@/lib/search-schema'
import { buildHref, parseSearchParams, type SearchParams } from '@/lib/url-state'

export function useCatalogParams() {
  const loc = useLocation()
  const nav = useNavigate()
  const current = cleanSearch(parseSearchParams(Object.fromEntries(loc.url.searchParams)))
  return { current, nav, pending: loc.isNavigating }
}

export type Nav = ReturnType<typeof useNavigate>

export function replaceCatalog(nav: Nav, next: SearchParams) {
  return nav(buildHref(cleanSearch(next)), { replaceState: true, scroll: false })
}
