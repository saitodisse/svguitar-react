# Changelog

## 1.10.0 (2025-10-01)

### Major Features

- **Tailwind CSS v4 Integration**: Complete migration to Tailwind CSS v4.1.13
    - `@tailwindcss/vite` plugin for optimal Vite integration
    - CSS variables-based design system
    - Dark theme with customizable tokens
    - Optimized build performance

- **shadcn/ui Components**: Production-ready accessible UI components
    - Components: `Button`, `Input`, `Label`, `Select`, `RadioGroup`, `Slider`
    - Built on Radix UI primitives for world-class accessibility
    - Fully customizable with Tailwind utilities
    - CLI support via `pnpm dlx shadcn@latest add [component]`

- **Dark Mode Support**: System-aware theming
    - `ThemeProvider` with light/dark/system modes
    - Automatic OS preference detection
    - localStorage persistence
    - Default: `system` mode

### UI/UX Improvements

- **Redesigned Demo App**: Modern interface with Tailwind utilities
    - Responsive grid layout (mobile/desktop breakpoints)
    - Glassmorphism effects with backdrop-blur
    - Improved visual hierarchy and spacing
    - Better color contrast and accessibility

- **Enhanced Form Controls**: Native HTML replaced with shadcn/ui
    - `Input` component for chord input
    - `Select` dropdown for view and font selection
    - `Slider` components for all numeric controls
    - `RadioGroup` for language selection
    - Semantic `Label` associations for accessibility

### Developer Experience

- **Path Mapping**: `@/*` alias configured across all configs
    - `tsconfig.json` and `tsconfig.app.json` updated
    - `vite.config.ts` and `vite.config.app.ts` with resolve aliases
    - Proper TypeScript support for imports

- **Configuration Files Added**:
    - `components.json`: shadcn/ui CLI configuration
    - `tailwind.config.ts`: Tailwind theme and content paths
    - `src/lib/utils.ts`: `cn()` helper for class merging
    - `src/components/theme-provider.tsx`: Theme management

- **ESLint Updates**:
    - Global ignores for `dist-app` and `storybook-static`
    - Exception for UI components pattern (`react-refresh/only-export-components`)

### Dependencies

**Added**:

- `@radix-ui/react-label@2.1.7`
- `@radix-ui/react-select@2.2.6`
- `@radix-ui/react-radio-group@1.3.8`
- `@radix-ui/react-slider@1.3.6`
- `@radix-ui/react-slot@1.2.3`
- `@tailwindcss/vite@4.1.13`
- `tailwindcss@4.1.13`
- `class-variance-authority@0.7.1`
- `clsx@2.1.1`
- `tailwind-merge@3.3.1`
- `lucide-react@0.544.0`
- `autoprefixer@10.4.21`
- `postcss@8.5.6`

### Tests

- **All 36 tests passing**: 21 unit + 15 Storybook
- Fixed test assertions to match current implementation
- Storybook stories updated with correct dimensions
- horizontal-left layout tests corrected

### Build

- Library build: ✅ Verified
- App build: ✅ Verified
- Storybook build: ✅ Verified

### Files Changed

- **Modified**: 15 files (App.tsx, configs, tests, styles)
- **Added**: 9 files (shadcn/ui components, theme-provider, utils)
- **Simplified**: App.css (now placeholder)

## 1.9.0 (2025-10-01)

### Enhancements

- **Horizontal-Left Layout Refinements**:
    - Tuning labels now render à direita do braço na view `horizontal-left`.
    - Numeração dos trastes espelhada: leitura da esquerda para a direita resulta em `3, 2, 1, 0`.
    - Indicadores de cordas soltas/mutadas reposicionados para acompanhar o braço espelhado.
- **Layout Engine Atualizado**: `horizontalLeftEngine` agora reflete o novo posicionamento para cordas, dedos e pestanas sem uso de `transform` global.
- **Componentes sincronizados**: `TuningLabels` e `FretNumbers` passam a respeitar automaticamente o comportamento específico da view `horizontal-left`.

### Testes e Qualidade

- Adicionados testes dedicados para validar layout `horizontal-left` em `TuningLabels`, `FretNumbers` e integração do `ChordDiagram`.
- Testes de Storybook atualizados garantindo play-test para a view espelhada.

### Documentação

- Specs atualizadas descrevendo o novo comportamento da view `horizontal-left`.
- Quickstart e tasks ajustados com o novo fluxo de labels e numeração.

## 1.8.0 (2025-01-30)

### Major Features

- **View-Based Layout System**: Complete implementation of 4 predefined views without global transforms
    - `horizontal-right` (default): Standard right-handed horizontal layout
    - `horizontal-left`: Left-handed horizontal layout (mirrored string order)
    - `vertical-right`: Vertical layout with low E string on the left
    - `vertical-left`: Vertical layout with low E string on the right
- **Pluggable Layout Engines**: Strategy pattern implementation for custom layout logic
    - `LayoutEngine` interface for creating custom positioning strategies
    - `layoutRegistry` for managing and registering custom engines
    - Precedence system: `layoutEngine` > `view` > default
- **Mapping-per-View Architecture**: Absolute coordinate mapping without SVG transforms
    - Each view calculates coordinates independently
    - Consistent horizontal text orientation across all views
    - Centralized dot positioning maintained in all views

### Breaking Changes

- **Props Removed**: `orientation` and `handedness` props have been removed
- **Migration Required**: Replace with new `view` prop
    - `orientation="horizontal"` + `handedness="right"` → `view="horizontal-right"`
    - `orientation="horizontal"` + `handedness="left"` → `view="horizontal-left"`
    - `orientation="vertical"` + `handedness="right"` → `view="vertical-right"`
    - `orientation="vertical"` + `handedness="left"` → `view="vertical-left"`

### New Interfaces

- **`ViewId`**: Type for predefined view identifiers
- **`LayoutEngine`**: Strategy interface for custom layout logic
- **`LayoutFrame`**: Layout configuration and grid dimensions
- **`LayoutArgs`**: Arguments passed to layout engine methods

### API Additions

- **New Props**:
    - `view?: ViewId` - Select predefined layout view
    - `layoutEngine?: LayoutEngine` - Inject custom layout strategy
- **New Exports**:
    - `layoutRegistry` - Registry for managing layout engines
    - `resolveViewId()` - Resolve effective view ID with precedence
    - `getLayoutEngine()` - Get layout engine by view ID
    - `DEFAULT_VIEW` - Default view constant ("horizontal-right")

### Technical Improvements

- **No Global Transforms**: Removed all SVG `transform` attributes for better compatibility
- **Enhanced Type Safety**: Comprehensive TypeScript interfaces for layout system
- **Modular Architecture**: Separate layout engines in individual files
- **Improved Maintainability**: Clean separation between rendering and positioning logic
- **Better Extensibility**: Easy to add new views or custom layout strategies

### Documentation

- **Updated README**: Comprehensive examples for all views and custom layout engines
- **Enhanced Specifications**: Complete documentation of view system and layout engines
- **API Reference**: Detailed `LayoutEngine` interface documentation
- **Migration Guide**: Clear instructions for upgrading from v1.7.0

### Component Updates

- **ChordDiagram**: Now resolves layout engine and builds layout frame
- **Fretboard**: Refactored to use engine mapping for frets and strings
- **Finger**: Uses engine for positioning and indicators
- **Barre**: Uses engine for barre rectangle calculations
- **FretNumbers**: Adapted for engine-based fret axis mapping
- **TuningLabels**: Supports both horizontal and vertical layouts with consistent text orientation

## 1.7.0 (2025-01-27)

### Breaking Changes

- **Layout API Update**: Replaced `orientation` and `handedness` props with new `view` and `layoutEngine` system
- **View System**: New predefined views: `horizontal-right`, `horizontal-left`, `vertical-right`, `vertical-left`
- **Layout Engines**: Introduced pluggable layout engine system for custom positioning strategies

### Features

- **New View System**: Simplified layout control with predefined views
- **Layout Engines**: Extensible layout system with 4 built-in engines
- **Mapping-per-view**: Absolute coordinate mapping without global transforms
- **Custom Layout Engines**: Support for custom layout strategies via `layoutEngine` prop
- **View Resolution**: Precedence system: `layoutEngine` > `view` > default

### Improvements

- **Performance**: Removed global transforms, using absolute coordinate mapping
- **Text Legibility**: Horizontal text orientation maintained in all views
- **Centralization**: Consistent dot positioning in fret spaces across all views
- **Type Safety**: Enhanced TypeScript support with new layout interfaces
- **Extensibility**: Registry-based layout system for easy customization

### Technical Details

- **New Interfaces**: `ViewId`, `LayoutEngine`, `LayoutFrame`, `LayoutArgs`
- **Layout Registry**: Centralized management of layout engines
- **Validation**: Enhanced view validation with proper error handling
- **Documentation**: Comprehensive TSDoc for all new layout interfaces

## 1.6.0 (2025-01-27)

### Breaking Changes

- **API Simplification**: Removed `ChordStyle` interface from public API
- **Inline Props**: All styling properties are now inline in `ChordDiagramProps` instead of nested in a `style` object

### Features

- **Simplified API**: Styling properties are now passed directly as props to `ChordDiagram`
- **Better TypeScript Support**: Improved type inference for styling properties
- **Cleaner Imports**: Removed unnecessary `ChordStyle` import from public API

### Improvements

- **Code Cleanup**: Removed duplicate type definitions and unnecessary imports
- **Performance**: Reduced bundle size by removing unused type exports
- **Developer Experience**: More intuitive API with inline props

### Migration Guide

**Before (v1.5.0):**

```tsx
<ChordDiagram
	chord={chordData}
	style={{
		width: 200,
		height: 250,
		dotColor: "#FF5733",
		fontFamily: "Arial, sans-serif",
	}}
/>
```

**After (v1.6.0):**

```tsx
<ChordDiagram chord={chordData} width={200} height={250} dotColor="#FF5733" fontFamily="Arial, sans-serif" />
```

## 1.5.0 (2025-01-27)

### Features

- **Enhanced Mobile Defaults**: Updated mobile default settings for better user experience
- **Responsive Width Support**: Added width parameter to mobile and desktop defaults for better responsive behavior
- **Optimized Fret Count**: Added fretCount parameter to device-specific defaults

### Mobile Defaults Update

Updated mobile defaults for improved mobile experience:

- Width: 348px (increased from 270px)
- Height: 222px (decreased from 255px)
- Fret Width: 53px (increased from 48px)
- Fret Count: 5 (new default for mobile)
- Dot Size: 18px (maintained)
- Barre Height: 6px (increased from 5px)
- Fret Height: 27px (maintained)
- Fret Text Size: 21px (maintained)

### Technical Improvements

- Enhanced responsive design with device-specific defaults
- Improved mobile optimization with better proportions
- Added consistent default management for width and fretCount parameters
- Better mobile/desktop detection and configuration

---

## 1.4.0 (2025-01-27)

### Features

- **Mobile Optimization**: Added automatic mobile detection and optimized default settings for mobile devices
- **Sticky SVG**: Implemented sticky positioning for the SVG component on mobile devices during scroll
- **Responsive Design**: Enhanced mobile experience with better touch interactions and visual feedback

### Mobile Defaults

When mobile mode is detected (screen width ≤ 960px), the following optimized settings are automatically applied:

- Height: 299px (increased from 250px)
- Fret Width: 73px (increased from 57px)
- Dot Text Size: 11px (decreased from 13px)
- Dot Size: 20px (increased from 16px)
- Barre Height: 5px (decreased from 7px)
- Fret Height: 38px (increased from 30px)
- Tuning Text Size: 20px (increased from 13px)
- Fret Text Size: 23px (increased from 20px)

### Technical Improvements

- Added `useIsMobile()` hook for responsive behavior detection
- Implemented CSS sticky positioning with backdrop blur effect
- Enhanced TypeScript types for better error handling
- Fixed linting issues and improved code quality
- Fixed Vercel build error by correcting import path in App.tsx

---

## 1.3.1 (2025-09-28)

### Features

- **i18n**: Add internationalization support with English and Portuguese languages.

---

## 1.3.0 (2025-09-27)

### Added

- Validation & error policy: `validation (strict|lenient)`, `invalidBehavior`, `fallbackChord`
- Error handling hooks: `onError` (callback) and `errorFallback` (inline UI)
- Helper surface (docs): `isValidChord`, `tryParseChord`, `normalizeChord`, and exported error codes

### Behavior

- Default policy: `validation="strict"`, `invalidBehavior="keep-previous"`, `fallbackChord="000000"`
- Keeps last valid chord on invalid input; if none exists, renders `fallbackChord`

### Docs

- Updated spec, plan, contracts, validation rules, data model, quickstart, research, and tasks

### Internal

- Wiring in `ChordDiagram` to respect new policies and render optional fallback UI

### Changed

- **Simplified API**: Removed `openStringSize` and `mutedStringSize` properties from `ChordStyle` interface
- **Consistent Sizing**: Open string and muted string indicators now use `dotSize` for consistent sizing
- **Cleaner API**: Reduced complexity by eliminating redundant size properties

### Breaking Changes

- **Removed Properties**: `openStringSize` and `mutedStringSize` are no longer available in the `ChordStyle` interface
- **Migration**: Use `dotSize` to control the size of all indicators (fingers, open strings, and muted strings)

### Technical Improvements

- **Simplified Constants**: Removed unused size properties from default style constants
- **Updated Specifications**: All documentation and specifications updated to reflect the simplified API
- **Storybook Updates**: Removed controls for deprecated properties from Storybook stories

## [1.2.0] - 2024-12-19

### Enhanced

- **Improved Dot Positioning**: Enhanced finger dot positioning to ensure consistent centering within fret spaces
- **Dynamic Fret Width Support**: Dots now automatically adjust their position when `fretWidth` changes, maintaining perfect centering
- **Centralized Utility Functions**: Added utility functions for consistent position calculations across all components

### Technical Improvements

- **Centralized Positioning Logic**: Created `getFingerX()` and `getFingerY()` utility functions for consistent dot positioning
- **Enhanced Fret Width Responsiveness**: Dots now use the formula `x = startX + (finger.fret - firstFret + 0.5) * fretWidth` for perfect centering
- **Improved Component Architecture**: All positioning components now use centralized utility functions for consistency
- **Better Code Maintainability**: Refactored hardcoded positioning values to use dynamic calculations

### API Changes

```tsx
// Enhanced positioning with 0.5 centering factor
const x = startX + (finger.fret - firstFret + 0.5) * fretWidth;

// Utility functions now available:
// - getStartX(style) - calculates starting X position
// - getStartY(style) - calculates starting Y position
// - getFingerX(finger, firstFret, fretWidth, startX) - calculates finger X position
// - getFingerY(finger, stringCount, fretHeight, startY) - calculates finger Y position
```

### Examples

```tsx
// Dots now perfectly center regardless of fretWidth changes
<ChordDiagram
  chord={chord}
  style={{
    fretWidth: 25, // Small fret width - dots still centered
    // ... other styles
  }}
/>

<ChordDiagram
  chord={chord}
  style={{
    fretWidth: 75, // Large fret width - dots still centered
    // ... other styles
  }}
/>
```

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
