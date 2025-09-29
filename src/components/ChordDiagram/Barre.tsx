/**
 * @fileoverview Barre component for rendering barre chords
 * @author svguitar-react
 * @version 1.0.0
 */

import React from "react";
import type { Barre as BarreType } from "./types";
import { getStartX, getStartY } from "./utils";

interface BarreProps {
	barre: BarreType;
	firstFret?: number;
	stringCount: number;
	fretWidth: number;
	fretHeight: number;
	barreHeight: number;
	barreColor: string;
	fontFamily: string;
	dotTextSize: number;
	dotTextColor: string;
	tuningTextSize: number;
	fretTextSize: number;
}

/**
 * Renders a barre (bar chord) across multiple strings
 */
export const Barre: React.FC<BarreProps> = React.memo(
	({
		barre,
		firstFret = 1,
		stringCount,
		fretWidth,
		fretHeight,
		barreHeight,
		barreColor,
		fontFamily,
		dotTextSize,
		dotTextColor,
		tuningTextSize,
		fretTextSize,
	}) => {
		// Calculate positions using utility functions
		const startX = getStartX({ fretWidth, tuningTextSize });
		const startY = getStartY({ fretTextSize });
		const x = startX + (barre.fret - firstFret + 0.5) * fretWidth;

		// Invert y-axis: string 1 is at the bottom
		const y = startY + (stringCount - barre.toString) * fretHeight;

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
	}
);

Barre.displayName = "Barre";
