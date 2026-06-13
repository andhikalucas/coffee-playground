import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { TornEdge } from './TornEdge'
import { setToastEmitter } from './toastBus'

export function ToastHost() {
  const [msg, setMsg] = useState<string | null>(null)
  const timer = useRef<number | undefined>(undefined)

  useEffect(() => {
    setToastEmitter((m: string) => {
      setMsg(m)
      if (timer.current !== undefined) window.clearTimeout(timer.current)
      timer.current = window.setTimeout(() => setMsg(null), 3200)
    })
    return () => {
      setToastEmitter(null)
      if (timer.current !== undefined) window.clearTimeout(timer.current)
    }
  }, [])

  return (
    <div
      className="pointer-events-none fixed bottom-6.5 left-1/2 z-90"
      role="status"
      aria-live="polite"
    >
      <AnimatePresence>
        {msg && (
          <motion.div
            key={msg}
            initial={{ y: 40, opacity: 0, rotate: 2, x: '-50%' }}
            animate={{ y: 0, opacity: 1, rotate: -1, x: '-50%' }}
            exit={{ y: 20, opacity: 0, x: '-50%' }}
            transition={{ type: 'spring', stiffness: 420, damping: 24 }}
          >
            <TornEdge edges="all" tooth={8} depth={4} shadow>
              <div className="bg-paper-deep px-6.5 py-3 font-hand text-[1.02rem] text-ink">{msg}</div>
            </TornEdge>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
