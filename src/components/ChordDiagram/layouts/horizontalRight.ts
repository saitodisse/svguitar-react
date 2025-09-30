import type { LayoutEngine, LayoutFrame, LayoutArgs, Finger, Barre } from "../types";

/**
 * Horizontal-right layout engine (default)
 * Standard guitar view with low E string at bottom
 */
export const horizontalRightEngine: LayoutEngine = {
	id: "horizontal-right",

	mapStringAxis: (stringNumber: number, frame: LayoutFrame): number => {
		return (
			frame.gridOriginY +
			(frame.stringCount - stringNumber) * (frame.gridHeight / (frame.stringCount - 1))
		);
	},

	mapFretAxis: (fret: number, frame: LayoutFrame): number => {
		return frame.gridOriginX + (fret - frame.firstFret + 0.5) * frame.style.fretWidth;
	},

	fingerPosition: (finger: Finger, args: LayoutArgs): { cx: number; cy: number; r: number } => {
		const { frame } = args;
		return {
			cx: frame.gridOriginX + (finger.fret - frame.firstFret + 0.5) * frame.style.fretWidth,
			cy:
				frame.gridOriginY +
				(frame.stringCount - finger.string) * (frame.gridHeight / (frame.stringCount - 1)),
			r: frame.style.dotSize / 2,
		};
	},

	barreRect: (
		barre: Barre,
		args: LayoutArgs
	): { x: number; y: number; width: number; height: number; rx?: number } => {
		const { frame } = args;
		const stringSpacing = frame.gridHeight / (frame.stringCount - 1);
		const fromY = frame.gridOriginY + (frame.stringCount - barre.fromString) * stringSpacing;
		const toY = frame.gridOriginY + (frame.stringCount - barre.toString) * stringSpacing;

		return {
			x: frame.gridOriginX + (barre.fret - frame.firstFret) * frame.style.fretWidth,
			y: Math.min(fromY, toY) - frame.style.barreHeight / 2,
			width: frame.style.fretWidth,
			height: Math.abs(toY - fromY) + frame.style.barreHeight,
			rx: 4,
		};
	},

	indicatorPosition: (
		stringNumber: number,
		kind: "open" | "muted",
		args: LayoutArgs
	): { x: number; y: number } => {
		const { frame } = args;
		return {
			x: frame.gridOriginX - frame.style.fretWidth * 0.5,
			y:
				frame.gridOriginY +
				(frame.stringCount - stringNumber) * (frame.gridHeight / (frame.stringCount - 1)) -
				frame.style.dotSize,
		};
	},
};
