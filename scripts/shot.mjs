import { chromium } from 'playwright'

const browser = await chromium.launch()
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } })
const errors = []
page.on('console', (m) => m.type() === 'error' && errors.push(m.text()))
page.on('pageerror', (e) => errors.push(String(e)))
await page.goto('http://localhost:5180', { waitUntil: 'networkidle' })
await page.waitForTimeout(2500)

// 1. float mode
await page.screenshot({ path: '/tmp/shot-1-float.png' })

// 2. hover an item (center of viewport area where an item should drift)
const item = page.locator('[aria-label*="open its card"]').first()
await item.hover({ force: true })
await page.waitForTimeout(700)
await page.screenshot({ path: '/tmp/shot-2-hover.png' })

// 3. click → persona popup
await item.click({ force: true })
await page.waitForTimeout(1100)
await page.screenshot({ path: '/tmp/shot-3-popup.png' })
await page.keyboard.press('Escape')
await page.waitForTimeout(500)

// 4. shelf mode
await page.getByRole('button', { name: /shelf/ }).click()
await page.waitForTimeout(1200)
await page.screenshot({ path: '/tmp/shot-4-shelf.png' })

// 5. radio open
await page.getByRole('button', { name: /café radio/ }).click()
await page.waitForTimeout(1800)
await page.screenshot({ path: '/tmp/shot-5-radio.png' })

console.log('console errors:', errors.length ? errors : 'none')
await browser.close()
