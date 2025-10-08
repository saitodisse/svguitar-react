# Tarefas: Customização dos TuningLabels

**Entrada**: Requisitos de customização dos TuningLabels
**Feature**: Adicionar controles de distância e formato dos rótulos de afinação
**Branch**: `001-guitar-svg`

## Resumo da Feature

Adicionar duas novas customizações para o componente ChordDiagram:

1. **tuningLabelOffset**: Controla a distância dos TuningLabels em relação ao nut (multiplicador de 0-1 do fretWidth/fretHeight)
2. **tuningLabelFormat**: Toggle entre notação científica completa ("E2") e apenas nota ("E")

## Fase 1: Atualização de Especificações e Contratos

- [x] T001 Atualizar `specs/001-guitar-svg/spec.md` adicionando FR-027 e FR-028 para as novas props
- [x] T002 [P] Atualizar `specs/001-guitar-svg/data-model.md` adicionando as novas propriedades à interface ChordDiagramProps
- [x] T003 [P] Atualizar `specs/001-guitar-svg/contracts/chord-diagram-api.md` documentando as novas props e seus valores padrão
- [x] T004 [P] Atualizar `specs/001-guitar-svg/quickstart.md` com exemplos de uso das novas customizações

## Fase 2: Testes Primeiro (TDD)

- [ ] T005 Criar testes em `src/components/ChordDiagram/TuningLabels.test.tsx` para validar tuningLabelOffset
- [ ] T006 [P] Criar testes em `src/components/ChordDiagram/TuningLabels.test.tsx` para validar tuningLabelFormat
- [ ] T007 [P] Criar testes de integração em `src/components/ChordDiagram/ChordDiagram.test.tsx` para as novas props

## Fase 3: Implementação Principal

- [x] T008 Atualizar `src/components/ChordDiagram/types.ts` adicionando tuningLabelOffset e tuningLabelFormat à interface ChordDiagramProps e ChordStyle
- [x] T009 Criar função helper `formatTuningLabel` em `src/components/ChordDiagram/utils.ts` para parsing de notas usando tonal
- [x] T010 Atualizar `src/components/ChordDiagram/TuningLabels.tsx` para usar tuningLabelOffset nos cálculos de posição
- [x] T011 Atualizar `src/components/ChordDiagram/TuningLabels.tsx` para usar tuningLabelFormat na renderização
- [x] T012 Atualizar `src/components/ChordDiagram/constants.ts` incluindo as novas props nos valores padrão
- [x] T013 Componente ChordDiagram.tsx já passa todas as props via frame.style ao TuningLabels

## Fase 4: Interface do Usuário (App.tsx)

- [x] T014 Adicionar controle slider para tuningLabelOffset em `src/App.tsx` (range 0-1, padrão 0.5)
- [x] T015 [P] Adicionar controle toggle/select para tuningLabelFormat em `src/App.tsx` (scientific/note-only)
- [x] T016 [P] Adicionar tradução i18n para os novos controles em `src/locales/en/translation.json`
- [x] T017 [P] Adicionar tradução i18n para os novos controles em `src/locales/pt/translation.json`
- [x] T018 Atualizar DEFAULT_CONFIGS em `src/App.tsx` com os novos valores padrão

## Fase 5: Storybook

- [ ] T019 Adicionar story em `src/stories/ChordDiagram.stories.tsx` demonstrando tuningLabelOffset
- [ ] T020 [P] Adicionar story em `src/stories/ChordDiagram.stories.tsx` demonstrando tuningLabelFormat
- [ ] T021 [P] Adicionar controles interativos no Storybook para as novas props

## Fase 6: Validação

- [ ] T022 Executar `pnpm test` para validar todos os testes
- [ ] T023 [P] Executar `pnpm lint` e `pnpm format` para validar qualidade do código
- [ ] T024 [P] Testar visualmente no Storybook todas as views (horizontal-right, horizontal-left, vertical-right, vertical-left)
- [ ] T025 Validar comportamento no App.tsx em modo mobile e desktop

## Dependências

- T001-T004 (specs) devem ser executadas antes dos testes e implementação
- T005-T007 (testes) DEVEM ser executados antes de T008-T013 (implementação)
- T008 (types) deve ser concluído antes de T009-T013
- T009 (helper function) deve ser concluído antes de T011
- T010-T013 (implementação) devem ser concluídos antes de T014-T021 (UI)
- T014-T018 (App.tsx) podem ser executados em paralelo com T019-T021 (Storybook)
- T022-T025 (validação) devem ser executados após todas as outras tarefas

## Execução Paralela Sugerida

```bash
# Fase 1: Specs (paralelo)
T002 & T003 & T004

# Fase 2: Testes (paralelo)
T006 & T007

# Fase 3: Implementação (sequencial devido a dependências)
# T008 → T009 → (T010, T011, T012, T013)

# Fase 4 e 5: UI (paralelo)
T015 & T016 & T017 & T020 & T021

# Fase 6: Validação (paralelo)
T023 & T024
```

## Detalhes de Implementação

### tuningLabelOffset

- **Tipo**: `number`
- **Range**: 0-1
- **Padrão**: 0.5
- **Comportamento**: Multiplicador aplicado a fretWidth (horizontal) ou fretHeight (vertical)
    - Horizontal-right: desloca para direita (negativo no cálculo)
    - Horizontal-left: desloca para esquerda (positivo no cálculo)
    - Vertical: desloca para baixo (negativo no cálculo)

### tuningLabelFormat

- **Tipo**: `"scientific" | "note-only"`
- **Padrão**: "scientific"
- **Comportamento**:
    - "scientific": mostra notação completa (E2, A2, D3, etc.)
    - "note-only": mostra apenas a nota (E, A, D, etc.)
- **Parsing**: Usar biblioteca `tonal` (Note.get) para extrair a nota base

### Exemplo de uso

```tsx
<ChordDiagram
	instrument={{ tuning: ["E2", "A2", "D3", "G3", "B3", "E4"], chord: "x32010" }}
	tuningLabelOffset={0.7}
	tuningLabelFormat="note-only"
	view="vertical-right"
/>
```
