/**
 * @fileoverview Tests for horizontalLeftLayout engine
 * @author svguitar-react
 * @version 1.0.0
 */

import { describe, it, expect } from "vitest";
import { horizontalLeftEngine } from "../horizontalLeft";
import type { LayoutFrame, Finger, Barre } from "../../types";
import { DEFAULT_CHORD_STYLE } from "../../constants";

const createFrame = (): LayoutFrame => {
	const style = { ...DEFAULT_CHORD_STYLE, fretCount: 4 };
	return {
		width: style.width,
		height: style.height,
		gridOriginX: 50,
		gridOriginY: 60,
		gridWidth: style.fretCount * style.fretWidth,
		gridHeight: (style.stringCount - 1) * style.fretHeight,
		firstFret: 1,
		stringCount: 6,
		fretCount: 4,
		style,
	};
};

describe("horizontalLeftEngine", () => {
	it("should have correct id", () => {
		expect(horizontalLeftEngine.id).toBe("horizontal-left");
	});

	describe("barreRect", () => {
		it("should calculate barre rectangle correctly", () => {
			const frame = createFrame();
			const barre: Barre = {
				fret: 1,
				fromString: 1,
				toString: 6,
			};

			const rect = horizontalLeftEngine.barreRect(barre, { frame });

			expect(rect.width).toBe(frame.style.fretWidth);
			expect(rect.height).toBeGreaterThan(0);
			expect(rect.rx).toBe(4);
		});

		it("should handle partial barres", () => {
			const frame = createFrame();
			const barre: Barre = {
				fret: 2,
				fromString: 2,
				toString: 5,
			};

			const rect = horizontalLeftEngine.barreRect(barre, { frame });

			expect(rect.width).toBe(frame.style.fretWidth);
			expect(rect.height).toBeGreaterThan(0);
		});

		it("should position barre correctly in mirrored layout", () => {
			const frame = createFrame();
			const barre: Barre = {
				fret: 3,
				fromString: 1,
				toString: 6,
			};

			const rect = horizontalLeftEngine.barreRect(barre, { frame });

			// In horizontal-left, X should be from the right side
			expect(rect.x).toBeLessThan(frame.gridOriginX + frame.gridWidth);
		});
	});

	describe("indicatorPosition", () => {
		it("should position open string indicator to the right of fretboard", () => {
			const frame = createFrame();
			const pos = horizontalLeftEngine.indicatorPosition(1, "open", { frame });

			// Should be to the right of the grid
			expect(pos.x).toBeGreaterThan(frame.gridOriginX + frame.gridWidth);
			expect(pos.y).toBeGreaterThanOrEqual(frame.gridOriginY);
		});

		it("should position muted string indicator to the right of fretboard", () => {
			const frame = createFrame();
			const pos = horizontalLeftEngine.indicatorPosition(1, "muted", { frame });

			// Should be to the right of the grid
			expect(pos.x).toBeGreaterThan(frame.gridOriginX + frame.gridWidth);
			expect(pos.y).toBeGreaterThanOrEqual(frame.gridOriginY);
		});

		it("should respect stringIndicatorOffsetX", () => {
			const customOffset = 0.8;
			const frame = createFrame();
			frame.style.stringIndicatorOffsetX = customOffset;

			const pos = horizontalLeftEngine.indicatorPosition(1, "open", { frame });

			const expectedX = frame.gridOriginX + frame.gridWidth + frame.style.fretWidth * customOffset;
			expect(Math.abs(pos.x - expectedX)).toBeLessThan(0.1);
		});
	});
});
