import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { useQueryState, parseAsInteger, parseAsString, parseAsStringLiteral } from "nuqs";
import { ChordDiagram } from "./components/ChordDiagram/ChordDiagram";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { exportChordDiagramState, copyStateToClipboard } from "@/components/ChordDiagram/utils/exportState";
import { importChordDiagramState } from "@/components/ChordDiagram/utils/importState";
import type { ChordDiagramProps } from "@/components/ChordDiagram/types";

// Valores padrão completos (estrutura compatível com ChordDiagramState)
const SIMPLE_DEFAULTS = {
	_version: "1.0.0",
	_timestamp: "2025-10-11T19:42:34.020Z",
	chord: {
		fingers: [
			{ fret: 1, string: 1, is_muted: false },
			{ fret: 3, string: 2, is_muted: false },
			{ fret: 3, string: 3, is_muted: false },
			{ fret: 2, string: 4, is_muted: false },
			{ fret: 1, string: 5, is_muted: false },
			{ fret: 1, string: 6, is_muted: false },
		],
		barres: [{ fret: 1, fromString: 1, toString: 6 }],
	},
	instrument: {
		strings: 6,
		frets: 4,
		tuning: ["E2", "A2", "D3", "G3", "B3", "E4"],
		chord: "133211",
	},
	view: "vertical-right" as const,
	width: 196,
	height: 291,
	fretCount: 5,
	stringCount: 6,
	fretWidth: 27,
	fretHeight: 45,
	stringWidth: 2,
	dotSize: 19,
	barreHeight: 19,
	backgroundColor: "#ffffff",
	fretColor: "#333333",
	stringColor: "#666666",
	dotColor: "#2196F3",
	dotTextColor: "#ffffff",
	barreColor: "#2196F3",
	fretTextColor: "#abaaaa",
	tuningTextColor: "#c2c2c2",
	openStringColor: "#2196F3",
	mutedStringColor: "#DC143C",
	fontFamily: "sans-serif",
	dotTextSize: 18,
	fretTextSize: 17,
	tuningTextSize: 18,
	tuningLabelOffsetX: 0,
	tuningLabelOffsetY: -5.48,
	tuningLabelFormat: "note-only" as const,
	stringIndicatorOffsetX: 0,
	stringIndicatorOffsetY: 0,
	barresWidth: 8,
	barresOpacity: 100,
	barresOffsetX: 0,
	barresOffsetY: 0.39,
	fretTextOffsetX: -6.16,
	fretTextOffsetY: 0.1,
	nutStrokeWidth: 0.21,
	nutOffsetX: 0,
	nutOffsetY: 0,
	nutOpacity: 100,
	nutColor: "#6c6565",
	canvasOffsetX: -11.48,
	canvasOffsetY: -23.85,
};

// Interface tipada para o componente com tratamento de erro
interface ChordDiagramWithErrorHandlingProps {
	chord: string;
	instrument?: { tuning?: string[]; strings?: number; frets?: number; chord?: string };
}

// Componente para tratamento de erro do ChordDiagram
function ChordDiagramWithErrorHandling(props: ChordDiagramWithErrorHandlingProps) {
	const { chord, instrument, ...restProps } = props;
	const { t } = useTranslation();
	const [error, setError] = useState<string | null>(null);
	const [lastValidChord, setLastValidChord] = useState<string>(chord);

	useEffect(() => {
		// Reset error when chord changes
		setError(null);
	}, [chord]);

	// Validação do acorde
	const validateChord = (chordString: string): string | null => {
		if (!chordString || chordString.trim() === "") {
			return t("validation.chordEmpty");
		}

		// Verifica se o acorde tem o número correto de caracteres (6 cordas)
		if (chordString.length !== 6) {
			return t("validation.chordLength", { length: chordString.length });
		}

		// Verifica se todos os caracteres são válidos
		const validChars = /^[0-9x]+$/;
		if (!validChars.test(chordString)) {
			return t("validation.invalidChars");
		}

		// Verifica se há pelo menos uma corda tocada (não todas abafadas)
		if (chordString === "xxxxxx") {
			return t("validation.atLeastOnePlayed");
		}

		return null;
	};

	// Valida o acorde atual
	const currentError = validateChord(chord);

	// Se há erro, mantém o último acorde válido
	const chordToUse = currentError ? lastValidChord : chord;

	// Atualiza o último acorde válido quando não há erro
	useEffect(() => {
		if (!currentError && chord) {
			setLastValidChord(chord);
		}
	}, [currentError, chord]);

	// Atualiza o estado de erro
	useEffect(() => {
		setError(currentError);
	}, [currentError]);

	return (
		<>
			<ChordDiagram
				{...restProps}
				instrument={{
					...instrument,
					chord: chordToUse,
				}}
			/>

			{error && (
				<div
					style={{
						backgroundColor: "rgb(49 33 36)",
						border: "1px solid rgb(144 10 0)",
						borderRadius: "4px",
						padding: "12px",
						color: "rgb(255 116 116)",
						fontSize: "14px",
						margin: "10px 76px",
					}}
				>
					<strong>{t("error.chordError")}</strong> {error}
					<br />
					<small>
						{t("error.lastValidChord")} <code>{lastValidChord}</code>
					</small>
				</div>
			)}
		</>
	);
}

function App() {
	const { t, i18n } = useTranslation();
	const [lang, setLang] = useQueryState("lang", parseAsStringLiteral(["en", "pt"]).withDefault("en"));
	const [exportStatus, setExportStatus] = useState<"idle" | "success" | "error">("idle");
	const [importStatus, setImportStatus] = useState<"idle" | "success" | "error">("idle");

	useEffect(() => {
		i18n.changeLanguage(lang);
	}, [lang, i18n]);

	const [view, setView] = useQueryState(
		"view",
		parseAsStringLiteral([
			"horizontal-right",
			"horizontal-left",
			"vertical-right",
			"vertical-left",
		]).withDefault("horizontal-right")
	);

	const [chord, setChord] = useQueryState(
		"chord",
		parseAsString.withDefault(SIMPLE_DEFAULTS.instrument.chord)
	);

	// Barre configuration
	const [barreEnabled, setBarreEnabled] = useQueryState("barreEnabled", parseAsInteger.withDefault(0));
	const [barreFret, setBarreFret] = useQueryState("barreFret", parseAsInteger.withDefault(1));
	const [barreFromString, setBarreFromString] = useQueryState(
		"barreFromString",
		parseAsInteger.withDefault(1)
	);
	const [barreToString, setBarreToString] = useQueryState("barreToString", parseAsInteger.withDefault(6));

	const [width, setWidth] = useQueryState("width", parseAsInteger.withDefault(SIMPLE_DEFAULTS.width));
	const [height, setHeight] = useQueryState("height", parseAsInteger.withDefault(SIMPLE_DEFAULTS.height));
	const [fretCount, setFretCount] = useQueryState(
		"fretCount",
		parseAsInteger.withDefault(SIMPLE_DEFAULTS.fretCount)
	);
	const [stringCount, setStringCount] = useQueryState(
		"stringCount",
		parseAsInteger.withDefault(SIMPLE_DEFAULTS.stringCount)
	);
	const [fretWidth, setFretWidth] = useQueryState(
		"fretWidth",
		parseAsInteger.withDefault(SIMPLE_DEFAULTS.fretWidth)
	);
	const [fretHeight, setFretHeight] = useQueryState(
		"fretHeight",
		parseAsInteger.withDefault(SIMPLE_DEFAULTS.fretHeight)
	);
	const [stringWidth, setStringWidth] = useQueryState(
		"stringWidth",
		parseAsInteger.withDefault(SIMPLE_DEFAULTS.stringWidth)
	);
	const [dotSize, setDotSize] = useQueryState(
		"dotSize",
		parseAsInteger.withDefault(SIMPLE_DEFAULTS.dotSize)
	);
	const [barreHeight, setBarreHeight] = useQueryState(
		"barreHeight",
		parseAsInteger.withDefault(SIMPLE_DEFAULTS.barreHeight)
	);
	const [backgroundColor, setBackgroundColor] = useQueryState(
		"backgroundColor",
		parseAsString.withDefault(SIMPLE_DEFAULTS.backgroundColor)
	);
	const [fretColor, setFretColor] = useQueryState(
		"fretColor",
		parseAsString.withDefault(SIMPLE_DEFAULTS.fretColor)
	);
	const [stringColor, setStringColor] = useQueryState(
		"stringColor",
		parseAsString.withDefault(SIMPLE_DEFAULTS.stringColor)
	);
	const [dotColor, setDotColor] = useQueryState(
		"dotColor",
		parseAsString.withDefault(SIMPLE_DEFAULTS.dotColor)
	);
	const [dotTextColor, setDotTextColor] = useQueryState(
		"dotTextColor",
		parseAsString.withDefault(SIMPLE_DEFAULTS.dotTextColor)
	);
	const [barreColor, setBarreColor] = useQueryState(
		"barreColor",
		parseAsString.withDefault(SIMPLE_DEFAULTS.barreColor)
	);
	const [fretTextColor, setFretTextColor] = useQueryState(
		"fretTextColor",
		parseAsString.withDefault(SIMPLE_DEFAULTS.fretTextColor)
	);
	const [tuningTextColor, setTuningTextColor] = useQueryState(
		"tuningTextColor",
		parseAsString.withDefault(SIMPLE_DEFAULTS.tuningTextColor)
	);
	const [openStringColor, setOpenStringColor] = useQueryState(
		"openStringColor",
		parseAsString.withDefault(SIMPLE_DEFAULTS.openStringColor)
	);
	const [mutedStringColor, setMutedStringColor] = useQueryState(
		"mutedStringColor",
		parseAsString.withDefault(SIMPLE_DEFAULTS.mutedStringColor)
	);
	const [fontFamily, setFontFamily] = useQueryState(
		"fontFamily",
		parseAsString.withDefault(SIMPLE_DEFAULTS.fontFamily)
	);
	const [dotTextSize, setDotTextSize] = useQueryState(
		"dotTextSize",
		parseAsInteger.withDefault(SIMPLE_DEFAULTS.dotTextSize)
	);
	const [fretTextSize, setFretTextSize] = useQueryState(
		"fretTextSize",
		parseAsInteger.withDefault(SIMPLE_DEFAULTS.fretTextSize)
	);
	const [tuningTextSize, setTuningTextSize] = useQueryState(
		"tuningTextSize",
		parseAsInteger.withDefault(SIMPLE_DEFAULTS.tuningTextSize)
	);
	// Tuning customization
	const [tuningLabelOffsetX, setTuningLabelOffsetX] = useQueryState(
		"tuningLabelOffsetX",
		parseAsInteger.withDefault(SIMPLE_DEFAULTS.tuningLabelOffsetX)
	);
	const [tuningLabelOffsetY, setTuningLabelOffsetY] = useQueryState(
		"tuningLabelOffsetY",
		parseAsInteger.withDefault(SIMPLE_DEFAULTS.tuningLabelOffsetY)
	);
	const [tuningLabelFormat, setTuningLabelFormat] = useQueryState(
		"tuningLabelFormat",
		parseAsStringLiteral(["scientific", "note-only"]).withDefault(SIMPLE_DEFAULTS.tuningLabelFormat)
	);

	// String indicators customization
	const [stringIndicatorOffsetX, setStringIndicatorOffsetX] = useQueryState(
		"stringIndicatorOffsetX",
		parseAsInteger.withDefault(SIMPLE_DEFAULTS.stringIndicatorOffsetX)
	);
	const [stringIndicatorOffsetY, setStringIndicatorOffsetY] = useQueryState(
		"stringIndicatorOffsetY",
		parseAsInteger.withDefault(SIMPLE_DEFAULTS.stringIndicatorOffsetY)
	);

	// Barres customization
	const [barresWidth, setBarresWidth] = useQueryState("barresWidth", parseAsInteger.withDefault(8));
	const [barresOpacity, setBarresOpacity] = useQueryState("barresOpacity", parseAsInteger.withDefault(100));
	const [barresOffsetX, setBarresOffsetX] = useQueryState("barresOffsetX", parseAsInteger.withDefault(0));
	const [barresOffsetY, setBarresOffsetY] = useQueryState("barresOffsetY", parseAsInteger.withDefault(0));

	// Fret numbers customization
	const [fretTextOffsetX, setFretTextOffsetX] = useQueryState(
		"fretTextOffsetX",
		parseAsInteger.withDefault(SIMPLE_DEFAULTS.fretTextOffsetX ?? 0)
	);
	const [fretTextOffsetY, setFretTextOffsetY] = useQueryState(
		"fretTextOffsetY",
		parseAsInteger.withDefault(SIMPLE_DEFAULTS.fretTextOffsetY ?? 0)
	);

	// Nut customization
	const [nutStrokeWidth, setNutStrokeWidth] = useQueryState(
		"nutStrokeWidth",
		parseAsInteger.withDefault(SIMPLE_DEFAULTS.nutStrokeWidth ?? 75)
	);
	const [nutOffsetX, setNutOffsetX] = useQueryState("nutOffsetX", parseAsInteger.withDefault(0));
	const [nutOffsetY, setNutOffsetY] = useQueryState("nutOffsetY", parseAsInteger.withDefault(0));
	const [nutOpacity, setNutOpacity] = useQueryState("nutOpacity", parseAsInteger.withDefault(100));
	const [nutColor, setNutColor] = useQueryState(
		"nutColor",
		parseAsString.withDefault(SIMPLE_DEFAULTS.nutColor ?? "#333333")
	);

	// Canvas positioning
	const [canvasOffsetX, setCanvasOffsetX] = useQueryState(
		"canvasOffsetX",
		parseAsInteger.withDefault(SIMPLE_DEFAULTS.canvasOffsetX ?? 0)
	);
	const [canvasOffsetY, setCanvasOffsetY] = useQueryState(
		"canvasOffsetY",
		parseAsInteger.withDefault(SIMPLE_DEFAULTS.canvasOffsetY ?? 0)
	);

	// Chord/Instrument configuration for ChordDiagram
	const chordConfig = useMemo(() => {
		const tuning = ["E2", "A2", "D3", "G3", "B3", "E4"];

		// If barre is not enabled, use instrument with chord string
		if (barreEnabled === 0) {
			return {
				instrument: {
					tuning,
					chord,
				},
			};
		}

		// If barre is enabled, we need to use chord object with barres
		// Parse the chord string to create fingers
		const fingers: { fret: number; string: number; is_muted: boolean; text?: string }[] = [];
		for (let i = 0; i < chord.length && i < 6; i++) {
			const char = chord[i];
			if (char === "x") {
				fingers.push({ fret: 0, string: i + 1, is_muted: true });
			} else if (char === "0" || char === "o") {
				fingers.push({ fret: 0, string: i + 1, is_muted: false });
			} else {
				const fret = parseInt(char, 10);
				if (!isNaN(fret) && fret > 0) {
					fingers.push({ fret, string: i + 1, is_muted: false });
				}
			}
		}

		// Add barre
		const barres = [
			{
				fret: barreFret,
				fromString: barreFromString,
				toString: barreToString,
			},
		];

		return {
			instrument: { tuning, chord },
			chord: { fingers, barres },
		};
	}, [chord, barreEnabled, barreFret, barreFromString, barreToString]);

	// Create props object for export/import
	const currentProps: ChordDiagramProps = useMemo(
		() => ({
			...chordConfig,
			view,
			width,
			height,
			fretCount,
			stringCount,
			fretWidth,
			fretHeight,
			stringWidth,
			dotSize,
			barreHeight,
			backgroundColor,
			fretColor,
			stringColor,
			dotColor,
			dotTextColor,
			barreColor,
			fretTextColor,
			tuningTextColor,
			openStringColor,
			mutedStringColor,
			fontFamily,
			dotTextSize,
			fretTextSize,
			tuningTextSize,
			tuningLabelOffsetX,
			tuningLabelOffsetY,
			tuningLabelFormat,
			stringIndicatorOffsetX,
			stringIndicatorOffsetY,
			barresWidth,
			barresOpacity,
			barresOffsetX,
			barresOffsetY,
			fretTextOffsetX,
			fretTextOffsetY,
			nutStrokeWidth,
			nutOffsetX,
			nutOffsetY,
			nutOpacity,
			nutColor,
			canvasOffsetX,
			canvasOffsetY,
		}),
		[
			chordConfig,
			view,
			width,
			height,
			fretCount,
			stringCount,
			fretWidth,
			fretHeight,
			stringWidth,
			dotSize,
			barreHeight,
			backgroundColor,
			fretColor,
			stringColor,
			dotColor,
			dotTextColor,
			barreColor,
			fretTextColor,
			tuningTextColor,
			openStringColor,
			mutedStringColor,
			fontFamily,
			dotTextSize,
			fretTextSize,
			tuningTextSize,
			tuningLabelOffsetX,
			tuningLabelOffsetY,
			tuningLabelFormat,
			stringIndicatorOffsetX,
			stringIndicatorOffsetY,
			barresWidth,
			barresOpacity,
			barresOffsetX,
			barresOffsetY,
			fretTextOffsetX,
			fretTextOffsetY,
			nutStrokeWidth,
			nutOffsetX,
			nutOffsetY,
			nutOpacity,
			nutColor,
			canvasOffsetX,
			canvasOffsetY,
		]
	);

	// Export state handler
	const handleExportState = async () => {
		try {
			const state = exportChordDiagramState(currentProps);
			await copyStateToClipboard(state);
			setExportStatus("success");
			setTimeout(() => setExportStatus("idle"), 3000);
		} catch (error) {
			console.error("Export error:", error);
			setExportStatus("error");
			setTimeout(() => setExportStatus("idle"), 3000);
		}
	};

	// Import state handler
	const handleImportState = async () => {
		try {
			const json = await navigator.clipboard.readText();
			const state = JSON.parse(json);
			const props = importChordDiagramState(state);

			// Apply imported props to all state setters
			// Handle chord and instrument
			if (props.instrument?.chord) setChord(props.instrument.chord);

			// Handle barres from chord object
			if (props.chord?.barres && props.chord.barres.length > 0) {
				const firstBarre = props.chord.barres[0];
				setBarreEnabled(1);
				setBarreFret(firstBarre.fret);
				setBarreFromString(firstBarre.fromString);
				setBarreToString(firstBarre.toString);
			} else {
				setBarreEnabled(0);
			}

			if (props.view) setView(props.view);
			if (props.width) setWidth(props.width);
			if (props.height) setHeight(props.height);
			if (props.fretCount) setFretCount(props.fretCount);
			if (props.stringCount) setStringCount(props.stringCount);
			if (props.fretWidth) setFretWidth(props.fretWidth);
			if (props.fretHeight) setFretHeight(props.fretHeight);
			if (props.stringWidth) setStringWidth(props.stringWidth);
			if (props.dotSize) setDotSize(props.dotSize);
			if (props.barreHeight) setBarreHeight(props.barreHeight);
			if (props.backgroundColor) setBackgroundColor(props.backgroundColor);
			if (props.fretColor) setFretColor(props.fretColor);
			if (props.stringColor) setStringColor(props.stringColor);
			if (props.dotColor) setDotColor(props.dotColor);
			if (props.dotTextColor) setDotTextColor(props.dotTextColor);
			if (props.barreColor) setBarreColor(props.barreColor);
			if (props.fretTextColor) setFretTextColor(props.fretTextColor);
			if (props.tuningTextColor) setTuningTextColor(props.tuningTextColor);
			if (props.openStringColor) setOpenStringColor(props.openStringColor);
			if (props.mutedStringColor) setMutedStringColor(props.mutedStringColor);
			if (props.fontFamily) setFontFamily(props.fontFamily);
			if (props.dotTextSize) setDotTextSize(props.dotTextSize);
			if (props.fretTextSize) setFretTextSize(props.fretTextSize);
			if (props.tuningTextSize) setTuningTextSize(props.tuningTextSize);
			if (props.tuningLabelOffsetX !== undefined) setTuningLabelOffsetX(props.tuningLabelOffsetX);
			if (props.tuningLabelOffsetY !== undefined) setTuningLabelOffsetY(props.tuningLabelOffsetY);
			if (props.tuningLabelFormat) setTuningLabelFormat(props.tuningLabelFormat);
			if (props.stringIndicatorOffsetX !== undefined)
				setStringIndicatorOffsetX(props.stringIndicatorOffsetX);
			if (props.stringIndicatorOffsetY !== undefined)
				setStringIndicatorOffsetY(props.stringIndicatorOffsetY);
			if (props.barresWidth) setBarresWidth(props.barresWidth);
			if (props.barresOpacity !== undefined) setBarresOpacity(props.barresOpacity);
			if (props.barresOffsetX !== undefined) setBarresOffsetX(props.barresOffsetX);
			if (props.barresOffsetY !== undefined) setBarresOffsetY(props.barresOffsetY);
			if (props.fretTextOffsetX !== undefined) setFretTextOffsetX(props.fretTextOffsetX);
			if (props.fretTextOffsetY !== undefined) setFretTextOffsetY(props.fretTextOffsetY);
			if (props.nutStrokeWidth !== undefined) setNutStrokeWidth(props.nutStrokeWidth);
			if (props.nutOffsetX !== undefined) setNutOffsetX(props.nutOffsetX);
			if (props.nutOffsetY !== undefined) setNutOffsetY(props.nutOffsetY);
			if (props.nutOpacity !== undefined) setNutOpacity(props.nutOpacity);
			if (props.nutColor) setNutColor(props.nutColor);
			if (props.canvasOffsetX !== undefined) setCanvasOffsetX(props.canvasOffsetX);
			if (props.canvasOffsetY !== undefined) setCanvasOffsetY(props.canvasOffsetY);

			setImportStatus("success");
			setTimeout(() => setImportStatus("idle"), 3000);
		} catch (error) {
			console.error("Import error:", error);
			setImportStatus("error");
			setTimeout(() => setImportStatus("idle"), 3000);
		}
	};

	return (
		<div className="mx-auto flex min-h-screen max-w-7xl flex-col gap-8 px-4 py-10 text-white">
			<header className="flex flex-col items-center gap-3 text-center">
				<h1 className="text-4xl font-semibold tracking-tight">svguitar-react</h1>
				<nav className="flex items-center gap-4 text-sm font-medium text-sky-300">
					<a
						href="https://github.com/saitodisse/svguitar-react"
						target="_blank"
						rel="noopener noreferrer"
						className="transition hover:text-sky-200"
					>
						GitHub
					</a>
					<a
						href="https://www.npmjs.com/package/svguitar-react"
						target="_blank"
						rel="noopener noreferrer"
						className="transition hover:text-sky-200"
					>
						npm
					</a>
				</nav>
			</header>

			<div className="grid w-full items-start gap-6 lg:grid-cols-[minmax(0,1fr)_360px]">
				{/* Main Content - Chord Diagram */}
				<div className="flex justify-center items-center w-full m-auto">
					<div className="w-full m-auto border border-white/10 bg-white/5 p-4 shadow-lg backdrop-blur-sm">
						<ChordDiagram
							{...chordConfig}
							view={view}
							// Dimensions
							width={width}
							height={height}
							fretCount={fretCount}
							stringCount={stringCount}
							fretWidth={fretWidth}
							fretHeight={fretHeight}
							stringWidth={stringWidth}
							dotSize={dotSize}
							barreHeight={barreHeight}
							// Colors
							backgroundColor={backgroundColor}
							fretColor={fretColor}
							stringColor={stringColor}
							dotColor={dotColor}
							dotTextColor={dotTextColor}
							barreColor={barreColor}
							fretTextColor={fretTextColor}
							tuningTextColor={tuningTextColor}
							openStringColor={openStringColor}
							mutedStringColor={mutedStringColor}
							// Fonts
							fontFamily={fontFamily}
							dotTextSize={dotTextSize}
							fretTextSize={fretTextSize}
							tuningTextSize={tuningTextSize}
							// Tuning customization
							tuningLabelOffsetX={tuningLabelOffsetX}
							tuningLabelOffsetY={tuningLabelOffsetY}
							tuningLabelFormat={tuningLabelFormat}
							// String indicators customization
							stringIndicatorOffsetX={stringIndicatorOffsetX}
							stringIndicatorOffsetY={stringIndicatorOffsetY}
							// Barres customization
							barresWidth={barresWidth}
							barresOpacity={barresOpacity}
							barresOffsetX={barresOffsetX}
							barresOffsetY={barresOffsetY}
							// Fret numbers customization
							fretTextOffsetX={fretTextOffsetX}
							fretTextOffsetY={fretTextOffsetY}
							// Nut customization
							nutStrokeWidth={nutStrokeWidth}
							nutOffsetX={nutOffsetX}
							nutOffsetY={nutOffsetY}
							nutOpacity={nutOpacity}
							nutColor={nutColor}
							// Canvas positioning
							canvasOffsetX={canvasOffsetX}
							canvasOffsetY={canvasOffsetY}
						/>
					</div>
				</div>

				{/* Right Sidebar - Controls */}
				<aside
					className="flex max-h-[calc(100vh-200px)] flex-col gap-6 overflow-y-auto rounded-xl border border-white/10 bg-white/5 p-5 shadow-lg backdrop-blur-sm"
					aria-label={t("aria.controlPanel")}
				>
					<h2 className="text-xl font-semibold">{t("controls.title")}</h2>

					{/* Export/Import State */}
					<section className="space-y-4">
						<h3 className="text-base mt-4 uppercase tracking-wide text-white/70">
							{t("controls.stateSection")}
						</h3>
						<div className="flex flex-col gap-2">
							<Button onClick={handleExportState} className="w-full" variant="outline">
								📋 {t("controls.exportState")}
							</Button>
							<Button onClick={handleImportState} className="w-full" variant="outline">
								📥 {t("controls.importState")}
							</Button>
							{exportStatus === "success" && (
								<p className="text-xs text-green-400">✓ {t("controls.exportSuccess")}</p>
							)}
							{exportStatus === "error" && (
								<p className="text-xs text-red-400">✗ {t("controls.exportError")}</p>
							)}
							{importStatus === "success" && (
								<p className="text-xs text-green-400">✓ {t("controls.importSuccess")}</p>
							)}
							{importStatus === "error" && (
								<p className="text-xs text-red-400">✗ {t("controls.importError")}</p>
							)}
						</div>
					</section>

					{/* Chord Input */}
					<section className="space-y-4">
						<h3 className="text-base mt-4 uppercase tracking-wide text-white/70">
							{t("controls.chordSection")}
						</h3>
						<div className="flex flex-col gap-1">
							<Label htmlFor="chord" className="text-sm text-white/80">
								{t("controls.chordLabel")}
							</Label>
							<Input
								id="chord"
								type="text"
								value={chord}
								onChange={e => setChord(e.target.value)}
							/>
						</div>
					</section>

					{/* Barre Configuration */}
					<section className="space-y-4">
						<h3 className="text-base mt-4 uppercase tracking-wide text-white/70">
							{t("controls.barreSection")}
						</h3>
						<div className="flex items-center space-x-2">
							<input
								id="barreEnabled"
								type="checkbox"
								checked={barreEnabled === 1}
								onChange={e => setBarreEnabled(e.target.checked ? 1 : 0)}
								className="h-4 w-4 cursor-pointer rounded border border-white/20 bg-transparent"
							/>
							<Label htmlFor="barreEnabled" className="text-sm text-white/80">
								{t("controls.barreEnabled")}
							</Label>
						</div>
						{barreEnabled === 1 && (
							<>
								<div className="flex flex-col gap-1">
									<Label htmlFor="barreFret" className="text-sm text-white/80">
										<span className="flex items-center justify-between">
											{t("controls.barreFret")}
											<span className="text-xs text-white/60">{barreFret}</span>
										</span>
									</Label>
									<Slider
										id="barreFret"
										min={1}
										max={18}
										value={[barreFret]}
										onValueChange={values => setBarreFret(values[0])}
									/>
								</div>
								<div className="flex flex-col gap-1">
									<Label htmlFor="barreFromString" className="text-sm text-white/80">
										<span className="flex items-center justify-between">
											{t("controls.barreFromString")}
											<span className="text-xs text-white/60">{barreFromString}</span>
										</span>
									</Label>
									<Slider
										id="barreFromString"
										min={1}
										max={6}
										value={[barreFromString]}
										onValueChange={values => setBarreFromString(values[0])}
									/>
								</div>
								<div className="flex flex-col gap-1">
									<Label htmlFor="barreToString" className="text-sm text-white/80">
										<span className="flex items-center justify-between">
											{t("controls.barreToString")}
											<span className="text-xs text-white/60">{barreToString}</span>
										</span>
									</Label>
									<Slider
										id="barreToString"
										min={1}
										max={6}
										value={[barreToString]}
										onValueChange={values => setBarreToString(values[0])}
									/>
								</div>
							</>
						)}
					</section>

					{/* Layout */}
					<section className="space-y-4">
						<h3 className="text-base mt-4 uppercase tracking-wide text-white/70">
							{t("controls.layoutSection")}
						</h3>
						<div className="flex flex-col gap-1">
							<Label htmlFor="view" className="text-sm text-white/80">
								{t("controls.viewLabel")}
							</Label>
							<Select
								value={view}
								onValueChange={value =>
									setView(
										value as
											| "horizontal-right"
											| "horizontal-left"
											| "vertical-right"
											| "vertical-left"
									)
								}
							>
								<SelectTrigger id="view">
									<SelectValue />
								</SelectTrigger>
								<SelectContent>
									<SelectItem value="horizontal-right">
										{t("controls.viewHorizontalRight")}
									</SelectItem>
									<SelectItem value="horizontal-left">
										{t("controls.viewHorizontalLeft")}
									</SelectItem>
									<SelectItem value="vertical-right">
										{t("controls.viewVerticalRight")}
									</SelectItem>
									<SelectItem value="vertical-left">
										{t("controls.viewVerticalLeft")}
									</SelectItem>
								</SelectContent>
							</Select>
						</div>
						<div className="flex flex-col gap-1">
							<Label htmlFor="width" className="text-sm text-white/80">
								<span className="flex items-center justify-between">
									{t("controls.widthLabel")}
									<span className="text-xs text-white/60">{width}px</span>
								</span>
							</Label>
							<Slider
								id="width"
								min={0}
								max={1000}
								value={[width]}
								onValueChange={values => setWidth(values[0])}
							/>
						</div>

						<div className="flex flex-col gap-1">
							<Label htmlFor="height" className="text-sm text-white/80">
								<span className="flex items-center justify-between">
									{t("controls.heightLabel")}
									<span className="text-xs text-white/60">{height}px</span>
								</span>
							</Label>
							<Slider
								id="height"
								min={0}
								max={1000}
								value={[height]}
								onValueChange={values => setHeight(values[0])}
							/>
						</div>
						<div className="flex items-center justify-between gap-4">
							<Label htmlFor="backgroundColor" className="text-sm text-white/80">
								{t("controls.backgroundColorLabel")}
							</Label>
							<input
								id="backgroundColor"
								type="color"
								value={backgroundColor}
								onChange={e => setBackgroundColor(e.target.value)}
								className="h-9 w-14 cursor-pointer rounded border border-white/20 bg-transparent"
							/>
						</div>
						<div className="flex flex-col gap-1">
							<Label htmlFor="fontFamily" className="text-sm text-white/80">
								{t("controls.fontFamilyLabel")}
							</Label>
							<Select value={fontFamily} onValueChange={setFontFamily}>
								<SelectTrigger id="fontFamily">
									<SelectValue />
								</SelectTrigger>
								<SelectContent>
									<SelectItem value="Arial, sans-serif">Arial, sans-serif</SelectItem>
									<SelectItem value="monospace">monospace</SelectItem>
									<SelectItem value="sans-serif">sans-serif</SelectItem>
									<SelectItem value="serif">serif</SelectItem>
									<SelectItem value="Noto Sans, sans-serif">
										Noto Sans, sans-serif
									</SelectItem>
									<SelectItem value="Ubuntu, sans-serif">Ubuntu, sans-serif</SelectItem>
									<SelectItem value="Inter, sans-serif">Inter, sans-serif</SelectItem>
								</SelectContent>
							</Select>
						</div>
					</section>

					{/* Strings */}
					<section className="space-y-4">
						<h3 className="text-base mt-4 uppercase tracking-wide text-white/70">
							{t("controls.stringsSection")}
						</h3>
						<div className="flex flex-col gap-1">
							<Label htmlFor="stringCount" className="text-sm text-white/80">
								<span className="flex items-center justify-between">
									{t("controls.stringCountLabel")}
									<span className="text-xs text-white/60">{stringCount}</span>
								</span>
							</Label>
							<Slider
								id="stringCount"
								min={0}
								max={12}
								step={1}
								value={[stringCount]}
								onValueChange={values => setStringCount(values[0])}
							/>
						</div>

						<div className="flex flex-col gap-1">
							<Label htmlFor="stringWidth" className="text-sm text-white/80">
								<span className="flex items-center justify-between">
									{t("controls.stringWidthLabel")}
									<span className="text-xs text-white/60">{stringWidth}px</span>
								</span>
							</Label>
							<Slider
								id="stringWidth"
								min={0}
								max={10}
								step={0.01}
								value={[stringWidth]}
								onValueChange={values => setStringWidth(values[0])}
							/>
						</div>

						<div className="flex items-center justify-between gap-4">
							<Label htmlFor="stringColor" className="text-sm text-white/80">
								{t("controls.stringColorLabel")}
							</Label>
							<input
								id="stringColor"
								type="color"
								value={stringColor}
								onChange={e => setStringColor(e.target.value)}
								className="h-9 w-14 cursor-pointer rounded border border-white/20 bg-transparent"
							/>
						</div>

						<div className="flex items-center justify-between gap-4">
							<Label htmlFor="openStringColor" className="text-sm text-white/80">
								{t("controls.openStringColorLabel")}
							</Label>
							<input
								id="openStringColor"
								type="color"
								value={openStringColor}
								onChange={e => setOpenStringColor(e.target.value)}
								className="h-9 w-14 cursor-pointer rounded border border-white/20 bg-transparent"
							/>
						</div>

						<div className="flex items-center justify-between gap-4">
							<Label htmlFor="mutedStringColor" className="text-sm text-white/80">
								{t("controls.mutedStringColorLabel")}
							</Label>
							<input
								id="mutedStringColor"
								type="color"
								value={mutedStringColor}
								onChange={e => setMutedStringColor(e.target.value)}
								className="h-9 w-14 cursor-pointer rounded border border-white/20 bg-transparent"
							/>
						</div>
						<div className="flex flex-col gap-1">
							<Label htmlFor="stringIndicatorOffsetX" className="text-sm text-white/80">
								<span className="flex items-center justify-between">
									{t("controls.stringIndicatorOffsetXLabel")}
									<span className="text-xs text-white/60">{stringIndicatorOffsetX}</span>
								</span>
							</Label>
							<Slider
								id="stringIndicatorOffsetX"
								min={-50}
								max={50}
								step={0.01}
								value={[stringIndicatorOffsetX]}
								onValueChange={values => setStringIndicatorOffsetX(values[0])}
							/>
						</div>
						<div className="flex flex-col gap-1">
							<Label htmlFor="stringIndicatorOffsetY" className="text-sm text-white/80">
								<span className="flex items-center justify-between">
									{t("controls.stringIndicatorOffsetYLabel")}
									<span className="text-xs text-white/60">{stringIndicatorOffsetY}</span>
								</span>
							</Label>
							<Slider
								id="stringIndicatorOffsetY"
								min={-50}
								max={50}
								step={0.01}
								value={[stringIndicatorOffsetY]}
								onValueChange={values => setStringIndicatorOffsetY(values[0])}
							/>
						</div>
					</section>

					{/* Frets */}
					<section className="space-y-4">
						<h3 className="text-base mt-4 uppercase tracking-wide text-white/70">
							{t("controls.fretsSection")}
						</h3>
						<div className="flex flex-col gap-1">
							<Label htmlFor="fretCount" className="text-sm text-white/80">
								<span className="flex items-center justify-between">
									{t("controls.fretCountLabel")}
									<span className="text-xs text-white/60">{fretCount}</span>
								</span>
							</Label>
							<Slider
								id="fretCount"
								min={0}
								max={18}
								step={1}
								value={[fretCount]}
								onValueChange={values => setFretCount(values[0])}
							/>
						</div>

						<div className="flex flex-col gap-1">
							<Label htmlFor="fretWidth" className="text-sm text-white/80">
								<span className="flex items-center justify-between">
									{t("controls.fretWidthLabel")}
									<span className="text-xs text-white/60">{fretWidth}px</span>
								</span>
							</Label>
							<Slider
								id="fretWidth"
								min={0}
								max={100}
								step={1}
								value={[fretWidth]}
								onValueChange={values => setFretWidth(values[0])}
							/>
						</div>

						<div className="flex flex-col gap-1">
							<Label htmlFor="fretHeight" className="text-sm text-white/80">
								<span className="flex items-center justify-between">
									{t("controls.fretHeightLabel")}
									<span className="text-xs text-white/60">{fretHeight}px</span>
								</span>
							</Label>
							<Slider
								id="fretHeight"
								min={0}
								max={100}
								step={1}
								value={[fretHeight]}
								onValueChange={values => setFretHeight(values[0])}
							/>
						</div>

						<div className="flex flex-col gap-1">
							<Label htmlFor="fretTextSize" className="text-sm text-white/80">
								<span className="flex items-center justify-between">
									{t("controls.fretTextSizeLabel")}
									<span className="text-xs text-white/60">{fretTextSize}px</span>
								</span>
							</Label>
							<Slider
								id="fretTextSize"
								min={0}
								max={100}
								step={0.01}
								value={[fretTextSize]}
								onValueChange={values => setFretTextSize(values[0])}
							/>
						</div>

						<div className="flex items-center justify-between gap-4">
							<Label htmlFor="fretColor" className="text-sm text-white/80">
								{t("controls.fretColorLabel")}
							</Label>
							<input
								id="fretColor"
								type="color"
								value={fretColor}
								onChange={e => setFretColor(e.target.value)}
								className="h-9 w-14 cursor-pointer rounded border border-white/20 bg-transparent"
							/>
						</div>

						<div className="flex items-center justify-between gap-4">
							<Label htmlFor="fretTextColor" className="text-sm text-white/80">
								{t("controls.fretTextColorLabel")}
							</Label>
							<input
								id="fretTextColor"
								type="color"
								value={fretTextColor}
								onChange={e => setFretTextColor(e.target.value)}
								className="h-9 w-14 cursor-pointer rounded border border-white/20 bg-transparent"
							/>
						</div>
					</section>

					{/* Tuning */}
					<section className="space-y-4">
						<h3 className="text-base mt-4 uppercase tracking-wide text-white/70">
							{t("controls.tuningSection")}
						</h3>
						<div className="flex flex-col gap-1">
							<Label htmlFor="tuningTextSize" className="text-sm text-white/80">
								<span className="flex items-center justify-between">
									{t("controls.tuningTextSizeLabel")}
									<span className="text-xs text-white/60">{tuningTextSize}px</span>
								</span>
							</Label>
							<Slider
								id="tuningTextSize"
								min={0}
								max={100}
								step={0.01}
								value={[tuningTextSize]}
								onValueChange={values => setTuningTextSize(values[0])}
							/>
						</div>
						<div className="flex items-center justify-between gap-4">
							<Label htmlFor="tuningTextColor" className="text-sm text-white/80">
								{t("controls.tuningTextColorLabel")}
							</Label>
							<input
								id="tuningTextColor"
								type="color"
								value={tuningTextColor}
								onChange={e => setTuningTextColor(e.target.value)}
								className="h-9 w-14 cursor-pointer rounded border border-white/20 bg-transparent"
							/>
						</div>
						<div className="flex flex-col gap-1">
							<Label htmlFor="tuningLabelOffsetX" className="text-sm text-white/80">
								<span className="flex items-center justify-between">
									{t("controls.tuningLabelOffsetXLabel")}
									<span className="text-xs text-white/60">{tuningLabelOffsetX}</span>
								</span>
							</Label>
							<Slider
								id="tuningLabelOffsetX"
								min={-50}
								max={50}
								step={0.01}
								value={[tuningLabelOffsetX]}
								onValueChange={values => setTuningLabelOffsetX(values[0])}
							/>
						</div>
						<div className="flex flex-col gap-1">
							<Label htmlFor="tuningLabelOffsetY" className="text-sm text-white/80">
								<span className="flex items-center justify-between">
									{t("controls.tuningLabelOffsetYLabel")}
									<span className="text-xs text-white/60">{tuningLabelOffsetY}</span>
								</span>
							</Label>
							<Slider
								id="tuningLabelOffsetY"
								min={-50}
								max={50}
								step={0.01}
								value={[tuningLabelOffsetY]}
								onValueChange={values => setTuningLabelOffsetY(values[0])}
							/>
						</div>
						<div className="flex flex-col gap-1">
							<Label htmlFor="tuningLabelFormat" className="text-sm text-white/80">
								{t("controls.tuningLabelFormatLabel")}
							</Label>
							<Select
								value={tuningLabelFormat}
								onValueChange={value =>
									setTuningLabelFormat(value as "scientific" | "note-only")
								}
							>
								<SelectTrigger id="tuningLabelFormat">
									<SelectValue />
								</SelectTrigger>
								<SelectContent>
									<SelectItem value="scientific">
										{t("controls.tuningLabelFormatScientific")}
									</SelectItem>
									<SelectItem value="note-only">
										{t("controls.tuningLabelFormatNoteOnly")}
									</SelectItem>
								</SelectContent>
							</Select>
						</div>
					</section>

					{/* Dots (Fingers) */}
					<section className="space-y-4">
						<h3 className="text-base mt-4 uppercase tracking-wide text-white/70">
							{t("controls.dotsSection")}
						</h3>
						<div className="flex flex-col gap-1">
							<Label htmlFor="dotSize" className="text-sm text-white/80">
								<span className="flex items-center justify-between">
									{t("controls.dotSizeLabel")}
									<span className="text-xs text-white/60">{dotSize}px</span>
								</span>
							</Label>
							<Slider
								id="dotSize"
								min={0}
								max={50}
								step={0.01}
								value={[dotSize]}
								onValueChange={values => setDotSize(values[0])}
							/>
						</div>

						<div className="flex flex-col gap-1">
							<Label htmlFor="dotTextSize" className="text-sm text-white/80">
								<span className="flex items-center justify-between">
									{t("controls.dotTextSizeLabel")}
									<span className="text-xs text-white/60">{dotTextSize}px</span>
								</span>
							</Label>
							<Slider
								id="dotTextSize"
								min={0}
								max={100}
								step={0.01}
								value={[dotTextSize]}
								onValueChange={values => setDotTextSize(values[0])}
							/>
						</div>

						<div className="flex items-center justify-between gap-4">
							<Label htmlFor="dotColor" className="text-sm text-white/80">
								{t("controls.dotColorLabel")}
							</Label>
							<input
								id="dotColor"
								type="color"
								value={dotColor}
								onChange={e => setDotColor(e.target.value)}
								className="h-9 w-14 cursor-pointer rounded border border-white/20 bg-transparent"
							/>
						</div>

						<div className="flex items-center justify-between gap-4">
							<Label htmlFor="dotTextColor" className="text-sm text-white/80">
								{t("controls.dotTextColorLabel")}
							</Label>
							<input
								id="dotTextColor"
								type="color"
								value={dotTextColor}
								onChange={e => setDotTextColor(e.target.value)}
								className="h-9 w-14 cursor-pointer rounded border border-white/20 bg-transparent"
							/>
						</div>
					</section>

					{/* Barres */}
					<section className="space-y-4">
						<h3 className="text-base mt-4 uppercase tracking-wide text-white/70">
							{t("controls.barresSection")}
						</h3>
						<div className="flex flex-col gap-1">
							<Label htmlFor="barreHeight" className="text-sm text-white/80">
								<span className="flex items-center justify-between">
									{t("controls.barreHeightLabel")}
									<span className="text-xs text-white/60">{barreHeight}px</span>
								</span>
							</Label>
							<Slider
								id="barreHeight"
								min={0}
								max={28}
								value={[barreHeight]}
								onValueChange={values => setBarreHeight(values[0])}
							/>
						</div>
						<div className="flex items-center justify-between gap-4">
							<Label htmlFor="barreColor" className="text-sm text-white/80">
								{t("controls.barreColorLabel")}
							</Label>
							<input
								id="barreColor"
								type="color"
								value={barreColor}
								onChange={e => setBarreColor(e.target.value)}
								className="h-9 w-14 cursor-pointer rounded border border-white/20 bg-transparent"
							/>
						</div>
						<div className="flex flex-col gap-1">
							<Label htmlFor="barresWidth" className="text-sm text-white/80">
								<span className="flex items-center justify-between">
									{t("controls.barresWidthLabel")}
									<span className="text-xs text-white/60">{barresWidth}px</span>
								</span>
							</Label>
							<Slider
								id="barresWidth"
								min={0}
								max={100}
								value={[barresWidth]}
								onValueChange={values => setBarresWidth(values[0])}
							/>
						</div>
						<div className="flex flex-col gap-1">
							<Label htmlFor="barresOpacity" className="text-sm text-white/80">
								<span className="flex items-center justify-between">
									{t("controls.barresOpacityLabel")}
									<span className="text-xs text-white/60">{barresOpacity}</span>
								</span>
							</Label>
							<Slider
								id="barresOpacity"
								min={0}
								max={100}
								value={[barresOpacity]}
								onValueChange={values => setBarresOpacity(values[0])}
							/>
						</div>
						<div className="flex flex-col gap-1">
							<Label htmlFor="barresOffsetX" className="text-sm text-white/80">
								<span className="flex items-center justify-between">
									{t("controls.barresOffsetXLabel")}
									<span className="text-xs text-white/60">{barresOffsetX}</span>
								</span>
							</Label>
							<Slider
								id="barresOffsetX"
								min={-50}
								max={50}
								step={0.01}
								value={[barresOffsetX]}
								onValueChange={values => setBarresOffsetX(values[0])}
							/>
						</div>
						<div className="flex flex-col gap-1">
							<Label htmlFor="barresOffsetY" className="text-sm text-white/80">
								<span className="flex items-center justify-between">
									{t("controls.barresOffsetYLabel")}
									<span className="text-xs text-white/60">{barresOffsetY}</span>
								</span>
							</Label>
							<Slider
								id="barresOffsetY"
								min={-50}
								max={50}
								step={0.01}
								value={[barresOffsetY]}
								onValueChange={values => setBarresOffsetY(values[0])}
							/>
						</div>
					</section>

					{/* Fret Numbers */}
					<section className="space-y-4">
						<h3 className="text-base mt-4 uppercase tracking-wide text-white/70">
							{t("controls.fretNumbersSection")}
						</h3>
						<div className="flex flex-col gap-1">
							<Label htmlFor="fretTextOffsetX" className="text-sm text-white/80">
								<span className="flex items-center justify-between">
									{t("controls.fretTextOffsetXLabel")}
									<span className="text-xs text-white/60">{fretTextOffsetX}</span>
								</span>
							</Label>
							<Slider
								id="fretTextOffsetX"
								min={-100}
								max={100}
								step={0.01}
								value={[fretTextOffsetX]}
								onValueChange={values => setFretTextOffsetX(values[0])}
							/>
						</div>
						<div className="flex flex-col gap-1">
							<Label htmlFor="fretTextOffsetY" className="text-sm text-white/80">
								<span className="flex items-center justify-between">
									{t("controls.fretTextOffsetYLabel")}
									<span className="text-xs text-white/60">{fretTextOffsetY}</span>
								</span>
							</Label>
							<Slider
								id="fretTextOffsetY"
								min={-50}
								max={50}
								step={0.01}
								value={[fretTextOffsetY]}
								onValueChange={values => setFretTextOffsetY(values[0])}
							/>
						</div>
					</section>

					{/* Nut (Fret Zero) */}
					<section className="space-y-4">
						<h3 className="text-base mt-4 uppercase tracking-wide text-white/70">
							{t("controls.nutSection")}
						</h3>
						<div className="flex flex-col gap-1">
							<Label htmlFor="nutStrokeWidth" className="text-sm text-white/80">
								<span className="flex items-center justify-between">
									{t("controls.nutStrokeWidthLabel")}
									<span className="text-xs text-white/60">{nutStrokeWidth}</span>
								</span>
							</Label>
							<Slider
								id="nutStrokeWidth"
								min={0}
								max={50}
								step={0.01}
								value={[nutStrokeWidth]}
								onValueChange={values => setNutStrokeWidth(values[0])}
							/>
						</div>
						<div className="flex flex-col gap-1">
							<Label htmlFor="nutOffsetX" className="text-sm text-white/80">
								<span className="flex items-center justify-between">
									{t("controls.nutOffsetXLabel")}
									<span className="text-xs text-white/60">{nutOffsetX}</span>
								</span>
							</Label>
							<Slider
								id="nutOffsetX"
								min={-50}
								max={50}
								step={0.01}
								value={[nutOffsetX]}
								onValueChange={values => setNutOffsetX(values[0])}
							/>
						</div>
						<div className="flex flex-col gap-1">
							<Label htmlFor="nutOffsetY" className="text-sm text-white/80">
								<span className="flex items-center justify-between">
									{t("controls.nutOffsetYLabel")}
									<span className="text-xs text-white/60">{nutOffsetY}</span>
								</span>
							</Label>
							<Slider
								id="nutOffsetY"
								min={-50}
								max={50}
								step={0.01}
								value={[nutOffsetY]}
								onValueChange={values => setNutOffsetY(values[0])}
							/>
						</div>
						<div className="flex flex-col gap-1">
							<Label htmlFor="nutOpacity" className="text-sm text-white/80">
								<span className="flex items-center justify-between">
									{t("controls.nutOpacityLabel")}
									<span className="text-xs text-white/60">{nutOpacity}</span>
								</span>
							</Label>
							<Slider
								id="nutOpacity"
								min={0}
								max={100}
								step={0.01}
								value={[nutOpacity]}
								onValueChange={values => setNutOpacity(values[0])}
							/>
						</div>
						<div className="flex items-center justify-between gap-4">
							<Label htmlFor="nutColor" className="text-sm text-white/80">
								{t("controls.nutColorLabel")}
							</Label>
							<input
								id="nutColor"
								type="color"
								value={nutColor}
								onChange={e => setNutColor(e.target.value)}
								className="h-9 w-14 cursor-pointer rounded border border-white/20 bg-transparent"
							/>
						</div>
					</section>

					{/* Canvas Positioning */}
					<section className="space-y-4">
						<h3 className="text-base mt-4 uppercase tracking-wide text-white/70">
							{t("controls.canvasSection")}
						</h3>
						<div className="flex flex-col gap-1">
							<Label htmlFor="canvasOffsetX" className="text-sm text-white/80">
								<span className="flex items-center justify-between">
									{t("controls.canvasOffsetXLabel")}
									<span className="text-xs text-white/60">{canvasOffsetX}px</span>
								</span>
							</Label>
							<Slider
								id="canvasOffsetX"
								min={-100}
								max={100}
								step={0.01}
								value={[canvasOffsetX]}
								onValueChange={values => setCanvasOffsetX(values[0])}
							/>
						</div>
						<div className="flex flex-col gap-1">
							<Label htmlFor="canvasOffsetY" className="text-sm text-white/80">
								<span className="flex items-center justify-between">
									{t("controls.canvasOffsetYLabel")}
									<span className="text-xs text-white/60">{canvasOffsetY}px</span>
								</span>
							</Label>
							<Slider
								id="canvasOffsetY"
								min={-100}
								max={100}
								step={0.01}
								value={[canvasOffsetY]}
								onValueChange={values => setCanvasOffsetY(values[0])}
							/>
						</div>
					</section>

					{/* Language */}
					<section className="space-y-4">
						<h3 className="text-base mt-4 uppercase tracking-wide text-white/70">
							{t("language")}
						</h3>
						<RadioGroup value={lang} onValueChange={value => setLang(value as "en" | "pt")}>
							<div className="flex items-center space-x-2">
								<RadioGroupItem value="en" id="lang-en" />
								<Label htmlFor="lang-en" className="text-sm text-white/80 font-normal">
									{t("language.en")}
								</Label>
							</div>
							<div className="flex items-center space-x-2">
								<RadioGroupItem value="pt" id="lang-pt" />
								<Label htmlFor="lang-pt" className="text-sm text-white/80 font-normal">
									{t("language.pt")}
								</Label>
							</div>
						</RadioGroup>
					</section>
				</aside>
			</div>
		</div>
	);
}

export default App;
