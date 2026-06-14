import { useEffect, useState } from 'react'

const WEEKDAYS = ['SUNDAY', 'MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY']

interface Today {
  dd: string
  mm: string
  weekday: string
  isDay: boolean
}

function readToday(): Today {
  const d = new Date()
  const pad = (n: number) => String(n).padStart(2, '0')
  const h = d.getHours()
  return {
    dd: pad(d.getDate()),
    mm: pad(d.getMonth() + 1),
    weekday: WEEKDAYS[d.getDay()],
    isDay: h >= 6 && h < 18, // daytime 06:00–18:00
  }
}

/**
 * Persona-5-style date tab at the top-left — a slanted black banner with red
 * misprint shadow + accent, condensed Anton caps, and a day/night glyph.
 * Replaces the old torn-paper logo. Styled with Tailwind utilities; the one
 * bespoke bit (the angled clip + offset shadow) stays inline.
 */
export function PersonaDate() {
  const [today, setToday] = useState<Today>(readToday)

  // keep the date + day/night glyph honest if the app is left open all day
  useEffect(() => {
    const id = window.setInterval(() => setToday(readToday()), 60_000)
    return () => window.clearInterval(id)
  }, [])

  return (
    <div
      className="fixed left-5 top-5 z-[65] -rotate-2 select-none max-[520px]:left-2.5 max-[520px]:top-2.5"
      aria-label={`Today is ${today.weekday}, ${today.dd}/${today.mm}`}
    >
      <div
        className="bg-ink px-4 pb-2.5 pt-2 text-foam max-[520px]:px-2.5 max-[520px]:pb-1.5 max-[520px]:pt-1.5"
        style={{
          clipPath: 'polygon(0 0, 100% 0, calc(100% - 16px) 100%, 0 100%)',
          filter: 'drop-shadow(3px 3px 0 var(--color-red))',
        }}
      >
        <div className="flex items-center gap-2.5 max-[520px]:gap-1.5">
          <DayNightIcon day={today.isDay} />
          <span className="font-display text-4xl leading-none tracking-wide max-[520px]:text-2xl">
            {today.dd}
            <span className="mx-1 text-red">/</span>
            {today.mm}
          </span>
        </div>
        <div className="mb-1.5 mt-1.5 h-[3px] w-[86%] bg-red max-[520px]:mb-1 max-[520px]:mt-1" />
        <div
          className="font-display text-3xl leading-none tracking-[0.2em] text-foam/85 max-[520px]:text-lg max-[520px]:tracking-[0.15em]"
          aria-hidden="true"
        >
          {today.weekday}
        </div>
      </div>
    </div>
  )
}

const RAYS = Array.from({ length: 8 }, (_, i) => {
  const a = (i * Math.PI) / 4
  return {
    x1: 12 + Math.cos(a) * 7.2,
    y1: 12 + Math.sin(a) * 7.2,
    x2: 12 + Math.cos(a) * 9.6,
    y2: 12 + Math.sin(a) * 9.6,
  }
})

function DayNightIcon({ day }: { day: boolean }) {
  return (
    <svg
      viewBox="0 0 24 24"
      className="h-[1.4rem] w-[1.4rem] shrink-0 max-[520px]:h-[1.05rem] max-[520px]:w-[1.05rem]"
      aria-hidden="true"
    >
      {day ? (
        <>
          <circle cx="12" cy="12" r="4.4" fill="var(--color-caramel-soft)" />
          {RAYS.map((r, i) => (
            <line
              key={i}
              x1={r.x1}
              y1={r.y1}
              x2={r.x2}
              y2={r.y2}
              stroke="var(--color-caramel-soft)"
              strokeWidth="1.6"
              strokeLinecap="round"
            />
          ))}
        </>
      ) : (
        // crescent: a foam disc with a disc the colour of the tab carved out of it
        <>
          <circle cx="11" cy="12" r="6.6" fill="var(--color-foam)" />
          <circle cx="14.6" cy="10.4" r="5.6" fill="var(--color-ink)" />
        </>
      )}
    </svg>
  )
}
