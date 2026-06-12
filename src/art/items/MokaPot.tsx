import type { ArtProps } from '../registry'

/** Nonna's rocket ship. */
export function MokaPot({ className }: ArtProps) {
  return (
    <svg viewBox="0 0 120 120" className={className} aria-hidden="true">
      {/* lid knob */}
      <circle cx="59" cy="13" r="5" fill="var(--roast)" stroke="var(--ink)" strokeWidth="2.6" />
      {/* lid */}
      <path
        d="M 44 24 Q 58 15 75 23.4 L 71 30 L 48 30.6 Z"
        fill="var(--paper-deep)"
        stroke="var(--ink)"
        strokeWidth="2.8"
        strokeLinejoin="round"
      />
      {/* spout beak */}
      <path
        d="M 47 31 L 36 35 Q 33 36.4 35.5 39 L 45 47"
        fill="var(--paper-deep)"
        stroke="var(--ink)"
        strokeWidth="2.8"
        strokeLinejoin="round"
      />
      {/* upper chamber */}
      <path
        d="M 46 30.6 L 73.4 30 L 78 57 L 42 57.8 Z"
        fill="var(--foam)"
        stroke="var(--ink)"
        strokeWidth="3"
        strokeLinejoin="round"
      />
      {/* facets */}
      <path d="M 54 31 L 52.4 57.2" stroke="var(--ink)" strokeWidth="1.7" opacity="0.55" />
      <path d="M 65 30.6 L 67.6 56.8" stroke="var(--ink)" strokeWidth="1.7" opacity="0.55" />
      {/* waist */}
      <path d="M 41 58 L 79 57 L 77 65.4 L 43.4 66.2 Z" fill="var(--paper-deep)" stroke="var(--ink)" strokeWidth="2.6" strokeLinejoin="round" />
      {/* lower chamber */}
      <path
        d="M 43.6 66.2 L 76.8 65.4 L 82 99 Q 82.4 102.6 78 102.8 L 43 103.6 Q 38.6 103.6 39.2 99.6 Z"
        fill="var(--foam)"
        stroke="var(--ink)"
        strokeWidth="3"
        strokeLinejoin="round"
      />
      <path d="M 52 66.6 L 49 103" stroke="var(--ink)" strokeWidth="1.7" opacity="0.55" />
      <path d="M 67 66 L 71.4 102.6" stroke="var(--ink)" strokeWidth="1.7" opacity="0.55" />
      {/* handle */}
      <path
        d="M 76 33 Q 94 32 92.6 46 Q 91.6 57 79 58.8"
        fill="none"
        stroke="var(--ink)"
        strokeWidth="5"
        strokeLinecap="round"
      />
      <path
        d="M 76 33 Q 94 32 92.6 46 Q 91.6 57 79 58.8"
        fill="none"
        stroke="var(--roast)"
        strokeWidth="2.2"
        strokeLinecap="round"
      />
      {/* steam from the spout */}
      <path
        className="art-steam"
        d="M 38 30 Q 35 24 38.6 19.4"
        fill="none"
        stroke="var(--ink-faint)"
        strokeWidth="2.4"
        strokeLinecap="round"
      />
      <path
        className="art-steam-2"
        d="M 31.6 33 Q 28 28 30.6 22.4"
        fill="none"
        stroke="var(--ink-faint)"
        strokeWidth="2.2"
        strokeLinecap="round"
      />
    </svg>
  )
}
