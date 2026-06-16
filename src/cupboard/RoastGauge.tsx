/** Hand-drawn roast meter: 5 coffee beans filled up to `level` (light → dark). */
export function RoastGauge({ level }: { level: number }) {
  return (
    <div role="img" aria-label={`roast level ${level} of 5, light to dark`}>
      <div className="mb-1 font-display text-[0.72rem] uppercase tracking-[0.12em] text-ink-faint">
        roast
      </div>
      <div className="flex items-center gap-1.5">
        {Array.from({ length: 5 }, (_, i) => {
          const filled = i < level
          const stroke = filled ? 'var(--ink)' : 'var(--ink-faint)'
          return (
            <svg key={i} viewBox="0 0 24 24" className="h-5.5 w-5.5" aria-hidden="true">
              <ellipse
                cx="12"
                cy="12"
                rx="6.4"
                ry="8.4"
                transform="rotate(-16 12 12)"
                fill={filled ? 'var(--roast)' : 'transparent'}
                stroke={stroke}
                strokeWidth="1.6"
              />
              <path
                d="M 10.4 5.4 Q 14.4 11 10.8 17.6"
                fill="none"
                stroke={stroke}
                strokeWidth="1.3"
                strokeLinecap="round"
                opacity={filled ? 1 : 0.55}
              />
            </svg>
          )
        })}
      </div>
      <div className="mt-0.5 flex w-[8.5rem] justify-between font-hand text-[0.72rem] text-ink-faint">
        <span>light</span>
        <span>dark</span>
      </div>
    </div>
  )
}
