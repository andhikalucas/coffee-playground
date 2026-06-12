import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react'
import type { ReactNode } from 'react'
import type { SceneId } from './types'
import { useSettings } from './SettingsContext'
import { playSfx } from '../audio/sfx'

export type TransitionPhase = 'idle' | 'covering' | 'revealing'

interface SceneValue {
  scene: SceneId
  phase: TransitionPhase
  goTo: (next: SceneId) => void
}

const SceneContext = createContext<SceneValue | null>(null)

/** Wipe timing — the scene swaps while the bands cover the viewport. */
export const WIPE = { coverMs: 460, totalMs: 1050 }
const WIPE_REDUCED = { coverMs: 90, totalMs: 220 }

export function SceneProvider({ children }: { children: ReactNode }) {
  const { muted, reducedMotion } = useSettings()
  const [scene, setScene] = useState<SceneId>('playground')
  const [phase, setPhase] = useState<TransitionPhase>('idle')
  const timers = useRef<number[]>([])

  const sceneRef = useRef(scene)
  sceneRef.current = scene
  const phaseRef = useRef(phase)
  phaseRef.current = phase
  const mutedRef = useRef(muted)
  mutedRef.current = muted

  useEffect(
    () => () => {
      timers.current.forEach((t) => window.clearTimeout(t))
    },
    [],
  )

  const goTo = useCallback(
    (next: SceneId) => {
      if (phaseRef.current !== 'idle' || sceneRef.current === next) return
      const t = reducedMotion ? WIPE_REDUCED : WIPE
      setPhase('covering')
      if (!mutedRef.current) playSfx('swish')
      timers.current.push(
        window.setTimeout(() => {
          setScene(next)
          setPhase('revealing')
        }, t.coverMs),
        window.setTimeout(() => setPhase('idle'), t.totalMs),
      )
    },
    [reducedMotion],
  )

  const value = useMemo(() => ({ scene, phase, goTo }), [scene, phase, goTo])
  return <SceneContext.Provider value={value}>{children}</SceneContext.Provider>
}

export function useScene(): SceneValue {
  const v = useContext(SceneContext)
  if (!v) throw new Error('useScene outside SceneProvider')
  return v
}
