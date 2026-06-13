import { PersonaDate } from './PersonaDate'
import { SceneNav } from './SceneNav'
import { MuteToggle } from './MuteToggle'
import { RadioPanel } from './RadioPanel'

/** Everything pinned to the screen edges. All of it is data-no-export. */
export function Hud() {
  return (
    <div data-no-export="true">
      <PersonaDate />
      <SceneNav />
      <div className="fixed z-65" style={{ left: 20, bottom: 20 }}>
        <MuteToggle />
      </div>
      <RadioPanel />
    </div>
  )
}
