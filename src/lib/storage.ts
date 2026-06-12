import type { Vault } from '../state/types'

/**
 * Versioned localStorage vault. One key, debounced writes, corrupt data is
 * stashed (never destroyed), and quota errors surface through a handler the
 * UI registers (a torn-paper toast).
 */

const KEY = 'coffee-playground:v1'
const SAVE_DEBOUNCE_MS = 400

let vault: Vault | null = null
let saveTimer: number | undefined
let onSaveError: ((err: unknown) => void) | null = null

export function setSaveErrorHandler(handler: (err: unknown) => void) {
  onSaveError = handler
}

function freshVault(): Vault {
  return {
    version: 1,
    recipes: [],
    draft: null,
    settings: { muted: false, volume: 0.7 },
  }
}

/** Future schema migrations slot in here, oldest first. */
const migrations: Array<(old: unknown) => unknown> = []

export function loadVault(): Vault {
  if (vault) return vault
  let raw: string | null = null
  try {
    raw = localStorage.getItem(KEY)
    if (!raw) {
      vault = freshVault()
      return vault
    }
    let parsed: unknown = JSON.parse(raw)
    for (const migrate of migrations) parsed = migrate(parsed)
    const candidate = parsed as Partial<Vault>
    if (candidate?.version !== 1 || !Array.isArray(candidate.recipes)) {
      throw new Error('unrecognized vault shape')
    }
    vault = {
      ...freshVault(),
      ...candidate,
      settings: { ...freshVault().settings, ...candidate.settings },
    } as Vault
  } catch {
    if (raw) {
      try {
        localStorage.setItem(`coffee-playground:corrupt-${Date.now()}`, raw)
      } catch {
        /* stash is best-effort */
      }
    }
    vault = freshVault()
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

/** Save immediately (used right before export/unload-sensitive moments). */
export function flushVault() {
  if (saveTimer !== undefined) {
    window.clearTimeout(saveTimer)
    saveTimer = undefined
  }
  persist()
}
