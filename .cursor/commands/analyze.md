---
description: Realiza uma análise não destrutiva de consistência e qualidade entre artefatos (spec.md, plan.md, e tasks.md) após a geração de tarefas.
---

A entrada do usuário para você pode ser fornecida diretamente pelo agente ou como um argumento de comando - você **DEVE** considerá-la antes de prosseguir com o prompt (se não estiver vazia).

Entrada do usuário:

$ARGUMENTS

Objetivo: Identificar inconsistências, duplicações, ambiguidades e itens subespecificados nos três artefatos principais (`spec.md`, `plan.md`, `tasks.md`) antes da implementação. Este comando DEVE ser executado somente após `/tasks` ter produzido com sucesso um `tasks.md` completo.

ESTRITAMENTE SOMENTE LEITURA: **Não** modifique nenhum arquivo. Gere um relatório de análise estruturado. Ofereça um plano de remediação opcional (o usuário deve aprovar explicitamente antes que quaisquer comandos de edição de acompanhamento sejam invocados manualmente).

Autoridade da Constituição: A constituição do projeto (`.specify/memory/constitution.md`) é **não negociável** dentro deste escopo de análise. Conflitos com a constituição são automaticamente CRÍTICOS e exigem ajuste da especificação, plano ou tarefas — não diluição, reinterpretação ou ignorância silenciosa do princípio. Se um princípio em si precisar mudar, isso deve ocorrer em uma atualização de constituição separada e explícita fora de `/analyze`.

Passos de execução:

1. Execute `.specify/scripts/bash/check-prerequisites.sh --json --require-tasks --include-tasks` uma vez da raiz do repositório e analise o JSON para FEATURE_DIR e AVAILABLE_DOCS. Derive os caminhos absolutos:
    - SPEC = FEATURE_DIR/spec.md
    - PLAN = FEATURE_DIR/plan.md
    - TASKS = FEATURE_DIR/tasks.md
      Aborte com uma mensagem de erro se algum arquivo necessário estiver faltando (instrua o usuário a executar o comando de pré-requisito ausente).

2. Carregue os artefatos:
    - Analise as seções do spec.md: Visão Geral/Contexto, Requisitos Funcionais, Requisitos Não Funcionais, Histórias de Usuário, Casos Especiais (se presentes).
    - Analise o plan.md: Escolhas de arquitetura/stack, referências ao Modelo de Dados, Fases, restrições técnicas.
    - Analise o tasks.md: IDs de tarefas, descrições, agrupamento por fase, marcadores de paralelismo [P], caminhos de arquivo referenciados.
    - Carregue a constituição `.specify/memory/constitution.md` para validação dos princípios.

3. Construa modelos semânticos internos:
    - Inventário de requisitos: Cada requisito funcional + não funcional com uma chave estável (derive um slug com base na frase imperativa; ex.: "Usuário pode enviar arquivo" -> `usuario-pode-enviar-arquivo`).
    - Inventário de histórias/ações de usuário.
    - Mapeamento de cobertura de tarefas: Mapeie cada tarefa para um ou mais requisitos ou histórias (inferência por palavra-chave / padrões de referência explícitos como IDs ou frases-chave).
    - Conjunto de regras da constituição: Extraia nomes de princípios e quaisquer declarações normativas DEVE/PODE.

4. Passos de detecção:
   A. Detecção de duplicação:
    - Identifique requisitos quase duplicados. Marque a formulação de menor qualidade para consolidação.
      B. Detecção de ambiguidade:
    - Sinalize adjetivos vagos (rápido, escalável, seguro, intuitivo, robusto) sem critérios mensuráveis.
    - Sinalize marcadores não resolvidos (TODO, TKTK, ???, <placeholder>, etc.).
      C. Subespecificação:
    - Requisitos com verbos, mas sem objeto ou resultado mensurável.
    - Histórias de usuário sem alinhamento com critérios de aceitação.
    - Tarefas que referenciam arquivos ou componentes não definidos na especificação/plano.
      D. Alinhamento com a Constituição:
    - Qualquer requisito ou elemento do plano que entre em conflito com um princípio DEVE.
    - Seções obrigatórias ou portões de qualidade da constituição ausentes.
      E. Lacunas de cobertura:
    - Requisitos com zero tarefas associadas.
    - Tarefas sem requisito/história mapeado.
    - Requisitos não funcionais não refletidos nas tarefas (ex.: desempenho, segurança).
      F. Inconsistência:
    - Variação de terminologia (mesmo conceito nomeado de forma diferente em arquivos).
    - Entidades de dados referenciadas no plano, mas ausentes na especificação (ou vice-versa).
    - Contradições na ordem das tarefas (ex.: tarefas de integração antes das tarefas de configuração fundamental sem nota de dependência).
    - Requisitos conflitantes (ex.: um exige o uso de Next.js enquanto outro diz para usar Vue como framework).

5. Heurística de atribuição de severidade:
    - CRÍTICO: Viola um DEVE da constituição, artefato de especificação principal ausente ou requisito com cobertura zero que bloqueia a funcionalidade básica.
    - ALTO: Requisito duplicado ou conflitante, atributo de segurança/desempenho ambíguo, critério de aceitação não testável.
    - MÉDIO: Variação de terminologia, cobertura de tarefa não funcional ausente, caso especial subespecificado.
    - BAIXO: Melhorias de estilo/redação, redundância menor que não afeta a ordem de execução.

6. Produza um relatório em Markdown (sem escrita em arquivos) com seções:

    ### Relatório de Análise da Especificação

    | ID  | Categoria  | Severidade | Localização(s)   | Resumo                       | Recomendação                              |
    | --- | ---------- | ---------- | ---------------- | ---------------------------- | ----------------------------------------- |
    | A1  | Duplicação | ALTA       | spec.md:L120-134 | Dois requisitos similares... | Mesclar redação; manter versão mais clara |

    (Adicione uma linha por achado; gere IDs estáveis prefixados pela inicial da categoria.)

    Subseções adicionais:
    - Tabela de Resumo de Cobertura:
      | Chave do Requisito | Tem Tarefa? | IDs das Tarefas | Notas |
    - Problemas de Alinhamento com a Constituição (se houver)
    - Tarefas Não Mapeadas (se houver)
    - Métricas:
        - Total de Requisitos
        - Total de Tarefas
        - % de Cobertura (requisitos com >=1 tarefa)
        - Contagem de Ambiguidade
        - Contagem de Duplicação
        - Contagem de Problemas Críticos

7. Ao final do relatório, apresente um bloco conciso de Próximas Ações:
    - Se existirem problemas CRÍTICOS: Recomende a resolução antes de `/implement`.
    - Se apenas BAIXO/MÉDIO: O usuário pode prosseguir, mas forneça sugestões de melhoria.
    - Forneça sugestões de comando explícitas: ex., "Execute /specify com refinamento", "Execute /plan para ajustar a arquitetura", "Edite manualmente tasks.md para adicionar cobertura para 'metricas-de-desempenho'".

8. Pergunte ao usuário: "Você gostaria que eu sugerisse edições de remediação concretas para os N principais problemas?" (NÃO as aplique automaticamente.)

Regras de comportamento:

- NUNCA modifique arquivos.
- NUNCA alucine seções ausentes — se ausentes, relate-as.
- MANTENHA os achados determinísticos: se reexecutado sem alterações, produza IDs e contagens consistentes.
- LIMITE o total de achados na tabela principal a 50; agregue o restante em uma nota de excedente resumida.
- Se nenhum problema for encontrado, emita um relatório de sucesso com estatísticas de cobertura e recomendação para prosseguir.

Contexto: $ARGUMENTS
