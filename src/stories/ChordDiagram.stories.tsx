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

		// Canvas Positioning
		canvasOffsetX: {
			control: { type: "range", min: -100, max: 100, step: 1 },
			description: "Horizontal offset in pixels for entire diagram (padding/margin/zoom prep)",
			table: { category: "Canvas", defaultValue: { summary: "0" } },
		},
		canvasOffsetY: {
			control: { type: "range", min: -100, max: 100, step: 1 },
			description: "Vertical offset in pixels for entire diagram (padding/margin/zoom prep)",
			table: { category: "Canvas", defaultValue: { summary: "0" } },
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
			control: { type: "range", min: -1, max: 1, step: 0.01 },
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
		barresWidth: {
			control: { type: "range", min: 0, max: 50, step: 1 },
			description: "Width multiplier for barre rectangles",
			table: { category: "Barres", defaultValue: { summary: "45" } },
		},
		barreHeight: {
			control: { type: "range", min: -50, max: 50 },
			description: "Height of barre rectangles",
			table: { category: "Barres", defaultValue: { summary: "8" } },
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
		barreColor: {
			control: "color",
			description: "Barre color",
			table: { category: "Barres", defaultValue: { summary: "#2196F3" } },
		},
		barresOpacity: {
			control: { type: "range", min: 0, max: 1, step: 0.01 },
			description: "Opacity of barre rectangles",
			table: { category: "Barres", defaultValue: { summary: "1" } },
		},

		// Nut (Fret Zero)
		nutStrokeWidth: {
			control: { type: "range", min: 0, max: 0.5, step: 0.001 },
			description: "Stroke width multiplier for nut line (0.075 * fretWidth ≈ 3px)",
			table: { category: "Nut", defaultValue: { summary: "0.075" } },
		},
		nutOffsetX: {
			control: { type: "range", min: -0.5, max: 0.5, step: 0.01 },
			description: "Horizontal offset multiplier for nut positioning",
			table: { category: "Nut", defaultValue: { summary: "0" } },
		},
		nutOffsetY: {
			control: { type: "range", min: -5, max: 5, step: 0.01 },
			description: "Vertical offset multiplier for nut positioning",
			table: { category: "Nut", defaultValue: { summary: "0" } },
		},
		nutOpacity: {
			control: { type: "range", min: 0, max: 1, step: 0.01 },
			description: "Nut opacity from 0 to 1",
			table: { category: "Nut", defaultValue: { summary: "1.0" } },
		},
		nutColor: {
			control: "color",
			description: "Nut line color",
			table: { category: "Nut", defaultValue: { summary: "#333333" } },
		},
	},
	tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof meta>;

// Base configuration with all default props including new customizations
const BASE_STORY_CONFIG = DEFAULT_CHORD_STYLE;

// Basic chord examples
const cMajor: ChordDiagramProps = {
	// Fret notation: x32010
	fingers: [
		{ fret: 3, string: 2, is_muted: false, text: "3" },
		{ fret: 2, string: 3, is_muted: false, text: "2" },
		{ fret: 1, string: 5, is_muted: false, text: "1" },
	],
	barres: [],
};

const fMajor: ChordDiagramProps = {
	// Fret notation: 133211
	fingers: [
		{ fret: 3, string: 2, is_muted: false, text: "3" },
		{ fret: 3, string: 3, is_muted: false, text: "4" },
		{ fret: 2, string: 4, is_muted: false, text: "2" },
	],
	barres: [{ fret: 1, fromString: 1, toString: 6 }],
};

const gMajorInstrument: ChordDiagramProps = {
	tuning: ["E2", "A2", "D3", "G3", "B3", "E4"],
	fretNotation: "320003",
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
 * Chord diagram with barre (F Major) Vertical
 */
export const WithBarreVerticalRight: Story = {
	args: {
		...fMajor,
		...BASE_STORY_CONFIG,
		view: "vertical-right",
		width: 173,
		height: 240,
		fretCount: 5,
		fretWidth: 23,
		fretHeight: 39,
		dotSize: 18,
		barreHeight: 11,
		fretTextColor: "#d1d0d0",
		fontFamily: "sans-serif",
		dotTextSize: 15,
		fretTextSize: 17,
		stringWidth: 1,
		barresWidth: 11,
		barresOffsetX: 0.12,
		barresOffsetY: 0.33,

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

		tuningTextColor: "#cecbcb",
		tuningLabelOffsetX: 0.04,
		tuningLabelOffsetY: 0.15,
		tuningLabelFormat: "note-only",
		stringIndicatorOffsetX: 0.35,
		fretTextOffsetX: -6.32,
		fretTextOffsetY: 0.16,
		canvasOffsetX: -15,
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
 * Chord diagram with barre (F Major)
 */
export const WithBarreHorizontalRight: Story = {
	args: {
		...fMajor,
		...BASE_STORY_CONFIG,
		view: "horizontal-right",
		width: 283,
		height: 214,
		fretWidth: 47,
		fretHeight: 30,
		dotSize: 18,
		barreHeight: 19,
		backgroundColor: "#ffffff",
		fretColor: "#333333",
		stringColor: "#666666",
		fretTextColor: "#abaaaa",
		fontFamily: "sans-serif",
		dotTextSize: 15,
		fretTextSize: 17,
		tuningTextSize: 17,
		stringWidth: 1,
		barresWidth: 12,
		barresOffsetX: 0.37,

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

		barresOffsetY: -0.14,
		tuningTextColor: "#9e9a9a",
		tuningLabelOffsetX: 0.28,
		tuningLabelOffsetY: -0.08,
		tuningLabelFormat: "note-only",
		stringIndicatorOffsetY: -0.05,
		canvasOffsetX: -23,
		fretTextOffsetX: 0,
		fretTextOffsetY: 6.5,
		nutStrokeWidth: 0.075,
		nutColor: "#333333",
		canvasOffsetY: -26,
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
		width: 190,
		height: 251,
		tuningTextColor: "#cecece",
		openStringColor: "#708aba",
		fretTextSize: 11,
		tuningLabelOffsetX: -5.5,
		tuningLabelFormat: "scientific",
		stringIndicatorOffsetX: 0.23,
		tuningTextSize: 14,
		tuningLabelOffsetY: 0.01,
		fretTextOffsetY: 0.38,
		fretTextOffsetX: -0.01,
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
		...customStyleChord,
		width: 262,
		height: 241,
		fretColor: "#b7b2b2",
		stringColor: "#5b5a5a",
		backgroundColor: "#323232",
		tuningTextColor: "#555555",
		tuningTextSize: 20,
		tuningLabelOffsetX: 0.41,
		tuningLabelOffsetY: 0,
		tuningLabelFormat: "note-only",
		fretWidth: 41,
		stringWidth: 2.57,
		dotSize: 17,
		fretTextOffsetY: 0.52,
		nutStrokeWidth: 0.171,
		nutColor: "#bcadad",
		fretTextColor: "#545353",
		fretTextOffsetX: 0.03,
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
		expect(svg).toHaveAttribute("width", "228");
		expect(svg).toHaveAttribute("height", "228");
	},
};

/**
 * High position chord (D Major at 5th fret)
 */
export const HighPosition: Story = {
	args: {
		...BASE_STORY_CONFIG,
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
		...BASE_STORY_CONFIG,
		tuning: ["D2", "A2", "D3", "G3", "B3", "E4"],
		fretNotation: "000232",
		dotSize: 15,
		fretColor: "#989393",
		fretTextColor: "#cac6c6",
		tuningTextColor: "#9f9e9e",
		tuningLabelOffsetX: 0.88,
		tuningLabelOffsetY: 0.05,
		stringIndicatorOffsetX: 0.23,
		fretTextOffsetX: 0.02,
		fretTextOffsetY: 0.31,
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
		...BASE_STORY_CONFIG,
		fretNotation: "022000",
		fretColor: "#545353",
		fretTextColor: "#b4b0b0",
		tuningTextColor: "#b2b2b2",
		tuningLabelOffsetX: 0.63,
		tuningLabelOffsetY: -0.02,
		stringIndicatorOffsetX: -0.02,
		fretTextOffsetY: 0.22,
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
		...BASE_STORY_CONFIG,
		width: 256,
		stringWidth: 1.42,
		dotSize: 15,
		fretTextColor: "#c1c0c0",
		tuningTextColor: "#b2b2b2",
		tuningLabelOffsetX: -4.36,
		tuningLabelOffsetY: 0.03,
		stringIndicatorOffsetX: 0.17,
		fretTextOffsetY: 0.23,
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
		fingers: [
			{ fret: 0, string: 1, is_muted: false }, // Open string
			{ fret: 0, string: 2, is_muted: true }, // Muted string
			{ fret: 1, string: 3, is_muted: false },
		],
		barres: [],

		...BASE_STORY_CONFIG,

		// Green for open strings
		openStringColor: "#7174bd",

		// Red for muted strings
		mutedStringColor: "#FF0000",

		width: 224,
		height: 215,
		stringWidth: 1.78,
		tuningTextColor: "#9a9999",
		tuningLabelOffsetY: -0.05,
		tuningLabelFormat: "note-only",
		stringIndicatorOffsetX: 0.06,
		stringIndicatorOffsetY: 0,
		fretTextOffsetX: -0.03,
		fretTextOffsetY: 0.47,
		nutStrokeWidth: 0.101,
		nutOffsetX: -0.07,
		nutOffsetY: -0.03,
		canvasOffsetX: -8,
		canvasOffsetY: -25,
		dotSize: 16,
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
		tuning: ["E2", "A2", "D3", "G3", "B3", "E4"],
		fretNotation: "(10)(12)(12)(11)(10)(10)",
		width: 620,
		fretCount: 14,

		// Disable auto barre to show all 6 fingers
		autoBarreEnabled: false,

		fretWidth: 38,
		stringWidth: 1.17,
		nutStrokeWidth: 0.143,
		nutColor: "#6e6e6e",
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
		tuningTextColor: "#bab6b6",
		tuningLabelOffsetY: -0.06,
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
		width: 270,
		fretTextColor: "#a09f9f",
		tuningTextColor: "#c6c1c1",
		tuningLabelOffsetY: -0.08,
		fretTextOffsetX: -0.14,
		fretTextOffsetY: 0.32,
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
		tuningTextSize: 11,
		tuningTextColor: "#b0b0b0",
		tuningLabelOffsetX: 0.12,
		tuningLabelFormat: "note-only",
		tuningLabelOffsetY: 0.39,
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
		fretTextSize: 12,
		tuningTextSize: 11,
		fretColor: "#aa3b3b",
		fretTextColor: "#c2bebe",
		tuningTextColor: "#bdbdbd",
		tuningLabelOffsetX: 0.02,
		tuningLabelOffsetY: 0.34,
		fretTextOffsetY: 0.09,
		tuningLabelFormat: "note-only",
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
		const tuningLabels = svg?.querySelectorAll('text[fill*="bdbdbd"]'); // tuningTextColor (#bdbdbd)
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
		const fretNumbers = svg?.querySelectorAll('text[fill*="c2bebe"]'); // fretTextColor (#c2bebe)
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
		height: 213,
		tuningLabelFormat: "note-only",
		fretWidth: 49,
		dotSize: 20,
		fontFamily: "monospace",
		dotTextSize: 16,
		validation: "strict",
		invalidBehavior: "keep-previous",
		fretTextColor: "#c6c6c6",
		tuningTextColor: "#b2b2b2",
		tuningLabelOffsetX: 0.25,
		tuningLabelOffsetY: -0.07,
		fretTextOffsetY: 0.31,
		canvasOffsetX: -12,
		canvasOffsetY: -23,
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
 * Nut Customization Demonstration
 * Shows how nut properties affect the fret zero appearance
 */
export const NutCustomization: Story = {
	args: {
		...cMajor,
		...BASE_STORY_CONFIG,
		view: "horizontal-right",
		nutStrokeWidth: 0.2,
		nutColor: "#FF5733",
		nutOpacity: 0.8,
		width: 300,
		height: 250,
	},
	parameters: {
		docs: {
			description: {
				story: "Demonstrates nut customization with thicker, semi-transparent red nut.",
			},
		},
	},
};

/**
 * Canvas Positioning Demonstration
 */
export const CanvasPositioning: Story = {
	args: {
		...cMajor,
		...BASE_STORY_CONFIG,
		canvasOffsetX: 47,
		canvasOffsetY: 25,
		backgroundColor: "#f0f0f0",
		tuningTextSize: 11,
		tuningLabelOffsetY: -0.02,
		height: 318,
		width: 379,
	},
	parameters: {
		docs: {
			description: {
				story: "Demonstrates canvas positioning for padding/margin and zoom preparation.",
			},
		},
	},
};

/**
 * Combined Advanced Customization
 */
export const CombinedAdvancedCustomization: Story = {
	args: {
		fingers: [
			{ fret: 1, string: 1, is_muted: false, text: "1" },
			{ fret: 3, string: 2, is_muted: false, text: "3" },
			{ fret: 3, string: 3, is_muted: false, text: "4" },
			{ fret: 3, string: 4, is_muted: false, text: "5" },
			{ fret: 1, string: 5, is_muted: false, text: "1" },
			{ fret: 1, string: 6, is_muted: false, text: "1" },
		],
		barres: [{ fret: 1, fromString: 1, toString: 6 }],

		...BASE_STORY_CONFIG,
		nutStrokeWidth: 0.15,
		nutColor: "#0066CC",
		nutOpacity: 0.9,
		canvasOffsetX: -12,
		canvasOffsetY: -9,
		barresOpacity: 0.76,
		dotColor: "#00AA66",
		barreColor: "#00AA66",
		width: 260,
		height: 232,
		tuningLabelOffsetX: 0.3,
		tuningLabelOffsetY: -0.11,
		tuningLabelFormat: "note-only",
		nutOffsetX: 0.08,
		barresOffsetX: 0.41,
		autoBarreEnabled: false,
	},
	parameters: {
		docs: {
			description: {
				story: "All advanced customizations together: nut, canvas, barres, and colors.",
			},
		},
	},
};

// ============================================================================
// AUTO BARRE DETECTION
// ============================================================================

/**
 * Auto Barre Enabled (Default)
 *
 * When there are more than 4 pressed fingers (fret > 0), the system automatically
 * adds a barre on the fret with the most fingers. In this example, fret 3 has 5 fingers,
 * so a barre is automatically added covering strings 1-5.
 *
 * The fingers covered by the barre are removed from visualization to avoid redundancy.
 */
export const AutoBarreEnabled: Story = {
	args: {
		fingers: [
			{ fret: 3, string: 1, is_muted: false },
			{ fret: 3, string: 2, is_muted: false },
			{ fret: 3, string: 3, is_muted: false },
			{ fret: 3, string: 4, is_muted: false },
			{ fret: 3, string: 5, is_muted: false },
			{ fret: 5, string: 6, is_muted: false, text: "3" },
		],
		barres: [],

		...BASE_STORY_CONFIG,

		// default, shown explicitly
		autoBarreEnabled: true,

		width: 268,
		height: 221,
		barresOffsetX: 0.41,
		barreHeight: 23,
	},
	parameters: {
		docs: {
			description: {
				story:
					"**Auto Barre Enabled (Default)**\n\n" +
					"When `autoBarreEnabled` is `true` (default) and there are more than 4 pressed fingers, " +
					"the system automatically detects where a barre should be placed.\n\n" +
					"In this example:\n" +
					"- 6 fingers total (more than 4 threshold)\n" +
					"- Fret 3 has 5 fingers (strings 1-5)\n" +
					"- Fret 5 has 1 finger (string 6)\n" +
					"- **Result**: Barre automatically added on fret 3\n" +
					"- **Visualization**: Only the finger on fret 5 is shown as a dot; the 5 fingers on fret 3 are represented by the barre",
			},
		},
	},
};

/**
 * Auto Barre Disabled
 *
 * When autoBarreEnabled is set to false, no automatic barre is added,
 * even if there are more than 4 pressed fingers.
 * All fingers are shown as individual dots.
 */
export const AutoBarreDisabled: Story = {
	args: {
		fingers: [
			{ fret: 3, string: 1, is_muted: false, text: "1" },
			{ fret: 3, string: 2, is_muted: false, text: "1" },
			{ fret: 3, string: 3, is_muted: false, text: "1" },
			{ fret: 3, string: 4, is_muted: false, text: "1" },
			{ fret: 3, string: 5, is_muted: false, text: "1" },
			{ fret: 5, string: 6, is_muted: false, text: "3" },
		],
		barres: [],
		...BASE_STORY_CONFIG,
		autoBarreEnabled: false, // explicitly disabled
		width: 275,
		height: 214,
	},
	parameters: {
		docs: {
			description: {
				story:
					"**Auto Barre Disabled**\n\n" +
					"When `autoBarreEnabled` is `false`, no automatic barre is added, " +
					"regardless of the number of pressed fingers.\n\n" +
					"In this example:\n" +
					"- Same 6 fingers as the previous story\n" +
					"- Auto barre is disabled\n" +
					"- **Result**: All 6 fingers are shown as individual dots\n" +
					"- **Use case**: When you want full control over visualization or teaching individual finger positions",
			},
		},
	},
};

/**
 * Auto Barre Tiebreaker
 *
 * When multiple frets have the same number of fingers (a tie),
 * the system chooses the lowest fret number.
 *
 * In this example, fret 3 and fret 5 both have 3 fingers each,
 * so the barre is placed on fret 3 (the lower fret).
 */
export const AutoBarreTiebreaker: Story = {
	args: {
		fingers: [
			{ fret: 3, string: 1, is_muted: false },
			{ fret: 3, string: 2, is_muted: false },
			{ fret: 3, string: 3, is_muted: false },
			{ fret: 5, string: 4, is_muted: false, text: "2" },
			{ fret: 5, string: 5, is_muted: false, text: "3" },
			{ fret: 5, string: 6, is_muted: false, text: "4" },
		],
		barres: [],

		...BASE_STORY_CONFIG,
		width: 278,
		height: 210,
		barreHeight: 21,
		barresOffsetX: 0.42,
	},
	parameters: {
		docs: {
			description: {
				story:
					"**Auto Barre Tiebreaker**\n\n" +
					"When multiple frets have the same number of fingers, the system uses a tiebreaker rule:\n\n" +
					"**Rule**: Choose the **lowest fret number**\n\n" +
					"In this example:\n" +
					"- Fret 3: 3 fingers (strings 1-3)\n" +
					"- Fret 5: 3 fingers (strings 4-6)\n" +
					"- **Tie!** Both have 3 fingers\n" +
					"- **Result**: Barre is placed on fret 3 (lower fret wins)\n" +
					"- **Visualization**: Barre on fret 3, three individual dots on fret 5",
			},
		},
	},
};

/**
 * Manual Barre Precedence
 *
 * Manual barres always take precedence over automatic detection.
 * Even if autoBarreEnabled is true (default), if there are manual barres defined,
 * the automatic detection is completely disabled.
 */
export const ManualBarrePrecedence: Story = {
	args: {
		fingers: [
			{ fret: 1, string: 1, is_muted: false },
			{ fret: 1, string: 2, is_muted: false },
			{ fret: 1, string: 3, is_muted: false },
			{ fret: 1, string: 4, is_muted: false },
			{ fret: 1, string: 5, is_muted: false },
			{ fret: 1, string: 6, is_muted: false },
			{ fret: 3, string: 2, is_muted: false, text: "2" },
			{ fret: 3, string: 3, is_muted: false, text: "3" },
			{ fret: 3, string: 4, is_muted: false, text: "4" },
		],
		barres: [{ fret: 1, fromString: 1, toString: 6 }], // manual barre

		...BASE_STORY_CONFIG,

		// auto barre is enabled but won't apply
		autoBarreEnabled: true,

		width: 272,
		height: 203,
		barresOffsetX: 0.17,
	},
	parameters: {
		docs: {
			description: {
				story:
					"**Manual Barre Precedence**\n\n" +
					"Manual barres **always** take precedence over automatic detection. " +
					"When any manual barre is defined via the `barres` prop, automatic detection is " +
					"completely disabled, even if `autoBarreEnabled` is `true`.\n\n" +
					"In this example:\n" +
					"- 9 total fingers (would normally trigger auto barre)\n" +
					"- Manual barre defined on fret 1 (covering all 6 strings)\n" +
					"- `autoBarreEnabled` is `true`\n" +
					"- **Result**: Auto barre is disabled; only the manual barre is used\n" +
					"- **Use case**: Full manual control when you need to specify exact barre placement",
			},
		},
	},
};

// ================================
// AUTO FIRST FRET STORIES
// ================================

/**
 * **Auto First Fret - Basic Usage**
 *
 * The `autoFirstFret` feature automatically adjusts the diagram's starting fret position
 * when finger positions are outside the default visible range (1-4).
 *
 * In this example:
 * - Fingers are placed at frets 5, 7, and 8 (high position chord)
 * - `autoFirstFret` is enabled
 * - No manual `firstFret` is specified
 * - **Result**: Diagram automatically starts at fret 5 to show all fingers
 *
 * Without `autoFirstFret`, you would need to manually set `firstFret={5}`.
 */
export const AutoFirstFretBasic: Story = {
	args: {
		fingers: [
			{ fret: 5, string: 1, is_muted: false, text: "1" },
			{ fret: 7, string: 2, is_muted: false, text: "3" },
			{ fret: 8, string: 3, is_muted: false, text: "4" },
			{ fret: 0, string: 4, is_muted: false }, // open string
			{ fret: 0, string: 5, is_muted: true }, // muted
			{ fret: 0, string: 6, is_muted: true }, // muted
		],
		barres: [],

		...BASE_STORY_CONFIG,

		autoFirstFret: true,
		fretCount: 4,

		width: 228,
		height: 211,
	},
	parameters: {
		docs: {
			description: {
				story:
					"**Auto First Fret - Basic Usage**\n\n" +
					"Automatically adjusts `firstFret` when fingers are in high positions.\n\n" +
					"**Features:**\n" +
					"- Fingers at frets 5, 7, 8\n" +
					"- `autoFirstFret={true}` enables automatic adjustment\n" +
					"- Diagram starts at fret 5 automatically\n" +
					"- All fingers remain visible within `fretCount={4}`\n\n" +
					"**Use case:** Displaying high-position chords without manual configuration",
			},
		},
	},
};

/**
 * **Auto First Fret - With FretCount Adjustment**
 *
 * When fingers span a range larger than the default `fretCount`, the system
 * automatically increases `fretCount` to accommodate all fingers.
 *
 * In this example:
 * - Fingers at frets 5 and 10 (range of 6 frets)
 * - Default `fretCount` is 4
 * - `autoFirstFret` is enabled
 * - **Result**: `firstFret` set to 5, `fretCount` increased to 6
 * - Console warning is logged about the adjustment
 */
export const AutoFirstFretWithAdjustment: Story = {
	args: {
		fingers: [
			{ fret: 5, string: 1, is_muted: false, text: "1" },
			{ fret: 10, string: 2, is_muted: false, text: "2" },
			{ fret: 0, string: 3, is_muted: false }, // open string
			{ fret: 0, string: 4, is_muted: true },
			{ fret: 0, string: 5, is_muted: true },
			{ fret: 0, string: 6, is_muted: true },
		],
		barres: [],

		...BASE_STORY_CONFIG,

		autoFirstFret: true,
		fretCount: 4,

		width: 312,
		height: 210,
	},
	parameters: {
		docs: {
			description: {
				story:
					"**Auto First Fret - With FretCount Adjustment**\n\n" +
					"Automatically increases `fretCount` when fingers don't fit in the default range.\n\n" +
					"**Features:**\n" +
					"- Fingers at frets 5 and 10 (6 fret range)\n" +
					"- Default `fretCount={4}` is too small\n" +
					"- System increases `fretCount` to 6 automatically\n" +
					"- Console warning: `[ChordDiagram] Auto-increased fretCount from 4 to 6`\n\n" +
					"**Use case:** Wide-ranging chord shapes that need more visual space\n\n" +
					"**Note:** Check browser console to see the adjustment warning.",
			},
		},
	},
};

/**
 * **Auto First Fret - Manual Override**
 *
 * Manual `firstFret` always takes precedence over automatic calculation.
 * This allows fine-grained control when needed.
 *
 * In this example:
 * - Fingers would normally trigger auto adjustment to fret 5
 * - Manual `firstFret={1}` is specified
 * - `autoFirstFret` is enabled but ignored
 * - **Result**: Diagram starts at fret 1 (fingers at 5, 7, 8 are outside visible range)
 */
export const AutoFirstFretManualOverride: Story = {
	args: {
		fingers: [
			{ fret: 5, string: 1, is_muted: false, text: "1" },
			{ fret: 7, string: 2, is_muted: false, text: "3" },
			{ fret: 8, string: 3, is_muted: false, text: "4" },
			{ fret: 0, string: 4, is_muted: false },
			{ fret: 0, string: 5, is_muted: true },
			{ fret: 0, string: 6, is_muted: true },
		],
		barres: [],

		...BASE_STORY_CONFIG,

		autoFirstFret: true,
		firstFret: 1, // Manual override
		fretCount: 4,

		width: 261,
		height: 208,
	},
	parameters: {
		docs: {
			description: {
				story:
					"**Auto First Fret - Manual Override**\n\n" +
					"Manual `firstFret` **always** takes precedence over automatic calculation.\n\n" +
					"**Features:**\n" +
					"- Fingers at frets 5, 7, 8 (would trigger auto adjustment)\n" +
					"- Manual `firstFret={1}` is specified\n" +
					"- `autoFirstFret={true}` is enabled but ignored\n" +
					"- **Result**: Auto adjustment is disabled; diagram starts at fret 1\n\n" +
					"**Use case:** Full manual control when you need specific visual framing\n\n" +
					"**Note:** Fingers outside the visible range won't be displayed.",
			},
		},
	},
};

/**
 * **Auto First Fret - Maximum Limit**
 *
 * The system enforces a maximum of 12 frets to prevent unrealistic diagrams.
 * Guitars typically have frets beyond the 12th, but they're rarely used in chord diagrams.
 *
 * In this example:
 * - Fingers at frets 1 and 15 (range of 15 frets)
 * - System would need 15 frets to show both
 * - **Result**: `fretCount` is capped at 12 (maximum limit)
 * - Console warning about hitting the limit
 */
export const AutoFirstFretMaximumLimit: Story = {
	args: {
		fingers: [
			{ fret: 1, string: 1, is_muted: false, text: "1" },
			{ fret: 15, string: 2, is_muted: false, text: "2" },
			{ fret: 0, string: 3, is_muted: true },
			{ fret: 0, string: 4, is_muted: true },
			{ fret: 0, string: 5, is_muted: true },
			{ fret: 0, string: 6, is_muted: true },
		],
		barres: [],

		...BASE_STORY_CONFIG,

		autoFirstFret: true,
		fretCount: 4,

		width: 662,
		height: 208, // Taller to accommodate more frets
	},
	parameters: {
		docs: {
			description: {
				story:
					"**Auto First Fret - Maximum Limit**\n\n" +
					"Enforces a maximum of 12 frets to prevent unrealistic diagrams.\n\n" +
					"**Features:**\n" +
					"- Fingers at frets 1 and 15 (15 fret range)\n" +
					"- System caps `fretCount` at 12 (maximum)\n" +
					"- `firstFret` set to 1 (minimum finger position)\n" +
					"- Console warning: `[ChordDiagram] Auto-increased fretCount from 4 to 12`\n\n" +
					"**Use case:** Edge case protection for unrealistic finger positions\n\n" +
					"**Note:** Finger at fret 15 won't be visible (beyond the 12 fret limit).",
			},
		},
	},
};

/**
 * **Auto First Fret - Edge Case (Only Open Strings)**
 *
 * When no pressed fingers are present (only open strings or muted strings),
 * `autoFirstFret` has no effect and defaults to `firstFret={1}`.
 *
 * In this example:
 * - All fingers are either open (fret 0) or muted
 * - No pressed fingers to calculate from
 * - `autoFirstFret` is enabled but has no effect
 * - **Result**: Default behavior, `firstFret={1}`
 */
export const AutoFirstFretEdgeCase: Story = {
	args: {
		fingers: [
			{ fret: 0, string: 1, is_muted: false }, // open
			{ fret: 0, string: 2, is_muted: false }, // open
			{ fret: 0, string: 3, is_muted: false }, // open
			{ fret: 0, string: 4, is_muted: true }, // muted
			{ fret: 0, string: 5, is_muted: true }, // muted
			{ fret: 0, string: 6, is_muted: true }, // muted
		],
		barres: [],

		...BASE_STORY_CONFIG,

		autoFirstFret: true,
		fretCount: 4,

		width: 234,
		height: 211,
	},
	parameters: {
		docs: {
			description: {
				story:
					"**Auto First Fret - Edge Case (Only Open Strings)**\n\n" +
					"When no pressed fingers exist, `autoFirstFret` has no effect.\n\n" +
					"**Features:**\n" +
					"- All fingers are open (fret 0) or muted\n" +
					"- No pressed fingers (fret > 0) to calculate from\n" +
					"- `autoFirstFret={true}` is enabled but inactive\n" +
					"- **Result**: Default behavior, `firstFret={1}`\n\n" +
					"**Use case:** Edge case handling for open chord shapes",
			},
		},
	},
};

/**
 * **Bug Fix Test: 005500 - Open Strings Preserved**
 *
 * Testing the chord "005500" which should render frets 1-5 with open strings visible.
 *
 * Expected behavior:
 * - Fret numbers displayed: 1, 2, 3, 4, 5
 * - Open strings (fret 0) are visible above the fretboard
 * - firstFret stays at 1 because maxFret (5) <= fretCount (5) AND has open strings
 */
export const BugFix005500: Story = {
	args: {
		...BASE_STORY_CONFIG,
		strings: 6,
		tuning: ["E2", "A2", "D3", "G3", "B3", "E4"],
		fretNotation: "005500",
		autoFirstFret: true,
		fretCount: 5,
		width: 271,
		height: 206,
		fretColor: "#363434",
		fretTextColor: "#e3e2e2",
		tuningTextColor: "#c8c5c5",
		tuningLabelOffsetX: 0.75,
		tuningLabelOffsetY: 0,
		stringIndicatorOffsetX: 0.15,
		fretTextOffsetY: 0.35,
		nutStrokeWidth: 0.106,
		canvasOffsetX: 2,
		canvasOffsetY: -24,
		dotSize: 17,
		barreHeight: 11,
		barresWidth: 10,
		barresOffsetX: 0.39,
	},
	parameters: {
		docs: {
			description: {
				story:
					"**Bug Fix Test: 005500**\n\n" +
					"Testing chord with open strings that should preserve firstFret=1.\n\n" +
					"**Expected:**\n" +
					"- Frets: 1, 2, 3, 4, 5\n" +
					"- Open strings visible\n" +
					"- firstFret = 1 (not adjusted)\n\n" +
					"**Hybrid Rule:**\n" +
					"- maxFret (5) <= fretCount (5) ✅\n" +
					"- Has open strings ✅\n" +
					"- → Keep firstFret=1",
			},
		},
	},
	play: async ({ canvasElement }) => {
		const canvas = within(canvasElement);
		const svg = canvas.getByTestId("chord-diagram").querySelector("svg");
		expect(svg).toBeInTheDocument();

		const textElements = svg?.querySelectorAll("text");
		const fretNumbers = Array.from(textElements || [])
			.map(el => el.textContent)
			.filter(text => text && /^\d+$/.test(text))
			.map(Number)
			.sort((a, b) => a - b);

		expect(fretNumbers).toContain(1);
		expect(fretNumbers).toContain(5);
	},
};

/**
 * **Bug Fix Test: 006600 - Adjust When Needed**
 *
 * Testing the chord "006600" which should adjust firstFret because maxFret > fretCount.
 *
 * Expected behavior:
 * - With fretCount=4: maxFret (6) > fretCount (4) → adjust to firstFret=6
 * - Fret numbers displayed: 6, 7, 8, 9
 */
export const BugFix006600: Story = {
	args: {
		...BASE_STORY_CONFIG,
		strings: 6,
		tuning: ["E2", "A2", "D3", "G3", "B3", "E4"],
		fretNotation: "006600",
		autoFirstFret: true,
		fretCount: 4,
		width: 271,
		height: 206,
		fretColor: "#363434",
		fretTextColor: "#e3e2e2",
		tuningTextColor: "#c8c5c5",
		tuningLabelOffsetX: 0.75,
		tuningLabelOffsetY: 0,
		stringIndicatorOffsetX: 0.15,
		fretTextOffsetY: 0.35,
		nutStrokeWidth: 0.106,
		canvasOffsetX: 2,
		canvasOffsetY: -24,
		dotSize: 17,
		barreHeight: 11,
		barresWidth: 10,
		barresOffsetX: 0.39,
	},
	parameters: {
		docs: {
			description: {
				story:
					"**Bug Fix Test: 006600**\n\n" +
					"Testing chord that should adjust firstFret when maxFret > fretCount.\n\n" +
					"**Expected:**\n" +
					"- Frets: 6, 7, 8, 9\n" +
					"- firstFret = 6 (adjusted)\n\n" +
					"**Hybrid Rule:**\n" +
					"- maxFret (6) > fretCount (4) ✅\n" +
					"- → Adjust to firstFret=6",
			},
		},
	},
	play: async ({ canvasElement }) => {
		const canvas = within(canvasElement);
		const svg = canvas.getByTestId("chord-diagram").querySelector("svg");
		expect(svg).toBeInTheDocument();

		const textElements = svg?.querySelectorAll("text");
		const fretNumbers = Array.from(textElements || [])
			.map(el => el.textContent)
			.filter(text => text && /^\d+$/.test(text))
			.map(Number)
			.sort((a, b) => a - b);

		expect(fretNumbers).toContain(6);
		expect(fretNumbers).toContain(9);
	},
};

/**
 * **Bug Fix Test: x54232 Chord**
 *
 * Testing the chord "x54232" with simplified autoFirstFret rule.
 *
 * Expected behavior with fretCount=5:
 * - maxFret (5) <= fretCount (5) → keep firstFret=1
 * - Fret numbers displayed: 1, 2, 3, 4, 5
 * - Auto barre on fret 2 (strings 4 and 6)
 * - 5 pressed fingers: fret 5 (string 2), fret 4 (string 3), fret 2 (strings 4, 6), fret 3 (string 5)
 */
export const BugFixX54232: Story = {
	args: {
		...BASE_STORY_CONFIG,
		strings: 6,
		tuning: ["E2", "A2", "D3", "G3", "B3", "E4"],
		fretNotation: "x54232",
		autoFirstFret: true,
		autoBarreEnabled: true,
		fretCount: 5,
		width: 271,
		height: 206,
		fretColor: "#363434",
		fretTextColor: "#e3e2e2",
		tuningTextColor: "#c8c5c5",
		tuningLabelOffsetX: 0.75,
		tuningLabelOffsetY: 0,
		stringIndicatorOffsetX: 0.15,
		fretTextOffsetY: 0.35,
		nutStrokeWidth: 0.106,
		canvasOffsetX: 2,
		canvasOffsetY: -24,
		dotSize: 17,
		barreHeight: 11,
		barresWidth: 10,
		barresOffsetX: 0.39,
	},
	parameters: {
		docs: {
			description: {
				story:
					"**Bug Fix Test: x54232 Chord**\n\n" +
					"Testing chord with simplified autoFirstFret rule.\n\n" +
					"**Expected (Simplified Rule):**\n" +
					"- Frets: 1, 2, 3, 4, 5\n" +
					"- Auto barre on fret 2 (2 fingers)\n" +
					"- firstFret=1 (maxFret 5 <= fretCount 5)\n\n" +
					"**Simplified Rule:**\n" +
					"- If maxFret <= fretCount → ALWAYS firstFret=1\n" +
					"- If maxFret > fretCount → adjust to minFret\n\n" +
					"**Bug History:**\n" +
					"- v2.1.0: Was rendering frets 3-7 (using modified fingers)\n" +
					"- v2.1.1: Fixed to use original fingers\n" +
					"- v2.1.2: Simplified rule for consistency",
			},
		},
	},
	play: async ({ canvasElement }) => {
		const canvas = within(canvasElement);
		const svg = canvas.getByTestId("chord-diagram").querySelector("svg");
		expect(svg).toBeInTheDocument();

		// Verify fret numbers are rendered (should be 1, 2, 3, 4, 5)
		const textElements = svg?.querySelectorAll("text");
		const fretNumbers = Array.from(textElements || [])
			.map(el => el.textContent)
			.filter(text => text && /^\d+$/.test(text))
			.map(Number)
			.sort((a, b) => a - b);

		// Should include frets 1 through 5 (simplified rule)
		expect(fretNumbers).toContain(1);
		expect(fretNumbers).toContain(2);
		expect(fretNumbers).toContain(3);
		expect(fretNumbers).toContain(4);
		expect(fretNumbers).toContain(5);
	},
};
