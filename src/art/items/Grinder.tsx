import type { ArtProps } from '../registry'

/** Hand grinder — arm day is every day. */
export function Grinder({ className }: ArtProps) {
  return (
    <svg viewBox="0 0 120 120" className={className} aria-hidden="true">
      {/* crank arm (waves hello) */}
      <g className="art-crank">
        <path d="M 62 26 Q 78 14.6 92 18" fill="none" stroke="var(--ink)" strokeWidth="4.6" strokeLinecap="round" />
        <circle cx="95.4" cy="18.6" r="5.4" fill="var(--caramel)" stroke="var(--ink)" strokeWidth="2.4" />
      </g>
      {/* hopper dome */}
      <path
        d="M 46 34 Q 60 24 75 33.4 L 71.6 41 L 49.6 41.6 Z"
        fill="var(--paper-deep)"
        stroke="var(--ink)"
        strokeWidth="2.8"
        strokeLinejoin="round"
      />
      <circle cx="60.6" cy="28.4" r="3" fill="var(--ink)" />
      {/* metal collar */}
      <path d="M 47 41.6 L 73.6 41 L 72.4 49 L 48.4 49.6 Z" fill="var(--kraft-deep)" stroke="var(--ink)" strokeWidth="2.6" strokeLinejoin="round" />
      {/* wooden box */}
      <path
        d="M 38 50.6 Q 36.6 49 39.6 49 L 81 48.4 Q 84 48.4 83.4 51 L 84.4 98 Q 84.4 102 80.4 102 L 41 102.8 Q 37 102.8 37.2 99 Z"
        fill="var(--kraft)"
        stroke="var(--ink)"
        strokeWidth="3"
        strokeLinejoin="round"
      />
      {/* wood grain squiggles */}
      <path d="M 44 58 Q 56 56 64 58.4 Q 74 60.6 78 58.6" fill="none" stroke="var(--roast)" strokeWidth="1.7" opacity="0.55" strokeLinecap="round" />
      <path d="M 46 66 Q 58 68.4 76 66" fill="none" stroke="var(--roast)" strokeWidth="1.7" opacity="0.45" strokeLinecap="round" />
      {/* drawer */}
      <path
        d="M 43 80 L 78.6 79.4 L 79.4 97 L 43.6 97.6 Z"
        fill="var(--kraft-deep)"
        stroke="var(--ink)"
        strokeWidth="2.6"
        strokeLinejoin="round"
      />
      <circle cx="61" cy="88.4" r="3.6" fill="var(--roast)" stroke="var(--ink)" strokeWidth="2" />
      {/* a stray bean by the base */}
      <g transform="rotate(24 26 99)">
        <ellipse cx="26" cy="99" rx="5" ry="6.6" fill="var(--roast)" stroke="var(--ink)" strokeWidth="2" />
        <path d="M 24.6 94 Q 28 99 25 103.6" fill="none" stroke="var(--ink)" strokeWidth="1.7" strokeLinecap="round" />
      </g>
    </svg>
  )
}
