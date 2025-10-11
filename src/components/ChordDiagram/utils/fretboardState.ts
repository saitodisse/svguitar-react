/**
 * @fileoverview Fretboard state utilities
 * @author svguitar-react
 * @version 1.0.0
 */

import type { LayoutEngine, LayoutFrame, FretboardState } from "../types";

/**
 * Gets the deterministic state of the Fretboard component
 * @param frame - Layout frame
 * @param engine - Layout engine
 * @returns Fretboard state object
 */
export function getFretboardState(frame: LayoutFrame, engine: LayoutEngine): FretboardState {
	return {
		frame: {
			width: frame.width,
			height: frame.height,
			gridOriginX: frame.gridOriginX,
			gridOriginY: frame.gridOriginY,
			gridWidth: frame.gridWidth,
			gridHeight: frame.gridHeight,
			firstFret: frame.firstFret,
			stringCount: frame.stringCount,
			fretCount: frame.fretCount,
		},
		engineId: engine.id,
		style: frame.style,
	};
}
