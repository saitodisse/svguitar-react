# Plano de Implementação: Componente de Diagrama de Acordes de Guitarra

**Branch**: `001-guitar-svg` | **Data**: 2024-12-19 | **Spec**: `/home/saito/_git/svguitar-react/specs/001-guitar-svg/spec.md`
**Entrada**: Especificação da feature em `/home/saito/_git/svguitar-react/specs/001-guitar-svg/spec.md`

## Fluxo de Execução (escopo do comando /plan)

```
1. Carregar a spec da feature a partir do caminho de Entrada
   → OK: Especificação encontrada em /home/saito/_git/svguitar-react/specs/001-guitar-svg/spec.md
2. Preencher o Contexto Técnico (buscar por NEEDS CLARIFICATION)
   → Tipo de Projeto: single (biblioteca React)
   → Decisão de Estrutura: Opção 1 (projeto único)
3. Avaliar a seção de Verificação da Constituição abaixo
   → Violações detectadas: Nenhuma - projeto simples e focado
   → Atualizar o Rastreamento de Progresso: Verificação Inicial da Constituição
4. Executar a Fase 0 → research.md
   → Incertezas resolvidas com base nos arquivos fornecidos
5. Executar a Fase 1 → contracts, data-model.md, quickstart.md
6. Reavaliar a seção de Verificação da Constituição
   → Nenhuma nova violação detectada
   → Atualizar o Rastreamento de Progresso: Verificação Pós-Design
7. Planejar a Fase 2 → Descrever a abordagem de geração de tarefas
8. PARAR - Pronto para o comando /tasks
```

**IMPORTANTE**: O comando /plan PARA no passo 7. As Fases 2-4 são executadas por outros comandos:

- Fase 2: comando /tasks cria o tasks.md
- Fases 3-4: Execução da implementação (manual ou via ferramentas)

## Resumo

Criar um componente React `ChordDiagram` que renderiza diagramas de acordes de guitarra em SVG com alta performance e customização total via props. O componente deve ser declarativo, otimizado para evitar re-renderizações desnecessárias, e substituir bibliotecas externas que causam gargalos de performance. Incluir suporte a dedos, pestanas, posições, afinações customizadas e estilos visuais. A nova versão integrará a biblioteca `tonal` para cálculos de teoria musical e adicionará suporte para rotação do diagrama (layout vertical) e modo para canhotos (espelhado).

## Contexto Técnico

**Linguagem/Versão**: TypeScript 5.8.3, React 19.1.1  
**Dependências Primárias**: React, SVG (nativo), Vite 7.1.7, Tonal  
**Armazenamento**: N/A (componente puro sem estado)  
**Testes**: Vitest (já configurado no projeto)  
**Plataforma Alvo**: Web (React/TypeScript)  
**Tipo de Projeto**: single (biblioteca React)  
**Metas de Performance**: Renderização SVG otimizada, evitar re-renderizações desnecessárias  
**Restrições**: Componente totalmente declarativo, sem dependências de estado interno  
**Escala/Escopo**: Biblioteca NPM para consumo em aplicações React

## Verificação da Constituição

_GATE: Deve passar antes da pesquisa da Fase 0. Revalidar após o design da Fase 1._

**Simplicidade**:

- Projetos: [1] (componente React único)
- Usando o framework diretamente? ✅ (React nativo, sem wrappers)
- Modelo de dados único? ✅ (interfaces TypeScript simples)
- Evitando padrões? ✅ (sem padrões desnecessários)

**Arquitetura**:

- TODA feature como biblioteca? ✅ (componente como biblioteca NPM)
- Bibliotecas listadas: [ChordDiagram - componente React para diagramas de acordes]
- CLI por biblioteca: N/A (componente React, não CLI)
- Documentação da biblioteca: quickstart.md previsto

**Testes (INNEGOCIÁVEL)**:

- Ciclo RED-GREEN-Refactor aplicado? ✅ (testes antes da implementação)
- Commits mostram testes antes da implementação? ✅ (planejado)
- Ordem: Contract→Integration→E2E→Unit seguida estritamente? ✅ (planejado)
- Dependências reais usadas? ✅ (React/TypeScript nativos)
- Testes de integração para: novas bibliotecas, mudanças de contrato, esquemas compartilhados? ✅ (planejado)
- PROIBIDO: Implementar antes do teste, pular a fase RED? ✅ (planejado)

**Observabilidade**:

- Logging estruturado incluído? N/A (componente puro)
- Logs do frontend → backend? N/A (componente puro)
- Contexto de erro suficiente? ✅ (validação de props com erros claros)

**Versionamento**:

- Número de versão atribuído? ✅ (1.0.0 inicial)
- BUILD incrementa a cada mudança? ✅ (planejado)
- Breaking changes tratadas? ✅ (TypeScript interfaces versionadas)

## Estrutura do Projeto

### Documentação (esta feature)

```
specs/001-guitar-svg/
├── plan.md              # Este arquivo (saída do comando /plan)
├── research.md          # Saída da Fase 0 (comando /plan)
├── data-model.md        # Saída da Fase 1 (comando /plan)
├── quickstart.md        # Saída da Fase 1 (comando /plan)
├── contracts/           # Saída da Fase 1 (comando /plan)
└── tasks.md             # Saída da Fase 2 (comando /tasks - NÃO criado por /plan)
```

### Código-Fonte (raiz do repositório)

```
# Opção 1: Projeto único (DEFAULT)
src/
├── components/
│   └── ChordDiagram/
│       ├── ChordDiagram.tsx
│       ├── ChordDiagram.test.tsx
│       ├── types.ts
│       └── utils.ts
├── stories/
│   └── ChordDiagram.stories.ts
└── lib/

tests/
├── contract/
├── integration/
└── unit/
```

**Decisão de Estrutura**: PADRÃO para Opção 1 - projeto único de biblioteca React

## Fase 0: Esboço & Pesquisa

1. **Extrair incertezas do Contexto Técnico**:
    - ✅ Tecnologia definida: React + TypeScript + SVG + Tonal
    - ✅ Performance: React.memo e otimizações de renderização
    - ✅ Estrutura: Componente puro com props tipadas
    - ✅ Pesquisa adicional: Estratégias de transformação SVG para rotação e espelhamento.

2. **Consolidar achados** em `research.md` baseado nos arquivos fornecidos:
    - Decisões técnicas já documentadas em research.md
    - Justificativa para inclusão da biblioteca `tonal`.
    - Boas práticas para componentes React SVG
    - Estratégias de otimização de performance

**Saída**: research.md com todas as incertezas resolvidas

## Fase 1: Design & Contratos

_Pré-requisito: research.md concluído_

1. **Extrair entidades da spec da feature** → `data-model.md`:
    - ChordDiagramProps, Chord, Finger, Barre, ChordStyle
    - Adicionar propriedades de layout a `ChordStyle` (`orientation`, `handedness`).
    - Atualizar `Instrument.tuning` para usar notação científica.
    - Regras de validação para props
    - Interfaces TypeScript completas

2. **Gerar contratos de API** a partir dos requisitos funcionais:
    - Props do componente como "contrato" da biblioteca
    - Validação de entrada e tratamento de erros
    - Schema de tipos TypeScript

3. **Gerar testes de contrato** a partir dos contratos:
    - Testes para validação de props
    - Testes para casos limite
    - Testes devem falhar (sem implementação ainda)

4. **Extrair cenários de teste** das user stories:
    - Cada cenário de aceitação → teste de integração
    - Teste de quickstart = validação dos exemplos

5. **Atualizar o arquivo do agente incrementalmente**:
    - Adicionar contexto do componente ChordDiagram
    - Manter abaixo de 150 linhas

**Saída**: data-model.md, /contracts/\*, testes falhando, quickstart.md

## Fase 2: Abordagem de Planejamento de Tarefas

_Esta seção descreve o que o comando /tasks fará - NÃO executar durante /plan_

**Estratégia de Geração de Tarefas**:

- Carregar `/templates/tasks-template.md` como base
- Gerar tarefas a partir dos documentos de design da Fase 1
- Cada interface TypeScript → tarefa de criação de tipo [P]
- Cada cenário de aceitação → tarefa de teste de integração
- Adicionar tarefas específicas para testar a integração com `tonal`, a rotação e o modo canhoto.
- Tarefas de implementação para fazer os testes passarem
- Tarefas de Storybook para documentação visual das novas funcionalidades

**Estratégia de Ordenação**:

- Ordem TDD: Testes antes da implementação
- Ordem de dependências: Tipos → Utilitários → Componente → Stories
- Marcar [P] para execução paralela (arquivos independentes)

**Saída Estimada**: 15-20 tarefas numeradas e ordenadas em tasks.md

**IMPORTANTE**: Esta fase é executada pelo comando /tasks, NÃO pelo /plan

## Fase 3+: Implementação Futura

_Estas fases estão além do escopo do comando /plan_

**Fase 3**: Execução das tarefas (comando /tasks cria o tasks.md)  
**Fase 4**: Implementação (executar o tasks.md seguindo os princípios da constituição)  
**Fase 5**: Validação (rodar testes, executar o quickstart.md, validação de performance)

## Versionamento

- **v1.1.0**: Adicionado suporte para rotação, modo canhoto e integração com `tonal.js`.
- **v1.0.0**: Versão inicial com funcionalidades básicas.

## Rastreamento de Complexidade

_Nenhuma violação da constituição detectada - projeto simples e focado_

## Rastreamento de Progresso

_Este checklist é atualizado durante o fluxo de execução_

**Status das Fases**:

- [x] Fase 0: Pesquisa concluída (comando /plan)
- [x] Fase 1: Design concluído (comando /plan)
- [x] Fase 2: Planejamento de tarefas concluído (comando /plan - apenas descrever abordagem)
- [ ] Fase 3: Tarefas geradas (comando /tasks)
- [ ] Fase 4: Implementação concluída
- [ ] Fase 5: Validação aprovada

**Status dos Gates**:

- [x] Verificação Inicial da Constituição: PASS
- [x] Verificação Pós-Design da Constituição: PASS
- [x] Todas as NEEDS CLARIFICATION resolvidas
- [x] Desvios de complexidade documentados

---

_Baseado na Constituição v2.1.1 - Veja `/memory/constitution.md`_
