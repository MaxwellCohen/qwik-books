import { expect, test } from '@playwright/test'
import { evidence } from './helpers'

test('font is self-hosted, uses font-display, and is preloaded', async ({ page, request }) => {
  const external: string[] = []
  const fontReqs: string[] = []
  page.on('request', (r) => {
    const u = r.url()
    if (/fonts\.(googleapis|gstatic)\.com/.test(u)) external.push(u)
    if (r.resourceType() === 'font') fontReqs.push(u)
  })
  await page.goto('/feature-tests/font-optimization', { waitUntil: 'networkidle' })
  await page.evaluate(() => document.fonts.ready)
  expect(await page.evaluate(() => document.fonts.check("700 28px 'Lora'"))).toBe(true)
  expect(external).toEqual([])
  const lora = fontReqs.filter((u) => u.includes('lora'))
  expect(lora.length).toBeGreaterThan(0)
  for (const u of lora) expect(new URL(u).host).toBe('localhost:4123')
  evidence(`Lora loaded from same origin (${new URL(lora[0]).pathname}); 0 Google Fonts requests`)

  const html = await (await request.get('/feature-tests/font-optimization')).text()
  const preload = [...html.matchAll(/<link[^>]*rel="preload"[^>]*>/g)]
    .map((m) => m[0])
    .find((l) => /as="font"/.test(l) && /lora-latin-700-normal\.woff2/.test(l))
  expect(preload, '<link rel=preload as=font> for Lora').toBeTruthy()
  evidence('<link rel="preload" as="font"> for lora woff2 emitted automatically by qwikVite (no preload code in route)')

  const cssHrefs = [...html.matchAll(/<link[^>]*rel="stylesheet"[^>]*href="([^"]+)"/g)].map((m) => m[1])
  let face = ''
  for (const href of cssHrefs) {
    const css = await (await request.get(href)).text()
    face ||= css.match(/@font-face\{[^}]*font-family:Lora[^}]*\}/)?.[0] ?? ''
  }
  expect(face).toMatch(/font-display:swap/)
  evidence('@font-face for Lora has font-display:swap (from Fontsource CSS)')
})
