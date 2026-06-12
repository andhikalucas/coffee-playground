# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

A hand-drawn "coffee playground" — a React 19 + TypeScript + Vite SPA with three scenes: a floating-items playground, a recipe-card maker, and a corkboard gallery. Everything is styled to look handmade: wobbly inked borders, paper grain, seeded tilt, Web Audio sound effects synthesized from oscillators (no audio files). Uses pnpm.

**Before starting work, read `HANDOFF.md`** — it tracks current status, known rough edges, and the owner's pending "UI fixes wanted" checklist (unchecked items there are the active task list).

## Commands

- `pnpm dev` — dev server (Vite default port; the e2e scripts expect **5180**, so run `pnpm dev --port 5180` when testing)
- `pnpm build` — `tsc -b` then `vite build` (typecheck happens here; there is no separate typecheck script)
- `pnpm lint` — ESLint (flat config; typescript-eslint + react-hooks + react-refresh)
- `pnpm prettier --write .` — formatting (Prettier is a devDep; no package script)

There is no unit-test runner. Verification is done with Playwright scripts in `scripts/` that drive a dev server on `localhost:5180` and write screenshots to `/tmp`:

- `node scripts/shot.mjs` — screenshots of float/shelf/popup/radio states
- `node scripts/flow.mjs` — full flow: item popup → recipe maker → decorate → pin → gallery
- `node scripts/export-test.mjs`, `node scripts/polish-test.mjs` — export and polish checks

Each script collects console/page errors and prints them at the end — a run is only clean if it reports `console errors: none`.

## Git workflow

- **Do not commit or push automatically.** The owner reviews all changes and makes the commits/pushes themselves. Make the code changes in the working tree and stop there — do not run `git commit` or `git push` unless the owner explicitly asks for that specific action in the current request.
- It's fine to stage nothing and leave the working tree dirty for review; report what changed so the owner can review and commit.
- **Checkpoint per feature.** When the work is a checklist of tasks spanning different features, implement only one feature, then stop and wait for the owner to review and commit it before editing the next one. Do not start editing the next feature until the previous checkpoint is reviewed. Planning ahead is encouraged — you may design/plan the later features and be ready to implement, but hold the edits until the owner gives the go-ahead.

## Architecture

Provider stack in `src/App.tsx`: `SettingsProvider → RecipesProvider → SceneProvider → AppShell`. `AppShell` renders exactly one scene (`playground` | `maker` | `gallery` from `src/state/types.ts`) plus global chrome (HUD, paper grain, coffee stains, toast host, scene transition).

### Core systems (the parts that span many files)

- **Seeded wobble engine** (`src/lib/rng.ts` + `src/lib/wobble.ts`): all "hand-drawn" randomness is deterministic — FNV-1a hash → mulberry32 PRNG keyed by a seed string. Same seed → same wobble/tilt forever, so nothing shimmers across re-renders. `src/styles/tokens.ts` exposes `tilt(seed)` and the `PALETTE` (mirrors CSS vars in `global.css` for SVG fills). When adding any visual randomness, use a stable seed string, never `Math.random()`.
- **Handmade kit** (`src/components/handmade/`): WobblyFrame/Button/Divider/Underline, WashiTape, TornEdge, PaperGrain, CoffeeStainDecor, Toast. Build new UI out of these instead of plain boxes. Toasts go through `toastBus.ts` (`showToast(...)`) — a module-level bus, deliberately separate from the `ToastHost` component for react-refresh.
- **Scene transitions** (`src/state/SceneContext.tsx` + `components/SceneTransition.tsx`): `goTo(scene)` runs a timed band-wipe — the scene swaps mid-cover. Transition guards (`busyRef`, `sceneRef`) live in refs; `wipeId` bumps per transition and keys the wipe bands. Respects `reducedMotion` from settings.
- **Persistence** (`src/lib/storage.ts`): one versioned localStorage vault (`coffee-playground:v1`), debounced writes, corrupt data stashed not destroyed, migrations array for future schema changes. Quota errors surface via `setSaveErrorHandler` → toast. Mutate through `updateVault(mutate)`; call `flushVault()` before export/unload-sensitive moments. Contexts in `src/state/` are the React-facing layer over the vault.
- **Art registry** (`src/art/registry.tsx`): `ART: Record<ArtId, FC<ArtProps>>` is THE swap point for artwork — every scene (playground, popups, shelf) renders items through it. Stickers have a parallel registry in `src/art/stickers/registry.tsx`.
- **Audio** (`src/audio/sfx.ts`): tiny Web Audio synth; the AudioContext is created/resumed only inside a user gesture (autoplay/iOS safe). Mute/volume come from SettingsContext via `useSfx`.
- **PNG export** (`src/lib/exportPng.ts`): renders the IndexCard off-screen (laid out, never `display:none`) with `flushSync`, waits for fonts, and calls `toPng` twice to dodge WebKit's blank-first-render quirk. The comments there document hard-won workarounds — read them before changing it.

### Conventions

- Styling is CSS Modules per feature (`*.module.css`) plus `src/styles/global.css` for tokens/CSS vars.
- Sticker/tape placements store x/y as fractions of the card (0..1) so cards scale anywhere (`src/state/types.ts`).
- Hooks co-located with their provider (with a documented eslint-disable for react-refresh/only-export-components) is the established idiom in `src/state/`.
- Interactive elements get descriptive aria-labels (e.g. "v60 dripper — open its card"); the Playwright scripts target them by role/label, so keep labels stable or update the scripts.