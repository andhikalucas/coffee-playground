import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import type { ReactNode } from 'react'
import { useReducedMotion } from 'motion/react'
import { loadVault, updateVault } from '../lib/storage'
import { primeAudio, setSfxMuted, setSfxVolume } from '../audio/sfx'

interface SettingsValue {
  muted: boolean
  volume: number
  reducedMotion: boolean
  setMuted: (m: boolean) => void
  setVolume: (v: number) => void
}

const SettingsContext = createContext<SettingsValue | null>(null)

export function SettingsProvider({ children }: { children: ReactNode }) {
  const initial = loadVault().settings
  const [muted, setMutedState] = useState(initial.muted)
  const [volume, setVolumeState] = useState(initial.volume)
  const reducedMotion = !!useReducedMotion()

  useEffect(() => {
    primeAudio()
  }, [])

  useEffect(() => {
    setSfxMuted(muted)
  }, [muted])

  useEffect(() => {
    setSfxVolume(volume)
  }, [volume])

  const setMuted = useCallback((m: boolean) => {
    setMutedState(m)
    updateVault((v) => {
      v.settings.muted = m
    })
  }, [])

  const setVolume = useCallback((vol: number) => {
    setVolumeState(vol)
    updateVault((v) => {
      v.settings.volume = vol
    })
  }, [])

  const value = useMemo(
    () => ({ muted, volume, reducedMotion, setMuted, setVolume }),
    [muted, volume, reducedMotion, setMuted, setVolume],
  )

  return <SettingsContext.Provider value={value}>{children}</SettingsContext.Provider>
}

// eslint-disable-next-line react-refresh/only-export-components -- hooks co-located with their provider is the idiom here
export function useSettings(): SettingsValue {
  const v = useContext(SettingsContext)
  if (!v) throw new Error('useSettings outside SettingsProvider')
  return v
}
