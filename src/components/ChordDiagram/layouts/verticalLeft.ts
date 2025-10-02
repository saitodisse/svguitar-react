import type { LayoutEngine, LayoutFrame, LayoutArgs, Finger, Barre } from "../types";

/**
 * Vertical-left layout engine
 * Rotated view with strings on X-axis (inverted) and frets on Y-axis
 */
export const verticalLeftEngine: LayoutEngine = {
	id: "vertical-left",

	mapStringAxis: (stringNumber: number, frame: LayoutFrame): number => {
		const spacing = frame.gridWidth / Math.max(frame.stringCount - 1, 1);
		return frame.gridOriginX + (frame.stringCount - stringNumber) * spacing;
	},

	mapFretAxis: (fret: number, frame: LayoutFrame): number => {
		return frame.gridOriginY + frame.gridHeight - (fret - frame.firstFret + 0.5) * frame.style.fretHeight;
	},

	fingerPosition: (finger: Finger, args: LayoutArgs): { cx: number; cy: number; r: number } => {
		const { frame } = args;
		return {
			cx: ((stringNumber: number, frame: LayoutFrame): number => {
				const spacing = frame.gridWidth / Math.max(frame.stringCount - 1, 1);
				return frame.gridOriginX + (frame.stringCount - stringNumber) * spacing;
			})(finger.string, frame),
			cy: ((fret: number, frame: LayoutFrame): number => {
				return frame.gridOriginY + (fret - frame.firstFret + 0.5) * frame.style.fretHeight;
			})(finger.fret, frame),
			r: frame.style.dotSize / 2,
		};
	},

	barreRect: (
		barre: Barre,
		args: LayoutArgs
	): { x: number; y: number; width: number; height: number; rx?: number } => {
		const { frame } = args;
		const fromX = ((stringNumber: number, frame: LayoutFrame): number => {
			const spacing = frame.gridWidth / Math.max(frame.stringCount - 1, 1);
			return frame.gridOriginX + (frame.stringCount - stringNumber) * spacing;
		})(barre.fromString, frame);
		const toX = ((stringNumber: number, frame: LayoutFrame): number => {
			const spacing = frame.gridWidth / Math.max(frame.stringCount - 1, 1);
			return frame.gridOriginX + (frame.stringCount - stringNumber) * spacing;
		})(barre.toString, frame);

		return {
			x: Math.min(fromX, toX) - frame.style.barreHeight / 2,
			y:
				((fret: number, frame: LayoutFrame): number => {
					return (
						frame.gridOriginY +
						frame.gridHeight -
						(fret - frame.firstFret + 0.5) * frame.style.fretHeight
					);
				})(barre.fret, frame) -
				frame.style.fretHeight / 2,
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
			x: ((stringNumber: number, frame: LayoutFrame): number => {
				const spacing = frame.gridWidth / Math.max(frame.stringCount - 1, 1);
				return frame.gridOriginX + (frame.stringCount - stringNumber) * spacing;
			})(stringNumber, frame),
			y: frame.gridOriginY - frame.style.fretHeight * 0.5,
		};
	},
};
