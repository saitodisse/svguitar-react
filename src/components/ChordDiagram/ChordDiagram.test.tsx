/**
 * @fileoverview Tests for the ChordDiagram component
 * @author svguitar-react
 * @version 1.0.0
 */

import React from "react";
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { ChordDiagram } from "./ChordDiagram";
import { parseFretNotation, validateFinger, validateBarre, validateInstrument } from "./utils";
import { ChordDiagramError } from "./types";

describe("ChordDiagram Component", () => {
	describe("Basic Rendering", () => {
		it("should render with chord data", () => {
			const chord = {
				fingers: [{ fret: 1, string: 2, is_muted: false, text: "1" }],
				barres: [],
			};

			render(<ChordDiagram chord={chord} />);

			expect(screen.getByTestId("chord-diagram")).toBeInTheDocument();
		});

		it("should render with instrument data", () => {
			const instrument = {
				tuning: ["E", "A", "D", "G", "B", "E"],
				chord: "x32010",
			};

			render(<ChordDiagram instrument={instrument} />);

			expect(screen.getByTestId("chord-diagram")).toBeInTheDocument();
		});

		it("should throw error when no data is provided", () => {
			expect(() => {
				render(<ChordDiagram />);
			}).toThrow(ChordDiagramError);
		});
	});

	describe("Style Customization", () => {
		it("should apply custom styles", () => {
			const chord = {
				fingers: [{ fret: 1, string: 2, is_muted: false }],
				barres: [],
			};

			const customStyle = {
				width: 300,
				height: 400,
				dotColor: "#FF0000",
			};

			render(<ChordDiagram chord={chord} style={customStyle} />);

			const svg = screen.getByTestId("chord-diagram").querySelector("svg");
			expect(svg).toHaveAttribute("width", "300");
			expect(svg).toHaveAttribute("height", "400");
		});
	});

	describe("Open and Muted Strings", () => {
		it("should render open strings as circles", () => {
			const chord = {
				fingers: [
					{ fret: 0, string: 1, is_muted: false }, // Open string
					{ fret: 1, string: 2, is_muted: false },
				],
				barres: [],
			};

			render(<ChordDiagram chord={chord} />);
			expect(screen.getByTestId("chord-diagram")).toBeInTheDocument();
		});

		it("should render muted strings as X", () => {
			const chord = {
				fingers: [
					{ fret: 0, string: 1, is_muted: true }, // Muted string
					{ fret: 1, string: 2, is_muted: false },
				],
				barres: [],
			};

			render(<ChordDiagram chord={chord} />);
			expect(screen.getByTestId("chord-diagram")).toBeInTheDocument();
		});

		it("should apply custom colors for open and muted strings", () => {
			const chord = {
				fingers: [
					{ fret: 0, string: 1, is_muted: false },
					{ fret: 0, string: 2, is_muted: true },
				],
				barres: [],
			};

			const customStyle = {
				openStringColor: "#00FF00",
				mutedStringColor: "#FF0000",
				openStringSize: 14,
				mutedStringSize: 16,
			};

			render(<ChordDiagram chord={chord} style={customStyle} />);
			expect(screen.getByTestId("chord-diagram")).toBeInTheDocument();
		});
	});
});

describe("parseFretNotation", () => {
	it("should parse simple fret notation", () => {
		const result = parseFretNotation("x32010");

		expect(result.fingers).toEqual([
			{ fret: 0, string: 1, is_muted: true }, // 'x'
			{ fret: 3, string: 2, is_muted: false }, // '3'
			{ fret: 2, string: 3, is_muted: false }, // '2'
			{ fret: 0, string: 4, is_muted: false }, // '0'
			{ fret: 1, string: 5, is_muted: false }, // '1'
			{ fret: 0, string: 6, is_muted: false }, // '0'
		]);
		expect(result.barres).toEqual([]);
	});

	it("should parse fret notation with open strings", () => {
		const result = parseFretNotation("022000");

		expect(result.fingers).toEqual([
			{ fret: 0, string: 1, is_muted: false }, // '0'
			{ fret: 2, string: 2, is_muted: false }, // '2'
			{ fret: 2, string: 3, is_muted: false }, // '2'
			{ fret: 0, string: 4, is_muted: false }, // '0'
			{ fret: 0, string: 5, is_muted: false }, // '0'
			{ fret: 0, string: 6, is_muted: false }, // '0'
		]);
	});

	it("should parse fret notation with high frets", () => {
		const result = parseFretNotation("(10)(12)(10)(10)(10)(10)");

		expect(result.fingers).toEqual([
			{ fret: 10, string: 1, is_muted: false },
			{ fret: 12, string: 2, is_muted: false },
			{ fret: 10, string: 3, is_muted: false },
			{ fret: 10, string: 4, is_muted: false },
			{ fret: 10, string: 5, is_muted: false },
			{ fret: 10, string: 6, is_muted: false },
		]);
	});

	it("should throw error for invalid characters", () => {
		expect(() => {
			parseFretNotation("x32a10");
		}).toThrow(ChordDiagramError);
	});

	it("should throw error for unmatched parentheses", () => {
		expect(() => {
			parseFretNotation("(10(12");
		}).toThrow(ChordDiagramError);
	});
});

describe("validateFinger", () => {
	it("should validate correct finger", () => {
		expect(() => {
			validateFinger({ fret: 1, string: 2, is_muted: false }, 6);
		}).not.toThrow();
	});

	it("should validate open string (fret 0)", () => {
		expect(() => {
			validateFinger({ fret: 0, string: 2, is_muted: false }, 6);
		}).not.toThrow();
	});

	it("should validate muted string (fret 0, is_muted true)", () => {
		expect(() => {
			validateFinger({ fret: 0, string: 2, is_muted: true }, 6);
		}).not.toThrow();
	});

	it("should throw error for negative fret", () => {
		expect(() => {
			validateFinger({ fret: -1, string: 2, is_muted: false }, 6);
		}).toThrow(ChordDiagramError);
	});

	it("should throw error for invalid string", () => {
		expect(() => {
			validateFinger({ fret: 1, string: 7, is_muted: false }, 6);
		}).toThrow(ChordDiagramError);
	});

	it("should throw error for missing is_muted property", () => {
		expect(() => {
			validateFinger({ fret: 1, string: 2, is_muted: undefined as unknown as boolean }, 6);
		}).toThrow(ChordDiagramError);
	});
});

describe("validateBarre", () => {
	it("should validate correct barre", () => {
		expect(() => {
			validateBarre({ fret: 1, fromString: 1, toString: 6 }, 6);
		}).not.toThrow();
	});

	it("should throw error for invalid fret", () => {
		expect(() => {
			validateBarre({ fret: 0, fromString: 1, toString: 6 }, 6);
		}).toThrow(ChordDiagramError);
	});

	it("should throw error for invalid string range", () => {
		expect(() => {
			validateBarre({ fret: 1, fromString: 6, toString: 1 }, 6);
		}).toThrow(ChordDiagramError);
	});
});

describe("validateInstrument", () => {
	it("should validate correct instrument", () => {
		const instrument = {
			strings: 6,
			frets: 4,
			tuning: ["E", "A", "D", "G", "B", "E"],
			chord: "x32010",
		};

		expect(() => {
			validateInstrument(instrument);
		}).not.toThrow();
	});

	it("should throw error for mismatched tuning length", () => {
		const instrument = {
			strings: 6,
			frets: 4,
			tuning: ["E", "A", "D"],
			chord: "x32010",
		};

		expect(() => {
			validateInstrument(instrument);
		}).toThrow(ChordDiagramError);
	});

	it("should throw error for mismatched chord length", () => {
		const instrument = {
			strings: 6,
			frets: 4,
			tuning: ["E", "A", "D", "G", "B", "E"],
			chord: "x320",
		};

		expect(() => {
			validateInstrument(instrument);
		}).toThrow(ChordDiagramError);
	});
});
