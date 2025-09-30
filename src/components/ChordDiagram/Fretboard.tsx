/**
 * @fileoverview Fretboard component for rendering guitar fretboard
 * @author svguitar-react
 * @version 1.0.0
 */

import React from "react";
import type { LayoutEngine, LayoutFrame } from "./types";

interface FretboardProps {
	engine: LayoutEngine;
	frame: LayoutFrame;
	// visual
	fretColor: string;
	stringColor: string;
	stringWidth: number;
}

/**
 * Renders the guitar fretboard (frets and strings)
 */
export const Fretboard: React.FC<FretboardProps> = React.memo(props => {
	const { engine, frame, fretColor, stringColor, stringWidth } = props;

	const isVertical = engine.id.startsWith("vertical");

	// Fret boundaries (0..fretCount) as lines
	const fretLines = Array.from({ length: frame.fretCount + 1 }, (_, i) => {
		if (isVertical) {
			const y = frame.gridOriginY + i * frame.style.fretHeight;
			return (
				<line
					key={`fret-${i}`}
					x1={frame.gridOriginX}
					y1={y}
					x2={frame.gridOriginX + frame.gridWidth}
					y2={y}
					stroke={fretColor}
					strokeWidth={i === 0 ? stringWidth * 2 : stringWidth}
				/>
			);
		} else {
			const x = frame.gridOriginX + i * frame.style.fretWidth;
			return (
				<line
					key={`fret-${i}`}
					x1={x}
					y1={frame.gridOriginY}
					x2={x}
					y2={frame.gridOriginY + frame.gridHeight}
					stroke={fretColor}
					strokeWidth={i === 0 ? stringWidth * 2 : stringWidth}
				/>
			);
		}
	});

	// String lines (1..stringCount) using engine mapping
	const stringLines = Array.from({ length: frame.stringCount }, (_, i) => {
		const stringNumber = i + 1;
		const coord = engine.mapStringAxis(stringNumber, frame);

		if (isVertical) {
			return (
				<line
					key={`string-${stringNumber}`}
					x1={coord}
					y1={frame.gridOriginY}
					x2={coord}
					y2={frame.gridOriginY + frame.gridHeight}
					stroke={stringColor}
					strokeWidth={stringWidth}
				/>
			);
		}

		return (
			<line
				key={`string-${stringNumber}`}
				x1={frame.gridOriginX}
				y1={coord}
				x2={frame.gridOriginX + frame.gridWidth}
				y2={coord}
				stroke={stringColor}
				strokeWidth={stringWidth}
			/>
		);
	});

	return (
		<g>
			{fretLines}
			{stringLines}
		</g>
	);
});

Fretboard.displayName = "Fretboard";
