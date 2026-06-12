import { chromium } from 'playwright'

const browser = await chromium.launch()
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } })
const errors = []
page.on('console', (m) => m.type() === 'error' && errors.push(m.text()))
page.on('pageerror', (e) => errors.push(String(e)))

await page.addInitScript(() => {
  const recipe = {
    id: 'test-export-1',
    title: 'saturday slow pour',
    method: 'v60',
    ingredients: [
      { id: 'i1', kind: 'coffee', amount: 15, unit: 'g' },
      { id: 'i2', kind: 'water', amount: 225, unit: 'g' },
      { id: 'i3', kind: 'milk', amount: 30, unit: 'ml' },
    ],
    params: { tempC: 93, grind: 'medium-fine', timeSec: 165 },
    steps: ['bloom the grounds, wait 30s…', 'pour in slow spirals to 225g', 'swirl once, let it draw down'],
    decor: {
      paper: 'dotted',
      ink: 'espresso',
      stickers: [
        { id: 's1', stickerId: 'heart', x: 0.86, y: 0.78, rotation: -14, scale: 1 },
        { id: 's2', stickerId: 'sparkle', x: 0.62, y: 0.16, rotation: 10, scale: 1 },
        { id: 's3', stickerId: 'ring', x: 0.12, y: 0.88, rotation: 0, scale: 1 },
      ],
      tapes: [{ id: 't1', x: 0.5, y: 0.03, rotation: -4, length: 130, variant: 1 }],
    },
    pin: { angle: -3, color: '#e0341e' },
    createdAt: 1750000000000,
    updatedAt: 1750000000000,
  }
  localStorage.setItem(
    'coffee-playground:v1',
    JSON.stringify({ version: 1, recipes: [recipe], draft: null, settings: { muted: false, volume: 0.7 } }),
  )
})
await page.goto('http://localhost:5180', { waitUntil: 'networkidle' })
await page.waitForTimeout(1800)
await page.getByRole('button', { name: 'the board' }).click()
await page.waitForTimeout(1600)
await page.getByRole('button', { name: /open recipe: saturday slow pour/ }).click()
await page.waitForTimeout(1100)

const downloadPromise = page.waitForEvent('download', { timeout: 15000 })
await page.getByRole('button', { name: /save as png/ }).click()
const download = await downloadPromise
await download.saveAs('/tmp/flow-6-export.png')
await page.waitForTimeout(400)
console.log('saved', download.suggestedFilename(), '| console errors:', errors.length ? errors : 'none')
await browser.close()
