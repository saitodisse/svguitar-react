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
			{ fret: 1, string: 2, is_muted: false, text: "1" },
			{ fret: 2, string: 4, is_muted: false, text: "2" },
			{ fret: 3, string: 5, is_muted: false, text: "3" },
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
			{ fret: 2, string: 3, is_muted: false, text: "2" },
			{ fret: 3, string: 5, is_muted: false, text: "3" },
			{ fret: 3, string: 4, is_muted: false, text: "4" },
		],
		barres: [{ fret: 1, fromString: 6, toString: 1 }],
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
		tuning: ["E", "A", "D", "G", "B", "E"],
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
			{ fret: 1, string: 2, is_muted: false },
			{ fret: 2, string: 4, is_muted: false },
			{ fret: 2, string: 3, is_muted: false },
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
			{ fret: 7, string: 2, is_muted: false, text: "1" },
			{ fret: 7, string: 3, is_muted: false, text: "2" },
			{ fret: 7, string: 4, is_muted: false, text: "3" },
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
		tuning: ["D", "A", "D", "G", "B", "E"], // Drop D tuning
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
		tuning: ["E", "A", "D", "G", "B", "E"],
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
			{ fret: 1, string: 2, is_muted: false, text: "1" },
			{ fret: 2, string: 4, is_muted: false, text: "2" },
			{ fret: 3, string: 5, is_muted: false, text: "3" },
			{ fret: 0, string: 1, is_muted: false }, // Corda solta (mostra 'O')
			{ fret: 0, string: 3, is_muted: true }, // Corda mutada (mostra 'X' vermelho)
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
		tuning: ["E", "A", "D", "G", "B", "E"],
		chord: "(10)(12)(12)(11)(10)(10)", // F Major na 10ª casa
	};

	return <ChordDiagram instrument={fMajor10th} />;
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
			{ fret: -1, string: 2, is_muted: false }, // ❌ Fret inválido (deve ser >= 0)
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

## 6. Performance e Otimização

Para melhor performance, memorize os objetos de props quando possível.

```jsx
import React, { useMemo } from "react";
import { ChordDiagram } from "@svguitar/react";

const App = () => {
	const chordData = useMemo(
		() => ({
			fingers: [
				{ fret: 1, string: 2, is_muted: false, text: "1" },
				{ fret: 2, string: 4, is_muted: false, text: "2" },
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
			{ fret: 1, string: 2, is_muted: false, text: "1" },
			{ fret: 2, string: 4, is_muted: false, text: "2" },
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
