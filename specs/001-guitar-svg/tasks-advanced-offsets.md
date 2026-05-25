# Tasks: Advanced Offsets

## Goal

Expose fine-grained offsets for labels, indicators, barres, fret text, nut rendering, and canvas placement so consumers can tune diagram layout without replacing the renderer.

## Public Props

- `tuningLabelOffsetX`
- `tuningLabelOffsetY`
- `stringIndicatorOffsetX`
- `stringIndicatorOffsetY`
- `barresOffsetX`
- `barresOffsetY`
- `fretTextOffsetX`
- `fretTextOffsetY`
- `nutOffsetX`
- `nutOffsetY`
- `canvasOffsetX`
- `canvasOffsetY`

## Tasks

- [ ] Document props in `data-model.md`.
- [ ] Document validation in `contracts/chord-diagram-api.md`.
- [ ] Add defaults in constants.
- [ ] Apply offsets in every layout engine.
- [ ] Add tests for representative horizontal and vertical views.
- [ ] Add Storybook controls.
- [ ] Run `pnpm test:run`, `pnpm lint`, and `pnpm build`.
