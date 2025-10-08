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

	describe("tuningLabelOffset customization", () => {
		it("applies tuningLabelOffset to horizontal-right layout", () => {
			const customOffset = 0.8;
			const customFrame = createFrame({
				style: { ...DEFAULT_CHORD_STYLE, tuningLabelOffset: customOffset, fretCount: 3 },
			});
			const { container } = render(
				<svg>
					<TuningLabels
						engine={horizontalRightEngine}
						frame={customFrame}
						tuning={["E2", "A2", "D3", "G3", "B3", "E4"]}
					/>
				</svg>
			);

			const labels = Array.from(container.querySelectorAll("text"));
			const firstLabel = labels[0];
			const x = Number(firstLabel.getAttribute("x"));

			// With higher offset, labels should be further to the left (more negative)
			const expectedX = customFrame.gridOriginX - customFrame.style.fretWidth * customOffset;
			expect(Math.abs(x - expectedX)).toBeLessThan(1); // Allow small floating point differences
		});

		it("applies tuningLabelOffset to vertical-right layout", () => {
			const customOffset = 0.3;
			const customFrame = createFrame({
				style: { ...DEFAULT_CHORD_STYLE, tuningLabelOffset: customOffset, fretCount: 3 },
			});
			const { container } = render(
				<svg>
					<TuningLabels
						engine={verticalRightEngine}
						frame={customFrame}
						tuning={["E2", "A2", "D3", "G3", "B3", "E4"]}
					/>
				</svg>
			);

			const labels = Array.from(container.querySelectorAll("text"));
			const firstLabel = labels[0];
			const y = Number(firstLabel.getAttribute("y"));

			// With lower offset, labels should be closer to the grid (less negative Y)
			const expectedY = customFrame.gridOriginY - customFrame.style.fretHeight * customOffset;
			expect(Math.abs(y - expectedY)).toBeLessThan(1);
		});
	});

	describe("tuningLabelFormat customization", () => {
		it('displays full scientific notation with format "scientific"', () => {
			const frame = createFrame({
				style: { ...DEFAULT_CHORD_STYLE, tuningLabelFormat: "scientific", fretCount: 3 },
			});
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
			expect(labels).toHaveLength(6);

			// Verify full scientific notation is displayed
			expect(labels[0].textContent).toBe("E2");
			expect(labels[1].textContent).toBe("A2");
			expect(labels[2].textContent).toBe("D3");
			expect(labels[3].textContent).toBe("G3");
			expect(labels[4].textContent).toBe("B3");
			expect(labels[5].textContent).toBe("E4");
		});

		it('displays only note names with format "note-only"', () => {
			const frame = createFrame({
				style: { ...DEFAULT_CHORD_STYLE, tuningLabelFormat: "note-only", fretCount: 3 },
			});
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
			expect(labels).toHaveLength(6);

			// Verify only note names are displayed (without octave numbers)
			expect(labels[0].textContent).toBe("E");
			expect(labels[1].textContent).toBe("A");
			expect(labels[2].textContent).toBe("D");
			expect(labels[3].textContent).toBe("G");
			expect(labels[4].textContent).toBe("B");
			expect(labels[5].textContent).toBe("E");
		});

		it('handles sharps correctly in "note-only" format', () => {
			const frame = createFrame({
				style: { ...DEFAULT_CHORD_STYLE, tuningLabelFormat: "note-only", fretCount: 3 },
			});
			const { container } = render(
				<svg>
					<TuningLabels
						engine={horizontalRightEngine}
						frame={frame}
						tuning={["C#2", "F#2", "A#3"]}
					/>
				</svg>
			);

			const labels = Array.from(container.querySelectorAll("text"));
			expect(labels[0].textContent).toBe("C#");
			expect(labels[1].textContent).toBe("F#");
			expect(labels[2].textContent).toBe("A#");
		});

		it('handles flats correctly in "note-only" format', () => {
			const frame = createFrame({
				style: { ...DEFAULT_CHORD_STYLE, tuningLabelFormat: "note-only", fretCount: 3 },
			});
			const { container } = render(
				<svg>
					<TuningLabels
						engine={horizontalRightEngine}
						frame={frame}
						tuning={["Db2", "Eb3", "Ab4"]}
					/>
				</svg>
			);

			const labels = Array.from(container.querySelectorAll("text"));
			expect(labels[0].textContent).toBe("Db");
			expect(labels[1].textContent).toBe("Eb");
			expect(labels[2].textContent).toBe("Ab");
		});
	});
});
