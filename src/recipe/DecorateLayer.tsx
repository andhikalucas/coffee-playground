import { useEffect, useLayoutEffect, useMemo, useRef } from 'react'
import type { RefObject } from 'react'
import { motion, useMotionValue } from 'motion/react'
import type { Recipe, RecipeDecor, StickerPlacement, TapePlacement } from '../state/types'
import { STICKERS } from '../art/stickers/registry'
import { WashiTape } from '../components/handmade/WashiTape'
import { wobblyEllipsePath } from '../lib/wobble'
import { useSfx } from '../audio/useSfx'
import styles from './recipe.module.css'

export interface DecorateProps {
  selectedId: string | null
  onSelect: (id: string | null) => void
  updateDecor: (mutate: (d: RecipeDecor) => void) => void
  cardRef: RefObject<HTMLDivElement | null>
}

interface DecorateLayerProps {
  recipe: Recipe
  interactive: boolean
  decorate?: DecorateProps
}

const TAPE_HEIGHT = 26

/** Stickers and tape riding on top of the card. */
export function DecorateLayer({ recipe, interactive, decorate }: DecorateLayerProps) {
  if (interactive && decorate) {
    return <InteractiveLayer recipe={recipe} decorate={decorate} />
  }
  return (
    <div className={`${styles.decorLayer} ${styles.decorLayerPassive}`} aria-hidden="true">
      {recipe.decor.tapes.map((t) => (
        <div key={t.id} className={styles.decorItem} style={tapeStyle(t)}>
          <WashiTape
            variant={t.variant}
            length={t.length}
            seed={t.id}
            style={{ position: 'static', display: 'block' }}
          />
        </div>
      ))}
      {recipe.decor.stickers.map((s) => {
        const Doodle = STICKERS[s.stickerId].Component
        return (
          <div key={s.id} className={styles.decorItem} style={stickerStyle(s)}>
            <Doodle />
          </div>
        )
      })}
    </div>
  )
}

function stickerStyle(s: StickerPlacement) {
  const size = STICKERS[s.stickerId].baseSize * s.scale
  return {
    left: `${s.x * 100}%`,
    top: `${s.y * 100}%`,
    width: size,
    height: size,
    marginLeft: -size / 2,
    marginTop: -size / 2,
    transform: `rotate(${s.rotation}deg)`,
  }
}

function tapeStyle(t: TapePlacement) {
  return {
    left: `${t.x * 100}%`,
    top: `${t.y * 100}%`,
    width: t.length,
    height: TAPE_HEIGHT,
    marginLeft: -t.length / 2,
    marginTop: -TAPE_HEIGHT / 2,
    transform: `rotate(${t.rotation}deg)`,
  }
}

/* ————— interactive (decorate mode) ————— */

function InteractiveLayer({ recipe, decorate }: { recipe: Recipe; decorate: DecorateProps }) {
  return (
    <div
      className={styles.decorLayer}
      onPointerDown={(e) => {
        if (e.target === e.currentTarget) decorate.onSelect(null)
      }}
    >
      {recipe.decor.tapes.map((t) => (
        <DecorInstance
          key={t.id}
          id={t.id}
          kind="tape"
          x={t.x}
          y={t.y}
          rotation={t.rotation}
          width={t.length}
          height={TAPE_HEIGHT}
          decorate={decorate}
        >
          <WashiTape
            variant={t.variant}
            length={t.length}
            seed={t.id}
            style={{ position: 'static', display: 'block', pointerEvents: 'none' }}
          />
        </DecorInstance>
      ))}
      {recipe.decor.stickers.map((s) => {
        const def = STICKERS[s.stickerId]
        const Doodle = def.Component
        const size = def.baseSize * s.scale
        return (
          <DecorInstance
            key={s.id}
            id={s.id}
            kind="sticker"
            x={s.x}
            y={s.y}
            rotation={s.rotation}
            width={size}
            height={size}
            decorate={decorate}
          >
            <Doodle />
          </DecorInstance>
        )
      })}
    </div>
  )
}

interface DecorInstanceProps {
  id: string
  kind: 'sticker' | 'tape'
  x: number
  y: number
  rotation: number
  width: number
  height: number
  decorate: DecorateProps
  children: React.ReactNode
}

function mutatePlacement(
  decor: RecipeDecor,
  kind: 'sticker' | 'tape',
  id: string,
  fn: (p: { x: number; y: number; rotation: number }) => void,
) {
  const target =
    kind === 'sticker' ? decor.stickers.find((s) => s.id === id) : decor.tapes.find((t) => t.id === id)
  if (target) fn(target)
}

const clampFrac = (n: number) => Math.min(1.06, Math.max(-0.06, n))

/** One draggable, spinnable, deletable decoration. */
function DecorInstance({ id, kind, x, y, rotation, width, height, decorate, children }: DecorInstanceProps) {
  const play = useSfx()
  const { selectedId, onSelect, updateDecor, cardRef } = decorate
  const selected = selectedId === id
  const dx = useMotionValue(0)
  const dy = useMotionValue(0)
  const elRef = useRef<HTMLDivElement | null>(null)

  // placement committed → clear the drag delta in the same paint
  useLayoutEffect(() => {
    dx.set(0)
    dy.set(0)
  }, [x, y, dx, dy])

  // wheel-to-spin, only while selected & hovered (non-passive on purpose)
  useEffect(() => {
    const el = elRef.current
    if (!el || !selected) return
    const onWheel = (e: WheelEvent) => {
      e.preventDefault()
      const dir = e.deltaY > 0 ? 3 : -3
      updateDecor((d) => mutatePlacement(d, kind, id, (p) => (p.rotation = (p.rotation + dir) % 360)))
    }
    el.addEventListener('wheel', onWheel, { passive: false })
    return () => el.removeEventListener('wheel', onWheel)
  }, [selected, id, kind, updateDecor])

  const ring = useMemo(
    () =>
      wobblyEllipsePath((width + 24) / 2, (height + 24) / 2, (width + 18) / 2, (height + 18) / 2, {
        seed: 'ring-' + id,
        amplitude: 2.4,
      }),
    [width, height, id],
  )

  const startRotate = (e: React.PointerEvent) => {
    e.preventDefault()
    e.stopPropagation()
    const el = elRef.current
    if (!el) return
    const move = (ev: PointerEvent) => {
      const rect = el.getBoundingClientRect()
      const cx = rect.left + rect.width / 2
      const cy = rect.top + rect.height / 2
      const angle = (Math.atan2(ev.clientY - cy, ev.clientX - cx) * 180) / Math.PI + 90
      updateDecor((d) => mutatePlacement(d, kind, id, (p) => (p.rotation = Math.round(angle))))
    }
    const up = () => {
      window.removeEventListener('pointermove', move)
      window.removeEventListener('pointerup', up)
    }
    window.addEventListener('pointermove', move)
    window.addEventListener('pointerup', up)
  }

  const remove = () => {
    play('swish')
    onSelect(null)
    updateDecor((d) => {
      if (kind === 'sticker') d.stickers = d.stickers.filter((s) => s.id !== id)
      else d.tapes = d.tapes.filter((t) => t.id !== id)
    })
  }

  return (
    <motion.div
      ref={elRef}
      className={`${styles.decorItem} ${styles.decorItemInteractive}`}
      style={{
        left: `${x * 100}%`,
        top: `${y * 100}%`,
        width,
        height,
        marginLeft: -width / 2,
        marginTop: -height / 2,
        x: dx,
        y: dy,
        rotate: rotation,
        zIndex: selected ? 3 : 1,
      }}
      drag
      dragMomentum={false}
      onDragStart={() => {
        onSelect(id)
        play('pop')
      }}
      onDragEnd={() => {
        const rect = cardRef.current?.getBoundingClientRect()
        if (!rect) return
        // motion's x/y are pre-rotation translations of the un-rotated frame,
        // so the delta maps straight onto card fractions
        const nx = clampFrac(x + dx.get() / rect.width)
        const ny = clampFrac(y + dy.get() / rect.height)
        updateDecor((d) =>
          mutatePlacement(d, kind, id, (p) => {
            p.x = nx
            p.y = ny
          }),
        )
        play('thump')
      }}
      onTap={() => onSelect(id)}
      tabIndex={0}
      role="button"
      aria-label={`${kind} decoration${selected ? ' (selected)' : ''}`}
      onKeyDown={(e) => {
        if (e.key === 'Backspace' || e.key === 'Delete') {
          e.preventDefault()
          remove()
          return
        }
        const nudge = (fx: number, fy: number) => {
          e.preventDefault()
          updateDecor((d) =>
            mutatePlacement(d, kind, id, (p) => {
              p.x = clampFrac(p.x + fx)
              p.y = clampFrac(p.y + fy)
            }),
          )
        }
        if (e.key === 'ArrowLeft') nudge(-0.01, 0)
        if (e.key === 'ArrowRight') nudge(0.01, 0)
        if (e.key === 'ArrowUp') nudge(0, -0.01)
        if (e.key === 'ArrowDown') nudge(0, 0.01)
      }}
      onFocus={() => onSelect(id)}
    >
      {children}
      {selected && (
        <>
          <svg className={styles.selectRing} viewBox={`0 0 ${width + 24} ${height + 24}`} aria-hidden="true">
            <path
              d={ring}
              fill="none"
              stroke="var(--red)"
              strokeWidth={2}
              strokeDasharray="7 6"
              strokeLinecap="round"
            />
          </svg>
          <button
            type="button"
            className={styles.rotateHandle}
            onPointerDown={startRotate}
            aria-label="rotate (drag me, or scroll on the sticker)"
            title="drag to rotate"
          >
            ↻
          </button>
          <button type="button" className={styles.deleteChip} onClick={remove} aria-label="remove decoration">
            ✕
          </button>
        </>
      )}
    </motion.div>
  )
}
