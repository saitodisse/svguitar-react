/**
 * @fileoverview Finger component for rendering finger positions
 * @author svguitar-react
 * @version 1.0.0
 */

import React from "react";
import type { Finger as FingerType, ChordStyle } from "./types";
import { getStartX, getStartY, getFingerX, getFingerY } from "./utils";

interface FingerProps {
	finger: FingerType;
	firstFret?: number;
	stringCount: number;
	fretWidth: number;
	fretHeight: number;
	dotSize: number;
	dotColor: string;
	dotTextColor: string;
	dotTextSize: number;
	fontFamily: string;
	openStringSize: number;
	mutedStringSize: number;
	openStringColor: string;
	mutedStringColor: string;
	tuningTextSize: number;
	fretTextSize: number;
}

/**
 * Renders a single finger position on the fretboard
 */
export const Finger: React.FC<FingerProps> = React.memo(
	({
		finger,
		firstFret = 1,
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
		tuningTextSize,
		fretTextSize,
	}) => {
		// Calculate positions using utility functions
		const startX = getStartX({ fretWidth, tuningTextSize });
		const startY = getStartY({ fretTextSize });

		// Calculate finger position using utility functions
		const x = getFingerX(finger, firstFret, fretWidth, startX);
		const y = getFingerY(finger, stringCount, fretHeight, startY);

		// Handle open strings and muted strings (fret 0)
		if (finger.fret === 0) {
			// Position for open/muted strings to the left of the nut
			const openX = startX - fretWidth / 2;

			if (finger.is_muted) {
				// Render 'X' for muted strings
				const size = mutedStringSize;
				const color = mutedStringColor;

				return (
					<g>
						{/* X shape for muted strings */}
						<line
							x1={openX - size / 2.5}
							y1={y - size / 2.5}
							x2={openX + size / 2.5}
							y2={y + size / 2.5}
							stroke={color}
							strokeWidth={4}
						/>
						<line
							x1={openX + size / 2.5}
							y1={y - size / 2.5}
							x2={openX - size / 2.5}
							y2={y + size / 2.5}
							stroke={color}
							strokeWidth={4}
						/>
					</g>
				);
			} else {
				// Render 'O' for open strings
				const size = openStringSize;
				const color = openStringColor;

				return (
					<g>
						<circle cx={openX} cy={y} r={size / 2} fill="white" stroke={color} strokeWidth={2} />
					</g>
				);
			}
		}

		// Regular finger position for fretted notes (x and y already calculated above)
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
	}
);

Finger.displayName = "Finger";
