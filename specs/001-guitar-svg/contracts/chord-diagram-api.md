# Contrato da API - ChordDiagram Component

## Visão Geral

O componente `ChordDiagram` é uma biblioteca React que renderiza diagramas de acordes de guitarra em formato SVG. Este documento define o contrato da API pública.

## Interface Principal

### ChordDiagramProps

```typescript
type InvalidBehavior = "keep-previous" | "render-fallback" | "suppress";

import type { FrettedInstrumentVoicing } from "achorde-musical-domain";

interface ErrorContext {
	input: string | Chord | FrettedInstrumentVoicing;
	code: ErrorCode;
	message: string;
	normalized?: Chord | null;
	warnings?: ErrorCode[];
}

interface ChordDiagramProps {
	voicing?: FrettedInstrumentVoicing;
	instrument?: Partial<Instrument>;
	chord?: Chord;

	// Políticas de validação/erro
	validation?: "strict" | "lenient"; // default: "strict"
	invalidBehavior?: InvalidBehavior; // default: "keep-previous"
	fallbackChord?: string | Chord; // default: "000000"
	onError?: (error: ChordDiagramError, context: ErrorContext) => void;
	errorFallback?: React.ReactNode | ((error: ChordDiagramError, context: ErrorContext) => React.ReactNode);

	// Layout (mapping-per-view)
	view?: ViewId; // default: "horizontal-right"
	layoutEngine?: LayoutEngine; // estratégia customizada; se fornecida, prevalece

	// Dimensões
	width?: number;
	height?: number;
	fretCount?: number;
	stringCount?: number;
	fretWidth?: number;
	fretHeight?: number;
	stringWidth?: number;
	dotSize?: number;
	barreHeight?: number;

	// Cores
	backgroundColor?: string;
	fretColor?: string;
	stringColor?: string;
	dotColor?: string;
	dotTextColor?: string;
	barreColor?: string;
	fretTextColor?: string;
	tuningTextColor?: string;
	openStringColor?: string;
	mutedStringColor?: string;

	// Fontes
	fontFamily?: string;
	dotTextSize?: number;
	fretTextSize?: number;
	tuningTextSize?: number;

	// TuningLabels customization
	tuningLabelOffsetX?: number; // Multiplicador (-5 a 5) aplicado a fretWidth (padrão: 0)
	tuningLabelOffsetY?: number; // Multiplicador (-5 a 5) aplicado a fretHeight (padrão: 0.5)
	tuningLabelFormat?: "scientific" | "note-only"; // Formato dos rótulos (padrão: "scientific")

	// String indicators customization
	stringIndicatorOffsetX?: number; // Multiplicador (-5 a 5) aplicado a fretWidth (padrão: 0.5)
	stringIndicatorOffsetY?: number; // Multiplicador (-5 a 5) aplicado a fretHeight (padrão: 0)

	// Barres customization
	barresWidth?: number; // Largura/grossura da barre em pixels (padrão: 8). Em views horizontais, controla a largura (width) do retângulo SVG. Em views verticais, controla a altura/grossura (height) do retângulo SVG.
	barresOpacity?: number; // Opacidade de 0 a 1 (padrão: 1.0)
	barresOffsetX?: number; // Multiplicador (-5 a 5) aplicado a fretWidth (padrão: 0)
	barresOffsetY?: number; // Multiplicador (-5 a 5) aplicado a fretHeight (padrão: 0)

	// Fret numbers customization
	fretTextOffsetX?: number; // Multiplicador (-5 a 5) aplicado a fretWidth (padrão: 0)
	fretTextOffsetY?: number; // Multiplicador (-5 a 5) aplicado a fretHeight (padrão: 0)

	// Nut (fret zero) customization
	nutStrokeWidth?: number; // Multiplicador (-5 a 5) aplicado a fretWidth para espessura da linha do nut (padrão: 0.075)
	nutOffsetX?: number; // Multiplicador (-5 a 5) aplicado a fretWidth (padrão: 0)
	nutOffsetY?: number; // Multiplicador (-5 a 5) aplicado a fretHeight (padrão: 0)
	nutOpacity?: number; // Opacidade de 0 a 1 (padrão: 1.0)
	nutColor?: string; // Cor da linha do nut (padrão: igual a fretColor)

	// Canvas positioning (global diagram offset)
	canvasOffsetX?: number; // Deslocamento horizontal em pixels (padrão: 0)
	canvasOffsetY?: number; // Deslocamento vertical em pixels (padrão: 0)
}
```

**Regras de Validação**:

- Pelo menos um de `voicing`, `instrument` ou `chord` deve ser fornecido
- Se `voicing` for fornecido, ele é convertido para o modelo interno do renderer
- Se ambos `chord` e `instrument` forem fornecidos, `chord` tem precedência
- Propriedades de estilo são sempre opcionais e serão mescladas com valores padrão
- Validação respeita `validation`: em `strict`, entradas inválidas disparam erro/fluxo de `invalidBehavior`; em `lenient`, entradas podem ser normalizadas (com warnings).
- `invalidBehavior` define ação em caso de acorde inválido: manter último válido (padrão), renderizar `fallbackChord`, ou suprimir.
- `fallbackChord` é usado quando não houver último válido; por padrão é `"000000"`.
- `tuningLabelOffsetX`, `tuningLabelOffsetY`, `stringIndicatorOffsetX`, `stringIndicatorOffsetY`, `barresOffsetX`, `barresOffsetY`, `fretTextOffsetX` e `fretTextOffsetY` devem estar entre -5 e 5
- `barresOpacity` deve estar entre 0 e 1
- `barresWidth` deve ser um número positivo
- `nutStrokeWidth`, `nutOffsetX`, `nutOffsetY` devem estar entre -5 e 5
- `nutOpacity` deve estar entre 0 e 1
- `canvasOffsetX` e `canvasOffsetY` podem ser qualquer número (pixels)

## Entidades de Dados

### Chord

```typescript
interface Chord {
	fingers: Finger[];
	barres: Barre[];
	firstFret?: number;
	lastFret?: number;
}
```

**Regras de Validação**:

- `fingers` deve ser um array válido (pode estar vazio)
- `barres` deve ser um array válido (pode estar vazio)
- `firstFret` deve ser > 0 se fornecido
- `lastFret` deve ser > `firstFret` se ambos fornecidos

### Instrument

```typescript
interface Instrument {
	strings: number;
	frets: number;
	tuning: string[];
	chord: string;
}
```

**Regras de Validação**:

- `strings` deve ser > 0
- `frets` deve ser > 0
- `tuning.length` deve igualar `strings`
- `tuning` deve conter notas válidas em notação científica (ex: "E2", "A2"), da corda mais grave para a mais aguda.
- A contagem de cordas na Fret Notation `chord` deve igualar `strings`
- `chord` deve conter apenas caracteres válidos: '0'-'9', 'x', 'o', '(', ')'

### Finger

```typescript
interface Finger {
	fret: number;
	string: number;
	is_muted: boolean;
	text?: string;
}
```

**Regras de Validação**:

- `fret` deve ser >= 0 (0 para cordas soltas)
- `string` deve estar no intervalo [1, strings], onde 1 é a corda mais grave.
- `is_muted` deve ser boolean (true para cordas mutadas)
- `text` é opcional e será renderizado dentro do círculo

### Barre

```typescript
interface Barre {
	fret: number;
	fromString: number;
	toString: number;
	text?: string;
}
```

**Regras de Validação**:

- `fret` deve ser > 0
- `fromString` deve estar no intervalo [1, strings], onde 1 é a corda mais grave.
- `toString` deve estar no intervalo [1, strings].
- `fromString` deve ser <= `toString`

### ChordStyle

```typescript
interface ChordStyle {
	// (view/layoutEngine controla layout)

	// Dimensões
	width?: number;
	height?: number;
	fretCount?: number;
	stringCount?: number;
	fretWidth?: number;
	fretHeight?: number;
	stringWidth?: number;
	dotSize?: number;
	barreHeight?: number;

	// Cores
	backgroundColor?: string;
	fretColor?: string;
	stringColor?: string;
	dotColor?: string;
	dotTextColor?: string;
	barreColor?: string;
	fretTextColor?: string;
	tuningTextColor?: string;
	openStringColor?: string;
	mutedStringColor?: string;

	// Fontes
	fontFamily?: string;
	dotTextSize?: number;
	fretTextSize?: number;
	tuningTextSize?: number;

	// TuningLabels customization
	tuningLabelOffset?: number; // Multiplicador (0-1) aplicado a fretWidth/fretHeight (padrão: 0.5)
	tuningLabelFormat?: "scientific" | "note-only"; // Formato dos rótulos (padrão: "scientific")

	// String indicators customization
	stringIndicatorOffset?: number; // Multiplicador (0-1) para indicadores 'O' e 'X' (padrão: 0.5)
}
```

**Regras de Validação**:

- Todos os valores numéricos devem ser > 0
- Todas as cores devem ser strings válidas (hex, rgb, nome)
- `fontFamily` deve ser uma string válida de fonte
- `tuningLabelOffset` deve estar entre 0 e 1
- `stringIndicatorOffset` deve estar entre 0 e 1

## Comportamento do Componente

### Renderização

1. **Prioridade de Dados**: Se ambos `chord` e `instrument` forem fornecidos, `chord` tem precedência
2. **Conversão de Fret Notation**: Se apenas `instrument` for fornecido, a Fret Notation será convertida para o formato `Chord`. A biblioteca `tonal` será usada para validar a afinação e calcular as notas.
3. **Estilos**: As propriedades de estilo serão mescladas com valores padrão
4. **Validação**: Todas as props serão validadas antes da renderização, obedecendo `validation`.
5. **Erro de Acorde**: Em caso de acorde inválido, segue `invalidBehavior`; `onError` é chamado se fornecido; `errorFallback` pode ser renderizado inline.

### Casos Limite

1. **Acorde Vazio**: Se `fingers` e `barres` estiverem vazios, renderizar apenas o braço
2. **Posições Inválidas**: Dedos fora dos limites serão ignorados
3. **Pestanas Sobrepostas**: Pestanas têm prioridade sobre dedos na mesma posição
4. **Afinação Incompleta**: Lançar erro se `tuning.length !== strings`
5. **Cordas Soltas e Mutadas**:
    - Cordas soltas (`fret: 0, is_muted: false`) renderizam um círculo ('O') com preenchimento branco no traste zero (primeira linha vertical)
    - Cordas mutadas (`fret: 0, is_muted: true`) renderizam um 'X' vermelho e espesso no traste zero
    - Indicadores aparecem acima do traste mais grosso, próximos às notas de afinação
    - Se há dedos na mesma corda, eles não são mostrados (cordas mutadas têm precedência)
    - Ambos os indicadores usam o tamanho definido por `dotSize`
6. **Centralização de Dots**: Os dots (posições dos dedos) devem sempre ser centralizados no meio do espaço do traste, independentemente do valor de `fretWidth`. O cálculo deve usar `fretWidth * 0.5` para garantir centralização consistente.

### Views e Layout Engines

```typescript
type ViewId = "horizontal-right" | "horizontal-left" | "vertical-right" | "vertical-left";

interface LayoutFrame {
	width: number;
	height: number;
	gridOriginX: number;
	gridOriginY: number;
	gridWidth: number;
	gridHeight: number;
	firstFret: number;
	stringCount: number;
	fretCount: number;
	style: ChordStyle;
}

interface LayoutArgs {
	frame: LayoutFrame;
}

interface LayoutEngine {
	id: ViewId;
	mapStringAxis(stringNumber: number, frame: LayoutFrame): number;
	mapFretAxis(fret: number, frame: LayoutFrame): number;
	fingerPosition(finger: Finger, args: LayoutArgs): { cx: number; cy: number; r: number };
	barreRect(
		barre: Barre,
		args: LayoutArgs
	): { x: number; y: number; width: number; height: number; rx?: number };
	indicatorPosition(
		stringNumber: number,
		kind: "open" | "muted",
		args: LayoutArgs
	): { x: number; y: number };
}
```

- Precedência: `layoutEngine` > `view`.
- `view` substitui o uso direto de `orientation`/`handedness` (deprecadas nesta API).
- As 4 views built-in devem garantir legibilidade horizontal dos textos e não utilizar `transform` global; cada engine retorna coordenadas absolutas. A view `horizontal-left` deve posicionar os rótulos de afinação à direita do braço e exibir os números dos trastes em ordem crescente da direita para a esquerda (lendo da esquerda para a direita resulta, por exemplo, em "3, 2, 1, 0"), com o traste 0 imediatamente antes desses rótulos. As views verticais (`vertical-right` e `vertical-left`) devem posicionar os rótulos de afinação (TuningLabels) acima das cordas verticais, da esquerda para a direita, e os números das posições dos trastes (FretNumbers) à direita do braço, nos pontos médios de cada casa do braço, começando com "1" (no ponto médio da casa 1, entre o nut/traste 0 e o traste 1) e "2, 3, 4, 5..." abaixo, formando uma coluna vertical de números. O nut (traste 0) não possui número associado.
- A centralização no espaço de traste é obrigatória em todas as views.

### Tratamento de Erros

O componente lança `ChordDiagramError` com códigos específicos:

- `INVALID_FRET`: Fret inválido (<= 0)
- `INVALID_STRING`: String fora do intervalo válido
- `INVALID_TUNING`: Afinação com tamanho incorreto
- `INVALID_TAB_STRING`: Fret Notation inválida
- `INVALID_BARRE`: Pestana com parâmetros inválidos

## Exemplos de Uso

### onError (delegando UI)

```tsx
<ChordDiagram
	instrument={{ strings: 6, frets: 4, tuning: ["E2", "A2", "D3", "G3", "B3", "E4"], chord: "x3201" }}
	onError={(err, ctx) => console.error(ctx.code, err.message)}
	invalidBehavior="keep-previous"
	fallbackChord="000000"
/>
```

### errorFallback (UI inline)

```tsx
<ChordDiagram chord={chord} errorFallback={err => <div role="alert">{err.message}</div>} />
```

### Uso Básico com Chord

```typescript
const props: ChordDiagramProps = {
	chord: {
		fingers: [
			{ fret: 1, string: 2, text: "1" },
			{ fret: 2, string: 4, text: "2" },
		],
		barres: [],
	},
};
```

### Uso com Instrument

```typescript
const props: ChordDiagramProps = {
	instrument: {
		strings: 6,
		frets: 4,
		tuning: ["E2", "A2", "D3", "G3", "B3", "E4"],
		chord: "x32010", // Fret Notation para C Major
	},
};
```

### Uso com Estilos Customizados

```typescript
const props: ChordDiagramProps = {
	chord: {
		/* ... */
	},
	view: "vertical-left",
	width: 200,
	height: 250,
	dotColor: "#FF5733",
	fontFamily: "Arial, sans-serif",
};
```

## Performance

### Otimizações

- O componente é envolvido em `React.memo` para evitar re-renderizações desnecessárias
- Props devem ser memorizadas no componente pai para máxima eficiência
- Renderização SVG nativa para melhor performance
- Otimizações de renderização SVG
- Dependência da biblioteca `tonal` para cálculos de teoria musical

### Recomendações

- Use `useMemo` para objetos de props complexos
- Evite criar novos objetos de props a cada render
- Prefira objetos `chord` para melhor performance (evita parsing de strings)

## Versionamento

- **v1.1.0**: Adicionado suporte para rotação, modo canhoto e integração com `tonal.js`.
- **v1.0.0**: Versão inicial com funcionalidades básicas
- **Breaking Changes**: Serão documentadas em CHANGELOG.md
- **Compatibilidade**: Mantida entre versões menores e patches
