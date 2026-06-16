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
  { id: 'cupboard', label: 'the cupboard' },
]

// at ≤1024px the three tabs drop to a centred bar at the bottom edge (full size,
// full labels), bottom-aligned with the mute + radio corner controls. The switch
// is 1024 (not 768) so the top-right tabs never overlap a top-centre scene toggle
// — the widest toggle (maker's ✎ write / ✿ decorate) only clears ~1008px — and it
// matches the maker's single-column breakpoint.
const TAB_BASE = 'relative origin-top px-4 pb-2.5 pt-3.5 font-hand text-[1.02rem] leading-none text-ink'
// each washi tab fades a warm tone; active = opaque + multiply turned off
const TAB_BG = [
  { off: 'bg-caramel/55 mix-blend-multiply', on: 'bg-caramel/95' },
  { off: 'bg-caramel-soft/55 mix-blend-multiply', on: 'bg-caramel-soft/95' },
  { off: 'bg-kraft/60 mix-blend-multiply', on: 'bg-kraft/98' },
  { off: 'bg-kraft-deep/58 mix-blend-multiply', on: 'bg-kraft-deep/95' },
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
    <nav
      className="fixed right-4.5 top-5.5 z-65 flex items-start gap-2.5 max-[1024px]:left-1/2 max-[1024px]:right-auto max-[1024px]:top-auto max-[1024px]:bottom-5 max-[1024px]:-translate-x-1/2 max-[1024px]:items-end"
      aria-label="scenes"
    >
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
