#!/usr/bin/env node
/**
 * scripts/check-locales.mjs
 *
 * Validates that all locale JSON files under src/locales/ share the same
 * key structure as the reference locale (en.json).
 *
 * Usage:
 *   node scripts/check-locales.mjs
 *   node scripts/check-locales.mjs --fix   (stubs missing keys with a TODO marker)
 *
 * Exit code 0 = all locales in sync
 * Exit code 1 = missing or extra keys found
 */

import { readFileSync, writeFileSync, readdirSync } from 'fs'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const LOCALES_DIR = join(__dirname, '../src/locales')
const REFERENCE = 'en'
const FIX_MODE = process.argv.includes('--fix')
const SILENT = process.argv.includes('--silent')

// ── helpers ────────────────────────────────────────────────────────────────

function loadJson(file) {
  return JSON.parse(readFileSync(join(LOCALES_DIR, file), 'utf8'))
}

/**
 * Recursively collect all dot-notation key paths from an object.
 * Arrays are treated as leaf nodes (their internal structure is ignored).
 */
function collectKeys(obj, prefix = '') {
  const keys = []
  for (const [k, v] of Object.entries(obj)) {
    const path = prefix ? `${prefix}.${k}` : k
    if (v !== null && typeof v === 'object' && !Array.isArray(v)) {
      keys.push(...collectKeys(v, path))
    } else {
      keys.push(path)
    }
  }
  return keys
}

/**
 * Deep-get value by dot-notation path.
 */
function getByPath(obj, path) {
  return path.split('.').reduce((cur, key) => cur?.[key], obj)
}

/**
 * Deep-set value by dot-notation path, creating intermediate objects.
 */
function setByPath(obj, path, value) {
  const parts = path.split('.')
  let cur = obj
  for (let i = 0; i < parts.length - 1; i++) {
    if (cur[parts[i]] === undefined) cur[parts[i]] = {}
    cur = cur[parts[i]]
  }
  cur[parts[parts.length - 1]] = value
}

/**
 * Deep-delete a leaf key by dot-notation path.
 */
function deleteByPath(obj, path) {
  const parts = path.split('.')
  let cur = obj
  for (let i = 0; i < parts.length - 1; i++) {
    if (cur[parts[i]] === undefined) return
    cur = cur[parts[i]]
  }
  delete cur[parts[parts.length - 1]]
}

// ── main ───────────────────────────────────────────────────────────────────

const files = readdirSync(LOCALES_DIR).filter(f => f.endsWith('.json'))
const locales = files.map(f => f.replace('.json', ''))

if (!locales.includes(REFERENCE)) {
  console.error(`❌  Reference locale "${REFERENCE}.json" not found in ${LOCALES_DIR}`)
  process.exit(1)
}

const refData = loadJson(`${REFERENCE}.json`)
const refKeys = new Set(collectKeys(refData))

let totalIssues = 0

for (const locale of locales) {
  if (locale === REFERENCE) continue

  const data = loadJson(`${locale}.json`)
  const localeKeys = new Set(collectKeys(data))

  const missing = [...refKeys].filter(k => !localeKeys.has(k))
  // Ignore _meta keys — they're intentionally different per locale
  const extra = [...localeKeys].filter(k => !refKeys.has(k) && !k.startsWith('_meta'))

  if (missing.length === 0 && extra.length === 0) {
    if (!SILENT) console.log(`✅  ${locale}.json — all ${refKeys.size} keys present`)
    continue
  }

  totalIssues += missing.length + extra.length

  if (!SILENT) {
    console.log(`\n⚠️   ${locale}.json`)
    if (missing.length) {
      console.log(`    Missing keys (${missing.length}):`)
      missing.forEach(k => console.log(`      - ${k}`))
    }
    if (extra.length) {
      console.log(`    Extra keys not in ${REFERENCE} (${extra.length}):`)
      extra.forEach(k => console.log(`      + ${k}`))
    }
  }

  if (FIX_MODE) {
    // Stub missing keys
    missing.forEach(k => setByPath(data, k, `[TODO: translate from en] ${getByPath(refData, k)}`))
    // Remove extra keys
    extra.forEach(k => deleteByPath(data, k))
    writeFileSync(join(LOCALES_DIR, `${locale}.json`), JSON.stringify(data, null, 2) + '\n', 'utf8')
    if (!SILENT) console.log(`    ✏️   ${locale}.json patched (missing keys stubbed, extra keys removed)`)
  }
}

if (totalIssues === 0) {
  if (!SILENT) console.log(`\n✔  All locale files are in sync with ${REFERENCE}.json`)
  process.exit(0)
} else {
  if (!SILENT) {
    console.log(`\n✖  ${totalIssues} issue(s) found across locale files.`)
    if (!FIX_MODE) console.log('   Run with --fix to stub missing keys automatically.\n')
  }
  process.exit(1)
}
