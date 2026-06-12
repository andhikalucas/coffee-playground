/**
 * Sticker doodles — each draws in a 48×48 box. They take the card's ink
 * color where it makes sense, with their own pops of palette color.
 */

interface DoodleProps {
  className?: string
}

export function HeartDoodle({ className }: DoodleProps) {
  return (
    <svg viewBox="0 0 48 48" className={className} aria-hidden="true">
      <path
        d="M 24 16.6 Q 28 8.6 35 12.4 Q 42 16.6 36.6 25 Q 31.6 32.4 24.4 38 Q 16.6 32 12 25.4 Q 6.6 17 13.4 12.6 Q 20 9 24 16.6 Z"
        fill="var(--red)"
        stroke="var(--ink)"
        strokeWidth="2.4"
        strokeLinejoin="round"
      />
      <path d="M 17 16 Q 14.6 17.6 14.6 20.6" fill="none" stroke="var(--foam)" strokeWidth="2" strokeLinecap="round" />
    </svg>
  )
}

export function StarDoodle({ className }: DoodleProps) {
  return (
    <svg viewBox="0 0 48 48" className={className} aria-hidden="true">
      <path
        d="M 24 6 L 29 17.6 L 42 18.6 L 32.4 27 L 35.6 40 L 24 33 L 12.6 40.4 L 15.4 27.4 L 6 18.4 L 18.6 17.4 Z"
        fill="var(--caramel)"
        stroke="var(--ink)"
        strokeWidth="2.4"
        strokeLinejoin="round"
      />
    </svg>
  )
}

export function SteamDoodle({ className }: DoodleProps) {
  return (
    <svg viewBox="0 0 48 48" className={className} aria-hidden="true">
      <path
        d="M 16 40 Q 11 32 16.6 25 Q 22 18.6 16.4 11.4"
        fill="none"
        stroke="var(--card-ink, var(--ink))"
        strokeWidth="3"
        strokeLinecap="round"
      />
      <path
        d="M 28 41 Q 23.4 33 28.6 26.4 Q 34 19.6 28.4 12.6"
        fill="none"
        stroke="var(--card-ink, var(--ink))"
        strokeWidth="3"
        strokeLinecap="round"
        opacity="0.75"
      />
      <path d="M 38 36 Q 35 30.6 38.6 25.6" fill="none" stroke="var(--card-ink, var(--ink))" strokeWidth="2.6" strokeLinecap="round" opacity="0.5" />
    </svg>
  )
}

export function BeanSticker({ className }: DoodleProps) {
  return (
    <svg viewBox="0 0 48 48" className={className} aria-hidden="true">
      <g transform="rotate(-18 24 24)">
        <path
          d="M 24 8 Q 35 9.4 36 24 Q 36.6 38.6 24.4 40 Q 12.6 38.6 12.4 24 Q 12.4 9.6 24 8 Z"
          fill="var(--roast)"
          stroke="var(--ink)"
          strokeWidth="2.6"
          strokeLinejoin="round"
        />
        <path d="M 22.6 10.6 Q 29 17.6 23.6 24 Q 18.6 30.6 25 36.6" fill="none" stroke="var(--ink)" strokeWidth="2.2" strokeLinecap="round" />
      </g>
    </svg>
  )
}

export function RingStainSticker({ className }: DoodleProps) {
  return (
    <svg viewBox="0 0 48 48" className={className} aria-hidden="true">
      <path
        d="M 24 7.6 Q 38 8.4 39.6 22.6 Q 40.6 36.6 25 39.4 Q 9.6 38 8.6 24 Q 8 10.6 24 7.6 Z"
        fill="none"
        stroke="var(--caramel)"
        strokeWidth="4"
        strokeLinecap="round"
        opacity="0.55"
      />
      <path
        d="M 24 12 Q 33.6 13 34.6 22.6"
        fill="none"
        stroke="var(--caramel)"
        strokeWidth="2"
        strokeLinecap="round"
        opacity="0.4"
      />
      <circle cx="38" cy="34" r="2" fill="var(--caramel)" opacity="0.5" />
    </svg>
  )
}

export function SparkleDoodle({ className }: DoodleProps) {
  return (
    <svg viewBox="0 0 48 48" className={className} aria-hidden="true">
      <g stroke="var(--card-ink, var(--ink))" strokeWidth="2.8" strokeLinecap="round">
        <path d="M 24 8 L 24 21" />
        <path d="M 17.6 14.4 L 30.4 14.6" />
        <path d="M 12 30 L 12 38" />
        <path d="M 8 34 L 16 34" />
        <path d="M 36 28 L 36 34" />
        <path d="M 33 31 L 39 31" />
      </g>
    </svg>
  )
}

export function MugDoodle({ className }: DoodleProps) {
  return (
    <svg viewBox="0 0 48 48" className={className} aria-hidden="true">
      <path
        d="M 11 16 L 33 15 Q 33.6 27 31 33.6 Q 29 38.6 22 38.6 Q 15 38.6 13.4 33 Q 11.4 26 11 16 Z"
        fill="var(--foam)"
        stroke="var(--ink)"
        strokeWidth="2.6"
        strokeLinejoin="round"
      />
      <path d="M 33 19 Q 40 19.6 39 26 Q 38 31.6 31.6 31" fill="none" stroke="var(--ink)" strokeWidth="2.6" strokeLinecap="round" />
      <path d="M 14.4 19.6 Q 22 22 30 19.4" fill="none" stroke="var(--roast)" strokeWidth="2.2" strokeLinecap="round" />
      <path d="M 18 9 Q 16.6 6 19 4" fill="none" stroke="var(--ink-faint)" strokeWidth="2" strokeLinecap="round" />
      <path d="M 25 9.6 Q 26.6 6.6 24.6 3.6" fill="none" stroke="var(--ink-faint)" strokeWidth="2" strokeLinecap="round" />
    </svg>
  )
}
