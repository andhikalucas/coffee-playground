import type { ArtProps } from '../registry'

/** The patient pour-over cone. */
export function V60({ className }: ArtProps) {
  return (
    <svg viewBox="0 0 120 120" className={className} aria-hidden="true">
      {/* filter peeking out */}
      <path
        d="M 36 26 Q 42 20.4 48 25 Q 54 19.6 60 24.4 Q 66 19.4 72 24.6 Q 78 20.6 84 26"
        fill="var(--foam)"
        stroke="var(--ink)"
        strokeWidth="2.4"
        strokeLinejoin="round"
      />
      {/* cone */}
      <path
        d="M 33 27.6 L 87.4 26.6 Q 78 48 64.6 56.6 L 56.4 57 Q 42 49 33 27.6 Z"
        fill="var(--caramel-soft)"
        stroke="var(--ink)"
        strokeWidth="3"
        strokeLinejoin="round"
      />
      {/* spiral ridges */}
      <path d="M 44 33 L 56 47" stroke="var(--ink)" strokeWidth="1.7" opacity="0.5" />
      <path d="M 58 32.6 L 62 48" stroke="var(--ink)" strokeWidth="1.7" opacity="0.5" />
      <path d="M 74 32 L 64.6 47.4" stroke="var(--ink)" strokeWidth="1.7" opacity="0.5" />
      {/* cone base collar */}
      <path d="M 53 57 L 68 56.6 L 67 62.4 L 54.4 62.8 Z" fill="var(--paper-deep)" stroke="var(--ink)" strokeWidth="2.4" strokeLinejoin="round" />
      {/* drips */}
      <path className="art-drip" d="M 60.4 64 L 60.4 69" stroke="var(--roast)" strokeWidth="3" strokeLinecap="round" />
      {/* server */}
      <path
        d="M 48 64 L 51 70 Q 35 76 35.6 90 Q 36.4 103 50 104.4 L 71 104 Q 84.4 102 85 89.4 Q 85.4 76.4 70 70.4 L 72.6 63.6"
        fill="var(--paper)"
        fillOpacity="0.55"
        stroke="var(--ink)"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* brewed coffee inside */}
      <path
        d="M 38.6 88 Q 60 83 82.4 87.6 Q 81 101.4 70 102.4 L 51 102.8 Q 39.6 101.4 38.6 88 Z"
        fill="var(--roast)"
        stroke="var(--ink)"
        strokeWidth="2.2"
        strokeLinejoin="round"
      />
      {/* handle nub */}
      <path d="M 85 80 Q 92 81.4 90.4 88.4" fill="none" stroke="var(--ink)" strokeWidth="3.6" strokeLinecap="round" />
      {/* measuring marks */}
      <path d="M 41 78 L 46 77.6" stroke="var(--ink)" strokeWidth="1.6" opacity="0.5" />
      <path d="M 41.6 83 L 46.4 82.6" stroke="var(--ink)" strokeWidth="1.6" opacity="0.5" />
    </svg>
  )
}
