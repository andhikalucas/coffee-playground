import { TornEdge } from '../handmade/TornEdge'
import { SceneNav } from './SceneNav'
import { MuteToggle } from './MuteToggle'
import { RadioPanel } from './RadioPanel'
import styles from './hud.module.css'

/** Everything pinned to the screen edges. All of it is data-no-export. */
export function Hud() {
  return (
    <div data-no-export="true">
      <div className={styles.logo} style={{ transform: 'rotate(-2deg)' }}>
        <TornEdge edges="all" seed="logo-scrap" tooth={9} depth={4} shadow>
          <div className={styles.logoInner}>
            <svg className={styles.logoBean} viewBox="0 0 32 32" aria-hidden="true">
              <ellipse
                cx="16"
                cy="16"
                rx="10.5"
                ry="13"
                transform="rotate(18 16 16)"
                fill="var(--roast)"
                stroke="var(--ink)"
                strokeWidth="2"
              />
              <path
                d="M 12 6.5 Q 18 12 14.5 16.5 Q 11 21 17.5 26"
                fill="none"
                stroke="var(--ink)"
                strokeWidth="2.2"
                strokeLinecap="round"
              />
            </svg>
            coffee playground
          </div>
        </TornEdge>
      </div>
      <SceneNav />
      <div className={styles.corner} style={{ left: 20, bottom: 20 }}>
        <MuteToggle />
      </div>
      <RadioPanel />
    </div>
  )
}
