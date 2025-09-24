# Tarefas: Componente de Diagrama de Acordes de Guitarra

**Entrada**: Documentos de design em `/home/saito/_git/svguitar-react/specs/001-guitar-svg/`
**Pré-requisitos**: `plan.md`, `research.md`, `data-model.md`, `contracts/`

## Formato: `[ID] [P?] Descrição`

- **[P]**: Pode rodar em paralelo (arquivos diferentes, sem dependências)
- Incluir caminhos exatos de arquivo nas descrições

## Fase 3.1: Setup

- [ ] T001 Criar a estrutura de diretórios para o componente em `src/components/ChordDiagram`.
- [ ] T002 [P] Criar os arquivos iniciais: `src/components/ChordDiagram/ChordDiagram.tsx`, `types.ts`, `utils.ts`, `ChordDiagram.test.tsx` e `constants.ts`.
- [ ] T003 [P] Criar o arquivo de stories `src/stories/ChordDiagram.stories.tsx`.

## Fase 3.2: Definição de Tipos e Constantes

- [ ] T004 [P] Definir todas as interfaces TypeScript (`ChordDiagramProps`, `Chord`, `Instrument`, `Finger`, `Barre`, `ChordStyle`, etc.) em `src/components/ChordDiagram/types.ts` com base no `data-model.md`.
- [ ] T005 [P] Definir as constantes de estilo padrão (`DEFAULT_CHORD_STYLE`) e de instrumento (`DEFAULT_INSTRUMENT`) em `src/components/ChordDiagram/constants.ts`.

## Fase 3.3: Testes Primeiro (TDD)

**CRÍTICO: Estes testes DEVEM ser escritos e DEVEM FALHAR antes da implementação.**

- [ ] T006 [P] Escrever testes unitários para a função `parseFretNotation` em `src/components/ChordDiagram/ChordDiagram.test.tsx`. Os testes devem cobrir a conversão de Fret Notations simples, com cordas soltas ('o'), mutadas ('x') e trastes altos (ex: "(10)").
- [ ] T007 [P] Escrever testes unitários para a lógica de validação de props em `src/components/ChordDiagram/ChordDiagram.test.tsx`. Testar `fingers`, `barres`, `tuning` e Fret Notations inválidas.
- [ ] T008 Escrever testes de integração para renderização em `src/components/ChordDiagram/ChordDiagram.test.tsx`. Os testes devem renderizar o componente com diferentes props (acorde simples, com pestana, posição alta, estilo customizado) e verificar se o SVG de saída contém os elementos corretos (`circle`, `rect`, `line`, `text`).

## Fase 3.4: Implementação Core

**APENAS após os testes da Fase 3.3 falharem.**

- [ ] T009 Implementar a função utilitária `parseFretNotation` em `src/components/ChordDiagram/utils.ts` para fazer os testes da tarefa `T006` passarem.
- [ ] T010 Implementar as funções de validação de props em `src/components/ChordDiagram/utils.ts` para fazer os testes da tarefa `T007` passarem.
- [ ] T011 Implementar a lógica de renderização base do `ChordDiagram` em `src/components/ChordDiagram/ChordDiagram.tsx`. O componente deve renderizar o canvas SVG e o braço da guitarra (trastes e cordas) com base nas props de estilo.
- [ ] T012 Implementar a lógica para renderizar `fingers` como elementos `<circle>` e `barres` como elementos `<rect>` no `ChordDiagram.tsx`.
- [ ] T013 Implementar a lógica para lidar com a prop `firstFret` para acordes em posições altas, incluindo a renderização do rótulo do traste.
- [ ] T014 Implementar a renderização dos indicadores de afinação e de cordas soltas/mutadas ('O'/'X') acima do diagrama.
- [ ] T015 Implementar a lógica para mesclar as `style` props customizadas com os estilos padrão definidos em `constants.ts`.
- [ ] T016 Envolver o componente `ChordDiagram` com `React.memo` para otimizar a performance, conforme definido no `research.md`. Após esta etapa, os testes de integração da tarefa `T008` devem passar.

## Fase 3.5: Polimento e Documentação

- [ ] T017 [P] Criar as stories no Storybook em `src/stories/ChordDiagram.stories.tsx`. As stories devem cobrir todos os cenários definidos no `quickstart.md` (Acorde Simples, Com Pestana, Posição Alta, Fret Notation, Estilo Customizado e Casos Limite).
- [ ] T018 [P] Adicionar documentação TSDoc para todas as interfaces, props e funções exportadas em `types.ts`, `utils.ts` e `ChordDiagram.tsx`.
- [ ] T019 Configurar o `package.json` e `vite.config.ts` para o "Library Mode" do Vite, garantindo que os campos `main`, `module` e `types` estejam corretos para publicação no NPM.
- [ ] T020 Executar `pnpm format` e `pnpm lint --fix` para garantir a qualidade e consistência do código em todo o novo componente.

## Dependências

- `T004`, `T005` antes de `T006`, `T007`, `T008`.
- Testes (`T006`, `T007`, `T008`) antes da implementação (`T009` a `T016`).
- `T009` bloqueia a passagem de `T006`.
- `T010` bloqueia a passagem de `T007`.
- `T011` a `T016` bloqueiam a passagem de `T008`.
- A implementação (`T009`-`T016`) deve ser concluída antes do polimento (`T017`-`T020`).

## Exemplo de Paralelismo

```
# As tarefas de setup T002 e T003 podem ser executadas em paralelo.
# As tarefas de definição de tipos e constantes T004 e T005 podem ser executadas em paralelo.
# As tarefas de teste T006 e T007 podem ser executadas em paralelo.
# As tarefas de polimento T017 e T018 podem ser executadas em paralelo.

# Exemplo de comando para o agente de tarefas (hipotético):
/execute T002 & /execute T003
/execute T004 & /execute T005
/execute T006 & /execute T007
```
