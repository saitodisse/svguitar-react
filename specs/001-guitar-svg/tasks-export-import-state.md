# Tarefas: Implementação de Export/Import de Estado do ChordDiagram

**Branch**: `001-guitar-svg`  
**Entrada**: Especificação da funcionalidade de export/import de estado determinístico  
**Pré-requisitos**: plan.md, data-model.md, research.md

## Fase 1: Setup e Design

- [ ] T001 Criar especificação detalhada da funcionalidade de export/import em `specs/001-guitar-svg/export-import-spec.md`
- [ ] T002 [P] Definir estrutura JSON do estado determinístico (todas as props do ChordDiagram + estado interno)
- [ ] T003 [P] Atualizar `data-model.md` com novas interfaces: `ChordDiagramState`, `StateExport`, `StateImport`

## Fase 2: Testes Primeiro (TDD)

- [ ] T004 Criar testes de snapshot para função `getState()` em `src/components/ChordDiagram/__tests__/state-export.test.tsx`
- [ ] T005 [P] Criar testes para serialização/deserialização JSON do estado
- [ ] T006 [P] Criar testes para importação de estado válido e inválido
- [ ] T007 Criar testes de integração para botão de export no App.tsx

## Fase 3: Implementação Principal

- [ ] T008 Criar função interna `getState()` no `Fretboard.tsx` retornando estado determinístico
- [ ] T009 Criar hook `useChordDiagramState()` em `src/components/ChordDiagram/hooks/useChordDiagramState.ts`
- [ ] T010 Implementar função `exportState()` que retorna JSON completo do estado
- [ ] T011 [P] Implementar função `importState()` que seta todas as props a partir do JSON
- [ ] T012 [P] Adicionar validação de schema JSON usando Zod ou validação manual
- [ ] T013 Adicionar função `copyStateToClipboard()` com feedback visual

## Fase 4: Integração com App.tsx

- [ ] T014 Adicionar botão "Export State" no App.tsx para copiar JSON e fazer console.log
- [ ] T015 [P] Adicionar botão "Import State" com file input ou textarea para colar JSON
- [ ] T016 [P] Adicionar toast/notification de sucesso/erro para export/import
- [ ] T017 Atualizar todas as queryState do App.tsx a partir do JSON importado

## Fase 5: Documentação e Polimento

- [ ] T018 Adicionar story no Storybook demonstrando export/import de estado
- [ ] T019 [P] Atualizar `quickstart.md` com exemplos de uso da funcionalidade
- [ ] T020 [P] Adicionar tradução PT/EN para labels dos botões de export/import
- [ ] T021 Executar `pnpm test`, `pnpm lint` e `pnpm format` para validação final

## Dependências

- T001-T003 (Design) devem ser executados antes de tudo
- T004-T007 (Testes) DEVEM ser executados antes de T008-T017 (Implementação)
- T008 deve ser concluído antes de T009-T010
- T010-T011 devem ser concluídos antes de T013
- T013 deve ser concluído antes de T014-T017
- T018-T021 (Polimento) ocorre após implementação principal

## Execução Paralela Sugerida

```bash
# Fase 1
/execute T002 & /execute T003

# Fase 2
/execute T004 & /execute T005 & /execute T006

# Fase 3
/execute T011 & /execute T012

# Fase 4
/execute T015 & /execute T016

# Fase 5
/execute T019 & /execute T020
```

## Especificação Detalhada

### Estrutura do Estado Exportado

```typescript
interface ChordDiagramState {
	// Chord data
	chord?: Chord;
	instrument?: Partial<Instrument>;

	// Layout
	view: ViewId;

	// All style properties
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

	// Customizations
	tuningLabelOffsetX: number;
	tuningLabelOffsetY: number;
	tuningLabelFormat: "scientific" | "note-only";
	stringIndicatorOffsetX: number;
	stringIndicatorOffsetY: number;
	barresWidth: number;
	barresOpacity: number;
	barresOffsetX: number;
	barresOffsetY: number;
	fretTextOffsetX: number;
	fretTextOffsetY: number;
	nutStrokeWidth: number;
	nutOffsetX: number;
	nutOffsetY: number;
	nutOpacity: number;
	nutColor: string;
	canvasOffsetX: number;
	canvasOffsetY: number;
}
```

### Funcionalidades

1. **Export**: Botão que copia JSON para clipboard e faz console.log
2. **Import**: Botão/textarea que permite colar JSON e restaurar estado
3. **Validação**: Verificar se JSON é válido antes de importar
4. **Feedback**: Toast/notification de sucesso ou erro
5. **Persistência**: Estado pode ser salvo em arquivo ou compartilhado via URL

### Casos de Teste

1. Exportar estado completo do ChordDiagram
2. Importar estado e verificar se todas as props foram aplicadas
3. Validação de JSON inválido (mostrar erro)
4. Validação de JSON parcial (usar defaults para campos faltando)
5. Copiar para clipboard funciona corretamente
6. Console.log mostra JSON formatado

### Exemplo de Uso

```tsx
// Export
const state = exportChordDiagramState();
console.log(JSON.stringify(state, null, 2));
await copyToClipboard(JSON.stringify(state));

// Import
const json = await navigator.clipboard.readText();
const state = JSON.parse(json);
importChordDiagramState(state);
```
