import { expect, test } from '@playwright/test'
import { evidence } from './helpers'

const MARKER = 'ft-css-inline-marker'

test('route CSS is inlined as <style>, not a render-blocking stylesheet', async ({ page, request }) => {
  const html = await (await request.get('/feature-tests/css-inlining')).text()
  const styles = [...html.matchAll(/<style([^>]*)>([\s\S]*?)<\/style>/g)]
  const inline = styles.find((m) => m[2].includes(MARKER))
  expect(inline, 'inline <style> containing route CSS').toBeTruthy()
  evidence(`inline <style${inline![1]}> contains .${MARKER}`)

  const hrefs = [...html.matchAll(/<link[^>]*rel="stylesheet"[^>]*href="([^"]+)"/g)].map((m) => m[1])
  for (const href of hrefs) {
    const css = await (await request.get(href)).text()
    expect(css.includes(MARKER), `${href} must not carry the route CSS`).toBe(false)
  }
  evidence(`${hrefs.length} <link rel=stylesheet> (global Tailwind) checked: none contain the route CSS`)

  await page.goto('/feature-tests/css-inlining')
  await expect(page.locator('#css-target')).toHaveCSS('color', 'rgb(1, 2, 3)')
  evidence('computed color rgb(1,2,3) applied in browser')
})
