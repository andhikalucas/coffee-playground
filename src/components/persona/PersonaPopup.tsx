import { useEffect, useMemo, useRef } from 'react'
import type { CSSProperties, ReactNode } from 'react'
import { motion } from 'motion/react'
import { createPortal } from 'react-dom'
import { jagFor } from './shapes'
import { HalftoneBackdrop } from './HalftoneBackdrop'
import { useFocusTrap } from '../../hooks/useFocusTrap'
import { useSfx } from '../../audio/useSfx'

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
export function PopupRow({
  children,
  className,
  style,
}: {
  children: ReactNode
  className?: string
  style?: CSSProperties
}) {
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
    <div className="fixed inset-0 z-80 grid place-items-center p-7">
      <HalftoneBackdrop seed={popupKey} onClick={handleClose} />
      <motion.div
        ref={trapRef}
        className="relative w-[min(92vw,var(--popup-width,560px))] outline-none"
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
          className="absolute inset-0 translate-x-3 translate-y-3.5 rotate-[1.5deg] scale-[1.03] bg-red"
          style={{ clipPath: shapes.panel }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1, transition: { delay: 0, duration: 0.1 } }}
        />
        <motion.div
          className="absolute inset-0 -translate-x-1.25 -translate-y-1.5 rotate-[-0.8deg] bg-foam"
          style={{ clipPath: shapes.panel }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1, transition: { delay: 0.045, duration: 0.1 } }}
        />
        <motion.div
          className="absolute inset-0 bg-ink"
          style={{ clipPath: shapes.panel }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1, transition: { delay: 0.045, duration: 0.1 } }}
        />
        <motion.div
          className="relative m-4.25 rotate-[-1.2deg] bg-paper px-9 pt-8.5 pb-7.5"
          style={{ clipPath: shapes.content }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1, transition: { delay: 0.09, duration: 0.12 } }}
        >
          {showClose && (
            <button
              type="button"
              className="absolute right-3 top-2.5 z-2 grid h-9.5 w-9.5 place-items-center bg-ink font-display text-[1.05rem] text-foam clip-persona-chip hover:bg-red"
              onClick={handleClose}
              aria-label="close"
            >
              ✕
            </button>
          )}
          <motion.div
            className="flex flex-col gap-3.5"
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
