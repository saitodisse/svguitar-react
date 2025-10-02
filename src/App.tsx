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

// Configurações padrão - extraídas para constantes
const DEFAULT_CONFIGS = {
	mobileHorizontal: {
		width: 333,
		height: 222,
		fretWidth: 53,
		fretCount: 4,
		dotTextSize: 11,
		dotSize: 18,
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
		tuningTextColor: "#707070",
		openStringColor: "#2196F3",
		mutedStringColor: "#C65858",
		fontFamily: "Arial, sans-serif",
		chord: "x32010",
	},
	mobileVertical: {
		width: 333,
		height: 222,
		fretWidth: 53,
		fretCount: 4,
		dotTextSize: 11,
		dotSize: 18,
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
		tuningTextColor: "#707070",
		openStringColor: "#2196F3",
		mutedStringColor: "#C65858",
		fontFamily: "Arial, sans-serif",
		chord: "x32010",
	},
	desktopHorizontal: {
		width: 745,
		height: 239,
		fretWidth: 63,
		fretCount: 10,
		dotTextSize: 13,
		dotSize: 16,
		barreHeight: 7,
		fretHeight: 30,
		tuningTextSize: 13,
		fretTextSize: 21,
		fretTextColor: "#4a4a4a",
		stringWidth: 2,
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
	},
	desktopVertical: {
		width: 221,
		height: 348,
		fretWidth: 24,
		fretCount: 4,
		dotTextSize: 13,
		dotSize: 16,
		barreHeight: 5,
		fretHeight: 58,
		tuningTextSize: 13,
		fretTextSize: 21,
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

// Componente para tratamento de erro do ChordDiagram
function ChordDiagramWithErrorHandling({ chord, ...props }: { chord: string; [key: string]: unknown }) {
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
				{...(props as Record<string, unknown>)}
				instrument={{
					...(props.instrument as Record<string, unknown>),
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

	// Função para limpar a configuração e manter apenas view e lang
	const clearConfiguration = () => {
		// Reset all parameters to their default values using current defaults
		setChord(defaults.chord);
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
				<div className="flex flex-col gap-4 rounded-xl border border-white/10 bg-white/5 p-4 shadow-lg backdrop-blur">
					<ChordDiagramWithErrorHandling
						chord={chord}
						instrument={{
							tuning: ["E", "A", "D", "G", "B", "E"],
						}}
						width={width}
						height={height}
						fretCount={fretCount}
						stringCount={stringCount}
						fretWidth={fretWidth}
						fretHeight={fretHeight}
						stringWidth={stringWidth}
						dotSize={dotSize}
						barreHeight={barreHeight}
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
						fontFamily={fontFamily}
						dotTextSize={dotTextSize}
						fretTextSize={fretTextSize}
						tuningTextSize={tuningTextSize}
						view={
							view as
								| "horizontal-right"
								| "horizontal-left"
								| "vertical-right"
								| "vertical-left"
						}
					/>
				</div>

				<aside
					className="flex max-h-[calc(100vh-200px)] flex-col gap-6 overflow-y-auto rounded-xl border border-white/10 bg-white/5 p-5 shadow-lg backdrop-blur"
					aria-label={t("aria.controlPanel")}
				>
					<div className="flex items-center justify-between">
						<h2 className="text-xl font-semibold">{t("controls.title")}</h2>
						<Button onClick={clearConfiguration} variant="outline" size="sm" className="text-xs">
							{t("controls.clearConfig")}
						</Button>
					</div>

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
					</section>

					<section className="space-y-4">
						<h3 className="text-xs uppercase tracking-wide text-white/70">
							{t("controls.dimensionsSection")}
						</h3>
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
								id: "stringCount",
								title: t("controls.stringCountLabel"),
								value: `${stringCount}`,
								onChange: (value: number) => setStringCount(value),
								min: 0,
								max: 12,
								source: stringCount,
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
								id: "stringWidth",
								title: t("controls.stringWidthLabel"),
								value: `${stringWidth}px`,
								onChange: (value: number) => setStringWidth(value),
								min: 0,
								max: 10,
								source: stringWidth,
							},
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
								id: "barreHeight",
								title: t("controls.barreHeightLabel"),
								value: `${barreHeight}px`,
								onChange: (value: number) => setBarreHeight(value),
								min: 0,
								max: 28,
								source: barreHeight,
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
					</section>

					<section className="space-y-4">
						<h3 className="text-xs uppercase tracking-wide text-white/70">
							{t("controls.colorsSection")}
						</h3>
						{[
							{
								id: "backgroundColor",
								title: t("controls.backgroundColorLabel"),
								value: backgroundColor,
								onChange: setBackgroundColor,
							},
							{
								id: "fretColor",
								title: t("controls.fretColorLabel"),
								value: fretColor,
								onChange: setFretColor,
							},
							{
								id: "stringColor",
								title: t("controls.stringColorLabel"),
								value: stringColor,
								onChange: setStringColor,
							},
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
							{
								id: "barreColor",
								title: t("controls.barreColorLabel"),
								value: barreColor,
								onChange: setBarreColor,
							},
							{
								id: "fretTextColor",
								title: t("controls.fretTextColorLabel"),
								value: fretTextColor,
								onChange: setFretTextColor,
							},
							{
								id: "tuningTextColor",
								title: t("controls.tuningTextColorLabel"),
								value: tuningTextColor,
								onChange: setTuningTextColor,
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
					</section>

					<section className="space-y-4">
						<h3 className="text-xs uppercase tracking-wide text-white/70">
							{t("controls.fontsSection")}
						</h3>
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
						{[
							{
								id: "dotTextSize",
								title: t("controls.dotTextSizeLabel"),
								value: `${dotTextSize}px`,
								onChange: (value: number) => setDotTextSize(value),
								min: 0,
								max: 100,
								source: dotTextSize,
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
							{
								id: "tuningTextSize",
								title: t("controls.tuningTextSizeLabel"),
								value: `${tuningTextSize}px`,
								onChange: (value: number) => setTuningTextSize(value),
								min: 0,
								max: 100,
								source: tuningTextSize,
							},
						].map(sizeControl => (
							<div key={sizeControl.id} className="flex flex-col gap-1">
								<Label htmlFor={sizeControl.id} className="text-sm text-white/80">
									<span className="flex items-center justify-between">
										{sizeControl.title}
										<span className="text-xs text-white/60">{sizeControl.value}</span>
									</span>
								</Label>
								<Slider
									id={sizeControl.id}
									min={sizeControl.min}
									max={sizeControl.max}
									value={[sizeControl.source]}
									onValueChange={values => sizeControl.onChange(values[0])}
								/>
							</div>
						))}
					</section>

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
