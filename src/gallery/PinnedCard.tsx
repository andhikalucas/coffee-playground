import { motion } from 'motion/react'
import type { Recipe } from '../state/types'
import { IndexCard } from '../recipe/IndexCard'
import { StarburstBadge } from '../components/persona/StarburstBadge'

interface PinnedCardProps {
  recipe: Recipe
  onOpen: (id: string) => void
  /** wear the "lucas' pick" stamp — a read-only, owner-curated house recipe */
  house?: boolean
}

/** A recipe pinned to the cork at whatever angle it happened to land. */
export function PinnedCard({ recipe, onOpen, house = false }: PinnedCardProps) {
  return (
    <motion.div
      className="relative w-72.5 cursor-pointer"
      style={{ rotate: recipe.pin.angle }}
      whileHover={{ rotate: 0, scale: 1.04, zIndex: 5 }}
      whileTap={{ scale: 0.97 }}
      transition={{ type: 'spring', stiffness: 380, damping: 22 }}
      onClick={() => onOpen(recipe.id)}
      role="button"
      tabIndex={0}
      aria-label={`open recipe: ${recipe.title || 'untitled brew'}`}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault()
          onOpen(recipe.id)
        }
      }}
    >
      <svg
        className="absolute left-1/2 top-[-13px] z-3 -ml-2.75 drop-shadow-[2px_3px_0_rgba(42,27,16,0.3)]"
        width="22"
        height="26"
        viewBox="0 0 22 26"
        aria-hidden="true"
      >
        <path d="M 11 13 L 11 24" stroke="var(--ink)" strokeWidth="2.4" strokeLinecap="round" />
        <circle cx="11" cy="9" r="7.5" fill={recipe.pin.color} stroke="var(--ink)" strokeWidth="2.2" />
        <circle cx="8.4" cy="6.6" r="2" fill="var(--foam)" opacity="0.75" />
      </svg>
      <div className="h-49 w-72.5 overflow-hidden">
        <div className="w-160 origin-top-left scale-[0.453]">
          <IndexCard recipe={recipe} mode="static" />
        </div>
      </div>
      <div className="mt-2.5 text-center font-script text-[1.18rem] font-bold text-foam [text-shadow:1.5px_2px_0_rgba(42,27,16,0.4)]">
        {recipe.title || 'untitled brew'}
      </div>
    </motion.div>
  )
}
