/**
 * @fileoverview FretNumbers component for rendering fret numbers
 * @author svguitar-react
 * @version 1.0.0
 */

import React from "react";
import type { ChordStyle } from "./types";
import { getStartX } from "./utils";

interface FretNumbersProps {
	firstFret: number;
	fretCount: number;
	fretWidth: number;
	fretTextColor: string;
	fretTextSize: number;
	fontFamily: string;
	tuningTextSize: number;
}

/**
 * Renders fret numbers above the fretboard
 */
export const FretNumbers: React.FC<FretNumbersProps> = React.memo(
	({ firstFret, fretCount, fretWidth, fretTextColor, fretTextSize, fontFamily, tuningTextSize }) => {
		// Calculate positions using utility functions
		const startX = getStartX({ fretWidth, tuningTextSize });
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
