---
description: Executa o fluxo de trabalho de planejamento de implementação usando o modelo de plano para gerar artefatos de design.
---

A entrada do usuário para você pode ser fornecida diretamente pelo agente ou como um argumento de comando - você **DEVE** considerá-la antes de prosseguir com o prompt (se não estiver vazia).

Entrada do usuário:

$ARGUMENTS

Dados os detalhes de implementação fornecidos como argumento, faça o seguinte:

1. Execute `.specify/scripts/bash/setup-plan.sh --json` da raiz do repositório e analise o JSON para FEATURE_SPEC, IMPL_PLAN, SPECS_DIR, BRANCH. Todos os caminhos de arquivo futuros devem ser absolutos.
    - ANTES de prosseguir, inspecione FEATURE_SPEC em busca de uma seção `## Esclarecimentos` com pelo menos um subtítulo de `Sessão`. Se estiver ausente ou áreas claramente ambíguas permanecerem (adjetivos vagos, escolhas críticas não resolvidas), PARE e instrua o usuário a executar `/clarify` primeiro para reduzir o retrabalho. Continue apenas se: (a) Esclarecimentos existirem OU (b) uma substituição explícita do usuário for fornecida (por exemplo, "prosseguir sem esclarecimento"). Não tente fabricar esclarecimentos por conta própria.
2. Leia e analise a especificação do recurso para entender:
    - Os requisitos do recurso e as histórias de usuário
    - Requisitos funcionais e não funcionais
    - Critérios de sucesso e critérios de aceitação
    - Quaisquer restrições ou dependências técnicas mencionadas

3. Leia a constituição em `.specify/memory/constitution.md` para entender os requisitos constitucionais.

4. Execute o modelo de plano de implementação:
    - Carregue `.specify/templates/plan-template.md` (já copiado para o caminho IMPL_PLAN)
    - Defina o caminho de entrada como FEATURE_SPEC
    - Execute as etapas 1-9 da função Fluxo de Execução (principal)
    - O modelo é autocontido e executável
    - Siga o tratamento de erros e as verificações de portão conforme especificado
    - Deixe o modelo guiar a geração de artefatos em $SPECS_DIR:
        - A Fase 0 gera research.md
        - A Fase 1 gera data-model.md, contracts/, quickstart.md
        - A Fase 2 gera tasks.md
    - Incorpore os detalhes fornecidos pelo usuário dos argumentos no Contexto Técnico: $ARGUMENTS
    - Atualize o Acompanhamento do Progresso ao concluir cada fase

5. Verifique a conclusão da execução:
    - Verifique se o Acompanhamento do Progresso mostra todas as fases concluídas
    - Garanta que todos os artefatos necessários foram gerados
    - Confirme que não há estados de ERRO na execução

6. Relate os resultados com o nome do branch, caminhos de arquivo e artefatos gerados.

Use caminhos absolutos com a raiz do repositório para todas as operações de arquivo para evitar problemas de caminho.
