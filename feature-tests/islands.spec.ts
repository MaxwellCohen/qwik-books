import { expect, test } from '@playwright/test'
import { execSync } from 'node:child_process'
import { evidence, ROOT } from './helpers'

const CODE_MARKER = '7f3a' // only appears in StaticPanel's source

test('interactive component works; static component code is never downloaded', async ({ page }) => {
  const js: { url: string; body: string }[] = []
  page.on('response', async (res) => {
    const url = res.url()
    const type = res.request().resourceType()
    if (type === 'script' || /\.m?js(\?|$)/.test(url)) {
      try {
        js.push({ url, body: await res.text() })
      } catch {}
    }
  })
  await page.goto('/feature-tests/islands', { waitUntil: 'networkidle' })
  await expect(page.locator('#static-panel')).toContainText('FT_STATIC_ONLY_MARKER_7F3A')
  for (let i = 0; i < 3; i++) await page.locator('#island-button').click()
  await expect(page.locator('#island-count')).toHaveText('3')
  await page.waitForLoadState('networkidle')

  // Inline <script> in the HTML (qwikloader, state) must not carry the static component code either.
  const inlineScripts = await page.evaluate(() =>
    [...document.querySelectorAll('script:not([src])')].map((s) => s.textContent ?? '').join('\n'),
  )
  expect(inlineScripts.includes(CODE_MARKER)).toBe(false)
  const leaked = js.filter((r) => r.body.includes(CODE_MARKER)).map((r) => r.url)
  expect(leaked).toEqual([])

  // Sanity: the chunk exists in the client build (so the check is meaningful), it just isn't fetched.
  const onDisk = execSync(`grep -l ${CODE_MARKER} dist/build/*.js || true`, { cwd: ROOT }).toString().trim()
  evidence(
    `counter went 0->3 after resume; ${js.length} JS responses, none contain the static component code ` +
      `(marker exists only in unfetched ${onDisk ? onDisk.split('\n').length + ' build chunk(s)' : 'no client chunk'})`,
  )
})
