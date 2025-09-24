## description: Criar ou atualizar a especificação da feature a partir de uma descrição em linguagem natural.

Dada a descrição da feature fornecida como argumento, faça o seguinte:

1. Execute o script `.specify/scripts/bash/create-new-feature.sh --json "$ARGUMENTS"` a partir da raiz do repositório e analise a saída JSON para obter BRANCH_NAME e SPEC_FILE. Todos os caminhos de arquivos devem ser absolutos.
2. Carregue `.specify/templates/spec-template.md` para entender as seções obrigatórias.
3. Escreva a especificação em SPEC_FILE usando a estrutura do template, substituindo os placeholders por detalhes concretos derivados da descrição da feature (argumentos), preservando a ordem das seções e os títulos.
4. Relate a conclusão com o nome da branch, o caminho do arquivo de especificação e a prontidão para a próxima fase.

Observação: O script cria e faz checkout da nova branch e inicializa o arquivo de especificação antes de escrever.
