import { describe, it, expect } from "vitest";

import { verticalLeftEngine } from "../verticalLeft";
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

describe("verticalLeftEngine", () => {
	it("maps strings from left (high) to right (low)", () => {
		const frame = createFrame();
		const positions = Array.from({ length: frame.stringCount }, (_, i) =>
			verticalLeftEngine.mapStringAxis(i + 1, frame)
		);

		for (let i = 1; i < positions.length; i += 1) {
			expect(positions[i]).toBeLessThan(positions[i - 1]);
		}
	});

	it("shares the same fret mapping (growing downward)", () => {
		const frame = createFrame({ firstFret: 0, fretCount: 5 });
		const frets = Array.from({ length: frame.fretCount }, (_, i) =>
			verticalLeftEngine.mapFretAxis(frame.firstFret + i, frame)
		);

		for (let i = 1; i < frets.length; i += 1) {
			expect(frets[i]).toBeGreaterThan(frets[i - 1]);
		}
	});
});
