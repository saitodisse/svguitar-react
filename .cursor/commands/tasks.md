## description: Gerar um tasks.md acionável, ordenado por dependências, para a feature com base nos artefatos de design disponíveis.

Dado o contexto fornecido como argumento, faça o seguinte:

1. Execute `.specify/scripts/bash/check-task-prerequisites.sh --json` a partir da raiz do repositório e analise FEATURE_DIR e a lista AVAILABLE_DOCS. Todos os caminhos devem ser absolutos.
2. Carregue e analise os documentos de design disponíveis:

   - Leia sempre o plan.md para stack e bibliotecas
   - SE EXISTIR: Leia data-model.md para entidades
   - SE EXISTIR: Leia contracts/ para endpoints de API
   - SE EXISTIR: Leia research.md para decisões técnicas
   - SE EXISTIR: Leia quickstart.md para cenários de teste

   Observação: Nem todos os projetos têm todos os documentos. Por exemplo:

   - Ferramentas de CLI podem não ter contracts/
   - Bibliotecas simples podem não precisar de data-model.md
   - Gere tarefas com base no que estiver disponível

3. Gere as tarefas seguindo o template:

   - Use `.specify/templates/tasks-template.md` como base
   - Substitua as tarefas de exemplo por tarefas reais com base em:
     - **Tarefas de Setup**: Início do projeto, dependências, linting
     - **Tarefas de Teste [P]**: Uma por contrato, uma por cenário de integração
     - **Tarefas Core**: Uma por entidade, serviço, comando de CLI, endpoint
     - **Tarefas de Integração**: Conexões de BD, middleware, logging
     - **Tarefas de Polimento [P]**: Testes unitários, performance, docs

4. Regras de geração de tarefas:

   - Cada arquivo de contrato → tarefa de teste de contrato marcada [P]
   - Cada entidade em data-model → tarefa de criação de modelo marcada [P]
   - Cada endpoint → tarefa de implementação (não paralela se houver arquivos compartilhados)
   - Cada user story → teste de integração marcado [P]
   - Arquivos diferentes = pode ser paralelo [P]
   - Mesmo arquivo = sequencial (sem [P])

5. Ordene as tarefas por dependências:

   - Setup antes de tudo
   - Testes antes da implementação (TDD)
   - Modelos antes de serviços
   - Serviços antes de endpoints
   - Core antes de integração
   - Tudo antes do polimento

6. Inclua exemplos de execução em paralelo:

   - Agrupe tarefas [P] que podem rodar juntas
   - Mostre comandos reais do agente Task

7. Crie FEATURE_DIR/tasks.md com:
   - Nome correto da feature conforme o plano de implementação
   - Tarefas numeradas (T001, T002, etc.)
   - Caminhos de arquivo claros para cada tarefa
   - Notas de dependência
   - Orientação para execução paralela

Contexto para geração das tarefas: $ARGUMENTS

O tasks.md deve ser imediatamente executável — cada tarefa precisa ser específica o suficiente para que um LLM a complete sem contexto adicional.
