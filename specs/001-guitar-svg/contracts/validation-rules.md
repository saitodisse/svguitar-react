# Regras de Validação - ChordDiagram Component

Este documento define as regras de validação para todas as entidades e props do componente ChordDiagram.

## 1. Validação de ChordDiagramProps

### Regra: Pelo Menos Um Input

```typescript
function validateChordDiagramProps(props: ChordDiagramProps): boolean {
	return !!(props.chord || props.instrument);
}
```

**Erro**: `ChordDiagramError("Pelo menos um de 'chord' ou 'instrument' deve ser fornecido", "MISSING_INPUT")`

### Política de Validação e Erros

```typescript
type InvalidBehavior = "keep-previous" | "render-fallback" | "suppress";

interface ErrorContext {
	input: string | Chord;
	code: ErrorCode;
	message: string;
	normalized?: Chord | null;
	warnings?: ErrorCode[];
}

interface ChordDiagramProps {
	validation?: "strict" | "lenient"; // default: strict
	invalidBehavior?: InvalidBehavior; // default: keep-previous
	fallbackChord?: string | Chord; // default: "000000"
	onError?: (error: ChordDiagramError, context: ErrorContext) => void;
	errorFallback?: React.ReactNode | ((error: ChordDiagramError, context: ErrorContext) => React.ReactNode);

	// Layout
	view?: ViewId; // default: "horizontal-right"
	layoutEngine?: LayoutEngine; // se fornecido, prevalece
}

// Comportamento de alto nível:
// - strict: invalida entradas e aplica invalidBehavior
// - lenient: tenta normalizar (pad/truncate, clamp) e emite warnings via onError
```

### Regra: Precedência de Props

```typescript
function getEffectiveInput(props: ChordDiagramProps): Chord | Instrument {
	if (props.chord) {
		return props.chord;
	}
	if (props.instrument) {
		return props.instrument;
	}
	throw new ChordDiagramError("Nenhum input válido fornecido", "MISSING_INPUT");
}
```

### Regra: Resolução de View

```typescript
type ViewId = "horizontal-right" | "horizontal-left" | "vertical-right" | "vertical-left";

function resolveViewId(props: ChordDiagramProps, DEFAULT_VIEW: ViewId = "horizontal-right"): ViewId {
	if (props.layoutEngine) return props.layoutEngine.id;
	if (props.view) return props.view;
	return DEFAULT_VIEW;
}

function validateView(registry: Record<ViewId, LayoutEngine>, viewId: ViewId): boolean {
	return Boolean(registry[viewId]);
}
```

## 2. Validação de Chord

### Regra: Arrays Válidos

```typescript
function validateChord(chord: Chord): boolean {
	return (
		Array.isArray(chord.fingers) &&
		Array.isArray(chord.barres) &&
		chord.fingers.every(finger => validateFinger(finger)) &&
		chord.barres.every(barre => validateBarre(barre))
	);
}
```

### Regra: Trastes Válidos

```typescript
function validateChordFrets(chord: Chord): boolean {
	if (chord.firstFret !== undefined && chord.firstFret <= 0) {
		return false;
	}
	if (chord.lastFret !== undefined && chord.lastFret <= 0) {
		return false;
	}
	if (chord.firstFret !== undefined && chord.lastFret !== undefined) {
		return chord.firstFret < chord.lastFret;
	}
	return true;
}
```

## 3. Validação de Instrument

### Regra: Dimensões Válidas

```typescript
function validateInstrumentDimensions(instrument: Instrument): boolean {
	return (
		instrument.strings > 0 &&
		instrument.frets > 0 &&
		Number.isInteger(instrument.strings) &&
		Number.isInteger(instrument.frets)
	);
}
```

### Regra: Afinação Válida

```typescript
function validateTuning(instrument: Instrument): boolean {
	return (
		Array.isArray(instrument.tuning) &&
		instrument.tuning.length === instrument.strings &&
		instrument.tuning.every(note => isScientificNotation(note)) // Usar tonal.Note.isScientificNotation(note)
	);
}
```

### Regra: String de Tablatura Válida

```typescript
function countStringsInFretNotation(fretNotation: string): number {
	let count = 0;
	let i = 0;
	while (i < fretNotation.length) {
		if (fretNotation[i] === "(") {
			const endIndex = fretNotation.indexOf(")", i);
			if (endIndex === -1) return -1; // inválido
			i = endIndex + 1;
		} else {
			i++;
		}
		count++;
	}
	return count;
}

function validateFretNotation(instrument: Instrument): boolean {
	const validCharsRegex = /^[0-9xo()]+$/;
	if (typeof instrument.chord !== "string" || !validCharsRegex.test(instrument.chord)) {
		return false;
	}

	const stringCount = countStringsInFretNotation(instrument.chord);
	return stringCount === instrument.strings;
}
```

## 4. Validação de Finger

### Regra: Fret Válido

```typescript
function validateFingerFret(finger: Finger): boolean {
	return typeof finger.fret === "number" && finger.fret >= 0 && Number.isInteger(finger.fret);
}
```

### Regra: String Válida

```typescript
function validateFingerString(finger: Finger, stringCount: number): boolean {
	return (
		typeof finger.string === "number" &&
		finger.string >= 1 &&
		finger.string <= stringCount &&
		Number.isInteger(finger.string)
	);
}
```

### Regra: is_muted Válido

```typescript
function validateFingerMuted(finger: Finger): boolean {
	return typeof finger.is_muted === "boolean";
}
```

### Regra: Texto Opcional

```typescript
function validateFingerText(finger: Finger): boolean {
	return finger.text === undefined || (typeof finger.text === "string" && finger.text.length > 0);
}
```

## 5. Validação de Barre

### Regra: Fret Válido

```typescript
function validateBarreFret(barre: Barre): boolean {
	return typeof barre.fret === "number" && barre.fret > 0 && Number.isInteger(barre.fret);
}
```

### Regra: Strings Válidas

```typescript
function validateBarreStrings(barre: Barre, stringCount: number): boolean {
	return (
		typeof barre.fromString === "number" &&
		typeof barre.toString === "number" &&
		barre.fromString >= 1 &&
		barre.toString <= stringCount &&
		barre.fromString <= barre.toString &&
		Number.isInteger(barre.fromString) &&
		Number.isInteger(barre.toString)
	);
}
```

## 6. Validação de ChordStyle

### Regra: Dimensões Positivas

```typescript
function validateStyleDimensions(style: ChordStyle): boolean {
	const dimensions = [
		style.width,
		style.height,
		style.fretCount,
		style.stringCount,
		style.fretWidth,
		style.fretHeight,
		style.stringWidth,
		style.dotSize,
		style.barreHeight,
	];

	return dimensions.every(dim => typeof dim === "number" && dim > 0 && Number.isFinite(dim));
}
```

### Regra: Cores Válidas

```typescript
function validateStyleColors(style: ChordStyle): boolean {
	const colors = [
		style.backgroundColor,
		style.fretColor,
		style.stringColor,
		style.dotColor,
		style.dotTextColor,
		style.barreColor,
		style.fretTextColor,
		style.tuningTextColor,
		style.openStringColor,
		style.mutedStringColor,
	];

	return colors.every(color => typeof color === "string" && color.length > 0);
}
```

### Regra: Fontes Válidas

```typescript
function validateStyleFonts(style: ChordStyle): boolean {
	const fonts = [style.fontFamily, style.dotTextSize, style.fretTextSize, style.tuningTextSize];

	return (
		typeof style.fontFamily === "string" &&
		style.fontFamily.length > 0 &&
		typeof style.dotTextSize === "number" &&
		style.dotTextSize > 0 &&
		typeof style.fretTextSize === "number" &&
		style.fretTextSize > 0 &&
		typeof style.tuningTextSize === "number" &&
		style.tuningTextSize > 0
	);
}
```

### Regra: Layout Válido

```typescript
function validateStyleLayout(style: ChordStyle): boolean {
	const isValidOrientation =
		style.orientation === undefined ||
		style.orientation === "vertical" ||
		style.orientation === "horizontal";
	const isValidHandedness =
		style.handedness === undefined || style.handedness === "right" || style.handedness === "left";
	return isValidOrientation && isValidHandedness;
}
```

## 7. Validação de Casos Limite

### Regra: Dedos Sobrepostos

```typescript
function validateNoOverlappingFingers(fingers: Finger[]): Finger[] {
	const positions = new Map<string, Finger>();
	const validFingers: Finger[] = [];

	for (const finger of fingers) {
		const key = `${finger.string}-${finger.fret}`;
		if (!positions.has(key)) {
			positions.set(key, finger);
			validFingers.push(finger);
		}
		// Ignorar dedos sobrepostos (primeiro tem precedência)
	}

	return validFingers;
}
```

### Regra: Pestanas vs Dedos

```typescript
function validateBarreVsFingers(fingers: Finger[], barres: Barre[]): { fingers: Finger[]; barres: Barre[] } {
	let validFingers = [...fingers];

	for (const barre of barres) {
		// Remove os dedos que estão "debaixo" da pestana.
		// Um dedo está sob a pestana se estiver na mesma casa e
		// entre as cordas de início e fim da pestana (inclusive).
		validFingers = validFingers.filter(
			finger =>
				finger.fret !== barre.fret ||
				finger.string < barre.fromString ||
				finger.string > barre.toString
		);
	}

	return { fingers: validFingers, barres };
}
```

## 8. Funções de Validação Principais

### Validação Completa de Finger

```typescript
function validateFinger(finger: Finger, stringCount: number = 6): boolean {
	return (
		validateFingerFret(finger) &&
		validateFingerString(finger, stringCount) &&
		validateFingerMuted(finger) &&
		validateFingerText(finger)
	);
}
```

### Validação Completa de Barre

```typescript
function validateBarre(barre: Barre, stringCount: number = 6): boolean {
	return validateBarreFret(barre) && validateBarreStrings(barre, stringCount);
}
```

### Validação Completa de Chord

```typescript
function validateChord(chord: Chord, stringCount: number = 6): boolean {
	return (
		Array.isArray(chord.fingers) &&
		Array.isArray(chord.barres) &&
		chord.fingers.every(finger => validateFinger(finger, stringCount)) &&
		chord.barres.every(barre => validateBarre(barre, stringCount)) &&
		validateChordFrets(chord)
	);
}
```

### Validação Completa de Instrument

```typescript
function validateInstrument(instrument: Instrument): boolean {
	return (
		validateInstrumentDimensions(instrument) &&
		validateTuning(instrument) &&
		validateFretNotation(instrument)
	);
}
```

## 9. Códigos de Erro

```typescript
const VALIDATION_ERROR_CODES = {
	MISSING_INPUT: "MISSING_INPUT",
	INVALID_FRET: "INVALID_FRET",
	INVALID_STRING: "INVALID_STRING",
	INVALID_TUNING: "INVALID_TUNING",
	INVALID_NOTE: "INVALID_NOTE",
	INVALID_TAB_STRING: "INVALID_TAB_STRING",
	INVALID_BARRE: "INVALID_BARRE",
	INVALID_STYLE_DIMENSIONS: "INVALID_STYLE_DIMENSIONS",
	INVALID_STYLE_COLORS: "INVALID_STYLE_COLORS",
	INVALID_STYLE_FONTS: "INVALID_STYLE_FONTS",
	INVALID_STYLE_LAYOUT: "INVALID_STYLE_LAYOUT",
	OVERLAPPING_FINGERS: "OVERLAPPING_FINGERS",
	INVALID_FRET_RANGE: "INVALID_FRET_RANGE",
	INVALID_VIEW: "INVALID_VIEW",
} as const;
```
