# Quickstart: Usando a Biblioteca `svguitar-react`

Este guia mostra como instalar e usar o componente `ChordDiagram` para renderizar diagramas de acordes de guitarra em sua aplicação React.

## 1. Instalação

```bash
pnpm install @svguitar/react
```

## 2. Uso Básico

Importe o componente `ChordDiagram` e passe os dados do acorde que deseja renderizar.

### Exemplo 1: Acorde Simples (C Major)

Você pode definir um acorde passando um objeto com as posições dos dedos e pestanas.

```jsx
import React from "react";
import { ChordDiagram } from "@svguitar/react";

const App = () => {
	const cMajor = {
		fingers: [
			// Fret notation: x32010
			{ fret: 3, string: 2, is_muted: false, text: "3" }, // String 2 (A)
			{ fret: 2, string: 3, is_muted: false, text: "2" }, // String 3 (D)
			{ fret: 1, string: 5, is_muted: false, text: "1" }, // String 5 (B)
			// String 1 (E) is muted, String 4 (G) is open, String 6 (E) is open
		],
		barres: [],
	};

	return <ChordDiagram chord={cMajor} />;
};

export default App;
```

### Exemplo 2: Acorde com Pestana (F Major)

Para acordes com pestana, adicione um objeto `barre`.

```jsx
import React from "react";
import { ChordDiagram } from "@svguitar/react";

const App = () => {
	const fMajor = {
		fingers: [
			// Fret notation: 133211
			{ fret: 3, string: 2, is_muted: false, text: "3" }, // String 2 (A)
			{ fret: 3, string: 3, is_muted: false, text: "4" }, // String 3 (D)
			{ fret: 2, string: 4, is_muted: false, text: "2" }, // String 4 (G)
		],
		barres: [{ fret: 1, fromString: 1, toString: 6 }],
	};

	return <ChordDiagram chord={fMajor} />;
};

export default App;
```

### Exemplo 3: Usando Fret Notation (G Major)

Alternativamente, você pode passar uma Fret Notation e a afinação. O componente irá interpretar a string para renderizar o acorde.

```jsx
import React from "react";
import { ChordDiagram } from "@svguitar/react";

const App = () => {
	const gMajorInstrument = {
		strings: 6,
		frets: 5,
		tuning: ["E2", "A2", "D3", "G3", "B3", "E4"],
		chord: "320003", // G Major
	};

	return <ChordDiagram instrument={gMajorInstrument} />;
};

export default App;
```

## 3. Customização

Você pode customizar a aparência do diagrama passando um objeto `style`.

```jsx
import React from "react";
import { ChordDiagram } from "@svguitar/react";

const App = () => {
	const aMinor = {
		fingers: [
			// Fret notation: x02210
			{ fret: 2, string: 3, is_muted: false }, // String 3 (D)
			{ fret: 2, string: 4, is_muted: false }, // String 4 (G)
			{ fret: 1, string: 5, is_muted: false }, // String 5 (B)
		],
		barres: [],
	};

	const customStyle = {
		width: 150,
		height: 180,
		dotColor: "#FF5733", // Laranja
		stringColor: "#CCCCCC",
		fretColor: "#AAAAAA",
		fontFamily: "Arial, sans-serif",
		openStringColor: "#00FF00", // Verde para cordas soltas
		mutedStringColor: "#FF0000", // Vermelho para cordas mutadas
		openStringSize: 14,
		mutedStringSize: 16,
	};

	return <ChordDiagram chord={aMinor} style={customStyle} />;
};

export default App;
```

## 4. Exemplos Avançados

### Acorde em Posição Alta

Para mostrar acordes em posições mais altas no braço, use `firstFret`.

```jsx
import React from "react";
import { ChordDiagram } from "@svguitar/react";

const App = () => {
	const dMajorHigh = {
		fingers: [
			// D barre chord at 5th fret (root on A string): x5777x
			{ fret: 5, string: 2, is_muted: false }, // String 2 (A) -> Root
			{ fret: 7, string: 3, is_muted: false, text: "2" }, // String 3 (D)
			{ fret: 7, string: 4, is_muted: false, text: "3" }, // String 4 (G)
			{ fret: 7, string: 5, is_muted: false, text: "4" }, // String 5 (B)
		],
		barres: [],
		firstFret: 5, // Começa no 5º traste
	};

	return <ChordDiagram chord={dMajorHigh} />;
};

export default App;
```

### Afinação Personalizada

Para instrumentos com afinação diferente, especifique a afinação personalizada.

```jsx
import React from "react";
import { ChordDiagram } from "@svguitar/react";

const App = () => {
	const dropDTuning = {
		strings: 6,
		frets: 5,
		tuning: ["D2", "A2", "D3", "G3", "B3", "E4"], // Drop D tuning
		chord: "000232", // D Major em Drop D
	};

	return <ChordDiagram instrument={dropDTuning} />;
};

export default App;
```

### Cordas Soltas e Mutadas

#### Exemplo 1: Usando Fret Notation

Use "o" para cordas soltas e "x" para cordas mutadas na Fret Notation.

```jsx
import React from "react";
import { ChordDiagram } from "@svguitar/react";

const App = () => {
	const eMinor = {
		strings: 6,
		frets: 5,
		tuning: ["E2", "A2", "D3", "G3", "B3", "E4"],
		chord: "022000", // E minor (cordas 1 e 2 soltas)
	};

	return <ChordDiagram instrument={eMinor} />;
};

export default App;
```

#### Exemplo 2: Usando Objeto Chord

Você também pode especificar cordas soltas e mutadas diretamente no objeto `Chord`:

```jsx
import React from "react";
import { ChordDiagram } from "@svguitar/react";

const App = () => {
	const cMajorWithOpenStrings = {
		fingers: [
			// Fret notation: x32010
			{ fret: 0, string: 1, is_muted: true }, // Corda mutada (mostra 'X' vermelho)
			{ fret: 3, string: 2, is_muted: false, text: "3" },
			{ fret: 2, string: 3, is_muted: false, text: "2" },
			{ fret: 0, string: 4, is_muted: false }, // Corda solta (mostra 'O')
			{ fret: 1, string: 5, is_muted: false, text: "1" },
			{ fret: 0, string: 6, is_muted: false }, // Corda solta (mostra 'O')
		],
		barres: [],
	};

	return <ChordDiagram chord={cMajorWithOpenStrings} />;
};

export default App;
```

### Exemplo 4: Fret Notation com Trastes Altos (acima de 9)

Para trastes com mais de um dígito, use parênteses.

```jsx
import React from "react";
import { ChordDiagram } from "@svguitar/react";

const App = () => {
	const fMajor10th = {
		strings: 6,
		frets: 5,
		tuning: ["E2", "A2", "D3", "G3", "B3", "E4"],
		chord: "(10)(12)(12)(11)(10)(10)", // F Major na 10ª casa
	};

	return <ChordDiagram instrument={fMajor10th} />;
};

export default App;
```

### Views (layout)

Use a propriedade `view` para selecionar entre as views predefinidas: `horizontal-right` (padrão), `horizontal-left`, `vertical-right`, `vertical-left`. Nas views verticais, os rótulos de afinação (TuningLabels) são posicionados acima das cordas verticais, da esquerda para a direita, e os números dos trastes (FretNumbers) são posicionados à direita do braço, alinhados com cada traste horizontal, formando uma coluna vertical de números.

```jsx
import React from "react";
import { ChordDiagram } from "@svguitar/react";

const App = () => {
	const cMajor = {
		fingers: [
			{ fret: 3, string: 2, is_muted: false, text: "3" },
			{ fret: 2, string: 3, is_muted: false, text: "2" },
			{ fret: 1, string: 5, is_muted: false, text: "1" },
		],
		barres: [],
	};

	return <ChordDiagram chord={cMajor} view="vertical-right" />;
};

export default App;
```

### Modo Canhoto

Selecione `horizontal-left` ou `vertical-left` via `view`.

```jsx
import React from "react";
import { ChordDiagram } from "@svguitar/react";

const App = () => {
	const cMajor = {
		fingers: [
			{ fret: 3, string: 2, is_muted: false, text: "3" },
			{ fret: 2, string: 3, is_muted: false, text: "2" },
			{ fret: 1, string: 5, is_muted: false, text: "1" },
		],
		barres: [],
	};

	return <ChordDiagram chord={cMajor} view="horizontal-left" />; // Labels de afinação aparecem à direita e os números dos trastes são exibidos em ordem crescente da direita para a esquerda (lendo da esquerda para a direita: 3, 2, 1, 0). Nas views verticais, os rótulos de afinação ficam acima das cordas verticais e os números dos trastes ficam à direita do braço, formando uma coluna vertical.
};

export default App;
```

## 5. Tratamento de Erros

O componente lança erros específicos para dados inválidos.

```jsx
import React from "react";
import { ChordDiagram } from "@svguitar/react";

const App = () => {
	const invalidChord = {
		fingers: [
			{ fret: -1, string: 1, is_muted: false }, // ❌ Fret inválido (deve ser >= 0)
		],
		barres: [],
	};

	try {
		return <ChordDiagram chord={invalidChord} />;
	} catch (error) {
		console.error("Erro ao renderizar acorde:", error.message);
		return <div>Erro: {error.message}</div>;
	}
};

export default App;
```

### onError (delegando UI)

```jsx
<ChordDiagram
	instrument={{ strings: 6, frets: 4, tuning: ["E2", "A2", "D3", "G3", "B3", "E4"], chord: "x3201" }}
	validation="strict"
	invalidBehavior="keep-previous"
	fallbackChord="000000"
	onError={(err, ctx) => console.error(ctx.code, err.message)}
	view="vertical-left"
/>
```

### LayoutEngine custom (avançado)

Você pode injetar uma estratégia de layout própria com `layoutEngine`.

```tsx
import { LayoutEngine, ChordDiagram } from "@svguitar/react";

const myEngine: LayoutEngine = {
	id: "horizontal-right",
	mapStringAxis: (s, frame) =>
		frame.gridOriginY + (frame.stringCount - s) * (frame.gridHeight / (frame.stringCount - 1)),
	mapFretAxis: (f, frame) => frame.gridOriginX + (f - frame.firstFret + 0.5) * frame.style.fretWidth,
	fingerPosition: (finger, { frame }) => ({
		cx:
			/* usa mapFretAxis */ frame.gridOriginX +
			(finger.fret - frame.firstFret + 0.5) * frame.style.fretWidth,
		cy:
			/* usa mapStringAxis */ frame.gridOriginY +
			(frame.stringCount - finger.string) * (frame.gridHeight / (frame.stringCount - 1)),
		r: frame.style.dotSize / 2,
	}),
	barreRect: (barre, { frame }) => ({
		x: frame.gridOriginX + (barre.fret - frame.firstFret) * frame.style.fretWidth,
		y:
			frame.gridOriginY +
			(frame.stringCount - barre.toString) * (frame.gridHeight / (frame.stringCount - 1)) -
			frame.style.barreHeight / 2,
		width: frame.style.fretWidth,
		height:
			(barre.toString - barre.fromString) * (frame.gridHeight / (frame.stringCount - 1)) +
			frame.style.barreHeight,
		rx: 4,
	}),
	indicatorPosition: (s, kind, { frame }) => ({
		x: frame.gridOriginX - frame.style.fretWidth * 0.5,
		y:
			frame.gridOriginY +
			(frame.stringCount - s) * (frame.gridHeight / (frame.stringCount - 1)) -
			frame.style.dotSize,
	}),
};

export default function Demo() {
	return <ChordDiagram chord={{ fingers: [], barres: [] }} layoutEngine={myEngine} />;
}
```

### errorFallback (UI inline) e política lenient

```jsx
<ChordDiagram
	instrument={{ strings: 6, frets: 4, tuning, chord: "x32a10" }}
	validation="lenient"
	errorFallback={err => <div role="alert">{err.message}</div>}
/>
```

## 6. Performance e Otimização

Para melhor performance, memorize os objetos de props quando possível.

```jsx
import React, { useMemo } from "react";
import { ChordDiagram } from "@svguitar/react";

const App = () => {
	const chordData = useMemo(
		() => ({
			fingers: [
				{ fret: 3, string: 2, is_muted: false, text: "3" },
				{ fret: 2, string: 3, is_muted: false, text: "2" },
				{ fret: 1, string: 5, is_muted: false, text: "1" },
			],
			barres: [],
		}),
		[]
	);

	const styleData = useMemo(
		() => ({
			width: 200,
			height: 250,
			dotColor: "#2196F3",
		}),
		[]
	);

	return <ChordDiagram chord={chordData} style={styleData} />;
};

export default App;
```

## 7. TypeScript

O componente é totalmente tipado e inclui definições de tipos.

```typescript
import React from "react";
import { ChordDiagram, ChordDiagramProps, Chord } from "@svguitar/react";

const App: React.FC = () => {
	const chord: Chord = {
		fingers: [
			{ fret: 3, string: 2, is_muted: false, text: "3" },
			{ fret: 2, string: 3, is_muted: false, text: "2" },
			{ fret: 1, string: 5, is_muted: false, text: "1" },
		],
		barres: [],
	};

	const props: ChordDiagramProps = {
		chord,
		style: {
			width: 200,
			height: 250,
		},
	};

	return <ChordDiagram {...props} />;
};

export default App;
```
