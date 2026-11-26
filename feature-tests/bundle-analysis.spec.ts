import { expect, test } from '@playwright/test'
import { execFileSync } from 'node:child_process'
import { existsSync, mkdtempSync, readFileSync, rmSync, statSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { evidence, ROOT } from './helpers'

test('ANALYZE=1 client build with rollup-plugin-visualizer writes stats.html', async () => {
  const out = mkdtempSync(join(tmpdir(), 'qwik-analyze-'))
  try {
    execFileSync(join(ROOT, 'node_modules/.bin/vite'), ['build', '--outDir', out], {
      cwd: ROOT,
      env: { ...process.env, ANALYZE: '1' },
      stdio: 'pipe',
    })
    const report = join(out, 'stats.html')
    expect(existsSync(report)).toBe(true)
    const size = statSync(report).size
    const html = readFileSync(report, 'utf8')
    expect(size).toBeGreaterThan(10_000)
    expect(html).toMatch(/q-[\w-]+\.js/)
    evidence(`stats.html (${Math.round(size / 1024)} KB treemap) generated, lists q-*.js chunks`)
  } finally {
    rmSync(out, { recursive: true, force: true })
  }
})
