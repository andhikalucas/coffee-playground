import type { Bean } from './types'
import { normalizeBean } from './normalize'

/**
 * Owner-curated cupboard, shipped in the repo and edited via the CMS. One JSON
 * file = one bean; the filename becomes the stable id (so a bean's recipe
 * cross-link and shelf position stay put). Validated through normalizeBean.
 */
const modules = import.meta.glob('../content/cupboard/*.json', { eager: true })

export const BEANS: Bean[] = Object.entries(modules)
  .map(([path, mod]): Bean | null => {
    const bean = normalizeBean((mod as { default: unknown }).default)
    if (!bean) return null
    const slug = path.split('/').pop()!.replace(/\.json$/, '')
    return { ...bean, id: slug }
  })
  .filter((b): b is Bean => b !== null)
  .sort((a, b) => a.name.localeCompare(b.name))
