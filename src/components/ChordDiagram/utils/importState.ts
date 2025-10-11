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
