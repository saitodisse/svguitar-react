# Tarefas: Implementação de Detecção Automática de Barres

**Entrada**: Especificação em `/home/saito/_git/svguitar-react/specs/001-guitar-svg/spec.md` (FR-034, FR-035, FR-036)
**Pré-requisitos**: spec.md, data-model.md atualizados
**Objetivo**: Implementar detecção automática de barres (pestanas) com base no número e distribuição de dedos

---

## Contexto

Esta feature adiciona uma funcionalidade inteligente que detecta automaticamente quando uma barre (pestana) deve ser adicionada ao diagrama de acordes. Isso simplifica a definição de acordes complexos, pois o usuário não precisa especificar explicitamente a barre quando há muitos dedos no mesmo traste.

### Decisões Técnicas Principais

1. **Threshold**: Auto barre acionado quando > 4 dedos com `fret > 0`
2. **Desempate**: Em caso de empate, escolher traste mais baixo (menor número)
3. **Cobertura**: Barre cobre da primeira à última corda com dedo naquele traste
4. **Interação visual**: Dedos cobertos pela barre são removidos da renderização
5. **Precedência**: Barres manuais desabilitam completamente auto barre

---

## Fase 1: Preparação e Testes

### T001: Atualizar tipos TypeScript

**Prioridade**: Alta | **Tipo**: Atualização de Interface

- [ ] Adicionar prop `autoBarreEnabled?: boolean` em `ChordDiagramProps` (src/components/ChordDiagram/types.ts)
- [ ] Documentar JSDoc com comportamento padrão (true) e interação com barres manuais
- [ ] Atualizar exports em `src/index.ts` se necessário
- [ ] Verificar se tipos estão corretos com `pnpm tsc --noEmit`

**Critério de Aceite**: TypeScript compila sem erros e prop está documentada

---

### T002: Criar testes de detecção de auto barre

**Prioridade**: Alta | **Tipo**: TDD (Red phase)

Criar arquivo `src/components/ChordDiagram/__tests__/autoBarre.test.tsx` com os seguintes testes:

#### Testes de Condições de Ativação

- [ ] **Teste 1**: Não adiciona barre quando há 4 ou menos dedos pressionados

    ```typescript
    expect(detectAutoBarre([...4 fingers])).toBeNull();
    ```

- [ ] **Teste 2**: Adiciona barre quando há mais de 4 dedos pressionados

    ```typescript
    expect(detectAutoBarre([...5 fingers])).not.toBeNull();
    ```

- [ ] **Teste 3**: Ignora cordas soltas (fret = 0) na contagem

    ```typescript
    expect(detectAutoBarre([...3 pressed + 2 open])).toBeNull();
    ```

- [ ] **Teste 4**: Ignora cordas mutadas (is_muted = true) na contagem
    ```typescript
    expect(detectAutoBarre([...3 pressed + 2 muted])).toBeNull();
    ```

#### Testes de Seleção de Traste

- [ ] **Teste 5**: Escolhe traste com maior número de dedos

    ```typescript
    // Traste 3: 4 dedos, Traste 5: 2 dedos
    const result = detectAutoBarre(fingers);
    expect(result?.fret).toBe(3);
    ```

- [ ] **Teste 6**: Em caso de empate, escolhe traste mais baixo
    ```typescript
    // Traste 3: 3 dedos, Traste 5: 3 dedos
    const result = detectAutoBarre(fingers);
    expect(result?.fret).toBe(3);
    ```

#### Testes de Cobertura de Cordas

- [ ] **Teste 7**: Barre cobre primeira e última corda com dedo naquele traste

    ```typescript
    // Traste 3: dedos nas cordas 2, 4, 5
    const result = detectAutoBarre(fingers);
    expect(result?.fromString).toBe(2);
    expect(result?.toString).toBe(5);
    ```

- [ ] **Teste 8**: Barre não cobre cordas sem dedos além da primeira/última
    ```typescript
    // Traste 3: dedos nas cordas 1, 3, 6 (sem dedo na 2, 4, 5)
    const result = detectAutoBarre(fingers);
    expect(result?.fromString).toBe(1);
    expect(result?.toString).toBe(6); // ainda cobre 1-6
    ```

#### Testes de Remoção de Dedos

- [ ] **Teste 9**: Remove apenas dedos cobertos pela barre
    ```typescript
    const barre = { fret: 3, fromString: 1, toString: 5 };
    const filtered = removeFingersCoveredByBarre(fingers, barre);
    expect(filtered).not.toContainEqual({ fret: 3, string: 3, is_muted: false });
    expect(filtered).toContainEqual({ fret: 5, string: 6, is_muted: false });
    ```

#### Testes de Precedência

- [ ] **Teste 10**: Auto barre desabilitado quando `autoBarreEnabled = false`

    ```typescript
    const props = { autoBarreEnabled: false, chord: { fingers: [...6 fingers], barres: [] } };
    expect(shouldApplyAutoBarre(props)).toBe(false);
    ```

- [ ] **Teste 11**: Auto barre desabilitado quando há barres manuais
    ```typescript
    const props = { autoBarreEnabled: true, chord: { fingers: [...6 fingers], barres: [manualBarre] } };
    expect(shouldApplyAutoBarre(props)).toBe(false);
    ```

**Critério de Aceite**: Todos os testes criados e falhando (fase RED do TDD)

---

## Fase 2: Implementação

### T003: Implementar função `detectAutoBarre`

**Prioridade**: Alta | **Tipo**: Lógica de Negócio

Criar `src/components/ChordDiagram/utils/autoBarre.ts`:

```typescript
import { Barre, Finger } from "../types";

/**
 * Detecta automaticamente se uma barre deve ser adicionada com base nos dedos pressionados.
 *
 * Regras:
 * - Acionado quando há mais de 4 dedos com fret > 0 (ignorando soltas e mutadas)
 * - Escolhe traste com maior número de dedos
 * - Em caso de empate, escolhe traste mais baixo
 * - Barre cobre da primeira à última corda com dedo naquele traste
 *
 * @param fingers Array de dedos (Finger[])
 * @returns Barre detectada ou null se não aplicável
 */
export function detectAutoBarre(fingers: Finger[]): Barre | null {
	// Implementar conforme algoritmo em data-model.md seção 7
}
```

**Subtarefas**:

- [ ] Filtrar dedos pressionados (fret > 0, !is_muted)
- [ ] Verificar threshold (> 4 dedos)
- [ ] Agrupar dedos por traste
- [ ] Encontrar traste com mais dedos (desempate: menor número)
- [ ] Calcular fromString/toString (primeira/última corda)
- [ ] Retornar objeto Barre

**Critério de Aceite**: Testes T002 (testes 1-6, 7-8) passam

---

### T004: Implementar função `removeFingersCoveredByBarre`

**Prioridade**: Alta | **Tipo**: Lógica de Negócio

No mesmo arquivo `autoBarre.ts`:

```typescript
/**
 * Remove dedos que estão cobertos pela barre para evitar redundância visual.
 *
 * Um dedo é considerado "coberto" se:
 * - Está no mesmo traste da barre
 * - E sua corda está entre fromString e toString (inclusive)
 *
 * @param fingers Array original de dedos
 * @param barre Barre que cobre alguns dedos
 * @returns Array de dedos não cobertos
 */
export function removeFingersCoveredByBarre(fingers: Finger[], barre: Barre): Finger[] {
	// Implementar conforme algoritmo em data-model.md seção 7
}
```

**Critério de Aceite**: Teste T002 (teste 9) passa

---

### T005: Implementar função `shouldApplyAutoBarre`

**Prioridade**: Alta | **Tipo**: Lógica de Negócio

No mesmo arquivo `autoBarre.ts`:

```typescript
/**
 * Determina se auto barre deve ser aplicado com base nas props.
 *
 * Auto barre é aplicado se:
 * - autoBarreEnabled não é false (padrão: true)
 * - E não há barres manuais definidas
 *
 * @param props Props do componente ChordDiagram
 * @returns true se auto barre deve ser aplicado
 */
export function shouldApplyAutoBarre(props: ChordDiagramProps): boolean {
	// Implementar conforme algoritmo em data-model.md seção 7
}
```

**Critério de Aceite**: Testes T002 (testes 10-11) passam

---

### T006: Integrar auto barre no componente ChordDiagram

**Prioridade**: Alta | **Tipo**: Integração

Atualizar `src/components/ChordDiagram/ChordDiagram.tsx`:

**Subtarefas**:

- [ ] Importar funções de `./utils/autoBarre`
- [ ] Adicionar lógica antes da renderização:
    ```typescript
    // Detectar e aplicar auto barre se necessário
    let effectiveChord = { ...chord };
    if (shouldApplyAutoBarre(props)) {
    	const autoBarre = detectAutoBarre(chord.fingers);
    	if (autoBarre) {
    		effectiveChord = {
    			...chord,
    			barres: [...chord.barres, autoBarre],
    			fingers: removeFingersCoveredByBarre(chord.fingers, autoBarre),
    		};
    	}
    }
    ```
- [ ] Usar `effectiveChord` na renderização ao invés de `chord` diretamente

**Critério de Aceite**: Componente renderiza com barre automática quando aplicável

---

## Fase 3: Testes de Integração

### T007: Criar testes de snapshot

**Prioridade**: Média | **Tipo**: Teste de Regressão

Criar `src/components/ChordDiagram/__tests__/autoBarre.snapshot.test.tsx`:

- [ ] **Snapshot 1**: Acorde com 6 dedos no mesmo traste (com auto barre)
- [ ] **Snapshot 2**: Acorde com 4 dedos (sem auto barre)
- [ ] **Snapshot 3**: Acorde com auto barre desabilitado (`autoBarreEnabled: false`)
- [ ] **Snapshot 4**: Acorde com barre manual (auto barre não aplicado)
- [ ] **Snapshot 5**: Acorde com empate de dedos (barre no traste mais baixo)

**Critério de Aceite**: Snapshots criados e aprovados

---

### T008: Criar testes de renderização SVG

**Prioridade**: Média | **Tipo**: Teste Visual

Adicionar testes em `src/components/ChordDiagram/ChordDiagram.test.tsx`:

- [ ] Verificar que elemento `<rect>` da barre automática é renderizado
- [ ] Verificar que dedos cobertos NÃO são renderizados (sem `<circle>`)
- [ ] Verificar que dedos não cobertos AINDA são renderizados
- [ ] Verificar que barre manual previne barre automática

**Critério de Aceite**: Testes passam e validam renderização correta

---

## Fase 4: Documentação e Stories

### T009: Adicionar stories no Storybook

**Prioridade**: Média | **Tipo**: Documentação Visual

Atualizar `src/stories/ChordDiagram.stories.tsx`:

**Stories a adicionar**:

1. **AutoBarreEnabled** (padrão)

    ```typescript
    export const AutoBarreEnabled: Story = {
    	args: {
    		chord: {
    			fingers: [
    				{ fret: 3, string: 1, is_muted: false },
    				{ fret: 3, string: 2, is_muted: false },
    				{ fret: 3, string: 3, is_muted: false },
    				{ fret: 3, string: 4, is_muted: false },
    				{ fret: 3, string: 5, is_muted: false },
    				{ fret: 5, string: 6, is_muted: false },
    			],
    			barres: [],
    		},
    		autoBarreEnabled: true, // padrão
    	},
    };
    ```

2. **AutoBarreDisabled**

    ```typescript
    // Mesmo acorde, mas com autoBarreEnabled: false
    ```

3. **AutoBarreTiebreaker**

    ```typescript
    // Empate: 3 dedos no traste 3, 3 dedos no traste 5
    // Espera-se barre no traste 3
    ```

4. **ManualBarrePrecedence**
    ```typescript
    // 6 dedos + 1 barre manual
    // Espera-se apenas barre manual (sem auto barre)
    ```

- [ ] Adicionar controle interativo para `autoBarreEnabled` (toggle)
- [ ] Adicionar documentação em cada story explicando o comportamento

**Critério de Aceite**: Stories funcionam no Storybook e demonstram comportamento correto

---

### T010: Atualizar documentação

**Prioridade**: Baixa | **Tipo**: Documentação

- [ ] Atualizar `specs/001-guitar-svg/quickstart.md` com exemplos de auto barre
- [ ] Adicionar seção "Auto Barre Detection" no README do componente
- [ ] Documentar casos de uso comuns (quando usar/não usar)
- [ ] Adicionar exemplos de TypeScript com JSDoc

**Critério de Aceite**: Documentação clara e com exemplos práticos

---

## Fase 5: Validação e Polimento

### T011: Testar em diferentes cenários

**Prioridade**: Alta | **Tipo**: Teste Manual

Validar manualmente no Storybook:

- [ ] Acordes de barre comuns (F, Bm, C#m, etc.)
- [ ] Acordes com muitos dedos mas sem barre (dedos espalhados)
- [ ] Acordes em posições altas (5ª, 7ª, 10ª casa)
- [ ] Interação com todas as views (horizontal-right, horizontal-left, vertical-right, vertical-left)
- [ ] Performance com muitos dedos (10+ dedos)

**Critério de Aceite**: Comportamento esperado em todos os cenários

---

### T012: Executar linting e formatação

**Prioridade**: Alta | **Tipo**: Qualidade de Código

- [ ] Executar `pnpm lint` e corrigir warnings
- [ ] Executar `pnpm format` para formatar código
- [ ] Verificar cobertura de testes (idealmente > 90% para autoBarre.ts)
- [ ] Revisar código para simplificações e otimizações

**Critério de Aceite**: Código limpo, formatado e com boa cobertura

---

### T013: Atualizar CHANGELOG

**Prioridade**: Baixa | **Tipo**: Documentação

- [ ] Adicionar entrada no CHANGELOG.md:

    ```markdown
    ## [Unreleased]

    ### Added

    - Auto barre detection: Automatically adds barre when > 4 fingers on same fret
    - New prop `autoBarreEnabled` to control auto barre behavior (default: true)
    - Manual barres take precedence over auto barre
    ```

**Critério de Aceite**: CHANGELOG atualizado

---

## Dependências entre Tarefas

```
T001 (tipos) → T002 (testes)
               ↓
T002 → T003 → T004 → T005 → T006 (implementação)
                              ↓
                            T007 (snapshots)
                            T008 (SVG tests)
                              ↓
                            T009 (stories)
                            T010 (docs)
                              ↓
                            T011 (validação)
                            T012 (linting)
                            T013 (changelog)
```

## Execução Paralela Sugerida

```bash
# Fase 1
/execute T001

# Fase 2 (após T001)
/execute T002

# Fase 3 (após T002)
/execute T003 & /execute T004 & /execute T005

# Fase 4 (após T003-T005)
/execute T006

# Fase 5 (após T006)
/execute T007 & /execute T008 & /execute T009 & /execute T010

# Fase 6 (final)
/execute T011 & /execute T012 & /execute T013
```

---

## Estimativa de Esforço

- **Fase 1**: 1-2 horas
- **Fase 2**: 3-4 horas
- **Fase 3**: 2-3 horas
- **Fase 4**: 2-3 horas
- **Fase 5**: 1-2 horas

**Total**: 9-14 horas de trabalho focado

---

## Critérios de Sucesso Gerais

✅ Todos os testes passam  
✅ Cobertura de testes > 90% para autoBarre.ts  
✅ Storybook demonstra funcionalidade  
✅ Documentação atualizada  
✅ Código formatado e sem warnings  
✅ Comportamento correto em todos os cenários manuais  
✅ Requisitos FR-034, FR-035, FR-036 atendidos completamente
