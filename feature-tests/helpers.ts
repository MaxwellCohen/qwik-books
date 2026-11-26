import { test, type Page } from '@playwright/test'
import { join } from 'node:path'

export const ROOT = join(import.meta.dirname, '..')

export function evidence(text: string) {
  test.info().annotations.push({ type: 'evidence', description: text })
}

export function suggestLabel(label: string) {
  test.info().annotations.push({ type: 'suggestedLabel', description: label })
}

/** Qwik resumes lazily; wait until the qwikloader is ready and the network is idle. */
export async function gotoAndSettle(page: Page, path: string) {
  await page.goto(path, { waitUntil: 'networkidle' })
}
