import { expect, test } from '@playwright/test'
import { existsSync, readFileSync } from 'node:fs'
import { join } from 'node:path'
import { evidence, ROOT } from './helpers'

const stampOf = (html: string) => html.match(/id="stamp">(?:<!--[^>]*-->)*([^<]+)/)?.[1]

test('one route is prerendered (SSG), another is SSR per request', async ({ request }) => {
  const file = join(ROOT, 'dist/feature-tests/render-modes/static/index.html')
  expect(existsSync(file)).toBe(true)
  const built = stampOf(readFileSync(file, 'utf8'))
  expect(built).toBeTruthy()

  // Node adapter's staticFile middleware serves SSG pages at their trailing-slash path.
  const s1 = stampOf(await (await request.get('/feature-tests/render-modes/static/')).text())
  const s2 = stampOf(await (await request.get('/feature-tests/render-modes/static/')).text())
  expect(s1).toBe(built)
  expect(s2).toBe(built)
  evidence(`SSG: dist/feature-tests/render-modes/static/index.html exists; stamp ${built} identical on 2 requests`)

  const d1 = stampOf(await (await request.get('/feature-tests/render-modes/ssr')).text())
  const d2 = stampOf(await (await request.get('/feature-tests/render-modes/ssr')).text())
  expect(d1).toBeTruthy()
  expect(d1).not.toBe(d2)
  evidence(`SSR: stamp changes per request (${d1} -> ${d2})`)

  const noSlash = stampOf(await (await request.get('/feature-tests/render-modes/static')).text())
  evidence(
    `note: with trailingSlash:false, /static (no slash) ${noSlash === built ? 'also serves the SSG file' : 'falls through to SSR in the node adapter'}`,
  )
})
