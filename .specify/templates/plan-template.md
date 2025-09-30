# Plano de Implementação: [FEATURE]

**Branch**: `[###-feature-name]` | **Data**: [DATE] | **Spec**: [link]
**Entrada**: Especificação da feature de `/specs/[###-feature-name]/spec.md`

## Fluxo de Execução (escopo do comando /plan)

```
1. Carregar especificação da feature do caminho de Entrada
   → Se não encontrada: ERRO "Nenhuma especificação de feature em {caminho}"
2. Preencher Contexto Técnico (verificar por PRECISA DE ESCLARECIMENTO)
   → Detectar Tipo de Projeto da estrutura do sistema de arquivos ou contexto (web=frontend+backend, mobile=app+api)
   → Definir Decisão de Estrutura com base no tipo de projeto
3. Preencher a seção de Verificação da Constituição com base no conteúdo do documento de constituição.
4. Avaliar a seção de Verificação da Constituição abaixo
   → Se existirem violações: Documentar no Rastreamento de Complexidade
   → Se nenhuma justificativa for possível: ERRO "Simplifique a abordagem primeiro"
   → Atualizar Rastreamento de Progresso: Verificação Inicial da Constituição
5. Executar Fase 0 → research.md
   → Se PRECISA DE ESCLARECIMENTO permanecer: ERRO "Resolva as incógnitas"
6. Executar Fase 1 → contracts, data-model.md, quickstart.md, arquivo de template específico do agente (ex: `CURSOR.md` para Cursor, `.github/copilot-instructions.md` para GitHub Copilot, `GEMINI.md` para Gemini CLI, `QWEN.md` para Qwen Code ou `AGENTS.md` para opencode).
7. Reavaliar a seção de Verificação da Constituição
   → Se novas violações: Refatorar o design, retornar à Fase 1
   → Atualizar Rastreamento de Progresso: Verificação da Constituição Pós-Design
8. Planejar Fase 2 → Descrever a abordagem de geração de tarefas (NÃO criar tasks.md)
9. PARAR - Pronto para o comando /tasks
```

**IMPORTANTE**: O comando /plan PARA no passo 7. As Fases 2-4 são executadas por outros comandos:

- Fase 2: O comando /tasks cria tasks.md
- Fase 3-4: Execução da implementação (manual ou via ferramentas)

## Resumo

[Extrair da especificação da feature: requisito primário + abordagem técnica da pesquisa]

## Contexto Técnico

**Linguagem/Versão**: [ex: Python 3.11, Swift 5.9, Rust 1.75 ou PRECISA DE ESCLARECIMENTO]
**Dependências Primárias**: [ex: FastAPI, UIKit, LLVM ou PRECISA DE ESCLARECIMENTO]
**Armazenamento**: [se aplicável, ex: PostgreSQL, CoreData, arquivos ou N/A]
**Testes**: [ex: pytest, XCTest, cargo test ou PRECISA DE ESCLARECIMENTO]
**Plataforma Alvo**: [ex: servidor Linux, iOS 15+, WASM ou PRECISA DE ESCLARECIMENTO]
**Tipo de Projeto**: [único/web/mobile - determina a estrutura do código fonte]
**Metas de Desempenho**: [específico do domínio, ex: 1000 req/s, 10k linhas/seg, 60 fps ou PRECISA DE ESCLARECIMENTO]
**Restrições**: [específico do domínio, ex: <200ms p95, <100MB de memória, capacidade offline ou PRECISA DE ESCLARECIMENTO]
**Escala/Escopo**: [específico do domínio, ex: 10k usuários, 1M LOC, 50 telas ou PRECISA DE ESCLARECIMENTO]

## Verificação da Constituição

_GATE: Deve passar antes da pesquisa da Fase 0. Re-verificar após o design da Fase 1._

[Portões determinados com base no arquivo da constituição]

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

### Código Fonte (raiz do repositório)

<!--
  AÇÃO NECESSÁRIA: Substitua a árvore de placeholders abaixo pelo layout concreto
  para esta feature. Exclua as opções não utilizadas e expanda a estrutura escolhida com
  caminhos reais (ex: apps/admin, packages/something). O plano entregue não deve
  incluir rótulos de Opção.
-->

```
# [REMOVER SE NÃO USADO] Opção 1: Projeto único (PADRÃO)
src/
├── models/
├── services/
├── cli/
└── lib/

tests/
├── contract/
├── integration/
└── unit/

# [REMOVER SE NÃO USADO] Opção 2: Aplicação Web (quando "frontend" + "backend" detectado)
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

# [REMOVER SE NÃO USADO] Opção 3: Mobile + API (quando "iOS/Android" detectado)
api/
└── [igual ao backend acima]

ios/ ou android/
└── [estrutura específica da plataforma: módulos de feature, fluxos de UI, testes de plataforma]
```

**Decisão de Estrutura**: [Documente a estrutura selecionada e referencie os diretórios
reais capturados acima]

## Fase 0: Esboço e Pesquisa

1.  **Extrair incógnitas do Contexto Técnico** acima:
    - Para cada PRECISA DE ESCLARECIMENTO → tarefa de pesquisa
    - Para cada dependência → tarefa de melhores práticas
    - Para cada integração → tarefa de padrões

2.  **Gerar e despachar agentes de pesquisa**:

    ```
    Para cada incógnita no Contexto Técnico:
      Tarefa: "Pesquisar {incógnita} para o contexto {feature}"
    Para cada escolha de tecnologia:
      Tarefa: "Encontrar melhores práticas para {tecnologia} no domínio {domínio}"
    ```

3.  **Consolidar descobertas** em `research.md` usando o formato:
    - Decisão: [o que foi escolhido]
    - Justificativa: [por que foi escolhido]
    - Alternativas consideradas: [o que mais foi avaliado]

**Saída**: research.md com todos os PRECISA DE ESCLARECIMENTO resolvidos

## Fase 1: Design e Contratos

_Pré-requisitos: research.md completo_

1.  **Extrair entidades da especificação da feature** → `data-model.md`:
    - Nome da entidade, campos, relacionamentos
    - Regras de validação dos requisitos
    - Transições de estado, se aplicável

2.  **Gerar contratos de API** a partir dos requisitos funcionais:
    - Para cada ação do usuário → endpoint
    - Usar padrões REST/GraphQL padrão
    - Gerar esquema OpenAPI/GraphQL para `/contracts/`

3.  **Gerar testes de contrato** a partir dos contratos:
    - Um arquivo de teste por endpoint
    - Afirmar esquemas de requisição/resposta
    - Os testes devem falhar (ainda não há implementação)

4.  **Extrair cenários de teste** das histórias de usuário:
    - Cada história → cenário de teste de integração
    - Teste de início rápido = passos de validação da história

5.  **Atualizar arquivo do agente incrementalmente** (operação O(1)):
    - Rodar `.specify/scripts/bash/update-agent-context.sh cursor`
      **IMPORTANTE**: Execute-o exatamente como especificado acima. Não adicione ou remova nenhum argumento.
    - Se existir: Adicionar apenas NOVAS tecnologias do plano atual
    - Preservar adições manuais entre marcadores
    - Atualizar alterações recentes (manter as últimas 3)
    - Manter abaixo de 150 linhas para eficiência de tokens
    - Saída para a raiz do repositório

**Saída**: data-model.md, /contracts/\*, testes falhando, quickstart.md, arquivo específico do agente

## Fase 2: Abordagem de Planejamento de Tarefas

_Esta seção descreve o que o comando /tasks fará - NÃO execute durante /plan_

**Estratégia de Geração de Tarefas**:

- Carregar `.specify/templates/tasks-template.md` como base
- Gerar tarefas a partir dos documentos de design da Fase 1 (contratos, modelo de dados, início rápido)
- Cada contrato → tarefa de teste de contrato [P]
- Cada entidade → tarefa de criação de modelo [P]
- Cada história de usuário → tarefa de teste de integração
- Tarefas de implementação para fazer os testes passarem

**Estratégia de Ordenação**:

- Ordem TDD: Testes antes da implementação
- Ordem de dependência: Modelos antes de serviços antes da UI
- Marcar [P] para execução paralela (arquivos independentes)

**Saída Estimada**: 25-30 tarefas numeradas e ordenadas em tasks.md

**IMPORTANTE**: Esta fase é executada pelo comando /tasks, NÃO por /plan

## Fase 3+: Implementação Futura

_Estas fases estão além do escopo do comando /plan_

**Fase 3**: Execução de tarefas (comando /tasks cria tasks.md)
**Fase 4**: Implementação (executar tasks.md seguindo os princípios constitucionais)
**Fase 5**: Validação (rodar testes, executar quickstart.md, validação de desempenho)

## Rastreamento de Complexidade

_Preencher SOMENTE se a Verificação da Constituição tiver violações que devem ser justificadas_

| Violação                | Por que é necessário  | Alternativa mais simples rejeitada porque    |
| ----------------------- | --------------------- | -------------------------------------------- |
| [ex: 4º projeto]        | [necessidade atual]   | [por que 3 projetos são insuficientes]       |
| [ex: Padrão Repository] | [problema específico] | [por que acesso direto ao BD é insuficiente] |

## Rastreamento de Progresso

_Esta lista de verificação é atualizada durante o fluxo de execução_

**Status da Fase**:

- [ ] Fase 0: Pesquisa completa (comando /plan)
- [ ] Fase 1: Design completo (comando /plan)
- [ ] Fase 2: Planejamento de tarefas completo (comando /plan - descrever apenas a abordagem)
- [ ] Fase 3: Tarefas geradas (comando /tasks)
- [ ] Fase 4: Implementação completa
- [ ] Fase 5: Validação aprovada

**Status do Portão**:

- [ ] Verificação Inicial da Constituição: PASSA
- [ ] Verificação da Constituição Pós-Design: PASSA
- [ ] Todos os PRECISA DE ESCLARECIMENTO resolvidos
- [ ] Desvios de complexidade documentados

---

_Baseado na Constituição v1.0.0 - Ver `/memory/constitution.md`_
