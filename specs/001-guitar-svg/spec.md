# Feature Specification: Guitar Chord Diagram Component

**Feature branch:** `001-guitar-svg`
**Created:** 2025-09-24
**Status:** Draft, updated with validation and shared voicing contracts

## Goal

Provide a declarative React component that renders high-quality guitar chord diagrams as SVG. The component should be fast, customizable, TypeScript-first, and suitable for music education, chord-chart applications, and composition tools.

## Primary User Story

As a developer building a music application, I want to pass guitar chord data to a React component and receive a clear customizable SVG diagram, so that my application can display chords without owning low-level SVG layout logic.

## Acceptance Scenarios

1. Given a simple chord such as C major, when finger positions are provided, the component renders the correct fretboard positions.
2. Given a barre chord such as F major, when a barre and additional fingers are provided, the component renders the barre and individual fingers correctly.
3. Given a high-position chord, when `firstFret` or `autoFirstFret` is used, the component displays the correct fret range and labels.
4. Given custom style props, when the component renders, it applies the requested colors, sizes, spacing, and fonts.
5. Given a custom tuning, when scientific note names are provided, the component displays tuning labels correctly.
6. Given fret notation such as `x32010`, when the instrument tuning is provided, the component renders open, muted, and fretted strings correctly.
7. Given a shared `FrettedInstrumentVoicing`, when `voicing` is provided, it takes precedence as the preferred public input shape.
8. Given invalid input, when validation runs, the component follows `validation`, `invalidBehavior`, `fallbackChord`, `onError`, and `errorFallback`.
9. Given a `zoom` multiplier, when the component renders, the SVG output scales uniformly without requiring per-subcomponent changes.

## Functional Requirements

- Render chord diagrams as SVG.
- Support `voicing`, structured `chord`, and `instrument` fret-notation inputs.
- Support horizontal and vertical views for right-handed and left-handed diagrams.
- Support custom layout engines through a strategy interface.
- Support open strings, muted strings, fretted fingers, manual barres, and automatic barres.
- Support configurable tuning labels, string indicators, fret labels, nut styling, and canvas offsets.
- Support a global SVG zoom multiplier for the rendered output.
- Support `autoFirstFret` for high-position chords.
- Export TypeScript types for all public contracts.

## Non-Functional Requirements

- Keep rendering deterministic for identical props.
- Avoid global SVG transforms that make text unreadable.
- Keep labels horizontally readable in every view.
- Keep React rendering efficient with pure components and stable calculations.
- Keep shared musical contracts in `achorde-musical-domain`, not in React-specific code.

## Out of Scope

- Audio playback.
- Chord lookup databases.
- Full music-theory engines.
- Persistence, sync, routing, or application workflows.
