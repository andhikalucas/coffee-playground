import { useEffect, useMemo, useRef } from 'react'
import type { CSSProperties, ReactNode } from 'react'
import { motion } from 'motion/react'
import { createPortal } from 'react-dom'
import { jagFor } from './shapes'
import { HalftoneBackdrop } from './HalftoneBackdrop'
import { useFocusTrap } from '../../hooks/useFocusTrap'
import { useSfx } from '../../audio/useSfx'
import styles from './persona.module.css'

interface PersonaPopupProps {
  /** stable identity — decides which jagged cut this popup wears */
  popupKey: string
  onClose: () => void
  children: ReactNode
  labelledBy?: string
  width?: number
  showClose?: boolean
}

const itemVariants = {
  hidden: { x: -28, opacity: 0, rotate: -3 },
  show: { x: 0, opacity: 1, rotate: 0, transition: { type: 'spring', stiffness: 600, damping: 32 } },
} as const

/** A content row that joins the popup's staggered slam-in. */
export function PopupRow({ children, className, style }: { children: ReactNode; className?: string; style?: CSSProperties }) {
  return (
    <motion.div variants={itemVariants} className={className} style={style}>
      {children}
    </motion.div>
  )
}

/**
 * The signature interruption: layered jagged panels — red misprint, ink,
 * then cream content — slamming in over a halftone-dimmed world.
 * Mount/unmount inside an <AnimatePresence>.
 */
export function PersonaPopup({
  popupKey,
  onClose,
  children,
  labelledBy,
  width = 560,
  showClose = true,
}: PersonaPopupProps) {
  const play = useSfx()
  const closedRef = useRef(false)

  const handleClose = () => {
    if (closedRef.current) return
    closedRef.current = true
    play('swish')
    onClose()
  }

  const trapRef = useFocusTrap<HTMLDivElement>(handleClose)

  useEffect(() => {
    play('thump')
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const shapes = useMemo(
    () => ({
      panel: jagFor(popupKey),
      content: jagFor(popupKey + '::content'),
    }),
    [popupKey],
  )

  return createPortal(
    <div className={styles.overlay}>
      <HalftoneBackdrop seed={popupKey} onClick={handleClose} />
      <motion.div
        ref={trapRef}
        className={styles.panelGroup}
        style={{ '--popup-width': `${width}px` } as CSSProperties}
        role="dialog"
        aria-modal="true"
        aria-labelledby={labelledBy}
        tabIndex={-1}
        initial={{ scale: 1.55, rotate: 7, opacity: 0 }}
        animate={{ scale: 1, rotate: -2, opacity: 1 }}
        exit={{
          x: -60,
          rotate: -4,
          scale: 0.9,
          opacity: 0,
          transition: { duration: 0.16, ease: [0.55, 0, 1, 0.45] },
        }}
        transition={{ type: 'spring', stiffness: 480, damping: 26, mass: 1 }}
      >
        <motion.div
          className={styles.layerRed}
          style={{ clipPath: shapes.panel }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1, transition: { delay: 0, duration: 0.1 } }}
        />
        <motion.div
          className={styles.layerFlash}
          style={{ clipPath: shapes.panel }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1, transition: { delay: 0.045, duration: 0.1 } }}
        />
        <motion.div
          className={styles.layerInk}
          style={{ clipPath: shapes.panel }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1, transition: { delay: 0.045, duration: 0.1 } }}
        />
        <motion.div
          className={styles.layerContent}
          style={{ clipPath: shapes.content }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1, transition: { delay: 0.09, duration: 0.12 } }}
        >
          {showClose && (
            <button type="button" className={styles.closeChip} onClick={handleClose} aria-label="close">
              ✕
            </button>
          )}
          <motion.div
            className={styles.contentInner}
            initial="hidden"
            animate="show"
            variants={{ show: { transition: { staggerChildren: 0.05, delayChildren: 0.18 } } }}
          >
            {children}
          </motion.div>
        </motion.div>
      </motion.div>
    </div>,
    document.body,
  )
}
