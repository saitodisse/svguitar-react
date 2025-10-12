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

	// Validate fingers array if present
	if (state.fingers && !Array.isArray(state.fingers)) {
		errors.push("fingers must be an array");
	} else if (state.fingers) {
		state.fingers.forEach((finger: any, index: number) => {
			if (typeof finger.fret !== "number" || finger.fret < 0) {
				errors.push(`fingers[${index}].fret must be a non-negative number`);
			}
			if (typeof finger.string !== "number" || finger.string < 1) {
				errors.push(`fingers[${index}].string must be a positive number`);
			}
			if (typeof finger.is_muted !== "boolean") {
				errors.push(`fingers[${index}].is_muted must be a boolean`);
			}
		});
	}

	// Validate barres array if present
	if (state.barres && !Array.isArray(state.barres)) {
		errors.push("barres must be an array");
	} else if (state.barres) {
		state.barres.forEach((barre: any, index: number) => {
			if (typeof barre.fret !== "number" || barre.fret < 1) {
				errors.push(`barres[${index}].fret must be a positive number`);
			}
			if (typeof barre.fromString !== "number" || barre.fromString < 1) {
				errors.push(`barres[${index}].fromString must be a positive number`);
			}
			if (typeof barre.toString !== "number" || barre.toString < 1) {
				errors.push(`barres[${index}].toString must be a positive number`);
			}
			if (barre.fromString >= barre.toString) {
				errors.push(`barres[${index}].fromString must be less than toString`);
			}
		});
	}

	// Validate instrument configuration
	if (typeof state.strings !== "number" || state.strings < 1) {
		errors.push("strings must be a positive number");
	}
	if (typeof state.frets !== "number" || state.frets < 1) {
		errors.push("frets must be a positive number");
	}
	if (!Array.isArray(state.tuning)) {
		errors.push("tuning must be an array");
	} else {
		state.tuning.forEach((note: any, index: number) => {
			if (typeof note !== "string" || !note.match(/^[A-G][#b]?\d$/)) {
				warnings.push(`tuning[${index}] should be in scientific notation (e.g., "E2")`);
			}
		});
	}
	if (state.fretNotation && typeof state.fretNotation !== "string") {
		errors.push("fretNotation must be a string");
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
		// Instrument configuration (inline)
		strings: state.strings,
		frets: state.frets,
		tuning: state.tuning,
		fretNotation: state.fretNotation,

		// Chord data (inline)
		fingers: state.fingers,
		barres: state.barres,
		firstFret: state.firstFret,
		lastFret: state.lastFret,

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
