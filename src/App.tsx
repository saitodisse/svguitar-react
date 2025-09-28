import { useQueryState, parseAsInteger, parseAsString, parseAsStringLiteral } from "nuqs";
import { ChordDiagram } from "svguitar-react";
import "./App.css";
import { useState, useEffect, useMemo } from "react";
import { useTranslation } from "react-i18next";

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

	const [chord, setChord] = useQueryState("chord", parseAsString.withDefault("x32010"));

	// Configurações padrão para mobile
	const mobileDefaults = useMemo(
		() => ({
			height: 299,
			fretWidth: 73,
			dotTextSize: 11,
			dotSize: 20,
			barreHeight: 5,
			fretHeight: 38,
			tuningTextSize: 20,
			fretTextSize: 23,
		}),
		[]
	);

	// Configurações padrão para desktop
	const desktopDefaults = useMemo(
		() => ({
			height: 250,
			fretWidth: 57,
			dotTextSize: 13,
			dotSize: 16,
			barreHeight: 7,
			fretHeight: 30,
			tuningTextSize: 13,
			fretTextSize: 20,
		}),
		[]
	);

	// Aplica configurações padrão baseadas no modo mobile/desktop
	const defaults = isMobile ? mobileDefaults : desktopDefaults;

	const [width, setWidth] = useQueryState("width", parseAsInteger.withDefault(695));
	const [height, setHeight] = useQueryState("height", parseAsInteger.withDefault(defaults.height));
	const [fretCount, setFretCount] = useQueryState("fretCount", parseAsInteger.withDefault(8));
	const [stringCount, setStringCount] = useQueryState("stringCount", parseAsInteger.withDefault(6));
	const [fretWidth, setFretWidth] = useQueryState(
		"fretWidth",
		parseAsInteger.withDefault(defaults.fretWidth)
	);
	const [fretHeight, setFretHeight] = useQueryState(
		"fretHeight",
		parseAsInteger.withDefault(defaults.fretHeight)
	);
	const [stringWidth, setStringWidth] = useQueryState("stringWidth", parseAsInteger.withDefault(2));
	const [dotSize, setDotSize] = useQueryState("dotSize", parseAsInteger.withDefault(defaults.dotSize));
	const [barreHeight, setBarreHeight] = useQueryState(
		"barreHeight",
		parseAsInteger.withDefault(defaults.barreHeight)
	);
	const [backgroundColor, setBackgroundColor] = useQueryState(
		"backgroundColor",
		parseAsString.withDefault("#242424")
	);
	const [fretColor, setFretColor] = useQueryState("fretColor", parseAsString.withDefault("#bfbfbf"));
	const [stringColor, setStringColor] = useQueryState("stringColor", parseAsString.withDefault("#ffffff"));
	const [dotColor, setDotColor] = useQueryState("dotColor", parseAsString.withDefault("#2196F3"));
	const [dotTextColor, setDotTextColor] = useQueryState(
		"dotTextColor",
		parseAsString.withDefault("#ffffff")
	);
	const [barreColor, setBarreColor] = useQueryState("barreColor", parseAsString.withDefault("#2196F3"));
	const [fretTextColor, setFretTextColor] = useQueryState(
		"fretTextColor",
		parseAsString.withDefault("#636363")
	);
	const [tuningTextColor, setTuningTextColor] = useQueryState(
		"tuningTextColor",
		parseAsString.withDefault("#707070")
	);
	const [openStringColor, setOpenStringColor] = useQueryState(
		"openStringColor",
		parseAsString.withDefault("#2196F3")
	);
	const [mutedStringColor, setMutedStringColor] = useQueryState(
		"mutedStringColor",
		parseAsString.withDefault("#C65858")
	);
	const [fontFamily, setFontFamily] = useQueryState(
		"fontFamily",
		parseAsString.withDefault("Arial, sans-serif")
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
	const [orientation, setOrientation] = useQueryState(
		"orientation",
		parseAsStringLiteral(["horizontal", "vertical"]).withDefault("horizontal")
	);
	const [handedness, setHandedness] = useQueryState(
		"handedness",
		parseAsStringLiteral(["right", "left"]).withDefault("right")
	);

	// Aplica configurações mobile quando detectado modo mobile e não há parâmetros na URL
	useEffect(() => {
		const urlParams = new URLSearchParams(window.location.search);
		const hasExplicitParams =
			urlParams.has("height") ||
			urlParams.has("fretWidth") ||
			urlParams.has("dotTextSize") ||
			urlParams.has("dotSize") ||
			urlParams.has("barreHeight") ||
			urlParams.has("fretHeight") ||
			urlParams.has("tuningTextSize") ||
			urlParams.has("fretTextSize");

		// Só aplica configurações mobile se não há parâmetros explícitos na URL
		if (isMobile && !hasExplicitParams) {
			setHeight(mobileDefaults.height);
			setFretWidth(mobileDefaults.fretWidth);
			setDotTextSize(mobileDefaults.dotTextSize);
			setDotSize(mobileDefaults.dotSize);
			setBarreHeight(mobileDefaults.barreHeight);
			setFretHeight(mobileDefaults.fretHeight);
			setTuningTextSize(mobileDefaults.tuningTextSize);
			setFretTextSize(mobileDefaults.fretTextSize);
		}
	}, [
		isMobile,
		setHeight,
		setFretWidth,
		setDotTextSize,
		setDotSize,
		setBarreHeight,
		setFretHeight,
		setTuningTextSize,
		setFretTextSize,
		mobileDefaults,
	]);

	return (
		<>
			<h1>svguitar-react</h1>
			<div className="links">
				<a
					href="https://github.com/saitodisse/svguitar-react"
					target="_blank"
					rel="noopener noreferrer"
				>
					GitHub
				</a>
				<a
					href="https://www.npmjs.com/package/svguitar-react"
					target="_blank"
					rel="noopener noreferrer"
				>
					npm
				</a>
			</div>
			<div className="app-layout">
				<div className="preview card">
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
						orientation={orientation as "horizontal" | "vertical"}
						handedness={handedness as "right" | "left"}
					/>
				</div>
				<aside className="control-panel card" aria-label={t("aria.controlPanel")}>
					<h2>{t("controls.title")}</h2>

					<div className="section">
						<h3>{t("language")}</h3>
						<div className="control">
							<div className="radio-group">
								<label>
									<input
										type="radio"
										name="language"
										checked={lang === "en"}
										onChange={() => setLang("en")}
									/>
									{t("language.en")}
								</label>
								<label>
									<input
										type="radio"
										name="language"
										checked={lang === "pt"}
										onChange={() => setLang("pt")}
									/>
									{t("language.pt")}
								</label>
							</div>
						</div>
					</div>

					<div className="section">
						<h3>{t("controls.chordSection")}</h3>
						<div className="control">
							<label htmlFor="chord">{t("controls.chordLabel")}</label>
							<input
								id="chord"
								type="text"
								value={chord}
								onChange={e => setChord(e.target.value)}
							/>
						</div>
					</div>
					<div className="section">
						<h3>{t("controls.layoutSection")}</h3>
						<div className="control">
							<span className="control-label">{t("controls.orientationLabel")}</span>
							<div className="radio-group">
								<label>
									<input
										type="radio"
										name="orientation"
										checked={orientation === "horizontal"}
										onChange={() => setOrientation("horizontal")}
									/>
									{t("controls.orientationHorizontal")}
								</label>
								<label>
									<input
										type="radio"
										name="orientation"
										checked={orientation === "vertical"}
										onChange={() => setOrientation("vertical")}
									/>
									{t("controls.orientationVertical")}
								</label>
							</div>
						</div>
						<div className="control">
							<span className="control-label">{t("controls.handednessLabel")}</span>
							<div className="radio-group">
								<label>
									<input
										type="radio"
										name="handedness"
										checked={handedness === "right"}
										onChange={() => setHandedness("right")}
									/>
									{t("controls.handednessRight")}
								</label>
								<label>
									<input
										type="radio"
										name="handedness"
										checked={handedness === "left"}
										onChange={() => setHandedness("left")}
									/>
									{t("controls.handednessLeft")}
								</label>
							</div>
						</div>
					</div>

					<div className="section">
						<h3>{t("controls.dimensionsSection")}</h3>
						<div className="control">
							<label htmlFor="width">
								{t("controls.widthLabel")} <span className="value">{width}px</span>
							</label>
							<input
								id="width"
								type="range"
								min={0}
								max={1000}
								value={width}
								onChange={e => setWidth(Number(e.target.value))}
							/>
						</div>
						<div className="control">
							<label htmlFor="height">
								{t("controls.heightLabel")} <span className="value">{height}px</span>
							</label>
							<input
								id="height"
								type="range"
								min={0}
								max={1000}
								value={height}
								onChange={e => setHeight(Number(e.target.value))}
							/>
						</div>
						<div className="control">
							<label htmlFor="fretCount">
								{t("controls.fretCountLabel")} <span className="value">{fretCount}</span>
							</label>
							<input
								id="fretCount"
								type="range"
								min={0}
								max={18}
								value={fretCount}
								onChange={e => setFretCount(Number(e.target.value))}
							/>
						</div>
						<div className="control">
							<label htmlFor="stringCount">
								{t("controls.stringCountLabel")} <span className="value">{stringCount}</span>
							</label>
							<input
								id="stringCount"
								type="range"
								min={0}
								max={12}
								value={stringCount}
								onChange={e => setStringCount(Number(e.target.value))}
							/>
						</div>
						<div className="control">
							<label htmlFor="fretWidth">
								{t("controls.fretWidthLabel")} <span className="value">{fretWidth}px</span>
							</label>
							<input
								id="fretWidth"
								type="range"
								min={0}
								max={100}
								value={fretWidth}
								onChange={e => setFretWidth(Number(e.target.value))}
							/>
						</div>
						<div className="control">
							<label htmlFor="fretHeight">
								{t("controls.fretHeightLabel")} <span className="value">{fretHeight}px</span>
							</label>
							<input
								id="fretHeight"
								type="range"
								min={0}
								max={100}
								value={fretHeight}
								onChange={e => setFretHeight(Number(e.target.value))}
							/>
						</div>
						<div className="control">
							<label htmlFor="stringWidth">
								{t("controls.stringWidthLabel")}{" "}
								<span className="value">{stringWidth}px</span>
							</label>
							<input
								id="stringWidth"
								type="range"
								min={0}
								max={10}
								value={stringWidth}
								onChange={e => setStringWidth(Number(e.target.value))}
							/>
						</div>
						<div className="control">
							<label htmlFor="dotSize">
								{t("controls.dotSizeLabel")} <span className="value">{dotSize}px</span>
							</label>
							<input
								id="dotSize"
								type="range"
								min={0}
								max={20}
								value={dotSize}
								onChange={e => setDotSize(Number(e.target.value))}
							/>
						</div>
						<div className="control">
							<label htmlFor="barreHeight">
								{t("controls.barreHeightLabel")}{" "}
								<span className="value">{barreHeight}px</span>
							</label>
							<input
								id="barreHeight"
								type="range"
								min={0}
								max={28}
								value={barreHeight}
								onChange={e => setBarreHeight(Number(e.target.value))}
							/>
						</div>
					</div>

					<div className="section">
						<h3>{t("controls.colorsSection")}</h3>
						<div className="control color">
							<label htmlFor="backgroundColor">{t("controls.backgroundColorLabel")}</label>
							<input
								id="backgroundColor"
								type="color"
								value={backgroundColor}
								onChange={e => setBackgroundColor(e.target.value)}
							/>
						</div>
						<div className="control color">
							<label htmlFor="fretColor">{t("controls.fretColorLabel")}</label>
							<input
								id="fretColor"
								type="color"
								value={fretColor}
								onChange={e => setFretColor(e.target.value)}
							/>
						</div>
						<div className="control color">
							<label htmlFor="stringColor">{t("controls.stringColorLabel")}</label>
							<input
								id="stringColor"
								type="color"
								value={stringColor}
								onChange={e => setStringColor(e.target.value)}
							/>
						</div>
						<div className="control color">
							<label htmlFor="dotColor">{t("controls.dotColorLabel")}</label>
							<input
								id="dotColor"
								type="color"
								value={dotColor}
								onChange={e => setDotColor(e.target.value)}
							/>
						</div>
						<div className="control color">
							<label htmlFor="dotTextColor">{t("controls.dotTextColorLabel")}</label>
							<input
								id="dotTextColor"
								type="color"
								value={dotTextColor}
								onChange={e => setDotTextColor(e.target.value)}
							/>
						</div>
						<div className="control color">
							<label htmlFor="barreColor">{t("controls.barreColorLabel")}</label>
							<input
								id="barreColor"
								type="color"
								value={barreColor}
								onChange={e => setBarreColor(e.target.value)}
							/>
						</div>
						<div className="control color">
							<label htmlFor="fretTextColor">{t("controls.fretTextColorLabel")}</label>
							<input
								id="fretTextColor"
								type="color"
								value={fretTextColor}
								onChange={e => setFretTextColor(e.target.value)}
							/>
						</div>
						<div className="control color">
							<label htmlFor="tuningTextColor">{t("controls.tuningTextColorLabel")}</label>
							<input
								id="tuningTextColor"
								type="color"
								value={tuningTextColor}
								onChange={e => setTuningTextColor(e.target.value)}
							/>
						</div>
						<div className="control color">
							<label htmlFor="openStringColor">{t("controls.openStringColorLabel")}</label>
							<input
								id="openStringColor"
								type="color"
								value={openStringColor}
								onChange={e => setOpenStringColor(e.target.value)}
							/>
						</div>
						<div className="control color">
							<label htmlFor="mutedStringColor">{t("controls.mutedStringColorLabel")}</label>
							<input
								id="mutedStringColor"
								type="color"
								value={mutedStringColor}
								onChange={e => setMutedStringColor(e.target.value)}
							/>
						</div>
					</div>

					<div className="section">
						<h3>{t("controls.fontsSection")}</h3>
						<div className="control">
							<label htmlFor="fontFamily">{t("controls.fontFamilyLabel")}</label>
							<select
								id="fontFamily"
								value={fontFamily}
								onChange={e => setFontFamily(e.target.value)}
							>
								<option>Arial, sans-serif</option>
								<option>monospace</option>
								<option>sans-serif</option>
								<option>serif</option>
								<option>Noto Sans, sans-serif</option>
								<option>Ubuntu, sans-serif</option>
								<option>Inter, sans-serif</option>
							</select>
						</div>
						<div className="control">
							<label htmlFor="dotTextSize">
								{t("controls.dotTextSizeLabel")}{" "}
								<span className="value">{dotTextSize}px</span>
							</label>
							<input
								id="dotTextSize"
								type="range"
								min={0}
								max={100}
								value={dotTextSize}
								onChange={e => setDotTextSize(Number(e.target.value))}
							/>
						</div>
						<div className="control">
							<label htmlFor="fretTextSize">
								{t("controls.fretTextSizeLabel")}{" "}
								<span className="value">{fretTextSize}px</span>
							</label>
							<input
								id="fretTextSize"
								type="range"
								min={0}
								max={100}
								value={fretTextSize}
								onChange={e => setFretTextSize(Number(e.target.value))}
							/>
						</div>
						<div className="control">
							<label htmlFor="tuningTextSize">
								{t("controls.tuningTextSizeLabel")}{" "}
								<span className="value">{tuningTextSize}px</span>
							</label>
							<input
								id="tuningTextSize"
								type="range"
								min={0}
								max={100}
								value={tuningTextSize}
								onChange={e => setTuningTextSize(Number(e.target.value))}
							/>
						</div>
					</div>
				</aside>
			</div>
		</>
	);
}

export default App;
