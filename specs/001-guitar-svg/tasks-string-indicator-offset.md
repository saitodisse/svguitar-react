# Tarefas: Customização da Distância dos Indicadores de Cordas

**Entrada**: Requisito de customização da distância dos indicadores de cordas soltas e mutadas
**Feature**: Adicionar controle de distância dos indicadores ('O' e 'X') em relação ao nut
**Branch**: `001-guitar-svg`

## Resumo da Feature

Adicionar uma nova customização para o componente ChordDiagram:

**stringIndicatorOffset**: Controla a distância dos indicadores de cordas soltas ('O') e mutadas ('X') em relação ao nut (multiplicador de 0-1 do fretWidth/fretHeight)

## Fase 1: Atualização de Especificações e Contratos

- [x] T001 Atualizar `specs/001-guitar-svg/spec.md` adicionando FR-029 para a nova prop
- [x] T002 [P] Atualizar `specs/001-guitar-svg/data-model.md` adicionando a nova propriedade à interface ChordDiagramProps
- [ ] T003 [P] Atualizar `specs/001-guitar-svg/contracts/chord-diagram-api.md` documentando a nova prop e seu valor padrão
- [ ] T004 [P] Atualizar `specs/001-guitar-svg/quickstart.md` com exemplos de uso da nova customização

## Fase 2: Implementação Principal

- [x] T005 Atualizar `src/components/ChordDiagram/types.ts` adicionando stringIndicatorOffset à interface ChordDiagramProps e ChordStyle
- [x] T006 Atualizar `src/components/ChordDiagram/constants.ts` incluindo a nova prop nos valores padrão
- [x] T007 Identificar onde os indicadores são renderizados (engine.indicatorPosition em todos os layout engines)
- [x] T008 Atualizar todos os layout engines (horizontalRight, horizontalLeft, verticalRight, verticalLeft) para usar stringIndicatorOffset

## Fase 3: Interface do Usuário (App.tsx)

- [x] T009 Adicionar controle slider para stringIndicatorOffset em `src/App.tsx` (range 0-1, padrão 0.5)
- [x] T010 [P] Adicionar tradução i18n para o novo controle em `src/locales/en/translation.json`
- [x] T011 [P] Adicionar tradução i18n para o novo controle em `src/locales/pt/translation.json`
- [x] T012 Atualizar DEFAULT_CONFIGS em `src/App.tsx` com o novo valor padrão

## Fase 4: Validação

- [x] T013 Executar `pnpm build` para validar compilação
- [x] T014 [P] Executar `pnpm lint` e `pnpm format` para validar qualidade do código
- [ ] T015 [P] Testar visualmente todas as views (horizontal-right, horizontal-left, vertical-right, vertical-left)

## Dependências

- T001-T004 (specs) podem ser executadas em paralelo
- T005-T006 devem ser concluídas antes de T007-T008
- T007 (identificação) deve ser concluído antes de T008 (implementação)
- T009-T012 (UI) podem ser executadas após T005-T008
- T013-T015 (validação) devem ser executados após todas as outras tarefas

## Execução Paralela Sugerida

```bash
# Fase 1: Specs (paralelo)
T002 & T003 & T004

# Fase 3: UI (paralelo)
T010 & T011

# Fase 4: Validação (paralelo)
T014 & T015
```

## Detalhes de Implementação

### stringIndicatorOffset

- **Tipo**: `number`
- **Range**: 0-1
- **Padrão**: 0.5
- **Comportamento**: Multiplicador aplicado a fretWidth (horizontal) ou fretHeight (vertical)
    - Horizontal-right: desloca para direita (valores maiores afastam do nut)
    - Horizontal-left: desloca para esquerda (valores maiores afastam do nut)
    - Vertical: desloca para baixo (valores maiores afastam do nut)
- **Local de implementação**: LayoutEngine.indicatorPosition() ou onde os indicadores 'O' e 'X' são renderizados

### Exemplo de uso

```tsx
<ChordDiagram
	instrument={{ tuning: ["E2", "A2", "D3", "G3", "B3", "E4"], chord: "x32010" }}
	stringIndicatorOffset={0.3} // Indicadores mais próximos do nut
	view="horizontal-right"
/>
```
