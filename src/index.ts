/**
 * @fileoverview Main entry point for the svguitar-react library
 * @author svguitar-react
 * @version 1.0.0
 */

export { ChordDiagram, default } from "./components/ChordDiagram/ChordDiagram";
export type {
	ChordDiagramProps,
	Chord,
	Instrument,
	Finger,
	Barre,
	ChordStyle,
	ChordDiagramError,
	ErrorCode,
} from "./components/ChordDiagram/types";
export {
	DEFAULT_CHORD_STYLE,
	DEFAULT_INSTRUMENT,
	STANDARD_TUNINGS,
} from "./components/ChordDiagram/constants";
export {
	parseFretNotation,
	validateFinger,
	validateBarre,
	validateInstrument,
	mergeStyles,
	mergeInstrument,
	processChordData,
} from "./components/ChordDiagram/utils";
