import { useCallback } from 'react'
import { playSfx } from './sfx'
import type { SfxName } from './sfx'
import { useSettings } from '../state/SettingsContext'

/** Mute-aware sound trigger for components. */
export function useSfx() {
  const { muted } = useSettings()
  return useCallback(
    (name: SfxName) => {
      if (!muted) playSfx(name)
    },
    [muted],
  )
}
