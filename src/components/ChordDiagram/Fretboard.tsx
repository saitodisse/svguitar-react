/**
 * @fileoverview Fretboard component for rendering guitar fretboard
 * @author svguitar-react
 * @version 1.0.0
 */

import React from "react";
import type { ChordStyle } from "./types";

interface FretboardProps {
	style: ChordStyle;
}

/**
 * Renders the guitar fretboard (frets and strings)
 */
export const Fretboard: React.FC<FretboardProps> = React.memo(({ style }) => {
	const { fretCount, stringCount, fretWidth, fretHeight, stringWidth, fretColor, stringColor } = style;

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
