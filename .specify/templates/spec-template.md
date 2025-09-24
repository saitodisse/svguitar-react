# Especificação da Feature: [FEATURE NAME]

**Branch da Feature**: `[###-feature-name]`  
**Criada em**: [DATE]  
**Status**: Rascunho  
**Entrada**: Descrição do usuário: "$ARGUMENTS"

## Fluxo de Execução (principal)

```
1. Interpretar a descrição do usuário a partir da Entrada
   → Se vazia: ERRO "Nenhuma descrição de feature fornecida"
2. Extrair conceitos-chave da descrição
   → Identificar: atores, ações, dados, restrições
3. Para cada aspecto não claro:
   → Marcar com [NEEDS CLARIFICATION: pergunta específica]
4. Preencher a seção de Cenários do Usuário & Testes
   → Se não houver fluxo claro do usuário: ERRO "Não é possível determinar os cenários do usuário"
5. Gerar Requisitos Funcionais
   → Cada requisito deve ser testável
   → Marcar requisitos ambíguos
6. Identificar Entidades-Chave (se envolver dados)
7. Executar o Checklist de Revisão
   → Se houver [NEEDS CLARIFICATION]: AVISO "A spec tem incertezas"
   → Se houver detalhes de implementação: ERRO "Remova detalhes técnicos"
8. Retorno: SUCESSO (spec pronta para planejamento)
```

---

## ⚡ Diretrizes Rápidas

- ✅ Foque no QUE os usuários precisam e POR QUÊ
- ❌ Evite o COMO implementar (sem stack, APIs, estrutura de código)
- 👥 Escrito para stakeholders de negócio, não para desenvolvedores

### Requisitos das Seções

- **Seções obrigatórias**: Devem ser concluídas para toda feature
- **Seções opcionais**: Incluir apenas quando relevante
- Quando uma seção não se aplica, remova totalmente (não deixe como "N/A")

### Para Geração por IA

Ao criar esta spec a partir de um prompt do usuário:

1. **Marque todas as ambiguidades**: Use [NEEDS CLARIFICATION: pergunta específica] para qualquer suposição necessária
2. **Não presuma**: Se o prompt não especifica algo (ex.: "sistema de login" sem método de auth), marque
3. **Pense como um testador**: Todo requisito vago deve reprovar no item "testável e não ambíguo"
4. **Áreas comumente subespecificadas**:
    - Tipos de usuários e permissões
    - Políticas de retenção/remoção de dados
    - Metas de performance e escala
    - Comportamentos de tratamento de erro
    - Requisitos de integração
    - Necessidades de segurança/compliance

---

## Cenários do Usuário & Testes _(obrigatório)_

### User Story Primária

[Descreva a jornada principal do usuário em linguagem simples]

### Cenários de Aceitação

1. **Dado** [estado inicial], **Quando** [ação], **Então** [resultado esperado]
2. **Dado** [estado inicial], **Quando** [ação], **Então** [resultado esperado]

### Casos Limite

- O que acontece quando [condição de fronteira]?
- Como o sistema lida com [cenário de erro]?

## Requisitos _(obrigatório)_

### Requisitos Funcionais

- **FR-001**: O sistema DEVE [capacidade específica, ex.: "permitir criar contas"]
- **FR-002**: O sistema DEVE [capacidade específica, ex.: "validar e-mails"]
- **FR-003**: Usuários DEVEM conseguir [interação-chave, ex.: "redefinir senha"]
- **FR-004**: O sistema DEVE [requisito de dados, ex.: "persistir preferências"]
- **FR-005**: O sistema DEVE [comportamento, ex.: "logar todos eventos de segurança"]

_Exemplo de marcação de requisitos não claros:_

- **FR-006**: O sistema DEVE autenticar via [NEEDS CLARIFICATION: método de auth não especificado - e-mail/senha, SSO, OAuth?]
- **FR-007**: O sistema DEVE reter dados por [NEEDS CLARIFICATION: período de retenção não especificado]

### Entidades-Chave _(incluir se a feature envolver dados)_

- **[Entidade 1]**: [O que representa, atributos-chave sem implementação]
- **[Entidade 2]**: [O que representa, relacionamentos]

---

## Checklist de Revisão & Aceite

_GATE: Checagens automáticas executadas durante main()_

### Qualidade do Conteúdo

- [ ] Sem detalhes de implementação (linguagens, frameworks, APIs)
- [ ] Foco no valor ao usuário e necessidades de negócio
- [ ] Escrito para stakeholders não técnicos
- [ ] Todas as seções obrigatórias concluídas

### Integralidade dos Requisitos

- [ ] Nenhum marcador [NEEDS CLARIFICATION] remanescente
- [ ] Requisitos testáveis e não ambíguos
- [ ] Critérios de sucesso mensuráveis
- [ ] Escopo claramente delimitado
- [ ] Dependências e premissas identificadas

---

## Status de Execução

_Atualizado por main() durante o processamento_

- [ ] Descrição do usuário interpretada
- [ ] Conceitos-chave extraídos
- [ ] Ambiguidades marcadas
- [ ] Cenários do usuário definidos
- [ ] Requisitos gerados
- [ ] Entidades identificadas
- [ ] Checklist de revisão aprovado

---
