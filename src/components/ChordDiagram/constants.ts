/**
 * @fileoverview Default constants for the ChordDiagram component
 * @author svguitar-react
 * @version 1.0.0
 */

import type { Instrument, ViewId } from "./types";

/**
 * Base styling configuration for chord diagrams.
 * Contains universal properties shared across all views (colors, fonts, opacities).
 *
 * @description This is the foundation for all view-specific styles.
 * Do not use directly - prefer view-specific constants like VERTICAL_RIGHT_STYLE.
 */
export const BASE_CHORD_STYLE = {
	// Colors
	backgroundColor: "#ffffff",
	fretColor: "#333333",
	stringColor: "#666666",
	dotColor: "#2196F3",
	dotTextColor: "#ffffff",
	barreColor: "#2196F3",
	fretTextColor: "#d1d0d0",
	tuningTextColor: "#cecbcb",
	openStringColor: "#2196F3",
	mutedStringColor: "#DC143C",

	// Fonts
	fontFamily: "sans-serif",
	dotTextSize: 15,
	fretTextSize: 17,
	tuningTextSize: 17,

	// Structural (shared across all views)
	fretCount: 5,
	stringCount: 6,
	stringWidth: 1,
	dotSize: 18,

	// Opacities
	barresOpacity: 1.0,
	nutOpacity: 1.0,

	// Tuning label format
	tuningLabelFormat: "note-only" as "scientific" | "note-only",

	// Nut stroke width multiplier
	nutStrokeWidth: 0.075,
	nutOffsetX: 0,
	nutOffsetY: 0,
	nutColor: "#333333",
};

/**
 * Base styling for horizontal views (horizontal-right and horizontal-left).
 *
 * @description Extends BASE_CHORD_STYLE with dimensions, canvas offsets, and positioning
 * specific to horizontal layouts. Extracted from WithBarreHorizontalRight story.
 *
 * **Shared properties between horizontal-right and horizontal-left:**
 * - Dimensions: width, height, fretWidth, fretHeight
 * - Canvas offsets: canvasOffsetX, canvasOffsetY
 * - Structural sizing: barreHeight, barresWidth
 *
 * **When to use:** As a base for creating horizontal view variations.
 */
export const HORIZONTAL_BASE = {
	...BASE_CHORD_STYLE,

	// Dimensions
	width: 283,
	height: 214,
	fretWidth: 47,
	fretHeight: 30,

	// Canvas positioning
	canvasOffsetX: -23,
	canvasOffsetY: -26,

	// Barres
	barreHeight: 19,
	barresWidth: 12,
	barresOffsetX: 0.37,
	barresOffsetY: -0.14,

	// Tuning labels
	tuningLabelOffsetX: 0.28,
	tuningLabelOffsetY: -0.08,

	// String indicators
	stringIndicatorOffsetX: 0.5,
	stringIndicatorOffsetY: -0.05,

	// Fret numbers
	fretTextOffsetX: 0,
	fretTextOffsetY: 6.5,
};

/**
 * Base styling for vertical views (vertical-right and vertical-left).
 *
 * @description Extends BASE_CHORD_STYLE with dimensions, canvas offsets, and positioning
 * specific to vertical layouts. Extracted from WithBarreVerticalRight story.
 *
 * **Shared properties between vertical-right and vertical-left:**
 * - Dimensions: width, height, fretWidth, fretHeight
 * - Canvas offsets: canvasOffsetX, canvasOffsetY
 * - Structural sizing: barreHeight, barresWidth
 *
 * **When to use:** As a base for creating vertical view variations.
 */
export const VERTICAL_BASE = {
	...BASE_CHORD_STYLE,

	// Dimensions
	width: 173,
	height: 240,
	fretWidth: 23,
	fretHeight: 39,

	// Canvas positioning
	canvasOffsetX: -15,
	canvasOffsetY: -24,

	// Barres
	barreHeight: 11,
	barresWidth: 11,
	barresOffsetX: 0.12,
	barresOffsetY: 0.33,

	// Tuning labels
	tuningLabelOffsetX: 0.04,
	tuningLabelOffsetY: 0.15,

	// String indicators
	stringIndicatorOffsetX: 0.35,
	stringIndicatorOffsetY: 0,

	// Fret numbers
	fretTextOffsetX: -6.32,
	fretTextOffsetY: 0.16,
};

/**
 * Default styling for horizontal-right view.
 *
 * @description Complete style configuration for horizontal layout with strings
 * oriented horizontally and labels on the right side.
 *
 * **Use this when:** You want a standard horizontal chord diagram (most common for web).
 */
export const HORIZONTAL_RIGHT_STYLE = {
	...HORIZONTAL_BASE,
	view: "horizontal-right" as ViewId,
};

/**
 * Default styling for horizontal-left view.
 *
 * @description Complete style configuration for horizontal layout with strings
 * oriented horizontally and labels on the left side (mirrored).
 *
 * **Use this when:** You want a mirrored horizontal chord diagram.
 */
export const HORIZONTAL_LEFT_STYLE = {
	...HORIZONTAL_BASE,
	view: "horizontal-left" as ViewId,
};

/**
 * Default styling for vertical-right view.
 *
 * @description Complete style configuration for vertical layout with strings
 * oriented vertically and labels positioned for right-handed players.
 *
 * **Use this when:** You want a vertical chord diagram (common for print materials).
 */
export const VERTICAL_RIGHT_STYLE = {
	...VERTICAL_BASE,
	view: "vertical-right" as ViewId,
};

/**
 * Default styling for vertical-left view.
 *
 * @description Complete style configuration for vertical layout with strings
 * oriented vertically and labels positioned for left-handed players.
 *
 * **Use this when:** You want a vertical chord diagram for left-handed players.
 */
export const VERTICAL_LEFT_STYLE = {
	...VERTICAL_BASE,
	view: "vertical-left" as ViewId,
};

/**
 * Default chord diagram styling configuration.
 *
 * @description Alias for VERTICAL_RIGHT_STYLE to maintain backwards compatibility.
 * This ensures existing code continues to work without breaking changes.
 *
 * **Recommendation:** Use view-specific constants (VERTICAL_RIGHT_STYLE, HORIZONTAL_RIGHT_STYLE, etc.)
 * for new code to be explicit about the intended layout.
 *
 * @deprecated Consider using view-specific constants for clarity.
 */
export const DEFAULT_CHORD_STYLE = VERTICAL_RIGHT_STYLE;

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
