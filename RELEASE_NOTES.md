# Release Notes

## Version 2.4.0

**Release date:** May 24, 2026

### Shared Voicing Contract

This release adds first-class support for `FrettedInstrumentVoicing` from `achorde-musical-domain`.

```bash
pnpm add svguitar-react achorde-musical-domain
```

```tsx
import { ChordDiagram } from "svguitar-react";
import type { FrettedInstrumentVoicing } from "achorde-musical-domain";

const voicing: FrettedInstrumentVoicing = {
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

<ChordDiagram voicing={voicing} />;
```

### Documentation

- Public documentation is now written in English.
- README, quickstart, API contracts, and specs describe `voicing` as the preferred input.

## Version 2.3.x

### Maintenance

- Fixed partial instrument merging.
- Updated demo configuration.
- Added central agent instructions and repository skills.

## Version 2.2.x

### Layout and Style Constants

- Added view-specific style constants.
- Improved Storybook organization.
- Preserved backwards compatibility for default styles.

## Version 2.1.x

### Auto First Fret

- Added automatic first-fret calculation for high-position chords.
- Improved handling of open strings.
- Preserved manual override behavior.

## Version 2.0.x

### Inline API

- Simplified `ChordDiagram` usage with inline props.
- Improved TypeScript autocomplete.
- Improved default inference and validation behavior.

## Version 1.x

### Foundation

- Introduced SVG chord diagram rendering.
- Added fret notation, custom tuning, vertical and horizontal views, automatic barre detection, advanced offsets, and Storybook examples.
