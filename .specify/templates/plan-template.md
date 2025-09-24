# Plano de Implementação: [FEATURE]

**Branch**: `[###-feature-name]` | **Data**: [DATE] | **Spec**: [link]
**Entrada**: Especificação da feature em `/specs/[###-feature-name]/spec.md`

## Fluxo de Execução (escopo do comando /plan)

```
1. Carregar a spec da feature a partir do caminho de Entrada
   → Se não encontrar: ERRO "Nenhuma spec de feature em {path}"
2. Preencher o Contexto Técnico (buscar por NEEDS CLARIFICATION)
   → Detectar o Tipo de Projeto a partir do contexto (web=frontend+backend, mobile=app+api)
   → Definir a Decisão de Estrutura com base no tipo de projeto
3. Avaliar a seção de Verificação da Constituição abaixo
   → Se houver violações: Documentar em Rastreamento de Complexidade
   → Se não houver justificativa possível: ERRO "Simplifique a abordagem primeiro"
   → Atualizar o Rastreamento de Progresso: Verificação Inicial da Constituição
4. Executar a Fase 0 → research.md
   → Se permanecerem NEEDS CLARIFICATION: ERRO "Resolver incertezas"
5. Executar a Fase 1 → contracts, data-model.md, quickstart.md, arquivo de template específico do agente (ex.: `CLAUDE.md` para Claude Code, `.github/copilot-instructions.md` para GitHub Copilot, ou `GEMINI.md` para Gemini CLI).
6. Reavaliar a seção de Verificação da Constituição
   → Se surgirem novas violações: Refatorar o design, retornar à Fase 1
   → Atualizar o Rastreamento de Progresso: Verificação Pós-Design
7. Planejar a Fase 2 → Descrever a abordagem de geração de tarefas (NÃO criar tasks.md)
8. PARAR - Pronto para o comando /tasks
```

**IMPORTANTE**: O comando /plan PARA no passo 7. As Fases 2-4 são executadas por outros comandos:

- Fase 2: comando /tasks cria o tasks.md
- Fases 3-4: Execução da implementação (manual ou via ferramentas)

## Resumo

[Extrair da spec da feature: requisito principal + abordagem técnica da pesquisa]

## Contexto Técnico

**Linguagem/Versão**: [ex.: Python 3.11, Swift 5.9, Rust 1.75 ou NEEDS CLARIFICATION]  
**Dependências Primárias**: [ex.: FastAPI, UIKit, LLVM ou NEEDS CLARIFICATION]  
**Armazenamento**: [se aplicável, ex.: PostgreSQL, CoreData, arquivos ou N/A]  
**Testes**: [ex.: pytest, XCTest, cargo test ou NEEDS CLARIFICATION]  
**Plataforma Alvo**: [ex.: Servidor Linux, iOS 15+, WASM ou NEEDS CLARIFICATION]
**Tipo de Projeto**: [single/web/mobile - determina a estrutura do código]  
**Metas de Performance**: [específicas do domínio, ex.: 1000 req/s, 10k linhas/seg, 60 fps ou NEEDS CLARIFICATION]  
**Restrições**: [específicas do domínio, ex.: <200ms p95, <100MB memória, offline-capable ou NEEDS CLARIFICATION]  
**Escala/Escopo**: [específicas do domínio, ex.: 10k usuários, 1M LOC, 50 telas ou NEEDS CLARIFICATION]

## Verificação da Constituição

_GATE: Deve passar antes da pesquisa da Fase 0. Revalidar após o design da Fase 1._

**Simplicidade**:

- Projetos: [#] (máx. 3 - ex.: api, cli, tests)
- Usando o framework diretamente? (sem classes wrapper)
- Modelo de dados único? (sem DTOs a menos que a serialização difira)
- Evitando padrões? (sem Repository/UoW sem necessidade comprovada)

**Arquitetura**:

- TODA feature como biblioteca? (sem código direto de app)
- Bibliotecas listadas: [nome + propósito de cada]
- CLI por biblioteca: [comandos com --help/--version/--format]
- Documentação da biblioteca: formato llms.txt previsto?

**Testes (INNEGOCIÁVEL)**:

- Ciclo RED-GREEN-Refactor aplicado? (teste DEVE falhar primeiro)
- Commits mostram testes antes da implementação?
- Ordem: Contract→Integration→E2E→Unit seguida estritamente?
- Dependências reais usadas? (DBs reais, sem mocks)
- Testes de integração para: novas bibliotecas, mudanças de contrato, esquemas compartilhados?
- PROIBIDO: Implementar antes do teste, pular a fase RED

**Observabilidade**:

- Logging estruturado incluído?
- Logs do frontend → backend? (fluxo unificado)
- Contexto de erro suficiente?

**Versionamento**:

- Número de versão atribuído? (MAJOR.MINOR.BUILD)
- BUILD incrementa a cada mudança?
- Breaking changes tratadas? (testes paralelos, plano de migração)

## Estrutura do Projeto

### Documentação (esta feature)

```
specs/[###-feature]/
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
├── models/
├── services/
├── cli/
└── lib/

tests/
├── contract/
├── integration/
└── unit/

# Opção 2: Aplicação web (quando "frontend" + "backend" detectados)
backend/
├── src/
│   ├── models/
│   ├── services/
│   └── api/
└── tests/

frontend/
├── src/
│   ├── components/
│   ├── pages/
│   └── services/
└── tests/

# Opção 3: Mobile + API (quando "iOS/Android" detectado)
api/
└── [same as backend above]

ios/ or android/
└── [platform-specific structure]
```

**Decisão de Estrutura**: [PADRÃO para Opção 1 a menos que o Contexto Técnico indique app web/mobile]

## Fase 0: Esboço & Pesquisa

1. **Extrair incertezas do Contexto Técnico** acima:

   - Para cada NEEDS CLARIFICATION → tarefa de pesquisa
   - Para cada dependência → tarefa de boas práticas
   - Para cada integração → tarefa de padrões

2. **Gerar e despachar agentes de pesquisa**:

   ```
   Para cada incerteza no Contexto Técnico:
     Tarefa: "Pesquisar {incerteza} para {contexto da feature}"
   Para cada escolha de tecnologia:
     Tarefa: "Encontrar boas práticas para {tecnologia} em {domínio}"
   ```

3. **Consolidar achados** em `research.md` usando o formato:
   - Decisão: [o que foi escolhido]
   - Justificativa: [por que escolhido]
   - Alternativas consideradas: [o que mais foi avaliado]

**Saída**: research.md com todas as NEEDS CLARIFICATION resolvidas

## Fase 1: Design & Contratos

_Pré-requisito: research.md concluído_

1. **Extrair entidades da spec da feature** → `data-model.md`:

   - Nome da entidade, campos, relacionamentos
   - Regras de validação a partir dos requisitos
   - Transições de estado se aplicável

2. **Gerar contratos de API** a partir dos requisitos funcionais:

   - Para cada ação do usuário → endpoint
   - Usar padrões REST/GraphQL
   - Salvar o schema OpenAPI/GraphQL em `/contracts/`

3. **Gerar testes de contrato** a partir dos contratos:

   - Um arquivo de teste por endpoint
   - Validar schemas de requisição/resposta
   - Testes devem falhar (sem implementação ainda)

4. **Extrair cenários de teste** das user stories:

   - Cada story → cenário de teste de integração
   - Teste de quickstart = passos de validação da story

5. **Atualizar o arquivo do agente incrementalmente** (operação O(1)):
   - Rodar `/scripts/bash/update-agent-context.sh cursor` para seu assistente de IA
   - Se existir: Adicionar apenas tecnologias NOVAS do plano atual
   - Preservar adições manuais entre marcadores
   - Atualizar mudanças recentes (manter as últimas 3)
   - Manter abaixo de 150 linhas para eficiência de tokens
   - Gravar na raiz do repositório

**Saída**: data-model.md, /contracts/\*, testes falhando, quickstart.md, arquivo específico do agente

## Fase 2: Abordagem de Planejamento de Tarefas

_Esta seção descreve o que o comando /tasks fará - NÃO executar durante /plan_

**Estratégia de Geração de Tarefas**:

- Carregar `/templates/tasks-template.md` como base
- Gerar tarefas a partir dos documentos de design da Fase 1 (contratos, data model, quickstart)
- Cada contrato → tarefa de teste de contrato [P]
- Cada entidade → tarefa de criação de modelo [P]
- Cada user story → tarefa de teste de integração
- Tarefas de implementação para fazer os testes passarem

**Estratégia de Ordenação**:

- Ordem TDD: Testes antes da implementação
- Ordem de dependências: Modelos antes de serviços antes da UI
- Marcar [P] para execução paralela (arquivos independentes)

**Saída Estimada**: 25-30 tarefas numeradas e ordenadas em tasks.md

**IMPORTANTE**: Esta fase é executada pelo comando /tasks, NÃO pelo /plan

## Fase 3+: Implementação Futura

_Estas fases estão além do escopo do comando /plan_

**Fase 3**: Execução das tarefas (comando /tasks cria o tasks.md)  
**Fase 4**: Implementação (executar o tasks.md seguindo os princípios da constituição)  
**Fase 5**: Validação (rodar testes, executar o quickstart.md, validação de performance)

## Rastreamento de Complexidade

_Preencher APENAS se a Verificação da Constituição tiver violações que precisem ser justificadas_

| Violação                 | Por que é necessário  | Alternativa mais simples rejeitada porque    |
| ------------------------ | --------------------- | -------------------------------------------- |
| [ex.: 4º projeto]        | [necessidade atual]   | [por que 3 projetos são insuficientes]       |
| [ex.: Padrão Repository] | [problema específico] | [por que acesso direto ao DB é insuficiente] |

## Rastreamento de Progresso

_Este checklist é atualizado durante o fluxo de execução_

**Status das Fases**:

- [ ] Fase 0: Pesquisa concluída (comando /plan)
- [ ] Fase 1: Design concluído (comando /plan)
- [ ] Fase 2: Planejamento de tarefas concluído (comando /plan - apenas descrever abordagem)
- [ ] Fase 3: Tarefas geradas (comando /tasks)
- [ ] Fase 4: Implementação concluída
- [ ] Fase 5: Validação aprovada

**Status dos Gates**:

- [ ] Verificação Inicial da Constituição: PASS
- [ ] Verificação Pós-Design da Constituição: PASS
- [ ] Todas as NEEDS CLARIFICATION resolvidas
- [ ] Desvios de complexidade documentados

---

_Baseado na Constituição v2.1.1 - Veja `/memory/constitution.md`_
