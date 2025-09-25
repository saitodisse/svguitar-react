/**
 * @fileoverview Storybook stories for the ChordDiagram component
 * @author svguitar-react
 * @version 1.0.0
 */

import type { Meta, StoryObj } from "@storybook/react-vite";
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
			{ fret: 1, string: 2, text: "1" },
			{ fret: 2, string: 4, text: "2" },
			{ fret: 3, string: 5, text: "3" },
		],
		barres: [],
	},
};

const fMajor: ChordDiagramProps = {
	chord: {
		fingers: [
			{ fret: 2, string: 3, text: "2" },
			{ fret: 3, string: 5, text: "3" },
			{ fret: 3, string: 4, text: "4" },
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
			{ fret: 1, string: 2 },
			{ fret: 2, string: 4 },
			{ fret: 2, string: 3 },
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
};

/**
 * Chord diagram with barre (F Major)
 */
export const WithBarre: Story = {
	args: fMajor,
};

/**
 * Chord diagram using fret notation (G Major)
 */
export const WithFretNotation: Story = {
	args: gMajorInstrument,
};

/**
 * Chord diagram with custom styling
 */
export const CustomStyle: Story = {
	args: customStyle,
};

/**
 * High position chord (D Major at 5th fret)
 */
export const HighPosition: Story = {
	args: {
		chord: {
			fingers: [
				{ fret: 7, string: 2, text: "1" },
				{ fret: 7, string: 3, text: "2" },
				{ fret: 7, string: 4, text: "3" },
			],
			barres: [],
			firstFret: 5,
		},
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
};

/**
 * High fret notation example
 */
export const HighFretNotation: Story = {
	args: {
		instrument: {
			tuning: ["E", "A", "D", "G", "B", "E"],
			chord: "(10)(12)(12)(11)(10)(10)",
		},
	},
};
