import type { Vault } from '../state/types'
import { normalizeVault } from '../state/normalize'

/**
 * Versioned localStorage vault. One key, debounced writes, corrupt data is
 * stashed (never destroyed), and quota errors surface through a handler the
 * UI registers (a torn-paper toast).
 *
 * Note: the vault is cached per tab and written whole — two tabs editing at
 * once is last-write-wins. Fine for a personal playground.
 */

const KEY = 'coffee-playground:v1'
const CORRUPT_KEY = 'coffee-playground:corrupt-latest'
const SAVE_DEBOUNCE_MS = 400

let vault: Vault | null = null
let saveTimer: number | undefined
let onSaveError: ((err: unknown) => void) | null = null

export function setSaveErrorHandler(handler: (err: unknown) => void) {
  onSaveError = handler
}

/** Future schema migrations slot in here, oldest first. */
const migrations: Array<(old: unknown) => unknown> = []

export function loadVault(): Vault {
  if (vault) return vault
  let raw: string | null = null
  try {
    raw = localStorage.getItem(KEY)
    if (!raw) {
      vault = normalizeVault(null)
      return vault
    }
    let parsed: unknown = JSON.parse(raw)
    for (const migrate of migrations) parsed = migrate(parsed)
    // every loaded field is untrusted — normalize deep, never crash the app
    vault = normalizeVault(parsed)
  } catch {
    // unparseable: stash one copy for forensics, then start fresh and
    // immediately overwrite the bad key so the failure can't recur each load
    if (raw) {
      try {
        localStorage.setItem(CORRUPT_KEY, raw)
      } catch {
        /* stash is best-effort */
      }
    }
    vault = normalizeVault(null)
    persist()
  }
  return vault
}

function persist() {
  if (!vault) return
  try {
    localStorage.setItem(KEY, JSON.stringify(vault))
  } catch (err) {
    onSaveError?.(err)
  }
}

/** Mutate the vault and schedule a debounced save. */
export function updateVault(mutate: (v: Vault) => void) {
  const v = loadVault()
  mutate(v)
  if (saveTimer !== undefined) window.clearTimeout(saveTimer)
  saveTimer = window.setTimeout(() => {
    saveTimer = undefined
    persist()
  }, SAVE_DEBOUNCE_MS)
}

/** Save immediately (called on pagehide and after pinning a card). */
export function flushVault() {
  if (saveTimer !== undefined) {
    window.clearTimeout(saveTimer)
    saveTimer = undefined
  }
  persist()
}

/** Wipe everything — the error boundary's "start fresh" exit. */
export function resetVault() {
  try {
    localStorage.removeItem(KEY)
  } catch {
    /* nothing to do */
  }
  vault = null
}
