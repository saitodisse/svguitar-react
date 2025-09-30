# svguitar-react

A React component for rendering guitar chord diagrams in SVG format with high performance and full customization.

🌐 **Live Demo**: [https://svguitar-react.vercel.app/](https://svguitar-react.vercel.app/)
🔗 **NPM Package**: [https://www.npmjs.com/package/svguitar-react](https://www.npmjs.com/package/svguitar-react)

## Features

- 🎸 **Guitar Chord Diagrams**: Render beautiful chord diagrams in SVG format
- ⚡ **High Performance**: Optimized with React.memo and efficient rendering
- 🎨 **Fully Customizable**: Complete control over colors, sizes, fonts, spacing and layout strategies
- 🧭 **Multiple Views**: Horizontal/vertical, right/left-handed presets with consistent label orientation
- 🧩 **Pluggable Layout Engines**: Swap or inject custom layout logic (Strategy pattern) without touching rendering code
- 📱 **Responsive**: SVG-based rendering that scales perfectly
- 🔧 **TypeScript**: Full TypeScript support with comprehensive type definitions
- 🧪 **Well Tested**: Comprehensive test suite with Vitest
- 📚 **Storybook**: Interactive documentation and examples

## Installation

```bash
npm install svguitar-react
```

## Quick Start

```tsx
import React from "react";
import { ChordDiagram } from "svguitar-react";

const App = () => {
	const cMajor = {
		fingers: [
			{ fret: 1, string: 2, is_muted: false, text: "1" },
			{ fret: 2, string: 4, is_muted: false, text: "2" },
			{ fret: 3, string: 5, is_muted: false, text: "3" },
		],
		barres: [],
	};

	return <ChordDiagram chord={cMajor} view="horizontal-right" />;
};
```

## Usage Examples

### Basic Chord

```tsx
<ChordDiagram
	chord={{
		fingers: [
			{ fret: 1, string: 2, is_muted: false, text: "1" },
			{ fret: 2, string: 4, is_muted: false, text: "2" },
		],
		barres: [],
	}}
/>
```

### Chord with Barre

```tsx
<ChordDiagram
	chord={{
		fingers: [
			{ fret: 2, string: 3, is_muted: false, text: "2" },
			{ fret: 3, string: 5, is_muted: false, text: "3" },
		],
		barres: [{ fret: 1, fromString: 1, toString: 6 }],
	}}
/>
```

### Using Fret Notation

```tsx
<ChordDiagram
	instrument={{
		tuning: ["E2", "A2", "D3", "G3", "B3", "E4"],
		chord: "x32010", // C Major
	}}
/>
```

### Custom Styling

````tsx
<ChordDiagram
	chord={chordData}
	view="horizontal-left"
	width={200}
	height={250}
	dotColor="#FF5733"
	stringColor="#CCCCCC"
	fontFamily="Arial, sans-serif"
/>

### Selecting Views

```tsx
<ChordDiagram chord={chordData} view="vertical-right" />
<ChordDiagram chord={chordData} view="vertical-left" />
````

### Custom Layout Engine

```tsx
import { ChordDiagram, layoutRegistry, type LayoutEngine } from "svguitar-react";

const diagonalEngine: LayoutEngine = {
	id: "horizontal-right",
	mapStringAxis: (stringNumber, frame) =>
		frame.gridOriginY + (frame.stringCount - stringNumber) * (frame.gridHeight / (frame.stringCount - 1)),
	mapFretAxis: (fret, frame) => frame.gridOriginX + (fret - frame.firstFret + 0.5) * frame.style.fretWidth,
	fingerPosition: (finger, args) => ({
		cx: args.frame.gridOriginX + (finger.fret - args.frame.firstFret + 0.5) * args.frame.style.fretWidth,
		cy:
			args.frame.gridOriginY +
			(args.frame.stringCount - finger.string) *
				(args.frame.gridHeight / (args.frame.stringCount - 1)) +
			(finger.fret % 2 === 0 ? -6 : 6),
		r: args.frame.style.dotSize / 2,
	}),
	barreRect: (barre, args) => ({
		x: args.frame.gridOriginX + (barre.fret - args.frame.firstFret) * args.frame.style.fretWidth,
		y:
			args.frame.gridOriginY +
			(args.frame.stringCount - barre.toString) *
				(args.frame.gridHeight / (args.frame.stringCount - 1)) -
			args.frame.style.barreHeight / 2,
		width: args.frame.style.fretWidth,
		height:
			Math.abs(barre.toString - barre.fromString) *
				(args.frame.gridHeight / (args.frame.stringCount - 1)) +
			args.frame.style.barreHeight,
		rx: 4,
	}),
	indicatorPosition: (stringNumber, kind, args) => ({
		x: args.frame.gridOriginX - args.frame.style.fretWidth * 0.5,
		y:
			args.frame.gridOriginY +
			(args.frame.stringCount - stringNumber) * (args.frame.gridHeight / (args.frame.stringCount - 1)) -
			args.frame.style.dotSize,
	}),
};

layoutRegistry.register(diagonalEngine);

<ChordDiagram chord={chordData} layoutEngine={diagonalEngine} />;
```

````

## API Reference

### ChordDiagramProps

| Prop             | Type                       | Description                                                                     |
| ---------------- | -------------------------- | ------------------------------------------------------------------------------- |
| `chord`          | `Chord`                    | Chord data with fingers and barres                                              |
| `instrument`     | `Partial<Instrument>`      | Instrument configuration for fret notation                                      |
| `view`           | `ViewId`                   | Predefined layout view (`horizontal-right`, `horizontal-left`, `vertical-right`, `vertical-left`) |
| `layoutEngine`   | `LayoutEngine`             | Custom layout strategy (takes precedence over `view`)                           |
| `width`/`height` | `number`                   | Total width/height of the SVG                                                   |
| `dotColor`       | `string`                   | Finger dot color                                                                |
| `fontFamily`     | `string`                   | Font family                                                                     |
| ...              | `ChordStyle` properties    | All other styling props inline (colors, spacing, fonts, etc.)                   |

### Chord

```typescript
interface Chord {
	fingers: Finger[];
	barres: Barre[];
	firstFret?: number;
	lastFret?: number;
}
````

### Finger

```typescript
interface Finger {
	fret: number; // Fret number (1-based)
	string: number; // String number (1-based, 1 = thickest)
	is_muted: boolean; // Whether the string is muted (true => 'X')
	text?: string; // Optional text inside the circle
}
```

### Barre

````typescript
interface Barre {
	fret: number; // Fret number (1-based)
	fromString: number; // Starting string
	toString: number; // Ending string
	text?: string; // Optional text on the barre
}

### LayoutEngine

```typescript
type ViewId = "horizontal-right" | "horizontal-left" | "vertical-right" | "vertical-left";

interface LayoutFrame {
	width: number;
	height: number;
	gridOriginX: number;
	gridOriginY: number;
	gridWidth: number;
	gridHeight: number;
	firstFret: number;
	stringCount: number;
	fretCount: number;
	style: ChordStyle;
}

interface LayoutEngine {
	id: ViewId;
	mapStringAxis(stringNumber: number, frame: LayoutFrame): number;
	mapFretAxis(fret: number, frame: LayoutFrame): number;
	fingerPosition(finger: Finger, args: { frame: LayoutFrame }): { cx: number; cy: number; r: number };
	barreRect(barre: Barre, args: { frame: LayoutFrame }): {
		x: number;
		y: number;
		width: number;
		height: number;
		rx?: number;
	};
	indicatorPosition(stringNumber: number, kind: "open" | "muted", args: { frame: LayoutFrame }): {
		x: number;
		y: number;
	};
}

// Built-in helpers
import { layoutRegistry, resolveViewId, getLayoutEngine, DEFAULT_VIEW } from "svguitar-react";
````

````

## Development

### Prerequisites

- Node.js 18+
- pnpm

### Setup

```bash
# Clone the repository
git clone https://github.com/svguitar/svguitar-react.git
cd svguitar-react

# Install dependencies
pnpm install

# Start development server
pnpm dev

# Run tests
pnpm test

# Start Storybook
pnpm storybook

# Build library
pnpm build
````

### Project Structure

```
src/
├── components/
│   └── ChordDiagram/
│       ├── ChordDiagram.tsx    # Main component
│       ├── types.ts            # TypeScript interfaces
│       ├── utils.ts            # Utility functions
│       ├── constants.ts        # Default values
│       ├── Fretboard.tsx       # Fretboard rendering
│       ├── Finger.tsx          # Finger position rendering
│       ├── Barre.tsx           # Barre rendering
│       ├── TuningLabels.tsx    # Tuning labels
│       └── FretNumbers.tsx     # Fret numbers
├── stories/
│   └── ChordDiagram.stories.tsx # Storybook stories
└── index.ts                    # Library entry point
```

## License

MIT License - see [LICENSE](LICENSE) file for details.

## Contributing

Contributions are welcome! Please read our [Contributing Guide](CONTRIBUTING.md) for details.

## Changelog

See [CHANGELOG.md](CHANGELOG.md) for a list of changes and version history.
