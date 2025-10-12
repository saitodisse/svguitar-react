# Tarefas: Implementação de Auto Barre (Detecção Automática de Pestanas)

**Entrada**: Documentos de design de `/home/saito/_git/svguitar-react/specs/001-guitar-svg/`
**Pré-requisitos**: spec.md, data-model.md, research.md atualizados com requisitos FR-034, FR-035, FR-036
**Especificação**: Auto detecção de barres quando há mais de 4 dedos com fret > 0

## Resumo da Feature

Implementar detecção automática de barres (pestanas) para acordes que requerem mais de 4 dedos pressionados, tornando os diagramas mais realistas e úteis pedagogicamente. A funcionalidade:

- ✅ Ativa automaticamente quando há mais de 4 dedos com `fret > 0`
- ✅ Seleciona o traste com maior número de dedos para colocar a barre
- ✅ Respeita barres manuais (que têm precedência)
- ✅ Pode ser desabilitada via prop `autoBarreEnabled: false`
- ✅ Habilitada por padrão (`autoBarreEnabled: true`)

## Fase 3.1: Configuração e Revisão

- [ ] T001 Revisar requisitos FR-034, FR-035, FR-036 em `spec.md`
- [ ] T002 Revisar algoritmo de detecção em `data-model.md` seção 5
- [ ] T003 Revisar justificativa e alternativas em `research.md`

## Fase 3.2: Testes Primeiro (TDD)

### Testes de Contrato

- [ ] T004 Criar testes de contrato em `src/components/ChordDiagram/__tests__/AutoBarre.contract.test.tsx` validando:
    - [ ] T004a Prop `autoBarreEnabled` existe e aceita boolean
    - [ ] T004b Valor padrão de `autoBarreEnabled` é `true`
    - [ ] T004c Prop é opcional (pode ser omitida)

### Testes Unitários do Algoritmo

- [ ] T005 Criar `src/components/ChordDiagram/utils/autoBarreDetection.ts` com função `detectAutoBarre`
- [ ] T006 Criar testes unitários em `src/components/ChordDiagram/__tests__/autoBarreDetection.test.tsx`:
    - [ ] T006a Teste: Não aciona com 4 dedos ou menos (fret > 0)
    - [ ] T006b Teste: Aciona com 5 dedos (fret > 0)
    - [ ] T006c Teste: Ignora dedos com fret = 0 na contagem
    - [ ] T006d Teste: Ignora dedos mutados na contagem
    - [ ] T006e Teste: Seleciona traste com maior número de dedos
    - [ ] T006f Teste: Em caso de empate, seleciona traste de menor número
    - [ ] T006g Teste: Define fromString e toString corretamente
    - [ ] T006h Teste: Cobre todas as cordas entre primeiro e último dedo do traste

### Testes de Integração

- [ ] T007 Criar testes de integração em `src/components/ChordDiagram/__tests__/AutoBarre.integration.test.tsx`:
    - [ ] T007a Teste: Acorde com 5 dedos gera barre automática quando habilitado
    - [ ] T007b Teste: Acorde com 5 dedos não gera barre quando `autoBarreEnabled: false`
    - [ ] T007c Teste: Barres manuais desabilitam auto barre (precedência)
    - [ ] T007d Teste: Auto barre não interfere com acordes normais (≤4 dedos)
    - [ ] T007e Teste: Auto barre funciona com Fret Notation (ex: "333455")
    - [ ] T007f Teste: Auto barre funciona em todas as views (horizontal/vertical, right/left)

### Testes de Snapshot

- [ ] T008 Adicionar snapshots em `src/components/ChordDiagram/__tests__/ChordDiagram.snapshot.test.tsx`:
    - [ ] T008a Snapshot: Acorde com auto barre gerado
    - [ ] T008b Snapshot: Acorde com auto barre desabilitado
    - [ ] T008c Snapshot: Acorde com barre manual (auto desabilitado)

## Fase 3.3: Implementação Principal (após os testes falharem)

### Algoritmo Core

- [ ] T009 Implementar função `detectAutoBarre` em `src/components/ChordDiagram/utils/autoBarreDetection.ts`:
    - [ ] T009a Filtrar dedos válidos (fret > 0, não mutados)
    - [ ] T009b Contar dedos por traste
    - [ ] T009c Verificar se total > 4
    - [ ] T009d Identificar traste com mais dedos (desempate: menor número)
    - [ ] T009e Calcular fromString e toString
    - [ ] T009f Retornar objeto Barre ou null

### Integração no Componente

- [ ] T010 Atualizar `src/components/ChordDiagram/types.ts`:
    - [ ] T010a Adicionar prop `autoBarreEnabled?: boolean` em `ChordDiagramProps`
    - [ ] T010b Adicionar campo em `DEFAULT_PROPS` com valor `true`

- [ ] T011 Atualizar `src/components/ChordDiagram/ChordDiagram.tsx`:
    - [ ] T011a Importar função `detectAutoBarre`
    - [ ] T011b Adicionar lógica antes da renderização:
        - Verificar se `autoBarreEnabled === true`
        - Verificar se não há barres manuais (`chord.barres.length === 0`)
        - Chamar `detectAutoBarre(chord.fingers)`
        - Se retornar barre, adicionar ao array de barres
    - [ ] T011c Garantir que barres manuais não sejam sobrescritas

### Tratamento de Casos Especiais

- [ ] T012 Atualizar `src/components/ChordDiagram/utils/validation.ts`:
    - [ ] T012a Validar dedos antes de passar para `detectAutoBarre`
    - [ ] T012b Garantir que dedos inválidos sejam ignorados no cálculo

## Fase 3.4: Documentação e Stories

### Storybook

- [ ] T013 Atualizar `src/stories/ChordDiagram.stories.tsx`:
    - [ ] T013a Criar story "Auto Barre - Enabled (Default)" com acorde de 5+ dedos
    - [ ] T013b Criar story "Auto Barre - Disabled" com `autoBarreEnabled: false`
    - [ ] T013c Criar story "Auto Barre - Manual Override" mostrando precedência
    - [ ] T013d Adicionar controle toggle para `autoBarreEnabled` nas stories existentes

### Documentação

- [ ] T014 Atualizar `README.md` ou `docs/` com:
    - [ ] T014a Explicação do recurso auto barre
    - [ ] T014b Exemplo de uso
    - [ ] T014c Como desabilitar se necessário
    - [ ] T014d Comportamento com barres manuais

## Fase 3.5: Polimento e Validação

- [ ] T015 Executar suite de testes completa: `pnpm test`
- [ ] T016 Verificar cobertura de código para `autoBarreDetection.ts` (target: 100%)
- [ ] T017 Executar linter: `pnpm lint`
- [ ] T018 Formatar código: `pnpm format`
- [ ] T019 Verificar Storybook visualmente: `pnpm storybook`
- [ ] T020 Testar casos reais de acordes complexos (ex: acordes jazz com 5-6 notas)
- [ ] T021 Atualizar CHANGELOG.md com a nova feature

## Dependências Entre Tarefas

```
T001-T003 (Revisão) → T004-T008 (Testes)
T004-T008 (Testes) → T009-T012 (Implementação)
T009 (Algoritmo) → T010-T011 (Integração)
T010-T011 → T012 (Validação)
T009-T012 (Implementação) → T013-T014 (Documentação)
T001-T014 → T015-T021 (Polimento)
```

## Execução Paralela Sugerida

```bash
# Fase de Revisão (paralelo)
/execute T001 & /execute T002 & /execute T003

# Fase de Testes (paralelo após revisão)
/execute T004 & /execute T006 & /execute T007 & /execute T008

# Fase de Implementação (sequencial - depende dos testes)
/execute T009  # Algoritmo core primeiro
/execute T010  # Depois tipos
/execute T011  # Depois integração
/execute T012  # Depois validação

# Fase de Documentação (paralelo após implementação)
/execute T013 & /execute T014

# Fase de Polimento (sequencial - validação final)
/execute T015
/execute T016
/execute T017
/execute T018
/execute T019
/execute T020
/execute T021
```

## Exemplos de Testes Esperados

### Teste de Detecção Básica

```typescript
describe("detectAutoBarre", () => {
	it("should detect barre when more than 4 fingers with fret > 0", () => {
		const fingers: Finger[] = [
			{ fret: 3, string: 6, is_muted: false },
			{ fret: 3, string: 5, is_muted: false },
			{ fret: 3, string: 4, is_muted: false },
			{ fret: 4, string: 3, is_muted: false },
			{ fret: 5, string: 2, is_muted: false },
		];

		const result = detectAutoBarre(fingers);

		expect(result).toEqual({
			fret: 3,
			fromString: 4,
			toString: 6,
		});
	});

	it("should return null when 4 or fewer fingers", () => {
		const fingers: Finger[] = [
			{ fret: 1, string: 5, is_muted: false },
			{ fret: 2, string: 4, is_muted: false },
			{ fret: 2, string: 3, is_muted: false },
			{ fret: 3, string: 2, is_muted: false },
		];

		const result = detectAutoBarre(fingers);

		expect(result).toBeNull();
	});
});
```

### Teste de Integração

```typescript
describe('ChordDiagram - Auto Barre', () => {
  it('should render auto-detected barre by default', () => {
    const { container } = render(
      <ChordDiagram
        chord={{
          fingers: [
            { fret: 3, string: 6, is_muted: false },
            { fret: 3, string: 5, is_muted: false },
            { fret: 3, string: 4, is_muted: false },
            { fret: 4, string: 3, is_muted: false },
            { fret: 5, string: 2, is_muted: false },
          ],
          barres: [],
        }}
      />
    );

    // Verifica se existe um elemento barre no SVG
    const barres = container.querySelectorAll('rect.barre');
    expect(barres).toHaveLength(1);
  });

  it('should respect manual barres (no auto barre)', () => {
    const manualBarre = { fret: 1, fromString: 1, toString: 6 };

    const { container } = render(
      <ChordDiagram
        chord={{
          fingers: [
            { fret: 3, string: 6, is_muted: false },
            { fret: 3, string: 5, is_muted: false },
            { fret: 3, string: 4, is_muted: false },
            { fret: 4, string: 3, is_muted: false },
            { fret: 5, string: 2, is_muted: false },
          ],
          barres: [manualBarre],
        }}
      />
    );

    // Verifica que há apenas 1 barre (a manual)
    const barres = container.querySelectorAll('rect.barre');
    expect(barres).toHaveLength(1);
    // Opcionalmente, verificar atributos da barre para confirmar que é a manual
  });
});
```

## Critérios de Aceite

✅ Todos os testes passam (contract, unit, integration, snapshot)  
✅ Cobertura de código ≥ 90% para `autoBarreDetection.ts`  
✅ Linter sem erros  
✅ Código formatado  
✅ Storybook renderiza exemplos corretamente  
✅ Documentação atualizada  
✅ CHANGELOG.md atualizado  
✅ Feature funciona em todas as views (horizontal/vertical, right/left)  
✅ Barres manuais têm precedência sobre barres automáticas  
✅ Pode ser desabilitado via prop  
✅ Habilitado por padrão

## Notas de Implementação

### Algoritmo Simplificado

```typescript
export function detectAutoBarre(fingers: Finger[]): Barre | null {
	// 1. Filtrar dedos válidos (fret > 0, não mutados)
	const validFingers = fingers.filter(f => f.fret > 0 && !f.is_muted);

	// 2. Verificar se há mais de 4 dedos
	if (validFingers.length <= 4) return null;

	// 3. Agrupar por traste e contar
	const fretCounts = new Map<number, Finger[]>();
	validFingers.forEach(f => {
		if (!fretCounts.has(f.fret)) fretCounts.set(f.fret, []);
		fretCounts.get(f.fret)!.push(f);
	});

	// 4. Encontrar traste com mais dedos
	let maxCount = 0;
	let selectedFret = -1;
	let selectedFingers: Finger[] = [];

	fretCounts.forEach((fingers, fret) => {
		if (fingers.length > maxCount || (fingers.length === maxCount && fret < selectedFret)) {
			maxCount = fingers.length;
			selectedFret = fret;
			selectedFingers = fingers;
		}
	});

	// 5. Calcular fromString e toString
	const strings = selectedFingers.map(f => f.string).sort((a, b) => a - b);

	return {
		fret: selectedFret,
		fromString: strings[0],
		toString: strings[strings.length - 1],
	};
}
```

### Integração no Componente

```typescript
// Em ChordDiagram.tsx
function ChordDiagram(props: ChordDiagramProps) {
	const { chord, autoBarreEnabled = true, ...rest } = props;

	// Processar barres (manual + auto)
	let finalBarres = chord.barres;

	if (autoBarreEnabled && chord.barres.length === 0) {
		const autoBarre = detectAutoBarre(chord.fingers);
		if (autoBarre) {
			finalBarres = [autoBarre];
		}
	}

	// Renderizar com finalBarres
	// ...
}
```

---

**Status**: 🟡 Pendente  
**Prioridade**: Alta  
**Estimativa**: 4-6 horas de desenvolvimento + testes
