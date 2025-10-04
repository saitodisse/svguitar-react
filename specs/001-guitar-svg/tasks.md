# Tarefas: Implementação da Nova Especificação dos FretNumbers nas Views Verticais

**Entrada**: Documentos de design de `/home/saito/_git/svguitar-react/specs/001-guitar-svg/`
**Pré-requisitos**: plan.md (obrigatório), research.md, data-model.md, contracts/
**Especificação**: FR-026 - Números dos trastes (FretNumbers) nas views verticais posicionados à direita do braço

## Fase 3.1: Configuração

- [x] T001 Reexecutar `.specify/scripts/bash/check-task-prerequisites.sh --json` para confirmar `FEATURE_DIR` e docs disponíveis
- [x] T002 [P] Revisar `specs/001-guitar-svg/spec.md` e `research.md` para mapear requisitos da nova especificação FR-026

## Fase 3.2: Testes Primeiro (TDD)

- [ ] T003 Criar/atualizar testes de snapshot em `src/components/ChordDiagram/__tests__/FretNumbers.test.tsx` cobrindo posicionamento dos números dos trastes nas views verticais
- [ ] T004 [P] Criar testes de integração em `src/components/ChordDiagram/__tests__/VerticalLayouts.test.tsx` verificando posicionamento correto dos FretNumbers à direita do braço
- [ ] T005 [P] Atualizar testes de integração em `src/components/ChordDiagram/ChordDiagram.test.tsx` garantindo renderização correta dos FretNumbers nas views verticais

## Fase 3.3: Implementação Principal (após os testes falharem)

- [ ] T006 Atualizar `src/components/ChordDiagram/FretNumbers.tsx` para implementar novo posicionamento nas views verticais (à direita do braço)
- [ ] T007 [P] Atualizar `src/components/ChordDiagram/layouts/verticalRight.ts` para incluir método `fretNumberPosition` se necessário
- [ ] T008 [P] Atualizar `src/components/ChordDiagram/layouts/verticalLeft.ts` para incluir método `fretNumberPosition` se necessário
- [ ] T009 Verificar e atualizar `src/components/ChordDiagram/types.ts` para incluir interface `fretNumberPosition` no `LayoutEngine` se necessário

## Fase 3.4: Integração

- [ ] T010 Revisar registro/seleção de engines em `src/components/ChordDiagram/layouts/index.ts` e `ChordDiagram.tsx` assegurando que as views verticais usam os novos cálculos de posicionamento para FretNumbers

## Fase 3.5: Polimento

- [ ] T011 [P] Atualizar `src/stories/ChordDiagram.stories.tsx` com exemplos das views verticais mostrando o novo posicionamento dos FretNumbers
- [ ] T012 [P] Executar `pnpm test --filter ChordDiagram`, `pnpm lint` e `pnpm format` para validar a entrega
- [ ] T013 Verificar se o Storybook renderiza corretamente as views verticais com os novos números dos trastes

## Dependências

- T001 antecede todas as demais tarefas
- T002 fornece contexto para T003–T010
- T003–T005 (testes) DEVEM ser executados antes de T006–T010 (implementação)
- T006 deve ser concluído antes de T007–T009
- T009 deve ser concluído antes de T010
- Polimento (T011–T013) ocorre após implementação principal e integração

## Execução Paralela Sugerida

```
/execute T003 & /execute T004 & /execute T005
/execute T011 & /execute T012
```

## Especificação Detalhada da Implementação

### Requisito FR-026

- **Objetivo**: Posicionar os números dos trastes (FretNumbers) nas views verticais à direita do braço
- **Comportamento**: Um número por traste, alinhados verticalmente, começando com "0" no topo (nut) e "1, 2, 3..." abaixo
- **Views afetadas**: `vertical-right` e `vertical-left`
- **Posicionamento**: À direita do braço, fora da área das cordas
- **Legibilidade**: Manter legibilidade horizontal e consistência entre as views

### Estrutura de Coordenadas

- **Eixo X**: Posição horizontal dos números (à direita do braço)
- **Eixo Y**: Posição vertical dos números (alinhada com cada traste)
- **Ordem**: Traste 0 (nut) no topo, trastes seguintes abaixo em ordem crescente

### Casos de Teste

1. **View vertical-right**: Números posicionados à direita do braço, começando com "0" no topo
2. **View vertical-left**: Números posicionados à direita do braço, começando com "0" no topo (mesmo comportamento)
3. **Consistência**: Ambas as views devem ter o mesmo posicionamento relativo dos números
4. **Legibilidade**: Textos devem permanecer legíveis horizontalmente

### Exemplo ASCII

```
vertical-right:
     xo   o  0
     ||||||  1
     ||123|  2
     ||||||  3

vertical-left:
     o   xo  0
     ||||||  1
     ||123|  2
     ||||||  3
```

**Legenda:**

- `xo, o`: TuningLabels (acima das cordas) ✅ já implementado
- `||||||`: Cordas verticais do braço
- `213`: Dots dos dedos nas posições
- `0, 1, 2, 3`: FretNumbers (à direita do braço) ❌ precisa implementar
