/**
 * @fileoverview Layout engines and registry for ChordDiagram component
 * @author svguitar-react
 * @version 1.0.0
 */

import type { LayoutEngine, LayoutFrame, LayoutArgs, ViewId, Finger, Barre } from "./types";

/**
 * Layout registry for managing available layout engines
 */
class LayoutRegistry {
	private engines: Map<ViewId, LayoutEngine> = new Map();

	/**
	 * Register a layout engine
	 */
	register(engine: LayoutEngine): void {
		this.engines.set(engine.id, engine);
	}

	/**
	 * Get a layout engine by view ID
	 */
	get(viewId: ViewId): LayoutEngine | undefined {
		return this.engines.get(viewId);
	}

	/**
	 * Check if a view ID is registered
	 */
	has(viewId: ViewId): boolean {
		return this.engines.has(viewId);
	}

	/**
	 * Get all registered view IDs
	 */
	getViewIds(): ViewId[] {
		return Array.from(this.engines.keys());
	}
}

/**
 * Global layout registry instance
 */
export const layoutRegistry = new LayoutRegistry();

/**
 * Horizontal-right layout engine (default)
 * Standard guitar view with low E string at bottom
 */
const horizontalRightEngine: LayoutEngine = {
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

/**
 * Horizontal-left layout engine
 * Mirrored horizontal view with low E string at top
 */
const horizontalLeftEngine: LayoutEngine = {
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

/**
 * Vertical-right layout engine
 * Rotated view with strings on X-axis and frets on Y-axis
 */
const verticalRightEngine: LayoutEngine = {
	id: "vertical-right",

	mapStringAxis: (stringNumber: number, frame: LayoutFrame): number => {
		return (
			frame.gridOriginX +
			(frame.stringCount - stringNumber) * (frame.gridWidth / (frame.stringCount - 1))
		);
	},

	mapFretAxis: (fret: number, frame: LayoutFrame): number => {
		return frame.gridOriginY + (fret - frame.firstFret + 0.5) * frame.style.fretHeight;
	},

	fingerPosition: (finger: Finger, args: LayoutArgs): { cx: number; cy: number; r: number } => {
		const { frame } = args;
		return {
			cx:
				frame.gridOriginX +
				(frame.stringCount - finger.string) * (frame.gridWidth / (frame.stringCount - 1)),
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
		const fromX = frame.gridOriginX + (frame.stringCount - barre.fromString) * stringSpacing;
		const toX = frame.gridOriginX + (frame.stringCount - barre.toString) * stringSpacing;

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
				(frame.stringCount - stringNumber) * (frame.gridWidth / (frame.stringCount - 1)) -
				frame.style.dotSize,
			y: frame.gridOriginY - frame.style.fretHeight * 0.5,
		};
	},
};

/**
 * Vertical-left layout engine
 * Rotated view with strings on X-axis (inverted) and frets on Y-axis
 */
const verticalLeftEngine: LayoutEngine = {
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

/**
 * Register all built-in layout engines
 */
layoutRegistry.register(horizontalRightEngine);
layoutRegistry.register(horizontalLeftEngine);
layoutRegistry.register(verticalRightEngine);
layoutRegistry.register(verticalLeftEngine);

/**
 * Resolve view ID from props with precedence: layoutEngine > view > default
 */
export function resolveViewId(
	props: { layoutEngine?: LayoutEngine; view?: ViewId },
	defaultView: ViewId = "horizontal-right"
): ViewId {
	if (props.layoutEngine) return props.layoutEngine.id;
	if (props.view) return props.view;
	return defaultView;
}

/**
 * Validate that a view ID exists in the registry
 */
export function validateView(viewId: ViewId): boolean {
	return layoutRegistry.has(viewId);
}

/**
 * Get layout engine for a view ID
 */
export function getLayoutEngine(viewId: ViewId): LayoutEngine | undefined {
	return layoutRegistry.get(viewId);
}
