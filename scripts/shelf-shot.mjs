import { chromium } from 'playwright'

// Quick visual check of the shelf menu at a couple widths.
const browser = await chromium.launch()
const errors = []

for (const vp of [
  { width: 1440, height: 900, tag: '1440' },
  { width: 1100, height: 800, tag: '1100' },
]) {
  const page = await browser.newPage({ viewport: { width: vp.width, height: vp.height } })
  page.on('console', (m) => m.type() === 'error' && errors.push(`[${vp.tag}] ${m.text()}`))
  page.on('pageerror', (e) => errors.push(`[${vp.tag}] ${String(e)}`))
  await page.goto('http://localhost:5180', { waitUntil: 'networkidle' })
  await page.waitForTimeout(1800)
  await page.getByRole('button', { name: /shelf/ }).click()
  await page.waitForTimeout(1200)
  await page.screenshot({ path: `/tmp/shelf-${vp.tag}-top.png` })
  // focus the list (not the mode toggle), then browse down to show the chip +
  // active emphasis mid-list
  await page.locator('ul[aria-label="everything on the shelf"] [aria-pressed="true"]').first().focus()
  await page.waitForTimeout(200)
  for (let k = 0; k < 5; k++) {
    await page.keyboard.press('ArrowDown')
    await page.waitForTimeout(250)
  }
  await page.waitForTimeout(500)
  await page.screenshot({ path: `/tmp/shelf-${vp.tag}-mid.png` })
  await page.close()
}

console.log('console errors:', errors.length ? errors : 'none')
await browser.close()
