# Contrato da API - ChordDiagram Component

## Visão Geral

O componente `ChordDiagram` é uma biblioteca React que renderiza diagramas de acordes de guitarra em formato SVG. Este documento define o contrato da API pública.

## Interface Principal

### ChordDiagramProps

```typescript
type InvalidBehavior = "keep-previous" | "render-fallback" | "suppress";

interface ErrorContext {
	input: string | Chord;
	code: ErrorCode;
	message: string;
	normalized?: Chord | null;
	warnings?: ErrorCode[];
}

interface ChordDiagramProps {
	instrument?: Partial<Instrument>;
	chord?: Chord;

	// Políticas de validação/erro
	validation?: "strict" | "lenient"; // default: "strict"
	invalidBehavior?: InvalidBehavior; // default: "keep-previous"
	fallbackChord?: string | Chord; // default: "000000"
	onError?: (error: ChordDiagramError, context: ErrorContext) => void;
	errorFallback?: React.ReactNode | ((error: ChordDiagramError, context: ErrorContext) => React.ReactNode);

	// Layout
	orientation?: "vertical" | "horizontal";
	handedness?: "right" | "left";

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
}
```

**Regras de Validação**:

- Pelo menos um de `instrument` ou `chord` deve ser fornecido
- Se ambos forem fornecidos, `chord` tem precedência
- Propriedades de estilo são sempre opcionais e serão mescladas com valores padrão
- Validação respeita `validation`: em `strict`, entradas inválidas disparam erro/fluxo de `invalidBehavior`; em `lenient`, entradas podem ser normalizadas (com warnings).
- `invalidBehavior` define ação em caso de acorde inválido: manter último válido (padrão), renderizar `fallbackChord`, ou suprimir.
- `fallbackChord` é usado quando não houver último válido; por padrão é `"000000"`.

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
	// Layout
	orientation?: "vertical" | "horizontal";
	handedness?: "right" | "left";

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
}
```

**Regras de Validação**:

- Todos os valores numéricos devem ser > 0
- Todas as cores devem ser strings válidas (hex, rgb, nome)
- `fontFamily` deve ser uma string válida de fonte
- `orientation` e `handedness` devem ser uma das strings permitidas

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
	width: 200,
	height: 250,
	dotColor: "#FF5733",
	fontFamily: "Arial, sans-serif",
	orientation: "vertical",
	handedness: "left",
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
