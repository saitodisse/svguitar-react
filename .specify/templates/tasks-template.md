# Tarefas: [NOME DA FEATURE]

**Entrada**: Documentos de design de `/specs/[###-feature-name]/`
**Pré-requisitos**: plan.md (obrigatório), research.md, data-model.md, contracts/

## Fluxo de Execução (main)

```
1. Carregar plan.md do diretório da feature
   → Se não encontrado: ERRO "Nenhum plano de implementação encontrado"
   → Extrair: pilha de tecnologia, bibliotecas, estrutura
2. Carregar documentos de design opcionais:
   → data-model.md: Extrair entidades → tarefas de modelo
   → contracts/: Cada arquivo → tarefa de teste de contrato
   → research.md: Extrair decisões → tarefas de configuração
3. Gerar tarefas por categoria:
   → Configuração: inicialização do projeto, dependências, linting
   → Testes: testes de contrato, testes de integração
   → Core: modelos, serviços, comandos CLI
   → Integração: BD, middleware, logging
   → Polimento: testes unitários, desempenho, docs
4. Aplicar regras de tarefas:
   → Arquivos diferentes = marcar [P] para paralelo
   → Mesmo arquivo = sequencial (sem [P])
   → Testes antes da implementação (TDD)
5. Numerar tarefas sequencialmente (T001, T002...)
6. Gerar grafo de dependências
7. Criar exemplos de execução paralela
8. Validar a completude das tarefas:
   → Todos os contratos têm testes?
   → Todas as entidades têm modelos?
   → Todos os endpoints foram implementados?
9. Retornar: SUCESSO (tarefas prontas para execução)
```

## Formato: `[ID] [P?] Descrição`

- **[P]**: Pode ser executado em paralelo (arquivos diferentes, sem dependências)
- Incluir caminhos de arquivo exatos nas descrições

## Convenções de Caminho

- **Projeto único**: `src/`, `tests/` na raiz do repositório
- **Aplicação Web**: `backend/src/`, `frontend/src/`
- **Mobile**: `api/src/`, `ios/src/` ou `android/src/`
- Os caminhos mostrados abaixo assumem um projeto único - ajuste com base na estrutura do plan.md

## Fase 3.1: Configuração

- [ ] T001 Criar estrutura do projeto conforme plano de implementação
- [ ] T002 Inicializar projeto [linguagem] com dependências do [framework]
- [ ] T003 [P] Configurar ferramentas de linting e formatação

## Fase 3.2: Testes Primeiro (TDD) ⚠️ DEVE SER CONCLUÍDO ANTES DA 3.3

**CRÍTICO: Estes testes DEVEM ser escritos e DEVEM FALHAR antes de QUALQUER implementação**

- [ ] T004 [P] Teste de contrato POST /api/users em tests/contract/test_users_post.py
- [ ] T005 [P] Teste de contrato GET /api/users/{id} em tests/contract/test_users_get.py
- [ ] T006 [P] Teste de integração de registro de usuário em tests/integration/test_registration.py
- [ ] T007 [P] Teste de integração do fluxo de autenticação em tests/integration/test_auth.py

## Fase 3.3: Implementação Principal (SOMENTE após os testes estarem falhando)

- [ ] T008 [P] Modelo de usuário em src/models/user.py
- [ ] T009 [P] CRUD do UserService em src/services/user_service.py
- [ ] T010 [P] CLI --create-user em src/cli/user_commands.py
- [ ] T011 Endpoint POST /api/users
- [ ] T012 Endpoint GET /api/users/{id}
- [ ] T013 Validação de entrada
- [ ] T014 Tratamento de erros e logging

## Fase 3.4: Integração

- [ ] T015 Conectar UserService ao BD
- [ ] T016 Middleware de autenticação
- [ ] T017 Logging de requisição/resposta
- [ ] T018 CORS e cabeçalhos de segurança

## Fase 3.5: Polimento

- [ ] T019 [P] Testes unitários para validação em tests/unit/test_validation.py
- [ ] T020 Testes de desempenho (<200ms)
- [ ] T021 [P] Atualizar docs/api.md
- [ ] T022 Remover duplicação
- [ ] T023 Executar manual-testing.md

## Dependências

- Testes (T004-T007) antes da implementação (T008-T014)
- T008 bloqueia T009, T015
- T016 bloqueia T018
- Implementação antes do polimento (T019-T023)

## Exemplo Paralelo

```
# Lançar T004-T007 juntos:
Tarefa: "Teste de contrato POST /api/users em tests/contract/test_users_post.py"
Tarefa: "Teste de contrato GET /api/users/{id} em tests/contract/test_users_get.py"
Tarefa: "Teste de integração de registro em tests/integration/test_registration.py"
Tarefa: "Teste de integração de autenticação em tests/integration/test_auth.py"
```

## Notas

- Tarefas [P] = arquivos diferentes, sem dependências
- Verificar se os testes falham antes de implementar
- Fazer commit após cada tarefa
- Evitar: tarefas vagas, conflitos no mesmo arquivo

## Regras de Geração de Tarefas

_Aplicado durante a execução do main()_

1.  **Dos Contratos**:
    - Cada arquivo de contrato → tarefa de teste de contrato [P]
    - Cada endpoint → tarefa de implementação

2.  **Do Modelo de Dados**:
    - Cada entidade → tarefa de criação de modelo [P]
    - Relacionamentos → tarefas da camada de serviço

3.  **Das Histórias de Usuário**:
    - Cada história → teste de integração [P]
    - Cenários de início rápido → tarefas de validação

4.  **Ordenação**:
    - Configuração → Testes → Modelos → Serviços → Endpoints → Polimento
    - Dependências bloqueiam a execução paralela

## Checklist de Validação

_GATE: Verificado por main() antes de retornar_

- [ ] Todos os contratos têm testes correspondentes
- [ ] Todas as entidades têm tarefas de modelo
- [ ] Todos os testes vêm antes da implementação
- [ ] Tarefas paralelas são verdadeiramente independentes
- [ ] Cada tarefa especifica o caminho exato do arquivo
- [ ] Nenhuma tarefa modifica o mesmo arquivo que outra tarefa [P]
