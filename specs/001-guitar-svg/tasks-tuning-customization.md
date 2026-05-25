# Tasks: Tuning Label Customization

## Goal

Allow consumers to control tuning-label distance and display format.

## Public Props

- `tuningLabelOffsetX`
- `tuningLabelOffsetY`
- `tuningLabelFormat: "scientific" | "note-only"`

## Tasks

- [x] Add requirements to `spec.md`.
- [x] Add props to `ChordDiagramProps` and style types.
- [x] Add default values.
- [x] Add `formatTuningLabel`.
- [x] Update `TuningLabels`.
- [x] Add demo controls and translations.
- [ ] Add focused tests for offset and format behavior.
- [ ] Add Storybook examples.
- [ ] Run `pnpm test:run`, `pnpm lint`, and `pnpm build`.
