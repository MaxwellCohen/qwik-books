import type { Reporter, TestCase, TestResult } from '@playwright/test/reporter'
import { execSync } from 'node:child_process'
import { writeFileSync } from 'node:fs'
import { basename, join } from 'node:path'
import { META } from './meta'

type Row = Record<string, string>

class ResultsReporter implements Reporter {
  results: Record<string, Row> = {}

  onTestEnd(test: TestCase, result: TestResult) {
    const featureId = basename(test.location.file).replace(/\.spec\.ts$/, '')
    const meta = META[featureId]
    const notes = [...new Map(test.annotations.concat(result.annotations ?? []).map((a) => [`${a.type}:${a.description}`, a])).values()]
    const evidence = notes.filter((a) => a.type === 'evidence').map((a) => a.description).join('; ')
    const blocked = notes.find((a) => a.type === 'blocked')
    let status: string = result.status === 'passed' ? 'pass' : 'fail'
    if (blocked) status = 'blocked'
    const err = result.error?.message?.split('\n')[0]?.replace(/\u001b\[[0-9;]*m/g, '')
    const row: Row = {
      claimedLabel: meta?.claimedLabel ?? 'unknown',
      status,
      method: meta?.method ?? '',
      evidence: [blocked?.description, evidence, status === 'fail' && err ? `FAILED: ${err}` : '']
        .filter(Boolean)
        .join('; '),
      test: `feature-tests/${featureId}.spec.ts`,
    }
    const suggested = notes.find((a) => a.type === 'suggestedLabel')?.description ?? meta?.suggestedLabel
    if (suggested) row.suggestedLabel = suggested
    this.results[featureId] = row
  }

  onEnd() {
    const root = join(import.meta.dirname, '..')
    let commit = 'unknown'
    try {
      commit = execSync('git rev-parse HEAD', { cwd: root }).toString().trim()
    } catch {}
    const ordered = Object.fromEntries(
      Object.keys(META)
        .filter((k) => this.results[k])
        .map((k) => [k, this.results[k]]),
    )
    const out = {
      framework: 'qwik-city',
      repo: 'qwik-books',
      commit,
      ranAt: new Date().toISOString(),
      results: ordered,
    }
    writeFileSync(join(import.meta.dirname, 'results.json'), JSON.stringify(out, null, 2) + '\n')
  }
}

export default ResultsReporter
