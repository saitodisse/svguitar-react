/**
 * @fileoverview Barre component for rendering barre chords
 * @author svguitar-react
 * @version 1.0.0
 */

import React from "react";
import type { Barre as BarreType, LayoutEngine, LayoutFrame } from "./types";

interface BarreProps {
	engine: LayoutEngine;
	frame: LayoutFrame;
	barre: BarreType;
	barreHeight: number;
	barreColor: string;
	fontFamily: string;
	dotTextSize: number;
	dotTextColor: string;
	barresWidth: number;
	barresOpacity: number;
	barresOffsetX: number;
	barresOffsetY: number;
}

/**
 * Renders a barre (bar chord) across multiple strings
 */
export const Barre: React.FC<BarreProps> = React.memo(
	({
		engine,
		frame,
		barre,
		barreHeight,
		barreColor,
		fontFamily,
		dotTextSize,
		dotTextColor,
		barresWidth,
		barresOpacity,
		barresOffsetX,
		barresOffsetY,
	}) => {
		const rect = engine.barreRect(barre, { frame });

		// Apply offsets (multipliers applied to fretWidth and fretHeight)
		const offsetX = barresOffsetX * frame.style.fretWidth;
		const offsetY = barresOffsetY * frame.style.fretHeight;

		const finalX = rect.x + offsetX;
		const finalY = rect.y + offsetY;

		return (
			<g>
				<rect
					x={finalX}
					y={finalY}
					width={rect.width}
					height={rect.height}
					rx={rect.rx ?? barreHeight / 2}
					ry={barreHeight / 2}
					fill={barreColor}
					stroke={barreColor}
					strokeWidth={1}
					opacity={barresOpacity}
				/>
				{barre.text && (
					<text
						x={finalX + rect.width / 2}
						y={finalY + rect.height / 2 + dotTextSize / 3}
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
