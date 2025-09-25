# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.1.0] - 2024-12-19

### Added

- **Open and Muted String Support**: Added support for rendering open strings ('O') and muted strings ('X') in chord diagrams
- **Enhanced Finger Interface**: Added `is_muted` property to `Finger` interface for indicating muted strings
- **Custom String Indicators**: Added `openStringColor`, `mutedStringColor`, `openStringSize`, and `mutedStringSize` properties to `ChordStyle`
- **Improved Fret Notation**: Enhanced parsing to support 'o' for open strings and 'x' for muted strings
- **Visual Positioning**: Open and muted string indicators are positioned at fret zero (leftmost position) above the thickest fret line
- **Performance Test Story**: Added performance test story rendering 50 chord diagrams simultaneously

### Enhanced

- **Fret Notation Parsing**: Now correctly parses 'o' and 'x' characters in fret notation strings
- **Validation**: Updated validation to accept `fret: 0` for open strings and validate `is_muted` property
- **Visual Rendering**: Improved visual rendering with proper positioning and styling for open/muted indicators
- **Type Safety**: Enhanced TypeScript interfaces with comprehensive type checking for new properties

### Technical Details

- Open strings render as empty circles ('O') with customizable color and size
- Muted strings render as red 'X' symbols with customizable color and size
- Indicators are positioned at fret zero (first vertical line) for clear visual distinction
- All existing functionality remains backward compatible
- Enhanced test coverage with new test cases for open/muted string functionality

### API Changes

```tsx
// New Finger interface
interface Finger {
	fret: number; // Now supports 0 for open strings
	string: number;
	is_muted: boolean; // NEW: indicates if string is muted
	text?: string;
}

// Enhanced ChordStyle interface
interface ChordStyle {
	// ... existing properties
	openStringSize: number; // NEW: size of open string indicator
	mutedStringSize: number; // NEW: size of muted string indicator
	openStringColor: string; // NEW: color of open string indicator
	mutedStringColor: string; // NEW: color of muted string indicator
}
```

### Examples

```tsx
// Chord with open and muted strings
<ChordDiagram
  chord={{
    fingers: [
      { fret: 1, string: 2, is_muted: false, text: "1" },
      { fret: 0, string: 1, is_muted: false }, // Open string (O)
      { fret: 0, string: 3, is_muted: true },  // Muted string (X)
    ],
    barres: []
  }}
/>

// With custom styling for indicators
<ChordDiagram
  chord={chord}
  style={{
    openStringColor: "#00FF00",  // Green for open strings
    mutedStringColor: "#FF0000", // Red for muted strings
    openStringSize: 14,
    mutedStringSize: 16,
  }}
/>

// Using fret notation with open/muted strings
<ChordDiagram
  instrument={{
    tuning: ["E", "A", "D", "G", "B", "E"],
    chord: "x32010" // 'x' = muted, '0' = open
  }}
/>
```

## [1.0.1] - 2024-12-19

### Fixed

- Updated development rules and guidelines
- Improved project documentation and specifications

## [1.0.0] - 2024-12-19

### Added

- Initial release of @svguitar/react
- ChordDiagram component for rendering guitar chord diagrams in SVG format
- Support for finger positions with optional text labels
- Support for barre chords (pestanas) across multiple strings
- Fret notation parsing (e.g., "x32010", "(10)(12)...")
- Custom tuning support for different guitar tunings
- High position chord support with firstFret property
- Comprehensive styling customization (colors, fonts, sizes, spacing)
- Full TypeScript support with comprehensive type definitions
- React.memo optimization for performance
- Comprehensive test suite with 18 tests (100% passing)
- Storybook documentation with interactive examples
- Library mode build configuration for NPM publishing
- Support for both ESM and CommonJS exports

### Features

- 🎸 Guitar chord diagrams in high-quality SVG format
- ⚡ High performance with React.memo optimization
- 🎨 Fully customizable styling (colors, fonts, sizes, spacing)
- 📱 Responsive SVG-based rendering
- 🔧 Full TypeScript support
- 🧪 Comprehensive test coverage
- 📚 Interactive Storybook documentation

### Technical Details

- Built with React 19.1.1 and TypeScript 5.8.3
- Uses Vite 7.1.7 for build system
- Tested with Vitest and React Testing Library
- Formatted with Prettier and linted with ESLint
- Optimized for tree-shaking and performance

### API

- `ChordDiagram` - Main component
- `ChordDiagramProps` - Component props interface
- `Chord` - Chord data structure
- `Finger` - Finger position interface
- `Barre` - Barre chord interface
- `Instrument` - Instrument configuration
- `ChordStyle` - Styling options
- Utility functions for parsing and validation

### Examples

```tsx
// Basic chord
<ChordDiagram
  chord={{
    fingers: [{ fret: 1, string: 2, text: "1" }],
    barres: []
  }}
/>

// With fret notation
<ChordDiagram
  instrument={{
    tuning: ["E", "A", "D", "G", "B", "E"],
    chord: "x32010"
  }}
/>
```
