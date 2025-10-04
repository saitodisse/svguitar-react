/**
 * @fileoverview FretNumbers component for rendering fret numbers
 * @author svguitar-react
 * @version 1.0.0
 */

import React from "react";
import type { LayoutEngine, LayoutFrame } from "./types";

interface FretNumbersProps {
	engine: LayoutEngine;
	frame: LayoutFrame;
}

/**
 * Renders fret position numbers above the fretboard (horizontal layouts) or to the right of the fretboard (vertical layouts)
 * In vertical layouts, numbers represent fret positions (casas) where fingers are placed
 */
export const FretNumbers: React.FC<FretNumbersProps> = React.memo(({ engine, frame }) => {
	const isVertical = engine.id.startsWith("vertical");
	const isHorizontalLeft = engine.id === "horizontal-left";

	const frets = Array.from({ length: frame.fretCount }, (_, i) => {
		const fretNumber = frame.firstFret + i;

		if (isVertical) {
			// For vertical layouts: position to the right of the fretboard
			const x = frame.gridOriginX + frame.gridWidth + frame.style.fretWidth * 0.5; // Right of the fretboard

			// Skip fret 0 (nut) - it's not displayed in vertical layouts
			if (fretNumber === 0) {
				return null;
			}

			// Position Y in the middle of each fret position (casa)
			// Casa 1: middle between nut (fret 0) and fret 1
			// Casa 2: middle between fret 1 and fret 2
			// etc.
			const y = frame.gridOriginY + (fretNumber - frame.firstFret + 0.5) * frame.style.fretHeight;
			return { fretNumber, x, y };
		} else {
			// For horizontal layouts: position above the fretboard
			const x = engine.mapFretAxis(frame.firstFret + i, frame);
			const y = frame.gridOriginY - frame.style.fretHeight * 0.7;
			return { fretNumber, x, y };
		}
	}).filter((fret): fret is { fretNumber: number; x: number; y: number } => fret !== null);

	const orderedFrets = isHorizontalLeft ? frets.reverse() : frets;

	return (
		<g>
			{orderedFrets.map(({ fretNumber, x, y }) => (
				<text
					key={`fret-number-${fretNumber}`}
					x={x}
					y={y}
					textAnchor="middle"
					fill={frame.style.fretTextColor}
					fontSize={frame.style.fretTextSize}
					fontFamily={frame.style.fontFamily}
					fontWeight="bold"
				>
					{fretNumber}
				</text>
			))}
		</g>
	);
});

FretNumbers.displayName = "FretNumbers";
