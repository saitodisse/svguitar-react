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

	describe("barreRect", () => {
		it("should calculate barre rectangle correctly in vertical-left layout", () => {
			const frame = createFrame();
			const barre: import("../../types").Barre = {
				fret: 1,
				fromString: 1,
				toString: 6,
			};

			const rect = verticalLeftEngine.barreRect(barre, { frame });

			expect(rect.width).toBeGreaterThan(0);
			expect(rect.height).toBe(frame.style.fretHeight);
			expect(rect.rx).toBe(4);
		});

		it("should handle partial barres in vertical-left layout", () => {
			const frame = createFrame();
			const barre: import("../../types").Barre = {
				fret: 2,
				fromString: 2,
				toString: 5,
			};

			const rect = verticalLeftEngine.barreRect(barre, { frame });

			expect(rect.width).toBeGreaterThan(0);
			expect(rect.height).toBe(frame.style.fretHeight);
		});
	});

	describe("indicatorPosition", () => {
		it("should position indicators above the fretboard", () => {
			const frame = createFrame();
			const pos = verticalLeftEngine.indicatorPosition(1, "open", { frame });

			// Should be above the grid (negative Y from origin)
			expect(pos.y).toBeLessThan(frame.gridOriginY);
		});

		it("should respect stringIndicatorOffsetX", () => {
			const customOffset = 0.4;
			const frame = createFrame();
			frame.style.stringIndicatorOffsetX = customOffset;

			const pos = verticalLeftEngine.indicatorPosition(1, "open", { frame });

			const expectedY = frame.gridOriginY - frame.style.fretHeight * customOffset;
			expect(Math.abs(pos.y - expectedY)).toBeLessThan(0.1);
		});
	});
});
