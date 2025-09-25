# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

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
