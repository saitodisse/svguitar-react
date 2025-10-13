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
	width: 192,
	height: 261,
	fretCount: 5,
	stringCount: 6,
	fretWidth: 23,
	fretHeight: 39,
	stringWidth: 1,
	dotSize: 18,
	barreHeight: 11,

	// Colors
	backgroundColor: "#ffffff",
	fretColor: "#363434",
	stringColor: "#666666",
	dotColor: "#2196F3",
	dotTextColor: "#ffffff",
	barreColor: "#2196F3",
	fretTextColor: "#d1d0d0",
	tuningTextColor: "#cecbcb",
	openStringColor: "#2196F3", // Same color as normal finger dots
	mutedStringColor: "#DC143C", // Red for muted strings

	// Fonts
	fontFamily: "sans-serif",
	dotTextSize: 15,
	fretTextSize: 17,
	tuningTextSize: 17,

	// TuningLabels customization
	tuningLabelOffsetX: 0.04, // Horizontal multiplier (-5 to 5) - controls distance from nut in horizontal layouts, perpendicular adjustment in vertical
	tuningLabelOffsetY: 0.15, // Vertical multiplier (-5 to 5) - controls distance from nut in vertical layouts, perpendicular adjustment in horizontal
	tuningLabelFormat: "note-only" as "scientific" | "note-only", // Format for tuning labels

	// String indicators customization
	stringIndicatorOffsetX: 0.35, // Horizontal multiplier (-5 to 5) for open/muted string indicators positioning
	stringIndicatorOffsetY: 0, // Vertical multiplier (-5 to 5) for open/muted string indicators positioning

	// Barres customization
	barresWidth: 11, // Width/thickness of barre rectangles in pixels (width in horizontal views, height in vertical views)
	barresOpacity: 1.0, // Opacity of barre rectangles from 0 to 1
	barresOffsetX: 0.12, // Horizontal offset multiplier (-5 to 5) for barre positioning
	barresOffsetY: 0.33, // Vertical offset multiplier (-5 to 5) for barre positioning

	// Fret numbers customization
	fretTextOffsetX: -6.32, // Horizontal offset multiplier (-5 to 5) for fret number positioning
	fretTextOffsetY: 0.16, // Vertical offset multiplier (-5 to 5) for fret number positioning

	// Nut (fret zero) customization
	nutStrokeWidth: 0.106, // Stroke width multiplier (-5 to 5) - 0.106 * 23 (default fretWidth) ≈ 2.4px
	nutOffsetX: 0, // Horizontal offset multiplier (-5 to 5) for nut positioning
	nutOffsetY: 0, // Vertical offset multiplier (-5 to 5) for nut positioning
	nutOpacity: 1.0, // Opacity from 0 to 1
	nutColor: "#333333", // Same as default fretColor

	// Canvas positioning (global diagram offset)
	canvasOffsetX: -15, // Horizontal offset in pixels for entire diagram
	canvasOffsetY: -24, // Vertical offset in pixels for entire diagram
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
