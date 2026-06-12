import { chromium } from 'playwright'

const browser = await chromium.launch()
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } })
const errors = []
page.on('console', (m) => m.type() === 'error' && errors.push(m.text()))
page.on('pageerror', (e) => errors.push(String(e)))

await page.goto('http://localhost:5180', { waitUntil: 'networkidle' })
await page.waitForTimeout(2000)

// → maker via the "use in a recipe" flow: open v60 popup first
await page.getByRole('button', { name: /v60 dripper — open/ }).click({ force: true })
await page.waitForTimeout(900)
await page.getByRole('button', { name: 'use in a recipe →' }).click()
await page.waitForTimeout(1600)
await page.screenshot({ path: '/tmp/flow-1-maker-seeded.png' })

// type a title
const title = page.getByLabel('recipe title')
await title.fill('')
await title.pressSequentially('saturday slow pour', { delay: 10 })
await page.waitForTimeout(400)

// decorate: add stickers + tape, change paper
await page.getByRole('tab', { name: /decorate/ }).click()
await page.waitForTimeout(600)
await page.getByRole('button', { name: 'add heart sticker' }).click()
await page.waitForTimeout(300)
await page.getByRole('button', { name: 'add sparkles sticker' }).click()
await page.waitForTimeout(300)
await page.getByRole('button', { name: 'add tape strip 2' }).click()
await page.waitForTimeout(300)
await page.getByRole('radio', { name: 'dotted paper' }).click()
await page.waitForTimeout(700)
await page.screenshot({ path: '/tmp/flow-2-decorated.png' })

// pin it → gallery
await page.getByRole('button', { name: /pin it to the board/ }).click()
await page.waitForTimeout(1800)
await page.screenshot({ path: '/tmp/flow-3-gallery.png' })

// reload → persistence check
await page.reload({ waitUntil: 'networkidle' })
await page.waitForTimeout(1500)
await page.getByRole('button', { name: 'the board' }).click()
await page.waitForTimeout(1600)
await page.screenshot({ path: '/tmp/flow-4-gallery-after-reload.png' })

// open focus popup
await page.getByRole('button', { name: /open recipe: saturday slow pour/ }).click()
await page.waitForTimeout(1100)
await page.screenshot({ path: '/tmp/flow-5-focus.png' })

// export png
const downloadPromise = page.waitForEvent('download', { timeout: 15000 })
await page.getByRole('button', { name: /save as png/ }).click()
const download = await downloadPromise
await download.saveAs('/tmp/flow-6-export.png')
await page.waitForTimeout(600)

console.log('download:', download.suggestedFilename())
console.log('console errors:', errors.length ? errors : 'none')
await browser.close()
