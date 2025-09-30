import type { LayoutEngine, LayoutFrame, LayoutArgs, Finger, Barre } from "../types";

/**
 * Horizontal-left layout engine
 * Mirrored horizontal view with low E string at top
 */
export const horizontalLeftEngine: LayoutEngine = {
	id: "horizontal-left",

	mapStringAxis: (stringNumber: number, frame: LayoutFrame): number => {
		return frame.gridOriginY + (stringNumber - 1) * (frame.gridHeight / (frame.stringCount - 1));
	},

	mapFretAxis: (fret: number, frame: LayoutFrame): number => {
		return frame.gridOriginX + (fret - frame.firstFret + 0.5) * frame.style.fretWidth;
	},

	fingerPosition: (finger: Finger, args: LayoutArgs): { cx: number; cy: number; r: number } => {
		const { frame } = args;
		return {
			cx: frame.gridOriginX + (finger.fret - frame.firstFret + 0.5) * frame.style.fretWidth,
			cy: frame.gridOriginY + (finger.string - 1) * (frame.gridHeight / (frame.stringCount - 1)),
			r: frame.style.dotSize / 2,
		};
	},

	barreRect: (
		barre: Barre,
		args: LayoutArgs
	): { x: number; y: number; width: number; height: number; rx?: number } => {
		const { frame } = args;
		const stringSpacing = frame.gridHeight / (frame.stringCount - 1);
		const fromY = frame.gridOriginY + (barre.fromString - 1) * stringSpacing;
		const toY = frame.gridOriginY + (barre.toString - 1) * stringSpacing;

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
				(stringNumber - 1) * (frame.gridHeight / (frame.stringCount - 1)) -
				frame.style.dotSize,
		};
	},
};
