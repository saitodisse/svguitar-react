import { useState } from "react";
import { ChordDiagram } from "svguitar-react";
import "./App.css";

function App() {
	const [width, setWidth] = useState(250);
	const [height, setHeight] = useState(250);
	const [fretCount, setFretCount] = useState(4);
	const [stringCount, setStringCount] = useState(6);
	const [fretWidth, setFretWidth] = useState(40);
	const [fretHeight, setFretHeight] = useState(30);
	const [stringWidth, setStringWidth] = useState(2);
	const [dotSize, setDotSize] = useState(12);
	const [barreHeight, setBarreHeight] = useState(8);
	const [backgroundColor, setBackgroundColor] = useState("#ffffff");
	const [fretColor, setFretColor] = useState("#333333");
	const [stringColor, setStringColor] = useState("#666666");
	const [dotColor, setDotColor] = useState("#2196F3");
	const [dotTextColor, setDotTextColor] = useState("#ffffff");
	const [barreColor, setBarreColor] = useState("#2196F3");
	const [fretTextColor, setFretTextColor] = useState("#333333");
	const [tuningTextColor, setTuningTextColor] = useState("#666666");
	const [openStringColor, setOpenStringColor] = useState("#2196F3");
	const [mutedStringColor, setMutedStringColor] = useState("#DC143C");
	const [fontFamily, setFontFamily] = useState("Arial, sans-serif");
	const [dotTextSize, setDotTextSize] = useState(10);
	const [fretTextSize, setFretTextSize] = useState(12);
	const [tuningTextSize, setTuningTextSize] = useState(14);
	const [orientation, setOrientation] = useState("horizontal");
	const [handedness, setHandedness] = useState("right");

	const cMajor = {
		fingers: [
			{ fret: 3, string: 2, is_muted: false, text: "3" },
			{ fret: 2, string: 3, is_muted: false, text: "2" },
			{ fret: 1, string: 5, is_muted: false, text: "1" },
		],
		barres: [],
	};

	return (
		<>
			<h1>svguitar-react</h1>
			<div className="app-layout">
				<div className="preview card">
					<ChordDiagram
						chord={cMajor}
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
								<option>Verdana, sans-serif</option>
								<option>Roboto, sans-serif</option>
								<option>Open Sans, sans-serif</option>
								<option>Poppins, sans-serif</option>
								<option>Montserrat, sans-serif</option>
								<option>Lato, sans-serif</option>
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
