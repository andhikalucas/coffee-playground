import type { ArtProps } from '../registry'

/** A flat white with a heart that came out mostly heart-shaped. */
export function Cup({ className }: ArtProps) {
  return (
    <svg viewBox="0 0 120 120" className={className} aria-hidden="true">
      {/* steam */}
      <path
        className="art-steam"
        d="M 50 26 Q 46.6 18.6 51 11.6"
        fill="none"
        stroke="var(--ink-faint)"
        strokeWidth="2.6"
        strokeLinecap="round"
      />
      <path
        className="art-steam-2"
        d="M 64 25 Q 68 17.6 64 10"
        fill="none"
        stroke="var(--ink-faint)"
        strokeWidth="2.4"
        strokeLinecap="round"
      />
      {/* cup opening */}
      <ellipse cx="58" cy="43" rx="29" ry="10.4" fill="var(--foam)" stroke="var(--ink)" strokeWidth="3" />
      {/* coffee surface */}
      <ellipse cx="58" cy="43.4" rx="23.6" ry="7.6" fill="var(--caramel-soft)" stroke="var(--ink)" strokeWidth="2" />
      {/* latte heart */}
      <path
        d="M 57.6 41 Q 60 36.6 63.4 39.4 Q 66.6 42 58.4 48.4 Q 50.4 42.6 53.4 39.6 Q 55.8 37.4 57.6 41 Z"
        fill="var(--foam)"
        stroke="var(--roast)"
        strokeWidth="1.8"
        strokeLinejoin="round"
      />
      {/* cup body */}
      <path
        d="M 29.6 45 Q 31 70 41 79.4 Q 49 86.6 67 86 Q 76 85 81.4 76 Q 86.6 67 87 45.6"
        fill="var(--foam)"
        stroke="var(--ink)"
        strokeWidth="3"
        strokeLinecap="round"
      />
      {/* scribble on the cup */}
      <path d="M 44 62 Q 50 57.6 56 62 Q 62 66 68 61.4" fill="none" stroke="var(--red)" strokeWidth="2" strokeLinecap="round" opacity="0.85" />
      {/* handle */}
      <path
        d="M 86 52 Q 99.6 52.4 98 63 Q 96.4 73 84 73.6"
        fill="none"
        stroke="var(--ink)"
        strokeWidth="4.6"
        strokeLinecap="round"
      />
      {/* saucer */}
      <path
        d="M 24 92 Q 58 86.6 93.4 91 Q 94.6 94 90 95.4 Q 59 100.6 27.6 96 Q 23 94.6 24 92 Z"
        fill="var(--paper-deep)"
        stroke="var(--ink)"
        strokeWidth="2.8"
        strokeLinejoin="round"
      />
    </svg>
  )
}
