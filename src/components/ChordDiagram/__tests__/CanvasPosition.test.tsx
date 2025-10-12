/**
 * @fileoverview Tests for canvas positioning features
 * @author svguitar-react
 * @version 1.0.0
 */

import { describe, it, expect } from "vitest";
import { render } from "@testing-library/react";
import { ChordDiagram } from "../ChordDiagram";
import type { ChordDiagramProps } from "../types";

describe("Canvas Positioning", () => {
	const baseProps: ChordDiagramProps = {
		fingers: [
			{ fret: 1, string: 2, is_muted: false },
			{ fret: 2, string: 3, is_muted: false },
		],
		barres: [{ fret: 1, fromString: 1, toString: 2 }],
	};

	describe("Default canvas position", () => {
		it("should render with default offsets (0, 0)", () => {
			const { container } = render(<ChordDiagram {...baseProps} />);
			const canvasGroup = container.querySelector('g[data-testid="canvas-group"]');

			expect(canvasGroup).toBeTruthy();
			const transform = canvasGroup?.getAttribute("transform");
			expect(transform).toBe("translate(0, 0)");
		});

		it("should not have transform when offsets are zero", () => {
			const { container } = render(<ChordDiagram {...baseProps} canvasOffsetX={0} canvasOffsetY={0} />);
			const canvasGroup = container.querySelector('g[data-testid="canvas-group"]');

			expect(canvasGroup).toBeTruthy();
			const transform = canvasGroup?.getAttribute("transform");
			expect(transform).toBe("translate(0, 0)");
		});
	});

	describe("canvasOffsetX", () => {
		it("should apply positive horizontal offset", () => {
			const { container } = render(<ChordDiagram {...baseProps} canvasOffsetX={20} />);
			const canvasGroup = container.querySelector('g[data-testid="canvas-group"]');

			expect(canvasGroup).toBeTruthy();
			const transform = canvasGroup?.getAttribute("transform");
			expect(transform).toContain("translate(20");
		});

		it("should apply negative horizontal offset", () => {
			const { container } = render(<ChordDiagram {...baseProps} canvasOffsetX={-10} />);
			const canvasGroup = container.querySelector('g[data-testid="canvas-group"]');

			expect(canvasGroup).toBeTruthy();
			const transform = canvasGroup?.getAttribute("transform");
			expect(transform).toContain("translate(-10");
		});

		it("should apply large horizontal offset", () => {
			const { container } = render(<ChordDiagram {...baseProps} canvasOffsetX={100} />);
			const canvasGroup = container.querySelector('g[data-testid="canvas-group"]');

			expect(canvasGroup).toBeTruthy();
			const transform = canvasGroup?.getAttribute("transform");
			expect(transform).toContain("translate(100");
		});
	});

	describe("canvasOffsetY", () => {
		it("should apply positive vertical offset", () => {
			const { container } = render(<ChordDiagram {...baseProps} canvasOffsetY={30} />);
			const canvasGroup = container.querySelector('g[data-testid="canvas-group"]');

			expect(canvasGroup).toBeTruthy();
			const transform = canvasGroup?.getAttribute("transform");
			expect(transform).toContain(", 30)");
		});

		it("should apply negative vertical offset", () => {
			const { container } = render(<ChordDiagram {...baseProps} canvasOffsetY={-15} />);
			const canvasGroup = container.querySelector('g[data-testid="canvas-group"]');

			expect(canvasGroup).toBeTruthy();
			const transform = canvasGroup?.getAttribute("transform");
			expect(transform).toContain(", -15)");
		});

		it("should apply large vertical offset", () => {
			const { container } = render(<ChordDiagram {...baseProps} canvasOffsetY={150} />);
			const canvasGroup = container.querySelector('g[data-testid="canvas-group"]');

			expect(canvasGroup).toBeTruthy();
			const transform = canvasGroup?.getAttribute("transform");
			expect(transform).toContain(", 150)");
		});
	});

	describe("Combined canvas offsets", () => {
		it("should apply both offsets together", () => {
			const { container } = render(
				<ChordDiagram {...baseProps} canvasOffsetX={25} canvasOffsetY={35} />
			);
			const canvasGroup = container.querySelector('g[data-testid="canvas-group"]');

			expect(canvasGroup).toBeTruthy();
			const transform = canvasGroup?.getAttribute("transform");
			expect(transform).toBe("translate(25, 35)");
		});

		it("should handle both negative offsets", () => {
			const { container } = render(
				<ChordDiagram {...baseProps} canvasOffsetX={-20} canvasOffsetY={-30} />
			);
			const canvasGroup = container.querySelector('g[data-testid="canvas-group"]');

			expect(canvasGroup).toBeTruthy();
			const transform = canvasGroup?.getAttribute("transform");
			expect(transform).toBe("translate(-20, -30)");
		});

		it("should handle mixed positive/negative offsets", () => {
			const { container } = render(
				<ChordDiagram {...baseProps} canvasOffsetX={15} canvasOffsetY={-25} />
			);
			const canvasGroup = container.querySelector('g[data-testid="canvas-group"]');

			expect(canvasGroup).toBeTruthy();
			const transform = canvasGroup?.getAttribute("transform");
			expect(transform).toBe("translate(15, -25)");
		});
	});

	describe("Canvas position affects all elements", () => {
		it("should contain fretboard inside canvas group", () => {
			const { container } = render(
				<ChordDiagram {...baseProps} canvasOffsetX={10} canvasOffsetY={10} />
			);
			const canvasGroup = container.querySelector('g[data-testid="canvas-group"]');
			const fretLines = canvasGroup?.querySelectorAll("line");

			expect(canvasGroup).toBeTruthy();
			expect(fretLines && fretLines.length > 0).toBe(true);
		});

		it("should contain finger dots inside canvas group", () => {
			const { container } = render(
				<ChordDiagram {...baseProps} canvasOffsetX={10} canvasOffsetY={10} />
			);
			const canvasGroup = container.querySelector('g[data-testid="canvas-group"]');
			const circles = canvasGroup?.querySelectorAll("circle");

			expect(canvasGroup).toBeTruthy();
			expect(circles && circles.length > 0).toBe(true);
		});

		it("should contain all diagram elements inside canvas group", () => {
			const { container } = render(
				<ChordDiagram
					{...baseProps}
					chord={{
						fingers: [{ fret: 1, string: 2, is_muted: false }],
						barres: [{ fret: 1, fromString: 1, toString: 6 }],
					}}
					canvasOffsetX={15}
					canvasOffsetY={20}
				/>
			);
			const canvasGroup = container.querySelector('g[data-testid="canvas-group"]');

			expect(canvasGroup).toBeTruthy();
			// Should contain lines (fretboard), circles (fingers), and rects (barres)
			const lines = canvasGroup?.querySelectorAll("line");
			const circles = canvasGroup?.querySelectorAll("circle");
			const rects = canvasGroup?.querySelectorAll("rect");

			expect(lines && lines.length > 0).toBe(true);
			expect(circles && circles.length > 0).toBe(true);
			expect(rects && rects.length > 0).toBe(true);
		});
	});

	describe("Canvas position across different views", () => {
		it("should work with horizontal-right view", () => {
			const { container } = render(
				<ChordDiagram {...baseProps} view="horizontal-right" canvasOffsetX={10} canvasOffsetY={10} />
			);
			const canvasGroup = container.querySelector('g[data-testid="canvas-group"]');
			expect(canvasGroup?.getAttribute("transform")).toBe("translate(10, 10)");
		});

		it("should work with horizontal-left view", () => {
			const { container } = render(
				<ChordDiagram {...baseProps} view="horizontal-left" canvasOffsetX={10} canvasOffsetY={10} />
			);
			const canvasGroup = container.querySelector('g[data-testid="canvas-group"]');
			expect(canvasGroup?.getAttribute("transform")).toBe("translate(10, 10)");
		});

		it("should work with vertical-right view", () => {
			const { container } = render(
				<ChordDiagram {...baseProps} view="vertical-right" canvasOffsetX={10} canvasOffsetY={10} />
			);
			const canvasGroup = container.querySelector('g[data-testid="canvas-group"]');
			expect(canvasGroup?.getAttribute("transform")).toBe("translate(10, 10)");
		});

		it("should work with vertical-left view", () => {
			const { container } = render(
				<ChordDiagram {...baseProps} view="vertical-left" canvasOffsetX={10} canvasOffsetY={10} />
			);
			const canvasGroup = container.querySelector('g[data-testid="canvas-group"]');
			expect(canvasGroup?.getAttribute("transform")).toBe("translate(10, 10)");
		});
	});

	describe("Use cases", () => {
		it("should support padding/margin use case", () => {
			// Adding padding around the diagram
			const { container } = render(
				<ChordDiagram {...baseProps} canvasOffsetX={20} canvasOffsetY={20} />
			);
			const canvasGroup = container.querySelector('g[data-testid="canvas-group"]');
			expect(canvasGroup?.getAttribute("transform")).toBe("translate(20, 20)");
		});

		it("should support zoom preparation use case", () => {
			// Offsetting for future zoom functionality
			const { container } = render(
				<ChordDiagram {...baseProps} canvasOffsetX={50} canvasOffsetY={50} />
			);
			const canvasGroup = container.querySelector('g[data-testid="canvas-group"]');
			expect(canvasGroup?.getAttribute("transform")).toBe("translate(50, 50)");
		});

		it("should support layout-specific positioning", () => {
			// Adjusting position for specific layout requirements
			const { container } = render(
				<ChordDiagram {...baseProps} view="vertical-right" canvasOffsetX={30} canvasOffsetY={40} />
			);
			const canvasGroup = container.querySelector('g[data-testid="canvas-group"]');
			expect(canvasGroup?.getAttribute("transform")).toBe("translate(30, 40)");
		});
	});
});
