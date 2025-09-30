# Especificação de Feature: [NOME DA FEATURE]

**Branch da Feature**: `[###-feature-name]`
**Criado em**: [DATA]
**Status**: Rascunho
**Entrada**: Descrição do usuário: "$ARGUMENTOS"

## Fluxo de Execução (main)

```
1. Analisar descrição do usuário da Entrada
   → Se vazia: ERRO "Nenhuma descrição da feature fornecida"
2. Extrair conceitos chave da descrição
   → Identificar: atores, ações, dados, restrições
3. Para cada aspecto não claro:
   → Marcar com [PRECISA DE ESCLARECIMENTO: pergunta específica]
4. Preencher a seção Cenários de Usuário & Testes
   → Se não houver um fluxo de usuário claro: ERRO "Não é possível determinar os cenários de usuário"
5. Gerar Requisitos Funcionais
   → Cada requisito deve ser testável
   → Marcar requisitos ambíguos
6. Identificar Entidades Chave (se envolver dados)
7. Executar Checklist de Revisão
   → Se houver algum [PRECISA DE ESCLARECIMENTO]: AVISO "A especificação tem incertezas"
   → Se detalhes de implementação forem encontrados: ERRO "Remova os detalhes técnicos"
8. Retornar: SUCESSO (especificação pronta para o planejamento)
```

---

## ⚡ Diretrizes Rápidas

- ✅ Foco no QUE os usuários precisam e PORQUÊ
- ❌ Evitar o COMO implementar (sem pilha de tecnologia, APIs, estrutura de código)
- 👥 Escrito para stakeholders de negócio, não para desenvolvedores

### Requisitos da Seção

- **Seções obrigatórias**: Devem ser completadas para cada feature
- **Seções opcionais**: Incluir apenas quando relevante para a feature
- Quando uma seção não se aplica, remova-a completamente (não deixe como "N/A")

### Para Geração por IA

Ao criar esta especificação a partir de um prompt do usuário:

1.  **Marque todas as ambiguidades**: Use [PRECISA DE ESCLARECIMENTO: pergunta específica] para qualquer suposição que você precise fazer
2.  **Não adivinhe**: Se o prompt não especificar algo (ex: "sistema de login" sem método de autenticação), marque-o
3.  **Pense como um testador**: Todo requisito vago deve falhar no item da checklist "testável e inequívoco"
4.  **Áreas comuns subespecificadas**:
    - Tipos de usuário e permissões
    - Políticas de retenção/exclusão de dados
    - Metas de desempenho e escala
    - Comportamentos de tratamento de erros
    - Requisitos de integração
    - Necessidades de segurança/conformidade

---

## Cenários de Usuário & Testes _(obrigatório)_

### História de Usuário Principal

[Descreva a jornada principal do usuário em linguagem simples]

### Cenários de Aceitação

1.  **Dado** [estado inicial], **Quando** [ação], **Então** [resultado esperado]
2.  **Dado** [estado inicial], **Quando** [ação], **Então** [resultado esperado]

### Casos Extremos

- O que acontece quando [condição de limite]?
- Como o sistema lida com [cenário de erro]?

## Requisitos _(obrigatório)_

### Requisitos Funcionais

- **RF-001**: O sistema DEVE [capacidade específica, ex: "permitir que usuários criem contas"]
- **RF-002**: O sistema DEVE [capacidade específica, ex: "validar endereços de e-mail"]
- **RF-003**: Os usuários DEVEM poder [interação chave, ex: "redefinir sua senha"]
- **RF-004**: O sistema DEVE [requisito de dados, ex: "persistir as preferências do usuário"]
- **RF-005**: O sistema DEVE [comportamento, ex: "registrar todos os eventos de segurança"]

_Exemplo de marcação de requisitos não claros:_

- **RF-006**: O sistema DEVE autenticar usuários via [PRECISA DE ESCLARECIMENTO: método de autenticação não especificado - e-mail/senha, SSO, OAuth?]
- **RF-007**: O sistema DEVE reter os dados do usuário por [PRECISA DE ESCLARECIMENTO: período de retenção não especificado]

### Entidades Chave _(incluir se a feature envolver dados)_

- **[Entidade 1]**: [O que representa, atributos chave sem implementação]
- **[Entidade 2]**: [O que representa, relacionamentos com outras entidades]

---

## Checklist de Revisão e Aceitação

_GATE: Verificações automatizadas executadas durante a execução do main()_

### Qualidade do Conteúdo

- [ ] Sem detalhes de implementação (linguagens, frameworks, APIs)
- [ ] Focado no valor para o usuário e nas necessidades de negócio
- [ ] Escrito para stakeholders não técnicos
- [ ] Todas as seções obrigatórias preenchidas

### Completude dos Requisitos

- [ ] Nenhum marcador [PRECISA DE ESCLARECIMENTO] permanece
- [ ] Requisitos são testáveis e inequívocos
- [ ] Critérios de sucesso são mensuráveis
- [ ] Escopo está claramente delimitado
- [ ] Dependências e premissas identificadas

---

## Status da Execução

_Atualizado por main() durante o processamento_

- [ ] Descrição do usuário analisada
- [ ] Conceitos chave extraídos
- [ ] Ambigüidades marcadas
- [ ] Cenários de usuário definidos
- [ ] Requisitos gerados
- [ ] Entidades identificadas
- [ ] Checklist de revisão aprovado

---
