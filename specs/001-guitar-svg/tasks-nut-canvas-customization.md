# Tarefas: Customização do Nut e Canvas Position

**Feature**: Adicionar controles avançados de customização para o nut (traste zero) e posicionamento global do canvas SVG
**Branch**: `001-guitar-svg`
**Data**: 2025-10-09
**Especificação**: Adicionar props para controlar aparência do nut e posicionamento do canvas

## Visão Geral

Esta tarefa adiciona novas propriedades de customização ao componente `ChordDiagram`:

### Nut (Fret Zero) Customization

- `nutStrokeWidth`: Multiplicador (-5 a 5) aplicado a `fretWidth` para controlar espessura da linha do nut
- `nutOffsetX`: Multiplicador (-5 a 5) aplicado a `fretWidth` para deslocamento horizontal
- `nutOffsetY`: Multiplicador (-5 a 5) aplicado a `fretHeight` para deslocamento vertical
- `nutOpacity`: Opacidade de 0 a 1 para controlar transparência
- `nutColor`: Cor customizável para a linha do nut

### Canvas Position

- `canvasOffsetX`: Pixels absolutos para deslocamento horizontal de todo o diagrama
- `canvasOffsetY`: Pixels absolutos para deslocamento vertical de todo o diagrama
- Uso: Permite adicionar padding/margem, preparar para zoom futuro, e ajustar posicionamento para layouts específicos

## Fase 1: Setup e Documentação

- [ ] T001 Atualizar `specs/001-guitar-svg/data-model.md` com as novas propriedades
- [ ] T002 Atualizar `specs/001-guitar-svg/contracts/chord-diagram-api.md` com as novas propriedades e regras de validação

## Fase 2: Tipos e Interfaces (TDD)

- [ ] T003 [P] Adicionar novas propriedades em `src/components/ChordDiagram/types.ts`:
    - `ChordDiagramProps`: adicionar nut e canvas props opcionais
    - `ChordStyle`: adicionar nut e canvas props com valores padrão
- [ ] T004 [P] Adicionar defaults em `src/components/ChordDiagram/constants.ts`:
    - `nutStrokeWidth: 0.075` (≈3px com fretWidth=40)
    - `nutOffsetX: 0`
    - `nutOffsetY: 0`
    - `nutOpacity: 1.0`
    - `nutColor: DEFAULT_CHORD_STYLE.fretColor`
    - `canvasOffsetX: 0`
    - `canvasOffsetY: 0`

## Fase 3: Testes (TDD - Red Phase)

- [ ] T005 Criar `src/components/ChordDiagram/__tests__/NutCustomization.test.tsx`:
    - Testar renderização do nut com valores padrão
    - Testar nutStrokeWidth customizado (valores positivos e negativos)
    - Testar nutOffsetX e nutOffsetY
    - Testar nutOpacity (0, 0.5, 1)
    - Testar nutColor customizado
    - Testar combinações de propriedades
- [ ] T006 Criar `src/components/ChordDiagram/__tests__/CanvasPosition.test.tsx`:
    - Testar canvasOffsetX e canvasOffsetY com valores padrão (0)
    - Testar offsets positivos e negativos
    - Testar que o transform é aplicado ao grupo wrapper
    - Testar que todos os elementos internos são afetados pelo offset
- [ ] T007 [P] Adicionar testes de snapshot para novas configurações

## Fase 4: Implementação (Green Phase)

### Nut Customization

- [ ] T008 Atualizar `src/components/ChordDiagram/Fretboard.tsx`:
    - Extrair renderização do nut para método separado
    - Aplicar `nutStrokeWidth` (multiplicador \* fretWidth)
    - Aplicar `nutOffsetX` e `nutOffsetY` (multiplicadores \* fretWidth/fretHeight)
    - Aplicar `nutOpacity` ao estilo
    - Aplicar `nutColor` (fallback para fretColor)
    - Garantir comportamento consistente em todas as views

### Canvas Position

- [ ] T009 Atualizar `src/components/ChordDiagram/ChordDiagram.tsx`:
    - Adicionar `<g transform="translate(${canvasOffsetX}, ${canvasOffsetY})">` wrapper
    - Envolver todo o conteúdo do diagrama (fretboard, fingers, barres, labels)
    - Passar novas props do style para componentes filhos
    - Atualizar `mergeStyles` em `utils.ts` para incluir novas props

### Utils e Helpers

- [ ] T010 Atualizar `src/components/ChordDiagram/utils.ts`:
    - Atualizar função `mergeStyles` para incluir nut e canvas props
    - Adicionar validação de ranges (nutStrokeWidth, offsets, opacity)
    - Adicionar helper para calcular nutStrokeWidth absoluto

## Fase 5: Layout Engines (garantir consistência)

- [ ] T011 [P] Verificar `src/components/ChordDiagram/layouts/horizontalRight.ts` - garantir que nut props são respeitados
- [ ] T012 [P] Verificar `src/components/ChordDiagram/layouts/horizontalLeft.ts` - garantir que nut props são respeitados
- [ ] T013 [P] Verificar `src/components/ChordDiagram/layouts/verticalRight.ts` - garantir que nut props são respeitados
- [ ] T014 [P] Verificar `src/components/ChordDiagram/layouts/verticalLeft.ts` - garantir que nut props são respeitados

## Fase 6: Storybook e Documentação Visual

- [ ] T015 Atualizar `src/stories/ChordDiagram.stories.tsx`:
    - Adicionar story "Nut Customization" com controles para todas as props
    - Adicionar story "Canvas Positioning" demonstrando offsets
    - Adicionar story "Combined Advanced Settings" mostrando nut + canvas + outros offsets
    - Adicionar controles (sliders) para todas as novas props
- [ ] T016 Adicionar exemplos no Storybook mostrando casos de uso:
    - Nut mais grosso para diagramas grandes
    - Nut semi-transparente
    - Nut colorido (diferente do resto do fretboard)
    - Canvas offset para criar padding/margem
    - Preparação para zoom (demonstração conceitual)

## Fase 7: Testes de Integração e Validação

- [ ] T017 Executar suite completa de testes: `pnpm test`
- [ ] T018 Verificar linting: `pnpm lint`
- [ ] T019 Verificar formatação: `pnpm format`
- [ ] T020 Validar visualmente no Storybook: `pnpm storybook`
- [ ] T021 Testar todas as 4 views com as novas configurações
- [ ] T022 Testar combinações com outras customizações existentes (barres, tuning labels, etc)

## Fase 8: Documentação Final

- [ ] T023 Atualizar `specs/001-guitar-svg/quickstart.md` com exemplos das novas props
- [ ] T024 Adicionar comentários JSDoc nas novas props
- [ ] T025 Atualizar CHANGELOG.md com as novas features
- [ ] T026 Marcar todas as tarefas como concluídas neste arquivo

## Dependências

### Sequenciais (devem ser executadas em ordem)

- T001, T002 → T003, T004 (documentação antes dos tipos)
- T003, T004 → T005, T006, T007 (tipos antes dos testes)
- T005, T006, T007 → T008, T009, T010 (testes antes da implementação - TDD)
- T008, T009, T010 → T011-T014 (implementação core antes da verificação de layouts)
- T011-T014 → T015, T016 (layouts funcionando antes do Storybook)
- T015, T016 → T017-T022 (Storybook antes da validação final)
- T017-T022 → T023-T026 (validação antes da documentação final)

### Paralelas (podem ser executadas juntas)

- T001 & T002 [P] - documentação
- T003 & T004 [P] - tipos e constantes
- T005 & T006 & T007 [P] - testes
- T011 & T012 & T013 & T014 [P] - verificação de layouts

## Validação de Sucesso

✅ Todos os testes passando
✅ Todas as views renderizando corretamente com as novas props
✅ Controles do Storybook funcionando
✅ Documentação atualizada
✅ Código formatado e sem erros de lint
✅ Performance mantida (renderização ainda otimizada)

## Notas de Implementação

### Cálculo do nutStrokeWidth

```typescript
const absoluteNutStrokeWidth = style.nutStrokeWidth * style.fretWidth;
```

### Cálculo dos offsets do nut

```typescript
const nutX = baseX + style.nutOffsetX * style.fretWidth;
const nutY = baseY + style.nutOffsetY * style.fretHeight;
```

### Canvas transform

```tsx
<svg>
	<g transform={`translate(${canvasOffsetX}, ${canvasOffsetY})`}>{/* todo o conteúdo do diagrama */}</g>
</svg>
```

### Validação de ranges

- `nutStrokeWidth`: -5 a 5 (multiplicador)
- `nutOffsetX`, `nutOffsetY`: -5 a 5 (multiplicadores)
- `nutOpacity`: 0 a 1
- `canvasOffsetX`, `canvasOffsetY`: qualquer número (pixels)

## Estimativa

**Total de tarefas**: 26
**Tarefas paralelas**: 11
**Tempo estimado**: 3-4 horas (com TDD completo e documentação)
