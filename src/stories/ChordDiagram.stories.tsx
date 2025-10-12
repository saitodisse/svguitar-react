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
		canvasOffsetX: {
			control: { type: "range", min: -100, max: 100, step: 1 },
			description: "Horizontal offset in pixels for entire diagram (padding/margin/zoom prep)",
			table: {
				category: "Layout",
				defaultValue: { summary: "0" },
				subcategory: "Canvas",
				type: { summary: "number" },
			},
		},
		canvasOffsetY: {
			control: { type: "range", min: -100, max: 100, step: 1 },
			description: "Vertical offset in pixels for entire diagram (padding/margin/zoom prep)",
			table: { category: "Layout", defaultValue: { summary: "0" }, subcategory: "Canvas" },
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
	nutStrokeWidth: 0.075,
	nutOffsetX: 0,
	nutOffsetY: 0,
	nutOpacity: 1.0,
	nutColor: "#333333",
	canvasOffsetX: 0,
	canvasOffsetY: 0,
};

// Basic chord examples
const cMajor: ChordDiagramProps = {
	chord: {
		// Fret notation: x32010 (string 6→1: x=E2, 3=A2, 2=D3, 0=G3, 1=B3, 0=E4)
		fingers: [
			{ fret: 3, string: 5, is_muted: false, text: "3" }, // A string (string 5)
			{ fret: 2, string: 4, is_muted: false, text: "2" }, // D string (string 4)
			{ fret: 1, string: 2, is_muted: false, text: "1" }, // B string (string 2)
		],
		barres: [],
	},
};

const fMajor: ChordDiagramProps = {
	chord: {
		// Fret notation: 133211 (string 6→1: 1=E2, 3=A2, 3=D3, 2=G3, 1=B3, 1=E4)
		fingers: [
			{ fret: 3, string: 5, is_muted: false, text: "3" }, // A string (string 5)
			{ fret: 3, string: 4, is_muted: false, text: "4" }, // D string (string 4)
			{ fret: 2, string: 3, is_muted: false, text: "2" }, // G string (string 3)
		],
		barres: [{ fret: 1, fromString: 1, toString: 6 }], // Full barre from high E to low E
	},
};

const gMajorInstrument: ChordDiagramProps = {
	instrument: {
		tuning: ["E2", "A2", "D3", "G3", "B3", "E4"],
		chord: "320003",
	},
};

const customStyleChord = {
	// A minor: x02210 (string 6→1: x=E2, 0=A2, 2=D3, 2=G3, 1=B3, 0=E4)
	fingers: [
		{ fret: 2, string: 4, is_muted: false }, // D string (string 4)
		{ fret: 2, string: 3, is_muted: false }, // G string (string 3)
		{ fret: 1, string: 2, is_muted: false }, // B string (string 2)
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
		width: 137,
		height: 219,
		canvasOffsetX: -31,
		canvasOffsetY: -19,
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
		width: 265,
		height: 239,
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

		chord: {
			// F Major barre chord: 133211
			fingers: [
				{
					fret: 3,
					string: 5,
					is_muted: false,
					text: "3",
				}, // A string (string 5)
				{
					fret: 3,
					string: 4,
					is_muted: false,
					text: "4",
				}, // D string (string 4)
				{
					fret: 2,
					string: 3,
					is_muted: false,
					text: "2",
				}, // G string (string 3)
			],

			barres: [
				{
					fret: 1,
					fromString: 1,
					toString: 6,
				}, // Full barre from high E to low E
			],
		},

		barresOffsetY: -0.14,
		tuningTextColor: "#9e9a9a",
		tuningLabelOffsetX: 0.28,
		tuningLabelOffsetY: -0.04,
		tuningLabelFormat: "note-only",
		stringIndicatorOffsetY: 0,
		canvasOffsetX: 0,
		fretTextOffsetX: 0,
		fretTextOffsetY: 0,
		nutStrokeWidth: 0.075,
		nutColor: "#333333",
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
		width: 189,
		height: 263,
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

		tuningTextColor: "#cecbcb",
		tuningLabelOffsetX: 0.04,
		tuningLabelOffsetY: 0.25,
		tuningLabelFormat: "note-only",
		stringIndicatorOffsetX: 0.35,
		fretTextOffsetX: -6.32,
		fretTextOffsetY: 0.16,
		tuningTextSize: 14,
		canvasOffsetX: -7,
		canvasOffsetY: -6,
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
export const WithBarreVerticalRightDarkTheme: Story = {
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
		barreHeight: 11,
		backgroundColor: "#191919",
		fretColor: "#c5c3c3",
		stringColor: "#dedede",
		dotColor: "#2196F3",
		dotTextColor: "#ffffff",
		barreColor: "#2196F3",
		fretTextColor: "#656363",
		tuningTextColor: "#545454",
		openStringColor: "#2196F3",
		mutedStringColor: "#DC143C",
		fontFamily: "sans-serif",
		dotTextSize: 15,
		fretTextSize: 17,
		stringWidth: 1,
		barresWidth: 11,
		barresOffsetX: 0.12,
		barresOffsetY: 0.33,

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

		tuningLabelOffsetX: 0.04,
		tuningLabelOffsetY: 0.42,
		tuningLabelFormat: "note-only",
		stringIndicatorOffsetX: 0.35,
		fretTextOffsetX: -6.32,
		fretTextOffsetY: 0.16,
		tuningTextSize: 13,
		nutStrokeWidth: 0.27,
		nutColor: "#807d7d",
		canvasOffsetX: -3,
		canvasOffsetY: -6,
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
		width: 228,
		height: 228,
		fretColor: "#b7b2b2",
		stringColor: "#5b5a5a",
		backgroundColor: "#323232",
		tuningTextColor: "#555555",
		tuningTextSize: 16,
		tuningLabelOffsetX: 0.41,
		tuningLabelOffsetY: 0,
		tuningLabelFormat: "note-only",
		fretWidth: 41,
		stringWidth: 2.57,
		dotSize: 17,
		fretTextOffsetY: 0.33,
		nutStrokeWidth: 0.173,
		nutColor: "#a69021",
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

		chord: {
			// D barre chord at 5th fret: x5777x
			// Fret notation order: x(string 6/E2) 5(string 5/A2) 7(string 4/D3) 7(string 3/G3) 7(string 2/B3) x(string 1/E4)
			fingers: [
				{ fret: 5, string: 5, is_muted: false }, // A string (string 5)
				{ fret: 7, string: 4, is_muted: false, text: "2" }, // D string (string 4)
				{ fret: 7, string: 3, is_muted: false, text: "3" }, // G string (string 3)
				{ fret: 7, string: 2, is_muted: false, text: "4" }, // B string (string 2)
			],
			barres: [
				{
					fret: 5,
					fromString: 1, // From B string (string 2, aguda)
					toString: 5, // To A string (string 5, mais grave que participa do barre)
				},
			],
			firstFret: 5,
		},

		tuningTextColor: "#979797",
		tuningLabelOffsetX: 0.61,
		tuningLabelOffsetY: 0,
		barresWidth: 9,
		barresOpacity: 0.87,
		barresOffsetX: 0.39,
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
		width: 259,
		fretTextColor: "#b7b5b5",
		tuningTextColor: "#e689cf",
		tuningTextSize: 15,
		tuningLabelOffsetX: -4.44,
		tuningLabelOffsetY: -0.01,
		stringIndicatorOffsetX: 0.22,
		fretTextOffsetX: 0.02,
		fretTextOffsetY: 0.17,
		nutStrokeWidth: 0.132,
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
 * Chord with open and muted strings using chord object
 */
export const OpenAndMutedStrings: Story = {
	args: {
		chord: {
			// C Major with muted low E and open strings: x32010
			// String 6→1: x(E2), 3(A2), 2(D3), 0(G3), 1(B3), 0(E4)
			fingers: [
				{ fret: 0, string: 6, is_muted: true }, // Low E (string 6) muted
				{ fret: 3, string: 5, is_muted: false, text: "3" }, // A string (string 5)
				{ fret: 2, string: 4, is_muted: false, text: "2" }, // D string (string 4)
				{ fret: 0, string: 3, is_muted: false }, // G string (string 3) open
				{ fret: 1, string: 2, is_muted: false, text: "1" }, // B string (string 2)
				{ fret: 0, string: 1, is_muted: false }, // High E (string 1) open
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
 * Combined Advanced Customization
 */
export const CombinedAdvancedCustomization: Story = {
	args: {
		chord: {
			// F Major barre chord: 133211
			fingers: [
				{ fret: 1, string: 6, is_muted: false, text: "1" }, // Low E (string 6)
				{ fret: 3, string: 5, is_muted: false, text: "3" }, // A string (string 5)
				{ fret: 3, string: 4, is_muted: false, text: "4" }, // D string (string 4)
				{ fret: 3, string: 3, is_muted: false, text: "5" }, // G string (string 3)
				{ fret: 1, string: 2, is_muted: false, text: "1" }, // B string (string 2)
				{ fret: 1, string: 1, is_muted: false, text: "1" }, // High E (string 1)
			],
			barres: [{ fret: 1, fromString: 1, toString: 6 }], // Full barre from high E to low E
		},

		...BASE_STORY_CONFIG,
		nutStrokeWidth: 0.15,
		nutColor: "#0066CC",
		nutOpacity: 0.9,
		canvasOffsetX: -12,
		canvasOffsetY: -9,
		barresOpacity: 0.7,
		dotColor: "#00AA66",
		barreColor: "#00AA66",
		width: 217,
		height: 226,
		tuningLabelOffsetX: 0.35,
		tuningLabelOffsetY: -0.11,
		tuningLabelFormat: "note-only",
		nutOffsetX: 0.08,
	},
	parameters: {
		docs: {
			description: {
				story: "All advanced customizations together: nut, canvas, barres, and colors.",
			},
		},
	},
};
