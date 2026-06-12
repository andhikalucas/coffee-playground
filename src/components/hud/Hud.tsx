import { PersonaDate } from './PersonaDate'
import { SceneNav } from './SceneNav'
import { MuteToggle } from './MuteToggle'
import { RadioPanel } from './RadioPanel'
import styles from './hud.module.css'

/** Everything pinned to the screen edges. All of it is data-no-export. */
export function Hud() {
  return (
    <div data-no-export="true">
      <PersonaDate />
      <SceneNav />
      <div className={styles.corner} style={{ left: 20, bottom: 20 }}>
        <MuteToggle />
      </div>
      <RadioPanel />
    </div>
  )
}
