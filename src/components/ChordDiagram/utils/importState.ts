/**
 * @fileoverview Import ChordDiagram state from JSON
 * @author svguitar-react
 * @version 1.0.0
 */

import type { ChordDiagramProps, ChordDiagramState } from "../types";

/**
 * Validation result for state import
 */
export interface ValidationResult {
	valid: boolean;
	errors: string[];
	warnings: string[];
}

/**
 * Validates ChordDiagram state JSON
 * @param json - Unknown JSON data to validate
 * @returns Validation result
 */
export function validateChordDiagramState(json: unknown): ValidationResult {
	const errors: string[] = [];
	const warnings: string[] = [];

	// Check if it's an object
	if (!json || typeof json !== "object") {
		errors.push("State must be a valid object");
		return { valid: false, errors, warnings };
	}

	const state = json as Partial<ChordDiagramState>;

	// Check version
	if (state._version !== "1.0.0") {
		warnings.push(`State version mismatch: expected 1.0.0, got ${state._version}`);
	}

	// Validate required fields
	const requiredFields = ["view", "width", "height", "fretCount", "stringCount", "fretWidth", "fretHeight"];

	for (const field of requiredFields) {
		if (!(field in state)) {
			errors.push(`Missing required field: ${field}`);
		}
	}

	// Validate view
	if (
		state.view &&
		!["horizontal-right", "horizontal-left", "vertical-right", "vertical-left"].includes(state.view)
	) {
		errors.push(`Invalid view: ${state.view}`);
	}

	// Validate numeric fields
	const numericFields = [
		"width",
		"height",
		"fretCount",
		"stringCount",
		"fretWidth",
		"fretHeight",
		"stringWidth",
		"dotSize",
		"barreHeight",
		"dotTextSize",
		"fretTextSize",
		"tuningTextSize",
	];

	for (const field of numericFields) {
		const value = state[field as keyof ChordDiagramState];
		if (value !== undefined && (typeof value !== "number" || value < 0)) {
			errors.push(`Field ${field} must be a positive number`);
		}
	}

	// Validate chord object if present
	if (state.chord) {
		if (typeof state.chord !== "object") {
			errors.push("chord must be an object");
		} else {
			// Validate fingers array
			if (state.chord.fingers && !Array.isArray(state.chord.fingers)) {
				errors.push("chord.fingers must be an array");
			} else if (state.chord.fingers) {
				state.chord.fingers.forEach((finger, index) => {
					if (typeof finger.fret !== "number" || finger.fret < 0) {
						errors.push(`chord.fingers[${index}].fret must be a non-negative number`);
					}
					if (typeof finger.string !== "number" || finger.string < 1) {
						errors.push(`chord.fingers[${index}].string must be a positive number`);
					}
					if (typeof finger.is_muted !== "boolean") {
						errors.push(`chord.fingers[${index}].is_muted must be a boolean`);
					}
				});
			}

			// Validate barres array
			if (state.chord.barres && !Array.isArray(state.chord.barres)) {
				errors.push("chord.barres must be an array");
			} else if (state.chord.barres) {
				state.chord.barres.forEach((barre, index) => {
					if (typeof barre.fret !== "number" || barre.fret < 1) {
						errors.push(`chord.barres[${index}].fret must be a positive number`);
					}
					if (typeof barre.fromString !== "number" || barre.fromString < 1) {
						errors.push(`chord.barres[${index}].fromString must be a positive number`);
					}
					if (typeof barre.toString !== "number" || barre.toString < 1) {
						errors.push(`chord.barres[${index}].toString must be a positive number`);
					}
					if (barre.fromString >= barre.toString) {
						errors.push(`chord.barres[${index}].fromString must be less than toString`);
					}
				});
			}
		}
	}

	// Validate instrument object if present
	if (state.instrument) {
		if (typeof state.instrument !== "object") {
			errors.push("instrument must be an object");
		} else {
			if (typeof state.instrument.strings !== "number" || state.instrument.strings < 1) {
				errors.push("instrument.strings must be a positive number");
			}
			if (typeof state.instrument.frets !== "number" || state.instrument.frets < 1) {
				errors.push("instrument.frets must be a positive number");
			}
			if (!Array.isArray(state.instrument.tuning)) {
				errors.push("instrument.tuning must be an array");
			} else {
				state.instrument.tuning.forEach((note, index) => {
					if (typeof note !== "string" || !note.match(/^[A-G][#b]?\d$/)) {
						warnings.push(
							`instrument.tuning[${index}] should be in scientific notation (e.g., "E2")`
						);
					}
				});
			}
			if (typeof state.instrument.chord !== "string") {
				errors.push("instrument.chord must be a string");
			}
		}
	}

	return {
		valid: errors.length === 0,
		errors,
		warnings,
	};
}

/**
 * Imports ChordDiagram state and converts to component props
 * @param state - State to import
 * @returns Component props
 * @throws Error if validation fails
 */
export function importChordDiagramState(state: ChordDiagramState): ChordDiagramProps {
	const validation = validateChordDiagramState(state);

	if (!validation.valid) {
		throw new Error(`Invalid state: ${validation.errors.join(", ")}`);
	}

	if (validation.warnings.length > 0) {
		console.warn("⚠️ State import warnings:", validation.warnings);
	}

	// Convert state to props
	const props: ChordDiagramProps = {
		// Chord data
		chord: state.chord,
		instrument: state.instrument,

		// Layout
		view: state.view,

		// Dimensions
		width: state.width,
		height: state.height,
		fretCount: state.fretCount,
		stringCount: state.stringCount,
		fretWidth: state.fretWidth,
		fretHeight: state.fretHeight,
		stringWidth: state.stringWidth,
		dotSize: state.dotSize,
		barreHeight: state.barreHeight,

		// Colors
		backgroundColor: state.backgroundColor,
		fretColor: state.fretColor,
		stringColor: state.stringColor,
		dotColor: state.dotColor,
		dotTextColor: state.dotTextColor,
		barreColor: state.barreColor,
		fretTextColor: state.fretTextColor,
		tuningTextColor: state.tuningTextColor,
		openStringColor: state.openStringColor,
		mutedStringColor: state.mutedStringColor,

		// Fonts
		fontFamily: state.fontFamily,
		dotTextSize: state.dotTextSize,
		fretTextSize: state.fretTextSize,
		tuningTextSize: state.tuningTextSize,

		// Tuning customization
		tuningLabelOffsetX: state.tuningLabelOffsetX,
		tuningLabelOffsetY: state.tuningLabelOffsetY,
		tuningLabelFormat: state.tuningLabelFormat,

		// String indicators customization
		stringIndicatorOffsetX: state.stringIndicatorOffsetX,
		stringIndicatorOffsetY: state.stringIndicatorOffsetY,

		// Barres customization
		barresWidth: state.barresWidth,
		barresOpacity: state.barresOpacity,
		barresOffsetX: state.barresOffsetX,
		barresOffsetY: state.barresOffsetY,

		// Fret numbers customization
		fretTextOffsetX: state.fretTextOffsetX,
		fretTextOffsetY: state.fretTextOffsetY,

		// Nut customization
		nutStrokeWidth: state.nutStrokeWidth,
		nutOffsetX: state.nutOffsetX,
		nutOffsetY: state.nutOffsetY,
		nutOpacity: state.nutOpacity,
		nutColor: state.nutColor,

		// Canvas positioning
		canvasOffsetX: state.canvasOffsetX,
		canvasOffsetY: state.canvasOffsetY,
	};

	console.log("✅ ChordDiagram state imported successfully");
	return props;
}
