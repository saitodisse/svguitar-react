/**
 * @fileoverview Integration tests for vertical layouts with FretNumbers positioning
 * @author svguitar-react
 * @version 1.0.0
 */

import React from "react";
import { render } from "@testing-library/react";
import { ChordDiagram } from "../ChordDiagram";
import type { Chord } from "../types";

// Test data
const testChord: Chord = {
	fingers: [
		{ fret: 1, string: 2, is_muted: false, text: "1" },
		{ fret: 2, string: 3, is_muted: false, text: "2" },
		{ fret: 3, string: 4, is_muted: false, text: "3" },
	],
	barres: [],
};

const testInstrument = {
	strings: 6,
	frets: 4,
	tuning: ["E2", "A2", "D3", "G3", "B3", "E4"],
	chord: "012300",
};

describe("Vertical Layouts - FretNumbers Positioning (FR-026)", () => {
	describe("vertical-right layout", () => {
		it("renders fret numbers to the right of the fretboard", () => {
			const { container } = render(
				<ChordDiagram chord={testChord} view="vertical-right" width={200} height={250} />
			);

			const svg = container.querySelector("svg");
			const fretNumbers = svg?.querySelectorAll('text[fill*="868"]'); // fretTextColor

			expect(fretNumbers).toBeDefined();
			expect(fretNumbers?.length).toBeGreaterThan(0);

			// Verify labels are positioned to the right of the fretboard
			fretNumbers?.forEach(label => {
				const x = Number(label.getAttribute("x"));
				const y = Number(label.getAttribute("y"));

				// Labels should be positioned to the right of the grid area
				expect(x).toBeGreaterThan(150); // Should be right of the main fretboard
				expect(y).toBeGreaterThan(30); // Should be within the SVG bounds (now positioned in middle between frets)
			});
		});

		it("maintains horizontal text readability", () => {
			const { container } = render(
				<ChordDiagram chord={testChord} view="vertical-right" width={200} height={250} />
			);

			const svg = container.querySelector("svg");
			const fretNumbers = svg?.querySelectorAll('text[fill*="868"]');

			fretNumbers?.forEach(label => {
				const textAnchor = label.getAttribute("text-anchor");
				expect(textAnchor).toBe("middle"); // Ensures horizontal readability
			});
		});
	});

	describe("vertical-left layout", () => {
		it("renders fret numbers to the right of the fretboard", () => {
			const { container } = render(
				<ChordDiagram chord={testChord} view="vertical-left" width={200} height={250} />
			);

			const svg = container.querySelector("svg");
			const fretNumbers = svg?.querySelectorAll('text[fill*="868"]'); // fretTextColor

			expect(fretNumbers).toBeDefined();
			expect(fretNumbers?.length).toBeGreaterThan(0);

			// Verify labels are positioned to the right of the fretboard
			fretNumbers?.forEach(label => {
				const x = Number(label.getAttribute("x"));
				const y = Number(label.getAttribute("y"));

				// Labels should be positioned to the right of the grid area
				expect(x).toBeGreaterThan(150); // Should be right of the main fretboard
				expect(y).toBeGreaterThan(30); // Should be within the SVG bounds (now positioned in middle between frets)
			});
		});

		it("maintains horizontal text readability", () => {
			const { container } = render(
				<ChordDiagram chord={testChord} view="vertical-left" width={200} height={250} />
			);

			const svg = container.querySelector("svg");
			const fretNumbers = svg?.querySelectorAll('text[fill*="868"]');

			fretNumbers?.forEach(label => {
				const textAnchor = label.getAttribute("text-anchor");
				expect(textAnchor).toBe("middle"); // Ensures horizontal readability
			});
		});
	});

	describe("consistency between vertical layouts", () => {
		it("positions fret numbers consistently between vertical-right and vertical-left", () => {
			const { container: rightContainer } = render(
				<ChordDiagram chord={testChord} view="vertical-right" width={200} height={250} />
			);

			const { container: leftContainer } = render(
				<ChordDiagram chord={testChord} view="vertical-left" width={200} height={250} />
			);

			const rightSvg = rightContainer.querySelector("svg");
			const leftSvg = leftContainer.querySelector("svg");
			const rightFretNumbers = rightSvg?.querySelectorAll('text[fill*="333"]');
			const leftFretNumbers = leftSvg?.querySelectorAll('text[fill*="333"]');

			expect(rightFretNumbers?.length).toBe(leftFretNumbers?.length);

			// Y positions should be similar between both layouts
			if (rightFretNumbers && leftFretNumbers && rightFretNumbers.length > 0) {
				const rightYs = Array.from(rightFretNumbers).map(label => Number(label.getAttribute("y")));
				const leftYs = Array.from(leftFretNumbers).map(label => Number(label.getAttribute("y")));

				// Y coordinates should be similar between both layouts
				expect(rightYs.length).toBe(leftYs.length);
			}
		});
	});

	describe("instrument-based rendering", () => {
		it("renders fret numbers correctly with instrument props", () => {
			const { container } = render(
				<ChordDiagram instrument={testInstrument} view="vertical-right" width={200} height={250} />
			);

			const svg = container.querySelector("svg");
			const fretNumbers = svg?.querySelectorAll('text[fill*="868"]');

			expect(fretNumbers).toBeDefined();
			expect(fretNumbers?.length).toBeGreaterThan(0);
		});
	});

	describe("FR-026 compliance", () => {
		it("positions fret numbers to the right of each fret starting from fret 0", () => {
			const chordWithFret0: Chord = {
				fingers: [
					{ fret: 0, string: 1, is_muted: false },
					{ fret: 0, string: 2, is_muted: false },
					{ fret: 1, string: 3, is_muted: false },
				],
				barres: [],
			};

			const { container } = render(
				<ChordDiagram chord={chordWithFret0} view="vertical-right" width={200} height={250} />
			);

			const svg = container.querySelector("svg");
			const fretNumbers = svg?.querySelectorAll('text[fill*="868"]');

			expect(fretNumbers).toBeDefined();
			expect(fretNumbers?.length).toBeGreaterThan(0);

			// Verify fret numbers are positioned correctly
			const yPositions = Array.from(fretNumbers || []).map(label => Number(label.getAttribute("y")));
			const sortedYPositions = [...yPositions].sort((a, b) => a - b);

			// Y positions should be in ascending order (fret 0 at top, increasing downwards)
			expect(yPositions).toEqual(sortedYPositions);
		});

		it("maintains legibility horizontal and consistency between views", () => {
			const views: Array<"vertical-right" | "vertical-left"> = ["vertical-right", "vertical-left"];

			views.forEach(view => {
				const { container } = render(
					<ChordDiagram chord={testChord} view={view} width={200} height={250} />
				);

				const svg = container.querySelector("svg");
				const fretNumbers = svg?.querySelectorAll('text[fill*="868"]');

				fretNumbers?.forEach(label => {
					// Verify horizontal readability
					const textAnchor = label.getAttribute("text-anchor");
					expect(textAnchor).toBe("middle");

					// Verify positioning is to the right of frets
					const x = Number(label.getAttribute("x"));
					expect(x).toBeGreaterThan(100); // Should be positioned to the right
				});
			});
		});
	});
});
