# Implementation Plan: Guitar Chord Diagram Component

**Branch:** `001-guitar-svg`
**Spec:** `specs/001-guitar-svg/spec.md`

## Summary

Build and maintain a React component named `ChordDiagram` that renders fretted-instrument chord diagrams as SVG. The library exposes a public TypeScript API, supports shared voicing contracts from `achorde-musical-domain`, and keeps rendering concerns separate from parsing, persistence, and application workflows.

## Technical Context

| Area            | Decision                                  |
| --------------- | ----------------------------------------- |
| Language        | TypeScript                                |
| UI              | React                                     |
| Rendering       | Native SVG through JSX                    |
| Build           | Vite library mode                         |
| Tests           | Vitest and Storybook tests                |
| Music contracts | `achorde-musical-domain`                  |
| Music theory    | Adapter-level use of `tonal` where needed |

## Architecture

- `ChordDiagram` is the public React component.
- `voicing` is the preferred shared-domain input.
- Legacy structured `chord` and `instrument` inputs remain supported by adapter code.
- Layout engines map domain coordinates to SVG coordinates.
- Storybook demonstrates public behavior and edge cases.
- Specs and contracts document the supported public surface.

## Delivery Phases

1. Define the public data model and validation contract.
2. Implement deterministic SVG rendering for supported views.
3. Add custom styling, tuning labels, string indicators, nut styling, and canvas offsets.
4. Add automatic helpers such as auto barre and auto first fret.
5. Document the API in README, quickstart, and contract files.
6. Validate with unit tests, build, lint, and Storybook where relevant.

## Quality Gates

- TypeScript public types compile.
- `pnpm test:run` passes.
- `pnpm build` emits the library package.
- `pnpm lint` passes.
- Public documentation stays in English.
