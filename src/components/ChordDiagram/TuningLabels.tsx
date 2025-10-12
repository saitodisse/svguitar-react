/**
 * @fileoverview TuningLabels component for rendering string tuning labels
 * @author svguitar-react
 * @version 1.0.0
 */

import React from "react";
import type { LayoutEngine, LayoutFrame } from "./types";
import { formatTuningLabel } from "./utils";

interface TuningLabelsProps {
	engine: LayoutEngine;
	frame: LayoutFrame;
	tuning: string[];
}

/**
 * Renders tuning labels for each string
 * Note: tuning array is in ascending pitch order (low to high).
 * Index 0 = string 6 (low E2), index 5 = string 1 (high E4)
 */
export const TuningLabels: React.FC<TuningLabelsProps> = React.memo(({ engine, frame, tuning }) => {
	const isVertical = engine.id.startsWith("vertical");
	const isHorizontalLeft = engine.id === "horizontal-left";
	const { tuningLabelOffsetX, tuningLabelOffsetY, tuningLabelFormat } = frame.style;

	return (
		<g>
			{tuning.map((note, index) => {
				// Map tuning array index to string number: index 0 = string 6, index 5 = string 1
				const stringNumber = frame.stringCount - index;
				const formattedNote = formatTuningLabel(note, tuningLabelFormat);

				if (isVertical) {
					const baseX = engine.mapStringAxis(stringNumber, frame);
					const baseY = frame.gridOriginY;

					// Apply offsets: offsetX moves horizontally, offsetY moves vertically (down is positive)
					const offsetX = tuningLabelOffsetX * frame.style.fretWidth;
					const offsetY = tuningLabelOffsetY * frame.style.fretHeight;

					const x = baseX + offsetX;
					const y = baseY - offsetY; // Subtract because labels are above the grid

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
							{formattedNote}
						</text>
					);
				}

				const baseY = engine.mapStringAxis(stringNumber, frame) + frame.style.tuningTextSize / 3;
				const baseX = isHorizontalLeft ? frame.gridOriginX + frame.gridWidth : frame.gridOriginX;

				// Apply offsets: offsetX moves horizontally, offsetY moves vertically
				const offsetX = tuningLabelOffsetX * frame.style.fretWidth;
				const offsetY = tuningLabelOffsetY * frame.style.fretHeight;

				const x = isHorizontalLeft ? baseX + offsetX : baseX - offsetX;
				const y = baseY + offsetY;

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
						{formattedNote}
					</text>
				);
			})}
		</g>
	);
});

TuningLabels.displayName = "TuningLabels";
