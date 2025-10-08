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
		width: {
			control: { type: "range", min: 0, max: 2000 },
			description: "Total width of the SVG",
			table: { category: "Layout", defaultValue: { summary: "200", detail: "px" } },
		},
		height: {
			control: { type: "range", min: 0, max: 2000 },
			description: "Total height of the SVG",
			table: { category: "Layout", defaultValue: { summary: "250" } },
		},
		backgroundColor: {
			control: "color",
			description: "Background color",
			table: { category: "Layout", defaultValue: { summary: "#ffffff" } },
		},
		fontFamily: {
			control: "select",
			description: "Font family",
			table: { category: "Layout", defaultValue: { summary: "Arial, sans-serif" } },
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

		// Strings
		stringCount: {
			control: { type: "range", min: 0, max: 12 },
			description: "Number of strings",
			table: { category: "Strings", defaultValue: { summary: "6" } },
		},
		stringWidth: {
			control: { type: "range", min: 0, max: 10, step: 0.01 },
			description: "Width of string lines",
			table: { category: "Strings", defaultValue: { summary: "2" } },
		},
		stringColor: {
			control: "color",
			description: "String line color",
			table: { category: "Strings", defaultValue: { summary: "#666666" } },
		},
		openStringColor: {
			control: "color",
			description: "Open string indicator color",
			table: { category: "Strings", defaultValue: { summary: "#2196F3" } },
		},
		mutedStringColor: {
			control: "color",
			description: "Muted string indicator color",
			table: { category: "Strings", defaultValue: { summary: "#DC143C" } },
		},
		stringIndicatorOffsetX: {
			control: { type: "range", min: -5, max: 5, step: 0.01 },
			description: "Horizontal offset multiplier for open/muted indicators",
			table: { category: "Strings", defaultValue: { summary: "0.5" } },
		},
		stringIndicatorOffsetY: {
			control: { type: "range", min: -5, max: 5, step: 0.01 },
			description: "Vertical offset multiplier for open/muted indicators",
			table: { category: "Strings", defaultValue: { summary: "0" } },
		},

		// Frets
		fretCount: {
			control: { type: "range", min: 0, max: 20 },
			description: "Number of frets to render",
			table: { category: "Frets", defaultValue: { summary: "4" } },
		},
		fretWidth: {
			control: { type: "range", min: 0, max: 200 },
			description: "Width of each fret space",
			table: { category: "Frets", defaultValue: { summary: "40" } },
		},
		fretHeight: {
			control: { type: "range", min: 0, max: 200 },
			description: "Height of each fret space",
			table: { category: "Frets", defaultValue: { summary: "30" } },
		},
		fretColor: {
			control: "color",
			description: "Fret line color",
			table: { category: "Frets", defaultValue: { summary: "#333333" } },
		},
		fretTextColor: {
			control: "color",
			description: "Fret number text color",
			table: { category: "Frets", defaultValue: { summary: "#333333" } },
		},
		fretTextSize: {
			control: { type: "range", min: 0, max: 100 },
			description: "Fret number text size",
			table: { category: "Frets", defaultValue: { summary: "12" } },
		},
		fretTextOffsetX: {
			control: { type: "range", min: -50, max: 50, step: 0.01 },
			description: "Horizontal offset multiplier for fret numbers",
			table: { category: "Frets", defaultValue: { summary: "0" } },
		},
		fretTextOffsetY: {
			control: { type: "range", min: -5, max: 5, step: 0.01 },
			description: "Vertical offset multiplier for fret numbers",
			table: { category: "Frets", defaultValue: { summary: "0" } },
		},

		// Tuning
		tuningTextColor: {
			control: "color",
			description: "Tuning text color",
			table: { category: "Tuning", defaultValue: { summary: "#666666" } },
		},
		tuningTextSize: {
			control: { type: "range", min: 0, max: 100 },
			description: "Tuning text size",
			table: { category: "Tuning", defaultValue: { summary: "14" } },
		},
		tuningLabelOffsetX: {
			control: { type: "range", min: -5, max: 5, step: 0.01 },
			description: "Horizontal offset multiplier for tuning labels",
			table: { category: "Tuning", defaultValue: { summary: "0.5" } },
		},
		tuningLabelOffsetY: {
			control: { type: "range", min: -5, max: 5, step: 0.01 },
			description: "Vertical offset multiplier for tuning labels",
			table: { category: "Tuning", defaultValue: { summary: "0.5" } },
		},
		tuningLabelFormat: {
			control: { type: "radio" },
			options: ["scientific", "note-only"],
			description: "Format for tuning labels (scientific: E2, note-only: E)",
			table: { category: "Tuning", defaultValue: { summary: "scientific" } },
		},

		// Dots (Fingers)
		dotSize: {
			control: { type: "range", min: 0, max: 100 },
			description: "Size of finger dots",
			table: { category: "Dots", defaultValue: { summary: "12" } },
		},
		dotColor: {
			control: "color",
			description: "Finger dot color",
			table: { category: "Dots", defaultValue: { summary: "#2196F3" } },
		},
		dotTextColor: {
			control: "color",
			description: "Finger dot text color",
			table: { category: "Dots", defaultValue: { summary: "#ffffff" } },
		},
		dotTextSize: {
			control: { type: "range", min: 0, max: 100 },
			description: "Finger dot text size",
			table: { category: "Dots", defaultValue: { summary: "10" } },
		},

		// Barres
		barreHeight: {
			control: { type: "range", min: -50, max: 50 },
			description: "Height of barre rectangles",
			table: { category: "Barres", defaultValue: { summary: "8" } },
		},
		barreColor: {
			control: "color",
			description: "Barre color",
			table: { category: "Barres", defaultValue: { summary: "#2196F3" } },
		},
		barresWidth: {
			control: { type: "range", min: 0, max: 500, step: 1 },
			description: "Width multiplier for barre rectangles",
			table: { category: "Barres", defaultValue: { summary: "45" } },
		},
		barresOpacity: {
			control: { type: "range", min: 0, max: 1, step: 0.01 },
			description: "Opacity of barre rectangles",
			table: { category: "Barres", defaultValue: { summary: "1" } },
		},
		barresOffsetX: {
			control: { type: "range", min: -5, max: 5, step: 0.01 },
			description: "Horizontal offset multiplier for barres",
			table: { category: "Barres", defaultValue: { summary: "0" } },
		},
		barresOffsetY: {
			control: { type: "range", min: -5, max: 5, step: 0.01 },
			description: "Vertical offset multiplier for barres",
			table: { category: "Barres", defaultValue: { summary: "0" } },
		},
	},
	tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof meta>;

// Base configuration with all default props including new customizations
const BASE_STORY_CONFIG = {
	...DEFAULT_CHORD_STYLE,
	tuningLabelOffsetX: 0.5,
	tuningLabelOffsetY: 0.5,
	tuningLabelFormat: "scientific" as const,
	stringIndicatorOffsetX: 0.5,
	stringIndicatorOffsetY: 0,
	barresWidth: 8,
	barresOpacity: 1,
	barresOffsetX: 0,
	barresOffsetY: 0,
	fretTextOffsetX: 0,
	fretTextOffsetY: 0,
};

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
		...BASE_STORY_CONFIG,
		view: "vertical-right",
		width: 185,
		height: 261,
		fretCount: 5,
		fretWidth: 19,
		stringWidth: 1,
		dotSize: 17,
		barreHeight: 9,
		fretTextColor: "#c6c6c6",
		fontFamily: "monospace",
		dotTextSize: 11,
		fretTextSize: 11,
		tuningTextSize: 16,
		fretHeight: 35,
		tuningTextColor: "#e0e0e0",
		tuningLabelFormat: "note-only",
		validation: "strict",
		invalidBehavior: "render-fallback",
		tuningLabelOffsetX: 0.01,
		tuningLabelOffsetY: 0.27,
		barresOffsetY: -0.11,
		stringIndicatorOffsetX: 0.58,
		stringIndicatorOffsetY: 0.63,
		fretTextOffsetX: -0.13,
		fretTextOffsetY: 0.11,
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
export const WithBarreHorizontalRight: Story = {
	args: {
		...fMajor,
		...BASE_STORY_CONFIG,
		view: "horizontal-right",
		width: 309,
		fretCount: 5,
		fretWidth: 47,
		dotSize: 18,
		barreHeight: 19,
		fretTextColor: "#abaaaa",
		fontFamily: "sans-serif",
		dotTextSize: 15,
		fretTextSize: 17,
		stringWidth: 1,
		barresWidth: 12,
		barresOffsetX: 0.37,

		chord: {
			fingers: [
				{
					fret: 3,
					string: 2,
					is_muted: false,
					text: "3",
				},
				{
					fret: 3,
					string: 3,
					is_muted: false,
					text: "4",
				},
				{
					fret: 2,
					string: 4,
					is_muted: false,
					text: "2",
				},
			],

			barres: [
				{
					fret: 1,
					fromString: 1,
					toString: 6,
				},
			],
		},

		barresOffsetY: -0.14,
		tuningTextColor: "#b2afaf",
		tuningLabelOffsetX: 0.28,
		tuningLabelOffsetY: -0.06,
		tuningLabelFormat: "note-only",
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
 * Chord diagram with barre (F Major) Vertical
 */
export const WithBarreVerticalRight: Story = {
	args: {
		...fMajor,
		...BASE_STORY_CONFIG,
		view: "vertical-right",
		width: 192,
		height: 261,
		fretCount: 5,
		fretWidth: 23,
		fretHeight: 39,
		dotSize: 18,
		barreHeight: 10,
		fretTextColor: "#d1d0d0",
		fontFamily: "sans-serif",
		dotTextSize: 15,
		fretTextSize: 17,
		stringWidth: 1,
		barresWidth: 10,
		barresOffsetX: 0.12,

		chord: {
			fingers: [
				{
					fret: 3,
					string: 2,
					is_muted: false,
					text: "3",
				},
				{
					fret: 3,
					string: 3,
					is_muted: false,
					text: "4",
				},
				{
					fret: 2,
					string: 4,
					is_muted: false,
					text: "2",
				},
			],

			barres: [
				{
					fret: 1,
					fromString: 1,
					toString: 6,
				},
			],
		},

		barresOffsetY: 0.33,
		tuningTextColor: "#cecbcb",
		tuningLabelOffsetX: 0.04,
		tuningLabelOffsetY: 0.15,
		tuningLabelFormat: "note-only",
		stringIndicatorOffsetX: 0.35,
		fretTextOffsetX: -6.32,
		fretTextOffsetY: 0.16,
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
	args: {
		...gMajorInstrument,
		...BASE_STORY_CONFIG,
		width: 249,
		height: 237,
		tuningTextColor: "#cecece",
		openStringColor: "#708aba",
		fretTextSize: 19,
		tuningLabelOffsetX: -4.41,
		tuningLabelFormat: "scientific",
		stringIndicatorOffsetX: 0.23,
		tuningTextSize: 14,
		tuningLabelOffsetY: -0.02,
		fretTextOffsetY: 0.15,
	},
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
		...BASE_STORY_CONFIG,
		...customStyleProps,
		chord: customStyleChord,
		width: 229,
		height: 228,
		fretColor: "#b7b2b2",
		stringColor: "#5b5a5a",
		backgroundColor: "#323232",
		tuningTextColor: "#555555",
		tuningTextSize: 20,
		tuningLabelOffsetX: 0.41,
		tuningLabelOffsetY: 0,
		tuningLabelFormat: "note-only",
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
		expect(svg).toHaveAttribute("width", "229");
		expect(svg).toHaveAttribute("height", "228");
	},
};

/**
 * High position chord (D Major at 5th fret)
 */
export const HighPosition: Story = {
	args: {
		...BASE_STORY_CONFIG,
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
		...BASE_STORY_CONFIG,
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
		...BASE_STORY_CONFIG,
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
		...BASE_STORY_CONFIG,
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
		...BASE_STORY_CONFIG,
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
		...BASE_STORY_CONFIG,

		instrument: {
			tuning: ["E2", "A2", "D3", "G3", "B3", "E4"],
			chord: "(10)(12)(12)(11)(10)(10)",
		},

		width: 620,
		fretCount: 14,
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
 * Horizontal-right view (default)
 */
export const HorizontalRight: Story = {
	args: {
		...cMajor,
		...BASE_STORY_CONFIG,
		view: "horizontal-right",
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
 * Horizontal-left view (mirrored)
 */
export const HorizontalLeft: Story = {
	args: {
		...cMajor,
		...BASE_STORY_CONFIG,
		view: "horizontal-left",
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
 * Vertical-right view (rotated)
 * Tuning labels are positioned above the vertical strings, from left to right.
 * Fret numbers are positioned to the right of the fretboard, one below the other,
 * starting with "0" at the top (nut) and "1, 2, 3..." below.
 */
export const VerticalRight: Story = {
	args: {
		...cMajor,
		...BASE_STORY_CONFIG,
		view: "vertical-right",
		width: 207,
		height: 297,
		fretCount: 5,
		fretWidth: 23,
		fretHeight: 39,
		stringWidth: 1,
		dotSize: 14,
		dotTextSize: 12,
		fretTextSize: 12,
		tuningTextSize: 15,
		tuningTextColor: "#949393",
		tuningLabelOffsetX: 0.2,
		tuningLabelFormat: "note-only",
	},
	parameters: {
		docs: {
			description: {
				story: "Vertical layout for right-handed players. Tuning labels are positioned above the vertical strings, from left to right. Fret numbers are positioned to the right of the fretboard, one below the other, starting with '0' at the top (nut) and '1, 2, 3...' below. Strings are ordered from left to right as [E2, A2, D3, G3, B3, E4].",
			},
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
		expect(fingerElements?.length).toBeGreaterThan(0);

		// Verify tuning labels are positioned correctly (above the vertical strings)
		// Tuning labels have font-weight="bold" and are positioned above the fretboard (y < 50)
		const allTextElements = svg?.querySelectorAll('text[font-weight="bold"]');
		const tuningLabels = Array.from(allTextElements || []).filter(text => {
			const y = Number(text.getAttribute("y"));
			return y < 50; // Above the fretboard
		});
		expect(tuningLabels.length).toBeGreaterThan(0);

		// Verify tuning labels are positioned above the fretboard
		if (tuningLabels && tuningLabels.length > 0) {
			const firstLabel = tuningLabels[0] as SVGTextElement;
			const x = Number(firstLabel.getAttribute("x"));
			const y = Number(firstLabel.getAttribute("y"));

			expect(x).toBeGreaterThan(0);
			expect(y).toBeLessThan(100); // Above the main fretboard area
		}

		// Verify text elements are present (tuning labels + fret numbers)
		const textElements = svg?.querySelectorAll("text");
		expect(textElements?.length).toBeGreaterThan(0);
	},
};

/**
 * Vertical-left view (rotated and mirrored)
 * Tuning labels are positioned above the vertical strings, from left to right.
 * Fret numbers are positioned to the right of the fretboard, one below the other,
 * starting with "0" at the top (nut) and "1, 2, 3..." below.
 */
export const VerticalLeft: Story = {
	args: {
		...cMajor,
		...BASE_STORY_CONFIG,
		view: "vertical-left",
		width: 207,
		height: 297,
		fretCount: 5,
		fretWidth: 23,
		fretHeight: 39,
		stringWidth: 1,
		dotSize: 14,
		fretTextSize: 25,
		tuningTextSize: 12,
	},
	parameters: {
		docs: {
			description: {
				story: "Vertical layout for left-handed players. Tuning labels are positioned above the vertical strings, from left to right. Fret numbers are positioned to the right of the fretboard, one below the other, starting with '0' at the top (nut) and '1, 2, 3...' below. Strings are ordered from left to right as [E4, B3, G3, D3, A2, E2].",
			},
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
		expect(fingerElements?.length).toBeGreaterThan(0);

		// Verify tuning labels are positioned correctly (above the vertical strings)
		const tuningLabels = svg?.querySelectorAll('text[fill*="666"]'); // tuningTextColor
		expect(tuningLabels?.length).toBeGreaterThan(0);

		// Verify tuning labels are positioned above the fretboard
		if (tuningLabels && tuningLabels.length > 0) {
			const firstLabel = tuningLabels[0] as SVGTextElement;
			const x = Number(firstLabel.getAttribute("x"));
			const y = Number(firstLabel.getAttribute("y"));

			expect(x).toBeGreaterThan(0);
			expect(y).toBeLessThan(100); // Above the main fretboard area
		}

		// Verify fret numbers are positioned to the right of the fretboard (FR-026)
		const fretNumbers = svg?.querySelectorAll('text[fill*="868"]'); // fretTextColor
		expect(fretNumbers?.length).toBeGreaterThan(0);

		// Verify fret numbers are positioned to the right of the fretboard
		if (fretNumbers && fretNumbers.length > 0) {
			fretNumbers.forEach(fretNumber => {
				const x = Number(fretNumber.getAttribute("x"));
				const y = Number(fretNumber.getAttribute("y"));

				// X should be positioned to the right of the main fretboard
				expect(x).toBeGreaterThan(150);
				// Y should be aligned with each fret
				expect(y).toBeGreaterThan(50);
				expect(y).toBeLessThan(260);
			});
		}
	},
};

/**
 * Performance test - Multiple chord diagrams rendered side by side
 */
export const PerformanceTest: Story = {
	args: {
		...cMajor,
		...BASE_STORY_CONFIG,
		width: 255,
		height: 236,
		tuningLabelFormat: "note-only",
		fretWidth: 49,
		dotSize: 20,
		fontFamily: "monospace",
		dotTextSize: 16,
		validation: "strict",
		invalidBehavior: "keep-previous",
	},
	render: args => {
		// Create 50 chord diagrams for performance testing
		const chords = Array.from({ length: 50 }, (_, index) => (
			<div
				key={index}
				style={{
					display: "inline-block",
					margin: "10px",
				}}
			>
				<ChordDiagram {...args} />
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
				story: "Performance test rendering 50 identical chord diagrams side by side to test rendering performance and memory usage. You can adjust the controls to see how different configurations affect rendering performance.",
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

/**
 * Tuning Label Offset Demonstration
 * Shows how tuningLabelOffset affects label positioning
 */
export const TuningLabelOffsetDemo: Story = {
	args: {
		...cMajor,
		...BASE_STORY_CONFIG,
		view: "horizontal-right",
		tuningLabelOffsetX: 0.8,
		width: 300,
		height: 200,
	},
	parameters: {
		docs: {
			description: {
				story: "Demonstrates tuningLabelOffset prop. Higher values (0.8) move labels further from the nut. Default is 0.5.",
			},
		},
	},
	play: async ({ canvasElement }) => {
		const canvas = within(canvasElement);
		const chordDiagram = canvas.getByTestId("chord-diagram");
		expect(chordDiagram).toBeInTheDocument();

		const svg = chordDiagram.querySelector("svg");
		const tuningLabels = svg?.querySelectorAll('text[font-weight="bold"]');
		expect(tuningLabels?.length).toBeGreaterThan(0);
	},
};

/**
 * Tuning Label Format Demonstration
 * Shows scientific notation vs note-only format
 */
export const TuningLabelFormatDemo: Story = {
	args: {
		...cMajor,
		...BASE_STORY_CONFIG,
		view: "vertical-right",
		tuningLabelFormat: "note-only",
		width: 200,
		height: 300,
	},
	parameters: {
		docs: {
			description: {
				story: "Demonstrates tuningLabelFormat prop with 'note-only' format. Shows 'E A D G B E' instead of 'E2 A2 D3 G3 B3 E4', saving space.",
			},
		},
	},
	play: async ({ canvasElement }) => {
		const canvas = within(canvasElement);
		const chordDiagram = canvas.getByTestId("chord-diagram");
		expect(chordDiagram).toBeInTheDocument();

		const svg = chordDiagram.querySelector("svg");
		const allTextElements = svg?.querySelectorAll("text");
		const textContent = Array.from(allTextElements || []).map(label => label.textContent);

		// Verify note-only format (should contain "E" not "E2")
		expect(textContent).toContain("E");
		expect(textContent).toContain("A");
		expect(textContent).toContain("D");
	},
};

/**
 * String Indicator Offset Demonstration
 * Shows how stringIndicatorOffset affects O/X positioning
 */
export const StringIndicatorOffsetDemo: Story = {
	args: {
		chord: {
			fingers: [
				{ fret: 0, string: 1, is_muted: true }, // X
				{ fret: 3, string: 2, is_muted: false, text: "3" },
				{ fret: 2, string: 3, is_muted: false, text: "2" },
				{ fret: 0, string: 4, is_muted: false }, // O
				{ fret: 1, string: 5, is_muted: false, text: "1" },
				{ fret: 0, string: 6, is_muted: false }, // O
			],
			barres: [],
		},
		...BASE_STORY_CONFIG,
		view: "horizontal-right",
		stringIndicatorOffsetX: 0.3,
		width: 300,
		height: 200,
	},
	parameters: {
		docs: {
			description: {
				story: "Demonstrates stringIndicatorOffset prop. Lower values (0.3) position O/X indicators closer to the nut. Default is 0.5.",
			},
		},
	},
	play: async ({ canvasElement }) => {
		const canvas = within(canvasElement);
		const chordDiagram = canvas.getByTestId("chord-diagram");
		expect(chordDiagram).toBeInTheDocument();

		const svg = chordDiagram.querySelector("svg");
		// Should have 2 regular fingers + 2 open circles + X marks
		const circles = svg?.querySelectorAll("circle");
		expect(circles?.length).toBeGreaterThan(2);
	},
};

/**
 * Combined Customizations Demonstration
 * Shows all 3 new props working together
 */
export const CombinedCustomizations: Story = {
	args: {
		instrument: {
			tuning: ["E2", "A2", "D3", "G3", "B3", "E4"],
			chord: "x32010",
		},
		...BASE_STORY_CONFIG,
		view: "vertical-right",
		tuningLabelOffsetX: 0.3,
		tuningLabelFormat: "note-only",
		stringIndicatorOffsetX: 0.7,
		width: 220,
		height: 320,
		dotSize: 16,
		tuningTextSize: 16,
	},
	parameters: {
		docs: {
			description: {
				story: "Demonstrates all 3 new customization props working together: tuningLabelOffset (0.3 - closer), tuningLabelFormat (note-only), and stringIndicatorOffset (0.7 - further).",
			},
		},
	},
	play: async ({ canvasElement }) => {
		const canvas = within(canvasElement);
		const chordDiagram = canvas.getByTestId("chord-diagram");
		expect(chordDiagram).toBeInTheDocument();

		const svg = chordDiagram.querySelector("svg");
		expect(svg).toBeInTheDocument();

		// Verify tuning labels use note-only format
		const allTextElements = svg?.querySelectorAll("text");
		const textContent = Array.from(allTextElements || []).map(label => label.textContent);
		expect(textContent).toContain("E");
		expect(textContent).toContain("A");
		expect(textContent).toContain("D");
	},
};
