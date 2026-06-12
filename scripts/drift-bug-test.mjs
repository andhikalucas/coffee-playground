import { chromium } from 'playwright'

// Repro + regression check for the two drift-tab bugs:
//   A) hovering an item makes every item jump toward the top-left and spring back
//   B) dragging an item and releasing it opens the popup (should be click-only)
// Run against `pnpm dev --port 5180`.

const browser = await chromium.launch()
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } })
const errors = []
page.on('console', (m) => m.type() === 'error' && errors.push(m.text()))
page.on('pageerror', (e) => errors.push(String(e)))

await page.goto('http://localhost:5180', { waitUntil: 'networkidle' })
await page.waitForTimeout(2500)

const items = page.locator('[aria-label*="open its card"]')
const count = await items.count()
const hoverCapable = await page.evaluate(() => window.matchMedia('(hover: hover)').matches)
console.log('float items:', count, '| (hover:hover) matches:', hoverCapable)

// ── Bug A: do siblings jump when you hover items? ──────────────────────────
await page.screenshot({ path: '/tmp/drift-A-before-hover.png' })

// Kick off a non-blocking rAF recorder: worst displacement of any item from
// its pre-hover home, and the closest any item gets to the field's top-left.
await page.evaluate(() => {
  // measure the <svg> artwork itself, not the outer item box (whose size jumps
  // when the hover name-tag mounts) — so we capture real movement only.
  const nodes = [...document.querySelectorAll('[aria-label*="open its card"]')].map(
    (n) => n.querySelector('svg') || n,
  )
  const center = (n) => {
    const r = n.getBoundingClientRect()
    return { x: r.x + r.width / 2, y: r.y + r.height / 2 }
  }
  const base = nodes.map(center)
  window.__worst = 0
  window.__stop = false
  const tick = () => {
    nodes.forEach((n, i) => {
      const c = center(n)
      window.__worst = Math.max(window.__worst, Math.hypot(c.x - base[i].x, c.y - base[i].y))
    })
    if (!window.__stop) requestAnimationFrame(tick)
  }
  requestAnimationFrame(tick)
})

// Sweep a real hover across several items, dwelling past the 180ms intent so
// the hover state genuinely engages (z-index of the hovered item flips to 6).
let hoverEngaged = false
for (const i of [0, 2, 4, 1, 3]) {
  const b = await items.nth(i).boundingBox()
  await page.mouse.move(b.x + b.width / 2, b.y + b.height / 2, { steps: 4 })
  await page.waitForTimeout(420)
  const z = await items.nth(i).evaluate((n) => getComputedStyle(n).zIndex)
  if (z === '6') hoverEngaged = true
}
await page.screenshot({ path: '/tmp/drift-A-during-hover.png' })

const maxJump = await page.evaluate(() => {
  window.__stop = true
  return Math.round(window.__worst)
})
console.log('  hover engaged (z-index flipped):', hoverEngaged)
console.log(
  `Bug A — max item displacement during hover sweep: ${maxJump}px`,
  maxJump > 80 ? '❌ REGEN BUG' : '✅ stable',
)

// settle
await page.mouse.move(20, 20)
await page.waitForTimeout(700)

// ── Bug A (variant): hover after a shelf→float round-trip ──────────────────
// Visiting the shelf registers the shared `art-<id>` layoutId partner in the
// LayoutGroup; coming back and hovering is the suspected regen trigger.
await page.getByRole('button', { name: /shelf/ }).click()
await page.waitForTimeout(900)
await page.getByRole('button', { name: /drift/ }).click()
await page.waitForTimeout(1200)
await page.evaluate(() => {
  const nodes = [...document.querySelectorAll('[aria-label*="open its card"]')].map(
    (n) => n.querySelector('svg') || n,
  )
  const center = (n) => {
    const r = n.getBoundingClientRect()
    return { x: r.x + r.width / 2, y: r.y + r.height / 2 }
  }
  const base = nodes.map(center)
  window.__worst2 = 0
  window.__stop2 = false
  const tick = () => {
    nodes.forEach((n, i) => {
      const c = center(n)
      window.__worst2 = Math.max(window.__worst2, Math.hypot(c.x - base[i].x, c.y - base[i].y))
    })
    if (!window.__stop2) requestAnimationFrame(tick)
  }
  requestAnimationFrame(tick)
})
for (const i of [0, 3, 6, 1]) {
  const b = await items.nth(i).boundingBox()
  await page.mouse.move(b.x + b.width / 2, b.y + b.height / 2, { steps: 4 })
  await page.waitForTimeout(420)
}
const maxJump2 = await page.evaluate(() => {
  window.__stop2 = true
  return Math.round(window.__worst2)
})
console.log(
  `Bug A (after shelf round-trip) — max displacement: ${maxJump2}px`,
  maxJump2 > 80 ? '❌ REGEN BUG' : '✅ stable',
)
await page.mouse.move(20, 20)
await page.waitForTimeout(700)

// ── Bug B: does drag-release open the popup? ───────────────────────────────
const target = items.first()
const dialog = page.locator('[role="dialog"]')
const b2 = await target.boundingBox()
const cx = b2.x + b2.width / 2
const cy = b2.y + b2.height / 2
await page.mouse.move(cx, cy)
await page.mouse.down()
await page.mouse.move(cx + 230, cy + 140, { steps: 12 })
await page.mouse.move(cx + 240, cy + 150, { steps: 4 })
await page.mouse.up()
await page.waitForTimeout(600)
const openedByDrag = await dialog.isVisible().catch(() => false)
console.log('Bug B — popup opened by drag-release:', openedByDrag ? '❌ YES (bug)' : '✅ no')
await page.screenshot({ path: '/tmp/drift-B-after-drag.png' })
if (openedByDrag) {
  await page.keyboard.press('Escape')
  await page.waitForTimeout(500)
}

// ── Regression: a plain click should still open the popup ──────────────────
const b3 = await target.boundingBox()
await page.mouse.click(b3.x + b3.width / 2, b3.y + b3.height / 2)
await page.waitForTimeout(700)
const openedByClick = await dialog.isVisible().catch(() => false)
console.log('Click still opens popup:', openedByClick ? '✅ yes' : '❌ NO (broke click)')

console.log('console errors:', errors.length ? errors : 'none')
await browser.close()
