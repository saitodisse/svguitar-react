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
}

/**
 * Renders a barre (bar chord) across multiple strings
 */
export const Barre: React.FC<BarreProps> = React.memo(
	({ engine, frame, barre, barreHeight, barreColor, fontFamily, dotTextSize, dotTextColor }) => {
		const rect = engine.barreRect(barre, { frame });

		return (
			<g>
				<rect
					x={rect.x}
					y={rect.y}
					width={rect.width}
					height={rect.height}
					rx={rect.rx ?? barreHeight / 2}
					ry={barreHeight / 2}
					fill={barreColor}
					stroke={barreColor}
					strokeWidth={1}
				/>
				{barre.text && (
					<text
						x={rect.x + rect.width / 2}
						y={rect.y + rect.height / 2 + dotTextSize / 3}
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
