/**
 * @fileoverview TuningLabels component for rendering string tuning labels
 * @author svguitar-react
 * @version 1.0.0
 */

import React from "react";
import type { LayoutEngine, LayoutFrame } from "./types";

interface TuningLabelsProps {
	engine: LayoutEngine;
	frame: LayoutFrame;
	tuning: string[];
}

/**
 * Renders tuning labels for each string
 */
export const TuningLabels: React.FC<TuningLabelsProps> = React.memo(({ engine, frame, tuning }) => {
	const isVertical = engine.id.startsWith("vertical");
	const isHorizontalLeft = engine.id === "horizontal-left";

	return (
		<g>
			{tuning.map((note, index) => {
				const stringNumber = index + 1;
				if (isVertical) {
					const x = engine.mapStringAxis(stringNumber, frame);
					const y = frame.gridOriginY - frame.style.fretHeight * 0.7;
					return (
						<text
							key={`tuning-${index}`}
							x={x}
							y={y}
							textAnchor="middle"
							fill={frame.style.tuningTextColor}
							fontSize={frame.style.tuningTextSize}
							fontFamily={frame.style.fontFamily}
							fontWeight="bold"
						>
							{note}
						</text>
					);
				}

				const y = engine.mapStringAxis(stringNumber, frame) + frame.style.tuningTextSize / 3;
				const x = isHorizontalLeft
					? frame.gridOriginX + frame.gridWidth + frame.style.fretWidth * 0.7
					: frame.gridOriginX - frame.style.fretWidth * 0.7;
				return (
					<text
						key={`tuning-${index}`}
						x={x}
						y={y}
						textAnchor="middle"
						fill={frame.style.tuningTextColor}
						fontSize={frame.style.tuningTextSize}
						fontFamily={frame.style.fontFamily}
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
