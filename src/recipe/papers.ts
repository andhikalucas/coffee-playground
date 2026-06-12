import type { CSSProperties } from 'react'
import type { PaperStyle, InkColor } from '../state/types'

/** Card paper finishes — plain CSS backgrounds so they export perfectly. */
export const PAPERS: Record<PaperStyle, { label: string; style: CSSProperties }> = {
  lined: {
    label: 'lined',
    style: {
      backgroundColor: 'var(--foam)',
      backgroundImage:
        'repeating-linear-gradient(transparent 0px, transparent 27px, rgba(43, 58, 85, 0.22) 27px, rgba(43, 58, 85, 0.22) 28px)',
      backgroundPosition: '0 86px',
    },
  },
  grid: {
    label: 'grid',
    style: {
      backgroundColor: 'var(--foam)',
      backgroundImage:
        'repeating-linear-gradient(rgba(43, 58, 85, 0.13) 0 1px, transparent 1px 24px), repeating-linear-gradient(90deg, rgba(43, 58, 85, 0.13) 0 1px, transparent 1px 24px)',
    },
  },
  kraft: {
    label: 'kraft',
    style: {
      backgroundColor: 'var(--kraft)',
      backgroundImage: 'radial-gradient(rgba(122, 75, 34, 0.12) 1px, transparent 1.4px)',
      backgroundSize: '7px 7px',
    },
  },
  dotted: {
    label: 'dotted',
    style: {
      backgroundColor: 'var(--foam)',
      backgroundImage: 'radial-gradient(rgba(43, 58, 85, 0.28) 1.3px, transparent 1.5px)',
      backgroundSize: '19px 19px',
      backgroundPosition: '4px 90px',
    },
  },
}

/** Card handwriting colors. */
export const INKS: Record<InkColor, { label: string; value: string }> = {
  espresso: { label: 'espresso', value: 'var(--ink)' },
  navy: { label: 'navy', value: 'var(--ink-navy)' },
  red: { label: 'cherry', value: 'var(--red-deep)' },
  forest: { label: 'forest', value: 'var(--ink-forest)' },
}
