import { createElement } from 'react'
import { createRoot } from 'react-dom/client'
import { flushSync } from 'react-dom'
import { toPng } from 'html-to-image'
import type { Recipe } from '../state/types'
import { IndexCard } from '../recipe/IndexCard'

const slug = (s: string) =>
  s
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '') || 'untitled-brew'

/**
 * Render the card off-screen at full size (laid out, never display:none),
 * wait for fonts and a couple of paints, then capture at @2x.
 * The double toPng call works around WebKit's blank-first-render quirk.
 */
export async function exportRecipePng(recipe: Recipe): Promise<void> {
  // outer host does the off-screen positioning; the captured node must keep
  // static positioning or its fixed/left styles ride along into the clone
  // and shove everything out of the capture viewport (blank png)
  const host = document.createElement('div')
  host.style.cssText = 'position:fixed;left:-12000px;top:0;pointer-events:none;'
  const stage = document.createElement('div')
  // 20px bleed so overhanging tape and stickers survive the crop
  stage.style.cssText = 'width:680px;padding:20px;'
  host.appendChild(stage)
  document.body.appendChild(host)
  const root = createRoot(stage)

  try {
    flushSync(() => {
      root.render(createElement(IndexCard, { recipe, mode: 'static' }))
    })

    await document.fonts.ready
    await new Promise<void>((resolve) =>
      requestAnimationFrame(() => requestAnimationFrame(() => resolve())),
    )

    const options = {
      pixelRatio: 2,
      filter: (node: HTMLElement) =>
        !(node instanceof HTMLIFrameElement) && node.dataset?.noExport !== 'true',
    }

    await toPng(stage, options) // warm-up pass (WebKit fonts/SVG)
    const dataUrl = await toPng(stage, options)

    const a = document.createElement('a')
    a.href = dataUrl
    a.download = `${slug(recipe.title)}-recipe.png`
    a.click()
  } finally {
    root.unmount()
    host.remove()
  }
}
