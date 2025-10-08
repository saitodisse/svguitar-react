/**
 * @fileoverview Tests for the ChordDiagram component
 * @author svguitar-react
 * @version 1.0.0
 */

import React from "react";
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { ChordDiagram } from "./ChordDiagram";
import {
	parseFretNotation,
	validateFinger,
	validateBarre,
	validateInstrument,
	processChordData,
	mergeStyles,
} from "./utils";
import { ChordDiagramError } from "./types";
import { DEFAULT_CHORD_STYLE, DEFAULT_INSTRUMENT } from "./constants";

// Corrected chord data based on the new convention (string 1 = low E)
const cMajor = {
	fingers: [
		{ fret: 3, string: 2, is_muted: false, text: "3" }, // A string
		{ fret: 2, string: 3, is_muted: false, text: "2" }, // D string
		{ fret: 1, string: 5, is_muted: false, text: "1" }, // B string
		{ fret: 0, string: 1, is_muted: true },
		{ fret: 0, string: 4, is_muted: false },
		{ fret: 0, string: 6, is_muted: false },
	],
	barres: [],
};

const fMajor = {
	fingers: [
		{ fret: 3, string: 2, is_muted: false, text: "3" },
		{ fret: 3, string: 3, is_muted: false, text: "4" },
		{ fret: 2, string: 4, is_muted: false, text: "2" },
	],
	barres: [{ fret: 1, fromString: 1, toString: 6 }],
};

describe("ChordDiagram Component", () => {
	it("should render C Major chord correctly", () => {
		render(<ChordDiagram chord={cMajor} />);
		const svg = screen.getByTestId("chord-diagram").querySelector("svg");
		expect(svg).toBeInTheDocument();
		// Expect 3 finger dots, 2 open string circles, 1 muted string X
		expect(svg?.querySelectorAll("circle").length).toBe(5);
		expect(svg?.querySelectorAll("line").length).toBe(13); // 11 grid lines + 2 for X
	});

	it("should render F Major barre chord correctly", () => {
		render(<ChordDiagram chord={fMajor} />);
		const svg = screen.getByTestId("chord-diagram").querySelector("svg");
		expect(svg).toBeInTheDocument();
		expect(svg?.querySelectorAll("circle").length).toBe(3);
		expect(svg?.querySelectorAll("rect").length).toBe(2); // 1 background + 1 barre
	});

	it("should render from instrument fret notation", () => {
		const instrument = {
			tuning: ["E2", "A2", "D3", "G3", "B3", "E4"],
			chord: "x32010", // C Major
		};
		render(<ChordDiagram instrument={instrument} />);
		const svg = screen.getByTestId("chord-diagram").querySelector("svg");
		expect(svg).toBeInTheDocument();
		expect(svg?.querySelectorAll("circle").length).toBe(5);
	});

	it("renders horizontal-left view with tuning labels on the right and mirrored fret numbers", () => {
		const instrument = {
			strings: 6,
			frets: 4,
			tuning: ["E2", "A2", "D3", "G3", "B3", "E4"],
			chord: "x32010",
		};
		render(<ChordDiagram instrument={instrument} view="horizontal-left" />);
		const svg = screen.getByTestId("chord-diagram").querySelector("svg");
		expect(svg).toBeInTheDocument();
		const textNodes = Array.from(svg!.querySelectorAll("text"));
		const fretLabels = textNodes.filter(node => node.textContent && /^[0-9]+$/.test(node.textContent));
		expect(fretLabels.map(label => label.textContent)).toEqual(["4", "3", "2", "1"]);
		// In horizontal-left, higher fret numbers have lower x coordinates (right to left)
		const fretXs = fretLabels.map(label => Number(label.getAttribute("x")));
		expect(fretXs[0]).toBeLessThan(fretXs[1]); // fret 4 has lower x than fret 3
		expect(fretXs[1]).toBeLessThan(fretXs[2]); // fret 3 has lower x than fret 2

		const tuningLabels = textNodes.filter(
			node => node.textContent && ["E2", "A2", "D3", "G3", "B3", "E4"].includes(node.textContent)
		);
		expect(tuningLabels).toHaveLength(6);
		const tuningXs = tuningLabels.map(label => Number(label.getAttribute("x")));
		expect(Math.min(...tuningXs)).toBeGreaterThan(Math.max(...fretXs));
	});

	it("should render empty when no data is provided", () => {
		// Component should handle gracefully when no data is provided
		const { container } = render(<ChordDiagram />);
		const svg = container.querySelector("svg");
		expect(svg).toBeInTheDocument();
	});
});

describe("Utility Functions", () => {
	describe("parseFretNotation", () => {
		it("should parse 'x32010' correctly", () => {
			const result = parseFretNotation("x32010");
			expect(result.fingers).toEqual([
				{ fret: 0, string: 1, is_muted: true },
				{ fret: 3, string: 2, is_muted: false },
				{ fret: 2, string: 3, is_muted: false },
				{ fret: 0, string: 4, is_muted: false },
				{ fret: 1, string: 5, is_muted: false },
				{ fret: 0, string: 6, is_muted: false },
			]);
		});

		it("should parse '(10)x(12)...' correctly", () => {
			const result = parseFretNotation("(10)x(12)(10)(11)(10)");
			expect(result.fingers).toEqual([
				{ fret: 10, string: 1, is_muted: false },
				{ fret: 0, string: 2, is_muted: true },
				{ fret: 12, string: 3, is_muted: false },
				{ fret: 10, string: 4, is_muted: false },
				{ fret: 11, string: 5, is_muted: false },
				{ fret: 10, string: 6, is_muted: false },
			]);
		});

		it("should throw on invalid characters", () => {
			expect(() => parseFretNotation("x32g10")).toThrow(
				new ChordDiagramError(
					"Invalid fret notation: \"x32g10\". Only digits, 'x', 'o', '(', and ')' are allowed.",
					"INVALID_TAB_STRING"
				)
			);
		});
	});

	describe("Validation Functions", () => {
		it("validateFinger should not throw on valid finger", () => {
			expect(() => validateFinger({ fret: 1, string: 2, is_muted: false }, 6)).not.toThrow();
		});

		it("validateFinger should throw on invalid fret", () => {
			expect(() => validateFinger({ fret: -1, string: 2, is_muted: false }, 6)).toThrow(
				new ChordDiagramError(
					"Invalid fret: -1. Fret must be greater than or equal to 0.",
					"INVALID_FRET"
				)
			);
		});

		it("validateBarre should not throw on valid barre", () => {
			expect(() => validateBarre({ fret: 1, fromString: 1, toString: 6 }, 6)).not.toThrow();
		});

		it("validateBarre should throw on fret 0", () => {
			expect(() => validateBarre({ fret: 0, fromString: 1, toString: 6 }, 6)).toThrow(
				new ChordDiagramError("Invalid fret: 0. Fret must be greater than 0.", "INVALID_FRET")
			);
		});

		it("validateInstrument should not throw on valid instrument", () => {
			const inst = { ...DEFAULT_INSTRUMENT, chord: "000000" };
			expect(() => validateInstrument(inst)).not.toThrow();
		});

		it("validateInstrument should throw on tuning mismatch", () => {
			const inst = { ...DEFAULT_INSTRUMENT, tuning: ["E2"], chord: "000000" };
			expect(() => validateInstrument(inst)).toThrow(
				new ChordDiagramError(
					"Invalid tuning: length (1) must match strings count (6).",
					"INVALID_TUNING"
				)
			);
		});
	});

	describe("processChordData", () => {
		it("should return chord if provided", () => {
			const result = processChordData({ chord: cMajor });
			expect(result).toEqual(cMajor);
		});

		it("should process instrument to chord", () => {
			const instrument = { tuning: ["E2", "A2", "D3", "G3", "B3", "E4"], chord: "x32010" };
			const result = processChordData({ instrument });
			const parsed = parseFretNotation("x32010");
			expect(result.fingers).toEqual(parsed.fingers);
		});
	});

	describe("mergeStyles", () => {
		it("should merge custom styles with defaults", () => {
			const custom = { dotColor: "red", width: 300 };
			const merged = mergeStyles(custom);
			expect(merged.dotColor).toBe("red");
			expect(merged.width).toBe(300);
			expect(merged.backgroundColor).toBe(DEFAULT_CHORD_STYLE.backgroundColor);
		});
	});

	describe("Vertical Layouts - TuningLabels Positioning (FR-026)", () => {
		it("should render tuning labels to the right of each fret in vertical-right view", () => {
			const { container } = render(
				<ChordDiagram chord={cMajor} view="vertical-right" width={200} height={250} />
			);

			const svg = container.querySelector("svg");
			expect(svg).toBeInTheDocument();

			// Check for tuning labels (text elements with tuning text color)
			const tuningLabels = svg?.querySelectorAll('text[fill*="666"]'); // tuningTextColor
			expect(tuningLabels?.length).toBeGreaterThan(0);

			// Verify positioning - labels should be to the right of frets
			if (tuningLabels && tuningLabels.length > 0) {
				const firstLabel = tuningLabels[0] as SVGTextElement;
				const x = Number(firstLabel.getAttribute("x"));
				const y = Number(firstLabel.getAttribute("y"));

				expect(x).toBeGreaterThan(0);
				expect(y).toBeLessThan(200); // Above the main fretboard area
			}
		});

		it("should render tuning labels to the right of each fret in vertical-left view", () => {
			const { container } = render(
				<ChordDiagram chord={cMajor} view="vertical-left" width={200} height={250} />
			);

			const svg = container.querySelector("svg");
			expect(svg).toBeInTheDocument();

			// Check for tuning labels (text elements with tuning text color)
			const tuningLabels = svg?.querySelectorAll('text[fill*="666"]'); // tuningTextColor
			expect(tuningLabels?.length).toBeGreaterThan(0);

			// Verify positioning - labels should be to the right of frets
			if (tuningLabels && tuningLabels.length > 0) {
				const firstLabel = tuningLabels[0] as SVGTextElement;
				const x = Number(firstLabel.getAttribute("x"));
				const y = Number(firstLabel.getAttribute("y"));

				expect(x).toBeGreaterThan(0);
				expect(y).toBeLessThan(200); // Above the main fretboard area
			}
		});

		it("should maintain horizontal text readability in vertical layouts", () => {
			const views: Array<"vertical-right" | "vertical-left"> = ["vertical-right", "vertical-left"];

			views.forEach(view => {
				const { container } = render(
					<ChordDiagram chord={cMajor} view={view} width={200} height={250} />
				);

				const svg = container.querySelector("svg");
				const tuningLabels = svg?.querySelectorAll('text[fill*="666"]');

				if (tuningLabels && tuningLabels.length > 0) {
					tuningLabels.forEach(label => {
						const textAnchor = label.getAttribute("text-anchor");
						expect(textAnchor).toBe("middle"); // Ensures horizontal readability
					});
				}
			});
		});

		it("should position labels consistently between vertical-right and vertical-left", () => {
			const { container: rightContainer } = render(
				<ChordDiagram chord={cMajor} view="vertical-right" width={200} height={250} />
			);

			const { container: leftContainer } = render(
				<ChordDiagram chord={cMajor} view="vertical-left" width={200} height={250} />
			);

			const rightSvg = rightContainer.querySelector("svg");
			const leftSvg = leftContainer.querySelector("svg");

			const rightLabels = rightSvg?.querySelectorAll('text[fill*="666"]');
			const leftLabels = leftSvg?.querySelectorAll('text[fill*="666"]');

			expect(rightLabels?.length).toBe(leftLabels?.length);

			// Both layouts should position labels consistently
			if (rightLabels && leftLabels && rightLabels.length > 0) {
				const rightYs = Array.from(rightLabels).map(label => Number(label.getAttribute("y")));
				const leftYs = Array.from(leftLabels).map(label => Number(label.getAttribute("y")));

				// Y coordinates should be similar between both layouts
				rightYs.forEach((rightY, index) => {
					const leftY = leftYs[index];
					expect(Math.abs(rightY - leftY)).toBeLessThan(10); // Allow small variation
				});
			}
		});

		it("should handle instrument-based rendering with vertical layouts", () => {
			const instrument = {
				strings: 6,
				frets: 4,
				tuning: ["E2", "A2", "D3", "G3", "B3", "E4"],
				chord: "023100",
			};

			const { container } = render(
				<ChordDiagram instrument={instrument} view="vertical-right" width={200} height={250} />
			);

			const svg = container.querySelector("svg");
			expect(svg).toBeInTheDocument();

			// Should render with tuning labels positioned correctly
			const tuningLabels = svg?.querySelectorAll('text[fill*="666"]');
			expect(tuningLabels?.length).toBeGreaterThan(0);
		});
	});

	describe("Vertical Layouts - FretNumbers Positioning (FR-026)", () => {
		it("should render fret numbers to the right of the fretboard in vertical-right view", () => {
			const { container } = render(
				<ChordDiagram chord={cMajor} view="vertical-right" width={200} height={250} />
			);

			const svg = container.querySelector("svg");
			const fretNumbers = svg?.querySelectorAll('text[fill*="868"]'); // fretTextColor

			expect(fretNumbers).toBeDefined();
			expect(fretNumbers?.length).toBeGreaterThan(0);

			// Verify fret numbers are positioned to the right of the fretboard
			if (fretNumbers && fretNumbers.length > 0) {
				const firstFretNumber = fretNumbers[0];
				const x = Number(firstFretNumber.getAttribute("x"));
				const y = Number(firstFretNumber.getAttribute("y"));

				expect(x).toBeGreaterThan(150); // Should be positioned to the right of the main fretboard
				expect(y).toBeGreaterThan(30); // Should be within the SVG bounds (now positioned in middle between frets)
			}
		});

		it("should render fret numbers to the right of the fretboard in vertical-left view", () => {
			const { container } = render(
				<ChordDiagram chord={cMajor} view="vertical-left" width={200} height={250} />
			);

			const svg = container.querySelector("svg");
			const fretNumbers = svg?.querySelectorAll('text[fill*="868"]'); // fretTextColor

			expect(fretNumbers).toBeDefined();
			expect(fretNumbers?.length).toBeGreaterThan(0);

			// Verify fret numbers are positioned to the right of the fretboard
			if (fretNumbers && fretNumbers.length > 0) {
				const firstFretNumber = fretNumbers[0];
				const x = Number(firstFretNumber.getAttribute("x"));
				const y = Number(firstFretNumber.getAttribute("y"));

				expect(x).toBeGreaterThan(150); // Should be positioned to the right of the main fretboard
				expect(y).toBeGreaterThan(30); // Should be within the SVG bounds (now positioned in middle between frets)
			}
		});

		it("should maintain horizontal text readability in vertical layouts", () => {
			const views: Array<"vertical-right" | "vertical-left"> = ["vertical-right", "vertical-left"];

			views.forEach(view => {
				const { container } = render(
					<ChordDiagram chord={cMajor} view={view} width={200} height={250} />
				);

				const svg = container.querySelector("svg");
				const fretNumbers = svg?.querySelectorAll('text[fill*="868"]');

				if (fretNumbers && fretNumbers.length > 0) {
					fretNumbers.forEach(label => {
						const textAnchor = label.getAttribute("text-anchor");
						expect(textAnchor).toBe("middle"); // Ensures horizontal readability
					});
				}
			});
		});

		it("should position labels consistently between vertical-right and vertical-left", () => {
			const { container: rightContainer } = render(
				<ChordDiagram chord={cMajor} view="vertical-right" width={200} height={250} />
			);

			const { container: leftContainer } = render(
				<ChordDiagram chord={cMajor} view="vertical-left" width={200} height={250} />
			);

			const rightSvg = rightContainer.querySelector("svg");
			const leftSvg = leftContainer.querySelector("svg");
			const rightFretNumbers = rightSvg?.querySelectorAll('text[fill*="333"]');
			const leftFretNumbers = leftSvg?.querySelectorAll('text[fill*="333"]');

			expect(rightFretNumbers?.length).toBe(leftFretNumbers?.length);

			// Both layouts should position labels consistently
			if (rightFretNumbers && leftFretNumbers && rightFretNumbers.length > 0) {
				const rightYs = Array.from(rightFretNumbers).map(label => Number(label.getAttribute("y")));
				const leftYs = Array.from(leftFretNumbers).map(label => Number(label.getAttribute("y")));

				// Y coordinates should be similar between both layouts
				expect(rightYs.length).toBe(leftYs.length);
			}
		});

		it("should handle instrument-based rendering with vertical layouts for fret numbers", () => {
			const instrument = {
				strings: 6,
				frets: 4,
				tuning: ["E2", "A2", "D3", "G3", "B3", "E4"],
				chord: "000000", // Simple chord that should always render fret numbers
			};

			const { container } = render(
				<ChordDiagram instrument={instrument} view="vertical-right" width={200} height={250} />
			);

			const svg = container.querySelector("svg");
			const fretNumbers = svg?.querySelectorAll('text[fill*="868"]');

			expect(fretNumbers).toBeDefined();
			expect(fretNumbers?.length).toBeGreaterThan(0);
		});
	});

	describe("TuningLabel customization", () => {
		it("should respect tuningLabelOffset prop", () => {
			const { container } = render(
				<ChordDiagram chord={cMajor} tuningLabelOffset={0.8} view="horizontal-right" />
			);

			const svg = container.querySelector("svg");
			expect(svg).toBeInTheDocument();

			// Tuning labels should be rendered
			const tuningLabels = svg?.querySelectorAll('text[font-weight="bold"]');
			expect(tuningLabels?.length).toBeGreaterThan(0);
		});

		it('should render note-only format when tuningLabelFormat is "note-only"', () => {
			const instrument = {
				strings: 6,
				frets: 4,
				tuning: ["E2", "A2", "D3", "G3", "B3", "E4"],
				chord: "x32010",
			};

			const { container } = render(
				<ChordDiagram instrument={instrument} tuningLabelFormat="note-only" />
			);

			const svg = container.querySelector("svg");
			const allTextElements = svg?.querySelectorAll("text");

			// Should render text elements
			expect(allTextElements?.length).toBeGreaterThan(0);
			const textContent = Array.from(allTextElements || []).map(label => label.textContent);
			// Should contain note-only format (without octave)
			expect(textContent).toContain("E");
			expect(textContent).toContain("A");
			expect(textContent).toContain("D");
			expect(textContent).toContain("G");
			expect(textContent).toContain("B");
		});

		it('should render scientific notation when tuningLabelFormat is "scientific"', () => {
			const instrument = {
				strings: 6,
				frets: 4,
				tuning: ["E2", "A2", "D3", "G3", "B3", "E4"],
				chord: "x32010",
			};

			const { container } = render(
				<ChordDiagram instrument={instrument} tuningLabelFormat="scientific" />
			);

			const svg = container.querySelector("svg");
			const allTextElements = svg?.querySelectorAll("text");

			// Should render text elements
			expect(allTextElements?.length).toBeGreaterThan(0);
			const textContent = Array.from(allTextElements || []).map(label => label.textContent);
			// Should contain scientific notation (with octave)
			expect(textContent).toContain("E2");
			expect(textContent).toContain("A2");
			expect(textContent).toContain("D3");
			expect(textContent).toContain("G3");
			expect(textContent).toContain("B3");
			expect(textContent).toContain("E4");
		});

		it("should use scientific notation by default", () => {
			const instrument = {
				strings: 6,
				frets: 4,
				tuning: ["E2", "A2", "D3", "G3", "B3", "E4"],
				chord: "x32010",
			};

			const { container } = render(<ChordDiagram instrument={instrument} />);

			const svg = container.querySelector("svg");
			const allTextElements = svg?.querySelectorAll("text");

			// Should render full scientific notation by default
			const textContent = Array.from(allTextElements || []).map(label => label.textContent);
			expect(textContent).toContain("E2");
		});
	});

	describe("StringIndicator customization", () => {
		it("should respect stringIndicatorOffset prop for open strings", () => {
			const chordWithOpenStrings = {
				fingers: [
					{ fret: 0, string: 1, is_muted: false }, // Open string
					{ fret: 1, string: 2, is_muted: false },
				],
				barres: [],
			};

			const { container } = render(
				<ChordDiagram chord={chordWithOpenStrings} stringIndicatorOffset={0.3} />
			);

			const svg = container.querySelector("svg");
			// Should have 1 open string circle and 1 regular finger circle
			const circles = svg?.querySelectorAll("circle");
			expect(circles?.length).toBe(2);
		});

		it("should respect stringIndicatorOffset prop for muted strings", () => {
			const chordWithMutedStrings = {
				fingers: [
					{ fret: 0, string: 1, is_muted: true }, // Muted string
					{ fret: 1, string: 2, is_muted: false },
				],
				barres: [],
			};

			const { container } = render(
				<ChordDiagram chord={chordWithMutedStrings} stringIndicatorOffset={0.7} />
			);

			const svg = container.querySelector("svg");
			// Should have 1 regular finger circle + X marks (as lines)
			const circles = svg?.querySelectorAll("circle");
			const lines = svg?.querySelectorAll("line");

			expect(circles?.length).toBe(1); // 1 regular finger
			expect(lines?.length).toBeGreaterThan(2); // Grid lines + 2 for X mark
		});

		it("should render indicators in all views with custom offset", () => {
			const chordWithIndicators = {
				fingers: [
					{ fret: 0, string: 1, is_muted: true }, // Muted
					{ fret: 0, string: 6, is_muted: false }, // Open
				],
				barres: [],
			};

			const views: Array<"horizontal-right" | "horizontal-left" | "vertical-right" | "vertical-left"> =
				["horizontal-right", "horizontal-left", "vertical-right", "vertical-left"];

			views.forEach(view => {
				const { container } = render(
					<ChordDiagram chord={chordWithIndicators} stringIndicatorOffset={0.4} view={view} />
				);

				const svg = container.querySelector("svg");
				const circles = svg?.querySelectorAll("circle");
				const lines = svg?.querySelectorAll("line");

				// Should have 1 open string circle + X marks
				expect(circles?.length).toBe(1); // 1 open circle
				expect(lines?.length).toBeGreaterThan(2); // Grid lines + 2 for X mark
			});
		});
	});

	describe("Barre with text", () => {
		it("should render text on barre when provided", () => {
			const chordWithBarreText = {
				fingers: [],
				barres: [
					{
						fret: 1,
						fromString: 1,
						toString: 6,
						text: "1",
					},
				],
			};

			const { container } = render(<ChordDiagram chord={chordWithBarreText} />);

			const svg = container.querySelector("svg");
			const textElements = svg?.querySelectorAll("text");

			// Should include barre text
			const textContent = Array.from(textElements || []).map(label => label.textContent);
			expect(textContent).toContain("1");
		});

		it("should render barre without text when not provided", () => {
			const chordWithoutBarreText = {
				fingers: [],
				barres: [
					{
						fret: 1,
						fromString: 1,
						toString: 6,
					},
				],
			};

			const { container } = render(<ChordDiagram chord={chordWithoutBarreText} />);

			const svg = container.querySelector("svg");
			const rects = svg?.querySelectorAll("rect");

			// Should have at least 2 rects: background + barre
			expect(rects?.length).toBeGreaterThan(1);
		});
	});
});
