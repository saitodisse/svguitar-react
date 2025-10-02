# Tarefas: Correções dos Layouts Verticais do ChordDiagram

**Entrada**: Documentos de design de `/home/saito/_git/svguitar-react/specs/001-guitar-svg/`
**Pré-requisitos**: plan.md (obrigatório), research.md, data-model.md, contracts/

## Fase 3.1: Configuração

- [x] T001 Reexecutar `.specify/scripts/bash/check-task-prerequisites.sh --json` para confirmar `FEATURE_DIR` e docs disponíveis
- [x] T002 [P] Revisar `specs/001-guitar-svg/spec.md` e `research.md` para mapear requisitos das views `vertical-right` e `vertical-left`

## Fase 3.2: Testes Primeiro (TDD)

- [x] T003 Criar/atualizar testes de snapshot em `src/components/ChordDiagram/layouts/__tests__/verticalRightLayout.test.ts` cobrindo ordem das cordas e posição de números de trastes na view `vertical-right`
- [x] T004 Criar/atualizar testes de snapshot em `src/components/ChordDiagram/layouts/__tests__/verticalLeftLayout.test.ts` cobrindo ordem das cordas e posição de números de trastes na view `vertical-left`
- [ ] T005 [P] Atualizar testes de integração em `src/components/ChordDiagram/ChordDiagram.test.tsx` garantindo renderização correta das views verticais (cordas, tuning labels e fret numbers)

## Fase 3.3: Implementação Principal (após os testes falharem)

- [x] T006 Ajustar `src/components/ChordDiagram/layouts/verticalRight.ts` para mapear cordas na ordem `["E2", "A2", "D3", "G3", "B3", "E4"]` e alinhar números dos trastes à direita (coordenadas Y crescentes)
- [x] T007 Ajustar `src/components/ChordDiagram/layouts/verticalLeft.ts` para mapear cordas na ordem `["E4", "B3", "G3", "D3", "A2", "E2"]` mantendo centralização e indicadores corretos
- [x] T008 Revisar `src/components/ChordDiagram/FretNumbers.tsx` para assegurar numeração crescente de cima para baixo nas views verticais, posicionada à direita de cada traste
- [x] T009 [P] Verificar `src/components/ChordDiagram/TuningLabels.tsx` para garantir posicionamento consistente com os novos mapeamentos verticais

## Fase 3.4: Integração

- [x] T010 Revisar registro/seleção de engines em `src/components/ChordDiagram/layouts/index.ts` e `ChordDiagram.tsx` assegurando que as views verticais usam os novos cálculos

## Fase 3.5: Polimento

- [ ] T011 [P] Atualizar `src/stories/ChordDiagram.stories.tsx` com exemplos das views verticais corrigidas e descrições de ordem das cordas
- [x] T012 [P] Atualizar documentação em `specs/001-guitar-svg/quickstart.md` destacando a nova orientação das views verticais
- [ ] T013 Executar `pnpm test --filter ChordDiagram`, `pnpm lint` e `pnpm format` para validar a entrega

## Dependências

- T001 antecede todas as demais tarefas
- T002 fornece contexto para T003–T010
- T003–T005 (testes) DEVEM ser executados antes de T006–T010 (implementação)
- T006 e T007 devem ser concluídos antes de T008–T010
- Polimento (T011–T013) ocorre após implementação principal e integração

## Execução Paralela Sugerida

```
/execute T003 & /execute T004 & /execute T005
/execute T011 & /execute T012
```
