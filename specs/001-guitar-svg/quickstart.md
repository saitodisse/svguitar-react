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

Use a propriedade `view` para selecionar entre as views predefinidas: `horizontal-right` (padrão), `horizontal-left`, `vertical-right`, `vertical-left`. Nas views verticais, os rótulos de afinação (TuningLabels) são posicionados acima das cordas verticais, da esquerda para a direita, e os números das posições dos trastes (FretNumbers) são posicionados à direita do braço, nos pontos médios de cada casa do braço, começando com "1" (no ponto médio da casa 1, entre o nut/traste 0 e o traste 1) e "2, 3, 4, 5..." abaixo, formando uma coluna vertical de números. O nut (traste 0) não possui número associado.

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

	return <ChordDiagram chord={cMajor} view="horizontal-left" />; // Labels de afinação aparecem à direita e os números dos trastes são exibidos em ordem crescente da direita para a esquerda (lendo da esquerda para a direita: 3, 2, 1, 0). Nas views verticais, os rótulos de afinação ficam acima das cordas verticais e os números das posições dos trastes ficam à direita do braço, nos pontos médios de cada casa do braço, formando uma coluna vertical.
};

export default App;
```

### Customização dos TuningLabels

#### Ajustar Distância dos Rótulos

Você pode ajustar a distância dos rótulos de afinação em relação ao nut usando `tuningLabelOffset` (multiplicador de 0-1):

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

	return (
		<ChordDiagram
			chord={cMajor}
			tuningLabelOffset={0.7} // Labels mais distantes do nut (padrão: 0.5)
		/>
	);
};

export default App;
```

#### Simplificar Formato dos Rótulos

Para economizar espaço, você pode mostrar apenas a nota sem o número da oitava:

```jsx
import React from "react";
import { ChordDiagram } from "@svguitar/react";

const App = () => {
	const gMajor = {
		strings: 6,
		frets: 5,
		tuning: ["E2", "A2", "D3", "G3", "B3", "E4"],
		chord: "320003",
	};

	return (
		<ChordDiagram
			instrument={gMajor}
			tuningLabelFormat="note-only" // Mostra "E A D G B E" ao invés de "E2 A2 D3 G3 B3 E4"
		/>
	);
};

export default App;
```

#### Combinando Ambas Customizações

```jsx
import React from "react";
import { ChordDiagram } from "@svguitar/react";

const App = () => {
	return (
		<ChordDiagram
			instrument={{
				tuning: ["E2", "A2", "D3", "G3", "B3", "E4"],
				chord: "x32010",
			}}
			view="vertical-right"
			tuningLabelOffset={0.3} // Labels mais próximos do braço
			tuningLabelFormat="note-only" // Formato simplificado
			width={200}
			height={300}
		/>
	);
};

export default App;
```

#### Customização da Distância dos Indicadores

Você pode ajustar a distância dos indicadores de cordas soltas ('O') e mutadas ('X') em relação ao nut:

```jsx
import React from "react";
import { ChordDiagram } from "@svguitar/react";

const App = () => {
	const cMajor = {
		fingers: [
			{ fret: 0, string: 1, is_muted: true }, // X
			{ fret: 3, string: 2, is_muted: false, text: "3" },
			{ fret: 2, string: 3, is_muted: false, text: "2" },
			{ fret: 0, string: 4, is_muted: false }, // O
			{ fret: 1, string: 5, is_muted: false, text: "1" },
			{ fret: 0, string: 6, is_muted: false }, // O
		],
		barres: [],
	};

	return (
		<ChordDiagram
			chord={cMajor}
			stringIndicatorOffset={0.3} // Indicadores mais próximos do nut
			tuningLabelOffset={0.7} // Labels mais distantes
			tuningLabelFormat="note-only" // Formato simplificado
		/>
	);
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

## 11. Customização Avançada de Offsets

### Exemplo 14: Barres com Opacity e Offsets

Customize a aparência das barres (pestanas) com largura, opacidade e deslocamento.

```jsx
import React from "react";
import { ChordDiagram } from "@svguitar/react";

const App = () => {
	const fMajor = {
		fingers: [
			{ fret: 3, string: 2, is_muted: false, text: "3" },
			{ fret: 3, string: 3, is_muted: false, text: "4" },
			{ fret: 2, string: 4, is_muted: false, text: "2" },
		],
		barres: [{ fret: 1, fromString: 1, toString: 6 }],
	};

	return (
		<ChordDiagram
			chord={fMajor}
			barresWidth={12} // Largura da barre em pixels
			barresOpacity={0.7} // Opacidade (0-1)
			barresOffsetX={0.1} // Deslocamento horizontal (multiplicador)
			barresOffsetY={-0.05} // Deslocamento vertical (multiplicador)
		/>
	);
};

export default App;
```

### Exemplo 15: Tuning Labels com Offsets X e Y

Ajuste a posição dos rótulos de afinação horizontal e verticalmente.

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

	return (
		<ChordDiagram
			chord={cMajor}
			tuningLabelOffsetX={0.2} // Deslocamento horizontal
			tuningLabelOffsetY={0.7} // Deslocamento vertical (para baixo em vertical, para esquerda/direita em horizontal)
			tuningLabelFormat="note-only" // Mostrar apenas nota (E, A, D) ao invés de E2, A2, D3
		/>
	);
};

export default App;
```

### Exemplo 16: String Indicators (O/X) com Offsets

Controle a posição dos indicadores de cordas soltas e mutadas.

```jsx
import React from "react";
import { ChordDiagram } from "@svguitar/react";

const App = () => {
	const chord = {
		fingers: [
			{ fret: 0, string: 1, is_muted: true }, // X
			{ fret: 3, string: 2, is_muted: false, text: "3" },
			{ fret: 2, string: 3, is_muted: false, text: "2" },
			{ fret: 0, string: 4, is_muted: false }, // O
			{ fret: 1, string: 5, is_muted: false, text: "1" },
			{ fret: 0, string: 6, is_muted: false }, // O
		],
		barres: [],
	};

	return (
		<ChordDiagram
			chord={chord}
			stringIndicatorOffsetX={0.3} // Mais próximo do nut (horizontal)
			stringIndicatorOffsetY={0.1} // Deslocamento vertical
		/>
	);
};

export default App;
```

### Exemplo 17: Fret Numbers com Offsets

Ajuste a posição dos números dos trastes.

```jsx
import React from "react";
import { ChordDiagram } from "@svguitar/react";

const App = () => {
	const dMajor = {
		fingers: [
			{ fret: 5, string: 2, is_muted: false },
			{ fret: 7, string: 3, is_muted: false, text: "2" },
			{ fret: 7, string: 4, is_muted: false, text: "3" },
			{ fret: 7, string: 5, is_muted: false, text: "4" },
		],
		barres: [],
		firstFret: 5,
	};

	return (
		<ChordDiagram
			chord={dMajor}
			fretTextOffsetX={0.15} // Deslocamento horizontal dos números
			fretTextOffsetY={-0.1} // Deslocamento vertical dos números
			fretTextSize={14}
		/>
	);
};

export default App;
```

### Exemplo 18: Customização Completa (Todas as Novas Props)

Combine todas as customizações avançadas em um único diagrama.

```jsx
import React from "react";
import { ChordDiagram } from "@svguitar/react";

const App = () => {
	const chord = {
		fingers: [
			{ fret: 3, string: 2, is_muted: false, text: "3" },
			{ fret: 3, string: 3, is_muted: false, text: "4" },
			{ fret: 2, string: 4, is_muted: false, text: "2" },
			{ fret: 0, string: 6, is_muted: false }, // O
		],
		barres: [{ fret: 1, fromString: 1, toString: 5 }],
	};

	return (
		<ChordDiagram
			chord={chord}
			view="vertical-right"
			// Barres customization
			barresWidth={10}
			barresOpacity={0.8}
			barresOffsetX={0}
			barresOffsetY={0.05}
			// Tuning labels customization
			tuningLabelOffsetX={0}
			tuningLabelOffsetY={0.3}
			tuningLabelFormat="note-only"
			// String indicators customization
			stringIndicatorOffsetX={0.4}
			stringIndicatorOffsetY={0}
			// Fret numbers customization
			fretTextOffsetX={0.2}
			fretTextOffsetY={0}
			// Visual styling
			width={220}
			height={320}
			dotSize={16}
			fretTextSize={14}
			tuningTextSize={16}
			fontFamily="monospace"
		/>
	);
};

export default App;
```

## 12. Breaking Changes (v1.16.0)

⚠️ **Atenção**: A versão 1.16.0 introduz breaking changes relacionados aos offsets de tuning labels e string indicators.

### Migration Guide

```jsx
// ❌ Antes (v1.15.0)
<ChordDiagram
  tuningLabelOffset={0.5}
  stringIndicatorOffset={0.7}
/>

// ✅ Depois (v1.16.0)
<ChordDiagram
  tuningLabelOffsetX={0}        // Offset horizontal (novo)
  tuningLabelOffsetY={0.5}      // Offset vertical (equivale ao antigo tuningLabelOffset)
  stringIndicatorOffsetX={0.7}  // Offset horizontal (equivale ao antigo stringIndicatorOffset)
  stringIndicatorOffsetY={0}    // Offset vertical (novo)
/>
```

**Mudanças**:

- `tuningLabelOffset` foi substituído por `tuningLabelOffsetX` e `tuningLabelOffsetY`
- `stringIndicatorOffset` foi renomeado para `stringIndicatorOffsetX` e adicionado `stringIndicatorOffsetY`
- Todos os offsets agora suportam range -5 a 5 (ao invés de 0-1)

**Novas funcionalidades**:

- `barresWidth`: Largura horizontal das barres em pixels
- `barresOpacity`: Opacidade das barres (0-1)
- `barresOffsetX` e `barresOffsetY`: Deslocamento das barres
- `fretTextOffsetX` e `fretTextOffsetY`: Deslocamento dos números dos trastes
