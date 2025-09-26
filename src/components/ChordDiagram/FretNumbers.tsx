/**
 * @fileoverview FretNumbers component for rendering fret numbers
 * @author svguitar-react
 * @version 1.0.0
 */

import React from "react";
import type { ChordStyle } from "./types";

interface FretNumbersProps {
	firstFret: number;
	fretCount: number;
	fretWidth: number;
	fretTextColor: string;
	fretTextSize: number;
	fontFamily: string;
}

/**
 * Renders fret numbers above the fretboard
 */
export const FretNumbers: React.FC<FretNumbersProps> = React.memo(
	({ firstFret, fretCount, fretWidth, fretTextColor, fretTextSize, fontFamily }) => {
		// Calculate positions
		const startX = 40; // Space for tuning labels
		const y = 50; // Position above the fretboard

		return (
			<g>
				{Array.from({ length: fretCount }, (_, i) => {
					const fretNumber = firstFret + i;
					const x = startX + (i + 0.5) * fretWidth;

					return (
						<text
							key={`fret-number-${fretNumber}`}
							x={x}
							y={y}
							textAnchor="middle"
							fill={fretTextColor}
							fontSize={fretTextSize}
							fontFamily={fontFamily}
							fontWeight="bold"
						>
							{fretNumber}
						</text>
					);
				})}
			</g>
		);
	}
);

FretNumbers.displayName = "FretNumbers";
