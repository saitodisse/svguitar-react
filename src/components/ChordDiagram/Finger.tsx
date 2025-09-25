/**
 * @fileoverview Finger component for rendering finger positions
 * @author svguitar-react
 * @version 1.0.0
 */

import React from "react";
import type { Finger as FingerType, ChordStyle } from "./types";

interface FingerProps {
	finger: FingerType;
	style: ChordStyle;
	firstFret?: number;
}

/**
 * Renders a single finger position on the fretboard
 */
export const Finger: React.FC<FingerProps> = React.memo(({ finger, style, firstFret = 1 }) => {
	const {
		stringCount,
		fretWidth,
		fretHeight,
		dotSize,
		dotColor,
		dotTextColor,
		dotTextSize,
		fontFamily,
		openStringSize,
		mutedStringSize,
		openStringColor,
		mutedStringColor,
	} = style;

	// Calculate position
	const startX = 40; // Space for tuning labels
	const startY = 60; // Space for fret numbers

	// Invert y-axis: string 1 is at the bottom
	const y = startY + (stringCount - finger.string) * fretHeight;

	// Handle open strings and muted strings (fret 0)
	if (finger.fret === 0) {
		// Position for open/muted strings to the left of the nut
		const x = startX - fretWidth / 2;

		if (finger.is_muted) {
			// Render 'X' for muted strings
			const size = mutedStringSize;
			const color = mutedStringColor;

			return (
				<g>
					{/* X shape for muted strings */}
					<line
						x1={x - size / 2.5}
						y1={y - size / 2.5}
						x2={x + size / 2.5}
						y2={y + size / 2.5}
						stroke={color}
						strokeWidth={2}
					/>
					<line
						x1={x + size / 2.5}
						y1={y - size / 2.5}
						x2={x - size / 2.5}
						y2={y + size / 2.5}
						stroke={color}
						strokeWidth={2}
					/>
				</g>
			);
		} else {
			// Render 'O' for open strings
			const size = openStringSize;
			const color = openStringColor;

			return (
				<g>
					<circle cx={x} cy={y} r={size / 2} fill="transparent" stroke={color} strokeWidth={2} />
				</g>
			);
		}
	}

	// Regular finger position for fretted notes
	const x = startX + (finger.fret - firstFret + 0.5) * fretWidth;

	return (
		<g>
			<circle cx={x} cy={y} r={dotSize / 2} fill={dotColor} stroke={dotColor} strokeWidth={1} />
			{finger.text && (
				<text
					x={x}
					y={y + dotTextSize / 3}
					textAnchor="middle"
					fill={dotTextColor}
					fontSize={dotTextSize}
					fontFamily={fontFamily}
					fontWeight="bold"
				>
					{finger.text}
				</text>
			)}
		</g>
	);
});

Finger.displayName = "Finger";
