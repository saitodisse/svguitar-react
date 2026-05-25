# Data Model: ChordDiagram API

This document describes the public TypeScript model for `ChordDiagram`.

## Numbering and Rendering Convention

- String numbers start at `1` for the lowest-pitched string and increase toward the highest-pitched string.
- Standard guitar tuning is ordered from low to high: `["E2", "A2", "D3", "G3", "B3", "E4"]`.
- Fret notation follows the same low-to-high string order, for example `x32010`.
- Visual layout may place strings differently depending on the selected view, but data input order remains stable.

## Preferred Input

```ts
import type { FrettedInstrumentVoicing } from "achorde-musical-domain";

interface ChordDiagramProps {
	voicing?: FrettedInstrumentVoicing;
	chord?: Chord;
	instrument?: Partial<Instrument>;
	view?: ViewId;
	layoutEngine?: LayoutEngine;
}
```

`voicing` is the preferred input because it comes from the shared public musical domain package. When present, it is converted to the renderer's internal model.

## Structured Chord Input

```ts
interface Chord {
	fingers: Finger[];
	barres?: Barre[];
	firstFret?: number;
}

interface Finger {
	string: number;
	fret: number;
	is_muted?: boolean;
	text?: string;
}

interface Barre {
	fromString: number;
	toString: number;
	fret: number;
	text?: string;
}
```

## Instrument Input

```ts
interface Instrument {
	strings: number;
	tuning: string[];
	chord: string;
}
```

`instrument.chord` uses fret notation such as `x32010`. Muted strings are represented with `x`; open strings are represented with `0`; multi-digit frets can be wrapped in parentheses.

## Layout

```ts
type ViewId = "horizontal-right" | "horizontal-left" | "vertical-right" | "vertical-left";
```

Each view is implemented by a layout engine that maps musical coordinates to SVG coordinates.

## Validation

```ts
type InvalidBehavior = "keep-previous" | "render-fallback" | "suppress";
```

Invalid input follows the configured validation policy:

- `validation="strict"` rejects invalid input and applies `invalidBehavior`.
- `validation="lenient"` may normalize input and report warnings.
- `fallbackChord` is used when no previous valid chord exists.
- `onError` and `errorFallback` expose errors to consumers without coupling the library to application UI.
