# Especificação: Export/Import de Estado do ChordDiagram

**Branch**: `001-guitar-svg`  
**Criada em**: 2025-10-11  
**Status**: Rascunho  
**Versão**: 1.0.0

---

## Visão Geral

Como desenvolvedor utilizando o componente ChordDiagram, eu quero poder exportar todo o estado atual do diagrama (incluindo todas as configurações, estilos e dados do acorde) em formato JSON, para que eu possa:

1. **Salvar presets**: Salvar configurações favoritas em arquivo
2. **Compartilhar**: Enviar configurações para outros desenvolvedores
3. **Persistir**: Manter estado entre sessões
4. **Debug**: Ver todo o estado do componente de forma estruturada
5. **Importar**: Restaurar configurações exportadas anteriormente

---

## Cenários do Usuário & Testes

### User Story Primária

Como um desenvolvedor usando o ChordDiagram, eu quero clicar em um botão "Export State" que copie todo o estado atual do diagrama para o clipboard em formato JSON e exiba no console, para que eu possa salvar, compartilhar ou debugar as configurações atuais.

### Cenários de Aceitação

1. **Dado** que tenho um ChordDiagram renderizado com configurações customizadas, **Quando** clico no botão "Export State", **Então** o sistema deve copiar o JSON completo para o clipboard e exibir no console.

2. **Dado** que tenho um JSON válido de estado exportado, **Quando** clico no botão "Import State" e colo o JSON, **Então** o sistema deve aplicar todas as configurações do JSON ao diagrama.

3. **Dado** que tento importar um JSON inválido, **Quando** clico em "Import State", **Então** o sistema deve mostrar uma mensagem de erro clara e não alterar o estado atual.

4. **Dado** que importo um JSON parcial (faltando alguns campos), **Quando** o sistema processa a importação, **Então** deve usar valores padrão para os campos faltantes.

5. **Dado** que exporto o estado, **Quando** importo o mesmo JSON, **Então** o diagrama deve ficar visualmente idêntico ao estado original.

6. **Dado** que estou na aplicação demo (App.tsx), **Quando** vejo os botões de Export/Import, **Então** eles devem estar claramente visíveis e bem posicionados na UI.

### Casos Limite

- O que acontece quando o clipboard API não está disponível? (Fallback para download de arquivo)
- Como lidar com JSON muito grande? (Compressão opcional)
- O que fazer com valores inválidos no JSON? (Validação e sanitização)
- Como lidar com versões diferentes do schema? (Versionamento do JSON)

---

## Requisitos Funcionais

### Export

- **FR-001**: O sistema DEVE exportar todo o estado determinístico do ChordDiagram em formato JSON
- **FR-002**: O sistema DEVE copiar o JSON para o clipboard quando solicitado
- **FR-003**: O sistema DEVE exibir o JSON no console.log com formatação legível
- **FR-004**: O sistema DEVE incluir metadados no JSON (versão, timestamp)
- **FR-005**: O sistema DEVE fornecer feedback visual de sucesso/erro ao exportar

### Import

- **FR-006**: O sistema DEVE aceitar JSON válido e aplicar todas as configurações ao diagrama
- **FR-007**: O sistema DEVE validar o JSON antes de aplicar as mudanças
- **FR-008**: O sistema DEVE usar valores padrão para campos opcionais faltantes
- **FR-009**: O sistema DEVE mostrar mensagens de erro claras para JSON inválido
- **FR-010**: O sistema DEVE fornecer feedback visual de sucesso/erro ao importar

### Estado Determinístico

- **FR-011**: O estado exportado DEVE incluir todos os dados do acorde (fingers, barres)
- **FR-012**: O estado exportado DEVE incluir todas as propriedades de estilo
- **FR-013**: O estado exportado DEVE incluir a view selecionada
- **FR-014**: O estado exportado DEVE incluir configurações de instrument (tuning, etc)
- **FR-015**: O estado exportado DEVE ser serializado de forma determinística (sempre mesmo JSON para mesmo estado)

---

## Requisitos Não-Funcionais

- **NFR-001**: A operação de export/import deve ser instantânea (< 100ms)
- **NFR-002**: O JSON exportado deve ser compacto mas legível
- **NFR-003**: A interface deve ser intuitiva e não requerer documentação
- **NFR-004**: O sistema deve funcionar em todos os browsers modernos
- **NFR-005**: A funcionalidade deve ser totalmente testada (> 90% cobertura)

---

## Modelo de Dados

### ChordDiagramState

```typescript
interface ChordDiagramState {
	// Metadata
	_version: string;
	_timestamp: string;

	// Chord data
	chord?: Chord;
	instrument?: {
		strings: number;
		frets: number;
		tuning: string[];
		chord: string;
	};

	// Layout
	view: ViewId;

	// Dimensions
	width: number;
	height: number;
	fretCount: number;
	stringCount: number;
	fretWidth: number;
	fretHeight: number;
	stringWidth: number;
	dotSize: number;
	barreHeight: number;

	// Colors
	backgroundColor: string;
	fretColor: string;
	stringColor: string;
	dotColor: string;
	dotTextColor: string;
	barreColor: string;
	fretTextColor: string;
	tuningTextColor: string;
	openStringColor: string;
	mutedStringColor: string;

	// Fonts
	fontFamily: string;
	dotTextSize: number;
	fretTextSize: number;
	tuningTextSize: number;

	// Tuning customization
	tuningLabelOffsetX: number;
	tuningLabelOffsetY: number;
	tuningLabelFormat: "scientific" | "note-only";

	// String indicators customization
	stringIndicatorOffsetX: number;
	stringIndicatorOffsetY: number;

	// Barres customization
	barresWidth: number;
	barresOpacity: number;
	barresOffsetX: number;
	barresOffsetY: number;

	// Fret numbers customization
	fretTextOffsetX: number;
	fretTextOffsetY: number;

	// Nut customization
	nutStrokeWidth: number;
	nutOffsetX: number;
	nutOffsetY: number;
	nutOpacity: number;
	nutColor: string;

	// Canvas positioning
	canvasOffsetX: number;
	canvasOffsetY: number;
}
```

### API Functions

```typescript
// Export state from component props
function exportChordDiagramState(props: ChordDiagramProps): ChordDiagramState;

// Import state and convert to component props
function importChordDiagramState(state: ChordDiagramState): ChordDiagramProps;

// Validate state JSON
function validateChordDiagramState(json: unknown): { valid: boolean; errors: string[] };

// Copy state to clipboard
function copyStateToClipboard(state: ChordDiagramState): Promise<void>;

// Get state from Fretboard component (internal)
function getFretboardState(frame: LayoutFrame, engine: LayoutEngine): object;
```

---

## UI/UX

### Botões na Aplicação Demo (App.tsx)

```
┌─────────────────────────────────────┐
│  ChordDiagram Controls              │
│                                     │
│  [Export State 📋] [Import State 📥]│
│                                     │
│  • Export: Copia JSON para clipboard│
│  • Import: Cola JSON do clipboard  │
│                                     │
│  Status: [✓ Estado exportado!]      │
└─────────────────────────────────────┘
```

### Feedback Visual

- **Export Success**: Toast verde "Estado copiado para o clipboard!"
- **Export Error**: Toast vermelho "Erro ao copiar estado"
- **Import Success**: Toast verde "Estado importado com sucesso!"
- **Import Error**: Toast vermelho com mensagem específica do erro

---

## Exemplo de JSON Exportado

```json
{
	"_version": "1.0.0",
	"_timestamp": "2025-10-11T10:30:00.000Z",
	"instrument": {
		"strings": 6,
		"frets": 5,
		"tuning": ["E2", "A2", "D3", "G3", "B3", "E4"],
		"chord": "x32010"
	},
	"view": "horizontal-right",
	"width": 337,
	"height": 217,
	"fretCount": 5,
	"stringCount": 6,
	"fretWidth": 51,
	"fretHeight": 30,
	"stringWidth": 2,
	"dotSize": 17,
	"barreHeight": 19,
	"backgroundColor": "#ffffff",
	"fretColor": "#333333",
	"stringColor": "#666666",
	"dotColor": "#2196F3",
	"dotTextColor": "#ffffff",
	"barreColor": "#2196F3",
	"fretTextColor": "#abaaaa",
	"tuningTextColor": "#cecaca",
	"openStringColor": "#2196F3",
	"mutedStringColor": "#DC143C",
	"fontFamily": "sans-serif",
	"dotTextSize": 18,
	"fretTextSize": 17,
	"tuningTextSize": 18,
	"tuningLabelOffsetX": -5,
	"tuningLabelOffsetY": 0,
	"tuningLabelFormat": "note-only",
	"stringIndicatorOffsetX": 0,
	"stringIndicatorOffsetY": 0,
	"barresWidth": 9,
	"barresOpacity": 100,
	"barresOffsetX": 37,
	"barresOffsetY": -14,
	"fretTextOffsetX": 0,
	"fretTextOffsetY": 6,
	"nutStrokeWidth": 0,
	"nutOffsetX": 0,
	"nutOffsetY": 0,
	"nutOpacity": 100,
	"nutColor": "#333333",
	"canvasOffsetX": -13,
	"canvasOffsetY": -23
}
```

---

## Checklist de Revisão & Aceite

### Qualidade do Conteúdo

- [x] Sem detalhes de implementação excessivos
- [x] Foco no valor ao usuário
- [x] Escrito para desenvolvedores (usuários do componente)
- [x] Todas as seções obrigatórias concluídas

### Integralidade dos Requisitos

- [x] Nenhum marcador [NEEDS CLARIFICATION] remanescente
- [x] Requisitos testáveis e não ambíguos
- [x] Critérios de sucesso mensuráveis
- [x] Escopo claramente delimitado
- [x] Dependências e premissas identificadas
