/**
 * @fileoverview TuningLabels component for rendering string tuning labels
 * @author svguitar-react
 * @version 1.0.0
 */

import React from "react";
import type { ChordStyle } from "./types";

interface TuningLabelsProps {
	tuning: string[];
	style: ChordStyle;
}

/**
 * Renders tuning labels for each string
 */
export const TuningLabels: React.FC<TuningLabelsProps> = React.memo(({ tuning, style }) => {
	const { stringCount, fretHeight, tuningTextColor, tuningTextSize, fontFamily } = style;

	// Calculate positions
	const startY = 60; // Space for fret numbers
	const x = 20; // Position to the left of the fretboard

	return (
		<g>
			{tuning.map((note, index) => {
				const stringNumber = index + 1;
				// Invert y-axis: string 1 is at the bottom
				const y = startY + (stringCount - stringNumber) * fretHeight + tuningTextSize / 3;

				return (
					<text
						key={`tuning-${index}`}
						x={x}
						y={y}
						textAnchor="middle"
						fill={tuningTextColor}
						fontSize={tuningTextSize}
						fontFamily={fontFamily}
						fontWeight="bold"
					>
						{note}
					</text>
				);
			})}
		</g>
	);
});

TuningLabels.displayName = "TuningLabels";
