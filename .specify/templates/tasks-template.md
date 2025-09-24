# Tarefas: [FEATURE NAME]

**Entrada**: Documentos de design em `/specs/[###-feature-name]/`
**Pré-requisitos**: plan.md (obrigatório), research.md, data-model.md, contracts/

## Fluxo de Execução (principal)

```
1. Carregar plan.md do diretório da feature
   → Se não encontrar: ERRO "Nenhum plano de implementação encontrado"
   → Extrair: stack, bibliotecas, estrutura
2. Carregar documentos de design opcionais:
   → data-model.md: Extrair entidades → tarefas de modelo
   → contracts/: Cada arquivo → tarefa de teste de contrato
   → research.md: Extrair decisões → tarefas de setup
3. Gerar tarefas por categoria:
   → Setup: init do projeto, dependências, linting
   → Testes: testes de contrato, testes de integração
   → Core: modelos, serviços, comandos CLI
   → Integração: DB, middleware, logging
   → Polimento: testes unitários, performance, docs
4. Aplicar regras de tarefas:
   → Arquivos diferentes = marcar [P] para paralelo
   → Mesmo arquivo = sequencial (sem [P])
   → Testes antes da implementação (TDD)
5. Numerar tarefas sequencialmente (T001, T002...)
6. Gerar grafo de dependências
7. Criar exemplos de execução paralela
8. Validar completude das tarefas:
   → Todos os contratos têm testes?
   → Todas as entidades têm modelos?
   → Todos os endpoints implementados?
9. Retorno: SUCESSO (tarefas prontas para execução)
```

## Formato: `[ID] [P?] Descrição`

- **[P]**: Pode rodar em paralelo (arquivos diferentes, sem dependências)
- Incluir caminhos exatos de arquivo nas descrições

## Convenções de Caminho

- **Projeto único**: `src/`, `tests/` na raiz do repositório
- **App web**: `backend/src/`, `frontend/src/`
- **Mobile**: `api/src/`, `ios/src/` ou `android/src/`
- Os caminhos abaixo assumem projeto único — ajuste conforme a estrutura do plan.md

## Fase 3.1: Setup

- [ ] T001 Criar estrutura do projeto conforme o plano
- [ ] T002 Inicializar projeto [linguagem] com dependências do [framework]
- [ ] T003 [P] Configurar ferramentas de linting e formatação

## Fase 3.2: Testes Primeiro (TDD) ⚠️ DEVE CONCLUIR ANTES da 3.3

**CRÍTICO: Esses testes DEVEM ser escritos e DEVEM FALHAR antes de QUALQUER implementação**

- [ ] T004 [P] Teste de contrato POST /api/users em tests/contract/test_users_post.py
- [ ] T005 [P] Teste de contrato GET /api/users/{id} em tests/contract/test_users_get.py
- [ ] T006 [P] Teste de integração cadastro de usuário em tests/integration/test_registration.py
- [ ] T007 [P] Teste de integração fluxo de auth em tests/integration/test_auth.py

## Fase 3.3: Implementação Core (APENAS após os testes falharem)

- [ ] T008 [P] Modelo User em src/models/user.py
- [ ] T009 [P] CRUD do UserService em src/services/user_service.py
- [ ] T010 [P] CLI --create-user em src/cli/user_commands.py
- [ ] T011 Endpoint POST /api/users
- [ ] T012 Endpoint GET /api/users/{id}
- [ ] T013 Validação de entrada
- [ ] T014 Tratamento de erros e logging

## Fase 3.4: Integração

- [ ] T015 Conectar UserService ao DB
- [ ] T016 Middleware de auth
- [ ] T017 Logging de requisição/resposta
- [ ] T018 CORS e headers de segurança

## Fase 3.5: Polimento

- [ ] T019 [P] Testes unitários de validação em tests/unit/test_validation.py
- [ ] T020 Testes de performance (<200ms)
- [ ] T021 [P] Atualizar docs/api.md
- [ ] T022 Remover duplicação
- [ ] T023 Rodar manual-testing.md

## Dependências

- Testes (T004-T007) antes da implementação (T008-T014)
- T008 bloqueia T009, T015
- T016 bloqueia T018
- Implementação antes do polimento (T019-T023)

## Exemplo de Paralelismo

```
# Rodar T004-T007 juntos:
Task: "Teste de contrato POST /api/users em tests/contract/test_users_post.py"
Task: "Teste de contrato GET /api/users/{id} em tests/contract/test_users_get.py"
Task: "Teste de integração cadastro em tests/integration/test_registration.py"
Task: "Teste de integração auth em tests/integration/test_auth.py"
```

## Notas

- Tarefas [P] = arquivos diferentes, sem dependências
- Verifique que os testes falham antes de implementar
- Faça commit após cada tarefa
- Evite: tarefas vagas, conflitos no mesmo arquivo

## Regras de Geração de Tarefas

_Aplicadas durante a execução do main()_

1. **A partir dos Contratos**:
    - Cada arquivo de contrato → tarefa de teste de contrato [P]
    - Cada endpoint → tarefa de implementação
2. **A partir do Data Model**:
    - Cada entidade → tarefa de criação de modelo [P]
    - Relacionamentos → tarefas na camada de serviços
3. **A partir das User Stories**:
    - Cada story → teste de integração [P]
    - Cenários de quickstart → tarefas de validação

4. **Ordenação**:
    - Setup → Testes → Modelos → Serviços → Endpoints → Polimento
    - Dependências bloqueiam execução paralela

## Checklist de Validação

_GATE: Checado por main() antes de retornar_

- [ ] Todos os contratos têm testes correspondentes
- [ ] Todas as entidades têm tarefas de modelo
- [ ] Todos os testes vêm antes da implementação
- [ ] Tarefas paralelas realmente independentes
- [ ] Cada tarefa especifica o caminho exato do arquivo
- [ ] Nenhuma tarefa modifica o mesmo arquivo que outra tarefa [P]
