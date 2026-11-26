import { expect, test } from '@playwright/test'
import { evidence } from './helpers'

test('?jsx image import renders responsive, sized, lazy img with modern formats', async ({ page, request }) => {
  await page.goto('/feature-tests/image-pipeline')
  const below = page.locator('#img-below')
  const srcset = (await below.getAttribute('srcset')) ?? ''
  const widths = [...srcset.matchAll(/\s(\d+)w/g)].map((m) => Number(m[1]))
  expect(new Set(widths).size).toBeGreaterThanOrEqual(2)
  const w = await below.getAttribute('width')
  const h = await below.getAttribute('height')
  expect(Number(w)).toBeGreaterThan(0)
  expect(Number(h)).toBeGreaterThan(0)
  expect(await below.getAttribute('loading')).toBe('lazy')
  expect(await below.getAttribute('decoding')).toBe('async')
  evidence(`srcset widths [${widths.join(',')}], width=${w} height=${h}, offscreen img loading=lazy decoding=async`)

  const firstUrl = srcset.split(',')[0].trim().split(/\s+/)[0]
  const res = await request.get(firstUrl)
  expect(res.ok()).toBe(true)
  const type = res.headers()['content-type']
  expect(type).toMatch(/image\/(avif|webp)/)
  evidence(`GET ${firstUrl} -> ${type} (source was a 1600x1000 JPEG)`)
})
