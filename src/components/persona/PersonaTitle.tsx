import { useMemo } from 'react'
import { motion } from 'motion/react'
import { rngFrom } from '../../lib/rng'
import styles from './persona.module.css'

interface PersonaTitleProps {
  text: string
  size?: 'lg' | 'md' | 'sm'
  seed?: string
  className?: string
}

const SIZE_CLASS = { lg: styles.titleLg, md: styles.titleMd, sm: styles.titleSm }

/**
 * Title typography the Persona way: every letter its own tilted chip,
 * ink/cream alternating with the occasional red one, cascading in.
 */
export function PersonaTitle({ text, size = 'lg', seed, className }: PersonaTitleProps) {
  const chips = useMemo(() => {
    const rand = rngFrom((seed ?? text) + ':title')
    return [...text].map((ch, i) => {
      const r = rand()
      const chipClass =
        ch !== ' ' && r < 0.16 ? styles.chipRed : i % 2 === 0 ? styles.chipInk : styles.chipPaper
      return {
        ch,
        chipClass,
        rotate: (rand() * 2 - 1) * 8,
        y: (rand() * 2 - 1) * 4,
        key: i,
      }
    })
  }, [text, seed])

  return (
    <span className={`${styles.title} ${SIZE_CLASS[size]} ${className ?? ''}`} aria-label={text} role="heading" aria-level={2}>
      {chips.map(({ ch, chipClass, rotate, y, key }) =>
        ch === ' ' ? (
          <span key={key} className={styles.titleGap} aria-hidden="true" />
        ) : (
          <motion.span
            key={key}
            className={`${styles.titleChip} ${chipClass}`}
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
