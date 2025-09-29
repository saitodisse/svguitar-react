/**
 * @fileoverview Storybook stories for the ChordDiagram component
 * @author svguitar-react
 * @version 1.0.0
 */

import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, within } from "storybook/test";
import { ChordDiagram } from "../components/ChordDiagram/ChordDiagram";
import type { ChordDiagramProps } from "../components/ChordDiagram/types";
import { DEFAULT_CHORD_STYLE } from "../components/ChordDiagram/constants";

const meta: Meta<typeof ChordDiagram> = {
	title: "Components/ChordDiagram",
	component: ChordDiagram,
	parameters: {
		layout: "centered",
		docs: {
			description: {
				component: "A React component for rendering guitar chord diagrams in SVG format.",
			},
		},
	},
	argTypes: {
		// Layout
		view: {
			control: { type: "radio" },
			options: ["horizontal-right", "horizontal-left", "vertical-right", "vertical-left"],
			description: "Predefined view for layout",
			table: { category: "Layout", defaultValue: { summary: "horizontal-right" } },
		},

		// Dimensions
		width: {
			control: { type: "range", min: 0, max: 1000 },
			description: "Total width of the SVG",
			table: { category: "Dimensions", defaultValue: { summary: "200", detail: "px" } },
		},
		height: {
			control: { type: "range", min: 0, max: 1000 },
			description: "Total height of the SVG",
			table: { category: "Dimensions", defaultValue: { summary: "250" } },
		},
		fretCount: {
			control: { type: "range", min: 0, max: 18 },
			description: "Number of frets to render",
			table: { category: "Dimensions", defaultValue: { summary: "4" } },
		},
		stringCount: {
			control: { type: "range", min: 0, max: 12 },
			description: "Number of strings",
			table: { category: "Dimensions", defaultValue: { summary: "6" } },
		},
		fretWidth: {
			control: { type: "range", min: 0, max: 100 },
			description: "Width of each fret space",
			table: { category: "Dimensions", defaultValue: { summary: "40" } },
		},
		fretHeight: {
			control: { type: "range", min: 0, max: 100 },
			description: "Height of each fret space",
			table: { category: "Dimensions", defaultValue: { summary: "30" } },
		},
		stringWidth: {
			control: { type: "range", min: 0, max: 10 },
			description: "Width of string lines",
			table: { category: "Dimensions", defaultValue: { summary: "2" } },
		},
		dotSize: {
			control: { type: "range", min: 0, max: 20 },
			description: "Size of finger dots",
			table: { category: "Dimensions", defaultValue: { summary: "12" } },
		},
		barreHeight: {
			control: { type: "range", min: 0, max: 28 },
			description: "Height of barre rectangles",
			table: { category: "Dimensions", defaultValue: { summary: "8" } },
		},

		// Colors
		backgroundColor: {
			control: "color",
			description: "Background color",
			table: { category: "Colors", defaultValue: { summary: "#ffffff" } },
		},
		fretColor: {
			control: "color",
			description: "Fret line color",
			table: { category: "Colors", defaultValue: { summary: "#333333" } },
		},
		stringColor: {
			control: "color",
			description: "String line color",
			table: { category: "Colors", defaultValue: { summary: "#666666" } },
		},
		dotColor: {
			control: "color",
			description: "Finger dot color",
			table: { category: "Colors", defaultValue: { summary: "#2196F3" } },
		},
		dotTextColor: {
			control: "color",
			description: "Finger dot text color",
			table: { category: "Colors", defaultValue: { summary: "#ffffff" } },
		},
		barreColor: {
			control: "color",
			description: "Barre color",
			table: { category: "Colors", defaultValue: { summary: "#2196F3" } },
		},
		fretTextColor: {
			control: "color",
			description: "Fret number text color",
			table: { category: "Colors", defaultValue: { summary: "#333333" } },
		},
		tuningTextColor: {
			control: "color",
			description: "Tuning text color",
			table: { category: "Colors", defaultValue: { summary: "#666666" } },
		},
		openStringColor: {
			control: "color",
			description: "Open string indicator color",
			table: { category: "Colors", defaultValue: { summary: "#2196F3" } },
		},
		mutedStringColor: {
			control: "color",
			description: "Muted string indicator color",
			table: { category: "Colors", defaultValue: { summary: "#DC143C" } },
		},

		// Fonts
		fontFamily: {
			control: "select",
			description: "Font family",
			table: { category: "Fonts", defaultValue: { summary: "Arial, sans-serif" } },
			options: [
				"Arial, sans-serif",
				"monospace",
				"sans-serif",
				"serif",
				"Verdana, sans-serif",
				"Roboto, sans-serif",
				"Open Sans, sans-serif",
				"Poppins, sans-serif",
				"Montserrat, sans-serif",
				"Lato, sans-serif",
				"Noto Sans, sans-serif",
				"Ubuntu, sans-serif",
				"Inter, sans-serif",
			],
		},
		dotTextSize: {
			control: { type: "range", min: 0, max: 100 },
			description: "Finger dot text size",
			table: { category: "Fonts", defaultValue: { summary: "10" } },
		},
		fretTextSize: {
			control: { type: "range", min: 0, max: 100 },
			description: "Fret number text size",
			table: { category: "Fonts", defaultValue: { summary: "12" } },
		},
		tuningTextSize: {
			control: { type: "range", min: 0, max: 100 },
			description: "Tuning text size",
			table: { category: "Fonts", defaultValue: { summary: "14" } },
		},
	},
	tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof meta>;

// Basic chord examples
const cMajor: ChordDiagramProps = {
	chord: {
		// Fret notation: x32010
		fingers: [
			{ fret: 3, string: 2, is_muted: false, text: "3" },
			{ fret: 2, string: 3, is_muted: false, text: "2" },
			{ fret: 1, string: 5, is_muted: false, text: "1" },
		],
		barres: [],
	},
};

const fMajor: ChordDiagramProps = {
	chord: {
		// Fret notation: 133211
		fingers: [
			{ fret: 3, string: 2, is_muted: false, text: "3" },
			{ fret: 3, string: 3, is_muted: false, text: "4" },
			{ fret: 2, string: 4, is_muted: false, text: "2" },
		],
		barres: [{ fret: 1, fromString: 1, toString: 6 }],
	},
};

const gMajorInstrument: ChordDiagramProps = {
	instrument: {
		tuning: ["E2", "A2", "D3", "G3", "B3", "E4"],
		chord: "320003",
	},
};

const customStyleChord = {
	// A minor: x02210
	fingers: [
		{ fret: 2, string: 3, is_muted: false },
		{ fret: 2, string: 4, is_muted: false },
		{ fret: 1, string: 5, is_muted: false },
	],
	barres: [],
};

const customStyleProps = {
	width: 150,
	height: 180,
	dotColor: "#FF5733",
	stringColor: "#CCCCCC",
	fretColor: "#AAAAAA",
	fontFamily: "Arial, sans-serif",
};

/**
 * Default chord diagram with C Major chord
 */
export const Default: Story = {
	args: {
		...cMajor,
		...DEFAULT_CHORD_STYLE,
		view: "vertical-right",
		width: 757,
		height: 210,
		fretCount: 12,
		fretWidth: 58,
		stringWidth: 3,
		dotSize: 17,
		barreHeight: 9,
		fretTextColor: "#979797",
		fontFamily: "monospace",
		dotTextSize: 14,
		fretTextSize: 16,
		tuningTextSize: 15,
		fretHeight: 28,
	},
	play: async ({ canvasElement }) => {
		const canvas = within(canvasElement);

		// Verify the chord diagram container is rendered
		const chordDiagram = canvas.getByTestId("chord-diagram");
		expect(chordDiagram).toBeInTheDocument();

		// Verify SVG element is present
		const svg = chordDiagram.querySelector("svg");
		expect(svg).toBeInTheDocument();
		expect(svg?.tagName).toBe("svg");

		// Verify SVG has proper attributes
		expect(svg).toHaveAttribute("width");
		expect(svg).toHaveAttribute("height");
		expect(svg).toHaveAttribute("viewBox");
	},
};

/**
 * Chord diagram with barre (F Major)
 */
export const WithBarre: Story = {
	args: {
		...fMajor,
		...DEFAULT_CHORD_STYLE,
		width: 309,
		fretCount: 5,
		fretWidth: 49,
		dotSize: 18,
		barreHeight: 11,
		fretTextColor: "#abaaaa",
		fontFamily: "sans-serif",
		dotTextSize: 15,
		fretTextSize: 17,
		stringWidth: 1,
	},
	play: async ({ canvasElement }) => {
		const canvas = within(canvasElement);

		// Verify the chord diagram container is rendered
		const chordDiagram = canvas.getByTestId("chord-diagram");
		expect(chordDiagram).toBeInTheDocument();

		// Verify SVG element is present
		const svg = chordDiagram.querySelector("svg");
		expect(svg).toBeInTheDocument();

		// Verify finger elements are present
		const fingerElements = svg?.querySelectorAll("circle");
		expect(fingerElements?.length).toBeGreaterThan(0);
	},
};

/**
 * Chord diagram using fret notation (G Major)
 */
export const WithFretNotation: Story = {
	args: { ...gMajorInstrument, ...DEFAULT_CHORD_STYLE },
	play: async ({ canvasElement }) => {
		const canvas = within(canvasElement);

		// Verify the chord diagram container is rendered
		const chordDiagram = canvas.getByTestId("chord-diagram");
		expect(chordDiagram).toBeInTheDocument();

		// Verify SVG element is present
		const svg = chordDiagram.querySelector("svg");
		expect(svg).toBeInTheDocument();

		// Verify text elements are present (fret numbers and tuning labels)
		const textElements = svg?.querySelectorAll("text");
		expect(textElements?.length).toBeGreaterThan(0);
	},
};

/**
 * Chord diagram with custom styling
 */
export const CustomStyle: Story = {
	args: {
		...DEFAULT_CHORD_STYLE,
		...customStyleProps,
		chord: customStyleChord,
	},
	play: async ({ canvasElement }) => {
		const canvas = within(canvasElement);

		// Verify the chord diagram container is rendered
		const chordDiagram = canvas.getByTestId("chord-diagram");
		expect(chordDiagram).toBeInTheDocument();

		// Verify SVG element is present
		const svg = chordDiagram.querySelector("svg");
		expect(svg).toBeInTheDocument();

		// Verify custom dimensions are applied
		expect(svg).toHaveAttribute("width", "150");
		expect(svg).toHaveAttribute("height", "180");
	},
};

/**
 * High position chord (D Major at 5th fret)
 */
export const HighPosition: Story = {
	args: {
		...DEFAULT_CHORD_STYLE,
		chord: {
			// D barre chord at 5th fret: x5777x
			fingers: [
				{ fret: 5, string: 2, is_muted: false },
				{ fret: 7, string: 3, is_muted: false, text: "2" },
				{ fret: 7, string: 4, is_muted: false, text: "3" },
				{ fret: 7, string: 5, is_muted: false, text: "4" },
			],
			barres: [],
			firstFret: 5,
		},
	},
	play: async ({ canvasElement }) => {
		const canvas = within(canvasElement);

		// Verify the chord diagram container is rendered
		const chordDiagram = canvas.getByTestId("chord-diagram");
		expect(chordDiagram).toBeInTheDocument();

		// Verify SVG element is present
		const svg = chordDiagram.querySelector("svg");
		expect(svg).toBeInTheDocument();

		// Verify finger elements are present
		const fingerElements = svg?.querySelectorAll("circle");
		expect(fingerElements?.length).toBe(4); // Should have 4 fingers (strings 2,3,4,5)
	},
};

/**
 * Drop D tuning example
 */
export const DropDTuning: Story = {
	args: {
		instrument: {
			tuning: ["D2", "A2", "D3", "G3", "B3", "E4"],
			chord: "000232",
		},
		...DEFAULT_CHORD_STYLE,
	},
	play: async ({ canvasElement }) => {
		const canvas = within(canvasElement);

		// Verify the chord diagram container is rendered
		const chordDiagram = canvas.getByTestId("chord-diagram");
		expect(chordDiagram).toBeInTheDocument();

		// Verify SVG element is present
		const svg = chordDiagram.querySelector("svg");
		expect(svg).toBeInTheDocument();

		// Verify finger elements are present (should have 6 circles: 3 open strings + 3 fingered positions)
		const fingerElements = svg?.querySelectorAll("circle");
		expect(fingerElements?.length).toBe(6);
	},
};

/**
 * Chord with open strings (E minor)
 */
export const OpenStrings: Story = {
	args: {
		instrument: {
			tuning: ["E2", "A2", "D3", "G3", "B3", "E4"],
			chord: "022000",
		},
		...DEFAULT_CHORD_STYLE,
	},
	play: async ({ canvasElement }) => {
		const canvas = within(canvasElement);

		// Verify the chord diagram container is rendered
		const chordDiagram = canvas.getByTestId("chord-diagram");
		expect(chordDiagram).toBeInTheDocument();

		// Verify SVG element is present
		const svg = chordDiagram.querySelector("svg");
		expect(svg).toBeInTheDocument();

		// Verify finger elements are present (should have 6 circles: 2 fingered positions + 4 open strings)
		const fingerElements = svg?.querySelectorAll("circle");
		expect(fingerElements?.length).toBe(6);
	},
};

/**
 * Chord with open and muted strings using chord object
 */
export const OpenAndMutedStrings: Story = {
	args: {
		chord: {
			// C Major with muted 1st and open 3rd string: x32010
			fingers: [
				{ fret: 0, string: 1, is_muted: true },
				{ fret: 3, string: 2, is_muted: false, text: "3" },
				{ fret: 2, string: 3, is_muted: false, text: "2" },
				{ fret: 0, string: 4, is_muted: false },
				{ fret: 1, string: 5, is_muted: false, text: "1" },
				{ fret: 0, string: 6, is_muted: false },
			],
			barres: [],
		},
		...DEFAULT_CHORD_STYLE,
	},
	play: async ({ canvasElement }) => {
		const canvas = within(canvasElement);

		// Verify the chord diagram container is rendered
		const chordDiagram = canvas.getByTestId("chord-diagram");
		expect(chordDiagram).toBeInTheDocument();

		// Verify SVG element is present
		const svg = chordDiagram.querySelector("svg");
		expect(svg).toBeInTheDocument();

		// Verify finger elements are present (2 regular fingers + 1 open circle + 1 muted X)
		const fingerElements = svg?.querySelectorAll("circle");
		const lineElements = svg?.querySelectorAll("line");
		expect(fingerElements?.length).toBe(5); // 3 regular fingers + 2 open circles
		expect(lineElements?.length).toBe(13); // 11 grid lines + 2 lines for the X
	},
};

/**
 * Custom styling for open and muted strings
 */
export const CustomOpenMutedStyle: Story = {
	args: {
		chord: {
			fingers: [
				{ fret: 0, string: 1, is_muted: false }, // Open string
				{ fret: 0, string: 2, is_muted: true }, // Muted string
				{ fret: 1, string: 3, is_muted: false },
			],
			barres: [],
		},
		...DEFAULT_CHORD_STYLE,
		openStringColor: "#00FF00", // Green for open strings
		mutedStringColor: "#FF0000", // Red for muted strings
	},
	play: async ({ canvasElement }) => {
		const canvas = within(canvasElement);

		// Verify the chord diagram container is rendered
		const chordDiagram = canvas.getByTestId("chord-diagram");
		expect(chordDiagram).toBeInTheDocument();

		// Verify SVG element is present
		const svg = chordDiagram.querySelector("svg");
		expect(svg).toBeInTheDocument();

		// Verify elements are present
		const fingerElements = svg?.querySelectorAll("circle");
		const lineElements = svg?.querySelectorAll("line");
		expect(fingerElements?.length).toBe(2); // 1 regular finger + 1 open circle
		expect(lineElements?.length).toBe(13); // 11 grid lines + 2 lines for the X
	},
};

/**
 * High fret notation example
 */
export const HighFretNotation: Story = {
	args: {
		...DEFAULT_CHORD_STYLE,
		instrument: {
			tuning: ["E2", "A2", "D3", "G3", "B3", "E4"],
			chord: "(10)(12)(12)(11)(10)(10)",
		},
	},
	play: async ({ canvasElement }) => {
		const canvas = within(canvasElement);

		// Verify the chord diagram container is rendered
		const chordDiagram = canvas.getByTestId("chord-diagram");
		expect(chordDiagram).toBeInTheDocument();

		// Verify SVG element is present
		const svg = chordDiagram.querySelector("svg");
		expect(svg).toBeInTheDocument();

		// Verify finger elements are present (should have 6 circles: 5 fingered positions + 1 open string)
		const fingerElements = svg?.querySelectorAll("circle");
		expect(fingerElements?.length).toBe(6);
	},
};

/**
 * Performance test - Multiple chord diagrams rendered side by side
 */
export const PerformanceTest: Story = {
	render: () => {
		const chordData = {
			chord: {
				// C Major: x32010
				fingers: [
					{ fret: 3, string: 2, is_muted: false, text: "3" },
					{ fret: 2, string: 3, is_muted: false, text: "2" },
					{ fret: 1, string: 5, is_muted: false, text: "1" },
				],
				barres: [],
			},
		};

		const style = {
			width: 120,
			height: 150,
		};

		// Create 50 chord diagrams for performance testing
		const chords = Array.from({ length: 50 }, (_, index) => (
			<div
				key={index}
				style={{
					display: "inline-block",
					margin: "10px",
				}}
			>
				<ChordDiagram {...chordData} {...style} />
			</div>
		));

		return (
			<div
				style={{
					display: "flex",
					flexWrap: "wrap",
					justifyContent: "center",
					maxWidth: "100%",
					padding: "20px",
				}}
			>
				{chords}
			</div>
		);
	},
	parameters: {
		docs: {
			description: {
				story: "Performance test rendering 50 identical chord diagrams side by side to test rendering performance and memory usage.",
			},
		},
	},
	play: async ({ canvasElement }) => {
		const canvas = within(canvasElement);

		// Verify multiple chord diagrams are rendered
		const chordDiagrams = canvas.getAllByTestId("chord-diagram");
		expect(chordDiagrams.length).toBe(50);

		// Verify each diagram has an SVG element
		chordDiagrams.forEach((diagram, index) => {
			const svg = diagram.querySelector("svg");
			expect(svg).toBeInTheDocument();
			expect(svg?.tagName).toBe("svg");
		});

		// Verify total SVG elements count
		const allSvgs = canvasElement.querySelectorAll("svg");
		expect(allSvgs.length).toBe(50);
	},
};
