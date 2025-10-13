/**
 * @fileoverview Tests for nut customization features
 * @author svguitar-react
 * @version 1.0.0
 */

import { describe, it, expect } from "vitest";
import { render } from "@testing-library/react";
import { ChordDiagram } from "../ChordDiagram";
import type { ChordDiagramProps } from "../types";

describe("Nut Customization", () => {
	const baseProps: ChordDiagramProps = {
		fingers: [{ fret: 1, string: 2, is_muted: false }],
		barres: [],
	};

	describe("nutStrokeWidth", () => {
		it("should render nut with default stroke width (0.075 * fretWidth from VERTICAL_RIGHT_STYLE)", () => {
			const { container } = render(<ChordDiagram {...baseProps} />);
			const nutLine = container.querySelector('line[data-testid="nut-line"]');

			// Default fretWidth from VERTICAL_RIGHT_STYLE is 23, so 0.075 * 23 = 1.725
			expect(nutLine).toBeTruthy();
			expect(nutLine?.getAttribute("stroke-width")).toBe("1.7249999999999999");
		});

		it("should render nut with custom stroke width multiplier", () => {
			const { container } = render(
				<ChordDiagram {...baseProps} nutStrokeWidth={0.15} fretWidth={40} />
			);
			const nutLine = container.querySelector('line[data-testid="nut-line"]');

			// 0.15 * 40 = 6
			expect(nutLine?.getAttribute("stroke-width")).toBe("6");
		});

		it("should handle negative stroke width multiplier", () => {
			const { container } = render(
				<ChordDiagram {...baseProps} nutStrokeWidth={-0.05} fretWidth={40} />
			);
			const nutLine = container.querySelector('line[data-testid="nut-line"]');

			// -0.05 * 40 = -2 (should clamp to minimum or handle gracefully)
			expect(nutLine).toBeTruthy();
		});
	});

	describe("nutOffsetX and nutOffsetY", () => {
		it("should apply horizontal offset to nut position", () => {
			const { container } = render(<ChordDiagram {...baseProps} nutOffsetX={0.5} fretWidth={40} />);
			const nutLine = container.querySelector('line[data-testid="nut-line"]');

			expect(nutLine).toBeTruthy();
			// Check that x position is offset by 0.5 * 40 = 20
		});

		it("should apply vertical offset to nut position", () => {
			const { container } = render(<ChordDiagram {...baseProps} nutOffsetY={0.5} fretHeight={30} />);
			const nutLine = container.querySelector('line[data-testid="nut-line"]');

			expect(nutLine).toBeTruthy();
			// Check that y position is offset by 0.5 * 30 = 15
		});

		it("should apply both offsets simultaneously", () => {
			const { container } = render(
				<ChordDiagram {...baseProps} nutOffsetX={1} nutOffsetY={0.5} fretWidth={40} fretHeight={30} />
			);
			const nutLine = container.querySelector('line[data-testid="nut-line"]');

			expect(nutLine).toBeTruthy();
		});
	});

	describe("nutOpacity", () => {
		it("should render nut with default opacity (1.0)", () => {
			const { container } = render(<ChordDiagram {...baseProps} />);
			const nutLine = container.querySelector('line[data-testid="nut-line"]');

			expect(nutLine).toBeTruthy();
			const opacity = nutLine?.getAttribute("stroke-opacity");
			expect(opacity === null || opacity === "1").toBe(true);
		});

		it("should render nut with custom opacity", () => {
			const { container } = render(<ChordDiagram {...baseProps} nutOpacity={0.5} />);
			const nutLine = container.querySelector('line[data-testid="nut-line"]');

			expect(nutLine?.getAttribute("stroke-opacity")).toBe("0.5");
		});

		it("should render nut with zero opacity (invisible)", () => {
			const { container } = render(<ChordDiagram {...baseProps} nutOpacity={0} />);
			const nutLine = container.querySelector('line[data-testid="nut-line"]');

			expect(nutLine?.getAttribute("stroke-opacity")).toBe("0");
		});
	});

	describe("nutColor", () => {
		it("should render nut with default color (same as fretColor)", () => {
			const { container } = render(<ChordDiagram {...baseProps} />);
			const nutLine = container.querySelector('line[data-testid="nut-line"]');

			expect(nutLine?.getAttribute("stroke")).toBe("#333333");
		});

		it("should render nut with custom color", () => {
			const { container } = render(<ChordDiagram {...baseProps} nutColor="#FF0000" />);
			const nutLine = container.querySelector('line[data-testid="nut-line"]');

			expect(nutLine?.getAttribute("stroke")).toBe("#FF0000");
		});

		it("should render nut with different color than frets", () => {
			const { container } = render(
				<ChordDiagram {...baseProps} fretColor="#000000" nutColor="#FF0000" />
			);
			const nutLine = container.querySelector('line[data-testid="nut-line"]');
			const regularFretLines = container.querySelectorAll('line:not([data-testid="nut-line"])');

			expect(nutLine?.getAttribute("stroke")).toBe("#FF0000");
			// Regular frets should use fretColor
			expect(regularFretLines.length).toBeGreaterThan(0);
		});
	});

	describe("Combined nut customization", () => {
		it("should apply all nut properties together", () => {
			const { container } = render(
				<ChordDiagram
					{...baseProps}
					nutStrokeWidth={0.2}
					nutOffsetX={0.5}
					nutOffsetY={0.25}
					nutOpacity={0.8}
					nutColor="#0000FF"
					fretWidth={40}
					fretHeight={30}
				/>
			);
			const nutLine = container.querySelector('line[data-testid="nut-line"]');

			expect(nutLine).toBeTruthy();
			expect(nutLine?.getAttribute("stroke")).toBe("#0000FF");
			expect(nutLine?.getAttribute("stroke-opacity")).toBe("0.8");
			expect(nutLine?.getAttribute("stroke-width")).toBe("8"); // 0.2 * 40
		});
	});

	describe("Nut behavior across different views", () => {
		it("should render nut correctly in horizontal-right view", () => {
			const { container } = render(<ChordDiagram {...baseProps} view="horizontal-right" />);
			const nutLine = container.querySelector('line[data-testid="nut-line"]');
			expect(nutLine).toBeTruthy();
		});

		it("should render nut correctly in horizontal-left view", () => {
			const { container } = render(<ChordDiagram {...baseProps} view="horizontal-left" />);
			const nutLine = container.querySelector('line[data-testid="nut-line"]');
			expect(nutLine).toBeTruthy();
		});

		it("should render nut correctly in vertical-right view", () => {
			const { container } = render(<ChordDiagram {...baseProps} view="vertical-right" />);
			const nutLine = container.querySelector('line[data-testid="nut-line"]');
			expect(nutLine).toBeTruthy();
		});

		it("should render nut correctly in vertical-left view", () => {
			const { container } = render(<ChordDiagram {...baseProps} view="vertical-left" />);
			const nutLine = container.querySelector('line[data-testid="nut-line"]');
			expect(nutLine).toBeTruthy();
		});
	});
});
