/**
 * @fileoverview TuningLabels component for rendering string tuning labels
 * @author svguitar-react
 * @version 1.0.0
 */

import React from "react";
import type { ChordStyle } from "./types";
import { getStartY } from "./utils";

interface TuningLabelsProps {
	tuning: string[];
	stringCount: number;
	fretHeight: number;
	tuningTextColor: string;
	tuningTextSize: number;
	fontFamily: string;
	fretTextSize: number;
}

/**
 * Renders tuning labels for each string
 */
export const TuningLabels: React.FC<TuningLabelsProps> = React.memo(
	({ tuning, stringCount, fretHeight, tuningTextColor, tuningTextSize, fontFamily, fretTextSize }) => {
		// Calculate positions using utility functions
		const startY = getStartY({ fretTextSize });
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
	}
);

TuningLabels.displayName = "TuningLabels";
