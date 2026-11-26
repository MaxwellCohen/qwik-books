import { expect, test } from '@playwright/test'
import { evidence } from './helpers'

test('<Link> prefetches target route data when scrolled into view, before click', async ({ page }) => {
  const target = '/feature-tests/route-prefetching/target'
  const log: { url: string; t: number }[] = []
  page.on('request', (r) => log.push({ url: r.url(), t: Date.now() }))

  await page.goto('/feature-tests/route-prefetching', { waitUntil: 'networkidle' })
  const before = log.filter((r) => r.url.includes(`${target}/q-data.json`))
  expect(before, 'no prefetch while link is offscreen').toEqual([])

  const prefetched = page.waitForRequest((r) => r.url().includes(`${target}/q-data.json`))
  await page.locator('#prefetch-link').scrollIntoViewIfNeeded()
  const req = await prefetched
  const prefetchAt = Date.now()
  evidence(`scroll into view -> GET ${new URL(req.url()).pathname} before any click`)

  await page.waitForTimeout(300)
  const clickAt = Date.now()
  await page.locator('#prefetch-link').click()
  await expect(page.locator('#target-data')).toHaveText('prefetch-target-loader-data')
  expect(page.url()).toContain(target)
  const dataReqs = log.filter((r) => r.url.includes(`${target}/q-data.json`))
  expect(dataReqs[0].t).toBeLessThan(clickAt)
  expect(prefetchAt).toBeLessThan(clickAt)
  evidence(`q-data.json requests: ${dataReqs.length} (first before click); SPA nav rendered loader data`)
})
