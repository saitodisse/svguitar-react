# Tasks: ChordDiagram State Export and Import

## Goal

Provide deterministic JSON export and import for the demo and future tooling.

## Scope

- Export all public `ChordDiagram` props and relevant derived state.
- Import a compatible JSON state object.
- Validate imported data before applying it.
- Preserve existing state when import fails.

## Tasks

- [ ] Define the JSON schema in `export-import-spec.md`.
- [ ] Add snapshot tests for exported state.
- [ ] Add serialization and deserialization tests.
- [ ] Add valid and invalid import tests.
- [ ] Implement `getState`.
- [ ] Implement `exportState`.
- [ ] Implement `importState`.
- [ ] Add schema validation.
- [ ] Add demo UI for export and import.
- [ ] Add Storybook documentation.
- [ ] Run `pnpm test:run`, `pnpm lint`, and `pnpm build`.
