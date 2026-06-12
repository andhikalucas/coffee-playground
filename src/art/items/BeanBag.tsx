import type { ArtProps } from '../registry'

/** A kraft bag of single-origin somethings. */
export function BeanBag({ className }: ArtProps) {
  return (
    <svg viewBox="0 0 120 120" className={className} aria-hidden="true">
      {/* rolled top */}
      <path
        d="M 36 26 Q 35 19.6 41.6 19.4 L 79 18 Q 85.6 18 85 24.6 L 84.4 32 L 37 33.6 Z"
        fill="var(--kraft-deep)"
        stroke="var(--ink)"
        strokeWidth="3"
        strokeLinejoin="round"
      />
      <path d="M 37 27.4 L 84.6 25.6" stroke="var(--ink)" strokeWidth="1.8" opacity="0.6" />
      {/* bag body, slightly slumped */}
      <path
        d="M 37 33.6 L 84.4 32 Q 88.4 56 86.6 82 Q 86.2 92.4 79.6 96.6 Q 60 101.4 43.6 98 Q 36.4 95.6 35.6 86 Q 33.6 58 37 33.6 Z"
        fill="var(--kraft)"
        stroke="var(--ink)"
        strokeWidth="3"
        strokeLinejoin="round"
      />
      {/* crease lines */}
      <path
        d="M 42 40 Q 41 64 42.4 90"
        fill="none"
        stroke="var(--roast)"
        strokeWidth="1.7"
        opacity="0.4"
        strokeLinecap="round"
      />
      <path
        d="M 79.6 38.6 Q 81.6 62 79.4 91"
        fill="none"
        stroke="var(--roast)"
        strokeWidth="1.7"
        opacity="0.4"
        strokeLinecap="round"
      />
      {/* stamp */}
      <circle cx="60.6" cy="60" r="14.4" fill="var(--paper)" stroke="var(--ink)" strokeWidth="2.4" />
      <g transform="rotate(-16 60.6 60)">
        <ellipse cx="60.6" cy="60" rx="6" ry="8.4" fill="var(--roast)" stroke="var(--ink)" strokeWidth="2" />
        <path
          d="M 59 53 Q 63 60 59.6 66.6"
          fill="none"
          stroke="var(--ink)"
          strokeWidth="1.8"
          strokeLinecap="round"
        />
      </g>
      <path
        d="M 49 76 Q 60 79.4 72.6 76.4"
        fill="none"
        stroke="var(--ink)"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
      {/* stitching */}
      <path
        d="M 40 94.6 L 82 92.6"
        stroke="var(--ink)"
        strokeWidth="1.8"
        strokeDasharray="4 4"
        strokeLinecap="round"
      />
      {/* spilled beans */}
      <g transform="rotate(40 24 102)">
        <ellipse cx="24" cy="102" rx="4.6" ry="6" fill="var(--roast)" stroke="var(--ink)" strokeWidth="1.8" />
        <path
          d="M 22.6 97.6 Q 26 102 23 106"
          fill="none"
          stroke="var(--ink)"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
      </g>
      <g transform="rotate(-28 97 100)">
        <ellipse
          cx="97"
          cy="100"
          rx="4.2"
          ry="5.6"
          fill="var(--caramel)"
          stroke="var(--ink)"
          strokeWidth="1.8"
        />
        <path
          d="M 95.8 96 Q 98.6 100 96.2 103.6"
          fill="none"
          stroke="var(--ink)"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
      </g>
    </svg>
  )
}
