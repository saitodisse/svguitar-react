/**
 * @fileoverview Main ChordDiagram component for rendering guitar chord diagrams
 * @author svguitar-react
 * @version 1.0.0
 */

import React from "react";
import type {
	ChordDiagramProps,
	Chord,
	ChordDiagramError,
	ErrorCode,
	ViewId,
	LayoutEngine,
	LayoutFrame,
} from "./types";
import {
	processChordData,
	mergeStyles,
	mergeInstrument,
	validateViewProps,
	getStartX,
	getStartY,
} from "./utils";
import { getLayoutEngine } from "./layout";
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
	const {
		chord,
		instrument,
		view,
		layoutEngine,
		validation = "strict",
		invalidBehavior = "keep-previous",
		fallbackChord = "000000",
		onError,
		errorFallback,
		...styleProps
	} = props;

	const lastValidRef = React.useRef<Chord | null>(null);
	let chordData: Chord;
	let renderError: ChordDiagramError | null = null;
	let resolvedViewId: ViewId | null = null;
	let resolvedLayoutEngine: LayoutEngine | null = null;

	try {
		// Validate and resolve view
		resolvedViewId = validateViewProps({ view, layoutEngine });
		resolvedLayoutEngine = layoutEngine || getLayoutEngine(resolvedViewId) || null;

		chordData = processChordData({ chord, instrument });
		lastValidRef.current = chordData;
	} catch (err) {
		const error = err as ChordDiagramError;
		renderError = error;
		if (onError) {
			onError(error, {
				input: (instrument?.chord as unknown as string) ?? (chord as unknown as Chord),
				code: error.code as ErrorCode,
				message: error.message,
				normalized: null,
				warnings: [],
			});
		}

		if (invalidBehavior === "keep-previous") {
			if (lastValidRef.current) {
				chordData = lastValidRef.current;
			} else {
				// Use fallback chord
				chordData =
					typeof fallbackChord === "string"
						? processChordData({
								instrument: {
									tuning: mergeInstrument(instrument).tuning,
									strings: mergeInstrument(instrument).strings,
									frets: mergeInstrument(instrument).frets,
									chord: fallbackChord,
								},
							})
						: (fallbackChord as Chord);
				lastValidRef.current = chordData;
			}
		} else if (invalidBehavior === "render-fallback") {
			chordData =
				typeof fallbackChord === "string"
					? processChordData({
							instrument: {
								tuning: mergeInstrument(instrument).tuning,
								strings: mergeInstrument(instrument).strings,
								frets: mergeInstrument(instrument).frets,
								chord: fallbackChord,
							},
						})
					: (fallbackChord as Chord);
		} else {
			// suppress: render empty chord (no fingers/barres)
			chordData = { fingers: [], barres: [] } as Chord;
		}
	}

	// Merge custom styles with defaults
	const style = mergeStyles(styleProps);

	// Get instrument data for tuning labels
	const instrumentData = mergeInstrument(instrument);
	const firstFret = chordData.firstFret || 1;

	// Build layout frame for the selected view
	const startX = getStartX({ fretWidth: style.fretWidth, tuningTextSize: style.tuningTextSize });
	const startY = getStartY({ fretTextSize: style.fretTextSize });
	const isVertical = (resolvedLayoutEngine?.id || "horizontal-right").startsWith("vertical");
	const gridWidth = isVertical
		? (style.stringCount - 1) * style.fretWidth
		: style.fretCount * style.fretWidth;
	const gridHeight = isVertical
		? style.fretCount * style.fretHeight
		: (style.stringCount - 1) * style.fretHeight;

	const frame: LayoutFrame = {
		width: style.width,
		height: style.height,
		gridOriginX: startX,
		gridOriginY: startY,
		gridWidth,
		gridHeight,
		firstFret,
		stringCount: style.stringCount,
		fretCount: style.fretCount,
		style,
	};

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
				<FretNumbers engine={resolvedLayoutEngine!} frame={frame} />

				{/* Tuning labels */}
				<TuningLabels engine={resolvedLayoutEngine!} frame={frame} tuning={instrumentData.tuning} />

				{/* Fretboard */}
				<Fretboard
					engine={resolvedLayoutEngine!}
					frame={frame}
					fretColor={style.fretColor}
					stringColor={style.stringColor}
					stringWidth={style.stringWidth}
				/>

				{/* Fingers */}
				{chordData.fingers.map((finger, index) => (
					<Finger
						key={`finger-${index}`}
						engine={resolvedLayoutEngine!}
						frame={frame}
						finger={finger}
						dotSize={style.dotSize}
						dotColor={style.dotColor}
						dotTextColor={style.dotTextColor}
						dotTextSize={style.dotTextSize}
						fontFamily={style.fontFamily}
						openStringColor={style.openStringColor}
						mutedStringColor={style.mutedStringColor}
					/>
				))}

				{/* Barres */}
				{chordData.barres.map((barre, index) => (
					<Barre
						key={`barre-${index}`}
						engine={resolvedLayoutEngine!}
						frame={frame}
						barre={barre}
						barreHeight={style.barreHeight}
						barreColor={style.barreColor}
						fontFamily={style.fontFamily}
						dotTextSize={style.dotTextSize}
						dotTextColor={style.dotTextColor}
					/>
				))}
			</svg>
			{renderError &&
				(typeof errorFallback === "function"
					? errorFallback(renderError, {
							input: (instrument?.chord as unknown as string) ?? (chord as unknown as Chord),
							code: renderError.code as ErrorCode,
							message: renderError.message,
							normalized: null,
							warnings: [],
						})
					: (errorFallback ?? null))}
		</div>
	);
};

// Export the component wrapped with React.memo for performance optimization
export default React.memo(ChordDiagram);
