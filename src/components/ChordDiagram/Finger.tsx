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
	const { fretWidth, fretHeight, dotSize, dotColor, dotTextColor, dotTextSize, fontFamily } = style;

	// Calculate position
	const startX = 40; // Space for tuning labels
	const startY = 60; // Space for fret numbers
	const x = startX + (finger.fret - firstFret + 0.5) * fretWidth;
	const y = startY + (finger.string - 1) * fretHeight;

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
