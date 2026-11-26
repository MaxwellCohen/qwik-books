import { expect, test } from '@playwright/test'
import { execFileSync } from 'node:child_process'
import { cpSync, existsSync, mkdtempSync, rmSync, symlinkSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { evidence, ROOT } from './helpers'

// Builds run in an isolated copy because the vercel-edge adapter moves dist/ into .vercel/output.
const COPY = ['src', 'adapters', 'public', 'vite.config.ts', 'tsconfig.json', 'package.json', 'qwik.env.d.ts']

const TARGETS: { adapter: string; expect: string[] }[] = [
  { adapter: 'express', expect: ['server/entry.express.js', 'dist/build'] },
  {
    adapter: 'vercel-edge',
    expect: [
      '.vercel/output/config.json',
      '.vercel/output/functions/_qwik-city.func/entry.vercel-edge.js',
      '.vercel/output/static/build',
    ],
  },
  { adapter: 'netlify-edge', expect: ['.netlify/edge-functions/manifest.json', '.netlify/edge-functions/entry.netlify-edge'] },
]

test('same app builds for node (express), vercel-edge and netlify-edge adapters', async () => {
  const built: string[] = []
  for (const t of TARGETS) {
    const dir = mkdtempSync(join(tmpdir(), `qwik-${t.adapter}-`))
    try {
      for (const f of COPY) cpSync(join(ROOT, f), join(dir, f), { recursive: true })
      symlinkSync(join(ROOT, 'node_modules'), join(dir, 'node_modules'))
      const vite = join(ROOT, 'node_modules/.bin/vite')
      execFileSync(vite, ['build'], { cwd: dir, stdio: 'pipe' })
      execFileSync(vite, ['build', '-c', `adapters/${t.adapter}/vite.config.ts`], { cwd: dir, stdio: 'pipe' })
      for (const p of t.expect) expect(existsSync(join(dir, p)), `${t.adapter}: ${p}`).toBe(true)
      built.push(`${t.adapter} -> ${t.expect[0]}`)
    } finally {
      rmSync(dir, { recursive: true, force: true })
    }
  }
  evidence(`built ${built.length} targets: ${built.join(', ')}`)
})
