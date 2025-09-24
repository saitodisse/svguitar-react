## description: Executar o fluxo de planejamento de implementação usando o template de plano para gerar artefatos de design.

Dadas as informações de implementação fornecidas como argumento, faça o seguinte:

1. Execute `.specify/scripts/bash/setup-plan.sh --json` a partir da raiz do repositório e analise o JSON para obter FEATURE_SPEC, IMPL_PLAN, SPECS_DIR, BRANCH. Todos os caminhos de arquivos futuros devem ser absolutos.
2. Leia e analise a especificação da feature para entender:

   - Os requisitos da feature e as user stories
   - Requisitos funcionais e não funcionais
   - Critérios de sucesso e critérios de aceitação
   - Quaisquer restrições técnicas ou dependências mencionadas

3. Leia a constituição em `.specify/memory/constitution.md` para entender os requisitos constitucionais.

4. Execute o template de plano de implementação:

   - Carregue `.specify/templates/plan-template.md` (já copiado para o caminho IMPL_PLAN)
   - Defina o caminho de Input para FEATURE_SPEC
   - Rode os passos 1-10 da função Execution Flow (main)
   - O template é autocontido e executável
   - Siga o tratamento de erros e os gates de verificação conforme especificado
   - Deixe o template guiar a geração de artefatos em $SPECS_DIR:
     - Fase 0 gera research.md
     - Fase 1 gera data-model.md, contracts/, quickstart.md
     - Fase 2 gera tasks.md
   - Incorpore detalhes fornecidos pelo usuário a partir dos argumentos no Technical Context: $ARGUMENTS
   - Atualize o Progress Tracking conforme concluir cada fase

5. Verifique se a execução foi concluída:

   - Cheque se o Progress Tracking mostra todas as fases concluídas
   - Garanta que todos os artefatos exigidos foram gerados
   - Confirme que não há estados de ERRO durante a execução

6. Relate os resultados com o nome da branch, caminhos dos arquivos e artefatos gerados.

Use caminhos absolutos com a raiz do repositório para todas as operações de arquivo a fim de evitar problemas de path.
