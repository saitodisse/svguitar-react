/**
 * @fileoverview Tests for FretNumbers component
 * @author svguitar-react
 * @version 1.0.0
 */

import React from "react";
import { render } from "@testing-library/react";
import { FretNumbers } from "../FretNumbers";
import { verticalRightEngine } from "../layouts/verticalRight";
import { verticalLeftEngine } from "../layouts/verticalLeft";
import { horizontalRightEngine } from "../layouts/horizontalRight";
import type { LayoutFrame, ChordStyle } from "../types";

// Mock data for testing
const createMockFrame = (overrides: Partial<LayoutFrame> = {}): LayoutFrame => ({
	width: 200,
	height: 250,
	gridOriginX: 50,
	gridOriginY: 100,
	gridWidth: 150,
	gridHeight: 120,
	firstFret: 0,
	stringCount: 6,
	fretCount: 4,
	style: createMockStyle(),
	...overrides,
});

const createMockStyle = (overrides: Partial<ChordStyle> = {}): ChordStyle => ({
	width: 200,
	height: 250,
	fretCount: 4,
	stringCount: 6,
	fretWidth: 40,
	fretHeight: 30,
	stringWidth: 2,
	dotSize: 12,
	barreHeight: 8,
	backgroundColor: "#ffffff",
	fretColor: "#333333",
	stringColor: "#666666",
	dotColor: "#2196F3",
	dotTextColor: "#ffffff",
	barreColor: "#2196F3",
	fretTextColor: "#333333",
	tuningTextColor: "#666666",
	openStringColor: "#2196F3",
	mutedStringColor: "#DC143C",
	fontFamily: "Arial, sans-serif",
	dotTextSize: 10,
	fretTextSize: 12,
	tuningTextSize: 14,
	...overrides,
});

describe("FretNumbers", () => {
	it("renders fret numbers in horizontal-right layout", () => {
		const frame = createMockFrame();
		const { container } = render(<FretNumbers engine={horizontalRightEngine} frame={frame} />);

		const fretNumbers = container.querySelectorAll("text");
		expect(fretNumbers).toHaveLength(4); // fretCount = 4

		// Check that fret numbers are rendered
		const fretTexts = Array.from(fretNumbers).map(el => el.textContent);
		expect(fretTexts).toEqual(["0", "1", "2", "3"]);
	});

	it("positions fret numbers to the right of the fretboard in vertical-right layout", () => {
		const frame = createMockFrame();
		const { container } = render(<FretNumbers engine={verticalRightEngine} frame={frame} />);

		const fretNumbers = container.querySelectorAll("text");

		// Verify that fret numbers are positioned to the right of the fretboard
		fretNumbers.forEach(fretNumber => {
			const x = Number(fretNumber.getAttribute("x"));
			const y = Number(fretNumber.getAttribute("y"));

			// X should be positioned to the right of the grid area
			expect(x).toBeGreaterThan(frame.gridOriginX + frame.gridWidth);
			// Y should be aligned with each fret
			expect(y).toBeLessThan(frame.gridOriginY + frame.gridHeight);
		});
	});

	it("positions fret numbers to the right of the fretboard in vertical-left layout", () => {
		const frame = createMockFrame();
		const { container } = render(<FretNumbers engine={verticalLeftEngine} frame={frame} />);

		const fretNumbers = container.querySelectorAll("text");

		// Verify that fret numbers are positioned to the right of the fretboard
		fretNumbers.forEach(fretNumber => {
			const x = Number(fretNumber.getAttribute("x"));
			const y = Number(fretNumber.getAttribute("y"));

			// X should be positioned to the right of the grid area
			expect(x).toBeGreaterThan(frame.gridOriginX + frame.gridWidth);
			// Y should be aligned with each fret
			expect(y).toBeLessThan(frame.gridOriginY + frame.gridHeight);
		});
	});

	it("maintains consistent positioning between vertical-right and vertical-left layouts", () => {
		const frame = createMockFrame();

		const { container: rightContainer } = render(
			<FretNumbers engine={verticalRightEngine} frame={frame} />
		);
		const { container: leftContainer } = render(
			<FretNumbers engine={verticalLeftEngine} frame={frame} />
		);

		const rightFretNumbers = rightContainer.querySelectorAll("text");
		const leftFretNumbers = leftContainer.querySelectorAll("text");

		expect(rightFretNumbers).toHaveLength(leftFretNumbers.length);

		// Y positions should be consistent between both layouts
		const rightYs = Array.from(rightFretNumbers).map(el => Number(el.getAttribute("y")));
		const leftYs = Array.from(leftFretNumbers).map(el => Number(el.getAttribute("y")));

		expect(rightYs).toEqual(leftYs);
	});

	it("renders fret numbers with correct styling", () => {
		const frame = createMockFrame();
		const { container } = render(<FretNumbers engine={verticalRightEngine} frame={frame} />);

		const fretNumbers = container.querySelectorAll("text");

		fretNumbers.forEach(fretNumber => {
			expect(fretNumber.getAttribute("fill")).toBe(frame.style.fretTextColor);
			expect(fretNumber.getAttribute("font-size")).toBe(frame.style.fretTextSize.toString());
			expect(fretNumber.getAttribute("font-family")).toBe(frame.style.fontFamily);
			expect(fretNumber.getAttribute("font-weight")).toBe("bold");
			expect(fretNumber.getAttribute("text-anchor")).toBe("middle");
		});
	});

	it("handles different fret counts correctly", () => {
		const frame = createMockFrame({ fretCount: 6 });
		const { container } = render(<FretNumbers engine={verticalRightEngine} frame={frame} />);

		const fretNumbers = container.querySelectorAll("text");
		expect(fretNumbers).toHaveLength(5); // fretCount = 6, but fret 0 (nut) is not displayed in vertical layouts

		const fretTexts = Array.from(fretNumbers).map(el => el.textContent);
		expect(fretTexts).toEqual(["1", "2", "3", "4", "5"]); // No fret 0 in vertical layouts
	});

	it("handles high position chords (firstFret > 0)", () => {
		const frame = createMockFrame({ firstFret: 5, fretCount: 3 });
		const { container } = render(<FretNumbers engine={verticalRightEngine} frame={frame} />);

		const fretNumbers = container.querySelectorAll("text");
		expect(fretNumbers).toHaveLength(3);

		const fretTexts = Array.from(fretNumbers).map(el => el.textContent);
		expect(fretTexts).toEqual(["5", "6", "7"]);
	});
});
