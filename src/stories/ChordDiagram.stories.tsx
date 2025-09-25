/**
 * @fileoverview Storybook stories for the ChordDiagram component
 * @author svguitar-react
 * @version 1.0.0
 */

import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, within } from "storybook/test";
import { ChordDiagram } from "../components/ChordDiagram/ChordDiagram";
import type { ChordDiagramProps } from "../components/ChordDiagram/types";

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
		style: {
			control: "object",
			description: "Custom styling options for the chord diagram",
		},
	},
	tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof meta>;

// Basic chord examples
const cMajor: ChordDiagramProps = {
	chord: {
		fingers: [
			{ fret: 1, string: 2, is_muted: false, text: "1" },
			{ fret: 2, string: 4, is_muted: false, text: "2" },
			{ fret: 3, string: 5, is_muted: false, text: "3" },
		],
		barres: [],
	},
};

const fMajor: ChordDiagramProps = {
	chord: {
		fingers: [
			{ fret: 2, string: 3, is_muted: false, text: "2" },
			{ fret: 3, string: 5, is_muted: false, text: "3" },
			{ fret: 3, string: 4, is_muted: false, text: "4" },
		],
		barres: [{ fret: 1, fromString: 1, toString: 6 }],
	},
};

const gMajorInstrument: ChordDiagramProps = {
	instrument: {
		tuning: ["E", "A", "D", "G", "B", "E"],
		chord: "320003",
	},
};

const customStyle: ChordDiagramProps = {
	chord: {
		fingers: [
			{ fret: 1, string: 2, is_muted: false },
			{ fret: 2, string: 4, is_muted: false },
			{ fret: 2, string: 3, is_muted: false },
		],
		barres: [],
	},
	style: {
		width: 150,
		height: 180,
		dotColor: "#FF5733",
		stringColor: "#CCCCCC",
		fretColor: "#AAAAAA",
		fontFamily: "Arial, sans-serif",
	},
};

/**
 * Default chord diagram with C Major chord
 */
export const Default: Story = {
	args: cMajor,
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
	args: fMajor,
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
	args: gMajorInstrument,
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
	args: customStyle,
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
		chord: {
			fingers: [
				{ fret: 7, string: 2, is_muted: false, text: "1" },
				{ fret: 7, string: 3, is_muted: false, text: "2" },
				{ fret: 7, string: 4, is_muted: false, text: "3" },
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
		expect(fingerElements?.length).toBe(3); // Should have 3 fingers
	},
};

/**
 * Drop D tuning example
 */
export const DropDTuning: Story = {
	args: {
		instrument: {
			tuning: ["D", "A", "D", "G", "B", "E"],
			chord: "x00232",
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

		// Verify finger elements are present (should have 5 circles: 2 open strings + 3 fingered positions)
		const fingerElements = svg?.querySelectorAll("circle");
		expect(fingerElements?.length).toBe(5);
	},
};

/**
 * Chord with open strings (E minor)
 */
export const OpenStrings: Story = {
	args: {
		instrument: {
			tuning: ["E", "A", "D", "G", "B", "E"],
			chord: "022000",
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
			fingers: [
				{ fret: 1, string: 2, is_muted: false, text: "1" },
				{ fret: 2, string: 4, is_muted: false, text: "2" },
				{ fret: 0, string: 1, is_muted: false }, // Open string (O)
				{ fret: 0, string: 3, is_muted: true }, // Muted string (X)
			],
			barres: [],
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

		// Verify finger elements are present (2 regular fingers + 1 open circle + 1 muted X)
		const fingerElements = svg?.querySelectorAll("circle");
		const lineElements = svg?.querySelectorAll("line");
		expect(fingerElements?.length).toBe(3); // 2 regular fingers + 1 open circle
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
		style: {
			openStringColor: "#00FF00", // Green for open strings
			mutedStringColor: "#FF0000", // Red for muted strings
			openStringSize: 14,
			mutedStringSize: 16,
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
		instrument: {
			tuning: ["E", "A", "D", "G", "B", "E"],
			chord: "101211",
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
				fingers: [
					{ fret: 1, string: 2, is_muted: false, text: "1" },
					{ fret: 2, string: 4, is_muted: false, text: "2" },
					{ fret: 3, string: 5, is_muted: false, text: "3" },
				],
				barres: [],
			},
		};

		const style = {
			width: 120,
			height: 150,
			margin: "10px",
		};

		// Create 50 chord diagrams for performance testing
		const chords = Array.from({ length: 50 }, (_, index) => (
			<div
				key={index}
				style={{
					display: "inline-block",
					margin: style.margin,
				}}
			>
				<ChordDiagram {...chordData} style={style} />
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
