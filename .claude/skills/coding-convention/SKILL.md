---
name: coding-convention
description: >-
  Coding conventions and security guardrails for this React 19 + Vite +
  TypeScript "coffee-playground" SPA. Invoke when writing or editing any code
  under src/, adding a feature / component / scene, or touching persistence
  (the localStorage vault), the state contexts, the handmade UI kit, the art
  registries, audio, or PNG export. It also encodes the hardening fixes from
  the code-review pass so they are never regressed — untrusted-localStorage
  normalization, the error boundary, save→flush ordering, strict TS, export
  bleed, a11y, and iframe/radio sandboxing.
---

# Coding conventions — coffee-playground

React 19 + TypeScript (strict) + Vite SPA, **pnpm**. Hand-drawn aesthetic; everything
deterministic so nothing shimmers across re-renders. Read `CLAUDE.md` for the
architecture map and `HANDOFF.md` for current status before starting.

Apply these by default. They are not generic React advice — they are the idioms this
codebase already uses, plus the guardrails that came out of the code review. Match the
surrounding code's style; build new UI from the existing primitives, not plain boxes.

## House style (do these)

- **TypeScript is `strict`** (`tsconfig.app.json`) and lint runs `noUnusedLocals` /
  `noUnusedParameters` / `noFallthroughCasesInSwitch`. Don't reach for `any`; prefer
  `unknown` + a narrowing guard (see `isObj` in `normalize.ts`). Keep it green:
  `pnpm lint` and `pnpm build` (build is where typecheck happens — there is no separate
  typecheck script).
- **Function components only.** The one class component is `ErrorBoundary` (React requires
  it). Hooks rules are enforced (`eslint-plugin-react-hooks`).
- **Determinism over `Math.random()`.** All "hand-drawn" randomness goes through
  `src/lib/rng.ts` (FNV-1a → mulberry32) keyed by a **stable seed string**, surfaced via
  `tilt(seed)` / `seededRange` / `seededPick`. Never use `Math.random()` or argless
  `Date.now()` for anything visual — it would re-roll every render. Reuse a stable id
  (e.g. `recipe.id`) as the seed so the look is fixed forever.
- **Build UI from the handmade kit** (`src/components/handmade/`): WobblyFrame / Button /
  Divider / Underline, WashiTape, TornEdge, PaperGrain, CoffeeStainDecor, Toast — not raw
  `<div>` boxes. Toasts go through `showToast(...)` from `toastBus.ts` (a module-level bus
  kept separate from `ToastHost` so react-refresh stays happy).
- **State lives in `src/state/` contexts**, which are the React-facing layer over the
  vault. Co-locate each hook with its provider and keep the documented
  `// eslint-disable-next-line react-refresh/only-export-components` on the exported hook —
  that's the established idiom (`RecipesContext.tsx`, etc.).
- **Keep state updaters pure (StrictMode-safe).** Don't write to the vault inside a
  `setState` updater. Persist reactively in a `useEffect` keyed on the state, exactly like
  `RecipesProvider` does (`useEffect(() => updateVault(v => { v.draft = clone(draft) }), [draft])`).
  Deep-clone before mutating drafts (`JSON.parse(JSON.stringify(...))` — `clone()` in
  `RecipesContext.tsx`).
- **Styling = CSS Modules per feature** (`*.module.css`) + `src/styles/global.css` for
  tokens/CSS vars. `src/styles/tokens.ts` mirrors the palette for SVG fills — keep the two
  in sync if you add a color.
- **Geometry as fractions.** Sticker/tape placements store `x`/`y` as fractions of the
  card (0..1) so cards scale anywhere (`src/state/types.ts`). New placement data follows
  the same rule.
- **Artwork swaps through the registry only** (`src/art/registry.tsx`; stickers in
  `src/art/stickers/registry.tsx`). Every scene renders items through `ART` — don't import
  an illustration component directly into a scene.
- **Audio is gesture-gated.** The `AudioContext` is created/resumed only inside a user
  gesture (`src/audio/sfx.ts`) — autoplay/iOS safe. Don't construct or resume it at module
  load or in an effect.
- **Stable, descriptive `aria-label`s.** Interactive elements get real labels
  (e.g. `"v60 dripper — open its card"`). The Playwright scripts target by role/label, so
  if you rename a label, update `scripts/` in the same change.

## Verify before declaring done

No unit runner. Run the dev server on **5180** and the Playwright scripts; a run is clean
only if it prints `console errors: none`.

```bash
pnpm lint
pnpm build                              # tsc -b + vite build (this is the typecheck)
pnpm dev --port 5180                    # then, in another shell:
node scripts/flow.mjs                   # write → decorate → pin → reload → export
node scripts/polish-test.mjs            # reduced-motion, keyboard, tablet
node scripts/hostile-vault-test.mjs     # corrupted-localStorage resilience
```

---

# Security guardrails (from the code review — do not regress)

The code-review pass (`git show 0ea8126`) hardened the app. Each item below is a rule to
keep, with the failure mode it prevents. Treat these as invariants when editing the
relevant area.

## 1. All `localStorage` is untrusted → normalize everything

The vault is user-editable and survives old app versions, so **nothing below the top level
can be trusted**. Every loaded field passes through `src/state/normalize.ts` before it
reaches React or the DOM.

- **Any new persisted field MUST get a normalizer.** Numbers are clamped to an explicit
  `[min,max]` (`num`/`optNum`), strings are length-capped (`str`), enums go through
  `oneOf(value, ALLOWED, fallback)`, and free-form strings that hit the DOM are validated —
  e.g. pin color is regex-gated `^#[0-9a-f]{3,8}$` before it's used as a CSS value.
- **Unknown ids are dropped, not rendered.** An unknown `stickerId` returns `null` and is
  filtered out (`normalizeSticker`) so a removed-from-registry id can't crash the render.
  Do the same for any future registry-keyed data.
- **`normalizeVault` always returns a guaranteed-good `Vault`** even from `null`/garbage —
  it never throws. Keep that total: callers rely on it never crashing.
- *Why it matters:* this is the app's trust boundary. A regex-less or unclamped field is a
  potential crash or an injection of an attacker-controlled string into the DOM/CSS. When
  in doubt, add a guard. `node scripts/hostile-vault-test.mjs` exercises corrupted vaults —
  run it after touching persisted shapes.

## 2. Corrupt data is stashed, never destroyed — and can't recur

In `loadVault()`, unparseable JSON is copied to `coffee-playground:corrupt-latest`
(best-effort) for forensics, then the app starts fresh **and immediately `persist()`s** so
the bad key is overwritten and the failure can't repeat on every load. Preserve this
stash-then-overwrite ordering if you touch load/parse.

## 3. Save → flush ordering must stay synchronous-then-flush

`updateVault(mutate)` mutates the **in-memory** vault synchronously, then schedules a
debounced (400 ms) write. So a `flushVault()` called right after `updateVault(...)`
genuinely lands on disk (used after pinning a card, and on `pagehide`). Do **not** reorder
these or move the mutation into the debounce — a flush would then write stale data.
`flushVault()` before export/unload-sensitive moments.

## 4. The error boundary is the last line of defense — keep it dumb

`src/components/ErrorBoundary.tsx` is deliberately **context-free and inline-styled** so it
can render even if providers/CSS are what fell over. "start fresh" calls `resetVault()` and
reloads for the case where saved data is the crash. Don't make it depend on contexts,
modules that might be the thing that broke, or external CSS.

## 5. Keep TypeScript `strict` on

`"strict": true` is set in `tsconfig.app.json`. Don't disable it or silence errors with
`any`/`@ts-ignore`; fix the type. Strict mode is what makes the normalizer's narrowing
guards meaningful.

## 6. PNG export bleed — decorations are allowed to overhang

`src/lib/exportPng.ts` renders the card off-screen (laid out, never `display:none`) with a
**120px bleed** so stickers/tape that hang past the card edge survive the crop. It also
`flushSync`-renders, waits for fonts, and calls `toPng` **twice** to dodge WebKit's
blank-first-render quirk. Read the comments before changing any of it — these are
hard-won. Don't shrink the bleed or drop the double render.

## 7. Accessibility — don't fake ARIA, reset uncontrolled inputs

- The write/decorate switch is a `role="group"` with `aria-pressed` buttons, **not**
  `role="tab"` — there are no real tabpanels, so faking tab semantics misleads AT. Only use
  `role="tab"`/`aria-selected` when there's an actual tablist+tabpanel relationship.
- Uncontrolled editors are reset by remounting with a `key` (`<CardEditor key={draft.id} />`)
  so switching drafts doesn't leak stale field values.

## 8. Radio / `<iframe>` hardening

In `src/components/hud/RadioPanel.tsx`:

- **Probe has a settle-once guard + a 4s timeout fallback.** The local-file probe can hang
  (a stalled request fires neither `canplaythrough` nor `error`), so a single `settled`
  flag and a `setTimeout(onFail, 4000)` keep it from sitting on "tuning…" forever. Any
  similar media/network probe needs the same guard.
- **Handle the `play()` promise both ways.** `el.play().then(ok, fail)` — if autoplay
  policy blocks it, set the paused UI state; never show a pause button when audio isn't
  actually playing.
- **The YouTube `<iframe>` is sandboxed deliberately:** `referrerPolicy="strict-origin-when-cross-origin"`,
  a minimal `sandbox="…"` allowlist, and `loading="lazy"`. Don't broaden the sandbox or
  drop the referrer policy without a concrete reason. The player must stay **visible** while
  playing — that's YouTube ToS; don't "fix" it by hiding the iframe.

## 9. General web-safety

- No `dangerouslySetInnerHTML`, `eval`, `new Function`, or injecting untrusted strings into
  DOM/CSS. User-supplied text (recipe titles, labels) renders as text nodes — keep it that
  way; validate/length-cap anything that becomes an attribute or style value (see rule 1).
- Don't deploy the local `beneath-the-mask.mp3` publicly (it's a personal copy — noted in
  the README).
