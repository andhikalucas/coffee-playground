/** "2:45" ⇄ 165s — brew time the way coffee people write it. */

export function formatTimeSec(sec: number | undefined): string {
  if (sec === undefined || !Number.isFinite(sec) || sec <= 0) return ''
  const m = Math.floor(sec / 60)
  const s = Math.round(sec % 60)
  return `${m}:${String(s).padStart(2, '0')}`
}

export function parseTimeStr(raw: string): number | undefined {
  const t = raw.trim()
  if (!t) return undefined
  const colon = t.match(/^(\d{1,2}):([0-5]?\d)$/)
  if (colon) return Number(colon[1]) * 60 + Number(colon[2])
  const secs = t.match(/^(\d+)\s*s?$/)
  if (secs) return Number(secs[1])
  return undefined
}
