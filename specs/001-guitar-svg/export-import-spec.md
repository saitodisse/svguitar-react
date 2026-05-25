# Specification: ChordDiagram State Export and Import

**Branch:** `001-guitar-svg`
**Status:** Draft
**Version:** 1.0.0

## Goal

Developers should be able to export the current diagram state as JSON and import it later to restore the same visual configuration.

## User Story

As a developer using `ChordDiagram`, I want to export the current diagram state to JSON, so that I can save presets, share examples, debug rendering, and restore previous configurations.

## Acceptance Criteria

1. Export produces a complete JSON object for the current diagram configuration.
2. Import applies a valid exported JSON object.
3. Invalid JSON reports a clear error and does not mutate current state.
4. Partial JSON can use defaults for missing optional fields.
5. Export followed by import produces an equivalent rendered diagram.

## State Shape

```ts
interface ChordDiagramStateExport {
	version: string;
	exportedAt: string;
	props: Record<string, unknown>;
}
```

## Edge Cases

- Clipboard API unavailable.
- Unsupported schema version.
- Invalid fret, string, tuning, or style values.
- Large JSON payloads.
