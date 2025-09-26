/**
 * @fileoverview Utility functions for the ChordDiagram component
 * @author svguitar-react
 * @version 1.0.0
 */

import type { Chord, Finger, Barre, Instrument, ChordStyle } from "./types";
import { ChordDiagramError, ERROR_CODES } from "./types";
import { DEFAULT_CHORD_STYLE, DEFAULT_INSTRUMENT, VALID_FRET_CHARS } from "./constants";

/**
 * Parses a fret notation string into a Chord object
 * @param fretNotation - The fret notation string (e.g., "x32010" or "(10)(12)(10)(10)(10)(10)")
 * @returns Parsed Chord object with fingers and barres
 * @throws {ChordDiagramError} If the fret notation is invalid
 */
export function parseFretNotation(fretNotation: string): Chord {
	if (!VALID_FRET_CHARS.test(fretNotation)) {
		throw new ChordDiagramError(
			`Invalid fret notation: "${fretNotation}". Only digits, 'x', 'o', '(', and ')' are allowed.`,
			ERROR_CODES.INVALID_TAB_STRING
		);
	}

	const fingers: Finger[] = [];
	const barres: Barre[] = [];
	let stringNumber = 1;
	let i = 0;

	while (i < fretNotation.length && stringNumber <= 6) {
		let fret: number | "x" | "o" | null = null;
		const char = fretNotation[i];

		if (char === "x") {
			fret = "x";
			i++;
		} else if (char === "o") {
			fret = "o";
			i++;
		} else if (char === "(") {
			const endIndex = fretNotation.indexOf(")", i);
			if (endIndex === -1) {
				throw new ChordDiagramError(
					`Invalid fret notation: unmatched opening parenthesis at position ${i}`,
					ERROR_CODES.INVALID_TAB_STRING
				);
			}
			const fretStr = fretNotation.substring(i + 1, endIndex);
			const fretNum = parseInt(fretStr, 10);
			if (isNaN(fretNum) || fretNum <= 0) {
				throw new ChordDiagramError(`Invalid fret number: "${fretStr}"`, ERROR_CODES.INVALID_FRET);
			}
			fret = fretNum;
			i = endIndex + 1;
		} else if (char >= "0" && char <= "9") {
			fret = parseInt(char, 10);
			i++;
		} else {
			// Skip invalid characters and move to next string
			i++;
			stringNumber++;
			continue;
		}

		if (typeof fret === "number" && fret >= 0) {
			fingers.push({
				fret,
				string: stringNumber,
				is_muted: false,
			});
		} else if (fret === "o") {
			fingers.push({
				fret: 0,
				string: stringNumber,
				is_muted: false,
			});
		} else if (fret === "x") {
			fingers.push({
				fret: 0,
				string: stringNumber,
				is_muted: true,
			});
		}

		stringNumber++;
	}

	return { fingers, barres };
}

/**
 * Validates a Finger object
 * @param finger - The finger to validate
 * @param stringCount - Total number of strings
 * @returns True if valid, throws error if invalid
 * @throws {ChordDiagramError} If the finger is invalid
 */
export function validateFinger(finger: Finger, stringCount: number): boolean {
	if (finger.fret < 0) {
		throw new ChordDiagramError(
			`Invalid fret: ${finger.fret}. Fret must be greater than or equal to 0.`,
			ERROR_CODES.INVALID_FRET
		);
	}

	if (finger.string < 1 || finger.string > stringCount) {
		throw new ChordDiagramError(
			`Invalid string: ${finger.string}. String must be between 1 and ${stringCount}.`,
			ERROR_CODES.INVALID_STRING
		);
	}

	if (typeof finger.is_muted !== "boolean") {
		throw new ChordDiagramError(
			`Invalid is_muted: ${finger.is_muted}. is_muted must be a boolean.`,
			ERROR_CODES.INVALID_STRING
		);
	}

	return true;
}

/**
 * Validates a Barre object
 * @param barre - The barre to validate
 * @param stringCount - Total number of strings
 * @returns True if valid, throws error if invalid
 * @throws {ChordDiagramError} If the barre is invalid
 */
export function validateBarre(barre: Barre, stringCount: number): boolean {
	if (barre.fret <= 0) {
		throw new ChordDiagramError(
			`Invalid fret: ${barre.fret}. Fret must be greater than 0.`,
			ERROR_CODES.INVALID_FRET
		);
	}

	if (barre.fromString < 1 || barre.fromString > stringCount) {
		throw new ChordDiagramError(
			`Invalid fromString: ${barre.fromString}. String must be between 1 and ${stringCount}.`,
			ERROR_CODES.INVALID_STRING
		);
	}

	if (barre.toString < 1 || barre.toString > stringCount) {
		throw new ChordDiagramError(
			`Invalid toString: ${barre.toString}. String must be between 1 and ${stringCount}.`,
			ERROR_CODES.INVALID_STRING
		);
	}

	if (barre.fromString > barre.toString) {
		throw new ChordDiagramError(
			`Invalid barre: fromString (${barre.fromString}) must be less than or equal to toString (${barre.toString}).`,
			ERROR_CODES.INVALID_BARRE
		);
	}

	return true;
}

/**
 * Counts the number of string positions in a fret notation string
 * @param fretNotation - The fret notation string
 * @returns Number of string positions
 */
function countStringPositions(fretNotation: string): number {
	let stringCount = 0;
	let i = 0;

	while (i < fretNotation.length) {
		const char = fretNotation[i];

		if (char === "x" || char === "o") {
			stringCount++;
			i++;
		} else if (char === "(") {
			const endIndex = fretNotation.indexOf(")", i);
			if (endIndex !== -1) {
				stringCount++;
				i = endIndex + 1;
			} else {
				// Invalid notation, but we'll let parseFretNotation handle the error
				i++;
			}
		} else if (char >= "0" && char <= "9") {
			stringCount++;
			i++;
		} else {
			// Skip invalid characters
			i++;
		}
	}

	return stringCount;
}

/**
 * Validates an Instrument object
 * @param instrument - The instrument to validate
 * @returns True if valid, throws error if invalid
 * @throws {ChordDiagramError} If the instrument is invalid
 */
export function validateInstrument(instrument: Instrument): boolean {
	if (instrument.strings <= 0) {
		throw new ChordDiagramError(
			`Invalid strings count: ${instrument.strings}. Must be greater than 0.`,
			ERROR_CODES.INVALID_STRING
		);
	}

	if (instrument.frets <= 0) {
		throw new ChordDiagramError(
			`Invalid frets count: ${instrument.frets}. Must be greater than 0.`,
			ERROR_CODES.INVALID_FRET
		);
	}

	if (instrument.tuning.length !== instrument.strings) {
		throw new ChordDiagramError(
			`Invalid tuning: length (${instrument.tuning.length}) must match strings count (${instrument.strings}).`,
			ERROR_CODES.INVALID_TUNING
		);
	}

	const stringPositions = countStringPositions(instrument.chord);
	if (stringPositions !== instrument.strings) {
		throw new ChordDiagramError(
			`Invalid chord notation: string positions (${stringPositions}) must match strings count (${instrument.strings}).`,
			ERROR_CODES.INVALID_TAB_STRING
		);
	}

	return true;
}

/**
 * Merges custom style with default style
 * @param customStyle - Custom style properties
 * @returns Merged style object
 */
export function mergeStyles(customStyle?: Partial<ChordStyle>): ChordStyle {
	return {
		...DEFAULT_CHORD_STYLE,
		...customStyle,
	};
}

/**
 * Merges instrument configuration with defaults
 * @param customInstrument - Custom instrument properties
 * @returns Merged instrument object
 */
export function mergeInstrument(customInstrument?: Partial<Instrument>): Instrument {
	return {
		...DEFAULT_INSTRUMENT,
		...customInstrument,
	};
}

/**
 * Calculates the starting X position for the fretboard
 * @param style - Style configuration
 * @returns Starting X position
 */
export function getStartX(style: { fretWidth: number; tuningTextSize: number }): number {
	// Calculate space needed for tuning labels based on text size
	// Add some padding to ensure labels don't overlap with fretboard
	return Math.max(50, style.tuningTextSize * 2.5);
}

/**
 * Calculates the starting Y position for the fretboard
 * @param style - Style configuration
 * @returns Starting Y position
 */
export function getStartY(style: { fretTextSize: number }): number {
	// Calculate space needed for fret numbers based on text size
	// Add some padding to ensure numbers don't overlap with fretboard
	return Math.max(50, style.fretTextSize * 3);
}

/**
 * Calculates the X position for a finger dot, ensuring it's centered in the fret space
 * @param finger - Finger object
 * @param firstFret - First fret to display
 * @param fretWidth - Width of each fret space
 * @param startX - Starting X position of the fretboard
 * @returns X position for the finger dot
 */
export function getFingerX(
	finger: { fret: number },
	firstFret: number,
	fretWidth: number,
	startX: number
): number {
	return startX + (finger.fret - firstFret + 0.5) * fretWidth;
}

/**
 * Calculates the Y position for a finger dot
 * @param finger - Finger object
 * @param stringCount - Total number of strings
 * @param fretHeight - Height of each fret space
 * @param startY - Starting Y position of the fretboard
 * @returns Y position for the finger dot
 */
export function getFingerY(
	finger: { string: number },
	stringCount: number,
	fretHeight: number,
	startY: number
): number {
	return startY + (stringCount - finger.string) * fretHeight;
}

/**
 * Validates and processes chord data from props
 * @param props - Component props
 * @returns Processed chord data
 * @throws {ChordDiagramError} If validation fails
 */
export function processChordData(props: { instrument?: Partial<Instrument>; chord?: Chord }): Chord {
	// Check if at least one data source is provided
	if (!props.instrument && !props.chord) {
		throw new ChordDiagramError(
			"Either 'instrument' or 'chord' prop must be provided.",
			ERROR_CODES.MISSING_CHORD_DATA
		);
	}

	// If chord is provided, use it directly (chord takes precedence)
	if (props.chord) {
		// Calculate stringCount by considering both fingers and barres
		let stringCount = 6; // Default to 6 strings

		if (props.chord.fingers.length > 0) {
			const maxFingerString = Math.max(...props.chord.fingers.map(f => f.string));
			stringCount = Math.max(stringCount, maxFingerString);
		}

		if (props.chord.barres.length > 0) {
			const maxBarreString = Math.max(
				...props.chord.barres.map(b => Math.max(b.fromString, b.toString))
			);
			stringCount = Math.max(stringCount, maxBarreString);
		}

		// Validate fingers
		props.chord.fingers.forEach(finger => validateFinger(finger, stringCount));

		// Validate barres
		props.chord.barres.forEach(barre => validateBarre(barre, stringCount));

		return props.chord;
	}

	// If only instrument is provided, parse the fret notation
	if (props.instrument) {
		const instrument = mergeInstrument(props.instrument);
		validateInstrument(instrument);

		const chord = parseFretNotation(instrument.chord);
		return chord;
	}

	// This should never be reached due to the check above
	throw new ChordDiagramError("No valid chord data provided.", ERROR_CODES.MISSING_CHORD_DATA);
}
