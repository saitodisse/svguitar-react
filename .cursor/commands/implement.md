---
description: Executa o plano de implementação processando e executando todas as tarefas definidas em tasks.md
---

A entrada do usuário pode ser fornecida diretamente pelo agente ou como um argumento de comando - você **DEVE** considerá-la antes de prosseguir com o prompt (se não estiver vazia).

Entrada do usuário:

$ARGUMENTS

1. Execute `.specify/scripts/bash/check-prerequisites.sh --json --require-tasks --include-tasks` da raiz do repositório e analise FEATURE_DIR e a lista AVAILABLE_DOCS. Todos os caminhos devem ser absolutos.

2. Carregue e analise o contexto de implementação:
    - **OBRIGATÓRIO**: Leia tasks.md para a lista completa de tarefas e plano de execução
    - **OBRIGATÓRIO**: Leia plan.md para a pilha de tecnologia, arquitetura e estrutura de arquivos
    - **SE EXISTIR**: Leia data-model.md para entidades e relacionamentos
    - **SE EXISTIR**: Leia contracts/ para especificações de API e requisitos de teste
    - **SE EXISTIR**: Leia research.md para decisões e restrições técnicas
    - **SE EXISTIR**: Leia quickstart.md para cenários de integração

3. Analise a estrutura de tasks.md e extraia:
    - **Fases da tarefa**: Configuração, Testes, Núcleo, Integração, Polimento
    - **Dependências da tarefa**: Regras de execução sequencial vs paralela
    - **Detalhes da tarefa**: ID, descrição, caminhos de arquivo, marcadores paralelos [P]
    - **Fluxo de execução**: Ordem e requisitos de dependência

4. Execute a implementação seguindo o plano de tarefas:
    - **Execução fase a fase**: Conclua cada fase antes de passar para a próxima
    - **Respeite as dependências**: Execute tarefas sequenciais em ordem, tarefas paralelas [P] podem ser executadas juntas
    - **Siga a abordagem TDD**: Execute tarefas de teste antes de suas tarefas de implementação correspondentes
    - **Coordenação baseada em arquivos**: Tarefas que afetam os mesmos arquivos devem ser executadas sequencialmente
    - **Pontos de verificação de validação**: Verifique a conclusão de cada fase antes de prosseguir

5. Regras de execução da implementação:
    - **Configuração primeiro**: Inicialize a estrutura do projeto, dependências, configuração
    - **Testes antes do código**: Se você precisar escrever testes para contratos, entidades e cenários de integração
    - **Desenvolvimento principal**: Implemente modelos, serviços, comandos CLI, endpoints
    - **Trabalho de integração**: Conexões de banco de dados, middleware, logging, serviços externos
    - **Polimento e validação**: Testes unitários, otimização de desempenho, documentação

6. Acompanhamento do progresso e tratamento de erros:
    - Relate o progresso após cada tarefa concluída
    - Interrompa a execução se qualquer tarefa não paralela falhar
    - Para tarefas paralelas [P], continue com as tarefas bem-sucedidas, relate as que falharam
    - Forneça mensagens de erro claras com contexto para depuração
    - Sugira os próximos passos se a implementação não puder prosseguir
    - **IMPORTANTE** Para tarefas concluídas, certifique-se de marcar a tarefa como [X] no arquivo de tarefas.

7. Validação da conclusão:
    - Verifique se todas as tarefas necessárias foram concluídas
    - Verifique se os recursos implementados correspondem à especificação original
    - Valide se os testes passam e a cobertura atende aos requisitos
    - Confirme se a implementação segue o plano técnico
    - Relate o status final com um resumo do trabalho concluído

Nota: Este comando assume que existe uma divisão completa de tarefas em tasks.md. Se as tarefas estiverem incompletas ou ausentes, sugira executar `/tasks` primeiro para regenerar a lista de tarefas.
