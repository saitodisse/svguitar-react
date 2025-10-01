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
			frets: 3,
			tuning: ["E2", "A2", "D3", "G3", "B3", "E4"],
			chord: "x32010",
		};
		render(<ChordDiagram instrument={instrument} view="horizontal-left" />);
		const svg = screen.getByTestId("chord-diagram").querySelector("svg");
		expect(svg).toBeInTheDocument();
		const textNodes = Array.from(svg!.querySelectorAll("text"));
		const fretLabels = textNodes.filter(node => node.textContent && /^[0-9]+$/.test(node.textContent));
		expect(fretLabels.map(label => label.textContent)).toEqual(["3", "2", "1"]);
		const fretXs = fretLabels.map(label => Number(label.getAttribute("x")));
		expect(fretXs[0]).toBeGreaterThan(fretXs[1]);
		expect(fretXs[1]).toBeGreaterThan(fretXs[2]);

		const tuningLabels = textNodes.filter(
			node => node.textContent && ["E2", "A2", "D3", "G3", "B3", "E4"].includes(node.textContent)
		);
		expect(tuningLabels).toHaveLength(6);
		const tuningXs = tuningLabels.map(label => Number(label.getAttribute("x")));
		expect(Math.min(...tuningXs)).toBeGreaterThan(Math.max(...fretXs));
	});

	it("should throw error when no data is provided", () => {
		// Suppress console.error output from React for this expected error
		const err = console.error;
		console.error = () => {};
		expect(() => render(<ChordDiagram />)).toThrow(
			new ChordDiagramError("Either `chord` or `instrument` must be provided.", "MISSING_CHORD_DATA")
		);
		console.error = err;
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
				new ChordDiagramError("Invalid characters in fret notation string.", "INVALID_TAB_STRING")
			);
		});
	});

	describe("Validation Functions", () => {
		it("validateFinger should not throw on valid finger", () => {
			expect(() => validateFinger({ fret: 1, string: 2, is_muted: false }, 6)).not.toThrow();
		});

		it("validateFinger should throw on invalid fret", () => {
			expect(() => validateFinger({ fret: -1, string: 2, is_muted: false }, 6)).toThrow(
				new ChordDiagramError("Invalid fret number: -1", "INVALID_FRET")
			);
		});

		it("validateBarre should not throw on valid barre", () => {
			expect(() => validateBarre({ fret: 1, fromString: 1, toString: 6 }, 6)).not.toThrow();
		});

		it("validateBarre should throw on fret 0", () => {
			expect(() => validateBarre({ fret: 0, fromString: 1, toString: 6 }, 6)).toThrow(
				new ChordDiagramError("Barre fret must be greater than 0.", "INVALID_BARRE")
			);
		});

		it("validateInstrument should not throw on valid instrument", () => {
			const inst = { ...DEFAULT_INSTRUMENT, chord: "000000" };
			expect(() => validateInstrument(inst)).not.toThrow();
		});

		it("validateInstrument should throw on tuning mismatch", () => {
			const inst = { ...DEFAULT_INSTRUMENT, tuning: ["E2"], chord: "000000" };
			expect(() => validateInstrument(inst)).toThrow(
				new ChordDiagramError("Tuning array length must match number of strings.", "INVALID_TUNING")
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
});
