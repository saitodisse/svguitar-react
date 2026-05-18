---
name: specs-audit
description: Audita especificações do svguitar-react em specs/001-guitar-svg antes de implementar ou refatorar. Use quando for mudança relevante na biblioteca ChordDiagram, novos requisitos, revisão de plan.md/tasks.md ou quando o usuário pedir alinhamento com as specs.
---

# Auditoria de especificações — svguitar-react

Execute **antes** de mudanças de código relevantes na biblioteca ou no comportamento documentado.

## Arquivos a ler

1. `specs/001-guitar-svg/spec.md`
2. `specs/001-guitar-svg/plan.md`
3. `specs/001-guitar-svg/tasks.md`
4. `specs/001-guitar-svg/research.md`
5. `specs/001-guitar-svg/data-model.md` (se tipos ou modelo mudarem)
6. `specs/001-guitar-svg/contracts/` (se API/contratos mudarem)

## Plano de implementação

- Há sequência óbvia de tarefas ou over-engineering?
- Dependências entre tarefas estão na ordem certa?
- Alguma tarefa pode ser simplificada ou adiada?

## Checklist de aceite (marcar na resposta)

**Qualidade do conteúdo**

- [ ] Sem detalhes de implementação desnecessários para stakeholders
- [ ] Foco em valor ao usuário
- [ ] Linguagem acessível onde a spec for de produto
- [ ] Seções obrigatórias presentes

**Integralidade**

- [ ] Sem `[NEEDS CLARIFICATION]`
- [ ] Requisitos testáveis e não ambíguos
- [ ] Critérios de sucesso mensuráveis
- [ ] Escopo delimitado
- [ ] Dependências e premissas identificadas

## Saída esperada

Resumo curto em português:

1. Escopo da mudança vs spec
2. Riscos ou lacunas encontradas
3. Ordem sugerida de implementação
4. Itens do checklist que **não** atendem (se houver)

Se a spec não cobrir o pedido do usuário, **pare** e proponha atualizar a spec antes de codar.
