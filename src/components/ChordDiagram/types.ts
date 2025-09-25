/**
 * @fileoverview TypeScript interfaces for the ChordDiagram component
 * @author svguitar-react
 * @version 1.0.0
 */

/**
 * Represents a finger positioned on the guitar fretboard
 */
export interface Finger {
	/** The fret number (1-based) */
	fret: number;
	/** The string number (1-based, 1 = thickest string) */
	string: number;
	/** Optional text to display inside the finger circle */
	text?: string;
}

/**
 * Represents a barre (bar chord) across multiple strings
 */
export interface Barre {
	/** The fret number (1-based) */
	fret: number;
	/** Starting string number (1-based) */
	fromString: number;
	/** Ending string number (1-based) */
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
	/** Tuning of the strings (e.g., ["E", "A", "D", "G", "B", "E"]) */
	tuning: string[];
	/** Fret notation string (e.g., "x32010") */
	chord: string;
}

/**
 * Visual styling configuration for the chord diagram
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
 * Main props interface for the ChordDiagram component
 */
export interface ChordDiagramProps {
	/** Instrument configuration (for fret notation input) */
	instrument?: Partial<Instrument>;
	/** Chord data (structured input) */
	chord?: Chord;
	/** Custom styling options */
	style?: Partial<ChordStyle>;
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
} as const;

export type ErrorCode = (typeof ERROR_CODES)[keyof typeof ERROR_CODES];
