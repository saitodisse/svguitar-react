# Tarefas: Componente de Diagrama de Acordes de Guitarra

**Entrada**: Documentos de design de `/home/saito/_git/svguitar-react/specs/001-guitar-svg/`
**Pré-requisitos**: plan.md (obrigatório), research.md, data-model.md, contracts/

## Fase 3.1: Configuração

- [x] T001 Garantir contexto atualizado executando `.specify/scripts/bash/check-task-prerequisites.sh --json` e validar `FEATURE_DIR` em `/home/saito/_git/svguitar-react/specs/001-guitar-svg`
- [x] T002 [P] Mapear alterações nos layouts a partir de `specs/001-guitar-svg/research.md` e validar impacto no `horizontal-left`

## Fase 3.2: Testes Primeiro (TDD)

- [x] T003 [P] Atualizar/Adicionar testes para `TuningLabels` em `src/components/ChordDiagram/TuningLabels.test.tsx` cobrindo labels à direita na view `horizontal-left`
- [x] T004 [P] Atualizar/Adicionar testes para `FretNumbers` em `src/components/ChordDiagram/FretNumbers.test.tsx` garantindo ordem crescente da direita para a esquerda
- [x] T005 [P] Atualizar/Adicionar testes de integração em `src/components/ChordDiagram/ChordDiagram.test.tsx` para validar layout `horizontal-left` completo (labels e numeração)

## Fase 3.3: Implementação Principal (após testes falharem)

- [x] T006 Ajustar `src/components/ChordDiagram/layouts/horizontalLeft.ts` para refletir labels à direita e numeração invertida
- [x] T007 Ajustar `src/components/ChordDiagram/TuningLabels.tsx` para posicionar labels à direita quando `horizontal-left`
- [x] T008 Ajustar `src/components/ChordDiagram/FretNumbers.tsx` para renderizar números decrescentes da direita para a esquerda na view `horizontal-left`
- [ ] T009 Garantir que `ChordDiagram` aplique corretamente o engine `horizontal-left` após mudanças (arquivo `src/components/ChordDiagram/ChordDiagram.tsx`)

## Fase 3.4: Integração

- [ ] T010 Revisar registros do layout registry (se houver) em `src/components/ChordDiagram/layouts/index.ts` ou equivalente para compatibilidade com ajustes

## Fase 3.5: Polimento

- [ ] T011 [P] Atualizar documentação do Storybook em `src/stories/ChordDiagram.stories.tsx` demonstrando labels à direita e numeração invertida
- [ ] T012 [P] Revisar `specs/001-guitar-svg/quickstart.md` e demais docs para coerência pós-implementação
- [ ] T013 Executar `pnpm format` e `pnpm lint` garantindo conformidade

## Dependências

- T003, T004, T005 devem falhar antes de iniciar T006-T009 (TDD)
- T006 precede T007-T009 para alinhar cálculos do engine
- T010 depende das alterações em T006
- Polimento (T011-T013) ocorre após implementação principal

## Execução Paralela Sugerida

```
/execute T003 & /execute T004 & /execute T005
/execute T007 & /execute T008
/execute T011 & /execute T012
```
