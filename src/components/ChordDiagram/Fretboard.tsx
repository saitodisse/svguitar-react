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
	// nut customization
	nutStrokeWidth: number;
	nutOffsetX: number;
	nutOffsetY: number;
	nutOpacity: number;
	nutColor: string;
}

/**
 * Renders the guitar fretboard (frets and strings)
 */
export const Fretboard: React.FC<FretboardProps> = React.memo(props => {
	const {
		engine,
		frame,
		fretColor,
		stringColor,
		stringWidth,
		nutStrokeWidth,
		nutOffsetX,
		nutOffsetY,
		nutOpacity,
		nutColor,
	} = props;

	const isVertical = engine.id.startsWith("vertical");

	// Calculate absolute nut stroke width
	const absoluteNutStrokeWidth = nutStrokeWidth * frame.style.fretWidth;

	// Calculate nut offsets
	const nutXOffset = nutOffsetX * frame.style.fretWidth;
	const nutYOffset = nutOffsetY * frame.style.fretHeight;

	// Fret boundaries (0..fretCount) as lines
	const fretLines = Array.from({ length: frame.fretCount + 1 }, (_, i) => {
		const isNut = i === 0;

		if (isVertical) {
			const y = frame.gridOriginY + i * frame.style.fretHeight + (isNut ? nutYOffset : 0);
			return (
				<line
					key={`fret-${i}`}
					data-testid={isNut ? "nut-line" : undefined}
					x1={frame.gridOriginX + (isNut ? nutXOffset : 0)}
					y1={y}
					x2={frame.gridOriginX + frame.gridWidth + (isNut ? nutXOffset : 0)}
					y2={y}
					stroke={isNut ? nutColor : fretColor}
					strokeWidth={isNut ? absoluteNutStrokeWidth : stringWidth}
					strokeOpacity={isNut ? nutOpacity : undefined}
				/>
			);
		} else {
			const x = frame.gridOriginX + i * frame.style.fretWidth + (isNut ? nutXOffset : 0);
			return (
				<line
					key={`fret-${i}`}
					data-testid={isNut ? "nut-line" : undefined}
					x1={x}
					y1={frame.gridOriginY + (isNut ? nutYOffset : 0)}
					x2={x}
					y2={frame.gridOriginY + frame.gridHeight + (isNut ? nutYOffset : 0)}
					stroke={isNut ? nutColor : fretColor}
					strokeWidth={isNut ? absoluteNutStrokeWidth : stringWidth}
					strokeOpacity={isNut ? nutOpacity : undefined}
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
