/**
 * @fileoverview Main ChordDiagram component for rendering guitar chord diagrams
 * @author svguitar-react
 * @version 1.0.0
 */

import React from "react";
import type { ChordDiagramProps } from "./types";
import { processChordData, mergeStyles, mergeInstrument } from "./utils";
import { Fretboard } from "./Fretboard";
import { Finger } from "./Finger";
import { Barre } from "./Barre";
import { TuningLabels } from "./TuningLabels";
import { FretNumbers } from "./FretNumbers";

/**
 * ChordDiagram component for rendering guitar chord diagrams in SVG format
 *
 * @param props - Component props
 * @returns JSX element containing the chord diagram
 *
 * @example
 * ```tsx
 * <ChordDiagram
 *   chord={{
 *     fingers: [{ fret: 1, string: 2, text: "1" }],
 *     barres: []
 *   }}
 * />
 * ```
 */
export const ChordDiagram: React.FC<ChordDiagramProps> = props => {
	const { chord, instrument, ...styleProps } = props;
	// Process and validate chord data
	const chordData = processChordData({ chord, instrument });

	// Merge custom styles with defaults
	const style = mergeStyles(styleProps);

	// Get instrument data for tuning labels
	const instrumentData = mergeInstrument(instrument);
	const firstFret = chordData.firstFret || 1;

	return (
		<div data-testid="chord-diagram">
			<svg
				width={style.width}
				height={style.height}
				viewBox={`0 0 ${style.width} ${style.height}`}
				xmlns="http://www.w3.org/2000/svg"
			>
				{/* Background */}
				<rect width={style.width} height={style.height} fill={style.backgroundColor} />

				{/* Fret numbers */}
				<FretNumbers firstFret={firstFret} {...style} />

				{/* Tuning labels */}
				<TuningLabels tuning={instrumentData.tuning} {...style} />

				{/* Fretboard */}
				<Fretboard {...style} />

				{/* Fingers */}
				{chordData.fingers.map((finger, index) => (
					<Finger key={`finger-${index}`} finger={finger} firstFret={firstFret} {...style} />
				))}

				{/* Barres */}
				{chordData.barres.map((barre, index) => (
					<Barre key={`barre-${index}`} barre={barre} firstFret={firstFret} {...style} />
				))}
			</svg>
		</div>
	);
};

// Export the component wrapped with React.memo for performance optimization
export default React.memo(ChordDiagram);
