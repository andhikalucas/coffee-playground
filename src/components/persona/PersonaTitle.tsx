import { useMemo } from 'react'
import { motion } from 'motion/react'
import { rngFrom } from '../../lib/rng'
import { cn } from '../../lib/cn'

interface PersonaTitleProps {
  text: string
  size?: 'lg' | 'md' | 'sm'
  seed?: string
  className?: string
}

// chip font-size used to come from a `.titleLg .titleChip` descendant rule; now each
// chip carries it directly
const CHIP_FONT = {
  lg: 'text-[clamp(1.7rem,4.6vw,2.6rem)]',
  md: 'text-[clamp(1.15rem,3vw,1.55rem)]',
  sm: 'text-[0.95rem]',
}
const CHIP_BASE =
  'inline-block select-none px-[0.18em] pt-[0.14em] pb-[0.1em] font-display uppercase leading-none'
const CHIP_VARIANT = {
  ink: 'bg-ink text-foam',
  paper: 'bg-foam text-ink shadow-[inset_0_0_0_2px_var(--color-ink)]',
  red: 'bg-red text-foam',
}

/**
 * Title typography the Persona way: every letter its own tilted chip,
 * ink/cream alternating with the occasional red one, cascading in.
 */
export function PersonaTitle({ text, size = 'lg', seed, className }: PersonaTitleProps) {
  const chips = useMemo(() => {
    const rand = rngFrom((seed ?? text) + ':title')
    return [...text].map((ch, i) => {
      const r = rand()
      const variant: keyof typeof CHIP_VARIANT =
        ch !== ' ' && r < 0.16 ? 'red' : i % 2 === 0 ? 'ink' : 'paper'
      return {
        ch,
        variant,
        rotate: (rand() * 2 - 1) * 8,
        y: (rand() * 2 - 1) * 4,
        key: i,
      }
    })
  }, [text, seed])

  return (
    <span
      className={cn('flex flex-wrap items-baseline gap-x-0.75 gap-y-2', className)}
      aria-label={text}
      role="heading"
      aria-level={2}
    >
      {chips.map(({ ch, variant, rotate, y, key }) =>
        ch === ' ' ? (
          <span key={key} className="w-[0.45em]" aria-hidden="true" />
        ) : (
          <motion.span
            key={key}
            className={cn(CHIP_BASE, CHIP_FONT[size], CHIP_VARIANT[variant])}
            aria-hidden="true"
            initial={{ y: 24, scale: 1.4, opacity: 0, rotate: rotate * 2 }}
            animate={{ y, scale: 1, opacity: 1, rotate }}
            transition={{
              delay: 0.12 + key * 0.022,
              type: 'spring',
              stiffness: 560,
              damping: 24,
            }}
          >
            {ch}
          </motion.span>
        ),
      )}
    </span>
  )
}
