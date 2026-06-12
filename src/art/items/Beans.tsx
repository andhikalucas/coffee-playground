import type { ArtProps } from '../registry'

/** Three beans, one showing off. */
export function Beans({ className }: ArtProps) {
  return (
    <svg viewBox="0 0 120 120" className={className} aria-hidden="true">
      {/* the big one */}
      <g transform="rotate(-14 60 55)">
        <path
          d="M 60 26 Q 79 28 81 52 Q 82 76 61 80 Q 42 77 41 52 Q 41 30 60 26 Z"
          fill="var(--roast)"
          stroke="var(--ink)"
          strokeWidth="3"
          strokeLinejoin="round"
        />
        <path
          d="M 58 30 Q 69 43 60 54 Q 51 66 63 76"
          fill="none"
          stroke="var(--ink)"
          strokeWidth="2.6"
          strokeLinecap="round"
        />
      </g>
      {/* the sidekick */}
      <g transform="rotate(32 92 78)">
        <path
          d="M 92 60 Q 104 62 105 77 Q 105 92 92 94 Q 80 92 80 77 Q 80 62 92 60 Z"
          fill="var(--caramel)"
          stroke="var(--ink)"
          strokeWidth="2.8"
          strokeLinejoin="round"
        />
        <path
          d="M 90 63 Q 97 71 91 78 Q 86 85 93 91"
          fill="none"
          stroke="var(--ink)"
          strokeWidth="2.2"
          strokeLinecap="round"
        />
      </g>
      {/* the little one */}
      <g transform="rotate(68 32 88)">
        <path
          d="M 32 76 Q 41 77 42 88 Q 42 99 32 100 Q 23 99 23 88 Q 23 78 32 76 Z"
          fill="var(--roast)"
          stroke="var(--ink)"
          strokeWidth="2.6"
          strokeLinejoin="round"
        />
        <path
          d="M 30.5 78 Q 36 84 31.5 89 Q 28 94 33 98"
          fill="none"
          stroke="var(--ink)"
          strokeWidth="2"
          strokeLinecap="round"
        />
      </g>
      {/* sparkle */}
      <g stroke="var(--ink)" strokeWidth="2.4" strokeLinecap="round">
        <path d="M 92 24 L 92 36" />
        <path d="M 86 30 L 98 30" />
        <path d="M 24 38 L 24 46" />
        <path d="M 20 42 L 28 42" />
      </g>
    </svg>
  )
}
