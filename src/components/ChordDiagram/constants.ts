/**
 * @fileoverview Default constants for the ChordDiagram component
 * @author svguitar-react
 * @version 1.0.0
 */

import type { Instrument, ViewId } from "./types";

/**
 * Default styling configuration for chord diagrams
 */
export const DEFAULT_CHORD_STYLE = {
	// Dimensions
	width: 220,
	height: 250,
	fretCount: 4,
	stringCount: 6,
	fretWidth: 40,
	fretHeight: 30,
	stringWidth: 2,
	dotSize: 12,
	barreHeight: 8,

	// Colors
	backgroundColor: "#ffffff",
	fretColor: "#333333",
	stringColor: "#666666",
	dotColor: "#2196F3",
	dotTextColor: "#ffffff",
	barreColor: "#2196F3",
	fretTextColor: "#868686",
	tuningTextColor: "#666666",
	openStringColor: "#2196F3", // Same color as normal finger dots
	mutedStringColor: "#DC143C", // Red for muted strings

	// Fonts
	fontFamily: "Arial, sans-serif",
	dotTextSize: 11,
	fretTextSize: 20,
	tuningTextSize: 17,

	// TuningLabels customization
	tuningLabelOffsetX: 0.5, // Horizontal multiplier (-5 to 5) - controls distance from nut in horizontal layouts, perpendicular adjustment in vertical
	tuningLabelOffsetY: 0.5, // Vertical multiplier (-5 to 5) - controls distance from nut in vertical layouts, perpendicular adjustment in horizontal
	tuningLabelFormat: "scientific" as "scientific" | "note-only", // Format for tuning labels

	// String indicators customization
	stringIndicatorOffsetX: 0.5, // Horizontal multiplier (-5 to 5) for open/muted string indicators positioning
	stringIndicatorOffsetY: 0, // Vertical multiplier (-5 to 5) for open/muted string indicators positioning

	// Barres customization
	barresWidth: 8, // Width of barre rectangles in pixels
	barresOpacity: 1.0, // Opacity of barre rectangles from 0 to 1
	barresOffsetX: 0, // Horizontal offset multiplier (-5 to 5) for barre positioning
	barresOffsetY: 0, // Vertical offset multiplier (-5 to 5) for barre positioning

	// Fret numbers customization
	fretTextOffsetX: 0, // Horizontal offset multiplier (-5 to 5) for fret number positioning
	fretTextOffsetY: 0, // Vertical offset multiplier (-5 to 5) for fret number positioning
};

/**
 * Default view for layout
 */
export const DEFAULT_VIEW: ViewId = "horizontal-right";

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
