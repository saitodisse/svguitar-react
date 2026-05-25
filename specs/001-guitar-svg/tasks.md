# Tasks: Vertical Fret Numbers

**Input:** `specs/001-guitar-svg/` design documents
**Requirement:** vertical views must render fret numbers on the right side of the fretboard, centered in each fret space.

## Setup

- [x] Review `spec.md` and `research.md`.
- [x] Confirm the affected vertical layout engines.

## Tests First

- [ ] Add or update snapshot tests for `FretNumbers`.
- [ ] Add integration tests for `vertical-right` and `vertical-left`.
- [ ] Update `ChordDiagram` tests to cover vertical fret-number placement.

## Implementation

- [ ] Update `FretNumbers.tsx` for vertical placement.
- [ ] Update `verticalRight.ts` and `verticalLeft.ts` if layout-engine methods are needed.
- [ ] Update `LayoutEngine` types if the contract changes.
- [ ] Confirm layout registration uses the updated calculations.

## Polish

- [ ] Add Storybook examples for vertical views.
- [ ] Run `pnpm test:run`, `pnpm lint`, and `pnpm build`.
- [ ] Verify Storybook rendering for vertical views.
