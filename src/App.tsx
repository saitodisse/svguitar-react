import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { useQueryState, parseAsInteger, parseAsString, parseAsStringLiteral } from "nuqs";
import { ChordDiagram } from "./components/ChordDiagram/ChordDiagram";
import type { ChordDiagramProps } from "./components/ChordDiagram/types";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { PresetsSidebar } from "@/components/PresetsSidebar";
import type { PresetConfig } from "@/utils/storyPresets";

// Type para configuração padrão baseado nas props do ChordDiagram
type DefaultConfig = Required<
	Pick<
		ChordDiagramProps,
		| "width"
		| "height"
		| "fretWidth"
		| "fretCount"
		| "dotTextSize"
		| "dotSize"
		| "barreHeight"
		| "fretHeight"
		| "tuningTextSize"
		| "fretTextSize"
		| "stringWidth"
		| "stringCount"
		| "fretTextColor"
		| "backgroundColor"
		| "fretColor"
		| "stringColor"
		| "dotColor"
		| "dotTextColor"
		| "barreColor"
		| "tuningTextColor"
		| "openStringColor"
		| "mutedStringColor"
		| "fontFamily"
		| "tuningLabelFormat"
	>
> & {
	chord: string;
	tuningLabelOffset: number;
	stringIndicatorOffset: number;
	canvasOffsetX?: number;
	canvasOffsetY?: number;
	tuningLabelOffsetX?: number;
	tuningLabelOffsetY?: number;
	stringIndicatorOffsetX?: number;
	nutStrokeWidth?: number;
	nutColor?: string;
	stringIndicatorOffsetY?: number;
	fretTextOffsetY?: number;
	fretTextOffsetX?: number;
};

// Type para as chaves de configuração
type ConfigKey = "mobileHorizontal" | "mobileVertical" | "desktopHorizontal" | "desktopVertical";

// Configurações padrão - extraídas para constantes
const DEFAULT_CONFIGS: Record<ConfigKey, DefaultConfig> = {
	mobileHorizontal: {
		width: 304,
		height: 222,
		fretWidth: 53,
		fretCount: 4,
		dotTextSize: 17,
		dotSize: 20,
		barreHeight: 6,
		fretHeight: 27,
		tuningTextSize: 20,
		fretTextSize: 21,
		stringWidth: 2,
		stringCount: 6,
		fretTextColor: "#636363",
		backgroundColor: "#242424",
		fretColor: "#bfbfbf",
		stringColor: "#ffffff",
		dotColor: "#2196F3",
		dotTextColor: "#ffffff",
		barreColor: "#2196F3",
		tuningTextColor: "#575757",
		openStringColor: "#2196F3",
		mutedStringColor: "#C65858",
		fontFamily: "Arial, sans-serif",
		chord: "x32010",
		tuningLabelOffset: 0.5,
		tuningLabelFormat: "note-only",
		stringIndicatorOffset: 0.5,
		canvasOffsetX: 21,
		canvasOffsetY: -11,
		fretTextOffsetY: 21,
		tuningLabelOffsetY: 4,
		tuningLabelOffsetX: 75,
		stringIndicatorOffsetX: 21,
	},
	mobileVertical: {
		width: 182,
		height: 270,
		fretWidth: 25,
		fretCount: 4,
		dotTextSize: 11,
		dotSize: 18,
		barreHeight: 6,
		fretHeight: 47,
		tuningTextSize: 13,
		fretTextSize: 13,
		stringWidth: 2,
		stringCount: 6,
		fretTextColor: "#5e5e5e",
		backgroundColor: "#242424",
		fretColor: "#bfbfbf",
		stringColor: "#ffffff",
		dotColor: "#2196F3",
		dotTextColor: "#ffffff",
		barreColor: "#2196F3",
		tuningTextColor: "#707070",
		openStringColor: "#2196F3",
		mutedStringColor: "#C65858",
		fontFamily: "Arial, sans-serif",
		chord: "x32010",
		tuningLabelOffset: 0.5,
		tuningLabelFormat: "note-only",
		stringIndicatorOffset: 0.5,
		canvasOffsetX: -23,
		tuningLabelOffsetX: 1,
		tuningLabelOffsetY: 57,
		stringIndicatorOffsetX: 16,
		fretTextOffsetX: -5,
	},
	desktopHorizontal: {
		width: 702,
		height: 217,
		fretWidth: 63,
		fretCount: 10,
		dotTextSize: 13,
		dotSize: 16,
		barreHeight: 7,
		fretHeight: 30,
		tuningTextSize: 13,
		fretTextSize: 16,
		fretTextColor: "#4a4a4a",
		stringWidth: 1,
		stringCount: 6,
		backgroundColor: "#242424",
		fretColor: "#bfbfbf",
		stringColor: "#ffffff",
		dotColor: "#2196F3",
		dotTextColor: "#ffffff",
		barreColor: "#2196F3",
		tuningTextColor: "#707070",
		openStringColor: "#2196F3",
		mutedStringColor: "#C65858",
		fontFamily: "Arial, sans-serif",
		chord: "x32010",
		tuningLabelOffset: 0.5,
		tuningLabelFormat: "scientific",
		stringIndicatorOffset: 0.5,
		tuningLabelOffsetX: 48,
		tuningLabelOffsetY: 5,
		stringIndicatorOffsetX: 5,
		canvasOffsetY: -9,
		fretTextOffsetY: 35,
	},
	desktopVertical: {
		width: 166,
		height: 296,
		fretWidth: 24,
		fretCount: 5,
		dotTextSize: 13,
		dotSize: 16,
		barreHeight: 5,
		fretHeight: 46,
		tuningTextSize: 13,
		fretTextSize: 14,
		fretTextColor: "#4a4a4a",
		stringWidth: 1,
		stringCount: 6,
		backgroundColor: "#242424",
		fretColor: "#bfbfbf",
		stringColor: "#ffffff",
		dotColor: "#2196F3",
		dotTextColor: "#ffffff",
		barreColor: "#2196F3",
		tuningTextColor: "#4d4d4d",
		openStringColor: "#2196F3",
		mutedStringColor: "#C65858",
		fontFamily: "Arial, sans-serif",
		chord: "x32010",
		tuningLabelOffset: 0.5,
		tuningLabelFormat: "note-only",
		stringIndicatorOffset: 0.5,
		canvasOffsetX: -30,
		tuningLabelOffsetX: 5,
		tuningLabelOffsetY: 61,
		nutStrokeWidth: 218,
		nutColor: "#878787",
		stringIndicatorOffsetY: 25,
		fretTextOffsetY: 9,
		fretTextOffsetX: 7,
	},
} as const;

// Hook para detectar se está em modo mobile
function useIsMobile() {
	const [isMobile, setIsMobile] = useState(false);

	useEffect(() => {
		const checkIsMobile = () => {
			setIsMobile(window.innerWidth <= 960);
		};

		// Verifica no carregamento inicial
		checkIsMobile();

		// Adiciona listener para mudanças de tamanho
		window.addEventListener("resize", checkIsMobile);

		// Cleanup
		return () => window.removeEventListener("resize", checkIsMobile);
	}, []);

	return isMobile;
}

// Interface tipada para o componente com tratamento de erro
interface ChordDiagramWithErrorHandlingProps extends Omit<ChordDiagramProps, "instrument" | "chord"> {
	chord: string;
	instrument?: ChordDiagramProps["instrument"];
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
	const isMobile = useIsMobile();
	const [lang, setLang] = useQueryState("lang", parseAsStringLiteral(["en", "pt"]).withDefault("en"));

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

	// Aplica configurações padrão baseadas no modo mobile/desktop
	const defaults = useMemo(() => {
		const isHorizontal = view === "horizontal-right" || view === "horizontal-left";
		const deviceKey = isMobile ? "mobile" : "desktop";
		const orientationKey = isHorizontal ? "Horizontal" : "Vertical";

		return DEFAULT_CONFIGS[`${deviceKey}${orientationKey}` as keyof typeof DEFAULT_CONFIGS];
	}, [view, isMobile]);

	const [chord, setChord] = useQueryState("chord", parseAsString.withDefault(defaults.chord));

	// Barre configuration
	const [barreEnabled, setBarreEnabled] = useQueryState("barreEnabled", parseAsInteger.withDefault(0));
	const [barreFret, setBarreFret] = useQueryState("barreFret", parseAsInteger.withDefault(1));
	const [barreFromString, setBarreFromString] = useQueryState(
		"barreFromString",
		parseAsInteger.withDefault(1)
	);
	const [barreToString, setBarreToString] = useQueryState("barreToString", parseAsInteger.withDefault(6));

	const [width, setWidth] = useQueryState("width", parseAsInteger.withDefault(defaults.width));
	const [height, setHeight] = useQueryState("height", parseAsInteger.withDefault(defaults.height));
	const [fretCount, setFretCount] = useQueryState(
		"fretCount",
		parseAsInteger.withDefault(defaults.fretCount)
	);
	const [stringCount, setStringCount] = useQueryState(
		"stringCount",
		parseAsInteger.withDefault(defaults.stringCount)
	);
	const [fretWidth, setFretWidth] = useQueryState(
		"fretWidth",
		parseAsInteger.withDefault(defaults.fretWidth)
	);
	const [fretHeight, setFretHeight] = useQueryState(
		"fretHeight",
		parseAsInteger.withDefault(defaults.fretHeight)
	);
	const [stringWidth, setStringWidth] = useQueryState(
		"stringWidth",
		parseAsInteger.withDefault(defaults.stringWidth)
	);
	const [dotSize, setDotSize] = useQueryState("dotSize", parseAsInteger.withDefault(defaults.dotSize));
	const [barreHeight, setBarreHeight] = useQueryState(
		"barreHeight",
		parseAsInteger.withDefault(defaults.barreHeight)
	);
	const [backgroundColor, setBackgroundColor] = useQueryState(
		"backgroundColor",
		parseAsString.withDefault(defaults.backgroundColor)
	);
	const [fretColor, setFretColor] = useQueryState(
		"fretColor",
		parseAsString.withDefault(defaults.fretColor)
	);
	const [stringColor, setStringColor] = useQueryState(
		"stringColor",
		parseAsString.withDefault(defaults.stringColor)
	);
	const [dotColor, setDotColor] = useQueryState("dotColor", parseAsString.withDefault(defaults.dotColor));
	const [dotTextColor, setDotTextColor] = useQueryState(
		"dotTextColor",
		parseAsString.withDefault(defaults.dotTextColor)
	);
	const [barreColor, setBarreColor] = useQueryState(
		"barreColor",
		parseAsString.withDefault(defaults.barreColor)
	);
	const [fretTextColor, setFretTextColor] = useQueryState(
		"fretTextColor",
		parseAsString.withDefault(defaults.fretTextColor)
	);
	const [tuningTextColor, setTuningTextColor] = useQueryState(
		"tuningTextColor",
		parseAsString.withDefault(defaults.tuningTextColor)
	);
	const [openStringColor, setOpenStringColor] = useQueryState(
		"openStringColor",
		parseAsString.withDefault(defaults.openStringColor)
	);
	const [mutedStringColor, setMutedStringColor] = useQueryState(
		"mutedStringColor",
		parseAsString.withDefault(defaults.mutedStringColor)
	);
	const [fontFamily, setFontFamily] = useQueryState(
		"fontFamily",
		parseAsString.withDefault(defaults.fontFamily)
	);
	const [dotTextSize, setDotTextSize] = useQueryState(
		"dotTextSize",
		parseAsInteger.withDefault(defaults.dotTextSize)
	);
	const [fretTextSize, setFretTextSize] = useQueryState(
		"fretTextSize",
		parseAsInteger.withDefault(defaults.fretTextSize)
	);
	const [tuningTextSize, setTuningTextSize] = useQueryState(
		"tuningTextSize",
		parseAsInteger.withDefault(defaults.tuningTextSize)
	);
	// Tuning customization
	const [tuningLabelOffsetX, setTuningLabelOffsetX] = useQueryState(
		"tuningLabelOffsetX",
		parseAsInteger.withDefault(
			defaults.tuningLabelOffsetX ?? Math.round(defaults.tuningLabelOffset * 100)
		)
	);
	const [tuningLabelOffsetY, setTuningLabelOffsetY] = useQueryState(
		"tuningLabelOffsetY",
		parseAsInteger.withDefault(
			defaults.tuningLabelOffsetY ?? Math.round(defaults.tuningLabelOffset * 100)
		)
	);
	const [tuningLabelFormat, setTuningLabelFormat] = useQueryState(
		"tuningLabelFormat",
		parseAsStringLiteral(["scientific", "note-only"]).withDefault(defaults.tuningLabelFormat)
	);

	// String indicators customization
	const [stringIndicatorOffsetX, setStringIndicatorOffsetX] = useQueryState(
		"stringIndicatorOffsetX",
		parseAsInteger.withDefault(
			defaults.stringIndicatorOffsetX ?? Math.round(defaults.stringIndicatorOffset * 100)
		)
	);
	const [stringIndicatorOffsetY, setStringIndicatorOffsetY] = useQueryState(
		"stringIndicatorOffsetY",
		parseAsInteger.withDefault(defaults.stringIndicatorOffsetY ?? 0)
	);

	// Barres customization
	const [barresWidth, setBarresWidth] = useQueryState("barresWidth", parseAsInteger.withDefault(8));
	const [barresOpacity, setBarresOpacity] = useQueryState("barresOpacity", parseAsInteger.withDefault(100));
	const [barresOffsetX, setBarresOffsetX] = useQueryState("barresOffsetX", parseAsInteger.withDefault(0));
	const [barresOffsetY, setBarresOffsetY] = useQueryState("barresOffsetY", parseAsInteger.withDefault(0));

	// Fret numbers customization
	const [fretTextOffsetX, setFretTextOffsetX] = useQueryState(
		"fretTextOffsetX",
		parseAsInteger.withDefault(defaults.fretTextOffsetX ?? 0)
	);
	const [fretTextOffsetY, setFretTextOffsetY] = useQueryState(
		"fretTextOffsetY",
		parseAsInteger.withDefault(defaults.fretTextOffsetY ?? 0)
	);

	// Nut customization
	const [nutStrokeWidth, setNutStrokeWidth] = useQueryState(
		"nutStrokeWidth",
		parseAsInteger.withDefault(defaults.nutStrokeWidth ?? 75)
	);
	const [nutOffsetX, setNutOffsetX] = useQueryState("nutOffsetX", parseAsInteger.withDefault(0));
	const [nutOffsetY, setNutOffsetY] = useQueryState("nutOffsetY", parseAsInteger.withDefault(0));
	const [nutOpacity, setNutOpacity] = useQueryState("nutOpacity", parseAsInteger.withDefault(100));
	const [nutColor, setNutColor] = useQueryState(
		"nutColor",
		parseAsString.withDefault(defaults.nutColor ?? "#333333")
	);

	// Canvas positioning
	const [canvasOffsetX, setCanvasOffsetX] = useQueryState(
		"canvasOffsetX",
		parseAsInteger.withDefault(defaults.canvasOffsetX ?? 0)
	);
	const [canvasOffsetY, setCanvasOffsetY] = useQueryState(
		"canvasOffsetY",
		parseAsInteger.withDefault(defaults.canvasOffsetY ?? 0)
	);

	// Função para limpar a configuração e manter apenas view e lang
	const clearConfiguration = () => {
		// Reset all parameters to their default values using current defaults
		setChord(defaults.chord);
		// Barre
		setBarreEnabled(0);
		setBarreFret(1);
		setBarreFromString(1);
		setBarreToString(6);
		setWidth(defaults.width);
		setHeight(defaults.height);
		setFretCount(defaults.fretCount);
		setStringCount(defaults.stringCount);
		setFretWidth(defaults.fretWidth);
		setFretHeight(defaults.fretHeight);
		setStringWidth(defaults.stringWidth);
		setDotSize(defaults.dotSize);
		setBarreHeight(defaults.barreHeight);
		setBackgroundColor(defaults.backgroundColor);
		setFretColor(defaults.fretColor);
		setStringColor(defaults.stringColor);
		setDotColor(defaults.dotColor);
		setDotTextColor(defaults.dotTextColor);
		setBarreColor(defaults.barreColor);
		setFretTextColor(defaults.fretTextColor);
		setTuningTextColor(defaults.tuningTextColor);
		setOpenStringColor(defaults.openStringColor);
		setMutedStringColor(defaults.mutedStringColor);
		setFontFamily(defaults.fontFamily);
		setDotTextSize(defaults.dotTextSize);
		setFretTextSize(defaults.fretTextSize);
		setTuningTextSize(defaults.tuningTextSize);
		// Tuning
		setTuningLabelOffsetX(defaults.tuningLabelOffsetX ?? Math.round(defaults.tuningLabelOffset * 100));
		setTuningLabelOffsetY(defaults.tuningLabelOffsetY ?? Math.round(defaults.tuningLabelOffset * 100));
		setTuningLabelFormat(defaults.tuningLabelFormat);
		// String indicators
		setStringIndicatorOffsetX(
			defaults.stringIndicatorOffsetX ?? Math.round(defaults.stringIndicatorOffset * 100)
		);
		setStringIndicatorOffsetY(defaults.stringIndicatorOffsetY ?? 0);
		// Barres
		setBarresWidth(8);
		setBarresOpacity(100);
		setBarresOffsetX(0);
		setBarresOffsetY(0);
		// Fret numbers
		setFretTextOffsetX(defaults.fretTextOffsetX ?? 0);
		setFretTextOffsetY(defaults.fretTextOffsetY ?? 0);
		// Nut
		setNutStrokeWidth(defaults.nutStrokeWidth ?? 75);
		setNutOffsetX(0);
		setNutOffsetY(0);
		setNutOpacity(100);
		setNutColor(defaults.nutColor ?? "#333333");
		// Canvas
		setCanvasOffsetX(defaults.canvasOffsetX ?? 0);
		setCanvasOffsetY(defaults.canvasOffsetY ?? 0);
	};

	// Função para carregar preset
	const loadPreset = (preset: PresetConfig) => {
		const props = preset.props;

		// Extract chord notation from either chord or instrument
		let chordNotation = "x32010"; // default
		if (props.instrument?.chord) {
			chordNotation = props.instrument.chord;
		}

		// Set all properties
		setChord(chordNotation);

		// Extract barre information from chord object
		if (props.chord?.barres && props.chord.barres.length > 0) {
			const firstBarre = props.chord.barres[0];
			setBarreEnabled(1);
			setBarreFret(firstBarre.fret);
			setBarreFromString(firstBarre.fromString);
			setBarreToString(firstBarre.toString);
		} else {
			setBarreEnabled(0);
		}

		// View
		if (props.view) {
			setView(props.view);
		}

		// Dimensions
		if (props.width !== undefined) setWidth(props.width);
		if (props.height !== undefined) setHeight(props.height);
		if (props.fretCount !== undefined) setFretCount(props.fretCount);
		if (props.stringCount !== undefined) setStringCount(props.stringCount);
		if (props.fretWidth !== undefined) setFretWidth(props.fretWidth);
		if (props.fretHeight !== undefined) setFretHeight(props.fretHeight);
		if (props.stringWidth !== undefined) setStringWidth(props.stringWidth);
		if (props.dotSize !== undefined) setDotSize(props.dotSize);
		if (props.barreHeight !== undefined) setBarreHeight(props.barreHeight);

		// Colors
		if (props.backgroundColor !== undefined) setBackgroundColor(props.backgroundColor);
		if (props.fretColor !== undefined) setFretColor(props.fretColor);
		if (props.stringColor !== undefined) setStringColor(props.stringColor);
		if (props.dotColor !== undefined) setDotColor(props.dotColor);
		if (props.dotTextColor !== undefined) setDotTextColor(props.dotTextColor);
		if (props.barreColor !== undefined) setBarreColor(props.barreColor);
		if (props.fretTextColor !== undefined) setFretTextColor(props.fretTextColor);
		if (props.tuningTextColor !== undefined) setTuningTextColor(props.tuningTextColor);
		if (props.openStringColor !== undefined) setOpenStringColor(props.openStringColor);
		if (props.mutedStringColor !== undefined) setMutedStringColor(props.mutedStringColor);

		// Fonts
		if (props.fontFamily !== undefined) setFontFamily(props.fontFamily);
		if (props.dotTextSize !== undefined) setDotTextSize(props.dotTextSize);
		if (props.fretTextSize !== undefined) setFretTextSize(props.fretTextSize);
		if (props.tuningTextSize !== undefined) setTuningTextSize(props.tuningTextSize);

		// Tuning customization - convert from decimal to integer (multiply by 100)
		if (props.tuningLabelOffsetX !== undefined)
			setTuningLabelOffsetX(Math.round(props.tuningLabelOffsetX * 100));
		if (props.tuningLabelOffsetY !== undefined)
			setTuningLabelOffsetY(Math.round(props.tuningLabelOffsetY * 100));
		if (props.tuningLabelFormat !== undefined) setTuningLabelFormat(props.tuningLabelFormat);

		// String indicators - convert from decimal to integer (multiply by 100)
		if (props.stringIndicatorOffsetX !== undefined)
			setStringIndicatorOffsetX(Math.round(props.stringIndicatorOffsetX * 100));
		if (props.stringIndicatorOffsetY !== undefined)
			setStringIndicatorOffsetY(Math.round(props.stringIndicatorOffsetY * 100));

		// Barres customization
		if (props.barresWidth !== undefined) setBarresWidth(props.barresWidth);
		if (props.barresOpacity !== undefined) setBarresOpacity(Math.round(props.barresOpacity * 100));
		if (props.barresOffsetX !== undefined) setBarresOffsetX(Math.round(props.barresOffsetX * 100));
		if (props.barresOffsetY !== undefined) setBarresOffsetY(Math.round(props.barresOffsetY * 100));

		// Fret numbers - convert from decimal to integer (multiply by 100)
		if (props.fretTextOffsetX !== undefined) setFretTextOffsetX(Math.round(props.fretTextOffsetX * 100));
		if (props.fretTextOffsetY !== undefined) setFretTextOffsetY(Math.round(props.fretTextOffsetY * 100));

		// Nut customization
		setNutStrokeWidth(props.nutStrokeWidth !== undefined ? Math.round(props.nutStrokeWidth * 1000) : 75);
		setNutOffsetX(props.nutOffsetX !== undefined ? Math.round(props.nutOffsetX * 100) : 0);
		setNutOffsetY(props.nutOffsetY !== undefined ? Math.round(props.nutOffsetY * 100) : 0);
		setNutOpacity(props.nutOpacity !== undefined ? Math.round(props.nutOpacity * 100) : 100);
		setNutColor(props.nutColor !== undefined ? props.nutColor : "#333333");

		// Canvas positioning
		if (props.canvasOffsetX !== undefined) setCanvasOffsetX(props.canvasOffsetX);
		if (props.canvasOffsetY !== undefined) setCanvasOffsetY(props.canvasOffsetY);
	};

	// Construct chord object with barre if enabled
	const chordObject = useMemo(() => {
		// Parse the fret notation to get fingers
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

		// Add barre if enabled
		const barres: { fret: number; fromString: number; toString: number }[] = [];
		if (barreEnabled === 1) {
			barres.push({
				fret: barreFret,
				fromString: barreFromString,
				toString: barreToString,
			});
		}

		return { fingers, barres };
	}, [chord, barreEnabled, barreFret, barreFromString, barreToString]);

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

			<div className="grid w-full items-start gap-6 lg:grid-cols-[280px_minmax(0,1fr)_360px]">
				{/* Left Sidebar - Presets */}
				<div className="hidden lg:block">
					<PresetsSidebar onSelectPreset={loadPreset} />
				</div>

				{/* Main Content - Chord Diagram */}
				<div className="flex flex-col gap-4 rounded-xl border border-white/10 bg-white/5 p-4 shadow-lg backdrop-blur-sm">
					<ChordDiagram
						chord={chordObject}
						instrument={{
							tuning: ["E2", "A2", "D3", "G3", "B3", "E4"],
						}}
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
						tuningLabelOffsetX={tuningLabelOffsetX / 100}
						tuningLabelOffsetY={tuningLabelOffsetY / 100}
						tuningLabelFormat={tuningLabelFormat}
						// String indicators customization
						stringIndicatorOffsetX={stringIndicatorOffsetX / 100}
						stringIndicatorOffsetY={stringIndicatorOffsetY / 100}
						// Barres customization
						barresWidth={barresWidth}
						barresOpacity={barresOpacity / 100}
						barresOffsetX={barresOffsetX / 100}
						barresOffsetY={barresOffsetY / 100}
						// Fret numbers customization
						fretTextOffsetX={fretTextOffsetX / 100}
						fretTextOffsetY={fretTextOffsetY / 100}
						// Nut customization
						nutStrokeWidth={nutStrokeWidth / 1000}
						nutOffsetX={nutOffsetX / 100}
						nutOffsetY={nutOffsetY / 100}
						nutOpacity={nutOpacity / 100}
						nutColor={nutColor}
						// Canvas positioning
						canvasOffsetX={canvasOffsetX}
						canvasOffsetY={canvasOffsetY}
					/>
				</div>

				{/* Right Sidebar - Controls */}
				<aside
					className="flex max-h-[calc(100vh-200px)] flex-col gap-6 overflow-y-auto rounded-xl border border-white/10 bg-white/5 p-5 shadow-lg backdrop-blur-sm"
					aria-label={t("aria.controlPanel")}
				>
					<div className="flex items-center justify-between">
						<h2 className="text-xl font-semibold">{t("controls.title")}</h2>
						<Button onClick={clearConfiguration} variant="outline" size="sm" className="text-xs">
							{t("controls.clearConfig")}
						</Button>
					</div>

					{/* Chord Input */}
					<section className="space-y-4">
						<h3 className="text-xs uppercase tracking-wide text-white/70">
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
						<h3 className="text-xs uppercase tracking-wide text-white/70">Barre</h3>
						<div className="flex items-center space-x-2">
							<input
								id="barreEnabled"
								type="checkbox"
								checked={barreEnabled === 1}
								onChange={e => setBarreEnabled(e.target.checked ? 1 : 0)}
								className="h-4 w-4 cursor-pointer rounded border border-white/20 bg-transparent"
							/>
							<Label htmlFor="barreEnabled" className="text-sm text-white/80">
								Enable Barre
							</Label>
						</div>
						{barreEnabled === 1 && (
							<>
								<div className="flex flex-col gap-1">
									<Label htmlFor="barreFret" className="text-sm text-white/80">
										<span className="flex items-center justify-between">
											Barre Fret (Casa)
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
											From String (Corda Inicial)
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
											To String (Corda Final)
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
						<h3 className="text-xs uppercase tracking-wide text-white/70">
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
						{[
							{
								id: "width",
								title: t("controls.widthLabel"),
								value: `${width}px`,
								onChange: (value: number) => setWidth(value),
								min: 0,
								max: 1000,
								source: width,
							},
							{
								id: "height",
								title: t("controls.heightLabel"),
								value: `${height}px`,
								onChange: (value: number) => setHeight(value),
								min: 0,
								max: 1000,
								source: height,
							},
						].map(control => (
							<div key={control.id} className="flex flex-col gap-1">
								<Label htmlFor={control.id} className="text-sm text-white/80">
									<span className="flex items-center justify-between">
										{control.title}
										<span className="text-xs text-white/60">{control.value}</span>
									</span>
								</Label>
								<Slider
									id={control.id}
									min={control.min}
									max={control.max}
									value={[control.source]}
									onValueChange={values => control.onChange(values[0])}
								/>
							</div>
						))}
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
						<h3 className="text-xs uppercase tracking-wide text-white/70">Strings</h3>
						{[
							{
								id: "stringCount",
								title: t("controls.stringCountLabel"),
								value: `${stringCount}`,
								onChange: (value: number) => setStringCount(value),
								min: 0,
								max: 12,
								source: stringCount,
							},
							{
								id: "stringWidth",
								title: t("controls.stringWidthLabel"),
								value: `${stringWidth}px`,
								onChange: (value: number) => setStringWidth(value),
								min: 0,
								max: 10,
								step: 0.01,
								source: stringWidth,
							},
						].map(control => (
							<div key={control.id} className="flex flex-col gap-1">
								<Label htmlFor={control.id} className="text-sm text-white/80">
									<span className="flex items-center justify-between">
										{control.title}
										<span className="text-xs text-white/60">{control.value}</span>
									</span>
								</Label>
								<Slider
									id={control.id}
									min={control.min}
									max={control.max}
									step={control.step}
									value={[control.source]}
									onValueChange={values => control.onChange(values[0])}
								/>
							</div>
						))}
						{[
							{
								id: "stringColor",
								title: t("controls.stringColorLabel"),
								value: stringColor,
								onChange: setStringColor,
							},
							{
								id: "openStringColor",
								title: t("controls.openStringColorLabel"),
								value: openStringColor,
								onChange: setOpenStringColor,
							},
							{
								id: "mutedStringColor",
								title: t("controls.mutedStringColorLabel"),
								value: mutedStringColor,
								onChange: setMutedStringColor,
							},
						].map(colorControl => (
							<div key={colorControl.id} className="flex items-center justify-between gap-4">
								<Label htmlFor={colorControl.id} className="text-sm text-white/80">
									{colorControl.title}
								</Label>
								<input
									id={colorControl.id}
									type="color"
									value={colorControl.value}
									onChange={e => colorControl.onChange(e.target.value)}
									className="h-9 w-14 cursor-pointer rounded border border-white/20 bg-transparent"
								/>
							</div>
						))}
						<div className="flex flex-col gap-1">
							<Label htmlFor="stringIndicatorOffsetX" className="text-sm text-white/80">
								<span className="flex items-center justify-between">
									String Indicator Offset X
									<span className="text-xs text-white/60">
										{(stringIndicatorOffsetX / 100).toFixed(2)}
									</span>
								</span>
							</Label>
							<Slider
								id="stringIndicatorOffsetX"
								min={-500}
								max={500}
								value={[stringIndicatorOffsetX]}
								onValueChange={values => setStringIndicatorOffsetX(values[0])}
							/>
						</div>
						<div className="flex flex-col gap-1">
							<Label htmlFor="stringIndicatorOffsetY" className="text-sm text-white/80">
								<span className="flex items-center justify-between">
									String Indicator Offset Y
									<span className="text-xs text-white/60">
										{(stringIndicatorOffsetY / 100).toFixed(2)}
									</span>
								</span>
							</Label>
							<Slider
								id="stringIndicatorOffsetY"
								min={-500}
								max={500}
								value={[stringIndicatorOffsetY]}
								onValueChange={values => setStringIndicatorOffsetY(values[0])}
							/>
						</div>
					</section>

					{/* Frets */}
					<section className="space-y-4">
						<h3 className="text-xs uppercase tracking-wide text-white/70">Frets</h3>
						{[
							{
								id: "fretCount",
								title: t("controls.fretCountLabel"),
								value: `${fretCount}`,
								onChange: (value: number) => setFretCount(value),
								min: 0,
								max: 18,
								source: fretCount,
							},
							{
								id: "fretWidth",
								title: t("controls.fretWidthLabel"),
								value: `${fretWidth}px`,
								onChange: (value: number) => setFretWidth(value),
								min: 0,
								max: 100,
								source: fretWidth,
							},
							{
								id: "fretHeight",
								title: t("controls.fretHeightLabel"),
								value: `${fretHeight}px`,
								onChange: (value: number) => setFretHeight(value),
								min: 0,
								max: 100,
								source: fretHeight,
							},
							{
								id: "fretTextSize",
								title: t("controls.fretTextSizeLabel"),
								value: `${fretTextSize}px`,
								onChange: (value: number) => setFretTextSize(value),
								min: 0,
								max: 100,
								source: fretTextSize,
							},
						].map(control => (
							<div key={control.id} className="flex flex-col gap-1">
								<Label htmlFor={control.id} className="text-sm text-white/80">
									<span className="flex items-center justify-between">
										{control.title}
										<span className="text-xs text-white/60">{control.value}</span>
									</span>
								</Label>
								<Slider
									id={control.id}
									min={control.min}
									max={control.max}
									value={[control.source]}
									onValueChange={values => control.onChange(values[0])}
								/>
							</div>
						))}
						{[
							{
								id: "fretColor",
								title: t("controls.fretColorLabel"),
								value: fretColor,
								onChange: setFretColor,
							},
							{
								id: "fretTextColor",
								title: t("controls.fretTextColorLabel"),
								value: fretTextColor,
								onChange: setFretTextColor,
							},
						].map(colorControl => (
							<div key={colorControl.id} className="flex items-center justify-between gap-4">
								<Label htmlFor={colorControl.id} className="text-sm text-white/80">
									{colorControl.title}
								</Label>
								<input
									id={colorControl.id}
									type="color"
									value={colorControl.value}
									onChange={e => colorControl.onChange(e.target.value)}
									className="h-9 w-14 cursor-pointer rounded border border-white/20 bg-transparent"
								/>
							</div>
						))}
					</section>

					{/* Tuning */}
					<section className="space-y-4">
						<h3 className="text-xs uppercase tracking-wide text-white/70">Tuning</h3>
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
									Tuning Label Offset X
									<span className="text-xs text-white/60">
										{(tuningLabelOffsetX / 100).toFixed(2)}
									</span>
								</span>
							</Label>
							<Slider
								id="tuningLabelOffsetX"
								min={-500}
								max={500}
								value={[tuningLabelOffsetX]}
								onValueChange={values => setTuningLabelOffsetX(values[0])}
							/>
						</div>
						<div className="flex flex-col gap-1">
							<Label htmlFor="tuningLabelOffsetY" className="text-sm text-white/80">
								<span className="flex items-center justify-between">
									Tuning Label Offset Y
									<span className="text-xs text-white/60">
										{(tuningLabelOffsetY / 100).toFixed(2)}
									</span>
								</span>
							</Label>
							<Slider
								id="tuningLabelOffsetY"
								min={-500}
								max={500}
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
						<h3 className="text-xs uppercase tracking-wide text-white/70">Dots (Fingers)</h3>
						{[
							{
								id: "dotSize",
								title: t("controls.dotSizeLabel"),
								value: `${dotSize}px`,
								onChange: (value: number) => setDotSize(value),
								min: 0,
								max: 20,
								source: dotSize,
							},
							{
								id: "dotTextSize",
								title: t("controls.dotTextSizeLabel"),
								value: `${dotTextSize}px`,
								onChange: (value: number) => setDotTextSize(value),
								min: 0,
								max: 100,
								source: dotTextSize,
							},
						].map(control => (
							<div key={control.id} className="flex flex-col gap-1">
								<Label htmlFor={control.id} className="text-sm text-white/80">
									<span className="flex items-center justify-between">
										{control.title}
										<span className="text-xs text-white/60">{control.value}</span>
									</span>
								</Label>
								<Slider
									id={control.id}
									min={control.min}
									max={control.max}
									value={[control.source]}
									onValueChange={values => control.onChange(values[0])}
								/>
							</div>
						))}
						{[
							{
								id: "dotColor",
								title: t("controls.dotColorLabel"),
								value: dotColor,
								onChange: setDotColor,
							},
							{
								id: "dotTextColor",
								title: t("controls.dotTextColorLabel"),
								value: dotTextColor,
								onChange: setDotTextColor,
							},
						].map(colorControl => (
							<div key={colorControl.id} className="flex items-center justify-between gap-4">
								<Label htmlFor={colorControl.id} className="text-sm text-white/80">
									{colorControl.title}
								</Label>
								<input
									id={colorControl.id}
									type="color"
									value={colorControl.value}
									onChange={e => colorControl.onChange(e.target.value)}
									className="h-9 w-14 cursor-pointer rounded border border-white/20 bg-transparent"
								/>
							</div>
						))}
					</section>

					{/* Barres */}
					<section className="space-y-4">
						<h3 className="text-xs uppercase tracking-wide text-white/70">Barres</h3>
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
									Barres Width
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
									Barres Opacity
									<span className="text-xs text-white/60">
										{(barresOpacity / 100).toFixed(2)}
									</span>
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
									Barres Offset X
									<span className="text-xs text-white/60">
										{(barresOffsetX / 100).toFixed(2)}
									</span>
								</span>
							</Label>
							<Slider
								id="barresOffsetX"
								min={-500}
								max={500}
								value={[barresOffsetX]}
								onValueChange={values => setBarresOffsetX(values[0])}
							/>
						</div>
						<div className="flex flex-col gap-1">
							<Label htmlFor="barresOffsetY" className="text-sm text-white/80">
								<span className="flex items-center justify-between">
									Barres Offset Y
									<span className="text-xs text-white/60">
										{(barresOffsetY / 100).toFixed(2)}
									</span>
								</span>
							</Label>
							<Slider
								id="barresOffsetY"
								min={-500}
								max={500}
								value={[barresOffsetY]}
								onValueChange={values => setBarresOffsetY(values[0])}
							/>
						</div>
					</section>

					{/* Fret Numbers */}
					<section className="space-y-4">
						<h3 className="text-xs uppercase tracking-wide text-white/70">Fret Numbers</h3>
						<div className="flex flex-col gap-1">
							<Label htmlFor="fretTextOffsetX" className="text-sm text-white/80">
								<span className="flex items-center justify-between">
									Fret Text Offset X
									<span className="text-xs text-white/60">
										{(fretTextOffsetX / 100).toFixed(2)}
									</span>
								</span>
							</Label>
							<Slider
								id="fretTextOffsetX"
								min={-100}
								max={100}
								value={[fretTextOffsetX]}
								onValueChange={values => setFretTextOffsetX(values[0])}
							/>
						</div>
						<div className="flex flex-col gap-1">
							<Label htmlFor="fretTextOffsetY" className="text-sm text-white/80">
								<span className="flex items-center justify-between">
									Fret Text Offset Y
									<span className="text-xs text-white/60">
										{(fretTextOffsetY / 100).toFixed(2)}
									</span>
								</span>
							</Label>
							<Slider
								id="fretTextOffsetY"
								min={-500}
								max={500}
								value={[fretTextOffsetY]}
								onValueChange={values => setFretTextOffsetY(values[0])}
							/>
						</div>
					</section>

					{/* Nut (Fret Zero) */}
					<section className="space-y-4">
						<h3 className="text-xs uppercase tracking-wide text-white/70">Nut (Fret Zero)</h3>
						<div className="flex flex-col gap-1">
							<Label htmlFor="nutStrokeWidth" className="text-sm text-white/80">
								<span className="flex items-center justify-between">
									Nut Stroke Width
									<span className="text-xs text-white/60">
										{(nutStrokeWidth / 1000).toFixed(3)}
									</span>
								</span>
							</Label>
							<Slider
								id="nutStrokeWidth"
								min={0}
								max={500}
								value={[nutStrokeWidth]}
								onValueChange={values => setNutStrokeWidth(values[0])}
							/>
						</div>
						<div className="flex flex-col gap-1">
							<Label htmlFor="nutOffsetX" className="text-sm text-white/80">
								<span className="flex items-center justify-between">
									Nut Offset X
									<span className="text-xs text-white/60">
										{(nutOffsetX / 100).toFixed(2)}
									</span>
								</span>
							</Label>
							<Slider
								id="nutOffsetX"
								min={-50}
								max={50}
								value={[nutOffsetX]}
								onValueChange={values => setNutOffsetX(values[0])}
							/>
						</div>
						<div className="flex flex-col gap-1">
							<Label htmlFor="nutOffsetY" className="text-sm text-white/80">
								<span className="flex items-center justify-between">
									Nut Offset Y
									<span className="text-xs text-white/60">
										{(nutOffsetY / 100).toFixed(2)}
									</span>
								</span>
							</Label>
							<Slider
								id="nutOffsetY"
								min={-500}
								max={500}
								value={[nutOffsetY]}
								onValueChange={values => setNutOffsetY(values[0])}
							/>
						</div>
						<div className="flex flex-col gap-1">
							<Label htmlFor="nutOpacity" className="text-sm text-white/80">
								<span className="flex items-center justify-between">
									Nut Opacity
									<span className="text-xs text-white/60">
										{(nutOpacity / 100).toFixed(2)}
									</span>
								</span>
							</Label>
							<Slider
								id="nutOpacity"
								min={0}
								max={100}
								value={[nutOpacity]}
								onValueChange={values => setNutOpacity(values[0])}
							/>
						</div>
						<div className="flex items-center justify-between gap-4">
							<Label htmlFor="nutColor" className="text-sm text-white/80">
								Nut Color
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
						<h3 className="text-xs uppercase tracking-wide text-white/70">Canvas Positioning</h3>
						<div className="flex flex-col gap-1">
							<Label htmlFor="canvasOffsetX" className="text-sm text-white/80">
								<span className="flex items-center justify-between">
									Canvas Offset X
									<span className="text-xs text-white/60">{canvasOffsetX}px</span>
								</span>
							</Label>
							<Slider
								id="canvasOffsetX"
								min={-100}
								max={100}
								value={[canvasOffsetX]}
								onValueChange={values => setCanvasOffsetX(values[0])}
							/>
						</div>
						<div className="flex flex-col gap-1">
							<Label htmlFor="canvasOffsetY" className="text-sm text-white/80">
								<span className="flex items-center justify-between">
									Canvas Offset Y
									<span className="text-xs text-white/60">{canvasOffsetY}px</span>
								</span>
							</Label>
							<Slider
								id="canvasOffsetY"
								min={-100}
								max={100}
								value={[canvasOffsetY]}
								onValueChange={values => setCanvasOffsetY(values[0])}
							/>
						</div>
					</section>

					{/* Language */}
					<section className="space-y-4">
						<h3 className="text-xs uppercase tracking-wide text-white/70">{t("language")}</h3>
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
