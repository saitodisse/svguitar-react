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

	describe("barreRect", () => {
		it("should calculate barre rectangle correctly in vertical layout", () => {
			const frame = createFrame();
			const barre: import("../../types").Barre = {
				fret: 1,
				fromString: 1,
				toString: 6,
			};

			const rect = verticalRightEngine.barreRect(barre, { frame });

			expect(rect.width).toBeGreaterThan(0);
			expect(rect.height).toBe(frame.style.barresWidth); // In vertical views, barresWidth controls the height/thickness
			expect(rect.rx).toBe(4);
		});

		it("should handle partial barres in vertical layout", () => {
			const frame = createFrame();
			const barre: import("../../types").Barre = {
				fret: 2,
				fromString: 2,
				toString: 5,
			};

			const rect = verticalRightEngine.barreRect(barre, { frame });

			expect(rect.width).toBeGreaterThan(0);
			expect(rect.height).toBe(frame.style.barresWidth); // In vertical views, barresWidth controls the height/thickness
		});
	});

	describe("indicatorPosition", () => {
		it("should position open string indicator above the fretboard", () => {
			const frame = createFrame();
			const pos = verticalRightEngine.indicatorPosition(1, "open", { frame });

			// Should be above the grid (negative Y from origin)
			expect(pos.y).toBeLessThan(frame.gridOriginY);
		});

		it("should position muted string indicator above the fretboard", () => {
			const frame = createFrame();
			const pos = verticalRightEngine.indicatorPosition(1, "muted", { frame });

			// Should be above the grid (negative Y from origin)
			expect(pos.y).toBeLessThan(frame.gridOriginY);
		});

		it("should respect stringIndicatorOffsetX", () => {
			const customOffset = 0.3;
			const frame = createFrame();
			frame.style.stringIndicatorOffsetX = customOffset;

			const pos = verticalRightEngine.indicatorPosition(1, "open", { frame });

			const expectedY = frame.gridOriginY - frame.style.fretHeight * customOffset;
			expect(Math.abs(pos.y - expectedY)).toBeLessThan(0.1);
		});
	});
});
