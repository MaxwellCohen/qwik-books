import { getEnv } from '@/lib/runtime-env'

export const CATALOG_CACHE_REVALIDATE_SECONDS = 3600

const TTL_MS = CATALOG_CACHE_REVALIDATE_SECONDS * 1000

type Entry<T> = { expiresAt: number; value: T }
type CatalogKv = {
  get(key: string, type: 'json'): Promise<unknown>
  put(key: string, value: string, options?: { expirationTtl?: number }): Promise<void>
}

const memory = new Map<string, Entry<unknown>>()
const inflight = new Map<string, Promise<unknown>>()

function isVercel() {
  return Boolean(getEnv('VERCEL')) && !getEnv('CLOUDFLARE')
}

function isNetlify() {
  return (
    Boolean(getEnv('NETLIFY') || getEnv('NETLIFY_BLOBS_CONTEXT')) &&
    !getEnv('CLOUDFLARE') &&
    !getEnv('VERCEL')
  )
}

/** Whether this request runs on Vercel (picks the document Cache-Control in routes/layout.tsx). */
export const isVercelHost = isVercel

function memoryGet<T>(key: string): T | undefined {
  const hit = memory.get(key) as Entry<T> | undefined
  if (hit && hit.expiresAt > Date.now()) return hit.value
}

let catalogKv: CatalogKv | undefined

/** Bind Workers KV so catalog queries persist across isolates. */
export function bindCatalogCache(kv: CatalogKv | undefined) {
  if (kv) catalogKv = kv
}

async function platformGet<T>(key: string): Promise<T | undefined> {
  try {
    if (catalogKv) {
      const value = await catalogKv.get(key, 'json')
      if (value != null) return value as T
      return
    }
  } catch {
    // KV optional / not bound.
  }

  try {
    if (isVercel()) {
      const { getCache } = await import('@vercel/functions')
      const value = await getCache({ namespace: 'catalog' }).get(key)
      if (value != null) return value as T
      return
    }
  } catch {
    // Optional dependency / not available at the edge.
  }

  try {
    if (isNetlify()) {
      const { getStore } = await import('@netlify/blobs')
      const stored = (await getStore('catalog-cache').get(key, { type: 'json' })) as Entry<T> | null
      if (stored && stored.expiresAt > Date.now()) return stored.value
    }
  } catch {
    // Optional dependency / not available at the edge.
  }
}

async function platformSet<T>(key: string, value: T): Promise<void> {
  try {
    if (catalogKv) {
      await catalogKv.put(key, JSON.stringify(value), {
        expirationTtl: CATALOG_CACHE_REVALIDATE_SECONDS,
      })
      return
    }
  } catch {
    // KV optional / not bound.
  }

  try {
    if (isVercel()) {
      const { getCache } = await import('@vercel/functions')
      await getCache({ namespace: 'catalog' }).set(key, value, {
        tags: ['catalog'],
        ttl: CATALOG_CACHE_REVALIDATE_SECONDS,
      })
      return
    }
  } catch {
    // Optional dependency / not available at the edge.
  }

  try {
    if (isNetlify()) {
      const { getStore } = await import('@netlify/blobs')
      await getStore('catalog-cache').setJSON(key, { expiresAt: Date.now() + TTL_MS, value })
    }
  } catch {
    // Optional dependency / not available at the edge.
  }
}

export async function cacheLifeHours<T>(key: string, load: () => Promise<T>): Promise<T> {
  const cached = memoryGet<T>(key)
  if (cached !== undefined) return cached

  const pending = inflight.get(key)
  if (pending) return pending as Promise<T>

  const next = (async () => {
    const remote = await platformGet<T>(key)
    if (remote !== undefined) {
      memory.set(key, { expiresAt: Date.now() + TTL_MS, value: remote })
      return remote
    }
    const value = await load()
    memory.set(key, { expiresAt: Date.now() + TTL_MS, value })
    await platformSet(key, value)
    return value
  })().finally(() => {
    inflight.delete(key)
  })

  inflight.set(key, next)
  return next
}

export function withTtlCache<Args extends unknown[], Result>(
  name: string,
  fn: (...args: Args) => Promise<Result>,
): (...args: Args) => Promise<Result> {
  return (...args: Args) => cacheLifeHours(`${name}:${JSON.stringify(args)}`, () => fn(...args))
}
