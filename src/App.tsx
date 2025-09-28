import { useQueryState, parseAsInteger, parseAsString, parseAsStringLiteral } from "nuqs";
import { ChordDiagram, parseFretNotation, processChordData } from "svguitar-react";
import "./App.css";
import { useMemo, useState, useEffect } from "react";

// Componente para tratamento de erro do ChordDiagram
function ChordDiagramWithErrorHandling({ chord, ...props }: { chord: string; [key: string]: unknown }) {
	const [error, setError] = useState<string | null>(null);
	const [lastValidChord, setLastValidChord] = useState<string>(chord);

	useEffect(() => {
		// Reset error when chord changes
		setError(null);
	}, [chord]);

	// Validação do acorde
	const validateChord = (chordString: string): string | null => {
		if (!chordString || chordString.trim() === "") {
			return "Acorde não pode estar vazio";
		}

		// Verifica se o acorde tem o número correto de caracteres (6 cordas)
		if (chordString.length !== 6) {
			return `Acorde deve ter exatamente 6 caracteres (uma para cada corda), mas tem ${chordString.length}`;
		}

		// Verifica se todos os caracteres são válidos
		const validChars = /^[0-9x]+$/;
		if (!validChars.test(chordString)) {
			return "Acorde deve conter apenas números (0-9) e 'x' para cordas abafadas";
		}

		// Verifica se há pelo menos uma corda tocada (não todas abafadas)
		if (chordString === "xxxxxx") {
			return "Pelo menos uma corda deve ser tocada";
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
			{error && (
				<div
					style={{
						backgroundColor: "#ffebee",
						border: "1px solid #f44336",
						borderRadius: "4px",
						padding: "12px",
						marginBottom: "16px",
						color: "#c62828",
						fontSize: "14px",
					}}
				>
					<strong>Erro no acorde:</strong> {error}
					<br />
					<small>
						Mantendo o último acorde válido: <code>{lastValidChord}</code>
					</small>
				</div>
			)}
			<ChordDiagram
				{...(props as Record<string, unknown>)}
				instrument={{
					...(props.instrument as Record<string, unknown>),
					chord: chordToUse,
				}}
			/>
		</>
	);
}

function App() {
	const [chord, setChord] = useQueryState("chord", parseAsString.withDefault("x32010"));

	const [width, setWidth] = useQueryState("width", parseAsInteger.withDefault(695));
	const [height, setHeight] = useQueryState("height", parseAsInteger.withDefault(250));
	const [fretCount, setFretCount] = useQueryState("fretCount", parseAsInteger.withDefault(8));
	const [stringCount, setStringCount] = useQueryState("stringCount", parseAsInteger.withDefault(6));
	const [fretWidth, setFretWidth] = useQueryState("fretWidth", parseAsInteger.withDefault(57));
	const [fretHeight, setFretHeight] = useQueryState("fretHeight", parseAsInteger.withDefault(30));
	const [stringWidth, setStringWidth] = useQueryState("stringWidth", parseAsInteger.withDefault(2));
	const [dotSize, setDotSize] = useQueryState("dotSize", parseAsInteger.withDefault(16));
	const [barreHeight, setBarreHeight] = useQueryState("barreHeight", parseAsInteger.withDefault(7));
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
	const [dotTextSize, setDotTextSize] = useQueryState("dotTextSize", parseAsInteger.withDefault(13));
	const [fretTextSize, setFretTextSize] = useQueryState("fretTextSize", parseAsInteger.withDefault(20));
	const [tuningTextSize, setTuningTextSize] = useQueryState(
		"tuningTextSize",
		parseAsInteger.withDefault(13)
	);
	const [orientation, setOrientation] = useQueryState(
		"orientation",
		parseAsStringLiteral(["horizontal", "vertical"]).withDefault("horizontal")
	);
	const [handedness, setHandedness] = useQueryState(
		"handedness",
		parseAsStringLiteral(["right", "left"]).withDefault("right")
	);

	return (
		<>
			<h1>svguitar-react</h1>
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
				<aside className="control-panel card" aria-label="Painel de Controle do ChordDiagram">
					<h2>Controles</h2>
					<div className="section">
						<h3>Acorde</h3>
						<div className="control">
							<label htmlFor="chord">Acorde</label>
							<input
								id="chord"
								type="text"
								value={chord}
								onChange={e => setChord(e.target.value)}
							/>
						</div>
					</div>
					<div className="section">
						<h3>Layout</h3>
						<div className="control">
							<span className="control-label">Orientação</span>
							<div className="radio-group">
								<label>
									<input
										type="radio"
										name="orientation"
										checked={orientation === "horizontal"}
										onChange={() => setOrientation("horizontal")}
									/>
									Horizontal
								</label>
								<label>
									<input
										type="radio"
										name="orientation"
										checked={orientation === "vertical"}
										onChange={() => setOrientation("vertical")}
									/>
									Vertical
								</label>
							</div>
						</div>
						<div className="control">
							<span className="control-label">Mão</span>
							<div className="radio-group">
								<label>
									<input
										type="radio"
										name="handedness"
										checked={handedness === "right"}
										onChange={() => setHandedness("right")}
									/>
									Destro
								</label>
								<label>
									<input
										type="radio"
										name="handedness"
										checked={handedness === "left"}
										onChange={() => setHandedness("left")}
									/>
									Canhoto
								</label>
							</div>
						</div>
					</div>

					<div className="section">
						<h3>Dimensões</h3>
						<div className="control">
							<label htmlFor="width">
								Largura: <span className="value">{width}px</span>
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
								Altura: <span className="value">{height}px</span>
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
								Qtd. de Trastes: <span className="value">{fretCount}</span>
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
								Qtd. de Cordas: <span className="value">{stringCount}</span>
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
								Largura do Espaço: <span className="value">{fretWidth}px</span>
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
								Altura do Espaço: <span className="value">{fretHeight}px</span>
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
								Espessura da Corda: <span className="value">{stringWidth}px</span>
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
								Tamanho do Ponto: <span className="value">{dotSize}px</span>
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
								Altura do Barre: <span className="value">{barreHeight}px</span>
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
						<h3>Cores</h3>
						<div className="control color">
							<label htmlFor="backgroundColor">Fundo</label>
							<input
								id="backgroundColor"
								type="color"
								value={backgroundColor}
								onChange={e => setBackgroundColor(e.target.value)}
							/>
						</div>
						<div className="control color">
							<label htmlFor="fretColor">Linhas dos Trastes</label>
							<input
								id="fretColor"
								type="color"
								value={fretColor}
								onChange={e => setFretColor(e.target.value)}
							/>
						</div>
						<div className="control color">
							<label htmlFor="stringColor">Linhas das Cordas</label>
							<input
								id="stringColor"
								type="color"
								value={stringColor}
								onChange={e => setStringColor(e.target.value)}
							/>
						</div>
						<div className="control color">
							<label htmlFor="dotColor">Pontos (Dedos)</label>
							<input
								id="dotColor"
								type="color"
								value={dotColor}
								onChange={e => setDotColor(e.target.value)}
							/>
						</div>
						<div className="control color">
							<label htmlFor="dotTextColor">Texto dos Pontos</label>
							<input
								id="dotTextColor"
								type="color"
								value={dotTextColor}
								onChange={e => setDotTextColor(e.target.value)}
							/>
						</div>
						<div className="control color">
							<label htmlFor="barreColor">Barre</label>
							<input
								id="barreColor"
								type="color"
								value={barreColor}
								onChange={e => setBarreColor(e.target.value)}
							/>
						</div>
						<div className="control color">
							<label htmlFor="fretTextColor">Texto dos Trastes</label>
							<input
								id="fretTextColor"
								type="color"
								value={fretTextColor}
								onChange={e => setFretTextColor(e.target.value)}
							/>
						</div>
						<div className="control color">
							<label htmlFor="tuningTextColor">Texto da Afinação</label>
							<input
								id="tuningTextColor"
								type="color"
								value={tuningTextColor}
								onChange={e => setTuningTextColor(e.target.value)}
							/>
						</div>
						<div className="control color">
							<label htmlFor="openStringColor">Cordas Soltas</label>
							<input
								id="openStringColor"
								type="color"
								value={openStringColor}
								onChange={e => setOpenStringColor(e.target.value)}
							/>
						</div>
						<div className="control color">
							<label htmlFor="mutedStringColor">Cordas Abafadas</label>
							<input
								id="mutedStringColor"
								type="color"
								value={mutedStringColor}
								onChange={e => setMutedStringColor(e.target.value)}
							/>
						</div>
					</div>

					<div className="section">
						<h3>Fontes</h3>
						<div className="control">
							<label htmlFor="fontFamily">Família da Fonte</label>
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
								Tamanho do Texto dos Pontos: <span className="value">{dotTextSize}px</span>
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
								Tamanho do Texto dos Trastes: <span className="value">{fretTextSize}px</span>
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
								Tamanho do Texto da Afinação:{" "}
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
