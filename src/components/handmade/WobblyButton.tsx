import { forwardRef } from 'react'
import type { ReactNode } from 'react'
import { motion } from 'motion/react'
import type { HTMLMotionProps } from 'motion/react'
import { tilt } from '../../styles/tokens'
import { seededPick } from '../../lib/rng'
import { useSfx } from '../../audio/useSfx'
import { cn } from '../../lib/cn'

type Variant = 'paper' | 'ink' | 'red' | 'ghost'

interface WobblyButtonProps extends Omit<HTMLMotionProps<'button'>, 'children'> {
  children: ReactNode
  variant?: Variant
  /** stable identity for this button's particular slouch */
  seed?: string
  silent?: boolean
}

// border baked into each variant (no Preflight → border-width alone is invisible
// without an explicit border-style)
const VARIANT_CLASS: Record<Variant, string> = {
  paper: 'border-[2.5px] border-solid border-ink bg-foam text-ink shadow-ink-sm',
  ink: 'border-[2.5px] border-solid border-ink bg-ink text-foam shadow-soft',
  red: 'border-[2.5px] border-solid border-ink bg-red text-foam shadow-ink-sm',
  ghost: 'border-2 border-dashed border-ink bg-transparent text-ink shadow-none',
}

const BASE =
  'relative inline-flex items-center justify-center gap-[0.5em] px-[1.25em] py-[0.5em] ' +
  'font-hand text-base leading-[1.2] select-none whitespace-nowrap ' +
  'disabled:opacity-45 disabled:cursor-not-allowed'

const BLOBS = ['blob-a', 'blob-b', 'blob-c'] as const

/** A hand-cut button that squashes when poked. */
export const WobblyButton = forwardRef<HTMLButtonElement, WobblyButtonProps>(function WobblyButton(
  { children, variant = 'paper', seed = 'btn', silent = false, onClick, className, style, ...rest },
  ref,
) {
  const play = useSfx()
  const baseTilt = tilt(seed, 1.4)
  const blob = seededPick(seed, BLOBS)

  return (
    <motion.button
      ref={ref}
      {...rest}
      className={cn(BASE, VARIANT_CLASS[variant], blob, className)}
      style={{ rotate: baseTilt, ...style }}
      whileHover={{ scale: 1.05, rotate: baseTilt - 1 }}
      whileTap={{ scale: 0.92, rotate: baseTilt + 1.5 }}
      transition={{ type: 'spring', stiffness: 500, damping: 18 }}
      onClick={(e) => {
        if (!silent) play('click')
        onClick?.(e)
      }}
    >
      {children}
    </motion.button>
  )
})
