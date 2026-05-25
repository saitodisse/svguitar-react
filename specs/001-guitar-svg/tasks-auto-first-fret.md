# Tasks: Auto First Fret

**Status:** Completed
**Version:** 2.1.0

## Overview

`autoFirstFret` automatically adjusts the diagram starting fret when pressed fingers are outside the default visible range.

## Requirements

- Calculate the minimum pressed fret.
- Ignore open and muted strings for range selection.
- Keep `firstFret=1` when all pressed fingers fit in the default range.
- Increase `fretCount` when needed, up to the configured safety limit.
- Let explicit `firstFret` override automatic behavior.
- Recalculate when props change.

## Validation

- [x] Unit tests cover open strings.
- [x] Unit tests cover high-position chords.
- [x] Manual `firstFret` takes precedence.
- [x] Build and lint pass for the release that introduced the feature.
