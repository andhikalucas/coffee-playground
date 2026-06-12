import { chromium } from 'playwright'

const browser = await chromium.launch()
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } })
const errors = []
page.on('console', (m) => m.type() === 'error' && errors.push(m.text()))
page.on('pageerror', (e) => errors.push(String(e)))

// hostile vault: unknown sticker id, missing pin/decor fields, NaN-ish values,
// junk recipe entries, bad settings — the app must load and render anyway
await page.addInitScript(() => {
  localStorage.setItem(
    'coffee-playground:v1',
    JSON.stringify({
      version: 1,
      recipes: [
        null,
        42,
        { id: 'bad-1', title: 12345, method: 'nuclear', ingredients: 'nope', steps: [1, 2, null] },
        {
          id: 'half-ok',
          title: 'survivor brew',
          method: 'v60',
          ingredients: [{ id: 'i1', kind: 'coffee', amount: null, unit: 'kg' }, 'garbage'],
          params: { tempC: 9999, grind: 'atomized' },
          steps: ['only real step'],
          decor: {
            paper: 'vellum',
            ink: 'invisible',
            stickers: [
              { id: 's1', stickerId: 'REMOVED-DOODLE', x: 0.5, y: 0.5, rotation: 0, scale: 1 },
              { id: 's2', stickerId: 'heart', x: 'left', y: 99, rotation: 'a bit', scale: -5 },
            ],
            tapes: [{ id: 't1', variant: 7, length: -100 }],
          },
          // pin missing entirely
        },
      ],
      draft: 'not even an object',
      settings: { muted: 'yes', volume: NaN },
    }),
  )
})

await page.goto('http://localhost:5180', { waitUntil: 'networkidle' })
await page.waitForTimeout(1800)
const playgroundOk = await page.locator('[aria-label*="open its card"]').first().isVisible()
await page.getByRole('button', { name: 'the board' }).click()
await page.waitForTimeout(1600)
const survivorVisible = await page.getByText('survivor brew').first().isVisible()
await page.screenshot({ path: '/tmp/hostile-vault.png' })

console.log('app loaded with hostile vault:', playgroundOk)
console.log('salvageable recipe survived:', survivorVisible)
console.log('console errors:', errors.length ? errors : 'none')
await browser.close()
