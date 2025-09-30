---
description: Cria ou atualiza a especificação do recurso a partir de uma descrição do recurso em linguagem natural.
---

A entrada do usuário para você pode ser fornecida diretamente pelo agente ou como um argumento de comando - você **DEVE** considerá-la antes de prosseguir com o prompt (se não estiver vazia).

Entrada do usuário:

$ARGUMENTS

O texto que o usuário digitou após `/specify` na mensagem de gatilho **é** a descrição do recurso. Assuma que você sempre a tem disponível nesta conversa, mesmo que `$ARGUMENTS` apareça literalmente abaixo. Não peça ao usuário para repeti-la, a menos que ele tenha fornecido um comando vazio.

Dada essa descrição do recurso, faça o seguinte:

1. Execute o script `.specify/scripts/bash/create-new-feature.sh --json "$ARGUMENTS"` da raiz do repositório e analise sua saída JSON para BRANCH_NAME e SPEC_FILE. Todos os caminhos de arquivo devem ser absolutos.
   **IMPORTANTE** Você só deve executar este script uma vez. O JSON é fornecido no terminal como saída - sempre consulte-o para obter o conteúdo real que você está procurando.
2. Carregue `.specify/templates/spec-template.md` para entender as seções necessárias.
3. Escreva a especificação em SPEC_FILE usando a estrutura do modelo, substituindo os placeholders por detalhes concretos derivados da descrição do recurso (argumentos), preservando a ordem das seções e os títulos.
4. Relate a conclusão com o nome do branch, o caminho do arquivo de especificação e a prontidão para a próxima fase.

Nota: O script cria e faz o checkout do novo branch e inicializa o arquivo de especificação antes de escrever.
