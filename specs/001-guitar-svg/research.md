# Research: Guitar Chord Diagram Component

## SVG Rendering in React

**Decision:** render SVG elements directly with JSX.

**Rationale:** JSX keeps SVG attributes declarative, integrates with React rendering, avoids manual DOM manipulation, and makes component state easy to reason about.

**Rejected alternatives:** generating SVG strings with `dangerouslySetInnerHTML`, or adding renderer libraries for behavior that is simple enough to express with native SVG.

## Performance

**Decision:** keep `ChordDiagram` and rendering subcomponents pure and memoizable.

**Rationale:** chord diagrams are deterministic for the same props. Stable props and focused calculations reduce unnecessary renders in music applications that update frequently.

## Package Build

**Decision:** use Vite library mode with TypeScript declarations.

**Rationale:** Vite gives a small library build setup and modern output while keeping the package easy to consume from TypeScript applications.

## Music Theory

**Decision:** use music-theory libraries only behind adapter logic.

**Rationale:** note validation and normalization are easy to get wrong. Libraries such as `tonal` can help, but their types should not become canonical public domain contracts.

## Shared Voicing Contract

**Decision:** use `FrettedInstrumentVoicing` from `achorde-musical-domain` as the preferred shared input.

**Rationale:** renderers, parsers, and applications need a common public contract that is independent from React and SVG.

## Layout Strategies

**Decision:** represent each view with a `LayoutEngine`.

**Rationale:** mapping strings, frets, fingers, barres, indicators, and labels through a strategy avoids scattered conditional logic and keeps text legible without global SVG transforms.

## Error Handling

**Decision:** support both `onError` and `errorFallback`.

**Rationale:** mature applications often want telemetry and custom UI, while simpler consumers benefit from inline fallback rendering.
