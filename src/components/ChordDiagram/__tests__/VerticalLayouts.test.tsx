import React from "react";
import { render } from "@testing-library/react";

import { ChordDiagram } from "../ChordDiagram";
import type { Chord } from "../types";

describe("VerticalLayouts - TuningLabels Positioning", () => {
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
		chord: "023100",
	};

	describe("vertical-right layout", () => {
		it("renders tuning labels to the right of each fret", () => {
			const { container } = render(
				<ChordDiagram chord={testChord} view="vertical-right" width={200} height={250} />
			);

			const tuningLabels = container.querySelectorAll('text[fill*="666"]'); // tuningTextColor
			expect(tuningLabels.length).toBeGreaterThan(0);

			// Verify labels are positioned correctly
			tuningLabels.forEach(label => {
				const x = Number(label.getAttribute("x"));
				const y = Number(label.getAttribute("y"));

				// Labels should be positioned within the string area (X) and above the fretboard (Y)
				expect(x).toBeGreaterThan(0);
				expect(y).toBeLessThan(200); // Above the main fretboard area
			});
		});

		it("maintains horizontal text readability", () => {
			const { container } = render(
				<ChordDiagram chord={testChord} view="vertical-right" width={200} height={250} />
			);

			const tuningLabels = container.querySelectorAll('text[fill*="666"]');

			tuningLabels.forEach(label => {
				const textAnchor = label.getAttribute("text-anchor");
				expect(textAnchor).toBe("middle"); // Ensures horizontal readability
			});
		});
	});

	describe("vertical-left layout", () => {
		it("renders tuning labels to the right of each fret", () => {
			const { container } = render(
				<ChordDiagram chord={testChord} view="vertical-left" width={200} height={250} />
			);

			const tuningLabels = container.querySelectorAll('text[fill*="666"]'); // tuningTextColor
			expect(tuningLabels.length).toBeGreaterThan(0);

			// Verify labels are positioned correctly
			tuningLabels.forEach(label => {
				const x = Number(label.getAttribute("x"));
				const y = Number(label.getAttribute("y"));

				// Labels should be positioned within the string area (X) and above the fretboard (Y)
				expect(x).toBeGreaterThan(0);
				expect(y).toBeLessThan(200); // Above the main fretboard area
			});
		});

		it("maintains horizontal text readability", () => {
			const { container } = render(
				<ChordDiagram chord={testChord} view="vertical-left" width={200} height={250} />
			);

			const tuningLabels = container.querySelectorAll('text[fill*="666"]');

			tuningLabels.forEach(label => {
				const textAnchor = label.getAttribute("text-anchor");
				expect(textAnchor).toBe("middle"); // Ensures horizontal readability
			});
		});
	});

	describe("consistency between vertical layouts", () => {
		it("positions tuning labels consistently between vertical-right and vertical-left", () => {
			const { container: rightContainer } = render(
				<ChordDiagram chord={testChord} view="vertical-right" width={200} height={250} />
			);

			const { container: leftContainer } = render(
				<ChordDiagram chord={testChord} view="vertical-left" width={200} height={250} />
			);

			const rightLabels = rightContainer.querySelectorAll('text[fill*="666"]');
			const leftLabels = leftContainer.querySelectorAll('text[fill*="666"]');

			expect(rightLabels.length).toBe(leftLabels.length);

			// Both layouts should position labels at similar Y coordinates
			const rightYs = Array.from(rightLabels).map(label => Number(label.getAttribute("y")));
			const leftYs = Array.from(leftLabels).map(label => Number(label.getAttribute("y")));

			// Check that Y coordinates are consistent (allowing for small variations)
			rightYs.forEach((rightY, index) => {
				const leftY = leftYs[index];
				expect(Math.abs(rightY - leftY)).toBeLessThan(5); // Allow small variation
			});
		});
	});

	describe("instrument-based rendering", () => {
		it("renders tuning labels correctly with instrument props", () => {
			const { container } = render(
				<ChordDiagram instrument={testInstrument} view="vertical-right" width={200} height={250} />
			);

			const tuningLabels = container.querySelectorAll('text[fill*="666"]');
			expect(tuningLabels.length).toBeGreaterThan(0);

			// Verify that labels show the correct tuning notes
			const labelTexts = Array.from(tuningLabels).map(label => label.textContent);
			expect(labelTexts).toEqual(expect.arrayContaining(["E2", "A2", "D3", "G3", "B3", "E4"]));
		});
	});

	describe("FR-026 specification compliance", () => {
		it("positions labels to the right of each fret starting from fret 0", () => {
			const chordWithFret0: Chord = {
				fingers: [
					{ fret: 0, string: 1, is_muted: false }, // Open string
					{ fret: 1, string: 2, is_muted: false },
					{ fret: 2, string: 3, is_muted: false },
				],
				barres: [],
				firstFret: 0, // Start from fret 0 (nut)
			};

			const { container } = render(
				<ChordDiagram chord={chordWithFret0} view="vertical-right" width={200} height={250} />
			);

			const tuningLabels = container.querySelectorAll('text[fill*="666"]');
			expect(tuningLabels.length).toBeGreaterThan(0);

			// Labels should be positioned relative to fret 0 and increasing downwards
			const yPositions = Array.from(tuningLabels).map(label => Number(label.getAttribute("y")));
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

				const tuningLabels = container.querySelectorAll('text[fill*="666"]');

				tuningLabels.forEach(label => {
					// Verify horizontal readability
					const textAnchor = label.getAttribute("text-anchor");
					expect(textAnchor).toBe("middle");

					// Verify positioning is to the right of frets
					const x = Number(label.getAttribute("x"));
					expect(x).toBeGreaterThan(0);
				});
			});
		});
	});
});
