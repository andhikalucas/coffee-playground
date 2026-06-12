import type { ArtProps } from '../registry'

/** The temperamental hero of the counter. */
export function EspressoMachine({ className }: ArtProps) {
  return (
    <svg viewBox="0 0 120 120" className={className} aria-hidden="true">
      {/* drip tray */}
      <path
        d="M 16 102 L 104 100.5 L 102 109 Q 60 112 18 110 Z"
        fill="var(--paper-deep)"
        stroke="var(--ink)"
        strokeWidth="3"
        strokeLinejoin="round"
      />
      {/* body */}
      <path
        d="M 24 14 Q 23 11 27 11 L 94 9.5 Q 98 9.5 98 13 L 100 56 L 97.5 57.5 L 99 100 L 21 101.5 L 23.5 57 L 21.5 55.5 Z"
        fill="var(--foam)"
        stroke="var(--ink)"
        strokeWidth="3"
        strokeLinejoin="round"
      />
      {/* top panel band */}
      <path
        d="M 24 14 L 97.8 12.4 L 98.6 28 L 23.4 30 Z"
        fill="var(--caramel-soft)"
        stroke="var(--ink)"
        strokeWidth="2.6"
        strokeLinejoin="round"
      />
      {/* gauge */}
      <circle cx="38" cy="44" r="8.5" fill="var(--paper)" stroke="var(--ink)" strokeWidth="2.4" />
      <path d="M 38 44 L 43 39.5" stroke="var(--red)" strokeWidth="2.2" strokeLinecap="round" />
      <path d="M 32 49 Q 38 52 44 49" fill="none" stroke="var(--ink)" strokeWidth="1.6" />
      {/* buttons */}
      <circle cx="74" cy="21" r="3.6" fill="var(--red)" stroke="var(--ink)" strokeWidth="2" />
      <circle cx="86" cy="20.4" r="3.6" fill="var(--paper)" stroke="var(--ink)" strokeWidth="2" />
      {/* group head + portafilter */}
      <path
        d="M 52 57 L 76 56.4 L 75 66 L 53 66.6 Z"
        fill="var(--ink)"
        stroke="var(--ink)"
        strokeWidth="2"
        strokeLinejoin="round"
      />
      <path
        d="M 56 66.5 L 72 66 L 70.5 73 L 57.5 73.4 Z"
        fill="var(--paper-deep)"
        stroke="var(--ink)"
        strokeWidth="2.4"
        strokeLinejoin="round"
      />
      {/* portafilter handle */}
      <path
        d="M 75.6 60.5 Q 92 59 100 61.5"
        fill="none"
        stroke="var(--ink)"
        strokeWidth="4.4"
        strokeLinecap="round"
      />
      <circle cx="102.5" cy="62" r="4" fill="var(--roast)" stroke="var(--ink)" strokeWidth="2" />
      {/* espresso drip */}
      <path
        className="art-drip"
        d="M 63.5 75 L 63.5 80"
        stroke="var(--roast)"
        strokeWidth="3"
        strokeLinecap="round"
      />
      {/* little cup */}
      <path
        d="M 54 86 L 74 85.4 Q 73.4 96 64.4 96.4 Q 55.6 96.6 54 86 Z"
        fill="var(--paper)"
        stroke="var(--ink)"
        strokeWidth="2.6"
        strokeLinejoin="round"
      />
      <path d="M 74 88 Q 79 87.4 78 91 Q 77 94 73 93.4" fill="none" stroke="var(--ink)" strokeWidth="2.2" />
      {/* steam off the cup */}
      <path
        className="art-steam"
        d="M 60 78 Q 58 74 60.5 71"
        fill="none"
        stroke="var(--ink-faint)"
        strokeWidth="2.2"
        strokeLinecap="round"
      />
      <path
        className="art-steam-2"
        d="M 68 79 Q 70 75 67.6 71.4"
        fill="none"
        stroke="var(--ink-faint)"
        strokeWidth="2.2"
        strokeLinecap="round"
      />
    </svg>
  )
}
