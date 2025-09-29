/**
 * @fileoverview TypeScript interfaces for the ChordDiagram component
 * @author svguitar-react
 * @version 1.0.0
 */

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
	input: string | Chord;
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
	/** Instrument configuration (for fret notation input) */
	instrument?: Partial<Instrument>;
	/** Chord data (structured input) */
	chord?: Chord;

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
