# Tasks: Automatic Barre Detection

**Goal:** detect when a barre should be rendered automatically based on fretted finger distribution.

## Behavior

- Auto barre activates when more than four pressed fingers share a useful fret pattern.
- Ties choose the lowest fret.
- The barre spans from the first to the last string with a finger on that fret.
- Fingers covered by the barre are removed from visual rendering.
- Manual barres disable automatic barre detection.

## Tasks

- [ ] Add `autoBarreEnabled?: boolean` to public props and style documentation.
- [ ] Add tests for activation threshold, tie-breaking, span calculation, covered-finger removal, and manual-barre precedence.
- [ ] Implement `detectAutoBarre`.
- [ ] Implement `removeFingersCoveredByBarre`.
- [ ] Implement `shouldApplyAutoBarre`.
- [ ] Integrate automatic barre logic in `ChordDiagram`.
- [ ] Add Storybook examples for enabled, disabled, tie, and manual-barre cases.
- [ ] Update README and quickstart examples.
- [ ] Run `pnpm test:run`, `pnpm lint`, and `pnpm build`.

## Acceptance Criteria

- Automatic barres render only when applicable.
- Manual barres remain authoritative.
- Covered fingers are not duplicated visually.
- Existing diagrams without automatic barres remain unchanged.
