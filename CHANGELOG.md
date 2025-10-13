# Changelog

## 2.1.2 (2025-10-13)

### 🐛 Bug Fixes

#### AutoFirstFret with Open Strings

Fixed bug where `autoFirstFret` was incorrectly adjusting `firstFret` for chords with open strings that fit within the default range.

**Problem:**
- Chord "005500" was rendering frets 5-9 instead of 1-5
- Open strings were not visible even when fingers fit in the default range

**Root Cause:**
- The algorithm was always adjusting `firstFret` to `minFret` of pressed fingers
- It didn't consider whether open strings (fret 0) should be preserved

**Hybrid Rule Implemented:**
```typescript
if (maxFret <= fretCount) {
  if (hasOpenStrings) {
    // Keep firstFret=1 to show open strings
    return { firstFret: 1, ... };
  }
  // No open strings → start at minFret to save space
  return { firstFret: minFret, ... };
}
// maxFret > fretCount → adjust to minFret
return { firstFret: minFret, ... };
```

**Examples:**
- `"005500"` with fretCount=5: maxFret (5) <= 5, has open strings → firstFret=1 ✅
- `"006600"` with fretCount=4: maxFret (6) > 4 → firstFret=6 ✅
- `"x54232"` with fretCount=5: maxFret (5) <= 5, no open strings → firstFret=2 ✅

**Impact:**
- ✅ Chords with open strings now display correctly
- ✅ Open strings are preserved when possible
- ✅ Chords without open strings optimize space usage
- ✅ All 200 tests passing + 30 Storybook tests

**Files Changed:**
- `src/components/ChordDiagram/utils/autoFirstFret.ts` - Added open string detection
- `src/components/ChordDiagram/__tests__/bugfix-005500.test.tsx` - New comprehensive test suite (9 tests)
- `src/stories/ChordDiagram.stories.tsx` - Added BugFix005500 and BugFix006600 stories

## 2.1.1 (2025-10-13)

### 🐛 Bug Fixes

#### AutoFirstFret Calculation with AutoBarre

Fixed critical bug where `autoFirstFret` was calculating incorrect fret positions when used together with `autoBarreEnabled`.

**Problem:**

- Chord "x54232" was rendering frets 3-7 instead of 2-6
- Auto barre was not being detected on fret 2

**Root Cause:**

- In `ChordDiagram.tsx` line 193, `calculateAutoFirstFret` was using `effectiveChord.fingers` (which had fingers removed by autoBarre detection) instead of `chordData.fingers` (original fingers)
- This caused the minimum fret calculation to be incorrect (minFret = 3 instead of 2)

**Fix:**

- Changed to use `chordData.fingers` for firstFret calculation
- Added detailed comment explaining why original fingers must be used
- Created comprehensive test suite in `bugfix-x54232.test.tsx`
- Added Storybook story `BugFixX54232` for visual regression testing

**Impact:**

- ✅ All chords with autoBarre + autoFirstFret now render correctly
- ✅ Fret numbering is accurate
- ✅ Auto barre detection works as expected
- ✅ 191 tests passing (100% coverage maintained)

**Files Changed:**

- `src/components/ChordDiagram/ChordDiagram.tsx` - Fixed calculation logic
- `src/components/ChordDiagram/__tests__/bugfix-x54232.test.tsx` - New test suite
- `src/stories/ChordDiagram.stories.tsx` - Added BugFixX54232 story

## 2.1.0 (2025-10-13)

### ✨ Features

#### Auto First Fret

Nova propriedade `autoFirstFret` que calcula automaticamente a posição inicial do diagrama para acordes em posições altas.

**Principais recursos:**

- Cálculo automático de `firstFret` baseado nas posições dos dedos
- Ajuste automático de `fretCount` quando necessário (máximo 12 trastes)
- Precedência manual: `firstFret` manual sempre prevalece
- Console warnings quando `fretCount` é aumentado automaticamente
- Recálculo dinâmico quando props mudam

**Exemplo:**

```tsx
// Acordes em posições altas sem configuração manual
<ChordDiagram
	autoFirstFret={true}
	fretCount={4}
	fingers={[
		{ fret: 5, string: 1, is_muted: false },
		{ fret: 7, string: 2, is_muted: false },
		{ fret: 8, string: 3, is_muted: false },
	]}
	barres={[]}
/>
// → Automaticamente inicia em fret 5, todos os dedos visíveis
```

### Added

- Propriedade `autoFirstFret?: boolean` em `ChordDiagramProps`
- Funções utilitárias em `utils/autoFirstFret.ts`:
    - `getPressedFingers()`: Filtra dedos pressionados (fret > 0)
    - `shouldActivateAutoFirstFret()`: Verifica se há dedos fora do range
    - `calculateAutoFirstFret()`: Calcula firstFret e fretCount otimizados
    - `shouldApplyAutoFirstFret()`: Valida condições de ativação
- 8 novos testes unitários cobrindo todos os cenários
- 5 novas stories no Storybook demonstrando a feature
- Documentação completa no README.md

### Documentation

- Seção "Auto First Fret (High Position Chords)" no README
- Exemplos práticos de uso
- JSDoc completo nas funções
- Specs: `tasks-auto-first-fret.md`

## 2.0.1 (2025-10-12)

### Fixed

- Correções finais de formatação e documentação
- Ajustes nos testes para nova API inline

## 2.0.0 (2025-10-12)

### 💥 BREAKING CHANGES

#### API Refatorada: Props Inline

A API do componente `ChordDiagram` foi refatorada para usar props inline ao invés de objetos aninhados.

**Antes (v1.x):**

```tsx
<ChordDiagram
    instrument={{ chord: "x32010" }}
    chord={{ fingers: [...], barres: [...] }}
/>
```

**Agora (v2.0):**

```tsx
<ChordDiagram
    fretNotation="x32010"
    fingers={[...]}
    barres={[...]}
/>
```

### Changed

- **BREAKING**: Removidas props `instrument` e `chord`
- **BREAKING**: Renomeado `instrument.chord` → `fretNotation`
- Propriedades agora inline: `strings`, `frets`, `tuning`, `fretNotation`, `fingers`, `barres`, `firstFret`, `lastFret`
- Inferência automática de `strings` a partir de `tuning.length`
- Atualizado `ChordDiagramState`, `exportChordDiagramState`, `importChordDiagramState`

### Migration Guide

| v1.x                 | v2.0           |
| -------------------- | -------------- |
| `instrument.chord`   | `fretNotation` |
| `instrument.strings` | `strings`      |
| `chord.fingers`      | `fingers`      |
| `chord.barres`       | `barres`       |

## 1.22.0 (2025-10-12)

### New Features ✨

- **Auto Barre Detection**: Intelligent automatic barre (bar chord) detection and rendering
    - Automatically detects when a barre should be added based on finger distribution
    - Activates when there are more than 4 pressed fingers (fret > 0)
    - Places barre on the fret with the most fingers
    - Tie-breaker rule: chooses lowest fret number when multiple frets have same finger count
    - Barre covers from first to last string with finger on that fret
    - Automatically removes covered fingers from visualization for clean diagrams
    - New prop `autoBarreEnabled` (boolean, default: `true`) to enable/disable feature
    - Manual barres always take precedence over automatic detection
    - Fully tested with 19 new unit tests
    - 4 new Storybook examples demonstrating all use cases

### Documentation 📚

- Added comprehensive Auto Barre Detection section to quickstart guide
- Includes examples for enabled/disabled states, manual precedence, and tie-breaker rules
- Documented edge cases and special behaviors
- Updated specifications with FR-034, FR-035, FR-036

### Technical Improvements 🔧

- New utility module `src/components/ChordDiagram/utils/autoBarre.ts` with:
    - `detectAutoBarre()`: Core detection algorithm
    - `removeFingersCoveredByBarre()`: Visual cleanup function
    - `shouldApplyAutoBarre()`: Precedence logic
- Full TypeScript type safety with JSDoc documentation
- Follows TDD approach (Red-Green-Refactor)
- Zero breaking changes - fully backward compatible

## 1.21.0 (2025-10-11)

### Improvements 🎨

- **Default Values Synchronization**: Complete alignment of default values across all components
    - `SIMPLE_DEFAULTS` now uses `ChordDiagramState` interface for type safety
    - All `useQueryState` hooks now reference `SIMPLE_DEFAULTS` as single source of truth
    - View, barres configuration, and all offsets properly initialized from defaults
    - Eliminated hardcoded values throughout the application
    - Added optional chaining for safe access to potentially undefined properties

### Bug Fixes 🐛

- **Export State**: Fixed missing `instrument.chord` field in export when barres are enabled
- **Default State**: Fixed initialization of barre-related states from `SIMPLE_DEFAULTS.chord.barres`
- **Type Safety**: Added proper TypeScript type annotations to `SIMPLE_DEFAULTS`
- **Tuning**: Aligned tuning array to use `SIMPLE_DEFAULTS.instrument.tuning`

### Technical Improvements 🔧

- Improved consistency between default state, export, import, and UI rendering
- Enhanced type safety with optional chaining for all `SIMPLE_DEFAULTS` accesses
- All 40+ properties now guaranteed to match across the system
- Better developer experience with single source of truth for all defaults

## 1.20.0 (2025-10-11)

### New Features ✨

- **Export/Import State**: Complete state management system for ChordDiagram
    - Export entire diagram state as JSON with `exportChordDiagramState()`
    - Import state from JSON with `importChordDiagramState()`
    - Copy state to clipboard with `copyStateToClipboard()`
    - Visual feedback buttons in demo app (Export State 📋 / Import State 📥)
    - Complete validation of imported JSON state
    - Automatic fallback values for missing properties
    - Deterministic serialization - same state always produces same JSON
    - State includes metadata (version, timestamp)
    - All 40+ customization properties included in export/import

### Improvements 🎨

- **Developer Experience**: Easy state debugging via console.log of exported JSON
- **Preset Management**: Save and load favorite chord diagram configurations
- **Sharing**: Share exact diagram configurations via JSON
- **Persistence**: Maintain state between sessions

### Documentation 📚

- Added complete export/import specification in `specs/001-guitar-svg/export-import-spec.md`
- Updated data model with `ChordDiagramState` and `FretboardState` interfaces
- Implementation guide in `specs/001-guitar-svg/implement-export-import.md`
- Tasks breakdown in `specs/001-guitar-svg/tasks-export-import-state.md`
- Multilingual support (EN/PT) for export/import UI

### API Changes

- New utility functions in `utils/exportState.ts`:
    - `exportChordDiagramState(props: ChordDiagramProps): ChordDiagramState`
    - `copyStateToClipboard(state: ChordDiagramState): Promise<void>`
- New utility functions in `utils/importState.ts`:
    - `validateChordDiagramState(json: unknown): ValidationResult`
    - `importChordDiagramState(state: ChordDiagramState): ChordDiagramProps`
- New utility functions in `utils/fretboardState.ts`:
    - `getFretboardState(frame: LayoutFrame, engine: LayoutEngine): FretboardState`
- New TypeScript interfaces:
    - `ChordDiagramState` - Complete state for export/import
    - `FretboardState` - Deterministic fretboard state
    - `ValidationResult` - State validation result

## 1.19.1 (2025-10-11)

### Bug Fixes 🐛

- **Vertical Layouts**: Fixed `barresWidth` property not affecting barre thickness in vertical views (`vertical-right` and `vertical-left`)
    - In vertical layouts, barres are drawn horizontally, so `barresWidth` now correctly controls the height/thickness of the SVG rectangle
    - In horizontal layouts, `barresWidth` continues to control the width as before
    - Updated all specifications and documentation to reflect this behavior
    - Fixed and updated related unit tests

### Documentation 📚

- Updated all specification files to clarify that `barresWidth` controls:
    - Width (SVG rect width) in horizontal views
    - Height/thickness (SVG rect height) in vertical views
- Updated JSDoc comments in TypeScript types
- Updated quickstart guide and API contracts

## 1.19.0 (2025-10-11)

### New Features ✨

- **Internationalization (i18n)**: Complete multilingual support for the demo application
    - Added `react-i18next` for translation management
    - Support for English (en) and Portuguese (pt) languages
    - Language switcher in the control panel
    - All UI text now fully translatable
    - Organized translation files in `src/locales/` directory
    - Easy to add new languages with structured JSON files

### Improvements 🎨

- **Code Quality**: Removed debug console.log statements from ChordDiagram component
- **UI Consistency**: All sections and labels now use translation function `t()`
- **Developer Experience**: Simplified maintenance with centralized translation management

### Documentation 📚

- Translation files structure documented
- Easy-to-follow pattern for adding new translations

## 1.18.0 (2025-10-09)

### Breaking Changes ⚠️

- **Tailwind CSS v4 Upgrade**: Upgraded from Tailwind CSS v3.4.17 to v4.1.14
    - New `@tailwindcss/vite` plugin for better performance
    - Removed `tailwind.config.ts` - theme configuration now in CSS with `@theme`
    - Removed `autoprefixer` dependency (now integrated)
    - Added compatibility styles to maintain visual consistency
    - All builds and tests passing successfully

### Infrastructure 🔧

- **Storybook Deployment**: Complete setup for Storybook deployment to Vercel
    - Created `vercel.storybook.json` configuration
    - Added GitHub Actions workflow for automatic deployment
    - Added deployment scripts: `deploy-storybook` and `deploy-storybook:prod`
    - Updated documentation with deployment guides

### Improvements 🎨

- **Build Performance**: Faster builds with Tailwind CSS v4's dedicated Vite plugin
- **CSS Processing**: More efficient CSS generation and tree-shaking
- **Developer Experience**: Simplified configuration with CSS-native theme definitions

### Documentation 📚

- Updated README with Storybook deployment information
- Added comprehensive Tailwind v4 upgrade documentation (deleted by user)
- Added Storybook deployment guides (deleted by user)
- Added GitHub Actions workflow for automated deployments

## 1.17.0 (2025-10-09)

### New Features ✨

- **Nut (Fret Zero) Customization**: Complete control over nut appearance
    - `nutStrokeWidth`: Multiplier (0-0.5) for nut line thickness (default: 0.075)
    - `nutOffsetX`: Multiplier (-0.5-0.5) for horizontal offset (default: 0)
    - `nutOffsetY`: Multiplier (-5-5) for vertical offset (default: 0)
    - `nutOpacity`: Opacity from 0 to 1 (default: 1.0)
    - `nutColor`: Custom color for nut line (default: same as fretColor)

- **Canvas Positioning**: Global diagram positioning for layouts
    - `canvasOffsetX`: Pixels for horizontal offset (default: 0)
    - `canvasOffsetY`: Pixels for vertical offset (default: 0)
    - Useful for padding/margin and preparing for future zoom functionality

- **38 New Tests**: Comprehensive test coverage for all new features
- **New Storybook Stories**: Interactive demonstrations of nut and canvas customization

### Bug Fixes 🐛

- **`stringIndicatorOffsetX`**: Fixed bug where offset was being applied twice
    - Now correctly moves open/muted string indicators in all views
    - Removed duplicate offset application in Finger component
- **Vertical Layout Barres**: Fixed incorrect height calculation
    - Barres now use `fretHeight` instead of `barresWidth` for proper rendering

### Improvements 🎨

- Better Storybook control ranges for improved UX:
    - `nutStrokeWidth`: 0-0.5 (more realistic range)
    - `nutOffsetX`: -0.5-0.5 (more controlled range)
    - `fretTextOffsetX`: -1-1 (more practical range)

## 1.16.0 (2025-10-08)

### Breaking Changes ⚠️

- **`tuningLabelOffset` removed** → Replaced by `tuningLabelOffsetX` and `tuningLabelOffsetY`
    - Old behavior: Single offset value (0-1) controlling distance from nut
    - New behavior: Separate X/Y control for horizontal and vertical adjustments
    - Migration: `tuningLabelOffset: 0.5` → `tuningLabelOffsetX: 0.5, tuningLabelOffsetY: 0.5`

- **`stringIndicatorOffset` renamed** → Now `stringIndicatorOffsetX` with added `stringIndicatorOffsetY`
    - Old: Single offset for open/muted indicators
    - New: Separate X/Y control
    - Migration: `stringIndicatorOffset: 0.7` → `stringIndicatorOffsetX: 0.7, stringIndicatorOffsetY: 0`

### New Features

- **Barres Width**: Added `barresWidth` prop to control horizontal width of barre rectangles
    - Type: `number` (pixels)
    - Default: 8
    - Independent control from `barreHeight`

- **Barres Opacity**: Added `barresOpacity` prop to control transparency of barres
    - Type: `number` (0-1)
    - Default: 1.0
    - Useful for subtle barre rendering or layering effects

- **Barres Offset**: Added `barresOffsetX` and `barresOffsetY` props for fine-tuning barre positioning
    - Type: `number` (-5 to 5 multiplier)
    - Default: 0 for both
    - Applied to fretWidth (X) and fretHeight (Y)

- **Tuning Labels Split Offsets**: Replaced single offset with X/Y control
    - `tuningLabelOffsetX`: Horizontal adjustment (-5 to 5 multiplier)
    - `tuningLabelOffsetY`: Vertical adjustment (-5 to 5 multiplier)
    - Default: 0.5 for both
    - More flexible positioning across different layouts

- **String Indicators Split Offsets**: Enhanced with Y-axis control
    - `stringIndicatorOffsetX`: Horizontal distance from nut (-5 to 5 multiplier)
    - `stringIndicatorOffsetY`: Vertical adjustment (-5 to 5 multiplier)
    - Default: 0.5 for X, 0 for Y
    - Better control of 'O' and 'X' indicator positioning

- **Fret Numbers Offset**: Added `fretTextOffsetX` and `fretTextOffsetY` props
    - Type: `number` (-5 to 5 multiplier for each)
    - Default: 0 for both
    - Fine-tune positioning of fret number labels
    - Works across all 4 views (horizontal/vertical, right/left)

### Technical Improvements

- **Extended Offset Range**: All offset multipliers now support -5 to 5 (previously 0-1)
    - Negative values for reverse direction
    - Greater flexibility for custom layouts
    - Backward compatible with default values

- **Layout Engines Updated**: All 4 layout engines updated to support new offset props
    - horizontalRight, horizontalLeft, verticalRight, verticalLeft
    - Consistent offset application across different views

- **Test Coverage**: 113/113 tests passing
    - Updated unit tests for all layout engines
    - Updated component tests (Barre, TuningLabels, Finger, FretNumbers)
    - Updated integration tests

### Documentation

- Updated `spec.md` with FR-030 to FR-033
- Updated `data-model.md` with new interfaces
- Updated `contracts/chord-diagram-api.md` with validation rules
- Added 5 new examples in `quickstart.md` (Examples 14-18)
- Created `tasks-advanced-offsets.md` with implementation plan

### Migration Guide

```jsx
// Before (v1.15.0)
<ChordDiagram
  tuningLabelOffset={0.5}
  stringIndicatorOffset={0.7}
/>

// After (v1.16.0)
<ChordDiagram
  tuningLabelOffsetX={0.5}  // Horizontal offset
  tuningLabelOffsetY={0.5}  // Vertical offset
  stringIndicatorOffsetX={0.7}  // Horizontal offset
  stringIndicatorOffsetY={0}    // Vertical offset (new)
  // New props
  barresWidth={8}
  barresOpacity={1.0}
  barresOffsetX={0}
  barresOffsetY={0}
  fretTextOffsetX={0}
  fretTextOffsetY={0}
/>
```

## 1.15.0 (2025-01-08)

### New Features

- **TuningLabel Customization**: Added `tuningLabelOffset` prop to control distance of tuning labels from nut
    - Type: `number` (0-1 multiplier applied to fretWidth/fretHeight)
    - Default: 0.5
    - Horizontal-right: higher values move labels left (away from nut)
    - Horizontal-left: higher values move labels right (away from nut)
    - Vertical: higher values move labels up (away from nut)

- **TuningLabel Format Toggle**: Added `tuningLabelFormat` prop to switch between scientific notation and note-only
    - Type: `"scientific" | "note-only"`
    - Default: `"scientific"`
    - `"scientific"`: Shows full notation (E2, A2, D3, G3, B3, E4)
    - `"note-only"`: Shows only note names (E, A, D, G, B, E) - saves space
    - Uses `tonal` library for correct parsing of accidentals (C#, Db, etc.)

- **String Indicator Customization**: Added `stringIndicatorOffset` prop to control distance of open/muted indicators from nut
    - Type: `number` (0-1 multiplier applied to fretWidth/fretHeight)
    - Default: 0.5
    - Controls positioning of 'O' (open) and 'X' (muted) indicators
    - Works consistently across all 4 views (horizontal-right, horizontal-left, vertical-right, vertical-left)

### Technical Improvements

- **Dependencies**: Added `tonal@6.4.2` for music theory calculations
    - Provides robust note parsing and formatting
    - Handles sharps, flats, and double accidentals correctly
    - Lightweight and modular

- **Layout Engines**: Updated all 4 layout engines to support `stringIndicatorOffset`
    - `horizontalRight.ts`: Updated `indicatorPosition` method
    - `horizontalLeft.ts`: Updated `indicatorPosition` method
    - `verticalRight.ts`: Updated `indicatorPosition` method
    - `verticalLeft.ts`: Updated `indicatorPosition` method

- **UI Controls**: Added 3 new controls to App.tsx
    - Slider for `tuningLabelOffset` (0-100%)
    - Select dropdown for `tuningLabelFormat`
    - Slider for `stringIndicatorOffset` (0-100%)
    - Full i18n support (English/Portuguese)

### Testing

- **Test Coverage Improvement**: Increased from 80.17% to 87.35%
    - Added 41 new tests (53 → 94 tests)
    - Created `utils.test.ts` with 10 tests for `formatTuningLabel`
    - Extended `TuningLabels.test.tsx` with 6 new tests
    - Extended `ChordDiagram.test.tsx` with 9 new tests
    - Created `horizontalLeftLayout.test.ts` with 7 comprehensive tests
    - Extended vertical layout tests with barre and indicator tests
    - All layout engines now have 100% code coverage

- **Test Results**: 109/109 tests passing
    - 94 unit tests
    - 15 Storybook integration tests
    - Fixed VerticalRight story test selector

### Documentation

- **Specifications**: Updated all spec documents with FR-027, FR-028, FR-029
    - `spec.md`: Added 3 new functional requirements
    - `data-model.md`: Updated ChordDiagramProps and ChordStyle interfaces
    - `contracts/chord-diagram-api.md`: Documented new props and validation rules
    - `quickstart.md`: Added 4 new usage examples

- **Tasks**: Created detailed task documents
    - `tasks-tuning-customization.md`: Implementation plan for tuning label features
    - `tasks-string-indicator-offset.md`: Implementation plan for indicator positioning

### Breaking Changes

None - All changes are backward compatible. New props are optional with sensible defaults.

## 1.14.0 (2025-01-15)

### Major Features

- **FretNumbers Semantic Correction**: Fixed semantic terminology and positioning for fret numbers in vertical layouts
    - Corrected terminology: FretNumbers now represent "fret position numbers" (casa numbers) instead of "fret numbers"
    - Fixed positioning: Numbers now appear in the middle of each fret position (casa) where fingers are placed
    - Casa 1: Number "1" positioned at the middle between nut (fret 0) and fret 1
    - Casa 2: Number "2" positioned at the middle between fret 1 and fret 2
    - Casa 3: Number "3" positioned at the middle between fret 2 and fret 3
    - Nut (fret 0): No number associated (correct behavior)
    - Both `vertical-right` and `vertical-left` views maintain consistent positioning

### Technical Improvements

- **Documentation Updates**: Updated all specification documents with correct semantic terminology
    - Updated `spec.md` with FR-025 and FR-026 corrections
    - Updated `contracts/chord-diagram-api.md` with proper positioning descriptions
    - Updated `data-model.md` with correct terminology
    - Updated `quickstart.md` with accurate usage examples
    - Updated `research.md` with technical justifications
    - Updated `tasks.md` with corrected ASCII examples

### Bug Fixes

- **Positioning Correction**: Fixed Y-coordinate calculation in `FretNumbers.tsx`
    - Changed from `(fretNumber - frame.firstFret - 0.5)` to `(fretNumber - frame.firstFret + 0.5)`
    - Numbers now correctly positioned in the middle of each fret position
    - Updated test expectations to match new positioning

### Testing

- **Test Updates**: Updated all tests to reflect new positioning and semantics
    - Updated `FretNumbers.test.tsx` with correct expected positions
    - Updated `VerticalLayouts.test.tsx` with adjusted Y-coordinate expectations
    - Updated `ChordDiagram.test.tsx` with corrected integration tests
    - Updated Storybook tests with proper positioning validation

## 1.13.0 (2025-01-15)

### Major Features

- **Vertical Layout Corrections**: Fixed string order and fret numbering for vertical chord diagrams
    - `vertical-right` view now displays strings in order `["E2", "A2", "D3", "G3", "B3", "E4"]` from left to right
    - `vertical-left` view now displays strings in order `["E4", "B3", "G3", "D3", "A2", "E2"]` from left to right
    - Both vertical views now have consistent fret numbering from top to bottom (0, 1, 2, 3, 4...)
    - Fret numbers positioned to the right of each fret in vertical layouts
    - Tuning labels correctly positioned above fret zero in all vertical views

### Technical Improvements

- **Layout Engine Updates**: Enhanced vertical layout engines for proper coordinate mapping
    - Updated `verticalRightEngine` to use correct string order and non-inverted fret progression
    - Updated `verticalLeftEngine` to use inverted string order but consistent fret progression
    - Improved `mapStringAxis` and `mapFretAxis` functions for accurate positioning
    - Enhanced `fingerPosition`, `barreRect`, and `indicatorPosition` calculations

- **Component Synchronization**: All components now work consistently with vertical layouts
    - `FretNumbers` component correctly displays ascending fret numbers in vertical views
    - `TuningLabels` component maintains proper positioning above fret zero
    - All finger dots, barres, and indicators respect the new coordinate system

### Testing and Quality

- **Enhanced Test Coverage**: Added comprehensive tests for vertical layout behavior
    - Added tests to verify correct string order mapping in both vertical engines
    - Added tests to ensure fret numbers increase from top to bottom in vertical views
    - Updated Storybook stories to showcase corrected vertical layouts
    - All existing tests continue to pass with new layout implementations

### Documentation

- **Updated Specifications**: Comprehensive documentation updates
    - Updated `spec.md` with specific string order requirements for vertical views
    - Added `FR-025` specification for vertical fret numbering behavior
    - Updated `research.md` with technical decisions for vertical layout corrections
    - Enhanced `quickstart.md` with examples of corrected vertical layouts

### Breaking Changes

- **Vertical Layout Behavior**: The string order and fret numbering in vertical views has been corrected
    - This may affect applications that were relying on the previous incorrect behavior
    - Applications using vertical layouts should verify that the new string order meets their requirements

## 1.12.0 (2025-01-15)

### Major Features

- **Clear Configuration Button**: Added "Clear" button to reset all settings to defaults
    - Button positioned in the control panel header for easy access
    - Resets all configuration parameters while preserving `view` and `lang` in querystring
    - Internationalized with English ("Clear") and Portuguese ("Limpar") labels
    - Provides quick way to restore default settings without manual adjustment

### Technical Improvements

- **Centralized Configuration System**: Complete refactor of hardcoded values
    - All configuration values moved to `DEFAULT_CONFIGS` constant
    - Single source of truth for all default values across mobile/desktop and horizontal/vertical views
    - Eliminated all hardcoded values in favor of centralized configuration
    - Improved maintainability and consistency across different view modes

- **React Pattern Optimization**: Enhanced useMemo implementation
    - Simplified dependency array with only essential dependencies (`view`, `isMobile`)
    - Moved constants outside component to prevent recreation on each render
    - Optimized performance by reducing unnecessary recalculations
    - Cleaner, more maintainable code structure

### Configuration Management

- **Enhanced Default Values**: Comprehensive configuration coverage
    - Added all missing properties to `DEFAULT_CONFIGS`: `stringCount`, `backgroundColor`, `fretColor`, `stringColor`, `dotColor`, `dotTextColor`, `barreColor`, `fretTextColor`, `tuningTextColor`, `openStringColor`, `mutedStringColor`, `fontFamily`, `chord`
    - Consistent values across all view modes (mobile/desktop × horizontal/vertical)
    - Type-safe configuration with `as const` for better TypeScript support

- **Improved Reset Functionality**: Enhanced clear configuration behavior
    - `clearConfiguration()` function now uses current defaults instead of hardcoded values
    - Maintains view-specific and device-specific configurations
    - Ensures consistency between initial load and reset functionality

### Developer Experience

- **Better Code Organization**: Improved code structure and maintainability
    - Constants extracted outside component scope
    - Cleaner separation of concerns
    - Reduced code duplication
    - Enhanced readability and maintainability

## 1.11.0 (2025-01-15)

### Bug Fixes

- **Fixed Select Component Transparency**: Resolved issue where dropdown options in shadcn/ui Select component were transparent
    - Downgraded from Tailwind CSS v4.1.13 to v3.4.17 for better compatibility
    - Updated Vite configuration to use PostCSS with Tailwind v3
    - Fixed `bg-popover` and `text-popover-foreground` classes not being applied correctly
    - All UI components now display with proper backgrounds and text colors

### Technical Improvements

- **Tailwind CSS Compatibility**: Improved compatibility with shadcn/ui components
    - Updated `vite.config.ts` to use PostCSS configuration
    - Added `postcss.config.js` for proper Tailwind v3 integration
    - Updated CSS imports to use `@tailwind` directives instead of `@import "tailwindcss"`
    - Ensured all UI components render correctly with proper styling

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
    - Glassmorphism effects with backdrop-blur-sm
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
