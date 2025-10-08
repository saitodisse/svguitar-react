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
 */
export const TuningLabels: React.FC<TuningLabelsProps> = React.memo(({ engine, frame, tuning }) => {
	const isVertical = engine.id.startsWith("vertical");
	const isHorizontalLeft = engine.id === "horizontal-left";
	const { tuningLabelOffset, tuningLabelFormat } = frame.style;

	return (
		<g>
			{tuning.map((note, index) => {
				const stringNumber = index + 1;
				const formattedNote = formatTuningLabel(note, tuningLabelFormat);

				if (isVertical) {
					const x = engine.mapStringAxis(stringNumber, frame);
					// Apply tuningLabelOffset: in vertical views, labels move down (negative offset)
					const y = frame.gridOriginY - frame.style.fretHeight * tuningLabelOffset;
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

				const y = engine.mapStringAxis(stringNumber, frame) + frame.style.tuningTextSize / 3;
				// Apply tuningLabelOffset: horizontal-right moves left (negative), horizontal-left moves right (positive)
				const baseOffset = frame.style.fretWidth * tuningLabelOffset;
				const x = isHorizontalLeft
					? frame.gridOriginX + frame.gridWidth + baseOffset
					: frame.gridOriginX - baseOffset;
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
