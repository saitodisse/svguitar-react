# Implementation: ChordDiagram State Export and Import

**Spec:** `specs/001-guitar-svg/export-import-spec.md`
**Tasks:** `specs/001-guitar-svg/tasks-export-import-state.md`

## Status

This feature is planned but not complete.

## Planned Files

```text
src/components/ChordDiagram/state/
├── exportState.ts
├── importState.ts
└── validateState.ts
```

## Implementation Notes

- Export should use deterministic key order where practical.
- Import should validate before applying state.
- Demo UI should provide visible success and error feedback.
- Runtime behavior should stay independent from persistence or routing.

## Validation

- Unit tests for export shape.
- Unit tests for valid and invalid imports.
- Integration coverage for the demo control.
- `pnpm test:run`, `pnpm lint`, and `pnpm build`.
