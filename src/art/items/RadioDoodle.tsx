interface RadioDoodleProps {
  className?: string
  playing?: boolean
}

/** A little café radio for the HUD corner. */
export function RadioDoodle({ className, playing = false }: RadioDoodleProps) {
  return (
    <svg viewBox="0 0 64 52" className={className} width="40" height="33" aria-hidden="true">
      {/* antenna */}
      <path d="M 41 14 Q 50 6 57 3" fill="none" stroke="var(--ink)" strokeWidth="2.4" strokeLinecap="round" />
      <circle cx="57.5" cy="3" r="2" fill="var(--ink)" />
      {/* body */}
      <path
        d="M 7 17 Q 6 14 9 13.4 L 54 12 Q 58 12 58 16 L 58.5 44 Q 58.5 48 54.5 48 L 10 48.6 Q 6.5 48.6 6.6 45 Z"
        fill="var(--kraft)"
        stroke="var(--ink)"
        strokeWidth="2.6"
        strokeLinejoin="round"
      />
      {/* speaker */}
      <ellipse cx="22" cy="31" rx="9.4" ry="9.8" fill="var(--paper)" stroke="var(--ink)" strokeWidth="2.4" />
      <ellipse cx="22" cy="31" rx="4.6" ry="5" fill="none" stroke="var(--ink)" strokeWidth="1.8" />
      {/* dial */}
      <rect x="38" y="22" width="14" height="7" rx="2.5" fill="var(--foam)" stroke="var(--ink)" strokeWidth="2" />
      <path d="M 44.5 22.5 L 44.5 28.5" stroke="var(--red)" strokeWidth="2" />
      {/* knobs */}
      <circle cx="41" cy="38.5" r="3.4" fill="var(--roast)" stroke="var(--ink)" strokeWidth="1.8" />
      <circle cx="50" cy="38.5" r="3.4" fill="var(--roast)" stroke="var(--ink)" strokeWidth="1.8" />
      {/* notes when playing */}
      {playing && (
        <g fill="var(--ink)" stroke="none">
          <g>
            <path d="M 10 8 Q 10 4 14 4.5 L 14 1.5 L 16 1.2 L 16 8" fill="none" stroke="var(--ink)" strokeWidth="1.6" strokeLinecap="round">
              <animateTransform attributeName="transform" type="translate" values="0 2; 0 -2; 0 2" dur="1.6s" repeatCount="indefinite" />
            </path>
            <circle cx="10" cy="8.6" r="2">
              <animateTransform attributeName="transform" type="translate" values="0 2; 0 -2; 0 2" dur="1.6s" repeatCount="indefinite" />
            </circle>
          </g>
        </g>
      )}
    </svg>
  )
}
