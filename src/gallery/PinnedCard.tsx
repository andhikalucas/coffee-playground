import { motion } from 'motion/react'
import type { Recipe } from '../state/types'
import { IndexCard } from '../recipe/IndexCard'
import styles from './gallery.module.css'

interface PinnedCardProps {
  recipe: Recipe
  onOpen: (id: string) => void
}

/** A recipe pinned to the cork at whatever angle it happened to land. */
export function PinnedCard({ recipe, onOpen }: PinnedCardProps) {
  return (
    <motion.div
      className={styles.pinWrap}
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
      <svg className={styles.pushpin} width="22" height="26" viewBox="0 0 22 26" aria-hidden="true">
        <path d="M 11 13 L 11 24" stroke="var(--ink)" strokeWidth="2.4" strokeLinecap="round" />
        <circle cx="11" cy="9" r="7.5" fill={recipe.pin.color} stroke="var(--ink)" strokeWidth="2.2" />
        <circle cx="8.4" cy="6.6" r="2" fill="var(--foam)" opacity="0.75" />
      </svg>
      <div className={styles.thumbWindow}>
        <div className={styles.thumbScale}>
          <IndexCard recipe={recipe} mode="static" />
        </div>
      </div>
      <div className={styles.caption}>{recipe.title || 'untitled brew'}</div>
    </motion.div>
  )
}
