import React from "react";
import { render } from "@testing-library/react";

import { TuningLabels } from "./TuningLabels";
import { horizontalLeftEngine } from "./layouts/horizontalLeft";
import { horizontalRightEngine } from "./layouts/horizontalRight";
import { verticalLeftEngine } from "./layouts/verticalLeft";
import { verticalRightEngine } from "./layouts/verticalRight";
import type { LayoutFrame } from "./types";
import { DEFAULT_CHORD_STYLE } from "./constants";

const createFrame = (overrides?: Partial<LayoutFrame>): LayoutFrame => {
	const style = { ...DEFAULT_CHORD_STYLE, fretCount: 3 };
	return {
		width: style.width,
		height: style.height,
		gridOriginX: 40,
		gridOriginY: 60,
		gridWidth: style.fretCount * style.fretWidth,
		gridHeight: (style.stringCount - 1) * style.fretHeight,
		firstFret: 1,
		stringCount: style.stringCount,
		fretCount: style.fretCount,
		style,
		...overrides,
	};
};

describe("TuningLabels", () => {
	it("positions labels to the right of the fretboard when using the horizontal-left layout", () => {
		const frame = createFrame();
		const { container } = render(
			<svg>
				<TuningLabels
					engine={horizontalLeftEngine}
					frame={frame}
					tuning={["E2", "A2", "D3", "G3", "B3", "E4"]}
				/>
			</svg>
		);

		const labels = Array.from(container.querySelectorAll("text"));
		expect(labels).not.toHaveLength(0);

		const rightmostX = Math.max(...labels.map(label => Number(label.getAttribute("x"))));
		expect(rightmostX).toBeGreaterThan(frame.gridOriginX + frame.gridWidth);
	});

	it("keeps labels on the left for the default horizontal-right layout", () => {
		const frame = createFrame();
		const { container } = render(
			<svg>
				<TuningLabels
					engine={horizontalRightEngine}
					frame={frame}
					tuning={["E2", "A2", "D3", "G3", "B3", "E4"]}
				/>
			</svg>
		);

		const labels = Array.from(container.querySelectorAll("text"));
		expect(labels).not.toHaveLength(0);

		const rightmostX = Math.max(...labels.map(label => Number(label.getAttribute("x"))));
		expect(rightmostX).toBeLessThan(frame.gridOriginX);
	});

	it("positions labels to the right of each fret in vertical-right layout", () => {
		const frame = createFrame();
		const { container } = render(
			<svg>
				<TuningLabels
					engine={verticalRightEngine}
					frame={frame}
					tuning={["E2", "A2", "D3", "G3", "B3", "E4"]}
				/>
			</svg>
		);

		const labels = Array.from(container.querySelectorAll("text"));
		expect(labels).toHaveLength(6); // 6 strings

		// In vertical layout, labels should be positioned to the right of the fretboard
		// Each label should be positioned at the string position (X) and above the fretboard (Y)
		labels.forEach((label, index) => {
			const x = Number(label.getAttribute("x"));
			const y = Number(label.getAttribute("y"));

			// X should be within the grid area (string positions)
			expect(x).toBeGreaterThanOrEqual(frame.gridOriginX);
			expect(x).toBeLessThanOrEqual(frame.gridOriginX + frame.gridWidth);

			// Y should be above the fretboard (negative offset from gridOriginY)
			expect(y).toBeLessThan(frame.gridOriginY);
		});
	});

	it("positions labels to the right of each fret in vertical-left layout", () => {
		const frame = createFrame();
		const { container } = render(
			<svg>
				<TuningLabels
					engine={verticalLeftEngine}
					frame={frame}
					tuning={["E2", "A2", "D3", "G3", "B3", "E4"]}
				/>
			</svg>
		);

		const labels = Array.from(container.querySelectorAll("text"));
		expect(labels).toHaveLength(6); // 6 strings

		// In vertical layout, labels should be positioned to the right of the fretboard
		// Each label should be positioned at the string position (X) and above the fretboard (Y)
		labels.forEach((label, index) => {
			const x = Number(label.getAttribute("x"));
			const y = Number(label.getAttribute("y"));

			// X should be within the grid area (string positions)
			expect(x).toBeGreaterThanOrEqual(frame.gridOriginX);
			expect(x).toBeLessThanOrEqual(frame.gridOriginX + frame.gridWidth);

			// Y should be above the fretboard (negative offset from gridOriginY)
			expect(y).toBeLessThan(frame.gridOriginY);
		});
	});

	it("maintains consistent positioning between vertical-right and vertical-left layouts", () => {
		const frame = createFrame();

		const { container: rightContainer } = render(
			<svg>
				<TuningLabels
					engine={verticalRightEngine}
					frame={frame}
					tuning={["E2", "A2", "D3", "G3", "B3", "E4"]}
				/>
			</svg>
		);

		const { container: leftContainer } = render(
			<svg>
				<TuningLabels
					engine={verticalLeftEngine}
					frame={frame}
					tuning={["E2", "A2", "D3", "G3", "B3", "E4"]}
				/>
			</svg>
		);

		const rightLabels = Array.from(rightContainer.querySelectorAll("text"));
		const leftLabels = Array.from(leftContainer.querySelectorAll("text"));

		expect(rightLabels).toHaveLength(leftLabels.length);

		// Both layouts should position labels at the same Y coordinate (above fretboard)
		rightLabels.forEach((rightLabel, index) => {
			const rightY = Number(rightLabel.getAttribute("y"));
			const leftY = Number(leftLabels[index].getAttribute("y"));

			expect(rightY).toBe(leftY);
		});
	});
});
