---
description: Identifica áreas subespecificadas na especificação do recurso atual fazendo até 5 perguntas de esclarecimento altamente direcionadas e codificando as respostas de volta na especificação.
---

A entrada do usuário para você pode ser fornecida diretamente pelo agente ou como um argumento de comando - você **DEVE** considerá-la antes de prosseguir com o prompt (se não estiver vazia).

Entrada do usuário:

$ARGUMENTS

Objetivo: Detectar e reduzir a ambiguidade ou pontos de decisão ausentes na especificação do recurso ativo e registrar os esclarecimentos diretamente no arquivo de especificação.

Nota: Este fluxo de trabalho de esclarecimento deve ser executado (e concluído) ANTES de invocar `/plan`. Se o usuário declarar explicitamente que está pulando o esclarecimento (por exemplo, um pico exploratório), você pode prosseguir, mas deve avisar que o risco de retrabalho a jusante aumenta.

Passos de execução:

1. Execute `.specify/scripts/bash/check-prerequisites.sh --json --paths-only` da raiz do repositório **uma vez** (modo combinado `--json --paths-only` / `-Json -PathsOnly`). Analise os campos mínimos do payload JSON:
    - `FEATURE_DIR`
    - `FEATURE_SPEC`
    - (Opcionalmente capture `IMPL_PLAN`, `TASKS` para futuros fluxos encadeados.)
    - Se a análise do JSON falhar, aborte e instrua o usuário a executar novamente `/specify` ou verificar o ambiente do branch do recurso.

2. Carregue o arquivo de especificação atual. Realize uma varredura estruturada de ambiguidade e cobertura usando esta taxonomia. Para cada categoria, marque o status: Claro / Parcial / Ausente. Produza um mapa de cobertura interno usado para priorização (não produza o mapa bruto, a menos que nenhuma pergunta seja feita).

    Escopo Funcional e Comportamento:
    - Objetivos principais do usuário e critérios de sucesso
    - Declarações explícitas de fora do escopo
    - Diferenciação de papéis/personas de usuário

    Domínio e Modelo de Dados:
    - Entidades, atributos, relacionamentos
    - Regras de identidade e unicidade
    - Transições de ciclo de vida/estado
    - Suposições de volume/escala de dados

    Fluxo de Interação e UX:
    - Jornadas/sequências críticas do usuário
    - Estados de erro/vazio/carregamento
    - Notas de acessibilidade ou localização

    Atributos de Qualidade Não Funcionais:
    - Desempenho (metas de latência, taxa de transferência)
    - Escalabilidade (horizontal/vertical, limites)
    - Confiabilidade e disponibilidade (tempo de atividade, expectativas de recuperação)
    - Observabilidade (sinais de logging, métricas, rastreamento)
    - Segurança e privacidade (authN/Z, proteção de dados, suposições de ameaças)
    - Restrições de conformidade/regulatórias (se houver)

    Integração e Dependências Externas:
    - Serviços/APIs externos e modos de falha
    - Formatos de importação/exportação de dados
    - Suposições de protocolo/versionamento

    Casos Especiais e Tratamento de Falhas:
    - Cenários negativos
    - Limitação de taxa/throttling
    - Resolução de conflitos (por exemplo, edições concorrentes)

    Restrições e Tradeoffs:
    - Restrições técnicas (linguagem, armazenamento, hospedagem)
    - Tradeoffs explícitos ou alternativas rejeitadas

    Terminologia e Consistência:
    - Termos canônicos do glossário
    - Sinônimos evitados/termos obsoletos

    Sinais de Conclusão:
    - Testabilidade dos critérios de aceitação
    - Indicadores mensuráveis no estilo Definição de Pronto

    Diversos / Placeholders:
    - Marcadores TODO / decisões não resolvidas
    - Adjetivos ambíguos ("robusto", "intuitivo") sem quantificação

    Para cada categoria com status Parcial ou Ausente, adicione uma oportunidade de pergunta candidata, a menos que:
    - O esclarecimento não alteraria materialmente a estratégia de implementação ou validação
    - A informação é melhor adiada para a fase de planejamento (anote internamente)

3. Gere (internamente) uma fila priorizada de perguntas de esclarecimento candidatas (máximo de 5). NÃO as apresente todas de uma vez. Aplique estas restrições:
    - Máximo de 5 perguntas no total em toda a sessão.
    - Cada pergunta deve ser respondível com:
        - Uma seleção curta de múltipla escolha (2–5 opções distintas e mutuamente exclusivas), OU
        - Uma resposta de uma palavra/frase curta (restrinja explicitamente: "Responda em <=5 palavras").
    - Inclua apenas perguntas cujas respostas impactam materialmente a arquitetura, modelagem de dados, decomposição de tarefas, design de testes, comportamento de UX, prontidão operacional ou validação de conformidade.
    - Garanta o equilíbrio da cobertura de categorias: tente cobrir primeiro as categorias não resolvidas de maior impacto; evite fazer duas perguntas de baixo impacto quando uma única área de alto impacto (por exemplo, postura de segurança) não está resolvida.
    - Exclua perguntas já respondidas, preferências estilísticas triviais ou detalhes de execução no nível do plano (a menos que bloqueiem a correção).
    - Dê preferência a esclarecimentos que reduzam o risco de retrabalho a jusante ou evitem testes de aceitação desalinhados.
    - Se mais de 5 categorias permanecerem não resolvidas, selecione as 5 principais pela heurística (Impacto \* Incerteza).

4. Loop de questionamento sequencial (interativo):
    - Apresente EXATAMENTE UMA pergunta de cada vez.
    - Para perguntas de múltipla escolha, renderize as opções como uma tabela Markdown:

        | Opção | Descrição                                           |
        | ----- | --------------------------------------------------- | ------------------------------------------------------------------ |
        | A     | <Descrição da opção A>                              |
        | B     | <Descrição da opção B>                              |
        | C     | <Descrição da opção C>                              | (adicione D/E conforme necessário até 5)                           |
        | Curta | Forneça uma resposta curta diferente (<=5 palavras) | (Inclua apenas se uma alternativa de formato livre for apropriada) |

    - Para o estilo de resposta curta (sem opções discretas significativas), escreva uma única linha após a pergunta: `Formato: Resposta curta (<=5 palavras)`.
    - Após o usuário responder:
        - Valide se a resposta corresponde a uma opção ou se encaixa na restrição de <=5 palavras.
        - Se for ambígua, peça um rápido desambiguamento (a contagem ainda pertence à mesma pergunta; não avance).
        - Uma vez satisfatória, registre-a na memória de trabalho (ainda não escreva no disco) e passe para a próxima pergunta na fila.
    - Pare de fazer mais perguntas quando:
        - Todas as ambiguidades críticas forem resolvidas antecipadamente (itens restantes na fila se tornam desnecessários), OU
        - O usuário sinalizar a conclusão ("pronto", "bom", "chega"), OU
        - Você atingir 5 perguntas feitas.
    - Nunca revele perguntas futuras na fila com antecedência.
    - Se não existirem perguntas válidas no início, relate imediatamente que não há ambiguidades críticas.

5. Integração após CADA resposta aceita (abordagem de atualização incremental):
    - Mantenha na memória a representação da especificação (carregada uma vez no início) mais o conteúdo bruto do arquivo.
    - Para a primeira resposta integrada nesta sessão:
        - Garanta que exista uma seção `## Esclarecimentos` (crie-a logo após a seção contextual/de visão geral de mais alto nível, conforme o modelo de especificação, se estiver ausente).
        - Abaixo dela, crie (se não estiver presente) um subtítulo `### Sessão AAAA-MM-DD` para hoje.
    - Anexe uma linha de marcador imediatamente após a aceitação: `- P: <pergunta> → R: <resposta final>`.
    - Em seguida, aplique imediatamente o esclarecimento à(s) seção(ões) mais apropriada(s):
        - Ambiguidade funcional → Atualize ou adicione um marcador em Requisitos Funcionais.
        - Interação do usuário / distinção de ator → Atualize as Histórias de Usuário ou a subseção de Atores (se presente) com o papel, restrição ou cenário esclarecido.
        - Forma de dados / entidades → Atualize o Modelo de Dados (adicione campos, tipos, relacionamentos) preservando a ordem; anote as restrições adicionadas sucintamente.
        - Restrição não funcional → Adicione/modifique critérios mensuráveis na seção de Atributos Não Funcionais / de Qualidade (converta adjetivo vago em métrica ou meta explícita).
        - Caso especial / fluxo negativo → Adicione um novo marcador em Casos Especiais / Tratamento de Erros (ou crie essa subseção se o modelo fornecer um placeholder para ela).
        - Conflito de terminologia → Normalize o termo em toda a especificação; retenha o original apenas se necessário, adicionando `(anteriormente referido como "X")` uma vez.
    - Se o esclarecimento invalidar uma declaração ambígua anterior, substitua essa declaração em vez de duplicar; não deixe texto obsoleto contraditório.
    - Salve o arquivo de especificação APÓS cada integração para minimizar o risco de perda de contexto (sobrescrita atômica).
    - Preserve a formatação: não reordene seções não relacionadas; mantenha a hierarquia de títulos intacta.
    - Mantenha cada esclarecimento inserido mínimo e testável (evite desvios narrativos).

6. Validação (realizada após CADA escrita mais uma passagem final):
    - A sessão de esclarecimentos contém exatamente um marcador por resposta aceita (sem duplicatas).
    - Total de perguntas feitas (aceitas) ≤ 5.
    - As seções atualizadas não contêm placeholders vagos remanescentes que a nova resposta deveria resolver.
    - Nenhuma declaração contraditória anterior permanece (verifique se as alternativas agora inválidas foram removidas).
    - Estrutura Markdown válida; apenas novos títulos permitidos: `## Esclarecimentos`, `### Sessão AAAA-MM-DD`.
    - Consistência da terminologia: o mesmo termo canônico usado em todas as seções atualizadas.

7. Escreva a especificação atualizada de volta em `FEATURE_SPEC`.

8. Relate a conclusão (após o término do loop de questionamento ou término antecipado):
    - Número de perguntas feitas e respondidas.
    - Caminho para a especificação atualizada.
    - Seções alteradas (liste os nomes).
    - Tabela de resumo de cobertura listando cada categoria da taxonomia com Status: Resolvido (era Parcial/Ausente e foi abordado), Adiado (excede a cota de perguntas ou é mais adequado para o planejamento), Claro (já suficiente), Pendente (ainda Parcial/Ausente, mas de baixo impacto).
    - Se algum Pendente ou Adiado permanecer, recomende se deve prosseguir para `/plan` ou executar `/clarify` novamente mais tarde, após o plano.
    - Próximo comando sugerido.

Regras de comportamento:

- Se nenhuma ambiguidade significativa for encontrada (ou todas as perguntas potenciais forem de baixo impacto), responda: "Nenhuma ambiguidade crítica detectada que justifique um esclarecimento formal." e sugira prosseguir.
- Se o arquivo de especificação estiver ausente, instrua o usuário a executar `/specify` primeiro (não crie uma nova especificação aqui).
- Nunca exceda 5 perguntas no total (tentativas de esclarecimento para uma única pergunta não contam como novas perguntas).
- Evite perguntas especulativas sobre a pilha de tecnologia, a menos que a ausência bloqueie a clareza funcional.
- Respeite os sinais de término antecipado do usuário ("pare", "pronto", "prossiga").
- Se nenhuma pergunta for feita devido à cobertura total, apresente um resumo compacto da cobertura (todas as categorias Claras) e sugira avançar.
- Se a cota for atingida com categorias de alto impacto não resolvidas restantes, sinalize-as explicitamente em Adiado com uma justificativa.

Contexto para priorização: $ARGUMENTS
