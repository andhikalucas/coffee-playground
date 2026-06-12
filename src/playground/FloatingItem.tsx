import { useRef } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { ART } from '../art/registry'
import type { PlaygroundItem } from './items'
import type { FloatField } from './useFloatField'
import { useHoverIntent } from '../hooks/useHoverIntent'
import { useSfx } from '../audio/useSfx'
import { TornEdge } from '../components/handmade/TornEdge'
import styles from './playground.module.css'

interface FloatingItemProps {
  item: PlaygroundItem
  field: FloatField
  onOpen: (id: string) => void
}

/** One drifting, draggable, poke-able thing in the float field. */
export function FloatingItem({ item, field, onOpen }: FloatingItemProps) {
  const play = useSfx()
  const hover = useHoverIntent(180)
  // a real drag must not also count as a tap: motion fires onTap on pointer-up
  // even after a drag, so we remember whether this gesture became a drag and
  // swallow the tap if so. reset at the start of every fresh press.
  const didDrag = useRef(false)
  const handle = field.handles.get(item.id)
  const Art = ART[item.art]
  if (!handle) return null

  return (
    <motion.div
      className={styles.floatItem}
      style={{
        x: handle.x,
        y: handle.y,
        rotate: handle.rotate,
        width: handle.size,
        height: handle.size,
        zIndex: hover.hovered ? 6 : 1,
      }}
      drag
      dragMomentum={false}
      onPointerDown={() => {
        didDrag.current = false
      }}
      onDragStart={() => {
        didDrag.current = true
        field.startDrag(item.id)
        hover.cancel()
        play('pop')
      }}
      onDragEnd={() => {
        field.endDrag(item.id)
        play('thump')
      }}
      onPointerEnter={hover.onPointerEnter}
      onPointerLeave={hover.onPointerLeave}
      onTap={() => {
        // drag just ended — that pointer-up isn't a real click, so don't open
        if (didDrag.current) {
          didDrag.current = false
          return
        }
        onOpen(item.id)
      }}
      role="button"
      tabIndex={0}
      aria-label={`${item.name} — open its card`}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault()
          onOpen(item.id)
        }
      }}
    >
      <motion.div
        className={styles.itemScale}
        animate={{ scale: hover.hovered ? 1.14 : 1 }}
        transition={{ type: 'spring', stiffness: 400, damping: 12 }}
      >
        {/* plain div, no layoutId: in float mode it has no shared-layout partner,
            and a layoutId on a transform-positioned node inside the LayoutGroup
            makes Motion re-project every item from the field origin on each hover
            re-render — the "everything snaps to the top-left" glitch. */}
        <div className={styles.artBox}>
          <Art />
        </div>
        <AnimatePresence>
          {hover.hovered && (
            <motion.div
              className={styles.nameTag}
              initial={{ opacity: 0, y: 8, x: '-50%', rotate: -3 }}
              animate={{ opacity: 1, y: 0, x: '-50%', rotate: -2 }}
              exit={{ opacity: 0, y: 6, x: '-50%' }}
              transition={{ type: 'spring', stiffness: 520, damping: 26 }}
            >
              <TornEdge seed={`tag-${item.id}`} tooth={7} depth={3} shadow>
                <span className={styles.nameTagInner}>{item.name}</span>
              </TornEdge>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </motion.div>
  )
}
