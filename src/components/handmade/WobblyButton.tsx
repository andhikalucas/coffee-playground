import { forwardRef } from 'react'
import type { ReactNode } from 'react'
import { motion } from 'motion/react'
import type { HTMLMotionProps } from 'motion/react'
import { tilt } from '../../styles/tokens'
import { seededPick } from '../../lib/rng'
import { useSfx } from '../../audio/useSfx'
import styles from './handmade.module.css'

type Variant = 'paper' | 'ink' | 'red' | 'ghost'

interface WobblyButtonProps extends Omit<HTMLMotionProps<'button'>, 'children'> {
  children: ReactNode
  variant?: Variant
  /** stable identity for this button's particular slouch */
  seed?: string
  silent?: boolean
}

const VARIANT_CLASS: Record<Variant, string> = {
  paper: styles.buttonPaper,
  ink: styles.buttonInk,
  red: styles.buttonRed,
  ghost: styles.buttonGhost,
}

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
      className={`${styles.button} ${VARIANT_CLASS[variant]} ${blob} ${className ?? ''}`}
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
