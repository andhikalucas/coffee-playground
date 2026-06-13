# lucas' coffee playground ☕

a mini project I made to test with Claude Fable 5. i love coffee and i love making them, so this project serves as a playful information for coffee-related things, such as beans and brewing methods. i have also provide a place to write recipes, which serves as my own personal space to log my recipes. 
will continuously evolve and iterate this in the future!

try these features out:
- **playground**
- **make a recipe** (lives in the browser localStorage)
- **the board** 
- **leblanc cafe radio, located bottom right**

## run it

```bash
pnpm install
pnpm dev          # → http://localhost:5173
```

`pnpm build` makes a production bundle, `pnpm preview` serves it.

## checks

```bash
pnpm lint                           # eslint
npx prettier --check "src/**/*"     # formatting
pnpm dev --port 5180                # …then in another shell:
node scripts/flow.mjs               # e2e: write → decorate → pin → reload → export
node scripts/polish-test.mjs        # reduced-motion, keyboard, tablet checks
node scripts/hostile-vault-test.mjs # corrupted-localStorage resilience
```
