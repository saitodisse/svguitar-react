# Implementação: Export/Import de Estado do ChordDiagram

**Branch**: `001-guitar-svg`  
**Data**: 2025-10-11  
**Especificação**: `/home/saito/_git/svguitar-react/specs/001-guitar-svg/export-import-spec.md`  
**Tarefas**: `/home/saito/_git/svguitar-react/specs/001-guitar-svg/tasks-export-import-state.md`

---

## Status de Implementação

### Fase 1: Setup e Design ✅

- [x] T001 Especificação detalhada criada
- [x] T002 Estrutura JSON definida
- [x] T003 Interfaces atualizadas no data-model

### Fase 2: Testes Primeiro (TDD) 🔄

- [ ] T004 Testes de snapshot para getState()
- [ ] T005 Testes de serialização/deserialização
- [ ] T006 Testes de importação válida/inválida
- [ ] T007 Testes de integração para botão

### Fase 3: Implementação Principal 🔄

- [ ] T008 Função getState() no Fretboard
- [ ] T009 Hook useChordDiagramState()
- [ ] T010 Função exportState()
- [ ] T011 Função importState()
- [ ] T012 Validação de schema
- [ ] T013 Função copyStateToClipboard()

### Fase 4: Integração com App.tsx 🔄

- [ ] T014 Botão Export State
- [ ] T015 Botão Import State
- [ ] T016 Toast notifications
- [ ] T017 Atualizar queryState

### Fase 5: Documentação e Polimento 🔄

- [ ] T018 Story no Storybook
- [ ] T019 Atualizar quickstart.md
- [ ] T020 Tradução PT/EN
- [ ] T021 Validação final (test, lint, format)

---

## Arquivos a Serem Criados/Modificados

### Novos Arquivos

```
src/components/ChordDiagram/
├── hooks/
│   └── useChordDiagramState.ts         # Hook para gerenciar estado
├── utils/
│   ├── exportState.ts                  # Função de export
│   ├── importState.ts                  # Função de import
│   └── validateState.ts                # Validação de schema
└── __tests__/
    └── state-export.test.tsx           # Testes de export/import

src/locales/
├── en/translation.json                 # Adicionar labels export/import
└── pt/translation.json                 # Adicionar labels export/import
```

### Arquivos Modificados

```
src/components/ChordDiagram/
├── Fretboard.tsx                       # Adicionar função getState()
├── ChordDiagram.tsx                    # Integrar hook de estado
└── types.ts                            # Adicionar ChordDiagramState interface

src/App.tsx                             # Adicionar botões export/import

specs/001-guitar-svg/
└── data-model.md                       # Atualizar com novas interfaces
```

---

## Abordagem de Implementação

### 1. Estado Determinístico (Fretboard)

A função `getState()` no Fretboard.tsx deve retornar:

- Frame atual (dimensões, posicionamento)
- Engine de layout selecionada
- Propriedades de estilo aplicadas

```typescript
export const getFretboardState = (frame: LayoutFrame, engine: LayoutEngine): FretboardState => {
	return {
		frame: {
			width: frame.width,
			height: frame.height,
			gridOriginX: frame.gridOriginX,
			gridOriginY: frame.gridOriginY,
			gridWidth: frame.gridWidth,
			gridHeight: frame.gridHeight,
			firstFret: frame.firstFret,
			stringCount: frame.stringCount,
			fretCount: frame.fretCount,
		},
		engineId: engine.id,
		style: frame.style,
	};
};
```

### 2. Hook useChordDiagramState

```typescript
export const useChordDiagramState = (props: ChordDiagramProps) => {
	const exportState = useCallback(() => {
		return {
			_version: "1.0.0",
			_timestamp: new Date().toISOString(),
			...props,
		};
	}, [props]);

	const importState = useCallback((state: ChordDiagramState) => {
		// Validar e aplicar estado
		const validated = validateChordDiagramState(state);
		if (validated.valid) {
			return state;
		}
		throw new Error(validated.errors.join(", "));
	}, []);

	return { exportState, importState };
};
```

### 3. Integração com App.tsx

- Adicionar dois botões: "Export State 📋" e "Import State 📥"
- Export: copia para clipboard e faz console.log
- Import: abre modal/textarea para colar JSON
- Feedback: toast de sucesso/erro

---

## Próximos Passos

1. Executar testes primeiro (TDD)
2. Implementar funções de export/import
3. Adicionar botões no App.tsx
4. Adicionar traduções
5. Validar e testar

---

## Notas de Desenvolvimento

- Usar estrutura já existente do projeto (nuqs para query state)
- Seguir padrões de código (Prettier, ESLint)
- Manter compatibilidade com todas as views
- Adicionar console.log detalhado para debug
- Considerar versioning do JSON para futuras mudanças
