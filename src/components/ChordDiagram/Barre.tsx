/**
 * @fileoverview Barre component for rendering barre chords
 * @author svguitar-react
 * @version 1.0.0
 */

import React from "react";
import type { Barre as BarreType, ChordStyle } from "./types";

interface BarreProps {
	barre: BarreType;
	style: ChordStyle;
	firstFret?: number;
}

/**
 * Renders a barre (bar chord) across multiple strings
 */
export const Barre: React.FC<BarreProps> = React.memo(({ barre, style, firstFret = 1 }) => {
	const { fretWidth, fretHeight, barreHeight, barreColor, fontFamily, dotTextSize, dotTextColor } = style;

	// Calculate position
	const startX = 40; // Space for tuning labels
	const startY = 60; // Space for fret numbers
	const x = startX + (barre.fret - firstFret + 0.5) * fretWidth;
	const y = startY + (barre.fromString - 1) * fretHeight;
	const width = fretWidth * 0.8; // Width of the barre (80% of fret width)
	const height = (barre.toString - barre.fromString) * fretHeight + barreHeight;

	return (
		<g>
			<rect
				x={x - width / 2}
				y={y - barreHeight / 2}
				width={width}
				height={height}
				rx={barreHeight / 2}
				ry={barreHeight / 2}
				fill={barreColor}
				stroke={barreColor}
				strokeWidth={1}
			/>
			{barre.text && (
				<text
					x={x}
					y={y + height / 2 + dotTextSize / 3}
					textAnchor="middle"
					fill={dotTextColor}
					fontSize={dotTextSize}
					fontFamily={fontFamily}
					fontWeight="bold"
				>
					{barre.text}
				</text>
			)}
		</g>
	);
});

Barre.displayName = "Barre";
