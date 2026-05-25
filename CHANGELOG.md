# Changelog

## 2.4.0 (2026-05-24)

### Features

- Added first-class `voicing` support to `ChordDiagram` using the shared `achorde-musical-domain` fretted-instrument contract.
- Exported shared music contract types from the package root.

### Documentation

- Updated README, quickstart, and API contract docs to use `voicing` as the preferred input shape.
- Prepared public repository documentation in English.

## 2.3.2 (2026-05-18)

### Bug Fixes

- Fixed `mergeInstrument` so `undefined` partial props no longer clear defaults.
- Updated the demo app to use the documented inline API.
- Updated `pnpm dev` and `pnpm preview` to target the demo app config with network host enabled.

## 2.3.1 (2026-05-18)

### Documentation and Tooling

- Added `AGENTS.md` as central instructions for AI agents and IDEs.
- Added repository skills for release finalization and spec audits.
- Removed legacy Cursor rule scaffolding.
- Updated README installation instructions.

## 2.3.0 (2025-01-27)

### Dependencies

- Updated React, React DOM, i18next, nuqs, react-i18next, Vite, ESLint, Tailwind CSS, and Playwright.
- Fixed compatibility issues with React 19.2.0.
- Improved Storybook test stability.

## 2.2.0 (2025-10-13)

### Features

- Added view-specific style constants for horizontal and vertical layouts.
- Organized Storybook stories into clearer categories.
- Kept `DEFAULT_CHORD_STYLE` as a backwards-compatible alias.

## 2.1.x

### Auto First Fret

- Added automatic `firstFret` calculation for high-position chords.
- Preserved manual `firstFret` precedence.
- Improved open-string handling.

## 2.0.x

### Inline API

- Refactored `ChordDiagram` toward inline props for simpler React usage.
- Improved TypeScript inference and default handling.
- Added configurable validation and fallback behavior.

## 1.x

### Initial Library Evolution

- Added SVG chord diagram rendering.
- Added custom tuning, fret notation, vertical and horizontal views, automatic barre detection, advanced offsets, and Storybook documentation.
