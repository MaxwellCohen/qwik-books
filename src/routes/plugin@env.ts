import type { RequestHandler } from '@builder.io/qwik-city'
import { bindCatalogCache } from '@/lib/catalog-cache'
import { setRuntimeEnv } from '@/lib/runtime-env'

// Edge runtimes may not expose process.env; copy the bindings Qwik City hands us.
export const onRequest: RequestHandler = ({ env, platform }) => {
  setRuntimeEnv((key) => env.get(key))
  bindCatalogCache((platform as { env?: { CATALOG_CACHE?: never } } | undefined)?.env?.CATALOG_CACHE)
}
