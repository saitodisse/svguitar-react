---
description: Cria ou atualiza a constituição do projeto a partir de entradas de princípios interativas ou fornecidas, garantindo que todos os modelos dependentes permaneçam sincronizados.
---

A entrada do usuário para você pode ser fornecida diretamente pelo agente ou como um argumento de comando - você **DEVE** considerá-la antes de prosseguir com o prompt (se não estiver vazia).

Entrada do usuário:

$ARGUMENTS

Você está atualizando a constituição do projeto em `.specify/memory/constitution.md`. Este arquivo é um MODELO contendo placeholders entre colchetes (ex.: `[PROJECT_NAME]`, `[PRINCIPLE_1_NAME]`). Sua tarefa é (a) coletar/derivar valores concretos, (b) preencher o modelo com precisão e (c) propagar quaisquer emendas para os artefatos dependentes.

Siga este fluxo de execução:

1. Carregue o modelo de constituição existente em `.specify/memory/constitution.md`.
    - Identifique cada placeholder no formato `[IDENTIFICADOR_EM_MAIUSCULAS]`.
      **IMPORTANTE**: O usuário pode exigir mais ou menos princípios do que os usados no modelo. Se um número for especificado, respeite-o - siga o modelo geral. Você atualizará o documento de acordo.

2. Colete/derive valores para os placeholders:
    - Se a entrada do usuário (conversa) fornecer um valor, use-o.
    - Caso contrário, infira do contexto existente do repositório (README, documentos, versões anteriores da constituição, se incorporadas).
    - Para datas de governança: `DATA_RATIFICACAO` é a data de adoção original (se desconhecida, pergunte ou marque como TODO), `DATA_ULTIMA_ALTERACAO` é hoje se forem feitas alterações, caso contrário, mantenha a anterior.
    - `VERSAO_CONSTITUICAO` deve ser incrementada de acordo com as regras de versionamento semântico:
        - MAJOR: Remoções ou redefinições de governança/princípios incompatíveis com versões anteriores.
        - MINOR: Novo princípio/seção adicionado ou orientação materialmente expandida.
        - PATCH: Esclarecimentos, redação, correções de digitação, refinamentos não semânticos.
    - Se o tipo de incremento da versão for ambíguo, proponha um raciocínio antes de finalizar.

3. Elabore o conteúdo da constituição atualizada:
    - Substitua cada placeholder por texto concreto (não deixe tokens entre colchetes, exceto slots de modelo intencionalmente mantidos que o projeto optou por não definir ainda — justifique explicitamente qualquer um que restar).
    - Preserve a hierarquia de títulos e os comentários podem ser removidos após substituídos, a menos que ainda adicionem orientação esclarecedora.
    - Garanta que cada seção de Princípio tenha: uma linha de nome sucinta, um parágrafo (ou lista de marcadores) capturando regras não negociáveis, e uma justificativa explícita se não for óbvia.
    - Garanta que a seção de Governança liste o procedimento de emenda, a política de versionamento e as expectativas de revisão de conformidade.

4. Lista de verificação de propagação de consistência (converta a lista de verificação anterior em validações ativas):
    - Leia `.specify/templates/plan-template.md` e garanta que qualquer "Verificação da Constituição" ou regras estejam alinhadas com os princípios atualizados.
    - Leia `.specify/templates/spec-template.md` para alinhamento de escopo/requisitos — atualize se a constituição adicionar/remover seções ou restrições obrigatórias.
    - Leia `.specify/templates/tasks-template.md` e garanta que a categorização de tarefas reflita tipos de tarefas orientados por princípios novos ou removidos (ex.: observabilidade, versionamento, disciplina de testes).
    - Leia cada arquivo de comando em `.specify/templates/commands/*.md` (incluindo este) para verificar se não restam referências desatualizadas (nomes específicos do agente como CLAUDE apenas) quando a orientação genérica é necessária.
    - Leia quaisquer documentos de orientação de tempo de execução (ex.: `README.md`, `docs/quickstart.md`, ou arquivos de orientação específicos do agente, se presentes). Atualize as referências aos princípios alterados.

5. Produza um Relatório de Impacto de Sincronização (adicione como um comentário HTML no topo do arquivo da constituição após a atualização):
    - Mudança de versão: antiga → nova
    - Lista de princípios modificados (título antigo → novo título se renomeado)
    - Seções adicionadas
    - Seções removidas
    - Modelos que requerem atualizações (✅ atualizado / ⚠ pendente) com caminhos de arquivo
    - TODOs de acompanhamento se algum placeholder for intencionalmente adiado.

6. Validação antes da saída final:
    - Nenhum token entre colchetes não explicado restante.
    - A linha da versão corresponde ao relatório.
    - Datas no formato ISO AAAA-MM-DD.
    - Os princípios são declarativos, testáveis e livres de linguagem vaga ("deveria" → substitua por DEVE/PODE com justificativa, quando apropriado).

7. Escreva a constituição concluída de volta em `.specify/memory/constitution.md` (sobrescrever).

8. Apresente um resumo final ao usuário com:
    - Nova versão e justificativa do incremento.
    - Quaisquer arquivos sinalizados para acompanhamento manual.
    - Mensagem de commit sugerida (ex.: `docs: altera constituição para vX.Y.Z (adições de princípios + atualização de governança)`).

Requisitos de Formatação e Estilo:

- Use os títulos Markdown exatamente como no modelo (não rebaixe/promova níveis).
- Quebre as linhas longas de justificativa para manter a legibilidade (<100 caracteres idealmente), mas não force com quebras estranhas.
- Mantenha uma única linha em branco entre as seções.
- Evite espaços em branco no final da linha.

Se o usuário fornecer atualizações parciais (ex.: apenas a revisão de um princípio), ainda execute as etapas de validação e decisão de versão.

Se informações críticas estiverem faltando (ex.: data de ratificação verdadeiramente desconhecida), insira `TODO(<NOME_DO_CAMPO>): explicação` e inclua no Relatório de Impacto de Sincronização em itens adiados.

Não crie um novo modelo; sempre opere no arquivo existente `.specify/memory/constitution.md`.
