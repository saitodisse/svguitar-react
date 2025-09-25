# Modelo de Dados - API do Componente ChordDiagram

Este documento define as interfaces TypeScript para as props do componente `ChordDiagram`. Esta é a API pública que será exposta aos consumidores do pacote NPM.

## 1. Entidades Principais

### `ChordDiagramProps`

Interface principal do componente. Ela aceita os dados do acorde de duas formas: como um objeto estruturado (`chord`) ou como uma string de tablatura (`instrument`).

```typescript
interface ChordDiagramProps {
	instrument?: Partial<Instrument>; // Para entrada via Fret Notation "x32010"
	chord?: Chord; // Para entrada estruturada de dedos e pestanas
	style?: Partial<ChordStyle>;
}
```

### `Chord`

Representa um acorde de forma estruturada, com dedos, pestanas e trastes a serem exibidos.

```typescript
interface Chord {
	fingers: Finger[];
	barres: Barre[];
	firstFret?: number; // Traste inicial a ser exibido (ex: 5 para 5ª posição)
	lastFret?: number; // Traste final a ser exibido
}
```

### `Instrument`

Define o instrumento, usado principalmente para interpretar a string de tablatura.

```typescript
interface Instrument {
	strings: number; // Número de cordas
	frets: number; // Número de trastes a serem mostrados no diagrama
	tuning: string[]; // Afinação das cordas, ex: ["E2", "A2", "D3", "G3", "B3", "E4"]
	chord: string; // A Fret Notation, ex: "x32010" ou "(10)x(12)..."
}
```

## 2. Entidades de Posicionamento

### `Finger`

Representa um dedo posicionado no braço.

- **Regra de Validação**: `fret` deve ser maior ou igual a 0 (0 para cordas soltas). `string` deve estar dentro do intervalo de cordas do instrumento. `is_muted` indica se a corda está mutada.

```typescript
interface Finger {
	fret: number;
	string: number;
	is_muted: boolean;
	text?: string; // Texto opcional dentro do círculo (ex: "1", "A")
}
```

### `Barre`

Representa uma pestana.

- **Regra de Validação**: `fromString` deve ser menor ou igual a `toString`.

```typescript
interface Barre {
	fret: number;
	fromString: number;
	toString: number;
	text?: string;
}
```

## 3. Entidade de Estilo

### `ChordStyle`

Define todas as propriedades visuais customizáveis do diagrama. Todas as propriedades são opcionais e terão valores padrão.

```typescript
interface ChordStyle {
	// Layout
	orientation: "vertical" | "horizontal"; // Rotação do braço
	handedness: "right" | "left"; // Para destro ou canhoto

	// Dimensões
	width: number; // Largura total do SVG
	height: number; // Altura total do SVG
	fretCount: number; // Número de trastes a serem renderizados
	stringCount: number; // Número de cordas
	fretWidth: number;
	fretHeight: number;
	stringWidth: number;
	dotSize: number; // Tamanho dos círculos dos dedos
	barreHeight: number;
	openStringSize: number; // Tamanho do círculo 'O' para cordas soltas
	mutedStringSize: number; // Tamanho do 'X' para cordas mutadas

	// Cores
	backgroundColor: string;
	fretColor: string;
	stringColor: string;
	dotColor: string;
	dotTextColor: string;
	barreColor: string;
	fretTextColor: string;
	tuningTextColor: string;
	openStringColor: string; // Cor do círculo 'O' para cordas soltas
	mutedStringColor: string; // Cor do 'X' para cordas mutadas

	// Fontes
	fontFamily: string;
	dotTextSize: number;
	fretTextSize: number;
	tuningTextSize: number;
}
```

## 4. Regras de Validação

### Validação de Fingers

```typescript
function validateFinger(finger: Finger, stringCount: number): boolean {
	return (
		finger.fret >= 0 &&
		finger.string >= 1 &&
		finger.string <= stringCount &&
		typeof finger.is_muted === "boolean"
	);
}
```

### Validação de Barres

```typescript
function validateBarre(barre: Barre, stringCount: number): boolean {
	return (
		barre.fret > 0 &&
		barre.fromString >= 1 &&
		barre.toString <= stringCount &&
		barre.fromString <= barre.toString
	);
}
```

### Validação de Instrument

```typescript
function validateInstrument(instrument: Instrument): boolean {
	return (
		instrument.strings > 0 &&
		instrument.frets > 0 &&
		instrument.tuning.length === instrument.strings &&
		instrument.tuning.every(note => isScientificNotation(note)) // Valida com tonal.js
		// A validação de `chord` (Fret Notation) é mais complexa e feita no parser
	);
}
```

## 5. Conversão de Fret Notation

### Função de Parsing

```typescript
// Esta função usará a biblioteca `tonal` para validar as notas da afinação
// e calcular a nota de cada dedo pressionado.
function parseFretNotation(fretNotation: string, tuning: string[]): Chord {
	const fingers: Finger[] = [];
	const barres: Barre[] = [];
	let stringNumber = 1;
	let i = 0;

	while (i < fretNotation.length) {
		let fret: number | "x" | "o" | null = null;
		const char = fretNotation[i];

		if (char === "x") {
			fret = "x";
			i++;
		} else if (char === "o") {
			fret = "o";
			i++;
		} else if (char === "(") {
			const endIndex = fretNotation.indexOf(")", i);
			if (endIndex === -1) {
				// Tratar erro de sintaxe
				break;
			}
			fret = parseInt(fretNotation.substring(i + 1, endIndex), 10);
			i = endIndex + 1;
		} else if (char >= "0" && char <= "9") {
			fret = parseInt(char, 10);
			i++;
		} else {
			// Ignorar caracteres inválidos e avançar
			i++;
			stringNumber++;
			continue;
		}

		if (typeof fret === "number" && fret >= 0) {
			fingers.push({
				fret,
				string: stringNumber,
				is_muted: false,
			});
		} else if (fret === "o") {
			fingers.push({
				fret: 0,
				string: stringNumber,
				is_muted: false,
			});
		} else if (fret === "x") {
			fingers.push({
				fret: 0,
				string: stringNumber,
				is_muted: true,
			});
		}

		stringNumber++;
	}

	return { fingers, barres };
}
```

## 6. Valores Padrão

### ChordStyle Defaults

```typescript
const DEFAULT_CHORD_STYLE: ChordStyle = {
	// Layout
	orientation: "horizontal",
	handedness: "right",

	// Dimensões
	width: 200,
	height: 250,
	fretCount: 4,
	stringCount: 6,
	fretWidth: 40,
	fretHeight: 30,
	stringWidth: 2,
	dotSize: 12,
	barreHeight: 8,
	openStringSize: 12,
	mutedStringSize: 12,

	// Cores
	backgroundColor: "#ffffff",
	fretColor: "#333333",
	stringColor: "#666666",
	dotColor: "#2196F3",
	dotTextColor: "#ffffff",
	barreColor: "#2196F3",
	fretTextColor: "#333333",
	tuningTextColor: "#666666",
	openStringColor: "#2196F3", // Mesma cor dos dedos normais
	mutedStringColor: "#DC143C", // Vermelho para 'X'

	// Fontes
	fontFamily: "Arial, sans-serif",
	dotTextSize: 10,
	fretTextSize: 12,
	tuningTextSize: 14,
};
```

### Instrument Defaults

```typescript
const DEFAULT_INSTRUMENT: Instrument = {
	strings: 6,
	frets: 4,
	tuning: ["E2", "A2", "D3", "G3", "B3", "E4"],
	chord: "000000",
};
```

## 7. Tipos de Erro

```typescript
class ChordDiagramError extends Error {
	constructor(
		message: string,
		public code: string
	) {
		super(message);
		this.name = "ChordDiagramError";
	}
}

// Códigos de erro específicos
const ERROR_CODES = {
	INVALID_FRET: "INVALID_FRET",
	INVALID_STRING: "INVALID_STRING",
	INVALID_TUNING: "INVALID_TUNING",
	INVALID_TAB_STRING: "INVALID_TAB_STRING",
	INVALID_BARRE: "INVALID_BARRE",
	INVALID_NOTE: "INVALID_NOTE", // Para afinação com notas inválidas
} as const;
```
