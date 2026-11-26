import { expect, test } from '@playwright/test'
import { evidence } from './helpers'

test('cacheControl() sets headers and the response is reused within max-age', async ({ page, request }) => {
  for (const path of ['/feature-tests/caching', '/feature-tests/caching/data']) {
    const cc = (await request.get(path)).headers()['cache-control']
    expect(cc).toContain('public')
    expect(cc).toContain('max-age=4')
    expect(cc).toContain('s-maxage=60')
    expect(cc).toContain('stale-while-revalidate=120')
    evidence(`${path} Cache-Control: ${cc}`)
  }

  // Browser HTTP cache reuse: the endpoint increments a server counter on every hit.
  await page.goto('/feature-tests/caching')
  const get = () => page.evaluate(() => fetch('/feature-tests/caching/data').then((r) => r.json()))
  const a = await get()
  const b = await get()
  expect(b.counter).toBe(a.counter)
  expect(b.ts).toBe(a.ts)
  // After max-age (4s), stale-while-revalidate=120 lets the browser answer with the stale copy
  // while it revalidates in the background; the next request sees the fresh value.
  await page.waitForTimeout(5_000)
  const stale = await get()
  expect(stale.counter).toBe(a.counter)
  await expect.poll(async () => (await get()).counter, { timeout: 10_000 }).toBeGreaterThan(a.counter)
  const fresh = await get()
  evidence(
    `browser cache reuse within TTL (counter ${a.counter} == ${b.counter}); after max-age: stale ${stale.counter} served (SWR), ` +
      `background revalidation -> fresh counter ${fresh.counter}`,
  )
})
