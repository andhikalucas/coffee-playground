import type { ArtProps } from '../registry'

/** Gooseneck kettle — all neck, no goose. */
export function Kettle({ className }: ArtProps) {
  return (
    <svg viewBox="0 0 120 120" className={className} aria-hidden="true">
      {/* counterweight handle */}
      <path
        d="M 48 38 Q 60 18 84 30"
        fill="none"
        stroke="var(--ink)"
        strokeWidth="5.2"
        strokeLinecap="round"
      />
      <path
        d="M 48 38 Q 60 18 84 30"
        fill="none"
        stroke="var(--caramel)"
        strokeWidth="2.4"
        strokeLinecap="round"
      />
      {/* lid */}
      <path d="M 50 43 Q 64 36.6 80 42" fill="var(--paper-deep)" stroke="var(--ink)" strokeWidth="2.8" strokeLinejoin="round" />
      <circle cx="65" cy="38.6" r="3.4" fill="var(--roast)" stroke="var(--ink)" strokeWidth="2" />
      {/* body */}
      <path
        d="M 47 44.6 L 83 43.4 Q 92 64 88.6 86 Q 87.6 94.6 78 95.6 L 53 96.4 Q 43.6 96 42 87 Q 38.6 64.6 47 44.6 Z"
        fill="var(--foam)"
        stroke="var(--ink)"
        strokeWidth="3"
        strokeLinejoin="round"
      />
      {/* shine */}
      <path d="M 50 54 Q 48 68 50.6 82" fill="none" stroke="var(--ink-faint)" strokeWidth="2" strokeLinecap="round" opacity="0.6" />
      {/* gooseneck spout */}
      <path
        d="M 44 58 Q 22 56 18.6 38 Q 17.4 30 24 25"
        fill="none"
        stroke="var(--ink)"
        strokeWidth="6.4"
        strokeLinecap="round"
      />
      <path
        d="M 44 58 Q 22 56 18.6 38 Q 17.4 30 24 25"
        fill="none"
        stroke="var(--foam)"
        strokeWidth="3"
        strokeLinecap="round"
      />
      {/* pour tip */}
      <path d="M 24.4 25.6 L 19 19.4" stroke="var(--ink)" strokeWidth="4" strokeLinecap="round" />
      {/* steam from the spout */}
      <path
        className="art-steam"
        d="M 17 14 Q 14.4 9 18 4.6"
        fill="none"
        stroke="var(--ink-faint)"
        strokeWidth="2.4"
        strokeLinecap="round"
      />
      <path
        className="art-steam-2"
        d="M 24 12.6 Q 26.6 8 24 3"
        fill="none"
        stroke="var(--ink-faint)"
        strokeWidth="2.2"
        strokeLinecap="round"
      />
      {/* temp scribble */}
      <path d="M 60 64 Q 66 60 71 64 Q 66 68 60 64 Z" fill="none" stroke="var(--red)" strokeWidth="1.8" opacity="0.85" />
      <path d="M 64 73 L 67.4 73" stroke="var(--red)" strokeWidth="1.8" strokeLinecap="round" opacity="0.85" />
    </svg>
  )
}
