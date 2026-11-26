import { expect, test } from '@playwright/test'
import { evidence } from './helpers'

test('signal update changes only the bound text; component does not re-run', async ({ page }) => {
  await page.goto('/feature-tests/reactivity', { waitUntil: 'networkidle' })
  // Server render = render #1. Client renders are counted in window.__ftRenders.
  for (let i = 1; i <= 3; i++) {
    await page.locator('#fine-button').click()
    await expect(page.locator('#fine-count')).toHaveText(String(i))
  }
  const renders = await page.evaluate(() => window.__ftRenders ?? {})
  expect(renders.fine ?? 0).toBe(0)
  evidence('{count} binding: text 0->3 after 3 clicks, component body ran 0 times on client (1 total, on server)')

  await page.locator('#coarse-button').click()
  await expect(page.locator('#coarse-count')).toHaveText('1')
  const after = await page.evaluate(() => window.__ftRenders ?? {})
  // Control: proves the render counter does detect re-runs when a component subscribes in its body.
  expect(after.coarse ?? 0).toBeGreaterThanOrEqual(1)
  expect(after.fine ?? 0).toBe(0)
  evidence(`control: component reading count.value in its body re-ran ${after.coarse}x on client, so the counter works`)
})

declare global {
  interface Window {
    __ftRenders?: Record<string, number>
  }
}
