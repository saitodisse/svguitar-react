# Release Notes - @svguitar/react v1.3.0

## 🎸 @svguitar/react v1.3.0 - Validation Policy & Error Handling

**Release Date**: September 28, 2025

### 🆕 What's New in v1.3.0

- Validation policy: `validation` (strict | lenient)
- Invalid input behavior: `invalidBehavior` (keep-previous | render-fallback | suppress)
- Fallback chord: `fallbackChord` (default "000000")
- Error handling hooks: `onError` (delegate UI/telemetry) and `errorFallback` (inline UI)

### ✨ Defaults

- `validation="strict"`
- `invalidBehavior="keep-previous"`
- `fallbackChord="000000"`

### 📚 Examples

```tsx
<ChordDiagram
  instrument={{ strings: 6, frets: 4, tuning: ["E2","A2","D3","G3","B3","E4"], chord: "x3201" }}
  validation="strict"
  invalidBehavior="keep-previous"
  fallbackChord="000000"
  onError={(err, ctx) => console.error(ctx.code, err.message)}
/>

<ChordDiagram
  instrument={{ strings: 6, frets: 4, tuning, chord: "x32a10" }}
  validation="lenient"
  errorFallback={err => <div role="alert">{err.message}</div>}
/>
```

### 📋 Full Changelog

See [CHANGELOG.md](./CHANGELOG.md) for complete details.

---

# Release Notes - @svguitar/react v1.2.1

## 🎸 @svguitar/react v1.2.1 - Simplified API & Consistent Sizing

**Release Date**: December 19, 2024

### 🆕 What's New in v1.2.1

We're simplifying the API by removing redundant size properties and ensuring consistent sizing across all indicators!

### ✨ API Simplification

- **🎯 Consistent Sizing**: All indicators (fingers, open strings, muted strings) now use `dotSize` for uniform appearance
- **🧹 Cleaner API**: Removed `openStringSize` and `mutedStringSize` properties to reduce complexity
- **📐 Simplified Configuration**: One size property controls all indicator sizes for better consistency

### 🚨 Breaking Changes

- **Removed Properties**: `openStringSize` and `mutedStringSize` are no longer available
- **Migration Required**: Use `dotSize` to control all indicator sizes
- **Backward Compatibility**: Existing code will need to be updated to remove these properties

### 🔧 Migration Guide

**Before (v1.2.0):**

```tsx
const style = {
	dotSize: 12,
	openStringSize: 14, // ❌ No longer available
	mutedStringSize: 16, // ❌ No longer available
};
```

**After (v1.2.1):**

```tsx
const style = {
	dotSize: 12, // ✅ Controls all indicator sizes
};
```

### 📋 Full Changelog

See [CHANGELOG.md](./CHANGELOG.md) for complete details.

---

# Release Notes - @svguitar/react v1.2.0

## 🎸 @svguitar/react v1.2.0 - Enhanced Dot Positioning & Fret Width Responsiveness

**Release Date**: December 19, 2024

### 🆕 What's New in v1.2.0

We're excited to announce significant improvements to **@svguitar/react** with enhanced dot positioning and dynamic fret width responsiveness!

### ✨ Enhanced Features

- **🎯 Perfect Dot Centering**: Finger dots now automatically center within fret spaces regardless of `fretWidth` changes
- **📐 Dynamic Fret Width Support**: Dots maintain perfect positioning when fret width is adjusted
- **🔧 Centralized Positioning Logic**: New utility functions ensure consistent positioning across all components
- **⚡ Improved Performance**: Optimized positioning calculations for better rendering performance

### 🎨 Visual Improvements

```tsx
// Dots now perfectly center regardless of fretWidth changes
<ChordDiagram
	chord={chord}
	style={{
		fretWidth: 25, // Small fret width - dots still perfectly centered
		// ... other styles
	}}
/>

<ChordDiagram
	chord={chord}
	style={{
		fretWidth: 75, // Large fret width - dots still perfectly centered
		// ... other styles
	}}
/>
```

### 🔧 Technical Improvements

#### Enhanced Positioning Formula

```tsx
// New centralized positioning with 0.5 centering factor
const x = startX + (finger.fret - firstFret + 0.5) * fretWidth;
```

#### New Utility Functions

```tsx
// Centralized positioning utilities
import { getStartX, getStartY, getFingerX, getFingerY } from "@svguitar/react";

// Calculate starting positions
const startX = getStartX({ fretWidth, tuningTextSize });
const startY = getStartY({ fretTextSize });

// Calculate finger positions with perfect centering
const fingerX = getFingerX(finger, firstFret, fretWidth, startX);
const fingerY = getFingerY(finger, stringCount, fretHeight, startY);
```

### 🧪 Quality Improvements

- ✅ Enhanced positioning consistency across all components
- ✅ Improved fret width responsiveness
- ✅ Centralized utility functions for better maintainability
- ✅ All existing functionality preserved
- ✅ Comprehensive test coverage maintained (11/11 tests passing)

### 📊 Technical Details

- **Bundle Size**: 21.41 kB (ESM) / 14.57 kB (CJS)
- **Performance**: Optimized positioning calculations
- **Compatibility**: 100% backward compatible
- **Testing**: 11 Storybook tests + comprehensive unit tests

---

## 🎸 @svguitar/react v1.1.0 - Open & Muted String Support

**Release Date**: December 19, 2024

### 🆕 What's New in v1.1.0

We're excited to announce a major enhancement to **@svguitar/react** with comprehensive support for open and muted strings in guitar chord diagrams!

### ✨ New Features

- **🎯 Open String Support**: Render open strings as 'O' circles at fret zero
- **🚫 Muted String Support**: Display muted strings as red 'X' symbols at fret zero
- **🎨 Custom Indicators**: Full control over colors and sizes of open/muted string indicators
- **📍 Smart Positioning**: Indicators positioned at fret zero (leftmost) for clear visual distinction
- **🔧 Enhanced API**: New `is_muted` property in `Finger` interface for precise control

### 🎨 Visual Enhancements

```tsx
// Open and muted strings with custom styling
<ChordDiagram
	chord={{
		fingers: [
			{ fret: 1, string: 2, is_muted: false, text: "1" },
			{ fret: 0, string: 1, is_muted: false }, // Open string (O)
			{ fret: 0, string: 3, is_muted: true }, // Muted string (X)
		],
		barres: [],
	}}
	style={{
		openStringColor: "#00FF00", // Green for open strings
		mutedStringColor: "#FF0000", // Red for muted strings
		openStringSize: 14,
		mutedStringSize: 16,
	}}
/>
```

### 🔧 API Improvements

#### Enhanced Finger Interface

```tsx
interface Finger {
	fret: number; // Now supports 0 for open strings
	string: number;
	is_muted: boolean; // NEW: indicates if string is muted
	text?: string;
}
```

#### New Style Properties

```tsx
interface ChordStyle {
	// ... existing properties
	openStringSize: number; // NEW: size of open string indicator
	mutedStringSize: number; // NEW: size of muted string indicator
	openStringColor: string; // NEW: color of open string indicator
	mutedStringColor: string; // NEW: color of muted string indicator
}
```

### 🎼 Fret Notation Enhancement

```tsx
// Enhanced fret notation parsing
<ChordDiagram
	instrument={{
		tuning: ["E", "A", "D", "G", "B", "E"],
		chord: "x32010", // 'x' = muted, '0' = open, numbers = fretted
	}}
/>
```

### 🧪 Quality Improvements

- ✅ Enhanced test coverage with new open/muted string tests
- ✅ Performance test story rendering 50 chord diagrams
- ✅ Improved visual positioning and rendering
- ✅ Backward compatibility maintained
- ✅ Comprehensive TypeScript type safety

### 📊 Technical Details

- **Bundle Size**: 20.00 kB (ESM) / 13.82 kB (CJS)
- **Performance**: Optimized rendering with React.memo
- **Compatibility**: All existing functionality preserved
- **Testing**: 11 Storybook tests + comprehensive unit tests

---

## 🎸 @svguitar/react v1.0.0 - Initial Release

**Release Date**: December 19, 2024

### 🚀 What's New

We're excited to announce the first release of **@svguitar/react**, a high-performance React component for rendering beautiful guitar chord diagrams in SVG format.

### ✨ Key Features

- **🎸 Beautiful Chord Diagrams**: Render professional-quality guitar chord diagrams in SVG format
- **⚡ High Performance**: Optimized with React.memo and efficient rendering for smooth performance
- **🎨 Fully Customizable**: Complete control over colors, fonts, sizes, and spacing
- **📱 Responsive**: SVG-based rendering that scales perfectly on any device
- **🔧 TypeScript First**: Full TypeScript support with comprehensive type definitions
- **🧪 Well Tested**: 18 comprehensive tests with 100% pass rate
- **📚 Great Documentation**: Interactive Storybook with live examples

### 🎯 Use Cases

Perfect for:

- Music education applications
- Guitar learning platforms
- Chord reference tools
- Music composition software
- Guitar tablature applications
- Any app that needs to display guitar chords

### 🛠️ Installation

```bash
pnpm install @svguitar/react
# or
npm install @svguitar/react
# or
yarn add @svguitar/react
```

### 📖 Quick Start

```tsx
import React from "react";
import { ChordDiagram } from "@svguitar/react";

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

### 🎨 Customization

```tsx
<ChordDiagram
	chord={chordData}
	style={{
		width: 200,
		height: 250,
		dotColor: "#FF5733",
		stringColor: "#CCCCCC",
		fontFamily: "Arial, sans-serif",
	}}
/>
```

### 🔧 Advanced Features

- **Fret Notation Support**: Parse strings like "x32010" or "(10)(12)..."
- **Barre Chords**: Full support for barre chords across multiple strings
- **Custom Tunings**: Support for any guitar tuning
- **High Positions**: Display chords in higher fret positions
- **Open Strings**: Handle open and muted strings

### 📊 Technical Specifications

- **Bundle Size**: 18.22 kB (ESM) / 12.86 kB (CJS)
- **Dependencies**: React 18+ (peer dependency)
- **TypeScript**: Full type definitions included
- **Browser Support**: All modern browsers
- **Tree Shaking**: Fully supported

### 🧪 Quality Assurance

- ✅ 18 comprehensive tests (100% passing)
- ✅ Full TypeScript coverage
- ✅ ESLint and Prettier configured
- ✅ Storybook documentation
- ✅ Performance optimized

### 📚 Documentation

- [README.md](./README.md) - Complete usage guide
- [Storybook](http://localhost:6006) - Interactive examples
- [API Reference](./README.md#api-reference) - Complete API documentation

### 🤝 Contributing

We welcome contributions! Please see our [Contributing Guide](./CONTRIBUTING.md) for details.

### 📄 License

MIT License - see [LICENSE](./LICENSE) file for details.

### 🔗 Links

- [GitHub Repository](https://github.com/svguitar/svguitar-react)
- [NPM Package](https://www.npmjs.com/package/@svguitar/react)
- [Documentation](https://github.com/svguitar/svguitar-react#readme)

---

**Thank you for using @svguitar/react!** 🎸

If you find this library helpful, please consider giving it a ⭐ on GitHub!
