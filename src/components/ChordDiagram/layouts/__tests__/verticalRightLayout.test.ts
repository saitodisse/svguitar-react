import { describe, it, expect } from "vitest";

import { verticalRightEngine } from "../verticalRight";
import type { LayoutFrame } from "../../types";
import { DEFAULT_CHORD_STYLE } from "../../constants";

const createFrame = (overrides: Partial<LayoutFrame> = {}): LayoutFrame => {
	const style = { ...DEFAULT_CHORD_STYLE };
	return {
		width: style.width,
		height: style.height,
		gridOriginX: 40,
		gridOriginY: 60,
		gridWidth: (style.stringCount - 1) * style.fretWidth,
		gridHeight: (style.fretCount - 1) * style.fretHeight,
		firstFret: 0,
		stringCount: style.stringCount,
		fretCount: style.fretCount,
		style,
		...overrides,
	};
};

describe("verticalRightEngine", () => {
	it("maps strings from left (low) to right (high)", () => {
		const frame = createFrame();
		const positions = Array.from({ length: frame.stringCount }, (_, i) =>
			verticalRightEngine.mapStringAxis(i + 1, frame)
		);

		// Ensure coordinates increase monotonically left to right
		for (let i = 1; i < positions.length; i += 1) {
			expect(positions[i]).toBeGreaterThan(positions[i - 1]);
		}
	});

	it("maps frets increasing downward (top to bottom)", () => {
		const frame = createFrame({ firstFret: 0, fretCount: 5 });
		const frets = Array.from({ length: frame.fretCount }, (_, i) =>
			verticalRightEngine.mapFretAxis(frame.firstFret + i, frame)
		);

		for (let i = 1; i < frets.length; i += 1) {
			expect(frets[i]).toBeGreaterThan(frets[i - 1]);
		}
	});
});
