/**
 * @fileoverview TypeScript interfaces for the ChordDiagram component
 * @author svguitar-react
 * @version 1.0.0
 */

import type { FrettedInstrumentVoicing } from "achorde-musical-domain";

/**
 * Represents a finger positioned on the guitar fretboard
 */
export interface Finger {
	/** The fret number (0 for open strings) */
	fret: number;
	/** The string number (1 = lowest-pitched string, e.g., E2) */
	string: number;
	/** Whether the string is muted (true for 'x' in fret notation) */
	is_muted: boolean;
	/** Optional text to display inside the finger circle */
	text?: string;
}

/**
 * Represents a barre (bar chord) across multiple strings
 */
export interface Barre {
	/** The fret number (must be > 0) */
	fret: number;
	/** Starting string number (1 = lowest-pitched string) */
	fromString: number;
	/** Ending string number (e.g., 6 = highest-pitched string) */
	toString: number;
	/** Optional text to display on the barre */
	text?: string;
}

/**
 * Represents a chord with fingers, barres, and position information
 */
export interface Chord {
	/** Array of finger positions */
	fingers: Finger[];
	/** Array of barre positions */
	barres: Barre[];
	/** First fret to display (for high position chords) */
	firstFret?: number;
	/** Last fret to display */
	lastFret?: number;
}

/**
 * Represents guitar instrument configuration
 */
export interface Instrument {
	/** Number of strings */
	strings: number;
	/** Number of frets to display */
	frets: number;
	/** Scientific notation of open string notes, from lowest to highest pitch (e.g., ["E2", "A2", "D3", "G3", "B3", "E4"]) */
	tuning: string[];
	/** Fret notation string (e.g., "x32010") */
	chord: string;
}

export type InvalidBehavior = "keep-previous" | "render-fallback" | "suppress";

export interface ErrorContext {
	input: string | Chord | FrettedInstrumentVoicing;
	code: ErrorCode;
	message: string;
	normalized?: Chord | null;
	warnings?: ErrorCode[];
}

/**
 * Identifies predefined views for the component
 */
export type ViewId = "horizontal-right" | "horizontal-left" | "vertical-right" | "vertical-left";

/**
 * Layout frame containing all necessary information for positioning elements
 */
export interface LayoutFrame {
	width: number;
	height: number;
	gridOriginX: number;
	gridOriginY: number;
	gridWidth: number;
	gridHeight: number;
	firstFret: number;
	stringCount: number;
	fretCount: number;
	style: ChordStyle;
}

/**
 * Arguments passed to layout engine methods
 */
export interface LayoutArgs {
	frame: LayoutFrame;
}

/**
 * Layout engine strategy for mapping domain coordinates to SVG coordinates
 */
export interface LayoutEngine {
	id: ViewId;

	// Axis mapping
	mapStringAxis(stringNumber: number, frame: LayoutFrame): number;
	mapFretAxis(fret: number, frame: LayoutFrame): number;

	// Element positioning
	fingerPosition(finger: Finger, args: LayoutArgs): { cx: number; cy: number; r: number };
	barreRect(
		barre: Barre,
		args: LayoutArgs
	): { x: number; y: number; width: number; height: number; rx?: number };
	indicatorPosition(
		stringNumber: number,
		kind: "open" | "muted",
		args: LayoutArgs
	): { x: number; y: number };
}

/**
 * Main props interface for the ChordDiagram component
 */
export interface ChordDiagramProps {
	/** Shared voicing contract from achorde-musical-domain. Takes precedence over legacy inline props. */
	voicing?: FrettedInstrumentVoicing;

	// Instrument configuration (inline) - for fret notation input
	/** Number of strings (default: 6) */
	strings?: number;
	/** Number of frets to display (default: 4) */
	frets?: number;
	/** Scientific notation of open string notes, from lowest to highest pitch (e.g., ["E2", "A2", "D3", "G3", "B3", "E4"]) */
	tuning?: string[];
	/** Fret notation string (e.g., "x32010" or "(10)(12)(10)(10)(10)(10)") - replaces old instrument.chord */
	fretNotation?: string;

	// Chord data (inline) - structured input
	/** Array of finger positions */
	fingers?: Finger[];
	/** Array of barre positions */
	barres?: Barre[];
	/** First fret to display (for high position chords) */
	firstFret?: number;
	/** Last fret to display */
	lastFret?: number;

	// Layout (mapping-per-view)
	/** Predefined view for layout */
	view?: ViewId; // default: "horizontal-right"
	/** Custom layout engine strategy; if provided, takes precedence over view */
	layoutEngine?: LayoutEngine;

	// Dimensions
	/** Total width of the SVG */
	width?: number;
	/** Total height of the SVG */
	height?: number;
	/** Number of frets to render */
	fretCount?: number;
	/** Number of strings */
	stringCount?: number;
	/** Width of each fret space */
	fretWidth?: number;
	/** Height of each fret space */
	fretHeight?: number;
	/** Width of string lines */
	stringWidth?: number;
	/** Size of finger dots */
	dotSize?: number;
	/** Height of barre rectangles */
	barreHeight?: number;

	// Colors
	/** Background color */
	backgroundColor?: string;
	/** Fret line color */
	fretColor?: string;
	/** String line color */
	stringColor?: string;
	/** Finger dot color */
	dotColor?: string;
	/** Finger dot text color */
	dotTextColor?: string;
	/** Barre color */
	barreColor?: string;
	/** Fret number text color */
	fretTextColor?: string;
	/** Tuning text color */
	tuningTextColor?: string;
	/** Open string indicator color */
	openStringColor?: string;
	/** Muted string indicator color */
	mutedStringColor?: string;

	// Fonts
	/** Font family */
	fontFamily?: string;
	/** Finger dot text size */
	dotTextSize?: number;
	/** Fret number text size */
	fretTextSize?: number;
	/** Tuning text size */
	tuningTextSize?: number;

	// TuningLabels customization
	/** Horizontal distance multiplier (-5 to 5) applied to fretWidth for tuning label positioning (default: 0) */
	tuningLabelOffsetX?: number;
	/** Vertical distance multiplier (-5 to 5) applied to fretHeight for tuning label positioning (default: 0.5) */
	tuningLabelOffsetY?: number;
	/** Format for tuning labels: "scientific" (E2) or "note-only" (E) (default: "scientific") */
	tuningLabelFormat?: "scientific" | "note-only";

	// String indicators customization
	/** Horizontal distance multiplier (-5 to 5) applied to fretWidth for open/muted string indicators positioning (default: 0.5) */
	stringIndicatorOffsetX?: number;
	/** Vertical distance multiplier (-5 to 5) applied to fretHeight for open/muted string indicators positioning (default: 0) */
	stringIndicatorOffsetY?: number;

	// Barres customization
	/** Width/thickness of barre rectangles in pixels (default: 8). In horizontal views, controls the width; in vertical views, controls the height/thickness. */
	barresWidth?: number;
	/** Opacity of barre rectangles from 0 to 1 (default: 1.0) */
	barresOpacity?: number;
	/** Horizontal offset multiplier (-5 to 5) applied to fretWidth for barre positioning (default: 0) */
	barresOffsetX?: number;
	/** Vertical offset multiplier (-5 to 5) applied to fretHeight for barre positioning (default: 0) */
	barresOffsetY?: number;

	// Fret numbers customization
	/** Horizontal offset multiplier (-5 to 5) applied to fretWidth for fret number positioning (default: 0) */
	fretTextOffsetX?: number;
	/** Vertical offset multiplier (-5 to 5) applied to fretHeight for fret number positioning (default: 0) */
	fretTextOffsetY?: number;

	// Nut (fret zero) customization
	/** Stroke width multiplier (-5 to 5) applied to fretWidth for nut line thickness (default: 0.075 ≈ 3px) */
	nutStrokeWidth?: number;
	/** Horizontal offset multiplier (-5 to 5) applied to fretWidth for nut positioning (default: 0) */
	nutOffsetX?: number;
	/** Vertical offset multiplier (-5 to 5) applied to fretHeight for nut positioning (default: 0) */
	nutOffsetY?: number;
	/** Nut opacity from 0 to 1 (default: 1.0) */
	nutOpacity?: number;
	/** Nut line color (default: same as fretColor) */
	nutColor?: string;

	// Canvas positioning (global diagram offset)
	/** Horizontal offset in pixels for entire diagram (default: 0) - useful for padding/margin and future zoom */
	canvasOffsetX?: number;
	/** Vertical offset in pixels for entire diagram (default: 0) - useful for padding/margin and future zoom */
	canvasOffsetY?: number;

	// Auto barre detection
	/**
	 * Enables/disables automatic barre detection (default: true)
	 *
	 * When enabled and there are more than 4 pressed fingers (fret > 0), the system automatically
	 * adds a barre on the fret with the most fingers, covering from the first to the last string
	 * with a finger on that fret. Fingers covered by the barre are removed from visualization.
	 *
	 * Auto barre is disabled if:
	 * - autoBarreEnabled is set to false
	 * - OR there are manual barres defined (manual barres have precedence)
	 *
	 * @default true
	 */
	autoBarreEnabled?: boolean;

	// Auto first fret calculation
	/**
	 * Enables/disables automatic firstFret calculation (default: false)
	 *
	 * When enabled and firstFret is not manually provided, the system automatically
	 * calculates the optimal firstFret position based on finger positions. If any
	 * finger is outside the visible range (1-fretCount), it adjusts firstFret to
	 * the minimum fret position. If the range of fingers exceeds fretCount, it
	 * automatically increases fretCount (up to a maximum of 12 frets).
	 *
	 * Auto firstFret is disabled if:
	 * - autoFirstFret is set to false
	 * - OR firstFret is manually provided (manual value has precedence)
	 *
	 * @default false
	 */
	autoFirstFret?: boolean;

	// Validation & error handling
	/** Validation policy: strict (default) rejects invalid inputs; lenient tries to normalize */
	validation?: "strict" | "lenient";
	/** Behavior when input is invalid */
	invalidBehavior?: InvalidBehavior;
	/** Fallback chord when no last valid is available */
	fallbackChord?: string | Chord;
	/** Error callback to delegate UI/telemetry */
	onError?: (error: ChordDiagramError, context: ErrorContext) => void;
	/** Optional inline error UI */
	errorFallback?: React.ReactNode | ((error: ChordDiagramError, context: ErrorContext) => React.ReactNode);
}

/**
 * Visual styling configuration for chord diagrams
 * All properties are optional and will have default values
 * Note: These properties are included directly inline in ChordDiagramProps, not as a separate style object
 * Layout properties (orientation/handedness) have been removed in favor of view/layoutEngine
 */
export interface ChordStyle {
	// Dimensions
	/** Total width of the SVG */
	width: number;
	/** Total height of the SVG */
	height: number;
	/** Number of frets to render */
	fretCount: number;
	/** Number of strings */
	stringCount: number;
	/** Width of each fret space */
	fretWidth: number;
	/** Height of each fret space */
	fretHeight: number;
	/** Width of string lines */
	stringWidth: number;
	/** Size of finger dots */
	dotSize: number;
	/** Height of barre rectangles */
	barreHeight: number;

	// Colors
	/** Background color */
	backgroundColor: string;
	/** Fret line color */
	fretColor: string;
	/** String line color */
	stringColor: string;
	/** Finger dot color */
	dotColor: string;
	/** Finger dot text color */
	dotTextColor: string;
	/** Barre color */
	barreColor: string;
	/** Fret number text color */
	fretTextColor: string;
	/** Tuning text color */
	tuningTextColor: string;
	/** Open string indicator color */
	openStringColor: string;
	/** Muted string indicator color */
	mutedStringColor: string;

	// Fonts
	/** Font family */
	fontFamily: string;
	/** Finger dot text size */
	dotTextSize: number;
	/** Fret number text size */
	fretTextSize: number;
	/** Tuning text size */
	tuningTextSize: number;

	// TuningLabels customization
	/** Horizontal distance multiplier (-5 to 5) applied to fretWidth for tuning label positioning */
	tuningLabelOffsetX: number;
	/** Vertical distance multiplier (-5 to 5) applied to fretHeight for tuning label positioning */
	tuningLabelOffsetY: number;
	/** Format for tuning labels: "scientific" (E2) or "note-only" (E) */
	tuningLabelFormat: "scientific" | "note-only";

	// String indicators customization
	/** Horizontal distance multiplier (-5 to 5) applied to fretWidth for open/muted string indicators positioning */
	stringIndicatorOffsetX: number;
	/** Vertical distance multiplier (-5 to 5) applied to fretHeight for open/muted string indicators positioning */
	stringIndicatorOffsetY: number;

	// Barres customization
	/** Width/thickness of barre rectangles in pixels. In horizontal views, controls the width; in vertical views, controls the height/thickness. */
	barresWidth: number;
	/** Opacity of barre rectangles from 0 to 1 */
	barresOpacity: number;
	/** Horizontal offset multiplier (-5 to 5) applied to fretWidth for barre positioning */
	barresOffsetX: number;
	/** Vertical offset multiplier (-5 to 5) applied to fretHeight for barre positioning */
	barresOffsetY: number;

	// Fret numbers customization
	/** Horizontal offset multiplier (-5 to 5) applied to fretWidth for fret number positioning */
	fretTextOffsetX: number;
	/** Vertical offset multiplier (-5 to 5) applied to fretHeight for fret number positioning */
	fretTextOffsetY: number;

	// Nut (fret zero) customization
	/** Stroke width multiplier (-5 to 5) applied to fretWidth for nut line thickness */
	nutStrokeWidth: number;
	/** Horizontal offset multiplier (-5 to 5) applied to fretWidth for nut positioning */
	nutOffsetX: number;
	/** Vertical offset multiplier (-5 to 5) applied to fretHeight for nut positioning */
	nutOffsetY: number;
	/** Nut opacity from 0 to 1 */
	nutOpacity: number;
	/** Nut line color */
	nutColor: string;

	// Canvas positioning (global diagram offset)
	/** Horizontal offset in pixels for entire diagram */
	canvasOffsetX: number;
	/** Vertical offset in pixels for entire diagram */
	canvasOffsetY: number;
}

/**
 * Custom error class for ChordDiagram validation errors
 */
export class ChordDiagramError extends Error {
	public code: string;

	constructor(message: string, code: string) {
		super(message);
		this.name = "ChordDiagramError";
		this.code = code;
	}
}

/**
 * Error codes for different validation failures
 */
export const ERROR_CODES = {
	INVALID_FRET: "INVALID_FRET",
	INVALID_STRING: "INVALID_STRING",
	INVALID_TUNING: "INVALID_TUNING",
	INVALID_TAB_STRING: "INVALID_TAB_STRING",
	INVALID_BARRE: "INVALID_BARRE",
	MISSING_CHORD_DATA: "MISSING_CHORD_DATA",
	INVALID_VIEW: "INVALID_VIEW", // Invalid ViewId or missing engine
} as const;

export type ErrorCode = (typeof ERROR_CODES)[keyof typeof ERROR_CODES];

/**
 * Complete state of a ChordDiagram component for export/import
 */
export interface ChordDiagramState {
	// Metadata
	_version: string;
	_timestamp: string;

	// Instrument configuration (inline)
	strings: number;
	frets: number;
	tuning: string[];
	fretNotation?: string;

	// Chord data (inline)
	fingers?: Finger[];
	barres?: Barre[];
	firstFret?: number;
	lastFret?: number;

	// Layout
	view: ViewId;

	// All style properties (matching ChordStyle)
	width: number;
	height: number;
	fretCount: number;
	stringCount: number;
	fretWidth: number;
	fretHeight: number;
	stringWidth: number;
	dotSize: number;
	barreHeight: number;

	backgroundColor: string;
	fretColor: string;
	stringColor: string;
	dotColor: string;
	dotTextColor: string;
	barreColor: string;
	fretTextColor: string;
	tuningTextColor: string;
	openStringColor: string;
	mutedStringColor: string;

	fontFamily: string;
	dotTextSize: number;
	fretTextSize: number;
	tuningTextSize: number;

	tuningLabelOffsetX: number;
	tuningLabelOffsetY: number;
	tuningLabelFormat: "scientific" | "note-only";

	stringIndicatorOffsetX: number;
	stringIndicatorOffsetY: number;

	barresWidth: number;
	barresOpacity: number;
	barresOffsetX: number;
	barresOffsetY: number;

	fretTextOffsetX: number;
	fretTextOffsetY: number;

	nutStrokeWidth: number;
	nutOffsetX: number;
	nutOffsetY: number;
	nutOpacity: number;
	nutColor: string;

	canvasOffsetX: number;
	canvasOffsetY: number;
}

/**
 * Fretboard internal state for deterministic rendering
 */
export interface FretboardState {
	frame: Omit<LayoutFrame, "style">;
	engineId: ViewId;
	style: ChordStyle;
}
