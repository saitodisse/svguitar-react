# API Contract: ChordDiagram Component

## Overview

`ChordDiagram` is a React component that renders fretted-instrument chord diagrams as SVG. This document defines the public API contract.

## Main Interface

```ts
import type { FrettedInstrumentVoicing } from "achorde-musical-domain";

type InvalidBehavior = "keep-previous" | "render-fallback" | "suppress";
type ViewId = "horizontal-right" | "horizontal-left" | "vertical-right" | "vertical-left";

interface ChordDiagramProps {
	voicing?: FrettedInstrumentVoicing;
	instrument?: Partial<Instrument>;
	chord?: Chord;

	validation?: "strict" | "lenient";
	invalidBehavior?: InvalidBehavior;
	fallbackChord?: string | Chord;
	onError?: (error: ChordDiagramError, context: ErrorContext) => void;
	errorFallback?: React.ReactNode | ((error: ChordDiagramError, context: ErrorContext) => React.ReactNode);

	view?: ViewId;
	layoutEngine?: LayoutEngine;

	width?: number;
	height?: number;
	fretCount?: number;
	stringCount?: number;
	firstFret?: number;
	autoFirstFret?: boolean;
	autoBarreEnabled?: boolean;

	fretWidth?: number;
	fretHeight?: number;
	stringWidth?: number;
	dotSize?: number;
	barreHeight?: number;
	barresWidth?: number;
	barresOpacity?: number;
	barresOffsetX?: number;
	barresOffsetY?: number;
	fretTextOffsetX?: number;
	fretTextOffsetY?: number;
	tuningLabelOffsetX?: number;
	tuningLabelOffsetY?: number;
	tuningLabelFormat?: "scientific" | "note-only";
	stringIndicatorOffsetX?: number;
	stringIndicatorOffsetY?: number;
	nutStrokeWidth?: number;
	nutOffsetX?: number;
	nutOffsetY?: number;
	nutOpacity?: number;
	nutColor?: string;
	canvasOffsetX?: number;
	canvasOffsetY?: number;

	backgroundColor?: string;
	fretColor?: string;
	stringColor?: string;
	dotColor?: string;
	textColor?: string;
	fontFamily?: string;
}
```

## Input Precedence

1. `voicing` is preferred and takes precedence when provided.
2. `chord` provides the structured renderer model.
3. `instrument` provides fret-notation input and tuning metadata.
4. Missing optional props are merged with defaults.

## Validation Rules

- At least one input source should be provided.
- `string` values must be within the configured string range.
- `fret` values must be non-negative.
- `tuning` should contain one note per string.
- Numeric style values should be finite numbers.
- Colors should be valid CSS color strings.

## Rendering Rules

- Open strings render with an `O` indicator.
- Muted strings render with an `X` indicator.
- Fretted fingers render centered in the fret space.
- Manual barres take precedence over automatic barre detection.
- Layout engines must keep text readable without global SVG rotation or scale transforms.

## Error Behavior

- `keep-previous` keeps the last valid diagram when possible.
- `render-fallback` renders `fallbackChord`.
- `suppress` renders no chord marks.
- `onError` receives structured error information.
- `errorFallback` can render inline fallback UI.
