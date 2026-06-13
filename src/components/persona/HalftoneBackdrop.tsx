import { useMemo } from 'react'
import { motion } from 'motion/react'
import { rngFrom } from '../../lib/rng'
import { useSettings } from '../../state/SettingsContext'

interface HalftoneBackdropProps {
  seed?: string
  onClick?: () => void
}

/** Dimmed halftone-dot field with a slowly wheeling starburst behind the panel. */
export function HalftoneBackdrop({ seed = 'burst', onClick }: HalftoneBackdropProps) {
  const { reducedMotion } = useSettings()

  const rays = useMemo(() => {
    const rand = rngFrom(seed)
    const count = 24
    const out: string[] = []
    for (let i = 0; i < count; i++) {
      const a = (i / count) * Math.PI * 2
      const half = ((Math.PI * 2) / count) * (0.16 + rand() * 0.16)
      const r = 360 + rand() * 160
      const x1 = Math.cos(a - half) * r
      const y1 = Math.sin(a - half) * r
      const x2 = Math.cos(a + half) * r
      const y2 = Math.sin(a + half) * r
      out.push(`M 0 0 L ${x1.toFixed(1)} ${y1.toFixed(1)} L ${x2.toFixed(1)} ${y2.toFixed(1)} Z`)
    }
    return out
  }, [seed])

  return (
    <>
      <motion.div
        className="fixed inset-0 persona-backdrop"
        onClick={onClick}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0, transition: { duration: 0.2 } }}
        transition={{ duration: 0.25 }}
      />
      <motion.svg
        className="pointer-events-none fixed left-1/2 top-1/2"
        width="1040"
        height="1040"
        viewBox="-520 -520 1040 1040"
        initial={{ opacity: 0, x: '-50%', y: '-50%' }}
        animate={{
          opacity: 1,
          x: '-50%',
          y: '-50%',
          rotate: reducedMotion ? 0 : 360,
        }}
        exit={{ opacity: 0, transition: { duration: 0.15 } }}
        transition={{
          opacity: { duration: 0.3 },
          rotate: { duration: 60, repeat: Infinity, ease: 'linear' },
        }}
        aria-hidden="true"
      >
        {rays.map((d, i) => (
          <path key={i} d={d} fill="var(--foam)" opacity={0.08} />
        ))}
      </motion.svg>
    </>
  )
}
