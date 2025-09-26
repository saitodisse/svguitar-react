/**
 * @fileoverview Fretboard component for rendering guitar fretboard
 * @author svguitar-react
 * @version 1.0.0
 */

import React from "react";

interface FretboardProps {
	// Layout
	/** Diagram orientation */
	orientation: "vertical" | "horizontal";
	/** For right- or left-handed players */
	handedness: "right" | "left";

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
	/** Size of open string indicator ('O') */
	openStringSize: number;
	/** Size of muted string indicator ('X') */
	mutedStringSize: number;

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
 * Renders the guitar fretboard (frets and strings)
 */
export const Fretboard: React.FC<FretboardProps> = React.memo(props => {
	const { fretCount, stringCount, fretWidth, fretHeight, stringWidth, fretColor, stringColor } = props;

	// Calculate positions
	const startX = 40; // Space for tuning labels
	const startY = 60; // Space for fret numbers
	const endX = startX + fretCount * fretWidth;
	const endY = startY + (stringCount - 1) * fretHeight;

	// Generate fret lines (vertical)
	const fretLines = Array.from({ length: fretCount + 1 }, (_, i) => (
		<line
			key={`fret-${i}`}
			x1={startX + i * fretWidth}
			y1={startY}
			x2={startX + i * fretWidth}
			y2={endY}
			stroke={fretColor}
			strokeWidth={i === 0 ? stringWidth * 2 : stringWidth}
		/>
	));

	// Generate string lines (horizontal)
	const stringLines = Array.from({ length: stringCount }, (_, i) => {
		const stringNumber = i + 1;
		// Render from bottom to top (string 1 is the lowest)
		const y = startY + (stringCount - stringNumber) * fretHeight;

		return (
			<line
				key={`string-${stringNumber}`}
				x1={startX}
				y1={y}
				x2={endX}
				y2={y}
				stroke={stringColor}
				strokeWidth={stringWidth}
			/>
		);
	});

	return (
		<g>
			{fretLines}
			{stringLines}
		</g>
	);
});

Fretboard.displayName = "Fretboard";
