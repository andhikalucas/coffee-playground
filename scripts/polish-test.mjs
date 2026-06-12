import { chromium } from 'playwright'

const browser = await chromium.launch()

// 1. reduced motion — drift idles, popups fade
const rm = await browser.newPage({ viewport: { width: 1440, height: 900 }, reducedMotion: 'reduce' })
const errors = []
rm.on('console', (m) => m.type() === 'error' && errors.push('rm: ' + m.text()))
rm.on('pageerror', (e) => errors.push('rm: ' + String(e)))
await rm.goto('http://localhost:5180', { waitUntil: 'networkidle' })
await rm.waitForTimeout(1500)
await rm.screenshot({ path: '/tmp/polish-1-reduced.png' })
const pos1 = await rm.locator('[aria-label*="open its card"]').first().boundingBox()
await rm.waitForTimeout(1200)
const pos2 = await rm.locator('[aria-label*="open its card"]').first().boundingBox()
console.log(
  'reduced-motion drift frozen:',
  Math.abs(pos1.x - pos2.x) < 0.5 && Math.abs(pos1.y - pos2.y) < 0.5,
)
await rm.close()

// 2. keyboard journey: tab to an item, Enter opens popup, Escape closes & returns focus
const kb = await browser.newPage({ viewport: { width: 1440, height: 900 } })
kb.on('pageerror', (e) => errors.push('kb: ' + String(e)))
await kb.goto('http://localhost:5180', { waitUntil: 'networkidle' })
await kb.waitForTimeout(1800)
const firstItem = kb.locator('[aria-label*="open its card"]').first()
await firstItem.focus()
await kb.keyboard.press('Enter')
await kb.waitForTimeout(900)
const dialogOpen = await kb.getByRole('dialog').isVisible()
await kb.keyboard.press('Escape')
await kb.waitForTimeout(600)
const focusRestored = await firstItem.evaluate((el) => document.activeElement === el)
console.log('keyboard: dialog opened:', dialogOpen, '| focus restored after Esc:', focusRestored)

// 3. shelf keyboard nav
await kb.getByRole('button', { name: /shelf/ }).click()
await kb.waitForTimeout(900)
await kb.getByRole('option').first().locator('button').focus()
await kb.keyboard.press('ArrowDown')
await kb.keyboard.press('ArrowDown')
await kb.waitForTimeout(500)
await kb.screenshot({ path: '/tmp/polish-2-shelf-kb.png' })
await kb.close()

// 4. empty gallery state + tablet width
const tab = await browser.newPage({ viewport: { width: 834, height: 1112 } })
tab.on('pageerror', (e) => errors.push('tablet: ' + String(e)))
await tab.goto('http://localhost:5180', { waitUntil: 'networkidle' })
await tab.waitForTimeout(1500)
await tab.getByRole('button', { name: 'the board' }).click()
await tab.waitForTimeout(1600)
await tab.screenshot({ path: '/tmp/polish-3-empty-gallery-tablet.png' })
await tab.getByRole('button', { name: 'make a recipe' }).click()
await tab.waitForTimeout(1600)
await tab.screenshot({ path: '/tmp/polish-4-maker-tablet.png' })
await tab.close()

console.log('console errors:', errors.length ? errors : 'none')
await browser.close()
