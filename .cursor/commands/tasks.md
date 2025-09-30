---
description: Gera um tasks.md acionável e ordenado por dependência para o recurso com base nos artefatos de design disponíveis.
---

A entrada do usuário para você pode ser fornecida diretamente pelo agente ou como um argumento de comando - você **DEVE** considerá-la antes de prosseguir com o prompt (se não estiver vazia).

Entrada do usuário:

$ARGUMENTS

1. Execute `.specify/scripts/bash/check-prerequisites.sh --json` da raiz do repositório e analise a lista FEATURE_DIR e AVAILABLE_DOCS. Todos os caminhos devem ser absolutos.
2. Carregue e analise os documentos de design disponíveis:
    - Sempre leia plan.md para a pilha de tecnologia e bibliotecas
    - SE EXISTIR: Leia data-model.md para entidades
    - SE EXISTIR: Leia contracts/ para endpoints de API
    - SE EXISTIR: Leia research.md para decisões técnicas
    - SE EXISTIR: Leia quickstart.md para cenários de teste

    Nota: Nem todos os projetos têm todos os documentos. Por exemplo:
    - Ferramentas CLI podem não ter contracts/
    - Bibliotecas simples podem não precisar de data-model.md
    - Gere tarefas com base no que está disponível

3. Gere tarefas seguindo o modelo:
    - Use `.specify/templates/tasks-template.md` como base
    - Substitua as tarefas de exemplo por tarefas reais com base em:
        - **Tarefas de configuração**: Inicialização do projeto, dependências, linting
        - **Tarefas de teste [P]**: Uma por contrato, uma por cenário de integração
        - **Tarefas principais**: Uma por entidade, serviço, comando CLI, endpoint
        - **Tarefas de integração**: Conexões de BD, middleware, logging
        - **Tarefas de polimento [P]**: Testes unitários, desempenho, documentação

4. Regras de geração de tarefas:
    - Cada arquivo de contrato → tarefa de teste de contrato marcada com [P]
    - Cada entidade no data-model → tarefa de criação de modelo marcada com [P]
    - Cada endpoint → tarefa de implementação (não paralela se houver arquivos compartilhados)
    - Cada história de usuário → teste de integração marcado com [P]
    - Arquivos diferentes = podem ser paralelos [P]
    - Mesmo arquivo = sequencial (sem [P])

5. Ordene as tarefas por dependências:
    - Configuração antes de tudo
    - Testes antes da implementação (TDD)
    - Modelos antes dos serviços
    - Serviços antes dos endpoints
    - Núcleo antes da integração
    - Tudo antes do polimento

6. Inclua exemplos de execução paralela:
    - Agrupe tarefas [P] que podem ser executadas juntas
    - Mostre comandos reais do agente de Tarefas

7. Crie FEATURE_DIR/tasks.md com:
    - Nome correto do recurso do plano de implementação
    - Tarefas numeradas (T001, T002, etc.)
    - Caminhos de arquivo claros para cada tarefa
    - Notas de dependência
    - Orientação de execução paralela

Contexto para geração de tarefas: $ARGUMENTS

O tasks.md deve ser imediatamente executável - cada tarefa deve ser específica o suficiente para que um LLM possa completá-la sem contexto adicional.
