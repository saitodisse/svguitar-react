/**
 * @fileoverview Finger component for rendering finger positions
 * @author svguitar-react
 * @version 1.0.0
 */

import React from "react";
import type { Finger as FingerType, LayoutEngine, LayoutFrame } from "./types";

interface FingerProps {
	engine: LayoutEngine;
	frame: LayoutFrame;
	finger: FingerType;
	dotSize: number;
	dotColor: string;
	dotTextColor: string;
	dotTextSize: number;
	fontFamily: string;
	openStringColor: string;
	mutedStringColor: string;
}

/**
 * Renders a single finger position on the fretboard
 */
export const Finger: React.FC<FingerProps> = React.memo(
	({
		engine,
		frame,
		finger,
		dotSize,
		dotColor,
		dotTextColor,
		dotTextSize,
		fontFamily,
		openStringColor,
		mutedStringColor,
	}) => {
		const isVertical = engine.id.startsWith("vertical");

		// Calculate finger position using layout engine
		const { cx: x, cy: y } = engine.fingerPosition(finger, { frame });

		// Handle open strings and muted strings (fret 0)
		if (finger.fret === 0) {
			// Position for open/muted markers near the nut and tuning labels
			const open = engine.indicatorPosition(finger.string, finger.is_muted ? "muted" : "open", {
				frame,
			});

			if (finger.is_muted) {
				// Render 'X' for muted strings
				const color = mutedStringColor;

				return (
					<g>
						{/* X shape for muted strings */}
						<line
							x1={open.x - dotSize / 2.5}
							y1={open.y - dotSize / 2.5}
							x2={open.x + dotSize / 2.5}
							y2={open.y + dotSize / 2.5}
							stroke={color}
							strokeWidth={4}
						/>
						<line
							x1={open.x + dotSize / 2.5}
							y1={open.y - dotSize / 2.5}
							x2={open.x - dotSize / 2.5}
							y2={open.y + dotSize / 2.5}
							stroke={color}
							strokeWidth={4}
						/>
					</g>
				);
			} else {
				// Render 'O' for open strings
				const color = openStringColor;

				return (
					<g>
						<circle
							cx={open.x}
							cy={open.y}
							r={dotSize / 2}
							fill="white"
							stroke={color}
							strokeWidth={2}
						/>
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
