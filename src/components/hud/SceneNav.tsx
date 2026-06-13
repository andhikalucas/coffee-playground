import { useId, useMemo } from 'react'
import { motion } from 'motion/react'
import { useScene } from '../../state/SceneContext'
import type { SceneId } from '../../state/types'
import { tornEdgePolygon } from '../../lib/wobble'
import { tilt } from '../../styles/tokens'
import { useSfx } from '../../audio/useSfx'
import { cn } from '../../lib/cn'

const TABS: Array<{ id: SceneId; label: string }> = [
  { id: 'playground', label: 'playground' },
  { id: 'maker', label: 'make a recipe' },
  { id: 'gallery', label: 'the board' },
]

const TAB_BASE =
  'relative origin-top px-4 pb-2.5 pt-3.5 font-hand text-[1.02rem] leading-none text-ink'
// each washi tab fades a warm tone; active = opaque + multiply turned off
const TAB_BG = [
  { off: 'bg-caramel/55 mix-blend-multiply', on: 'bg-caramel/95' },
  { off: 'bg-caramel-soft/55 mix-blend-multiply', on: 'bg-caramel-soft/95' },
  { off: 'bg-kraft/60 mix-blend-multiply', on: 'bg-kraft/98' },
]

/** Three washi-tape tabs hanging off the top edge. */
export function SceneNav() {
  const { scene, goTo } = useScene()
  const play = useSfx()
  const id = useId()

  const clips = useMemo(
    () =>
      TABS.map((t, i) =>
        tornEdgePolygon(
          120,
          44,
          { bottom: true, left: true, right: true },
          { seed: id + t.id + i, tooth: 7, depth: 4 },
        ),
      ),
    [id],
  )

  return (
    <nav className="fixed right-4.5 top-0 z-65 flex items-start gap-2.5" aria-label="scenes">
      {TABS.map((tab, i) => {
        const active = scene === tab.id
        return (
          <motion.button
            key={tab.id}
            type="button"
            className={cn(TAB_BASE, active ? `${TAB_BG[i].on} font-bold` : TAB_BG[i].off)}
            style={{ clipPath: clips[i], rotate: tilt(tab.id, 2.5) }}
            animate={{ y: active ? 4 : 0, scale: active ? 0.98 : 1 }}
            whileHover={{ y: active ? 4 : 6 }}
            whileTap={{ scale: 0.94 }}
            transition={{ type: 'spring', stiffness: 480, damping: 22 }}
            aria-current={active ? 'page' : undefined}
            onClick={() => {
              play('click')
              goTo(tab.id)
            }}
          >
            {tab.label}
          </motion.button>
        )
      })}
    </nav>
  )
}
