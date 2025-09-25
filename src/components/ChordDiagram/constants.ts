/**
 * @fileoverview Default constants for the ChordDiagram component
 * @author svguitar-react
 * @version 1.0.0
 */

import type { ChordStyle, Instrument } from "./types";

/**
 * Default styling configuration for chord diagrams
 */
export const DEFAULT_CHORD_STYLE: ChordStyle = {
	// Layout
	orientation: "horizontal",
	handedness: "right",

	// Dimensions
	width: 200,
	height: 250,
	fretCount: 4,
	stringCount: 6,
	fretWidth: 40,
	fretHeight: 30,
	stringWidth: 2,
	dotSize: 12,
	barreHeight: 8,
	openStringSize: 12,
	mutedStringSize: 12,

	// Colors
	backgroundColor: "#ffffff",
	fretColor: "#333333",
	stringColor: "#666666",
	dotColor: "#2196F3",
	dotTextColor: "#ffffff",
	barreColor: "#2196F3",
	fretTextColor: "#333333",
	tuningTextColor: "#666666",
	openStringColor: "#2196F3", // Same color as normal finger dots
	mutedStringColor: "#DC143C", // Red for muted strings

	// Fonts
	fontFamily: "Arial, sans-serif",
	dotTextSize: 10,
	fretTextSize: 12,
	tuningTextSize: 14,
};

/**
 * Default instrument configuration for standard guitar
 */
export const DEFAULT_INSTRUMENT: Instrument = {
	strings: 6,
	frets: 4,
	tuning: ["E2", "A2", "D3", "G3", "B3", "E4"],
	chord: "000000",
};

/**
 * Standard guitar tunings in scientific notation
 */
export const STANDARD_TUNINGS = {
	STANDARD: ["E2", "A2", "D3", "G3", "B3", "E4"],
	DROP_D: ["D2", "A2", "D3", "G3", "B3", "E4"],
	DROP_C: ["C2", "G2", "C3", "F3", "A3", "D4"],
	OPEN_G: ["D2", "G2", "D3", "G3", "B3", "D4"],
	OPEN_D: ["D2", "A2", "D3", "F#3", "A3", "D4"],
} as const;

/**
 * Valid characters for fret notation
 */
export const VALID_FRET_CHARS = /^[0-9xo()]+$/;

/**
 * Maximum number of frets to display
 */
export const MAX_FRETS = 24;

/**
 * Maximum number of strings
 */
export const MAX_STRINGS = 12;
