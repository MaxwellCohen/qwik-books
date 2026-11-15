import { MAX_API_DELAY_MS } from '@/lib/url-state'
import { delay } from '@/lib/utils'
import { getEnv } from '@/lib/runtime-env'

export async function waitForApiDelay(requestedMs = 0) {
  const envMs = Number(getEnv('API_DELAY_MS') ?? 0)
  const uiMs = Number.isFinite(requestedMs)
    ? Math.min(MAX_API_DELAY_MS, Math.max(0, requestedMs))
    : 0
  const ms = uiMs > 0 ? uiMs : envMs
  return delay(ms, ms > 0)
}
