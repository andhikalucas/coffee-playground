import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react'
import type { ReactNode } from 'react'
import type { SceneId } from './types'
import { useSettings } from './SettingsContext'
import { playSfx } from '../audio/sfx'

export type TransitionPhase = 'idle' | 'covering' | 'revealing'

interface SceneValue {
  scene: SceneId
  phase: TransitionPhase
  /** bumps once per transition — the wipe keys its bands on this */
  wipeId: number
  goTo: (next: SceneId) => void
}

const SceneContext = createContext<SceneValue | null>(null)

/** Wipe timing — the scene swaps while the bands cover the viewport. */
const WIPE = { coverMs: 460, totalMs: 1050 }
const WIPE_REDUCED = { coverMs: 90, totalMs: 220 }

export function SceneProvider({ children }: { children: ReactNode }) {
  const { muted, reducedMotion } = useSettings()
  const [scene, setScene] = useState<SceneId>('playground')
  const [phase, setPhase] = useState<TransitionPhase>('idle')
  const [wipeId, setWipeId] = useState(0)
  const timers = useRef<number[]>([])

  // guards live in refs and are only touched from event/timer scopes
  const busyRef = useRef(false)
  const sceneRef = useRef<SceneId>('playground')
  const mutedRef = useRef(muted)

  useEffect(() => {
    mutedRef.current = muted
  }, [muted])

  useEffect(
    () => () => {
      timers.current.forEach((t) => window.clearTimeout(t))
    },
    [],
  )

  const goTo = useCallback(
    (next: SceneId) => {
      if (busyRef.current || sceneRef.current === next) return
      busyRef.current = true
      const t = reducedMotion ? WIPE_REDUCED : WIPE
      setPhase('covering')
      setWipeId((n) => n + 1)
      if (!mutedRef.current) playSfx('swish')
      timers.current.push(
        window.setTimeout(() => {
          sceneRef.current = next
          setScene(next)
          setPhase('revealing')
        }, t.coverMs),
        window.setTimeout(() => {
          setPhase('idle')
          busyRef.current = false
        }, t.totalMs),
      )
    },
    [reducedMotion],
  )

  const value = useMemo(() => ({ scene, phase, wipeId, goTo }), [scene, phase, wipeId, goTo])
  return <SceneContext.Provider value={value}>{children}</SceneContext.Provider>
}

// eslint-disable-next-line react-refresh/only-export-components -- hooks co-located with their provider is the idiom here
export function useScene(): SceneValue {
  const v = useContext(SceneContext)
  if (!v) throw new Error('useScene outside SceneProvider')
  return v
}
