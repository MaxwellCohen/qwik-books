// npm run test:features: production build (client + express server), then Playwright
// (which starts `node server/entry.express.js` on PORT 4123) and writes feature-tests/results.json.
import { spawnSync } from 'node:child_process'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const bin = (name) => join(root, 'node_modules', '.bin', name)
const run = (cmd, args, opts = {}) => {
  console.log(`\n$ ${[cmd, ...args].join(' ')}`)
  const r = spawnSync(cmd, args, { cwd: root, stdio: 'inherit', ...opts })
  return r.status ?? 1
}

if (!process.argv.includes('--skip-build')) {
  if (run(bin('vite'), ['build']) !== 0) process.exit(1)
  if (run(bin('vite'), ['build', '-c', 'adapters/express/vite.config.ts']) !== 0) process.exit(1)
}
process.exit(run(bin('playwright'), ['test', '-c', 'feature-tests/playwright.config.ts']))
