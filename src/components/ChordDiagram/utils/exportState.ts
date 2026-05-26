/**
 * @fileoverview Export ChordDiagram state to JSON
 * @author svguitar-react
 * @version 1.0.0
 */

import type { ChordDiagramProps, ChordDiagramState } from "../types";
import { mergeStyles, mergeInstrument } from "../utils";

/**
 * Exports complete ChordDiagram state as JSON
 * @param props - Current component props
 * @returns Serializable state object
 */
export function exportChordDiagramState(props: ChordDiagramProps): ChordDiagramState {
	const style = mergeStyles(props);
	const instrument = mergeInstrument({
		strings: props.strings,
		frets: props.frets,
		tuning: props.tuning,
		chord: props.fretNotation,
	});

	const state: ChordDiagramState = {
		// Metadata
		_version: "1.0.0",
		_timestamp: new Date().toISOString(),

		// Instrument configuration (inline)
		strings: instrument.strings,
		frets: instrument.frets,
		tuning: instrument.tuning,
		fretNotation: props.fretNotation,

		// Chord data (inline)
		fingers: props.fingers,
		barres: props.barres,
		firstFret: props.firstFret,
		lastFret: props.lastFret,

		// Layout
		view: props.view || "horizontal-right",

		// All style properties
		width: style.width,
		height: style.height,
		fretCount: style.fretCount,
		stringCount: style.stringCount,
		fretWidth: style.fretWidth,
		fretHeight: style.fretHeight,
		stringWidth: style.stringWidth,
		dotSize: style.dotSize,
		barreHeight: style.barreHeight,

		backgroundColor: style.backgroundColor,
		fretColor: style.fretColor,
		stringColor: style.stringColor,
		dotColor: style.dotColor,
		dotTextColor: style.dotTextColor,
		barreColor: style.barreColor,
		fretTextColor: style.fretTextColor,
		tuningTextColor: style.tuningTextColor,
		openStringColor: style.openStringColor,
		mutedStringColor: style.mutedStringColor,

		fontFamily: style.fontFamily,
		dotTextSize: style.dotTextSize,
		fretTextSize: style.fretTextSize,
		tuningTextSize: style.tuningTextSize,

		tuningLabelOffsetX: style.tuningLabelOffsetX,
		tuningLabelOffsetY: style.tuningLabelOffsetY,
		tuningLabelFormat: style.tuningLabelFormat,

		stringIndicatorOffsetX: style.stringIndicatorOffsetX,
		stringIndicatorOffsetY: style.stringIndicatorOffsetY,

		barresWidth: style.barresWidth,
		barresOpacity: style.barresOpacity,
		barresOffsetX: style.barresOffsetX,
		barresOffsetY: style.barresOffsetY,

		fretTextOffsetX: style.fretTextOffsetX,
		fretTextOffsetY: style.fretTextOffsetY,

		nutStrokeWidth: style.nutStrokeWidth,
		nutOffsetX: style.nutOffsetX,
		nutOffsetY: style.nutOffsetY,
		nutOpacity: style.nutOpacity,
		nutColor: style.nutColor,

		canvasOffsetX: style.canvasOffsetX,
		canvasOffsetY: style.canvasOffsetY,
		zoom: props.zoom ?? 1,
	};

	return state;
}

/**
 * Copies state JSON to clipboard
 * @param state - State to copy
 * @returns Promise that resolves when copied
 */
export async function copyStateToClipboard(state: ChordDiagramState): Promise<void> {
	const json = JSON.stringify(state, null, 2);

	try {
		if (navigator.clipboard && navigator.clipboard.writeText) {
			await navigator.clipboard.writeText(json);
			console.log("✅ ChordDiagram state copied to clipboard:");
			console.log(json);
		} else {
			// Fallback for older browsers
			const textArea = document.createElement("textarea");
			textArea.value = json;
			textArea.style.position = "fixed";
			textArea.style.left = "-9999px";
			document.body.appendChild(textArea);
			textArea.select();
			document.execCommand("copy");
			document.body.removeChild(textArea);
			console.log("✅ ChordDiagram state copied to clipboard (fallback method):");
			console.log(json);
		}
	} catch (error) {
		console.error("❌ Failed to copy state to clipboard:", error);
		throw new Error("Failed to copy state to clipboard");
	}
}
