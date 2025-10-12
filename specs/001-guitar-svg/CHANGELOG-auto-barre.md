# Changelog: Auto Barre Feature

**Data**: 2025-10-12  
**Feature**: Detecção Automática de Barres (Pestanas)  
**Decisões**: Baseadas em perguntas via Visual Replies API

---

## 📋 Resumo da Feature

Implementação de detecção automática de barres (pestanas) para acordes que requerem mais de 4 dedos pressionados, tornando os diagramas mais realistas e úteis pedagogicamente.

### Decisões do Usuário

Baseadas nas respostas às perguntas estruturadas:

1. **Lógica de Detecção**:
    - ✅ Selecionada: "Barre no traste com maior número de dedos (mesmo não consecutivos)"
    - Justificativa: "vamos pela forma mais simples"

2. **Interação com Barres Manuais**:
    - ✅ Selecionada: "Auto barre desabilitado se houver qualquer barre manual"
    - Justificativa: "manual tem prescedencia"

3. **Nome da Propriedade**:
    - ✅ Selecionada: `autoBarreEnabled?: boolean (padrão: true)`

4. **Condição de Ativação**:
    - ✅ Selecionada: "Ativar se dedos com fret > 0 forem > 4"
    - Justificativa: "sim, pq temos no máximo quatro dedos disponíveis"

---

## 📝 Arquivos Modificados

### 1. `.cursor/commands/vr-ask.md`

**Alterações**:

- ✅ Adicionada seção **"⚠️ IMPORTANTE: Diferenças Entre Campos"**
- ✅ Documentada diferença entre `questionType` e `metadata.category`
- ✅ Adicionado aviso sobre erro comum: `"style"` vs `"styling"`
- ✅ Atualizada seção "Como os Campos Semânticos São Renderizados na UI"

**Motivo**: Evitar erro de validação que ocorreu durante as perguntas.

---

### 2. `specs/001-guitar-svg/spec.md`

**Novos Requisitos Funcionais**:

- **FR-034**: O sistema DEVE detectar automaticamente a necessidade de uma barre (pestana) quando houver mais de 4 dedos com fret > 0, posicionando a barre no traste que possui o maior número de dedos.

- **FR-035**: O sistema DEVE permitir ativar/desativar a detecção automática de barres através da prop `autoBarreEnabled` (boolean, padrão: true).

- **FR-036**: O sistema DEVE desabilitar a detecção automática de barres se houver qualquer barre definida manualmente via prop `barres` (barres manuais têm precedência sobre barres automáticas).

**Novo Cenário de Aceitação**:

10. **Dado** que especifico um acorde com mais de 4 dedos pressionados (fret > 0) e `autoBarreEnabled` está ativo (padrão), **Quando** não há barres manuais definidas, **Então** o componente detecta automaticamente o traste com maior número de dedos e adiciona uma barre nesse traste, cobrindo todas as cordas do primeiro ao último dedo naquele traste.

**Novos Casos Limite**:

- O que acontece com auto barre quando há exatamente 4 dedos pressionados? (Auto barre não é acionado; apenas quando há mais de 4 dedos com fret > 0)
- Como o auto barre interage com barres manuais? (Se houver qualquer barre manual definida, o auto barre é desabilitado completamente, mesmo que `autoBarreEnabled` seja true)
- O que acontece se `autoBarreEnabled` for false? (Nenhuma barre automática é adicionada, independentemente do número de dedos)

---

### 3. `specs/001-guitar-svg/data-model.md`

**Adições à Interface `ChordDiagramProps`**:

```typescript
// Auto barre detection
autoBarreEnabled?: boolean; // Habilita detecção automática de barres quando há mais de 4 dedos com fret > 0 (padrão: true). Desabilitado automaticamente se houver barres manuais definidas.
```

**Nova Seção 5: Algoritmo de Detecção Automática de Barres**:

- Condições de Ativação
- Lógica de Detecção (5 passos)
- Exemplo prático com código
- Casos Especiais (empate, dedos consecutivos, validação)

**Nova Seção 8: Valores Padrão - ChordDiagramProps Defaults**:

```typescript
const DEFAULT_PROPS: Partial<ChordDiagramProps> = {
	autoBarreEnabled: true, // Auto barre detection habilitado por padrão
	validation: "strict",
	invalidBehavior: "keep-previous",
	fallbackChord: "000000",
	view: "horizontal-right",
};
```

**Renumeração de Seções**:

- Seção 5 → Seção 7 (Conversão de Fret Notation)
- Seção 6 → Seção 8 (Valores Padrão)
- Seção 7 → Seção 9 (Tipos de Erro)

---

### 4. `specs/001-guitar-svg/research.md`

**Nova Decisão Técnica: Detecção Automática de Barres (Auto Barre)**

- **Decisão**: Implementar detecção automática usando heurística simples (traste com mais dedos)
- **Justificativa**:
    - Guitarristas têm apenas 4 dedos disponíveis
    - Mais de 4 dedos = fisicamente impossível sem pestana
    - Melhora UX sem exigir cálculo manual
    - Heurística simples = comportamento previsível
- **Configuração**: Habilitado por padrão, pode ser desabilitado, barres manuais têm precedência
- **Lógica**: Traste com maior número de dedos, desempate pelo menor número
- **Alternativas Consideradas e Rejeitadas**:
    - Barres consecutivas apenas (muito restritivo)
    - Múltiplas barres automáticas (complexidade desnecessária)
    - Sempre ativar com 2+ dedos consecutivos (muitos falsos positivos)

---

### 5. `specs/001-guitar-svg/tasks-auto-barre.md` _(NOVO ARQUIVO)_

Arquivo completo de tarefas para implementação da feature, incluindo:

- **Fase 3.1**: Configuração e Revisão (T001-T003)
- **Fase 3.2**: Testes Primeiro - TDD (T004-T008)
    - Testes de contrato
    - Testes unitários do algoritmo
    - Testes de integração
    - Testes de snapshot
- **Fase 3.3**: Implementação Principal (T009-T012)
    - Algoritmo core
    - Integração no componente
    - Casos especiais
- **Fase 3.4**: Documentação e Stories (T013-T014)
- **Fase 3.5**: Polimento e Validação (T015-T021)

**Total**: 21 tarefas organizadas e com dependências mapeadas

**Inclui**:

- Exemplos de código de testes esperados
- Algoritmo simplificado de implementação
- Critérios de aceite
- Estimativa: 4-6 horas

---

## 🎯 Próximos Passos

1. **Revisar especificações atualizadas**:
    - [x] `spec.md` - Requisitos FR-034, FR-035, FR-036
    - [x] `data-model.md` - Nova prop e algoritmo
    - [x] `research.md` - Justificativa técnica

2. **Iniciar implementação**:
    - [ ] Seguir `tasks-auto-barre.md` (21 tarefas)
    - [ ] Começar com TDD (testes primeiro)
    - [ ] Implementar algoritmo `detectAutoBarre`
    - [ ] Integrar no componente `ChordDiagram`

3. **Validação**:
    - [ ] Todos os testes passando
    - [ ] Cobertura ≥ 90%
    - [ ] Storybook com exemplos
    - [ ] Documentação atualizada

---

## 📊 Estatísticas

- **Arquivos novos**: 2 (`vr-ask.md` corrigido, `tasks-auto-barre.md` criado)
- **Arquivos modificados**: 3 (`spec.md`, `data-model.md`, `research.md`)
- **Requisitos adicionados**: 3 (FR-034, FR-035, FR-036)
- **Cenários de aceite adicionados**: 1
- **Casos limite adicionados**: 3
- **Tarefas de implementação**: 21

---

## 🔗 Referências

- **Visual Replies API**: `.cursor/commands/vr-ask.md`
- **Especificação Principal**: `specs/001-guitar-svg/spec.md`
- **Modelo de Dados**: `specs/001-guitar-svg/data-model.md`
- **Pesquisa Técnica**: `specs/001-guitar-svg/research.md`
- **Tarefas de Implementação**: `specs/001-guitar-svg/tasks-auto-barre.md`

---

## ✅ Status

- [x] Especificações atualizadas
- [x] Documentação técnica completa
- [x] Tarefas de implementação definidas
- [x] Código formatado
- [ ] Implementação (próxima etapa)
- [ ] Testes (próxima etapa)
- [ ] Documentação de usuário (próxima etapa)

---

**Nota**: Esta feature foi especificada de forma colaborativa usando Visual Replies API para garantir que as decisões de design refletem as necessidades e preferências do usuário.
