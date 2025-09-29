# svguitar-react

A React component for rendering guitar chord diagrams in SVG format with high performance and full customization.

🌐 **Live Demo**: [https://svguitar-react.vercel.app/](https://svguitar-react.vercel.app/)
🔗 **NPM Package**: [https://www.npmjs.com/package/svguitar-react](https://www.npmjs.com/package/svguitar-react)

## Features

- 🎸 **Guitar Chord Diagrams**: Render beautiful chord diagrams in SVG format
- ⚡ **High Performance**: Optimized with React.memo and efficient rendering
- 🎨 **Fully Customizable**: Complete control over colors, sizes, fonts, and spacing
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
			{ fret: 1, string: 2, text: "1" },
			{ fret: 2, string: 4, text: "2" },
			{ fret: 3, string: 5, text: "3" },
		],
		barres: [],
	};

	return <ChordDiagram chord={cMajor} />;
};
```

## Usage Examples

### Basic Chord

```tsx
<ChordDiagram
	chord={{
		fingers: [
			{ fret: 1, string: 2, text: "1" },
			{ fret: 2, string: 4, text: "2" },
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
			{ fret: 2, string: 3, text: "2" },
			{ fret: 3, string: 5, text: "3" },
		],
		barres: [{ fret: 1, fromString: 6, toString: 1 }],
	}}
/>
```

### Using Fret Notation

```tsx
<ChordDiagram
	instrument={{
		tuning: ["E", "A", "D", "G", "B", "E"],
		chord: "x32010", // C Major
	}}
/>
```

### Custom Styling

```tsx
<ChordDiagram
	chord={chordData}
	width={200}
	height={250}
	dotColor="#FF5733"
	stringColor="#CCCCCC"
	fontFamily="Arial, sans-serif"
/>
```

## API Reference

### ChordDiagramProps

| Prop         | Type                  | Description                                |
| ------------ | --------------------- | ------------------------------------------ |
| `chord`      | `Chord`               | Chord data with fingers and barres         |
| `instrument` | `Partial<Instrument>` | Instrument configuration for fret notation |
| `width`      | `number`              | Total width of the SVG                     |
| `height`     | `number`              | Total height of the SVG                    |
| `dotColor`   | `string`              | Finger dot color                           |
| `fontFamily` | `string`              | Font family                                |
| ...          | ...                   | All other ChordStyle properties inline     |

### Chord

```typescript
interface Chord {
	fingers: Finger[];
	barres: Barre[];
	firstFret?: number;
	lastFret?: number;
}
```

### Finger

```typescript
interface Finger {
	fret: number; // Fret number (1-based)
	string: number; // String number (1-based, 1 = thickest)
	text?: string; // Optional text inside the circle
}
```

### Barre

```typescript
interface Barre {
	fret: number; // Fret number (1-based)
	fromString: number; // Starting string
	toString: number; // Ending string
	text?: string; // Optional text on the barre
}
```

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
```

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
