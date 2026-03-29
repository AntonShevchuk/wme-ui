# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

WME UI is a TamperMonkey/GreaseMonkey userscript library for Waze Map Editor (WME). It provides UI helper classes for creating panels, tabs, modals, fieldsets, and form controls in the WME sidebar.

Source is written in TypeScript under `src/`, built with Rollup into a single IIFE at `dist/WME-UI.user.js`. GreasyFork auto-syncs from the dist output.

## Commands

- **Install:** `npm install`
- **Build:** `npm run build`
- **Watch:** `npm run watch` (rebuild on changes)
- **Test:** `npm test`
- **Test watch:** `npm run test:watch`

## Architecture

```
src/
├── meta.ts           # userscript header (comment block, not TS code)
├── globals.d.ts      # declares WME runtime globals (I18n)
├── unsafe-policy.ts  # trustedTypes polyfill
├── wmeui.ts          # WMEUI static class (normalize, addStyle, addTranslation)
├── element.ts        # WMEUIHelperElement base class
├── controls.ts       # WMEUIHelperControl, ControlInput, ControlButton
├── container.ts      # WMEUIHelperContainer (base with add* methods)
├── fieldset.ts       # WMEUIHelperFieldset
├── panel.ts          # WMEUIHelperPanel
├── tab.ts            # WMEUIHelperTab
├── modal.ts          # WMEUIHelperModal
├── div.ts            # WMEUIHelperDiv
├── text.ts           # WMEUIHelperText
├── helper.ts         # WMEUIHelper factory class
└── index.ts          # bootstrap: imports all, assigns to window
```

**Build output:** `dist/WME-UI.user.js` — IIFE with userscript header prepended as banner. Version is read from `package.json` via `{{version}}` placeholder in `meta.ts`.

**Class hierarchy:**
- `WMEUIHelperElement` (base) -> `WMEUIHelperContainer` (base with add* methods)
  - Container subclasses: `WMEUIHelperFieldset`, `WMEUIHelperPanel`, `WMEUIHelperTab`, `WMEUIHelperModal`
- `WMEUIHelperElement` -> `WMEUIHelperDiv`, `WMEUIHelperText`
- `WMEUIHelperElement` -> `WMEUIHelperControl` -> `WMEUIHelperControlInput`, `WMEUIHelperControlButton`

## Coding Conventions

- TypeScript with `strict: false` — minimal type annotations, `any` for WME SDK types
- All classes are assigned to `window` as globals (consumed via `@require`)
- Tests use vitest with happy-dom environment
- GitHub Actions auto-builds `dist/` on push to main
