import type { LayoutEngine, LayoutFrame, LayoutArgs, Finger, Barre } from "../types";

/**
 * Vertical-left layout engine
 * Rotated view with strings on X-axis (inverted) and frets on Y-axis
 */
export const verticalLeftEngine: LayoutEngine = {
	id: "vertical-left",

	mapStringAxis: (stringNumber: number, frame: LayoutFrame): number => {
		return frame.gridOriginX + (stringNumber - 1) * (frame.gridWidth / (frame.stringCount - 1));
	},

	mapFretAxis: (fret: number, frame: LayoutFrame): number => {
		return frame.gridOriginY + (fret - frame.firstFret + 0.5) * frame.style.fretHeight;
	},

	fingerPosition: (finger: Finger, args: LayoutArgs): { cx: number; cy: number; r: number } => {
		const { frame } = args;
		return {
			cx: frame.gridOriginX + (finger.string - 1) * (frame.gridWidth / (frame.stringCount - 1)),
			cy: frame.gridOriginY + (finger.fret - frame.firstFret + 0.5) * frame.style.fretHeight,
			r: frame.style.dotSize / 2,
		};
	},

	barreRect: (
		barre: Barre,
		args: LayoutArgs
	): { x: number; y: number; width: number; height: number; rx?: number } => {
		const { frame } = args;
		const stringSpacing = frame.gridWidth / (frame.stringCount - 1);
		const fromX = frame.gridOriginX + (barre.fromString - 1) * stringSpacing;
		const toX = frame.gridOriginX + (barre.toString - 1) * stringSpacing;

		return {
			x: Math.min(fromX, toX) - frame.style.barreHeight / 2,
			y: frame.gridOriginY + (barre.fret - frame.firstFret) * frame.style.fretHeight,
			width: Math.abs(toX - fromX) + frame.style.barreHeight,
			height: frame.style.fretHeight,
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
			x:
				frame.gridOriginX +
				(stringNumber - 1) * (frame.gridWidth / (frame.stringCount - 1)) -
				frame.style.dotSize,
			y: frame.gridOriginY - frame.style.fretHeight * 0.5,
		};
	},
};
