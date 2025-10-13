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
import { detectAutoBarre, removeFingersCoveredByBarre, shouldApplyAutoBarre } from "./utils/autoBarre";
import { calculateAutoFirstFret, shouldApplyAutoFirstFret } from "./utils/autoFirstFret";
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
 *   fingers={[{ fret: 1, string: 2, text: "1" }]}
 *   barres={[]}
 * />
 * ```
 */
export const ChordDiagram: React.FC<ChordDiagramProps> = props => {
	const {
		// Instrument configuration (inline)
		strings,
		frets,
		tuning,
		fretNotation,
		// Chord data (inline)
		fingers,
		barres,
		firstFret,
		lastFret,
		// Layout
		view,
		layoutEngine,
		// Validation & error handling
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

		// Build chord and instrument objects from inline props
		const chordObj: Chord | undefined =
			fingers || barres
				? {
						fingers: fingers || [],
						barres: barres || [],
						firstFret,
						lastFret,
					}
				: undefined;

		const instrumentObj =
			fretNotation || strings || frets || tuning
				? {
						strings,
						frets,
						tuning,
						chord: fretNotation,
					}
				: undefined;

		chordData = processChordData({ chord: chordObj, instrument: instrumentObj });
		lastValidRef.current = chordData;
	} catch (err) {
		const error = err as ChordDiagramError;
		renderError = error;

		console.error("[ChordDiagram] ❌ Error processing chord data:", {
			code: error.code,
			message: error.message,
			input: fretNotation ?? { fingers, barres },
			invalidBehavior,
			hasFallbackChord: !!fallbackChord,
			hasOnError: !!onError,
			hasErrorFallback: !!errorFallback,
		});

		if (onError) {
			onError(error, {
				input: (fretNotation as unknown as string) ?? ({ fingers, barres } as unknown as Chord),
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
				const mergedInstrument = mergeInstrument({ strings, frets, tuning, chord: fretNotation });
				chordData =
					typeof fallbackChord === "string"
						? processChordData({
								instrument: {
									tuning: mergedInstrument.tuning,
									strings: mergedInstrument.strings,
									frets: mergedInstrument.frets,
									chord: fallbackChord,
								},
							})
						: (fallbackChord as Chord);
				lastValidRef.current = chordData;
			}
		} else if (invalidBehavior === "render-fallback") {
			const mergedInstrument = mergeInstrument({ strings, frets, tuning, chord: fretNotation });
			chordData =
				typeof fallbackChord === "string"
					? processChordData({
							instrument: {
								tuning: mergedInstrument.tuning,
								strings: mergedInstrument.strings,
								frets: mergedInstrument.frets,
								chord: fallbackChord,
							},
						})
					: (fallbackChord as Chord);
		} else {
			// suppress: render empty chord (no fingers/barres)
			chordData = { fingers: [], barres: [] } as Chord;
		}
	}

	// Apply auto barre detection if enabled
	let effectiveChord = chordData;
	if (shouldApplyAutoBarre(props)) {
		const autoBarre = detectAutoBarre(chordData.fingers);
		if (autoBarre) {
			// Add auto barre and remove covered fingers
			effectiveChord = {
				...chordData,
				barres: [...chordData.barres, autoBarre],
				fingers: removeFingersCoveredByBarre(chordData.fingers, autoBarre),
			};
		}
	}

	// Merge custom styles with defaults
	const style = React.useMemo(() => mergeStyles(styleProps), [styleProps]);

	// Get instrument data for tuning labels
	const instrumentData = mergeInstrument({ strings, frets, tuning, chord: fretNotation });

	// Apply auto firstFret calculation if enabled
	let effectiveFirstFret = chordData.firstFret || 1;
	let effectiveFretCount = style.fretCount;

	if (shouldApplyAutoFirstFret(props, chordData.firstFret)) {
		const autoResult = calculateAutoFirstFret(effectiveChord.fingers, style.fretCount);
		effectiveFirstFret = autoResult.firstFret;
		effectiveFretCount = autoResult.fretCount;

		if (autoResult.wasAdjusted && autoResult.fretCount > style.fretCount) {
			console.warn(
				`[ChordDiagram] Auto-increased fretCount from ${style.fretCount} to ${autoResult.fretCount}`
			);
		}
	}

	if (!resolvedLayoutEngine) {
		throw new Error("No layout engine resolved for the selected view");
	}

	// Build layout frame for the selected view
	const startX = getStartX({ fretWidth: style.fretWidth, tuningTextSize: style.tuningTextSize });
	const startY = getStartY({ fretTextSize: style.fretTextSize });
	const isVertical = (resolvedLayoutEngine?.id || "horizontal-right").startsWith("vertical");
	const gridWidth = isVertical
		? (style.stringCount - 1) * style.fretWidth
		: effectiveFretCount * style.fretWidth;
	const gridHeight = isVertical
		? effectiveFretCount * style.fretHeight
		: (style.stringCount - 1) * style.fretHeight;

	const frame: LayoutFrame = React.useMemo(
		() => ({
			width: style.width,
			height: style.height,
			gridOriginX: startX,
			gridOriginY: startY,
			gridWidth,
			gridHeight,
			firstFret: effectiveFirstFret,
			stringCount: style.stringCount,
			fretCount: effectiveFretCount,
			style,
		}),
		[style, startX, startY, gridWidth, gridHeight, effectiveFirstFret, effectiveFretCount]
	);

	return (
		<div data-testid="chord-diagram" className="w-full m-auto">
			<svg
				width={style.width}
				height={style.height}
				viewBox={`0 0 ${style.width} ${style.height}`}
				xmlns="http://www.w3.org/2000/svg"
			>
				{/* Background */}
				<rect width={style.width} height={style.height} fill={style.backgroundColor} />

				{/* Canvas group with global positioning */}
				<g
					data-testid="canvas-group"
					transform={`translate(${style.canvasOffsetX}, ${style.canvasOffsetY})`}
				>
					{/* Fret numbers */}
					<FretNumbers engine={resolvedLayoutEngine!} frame={frame} />

					{/* Tuning labels */}
					<TuningLabels
						engine={resolvedLayoutEngine!}
						frame={frame}
						tuning={instrumentData.tuning}
					/>

					{/* Fretboard */}
					<Fretboard
						engine={resolvedLayoutEngine!}
						frame={frame}
						fretColor={style.fretColor}
						stringColor={style.stringColor}
						stringWidth={style.stringWidth}
						nutStrokeWidth={style.nutStrokeWidth}
						nutOffsetX={style.nutOffsetX}
						nutOffsetY={style.nutOffsetY}
						nutOpacity={style.nutOpacity}
						nutColor={style.nutColor}
					/>

					{/* Fingers */}
					{effectiveChord.fingers.map((finger, index) => (
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
					{effectiveChord.barres.map((barre, index) => (
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
							barresWidth={style.barresWidth}
							barresOpacity={style.barresOpacity}
							barresOffsetX={style.barresOffsetX}
							barresOffsetY={style.barresOffsetY}
						/>
					))}
				</g>
			</svg>
			{renderError &&
				(typeof errorFallback === "function"
					? errorFallback(renderError, {
							input:
								(fretNotation as unknown as string) ??
								({ fingers, barres } as unknown as Chord),
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
