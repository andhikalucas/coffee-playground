import { useEffect, useState } from 'react'
import { useScene } from './state/SceneContext'
import { setSaveErrorHandler, flushVault } from './lib/storage'
import { PaperGrain } from './components/handmade/PaperGrain'
import { CoffeeStainDecor } from './components/handmade/CoffeeStainDecor'
import { ToastHost } from './components/handmade/Toast'
import { showToast } from './components/handmade/toastBus'
import { Hud } from './components/hud/Hud'
import { SceneTransition } from './components/SceneTransition'
import { PlaygroundScene } from './playground/PlaygroundScene'
import { RecipeMakerScene } from './recipe/RecipeMakerScene'
import { GalleryScene } from './gallery/GalleryScene'
import styles from './AppShell.module.css'

/** Wait for the hand-written fonts so nothing flashes Times New Roman. */
function useFontBoot() {
  const [ready, setReady] = useState(false)
  useEffect(() => {
    let done = false
    const timeout = window.setTimeout(() => {
      if (!done) setReady(true)
    }, 800)
    document.fonts.ready.then(() => {
      done = true
      window.clearTimeout(timeout)
      setReady(true)
    })
    return () => window.clearTimeout(timeout)
  }, [])
  return ready
}

export function AppShell() {
  const { scene } = useScene()
  const fontsReady = useFontBoot()

  useEffect(() => {
    setSaveErrorHandler(() => showToast('the board is overflowing — maybe delete a card or two?'))
  }, [])

  // never let the debounce window eat the last edits before a tab close
  useEffect(() => {
    const flush = () => flushVault()
    const onVisibility = () => {
      if (document.visibilityState === 'hidden') flushVault()
    }
    window.addEventListener('pagehide', flush)
    document.addEventListener('visibilitychange', onVisibility)
    return () => {
      window.removeEventListener('pagehide', flush)
      document.removeEventListener('visibilitychange', onVisibility)
    }
  }, [])

  return (
    <div className={`${styles.shell} ${fontsReady ? 'boot-ready' : 'boot-hidden'}`}>
      {/* careless mug marks */}
      <CoffeeStainDecor seed="shell-1" size={170} style={{ top: '8%', right: '12%' }} />
      <CoffeeStainDecor seed="shell-2" size={110} opacity={0.1} style={{ bottom: '14%', left: '7%' }} />
      <CoffeeStainDecor seed="shell-3" size={84} opacity={0.09} style={{ top: '55%', right: '4%' }} />

      <main className={styles.sceneHost}>
        {scene === 'playground' && <PlaygroundScene />}
        {scene === 'maker' && <RecipeMakerScene />}
        {scene === 'gallery' && <GalleryScene />}
      </main>

      <Hud />
      <SceneTransition />
      <PaperGrain />
      <ToastHost />
    </div>
  )
}
