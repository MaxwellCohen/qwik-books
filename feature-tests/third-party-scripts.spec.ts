import { expect, test } from '@playwright/test'
import { evidence } from './helpers'

test('Partytown runs the third-party script in a worker without blocking render', async ({ page, request }) => {
  const html = await (await request.get('/feature-tests/third-party-scripts')).text()
  const head = html.split('</head>')[0]
  expect(head).not.toMatch(/<script[^>]*src="\/feature-tests\/third-party\.js"/)
  expect(html).toMatch(/<script[^>]*type="text\/partytown"[^>]*src="\/feature-tests\/third-party\.js"/)
  expect(head).toContain('partytown')
  evidence('third-party.js is only a <script type="text/partytown"> in <body> (never parser-blocking); Partytown snippet inline in <head>')

  const workers: string[] = []
  const thirdPartyReqs: string[] = []
  page.on('worker', (w) => workers.push(w.url()))
  page.on('request', (r) => {
    if (r.url().endsWith('/feature-tests/third-party.js')) thirdPartyReqs.push(r.url())
  })
  await page.goto('/feature-tests/third-party-scripts')
  await expect(page.locator('#tps-heading')).toBeVisible()
  // Side effect proxied from the worker to the main-thread DOM.
  await expect(page.locator('html')).toHaveAttribute('data-ft-third-party', 'ran', { timeout: 20_000 })
  const type = await page.locator('script[src="/feature-tests/third-party.js"]').getAttribute('type')
  expect(type).toBe('text/partytown-x') // Partytown marks scripts it executed
  expect(workers.length).toBeGreaterThan(0)
  // The script's window global lives in the worker sandbox, not on the main window.
  const mainGlobal = await page.evaluate(() => (window as any).__ftThirdParty ?? null)
  expect(mainGlobal).toBeNull()
  evidence(
    `script ran via Partytown: worker started (${workers.length}), script fetched ${thirdPartyReqs.length}x, ` +
      `type -> "${type}", DOM write proxied to <html data-ft-third-party="ran">, main-window global absent (worker sandbox)`,
  )
})
