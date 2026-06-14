import { useEffect, useRef } from 'react'
import type { ReactNode } from 'react'
import { motion } from 'motion/react'
import { createPortal } from 'react-dom'
import { HalftoneBackdrop } from '../components/persona/HalftoneBackdrop'
import { useFocusTrap } from '../hooks/useFocusTrap'
import { useSfx } from '../audio/useSfx'

interface StickerPickerSheetProps {
  onClose: () => void
  children: ReactNode
  labelledBy?: string
}

/**
 * The decoration drawer on phones. Unlike {@link PersonaPopup} this stays upright
 * (the Persona tilt/jagged cut warped the sticker grid), and slides up from the
 * bottom like a drawer being pulled open — over the same halftone-dimmed world,
 * still wearing the red misprint drop-shadow.
 */
export function StickerPickerSheet({ onClose, children, labelledBy }: StickerPickerSheetProps) {
  const play = useSfx()
  const closedRef = useRef(false)

  const handleClose = () => {
    if (closedRef.current) return
    closedRef.current = true
    play('swish')
    onClose()
  }

  const trapRef = useFocusTrap<HTMLDivElement>(handleClose)

  // sound effect
  useEffect(() => {
    play('swish')
  }, [])

  return createPortal(
    <div className="fixed inset-0 z-80 grid items-end justify-center p-4 max-[520px]:p-2.5">
      <HalftoneBackdrop seed="sticker-picker" onClick={handleClose} />
      <motion.div
        ref={trapRef}
        className="relative w-[min(94vw,440px)] outline-none"
        role="dialog"
        aria-modal="true"
        aria-labelledby={labelledBy}
        tabIndex={-1}
        initial={{ y: '115%', opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: '118%', opacity: 0, transition: { duration: 0.22, ease: [0.5, 0, 0.9, 0.4] } }}
        transition={{ type: 'spring', stiffness: 380, damping: 34, mass: 0.9 }}
      >
        {/* the drawer which brings its own inked wobble frame + paper.
            px-2/-mx-2 keeps that frame's outset border clear of the scroll clip. */}
        <div className="relative -mx-2 max-h-[calc(100dvh-2.5rem)] overflow-y-auto overflow-x-hidden overscroll-contain px-2 [filter:drop-shadow(2px_4px_4px_rgba(42,27,16,0.3))]">
          <button
            type="button"
            className="absolute right-2 top-1 z-2 grid h-9.5 w-9.5 place-items-center bg-ink font-display text-[1.05rem] text-foam clip-persona-chip hover:bg-red"
            onClick={handleClose}
            aria-label="close"
          >
            ✕
          </button>
          {children}
        </div>
      </motion.div>
    </div>,
    document.body,
  )
}
