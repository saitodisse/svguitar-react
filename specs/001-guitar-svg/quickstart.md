# Quickstart: Using `svguitar-react`

This guide shows how to install and use `ChordDiagram` in a React application.

## Installation

```bash
pnpm add svguitar-react achorde-musical-domain
```

## Basic Usage

```tsx
import { ChordDiagram } from "svguitar-react";
import type { FrettedInstrumentVoicing } from "achorde-musical-domain";

const cMajor: FrettedInstrumentVoicing = {
	id: "voicing-c-major",
	instrumentId: "guitar",
	tuningId: "guitar-standard",
	chordSymbol: "C",
	strings: [
		{ stringIndex: 1, openNote: "E", fret: null, state: "muted" },
		{ stringIndex: 2, openNote: "A", fret: 3, state: "fretted", finger: 3 },
		{ stringIndex: 3, openNote: "D", fret: 2, state: "fretted", finger: 2 },
		{ stringIndex: 4, openNote: "G", fret: 0, state: "open" },
		{ stringIndex: 5, openNote: "B", fret: 1, state: "fretted", finger: 1 },
		{ stringIndex: 6, openNote: "E", fret: 0, state: "open" },
	],
	source: "manual",
	quality: "recommended",
};

export function Example() {
	return <ChordDiagram voicing={cMajor} />;
}
```

## Barre Chord

```tsx
const fMajor: FrettedInstrumentVoicing = {
	id: "voicing-f-major",
	instrumentId: "guitar",
	tuningId: "guitar-standard",
	chordSymbol: "F",
	strings: [
		{ stringIndex: 1, openNote: "E", fret: 1, state: "fretted", finger: 1 },
		{ stringIndex: 2, openNote: "A", fret: 3, state: "fretted", finger: 3 },
		{ stringIndex: 3, openNote: "D", fret: 3, state: "fretted", finger: 4 },
		{ stringIndex: 4, openNote: "G", fret: 2, state: "fretted", finger: 2 },
		{ stringIndex: 5, openNote: "B", fret: 1, state: "fretted", finger: 1 },
		{ stringIndex: 6, openNote: "E", fret: 1, state: "fretted", finger: 1 },
	],
	barres: [{ fret: 1, fromStringIndex: 1, toStringIndex: 6, finger: 1 }],
	source: "manual",
	quality: "recommended",
};

<ChordDiagram voicing={fMajor} />;
```

## Fret Notation

```tsx
<ChordDiagram
	instrument={{
		strings: 6,
		tuning: ["E2", "A2", "D3", "G3", "B3", "E4"],
		chord: "x32010",
	}}
/>
```

## Structured Chord Input

```tsx
<ChordDiagram
	chord={{
		fingers: [
			{ fret: 3, string: 2, is_muted: false, text: "3" },
			{ fret: 2, string: 3, is_muted: false, text: "2" },
			{ fret: 1, string: 5, is_muted: false, text: "1" },
		],
		barres: [],
	}}
/>
```

## Views

```tsx
<ChordDiagram voicing={cMajor} view="horizontal-right" />
<ChordDiagram voicing={cMajor} view="horizontal-left" />
<ChordDiagram voicing={cMajor} view="vertical-right" />
<ChordDiagram voicing={cMajor} view="vertical-left" />
```

## High-Position Chords

```tsx
<ChordDiagram
	autoFirstFret
	fretCount={4}
	chord={{
		fingers: [
			{ fret: 5, string: 1, is_muted: false },
			{ fret: 7, string: 2, is_muted: false },
			{ fret: 8, string: 3, is_muted: false },
		],
		barres: [],
	}}
/>
```

## Automatic Barre Detection

Automatic barre detection can reduce visual duplication for dense chords. Manual barres always take precedence.

```tsx
<ChordDiagram
	autoBarreEnabled
	chord={{
		fingers: [
			{ fret: 3, string: 1, is_muted: false },
			{ fret: 3, string: 2, is_muted: false },
			{ fret: 3, string: 3, is_muted: false },
			{ fret: 3, string: 4, is_muted: false },
			{ fret: 3, string: 5, is_muted: false },
			{ fret: 5, string: 6, is_muted: false },
		],
		barres: [],
	}}
/>
```

## Styling

```tsx
<ChordDiagram
	voicing={cMajor}
	width={240}
	height={280}
	dotColor="#2563eb"
	fretColor="#111827"
	stringColor="#6b7280"
	textColor="#111827"
	fontFamily="Inter, sans-serif"
/>
```

## Advanced Offsets

```tsx
<ChordDiagram
	voicing={cMajor}
	tuningLabelOffsetX={0.2}
	tuningLabelOffsetY={0.5}
	stringIndicatorOffsetX={0.4}
	stringIndicatorOffsetY={0}
	fretTextOffsetX={0}
	fretTextOffsetY={0.1}
	barresOffsetX={0}
	barresOffsetY={0}
	nutOffsetX={0}
	nutOffsetY={0}
	canvasOffsetX={0}
	canvasOffsetY={0}
/>
```

## Error Handling

```tsx
<ChordDiagram
	instrument={{ strings: 6, tuning: ["E2"], chord: "x32010" }}
	validation="strict"
	invalidBehavior="render-fallback"
	fallbackChord="000000"
	onError={(error, context) => {
		console.error(context.code, error.message);
	}}
	errorFallback={error => <span>{error.message}</span>}
/>
```

## Performance

Memoize large chord, voicing, and style objects when they are created inside React components. Stable object references help React avoid unnecessary rendering work.
