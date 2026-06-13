import { AnimatePresence, motion } from 'motion/react'
import { StarburstBadge } from '../components/persona/StarburstBadge'
import { brewRatio } from '../lib/ratio'
import type { RecipeIngredient } from '../state/types'

/** The number coffee nerds chase, stamped on the card's corner. */
export function RatioBadge({ ingredients }: { ingredients: RecipeIngredient[] }) {
  const ratio = brewRatio(ingredients)
  return (
    <div
      className="absolute -right-4.5 -top-5 z-4"
      aria-live="polite"
      aria-label={ratio ? `brew ratio ${ratio}` : undefined}
    >
      <AnimatePresence>
        {ratio && (
          <motion.div
            key={ratio}
            initial={{ scale: 1.45, rotate: 10 }}
            animate={{ scale: 1, rotate: 0 }}
            exit={{ scale: 0.5, opacity: 0, transition: { duration: 0.12 } }}
            transition={{ type: 'spring', stiffness: 420, damping: 16 }}
          >
            <StarburstBadge seed="ratio-badge" size={84} fontSize="1.02rem">
              <span style={{ display: 'block' }}>
                {ratio}
                <span style={{ display: 'block', fontSize: '0.56rem', letterSpacing: '0.08em' }}>ratio</span>
              </span>
            </StarburstBadge>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
