import { defineConfig } from '@playwright/test'

export const PORT = Number(process.env.FT_PORT ?? 4123)

export default defineConfig({
  testDir: '.',
  testMatch: '*.spec.ts',
  workers: 1,
  timeout: 240_000,
  expect: { timeout: 15_000 },
  reporter: [['list'], ['./results-reporter.ts']],
  use: {
    baseURL: `http://localhost:${PORT}`,
    launchOptions: {
      executablePath: process.env.CHROME_PATH ?? '/home/maxc/.local/bin/google-chrome',
    },
  },
  webServer: {
    // Production server built by `npm run test:features` (feature-tests/run.mjs).
    command: 'node server/entry.express.js',
    cwd: '..',
    url: `http://localhost:${PORT}/feature-tests`,
    env: { PORT: String(PORT) },
    reuseExistingServer: false,
    timeout: 60_000,
  },
})
