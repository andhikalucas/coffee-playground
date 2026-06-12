# coffee playground ☕

A handmade little corner of the internet for beans, brews and scribbled recipes.
Wobbly hand-inked illustrations drift around a paper world; everything you poke
slams open a Persona-style card; recipes get written on decoratable index cards
and pinned to a corkboard.

## run it

```bash
pnpm install
pnpm dev          # → http://localhost:5173
```

`pnpm build` makes a production bundle, `pnpm preview` serves it.

## the three scenes

- **playground** — coffee things drift around (drag them anywhere; they stay put).
  Flip to ☰ shelf for a Persona-style menu with arrow-key browsing. Click anything
  for its story, then "use in a recipe →" pre-fills the maker.
- **make a recipe** — write on the card (title, method, ingredients, ratio badge
  keeps count), then ✿ decorate: stickers, washi tape, ink colors, paper styles.
  Scroll on a selected sticker to spin it; backspace removes it.
- **the board** — saved cards pinned at jaunty angles. Open one to edit, toss,
  or **save as PNG** (decorations included, hanging-off-the-edge charm intact).

Recipes live in your browser's localStorage — nothing leaves your machine.

## the café radio 📻

Bottom-right. By default it plays the official upload of *Beneath the Mask*
(Persona 5) via a visible YouTube embed. If you own the track, drop your copy at:

```
public/audio/beneath-the-mask.mp3
```

…and the radio automatically switches to a seamless local loop with its own
hand-drawn volume knob. (Don't deploy the mp3 publicly — that copy is for you.)

## swap in your own art ✏️

Every illustration goes through one registry: `src/art/registry.tsx`.
Replace any entry with your own component — e.g. a scanned drawing:

```tsx
'moka-pot': ({ className }) => <img className={className} src="/art/my-moka.png" alt="" />,
```

…and the playground, shelf, and popups all pick it up. Stickers have a parallel
registry at `src/art/stickers/registry.tsx`. Sizing is element-agnostic, so an
`<img>` behaves just like the built-in SVGs.

## checks

```bash
pnpm lint                           # eslint
npx prettier --check "src/**/*"     # formatting
pnpm dev --port 5180                # …then in another shell:
node scripts/flow.mjs               # e2e: write → decorate → pin → reload → export
node scripts/polish-test.mjs        # reduced-motion, keyboard, tablet checks
node scripts/hostile-vault-test.mjs # corrupted-localStorage resilience
```
