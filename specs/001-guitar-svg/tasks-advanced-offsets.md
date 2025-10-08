# Tasks - Advanced Offsets and Customizations

**Branch**: `001-guitar-svg` | **Data**: 2025-10-08  
**Feature**: Advanced SVG Rendering Customizations  
**Spec**: `/home/saito/_git/svguitar-react/specs/001-guitar-svg/spec.md`

## Resumo

Adicionar customizações avançadas de offsets e propriedades visuais para controle fino do SVG:

- **Barres**: width, opacity, offsetX, offsetY
- **Tuning Labels**: Substituir `tuningLabelOffset` por `tuningLabelOffsetX` e `tuningLabelOffsetY`
- **String Indicators**: Renomear `stringIndicatorOffset` para `stringIndicatorOffsetX` e adicionar `stringIndicatorOffsetY`
- **Fret Text**: Adicionar `fretTextOffsetX` e `fretTextOffsetY`

Todos os offsets são multiplicadores flexíveis (range: -5 a 5) aplicados a `fretWidth`/`fretHeight`.

## Estratégia de Execução

### Ordem de Execução

1. **Fase Setup**: Atualizar especificações (specs, data-model, contracts, quickstart)
2. **Fase Core**: Atualizar constantes, types e layout engines
3. **Fase Components**: Atualizar componentes de renderização (Barre, TuningLabels, FretNumbers, StringIndicators)
4. **Fase Tests**: Adicionar testes unitários e integração
5. **Fase App**: Atualizar App.tsx e stories do Storybook
6. **Fase Validation**: Rodar testes completos e validação

### Tarefas Paralelas [P]

Tarefas marcadas com [P] podem ser executadas em paralelo, pois afetam arquivos diferentes ou são independentes.

## Lista de Tarefas

### 📋 Fase 1: Setup - Atualizar Especificações [P]

**T001** - [P] Atualizar spec.md com novos requisitos funcionais

- **Arquivo**: `specs/001-guitar-svg/spec.md`
- **Descrição**: Adicionar FR-030 a FR-037 para as novas customizações
- **FR-030**: Sistema DEVE suportar `barresWidth` para largura horizontal das barres
- **FR-031**: Sistema DEVE suportar `barresOpacity` (0-1, padrão: 1.0)
- **FR-032**: Sistema DEVE suportar `barresOffsetX` e `barresOffsetY` (multiplicadores -5 a 5)
- **FR-033**: Sistema DEVE substituir `tuningLabelOffset` por `tuningLabelOffsetX` e `tuningLabelOffsetY`
- **FR-034**: Sistema DEVE renomear `stringIndicatorOffset` para `stringIndicatorOffsetX`
- **FR-035**: Sistema DEVE adicionar `stringIndicatorOffsetY`
- **FR-036**: Sistema DEVE adicionar `fretTextOffsetX` para posição horizontal dos números dos trastes
- **FR-037**: Sistema DEVE adicionar `fretTextOffsetY` para posição vertical dos números dos trastes

**T002** - [P] Atualizar data-model.md com novas props

- **Arquivo**: `specs/001-guitar-svg/data-model.md`
- **Descrição**: Atualizar interfaces `ChordDiagramProps` e `ChordStyle`
- Adicionar novas props com tipos, ranges e descrições
- Documentar breaking change: `tuningLabelOffset` → `tuningLabelOffsetX/Y`, `stringIndicatorOffset` → `stringIndicatorOffsetX`

**T003** - [P] Atualizar contracts/chord-diagram-api.md

- **Arquivo**: `specs/001-guitar-svg/contracts/chord-diagram-api.md`
- **Descrição**: Documentar novas props na API e regras de validação
- Adicionar validação: offsets devem estar entre -5 e 5
- Adicionar validação: `barresOpacity` deve estar entre 0 e 1
- Adicionar validação: `barresWidth` deve ser número positivo

**T004** - [P] Atualizar quickstart.md com exemplos

- **Arquivo**: `specs/001-guitar-svg/quickstart.md`
- **Descrição**: Adicionar exemplos de uso das novas customizações
- Exemplo: Barres com opacity e offsets
- Exemplo: Tuning labels com offsets X e Y
- Exemplo: String indicators com offsets X e Y
- Exemplo: Fret numbers com offsets X e Y

### 🔧 Fase 2: Core - Atualizar Types e Constants

**T005** - Atualizar types.ts com novas interfaces

- **Arquivo**: `src/components/ChordDiagram/types.ts`
- **Descrição**: Atualizar `ChordDiagramProps` e `ChordStyle`
- Adicionar: `barresWidth`, `barresOpacity`, `barresOffsetX`, `barresOffsetY`
- Remover: `tuningLabelOffset`, `stringIndicatorOffset`
- Adicionar: `tuningLabelOffsetX`, `tuningLabelOffsetY`
- Adicionar: `stringIndicatorOffsetX`, `stringIndicatorOffsetY`
- Adicionar: `fretTextOffsetX`, `fretTextOffsetY`
- Adicionar JSDoc comments para todas as novas props
- **Depende de**: T001, T002

**T006** - Atualizar constants.ts com valores padrão

- **Arquivo**: `src/components/ChordDiagram/constants.ts`
- **Descrição**: Atualizar `DEFAULT_CHORD_STYLE`
- `barresWidth`: 8 (padrão consistente com altura)
- `barresOpacity`: 1.0
- `barresOffsetX`: 0
- `barresOffsetY`: 0
- `tuningLabelOffsetX`: 0
- `tuningLabelOffsetY`: 0.5 (manter comportamento atual)
- `stringIndicatorOffsetX`: 0.5 (manter comportamento atual)
- `stringIndicatorOffsetY`: 0
- `fretTextOffsetX`: 0
- `fretTextOffsetY`: 0
- **Depende de**: T005

### 🎨 Fase 3: Components - Atualizar Renderização

**T007** - Atualizar Barre.tsx com novas props

- **Arquivo**: `src/components/ChordDiagram/Barre.tsx`
- **Descrição**: Aplicar `barresWidth`, `barresOpacity`, `barresOffsetX`, `barresOffsetY`
- Adicionar `opacity` ao elemento SVG `<rect>`
- Aplicar offsets às coordenadas x/y calculadas pelo layout engine
- Offsets são multiplicados por `fretWidth` (X) e `fretHeight` (Y)
- **Depende de**: T006

**T008** - Atualizar TuningLabels.tsx com novos offsets

- **Arquivo**: `src/components/ChordDiagram/TuningLabels.tsx`
- **Descrição**: Substituir `tuningLabelOffset` por `tuningLabelOffsetX` e `tuningLabelOffsetY`
- Para views horizontais: aplicar offsetX e offsetY às coordenadas
- Para views verticais: aplicar offsetX e offsetY às coordenadas
- **Depende de**: T006

**T009** - Criar StringIndicators.tsx (se não existir) ou atualizar rendering inline

- **Arquivo**: `src/components/ChordDiagram/Fretboard.tsx` (ou arquivo onde string indicators são renderizados)
- **Descrição**: Aplicar `stringIndicatorOffsetX` e `stringIndicatorOffsetY`
- Localizar onde 'O' e 'X' são renderizados
- Aplicar offsets X e Y às coordenadas calculadas pelo layout engine
- **Depende de**: T006

**T010** - Atualizar FretNumbers.tsx com offsets

- **Arquivo**: `src/components/ChordDiagram/FretNumbers.tsx`
- **Descrição**: Aplicar `fretTextOffsetX` e `fretTextOffsetY`
- Adicionar offsets às coordenadas x/y de cada fret number
- Offsets são multiplicados por `fretWidth` (X) e `fretHeight` (Y)
- **Depende de**: T006

### 🧪 Fase 4: Tests - Adicionar Cobertura de Testes [P]

**T011** - [P] Testes unitários para Barre.tsx

- **Arquivo**: `src/components/ChordDiagram/__tests__/Barre.test.tsx` (criar se não existir)
- **Descrição**: Testar renderização com novas props
- Testar `barresWidth` aplicado corretamente
- Testar `barresOpacity` aplicado corretamente
- Testar `barresOffsetX` e `barresOffsetY` aplicados às coordenadas
- **Depende de**: T007

**T012** - [P] Testes unitários para TuningLabels.tsx

- **Arquivo**: `src/components/ChordDiagram/TuningLabels.test.tsx`
- **Descrição**: Atualizar testes existentes e adicionar novos
- Testar `tuningLabelOffsetX` em horizontal e vertical views
- Testar `tuningLabelOffsetY` em horizontal e vertical views
- Testar combinação de offsets X e Y
- **Depende de**: T008

**T013** - [P] Testes unitários para String Indicators

- **Arquivo**: `src/components/ChordDiagram/__tests__/StringIndicators.test.tsx` (criar se não existir)
- **Descrição**: Testar renderização de 'O' e 'X' com offsets
- Testar `stringIndicatorOffsetX` aplicado corretamente
- Testar `stringIndicatorOffsetY` aplicado corretamente
- Testar combinação de offsets X e Y em diferentes views
- **Depende de**: T009

**T014** - [P] Testes unitários para FretNumbers.tsx

- **Arquivo**: `src/components/ChordDiagram/FretNumbers.test.tsx`
- **Descrição**: Atualizar testes existentes e adicionar novos
- Testar `fretTextOffsetX` aplicado corretamente
- Testar `fretTextOffsetY` aplicado corretamente
- Testar offsets em diferentes views (horizontal e vertical)
- **Depende de**: T010

**T015** - [P] Testes de integração no ChordDiagram.test.tsx

- **Arquivo**: `src/components/ChordDiagram/ChordDiagram.test.tsx`
- **Descrição**: Testar que as novas props são propagadas corretamente
- Testar defaults aplicados quando props não são fornecidas
- Testar todas as novas props juntas
- Testar breaking change: `tuningLabelOffset` removido, `stringIndicatorOffset` removido
- **Depende de**: T007, T008, T009, T010

### 🖥️ Fase 5: App - Atualizar UI e Storybook

**T016** - Atualizar App.tsx com novos controles

- **Arquivo**: `src/App.tsx`
- **Descrição**: Adicionar controles UI para todas as novas props
- Adicionar seção "Barres Customization" com sliders para width, opacity, offsetX, offsetY
- Atualizar seção "Tuning Labels" com sliders para offsetX e offsetY (remover `tuningLabelOffset`)
- Atualizar seção "String Indicators" com sliders para offsetX e offsetY (renomear `stringIndicatorOffset`)
- Adicionar seção "Fret Numbers" com sliders para offsetX e offsetY
- Atualizar `DEFAULT_CONFIGS` com novos valores
- Adicionar i18n keys para novos controles
- **Depende de**: T006

**T017** - Atualizar locales (en/pt) com novas traduções

- **Arquivo**: `src/locales/en/translation.json`, `src/locales/pt/translation.json`
- **Descrição**: Adicionar keys de tradução para novos controles
- Adicionar traduções para barres (width, opacity, offsetX, offsetY)
- Atualizar traduções para tuning labels (offsetX, offsetY)
- Atualizar traduções para string indicators (offsetX, offsetY)
- Adicionar traduções para fret text offsets (offsetX, offsetY)
- **Depende de**: T016

**T018** - Atualizar ChordDiagram.stories.tsx

- **Arquivo**: `src/stories/ChordDiagram.stories.tsx`
- **Descrição**: Atualizar BASE_STORY_CONFIG e argTypes
- Atualizar `BASE_STORY_CONFIG` com novos valores padrão
- Adicionar argTypes para todas as novas props nas categorias corretas:
    - Categoria "Barres": `barresWidth`, `barresOpacity`, `barresOffsetX`, `barresOffsetY`
    - Categoria "Tuning": `tuningLabelOffsetX`, `tuningLabelOffsetY`
    - Categoria "Strings": `stringIndicatorOffsetX`, `stringIndicatorOffsetY`
    - Categoria "Frets": `fretTextOffsetX`, `fretTextOffsetY`
- Adicionar 4 novas demo stories:
    - `BarresCustomizationDemo`: Demonstrar width, opacity e offsets
    - `TuningLabelsOffsetsDemo`: Demonstrar offsets X e Y
    - `StringIndicatorsOffsetsDemo`: Demonstrar offsets X e Y
    - `FretNumbersOffsetsDemo`: Demonstrar offsets X e Y
- **Depende de**: T006

### ✅ Fase 6: Validation - Testes e Formatação

**T019** - Rodar formatação de código

- **Comando**: `pnpm format`
- **Descrição**: Formatar todos os arquivos alterados
- **Depende de**: T016, T017, T018

**T020** - Rodar testes completos

- **Comando**: `pnpm test:run`
- **Descrição**: Validar que todos os testes passam (esperado: 100% coverage)
- **Depende de**: T011, T012, T013, T014, T015

**T021** - Atualizar versão e CHANGELOG

- **Arquivos**: `package.json`, `CHANGELOG.md`
- **Descrição**: Incrementar versão para 1.16.0
- Adicionar breaking changes no CHANGELOG:
    - `tuningLabelOffset` → `tuningLabelOffsetX` e `tuningLabelOffsetY`
    - `stringIndicatorOffset` → `stringIndicatorOffsetX`
- Adicionar novas features no CHANGELOG:
    - Barres width, opacity, offsets X/Y
    - String indicators offsetY
    - Fret numbers offsets X/Y
- **Depende de**: T020

## Estimativas

- **Fase 1 (Specs)**: 20 minutos (paralelo)
- **Fase 2 (Core)**: 15 minutos (sequencial)
- **Fase 3 (Components)**: 30 minutos (sequencial)
- **Fase 4 (Tests)**: 40 minutos (paralelo)
- **Fase 5 (App)**: 30 minutos (sequencial)
- **Fase 6 (Validation)**: 10 minutos (sequencial)

**Total Estimado**: ~2 horas

## Breaking Changes

⚠️ **ATENÇÃO**: Esta feature introduz breaking changes:

1. **`tuningLabelOffset` removida** → Substituída por `tuningLabelOffsetX` e `tuningLabelOffsetY`
2. **`stringIndicatorOffset` renomeada** → Agora `stringIndicatorOffsetX` (+ adição de `stringIndicatorOffsetY`)

### Migration Guide

```typescript
// Antes (v1.15.0)
<ChordDiagram
  tuningLabelOffset={0.5}
  stringIndicatorOffset={0.7}
/>

// Depois (v1.16.0)
<ChordDiagram
  tuningLabelOffsetX={0}
  tuningLabelOffsetY={0.5}
  stringIndicatorOffsetX={0.7}
  stringIndicatorOffsetY={0}
/>
```

## Notas de Implementação

- Todos os offsets são multiplicadores aplicados a `fretWidth` (para X) e `fretHeight` (para Y)
- Range dos offsets: -5 a 5 (consistente com offsets existentes)
- `barresOpacity`: 0 (transparente) a 1 (opaco)
- `barresWidth`: valor em pixels, padrão 8 (consistente com `barreHeight`)
- Manter retrocompatibilidade onde possível, mas documentar breaking changes claramente
