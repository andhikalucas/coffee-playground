import type { ArtProps } from '../registry'

/** The latte-art wand. */
export function MilkPitcher({ className }: ArtProps) {
  return (
    <svg viewBox="0 0 120 120" className={className} aria-hidden="true">
      {/* spout + rim */}
      <path
        d="M 38 30 L 30 21.4 Q 28 19 31.4 18.6 L 44 17 Q 60 14.6 78 17.4 L 84 18.4"
        fill="none"
        stroke="var(--ink)"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* body */}
      <path
        d="M 38 30 L 31.6 19.6 L 84 18.4 L 80 30 L 76.4 92 Q 76 99 68 99.6 L 50 100.2 Q 42.6 100 42 92.6 Z"
        fill="var(--foam)"
        stroke="var(--ink)"
        strokeWidth="3"
        strokeLinejoin="round"
      />
      {/* milk surface */}
      <path
        d="M 39.6 31 Q 58 26 79.4 30.4"
        fill="none"
        stroke="var(--ink)"
        strokeWidth="2.2"
        opacity="0.6"
      />
      {/* swirl on the milk */}
      <path
        d="M 54 25.6 Q 60 22.6 65 25 Q 61 27.6 57 26 Q 59.6 24 62 25"
        fill="none"
        stroke="var(--ink-faint)"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
      {/* handle */}
      <path
        d="M 79 36 Q 95.6 38 93.4 53 Q 91.6 66 77.6 67.4"
        fill="none"
        stroke="var(--ink)"
        strokeWidth="5"
        strokeLinecap="round"
      />
      {/* shine */}
      <path d="M 48 42 Q 46.4 64 48.6 88" fill="none" stroke="var(--ink-faint)" strokeWidth="2" strokeLinecap="round" opacity="0.6" />
      {/* tiny heart stamp */}
      <path
        d="M 62 62 Q 64.4 58.4 67 61 Q 69.6 63.4 62.6 69 Q 56 63.6 58.4 61 Q 60.4 58.8 62 62 Z"
        fill="var(--red)"
        stroke="var(--ink)"
        strokeWidth="1.6"
        strokeLinejoin="round"
        opacity="0.92"
      />
    </svg>
  )
}
