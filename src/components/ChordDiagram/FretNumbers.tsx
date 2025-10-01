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
 * Renders fret numbers above the fretboard
 */
export const FretNumbers: React.FC<FretNumbersProps> = React.memo(({ engine, frame }) => {
	const y = frame.gridOriginY - frame.style.fretHeight * 0.7;
	const isHorizontalLeft = engine.id === "horizontal-left";

	const frets = Array.from({ length: frame.fretCount }, (_, i) => {
		const fretNumber = frame.firstFret + i;
		const x = engine.mapFretAxis(frame.firstFret + i, frame);
		return { fretNumber, x };
	});

	const orderedFrets = isHorizontalLeft ? frets.reverse() : frets;

	return (
		<g>
			{orderedFrets.map(({ fretNumber, x }) => (
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
