# Release Notes

## Version 1.13.0

**Release Date:** January 15, 2025

### 🎯 Vertical Layout Corrections & Enhanced Consistency

Esta versão corrige problemas críticos nos layouts verticais do ChordDiagram, garantindo que a ordem das cordas e a numeração dos trastes estejam corretas e consistentes em todas as views verticais.

#### ✨ Principais Correções

- **Ordem das Cordas Corrigida**: Corrigida a ordem das cordas nos layouts verticais
    - `vertical-right`: cordas agora exibem `["E2", "A2", "D3", "G3", "B3", "E4"]` da esquerda para a direita
    - `vertical-left`: cordas agora exibem `["E4", "B3", "G3", "D3", "A2", "E2"]` da esquerda para a direita
    - Ambas as views verticais agora têm numeração de trastes consistente de cima para baixo (0, 1, 2, 3, 4...)
    - Números dos trastes posicionados à direita de cada traste nos layouts verticais
    - Labels de afinação corretamente posicionados acima do traste zero em todas as views verticais

#### 🔧 Melhorias Técnicas

- **Engines de Layout Atualizados**: Engines verticais aprimorados para mapeamento correto de coordenadas
    - `verticalRightEngine` atualizado para usar ordem correta das cordas e progressão não invertida dos trastes
    - `verticalLeftEngine` atualizado para usar ordem invertida das cordas mas progressão consistente dos trastes
    - Funções `mapStringAxis` e `mapFretAxis` aprimoradas para posicionamento preciso
    - Cálculos `fingerPosition`, `barreRect` e `indicatorPosition` aprimorados

- **Sincronização de Componentes**: Todos os componentes agora funcionam consistentemente com layouts verticais
    - Componente `FretNumbers` exibe corretamente números de trastes ascendentes em views verticais
    - Componente `TuningLabels` mantém posicionamento adequado acima do traste zero
    - Todos os pontos de dedos, pestanas e indicadores respeitam o novo sistema de coordenadas

#### 🧪 Testes e Qualidade

- **Cobertura de Testes Aprimorada**: Adicionados testes abrangentes para comportamento de layout vertical
    - Testes para verificar mapeamento correto da ordem das cordas em ambos os engines verticais
    - Testes para garantir que números de trastes aumentam de cima para baixo em views verticais
    - Stories do Storybook atualizadas para mostrar layouts verticais corrigidos
    - Todos os testes existentes continuam passando com as novas implementações de layout

#### 📚 Documentação

- **Especificações Atualizadas**: Atualizações abrangentes de documentação
    - `spec.md` atualizado com requisitos específicos de ordem das cordas para views verticais
    - Adicionada especificação `FR-025` para comportamento de numeração de trastes verticais
    - `research.md` atualizado com decisões técnicas para correções de layout vertical
    - `quickstart.md` aprimorado com exemplos de layouts verticais corrigidos

#### ⚠️ Breaking Changes

- **Comportamento de Layout Vertical**: A ordem das cordas e numeração de trastes em views verticais foi corrigida
    - Isso pode afetar aplicações que dependiam do comportamento anterior incorreto
    - Aplicações usando layouts verticais devem verificar se a nova ordem das cordas atende aos seus requisitos

#### ✅ Qualidade e Testes

- ✅ Todos os testes unitários passando (15/15)
- ✅ Testes do Storybook executados com sucesso (15/15)
- ✅ Build principal executado com sucesso
- ✅ Zero erros de linting
- ✅ Código formatado e organizado
- ✅ Documentação atualizada e consistente

## Version 1.12.0

**Release Date:** January 15, 2025

### 🎯 Enhanced User Experience & Configuration Management

Esta versão introduz melhorias significativas na experiência do usuário com um botão de limpeza de configuração e uma refatoração completa do sistema de configurações para maior manutenibilidade e consistência.

#### ✨ Principais Recursos

- **Botão "Clear" de Configuração**: Novo botão para resetar todas as configurações para os valores padrão
    - Posicionado no cabeçalho do painel de controles para fácil acesso
    - Reseta todos os parâmetros de configuração preservando `view` e `lang` na querystring
    - Internacionalizado com labels em inglês ("Clear") e português ("Limpar")
    - Fornece forma rápida de restaurar configurações padrão sem ajustes manuais

#### 🔧 Melhorias Técnicas

- **Sistema de Configuração Centralizado**: Refatoração completa dos valores hardcoded
    - Todos os valores de configuração movidos para constante `DEFAULT_CONFIGS`
    - Fonte única de verdade para todos os valores padrão entre mobile/desktop e horizontal/vertical
    - Eliminação de todos os valores hardcoded em favor de configuração centralizada
    - Melhoria na manutenibilidade e consistência entre diferentes modos de visualização

- **Otimização de Padrões React**: Implementação aprimorada do useMemo
    - Array de dependências simplificado com apenas dependências essenciais (`view`, `isMobile`)
    - Constantes movidas para fora do componente para prevenir recriação a cada render
    - Performance otimizada reduzindo recálculos desnecessários
    - Estrutura de código mais limpa e manutenível

#### 📊 Gerenciamento de Configuração

- **Valores Padrão Aprimorados**: Cobertura abrangente de configuração
    - Adicionadas todas as propriedades ausentes ao `DEFAULT_CONFIGS`: `stringCount`, `backgroundColor`, `fretColor`, `stringColor`, `dotColor`, `dotTextColor`, `barreColor`, `fretTextColor`, `tuningTextColor`, `openStringColor`, `mutedStringColor`, `fontFamily`, `chord`
    - Valores consistentes entre todos os modos de visualização (mobile/desktop × horizontal/vertical)
    - Configuração type-safe com `as const` para melhor suporte TypeScript

- **Funcionalidade de Reset Aprimorada**: Comportamento de limpeza de configuração aprimorado
    - Função `clearConfiguration()` agora usa defaults atuais ao invés de valores hardcoded
    - Mantém configurações específicas de visualização e dispositivo
    - Garante consistência entre carregamento inicial e funcionalidade de reset

#### 🚀 Experiência do Desenvolvedor

- **Melhor Organização de Código**: Estrutura de código aprimorada e manutenibilidade
    - Constantes extraídas para fora do escopo do componente
    - Separação mais limpa de responsabilidades
    - Redução de duplicação de código
    - Legibilidade e manutenibilidade aprimoradas

#### ✅ Qualidade e Testes

- ✅ Todos os testes unitários passando
- ✅ Testes do Storybook executados com sucesso (15/15)
- ✅ Build principal executado com sucesso
- ✅ Zero erros de linting
- ✅ Código formatado e organizado

## Version 1.11.0

**Release Date:** January 15, 2025

### 🐛 Bug Fixes & Compatibility Improvements

Esta versão corrige um problema crítico de compatibilidade entre o Tailwind CSS v4 e os componentes shadcn/ui, garantindo que todos os componentes funcionem corretamente.

#### 🔧 Correções Principais

- **Correção da Transparência do Select**: Resolvido problema onde as opções do dropdown do componente Select estavam transparentes
    - Downgrade do Tailwind CSS v4.1.13 para v3.4.17 para melhor compatibilidade
    - Atualização da configuração do Vite para usar PostCSS com Tailwind v3
    - Correção das classes `bg-popover` e `text-popover-foreground` que não estavam sendo aplicadas
    - Todos os componentes UI agora exibem com fundos e cores de texto adequados

#### 🛠️ Melhorias Técnicas

- **Compatibilidade com shadcn/ui**: Melhorada a compatibilidade com componentes shadcn/ui
    - Atualizado `vite.config.ts` para usar configuração PostCSS
    - Adicionado `postcss.config.js` para integração adequada do Tailwind v3
    - Atualizado imports CSS para usar diretivas `@tailwind` ao invés de `@import "tailwindcss"`
    - Garantido que todos os componentes UI renderizem corretamente com estilização adequada

#### 📦 Dependências Atualizadas

- **Tailwind CSS**: v4.1.13 → v3.4.17 (para compatibilidade)
- **PostCSS**: Configuração adicionada para suporte ao Tailwind v3
- **Autoprefixer**: Adicionado para compatibilidade de CSS

#### ✅ Status dos Testes

- ✅ Build principal: Sucesso
- ✅ Build do Storybook: Sucesso
- ✅ Testes unitários: 15/15 passaram
- ✅ Compatibilidade com shadcn/ui: Restaurada

## Version 1.10.0

**Release Date:** October 1, 2025

### 🎨 Modern UI Framework Integration

Major release integrando **Tailwind CSS v4** e **shadcn/ui** para uma interface moderna, acessível e totalmente customizável.

#### 🚀 Principais Recursos

- **Tailwind CSS v4.1.13**: Framework utility-first de última geração
    - Plugin nativo para Vite (`@tailwindcss/vite`)
    - Sistema de design com variáveis CSS
    - Build otimizado e performance aprimorada
    - Dark theme configurado por padrão

- **shadcn/ui Components**: Componentes acessíveis e customizáveis
    - Instalados via CLI: `Input`, `Select`, `Label`, `RadioGroup`, `Slider`, `Button`
    - Baseados em Radix UI para acessibilidade de classe mundial
    - Totalmente estilizados com Tailwind utilities
    - Tema consistente com design tokens

- **Dark Mode Inteligente**: Detecção automática do tema do sistema
    - `ThemeProvider` com suporte a light/dark/system
    - Persistência em localStorage
    - Default: `system` (detecta preferência do OS)

#### 🎯 Melhorias de Interface

- **Layout Moderno**: Interface completamente redesenhada
    - Grid responsivo com breakpoints mobile/desktop
    - Efeitos glassmorphism com backdrop-blur
    - Hierarquia visual aprimorada
    - Espaçamento consistente

- **Controles Aprimorados**: Inputs nativos substituídos por componentes shadcn/ui
    - `Input` para texto com validação visual
    - `Select` dropdown com animações e acessibilidade
    - `Slider` para ranges com melhor UX
    - `RadioGroup` para seleção de idioma
    - Labels semânticos em todos os controles

#### 🛠️ Developer Experience

- **Path Aliases**: Configuração `@/*` para imports limpos
- **components.json**: CLI shadcn/ui pronto para adicionar novos componentes
- **ESLint**: Regras atualizadas para componentes UI
- **TypeScript**: Path mapping correto em todos os tsconfig

#### 📦 Dependências Adicionadas

```json
{
	"dependencies": [
		"@radix-ui/react-label",
		"@radix-ui/react-select",
		"@radix-ui/react-radio-group",
		"@radix-ui/react-slider",
		"@radix-ui/react-slot"
	],
	"devDependencies": [
		"tailwindcss@4.1.13",
		"@tailwindcss/vite@4.1.13",
		"class-variance-authority",
		"clsx",
		"tailwind-merge",
		"lucide-react"
	]
}
```

#### ✅ Qualidade

- **36 testes passando**: 21 unit + 15 Storybook
- **Builds verificados**: Biblioteca e aplicação demo
- **ESLint sem erros**: Código formatado e lint-free
- **TypeScript**: Sem erros de tipo

#### 🔄 Breaking Changes

Nenhum! A biblioteca mantém 100% de compatibilidade. Apenas a aplicação demo foi redesenhada.

#### 📚 Como Usar os Novos Componentes

```bash
# Adicionar mais componentes shadcn/ui
pnpm dlx shadcn@latest add [component]

# Exemplos
pnpm dlx shadcn@latest add card
pnpm dlx shadcn@latest add dropdown-menu
pnpm dlx shadcn@latest add dialog
```

## Version 1.9.0

**Release Date:** October 1, 2025

### 🎯 Horizontal-Left Layout Refinements

Focused release aprimorando a experiência da view `horizontal-left` com labels, numeração e indicadores espelhados corretamente.

#### 🚀 Principais Ajustes

- **Tuning labels espelhados**: agora são renderizados à direita do braço na view `horizontal-left`.
- **Numeração de trastes invertida**: leitura da esquerda para a direita exibe `3, 2, 1, 0`, respeitando o espelhamento.
- **Indicadores reposicionados**: cordas soltas/mutadas seguem o novo alinhamento à direita.
- **Engine atualizado**: `horizontalLeftEngine` recalcula cordas, dedos e pestanas usando coordenadas absolutas sem `transform` global.

#### ✅ Qualidade e Testes

- Novos testes unitários garantindo comportamento espelhado em `TuningLabels` e `FretNumbers`.
- Teste de integração do `ChordDiagram` assegura labels à direita e numeração invertida.
- Play-test do Storybook atualizado contemplando a view `horizontal-left`.

#### 📚 Documentação

- Specs, quickstart e tasks atualizados descrevendo o novo comportamento.
- Changelog expandido com detalhes das mudanças de layout.

## Version 1.8.0

**Release Date:** January 30, 2025

### 🎯 View-Based Layout System Implementation

This major release completes the implementation of the view-based layout system with 4 fully functional predefined views and a pluggable layout engine architecture.

#### 🚀 Major Features

- **4 Predefined Views Fully Implemented**:
    - `horizontal-right` (default): Standard right-handed horizontal layout
    - `horizontal-left`: Left-handed horizontal layout with inverted string order
    - `vertical-right`: Vertical layout with low E string on the left
    - `vertical-left`: Vertical layout with low E string on the right

- **Strategy Pattern Implementation**:
    - Complete `LayoutEngine` interface with mapping-per-view approach
    - `layoutRegistry` for managing built-in and custom engines
    - Precedence system: `layoutEngine` prop > `view` prop > default

- **Mapping-per-View Architecture**:
    - Absolute coordinate calculations for each view
    - No global SVG transforms (no rotate/scale)
    - Consistent horizontal text orientation across all views
    - Maintained dot centralization in fret spaces

#### ✨ Key Improvements

- **Zero Conditional Rendering**: Removed all `if/else` for layout logic from render code
- **Extensibility**: Users can inject custom `LayoutEngine` strategies
- **Text Legibility**: Labels and numbers maintain horizontal orientation in all views
- **Future-Proof**: Architecture ready for hit-tests and interactions
- **Type Safety**: Comprehensive TypeScript interfaces for all layout components

#### 🔧 Implementation Details

**New Files Created**:

- `src/components/ChordDiagram/layouts/horizontalRight.ts`
- `src/components/ChordDiagram/layouts/horizontalLeft.ts`
- `src/components/ChordDiagram/layouts/verticalRight.ts`
- `src/components/ChordDiagram/layouts/verticalLeft.ts`

**Refactored Components**:

- `ChordDiagram.tsx`: Builds `LayoutFrame`, resolves engine, passes to children
- `Fretboard.tsx`: Uses engine mapping for frets and strings
- `Finger.tsx`: Uses engine for finger and indicator positioning
- `Barre.tsx`: Uses engine for barre rectangle calculations
- `FretNumbers.tsx`: Adapted for engine-based fret axis mapping
- `TuningLabels.tsx`: Supports both horizontal and vertical layouts with consistent text orientation

#### 📚 Updated Documentation

- **Specifications**: Updated all specs in `specs/001-guitar-svg/` for view system
- **README**: Added view selection examples and custom engine guide
- **API Reference**: Complete `LayoutEngine` interface documentation
- **Migration Guide**: Clear upgrade path from v1.7.0

#### 🧪 Quality Assurance

- ✅ All 4 views tested and working in Storybook
- ✅ Build successful (30.52 kB ESM / 20.74 kB CJS)
- ✅ No linter errors
- ✅ TypeScript compilation successful
- ✅ Backward compatibility via view resolution

#### ⚠️ Breaking Changes

- **None**: This release completes the implementation started in v1.7.0
- Views are fully functional and ready for production use
- All layout engines are registered and tested

---

## Version 1.7.0

**Release Date:** January 27, 2025

### 🎯 Layout System Overhaul & Breaking Changes

This major release introduces a completely new layout system that replaces the old `orientation`/`handedness` approach with a more flexible and extensible view-based system.

#### 🔄 Breaking Changes

- **Layout API Update**: Replaced `orientation` and `handedness` props with new `view` and `layoutEngine` system
- **View System**: New predefined views: `horizontal-right`, `horizontal-left`, `vertical-right`, `vertical-left`
- **Layout Engines**: Introduced pluggable layout engine system for custom positioning strategies

#### ✨ New Features

- **View-Based Layout**: Simplified layout control with 4 predefined views
- **Layout Engines**: Extensible layout system with built-in engines for each view
- **Mapping-per-view**: Absolute coordinate mapping without global transforms
- **Custom Layout Engines**: Support for custom layout strategies via `layoutEngine` prop
- **View Resolution**: Smart precedence system: `layoutEngine` > `view` > default

#### 🚀 Performance Improvements

- **No Global Transforms**: Removed `transform` usage for better performance
- **Absolute Positioning**: Direct coordinate mapping for faster rendering
- **Text Legibility**: Horizontal text orientation maintained in all views
- **Consistent Centralization**: Dots always centered in fret spaces

#### 🛠️ Technical Enhancements

- **New Interfaces**: `ViewId`, `LayoutEngine`, `LayoutFrame`, `LayoutArgs`
- **Layout Registry**: Centralized management of layout engines
- **Enhanced Validation**: Better error handling for view validation
- **Type Safety**: Comprehensive TypeScript support for all layout features

#### 📚 Migration Guide

**Before (v1.6.0):**

```tsx
<ChordDiagram chord={chord} orientation="vertical" handedness="left" />
```

**After (v1.7.0):**

```tsx
<ChordDiagram chord={chord} view="vertical-left" />
```

#### 🎨 Available Views

- `horizontal-right` (default): Standard guitar view with low E at bottom
- `horizontal-left`: Mirrored horizontal view with low E at top
- `vertical-right`: Rotated view with strings on X-axis
- `vertical-left`: Rotated view with inverted string order

#### 🔧 Custom Layout Engines

```tsx
const customEngine: LayoutEngine = {
	id: "horizontal-right",
	mapStringAxis: (stringNumber, frame) => {
		/* custom logic */
	},
	mapFretAxis: (fret, frame) => {
		/* custom logic */
	},
	fingerPosition: (finger, args) => {
		/* custom logic */
	},
	barreRect: (barre, args) => {
		/* custom logic */
	},
	indicatorPosition: (stringNumber, kind, args) => {
		/* custom logic */
	},
};

<ChordDiagram chord={chord} layoutEngine={customEngine} />;
```

## Version 1.6.0

**Release Date:** January 27, 2025

### 🎯 API Simplification & Breaking Changes

This release introduces significant API improvements by simplifying the component interface and removing unnecessary complexity.

#### 🔄 Breaking Changes

- **Removed `ChordStyle` Interface**: The `ChordStyle` interface is no longer exported from the public API
- **Inline Props**: All styling properties are now passed directly as props instead of nested in a `style` object
- **Simplified Imports**: No need to import `ChordStyle` type anymore

#### ✨ New Features

- **Direct Props API**: Styling properties are now passed directly to the component
- **Better TypeScript Support**: Improved type inference and IntelliSense
- **Cleaner Code**: Reduced bundle size and improved performance

#### 📝 Migration Guide

**Old API (v1.5.0):**

```tsx
import { ChordDiagram, ChordStyle } from "svguitar-react";

const style: Partial<ChordStyle> = {
	width: 200,
	height: 250,
	dotColor: "#FF5733",
	fontFamily: "Arial, sans-serif",
};

<ChordDiagram chord={chordData} style={style} />;
```

**New API (v1.6.0):**

```tsx
import { ChordDiagram } from "svguitar-react";

<ChordDiagram chord={chordData} width={200} height={250} dotColor="#FF5733" fontFamily="Arial, sans-serif" />;
```

#### 🛠️ Technical Improvements

- **Code Cleanup**: Removed duplicate type definitions
- **Performance**: Reduced bundle size by removing unused exports
- **Developer Experience**: More intuitive and React-like API
- **Type Safety**: Maintained full TypeScript support with better inference

#### 🎨 Benefits

- **Simpler API**: More intuitive for React developers
- **Better Performance**: Smaller bundle size
- **Improved DX**: Better IntelliSense and type checking
- **Consistent**: Follows React patterns for prop passing

---

## Version 1.5.0

**Release Date:** January 27, 2025

### 🚀 Enhanced Mobile Experience

This release focuses on further improving the mobile experience with updated default settings and better responsive behavior.

#### 📱 Updated Mobile Defaults

Enhanced mobile defaults for improved user experience:

| Setting        | Previous Mobile | New Mobile | Desktop | Change |
| -------------- | --------------- | ---------- | ------- | ------ |
| Width          | 270px           | 348px      | 695px   | +78px  |
| Height         | 255px           | 222px      | 250px   | -33px  |
| Fret Width     | 48px            | 53px       | 57px    | +5px   |
| Fret Count     | 8 (default)     | 5          | 8       | -3     |
| Dot Size       | 18px            | 18px       | 16px    | =      |
| Barre Height   | 6px             | 6px        | 7px     | =      |
| Fret Height    | 27px            | 27px       | 30px    | =      |
| Fret Text Size | 21px            | 21px       | 20px    | =      |

#### ⚙️ Technical Improvements

- **Enhanced Responsive Design**: Added width and fretCount parameters to device-specific defaults
- **Better Mobile Optimization**: Improved mobile proportions for better touch interaction
- **Consistent Default Management**: Unified approach to managing mobile and desktop defaults
- **Improved Device Detection**: Better mobile/desktop detection and configuration

#### 🎯 User Experience

- **Better Mobile Proportions**: Optimized dimensions for mobile devices
- **Consistent Behavior**: Maintains desktop functionality while enhancing mobile experience
- **Preserved Customization**: User-defined settings in URL parameters are still respected
- **Seamless Switching**: Automatic detection and application of appropriate settings

#### 🔧 Developer Experience

- **Cleaner Code**: Better organization of default settings
- **Type Safety**: Enhanced TypeScript support for default configurations
- **Maintainability**: Centralized default management for easier maintenance

### 🐛 Bug Fixes

- Fixed default value management for width and fretCount parameters
- Improved responsive behavior consistency
- Enhanced mobile detection accuracy

### 📚 Documentation

- Updated changelog with detailed mobile optimization information
- Enhanced release notes with comprehensive feature descriptions
- Added technical implementation details for developers

---

## Version 1.4.0

**Release Date:** January 27, 2025

### 🚀 Major Mobile Enhancements

This release focuses on significantly improving the mobile experience with automatic optimizations and enhanced usability.

#### 📱 Mobile-First Features

- **Automatic Mobile Detection**: The component now automatically detects mobile devices (screen width ≤ 960px) and applies optimized settings
- **Sticky SVG Positioning**: The chord diagram stays fixed at the top of the screen during scroll on mobile devices
- **Responsive Design**: Enhanced touch interactions and visual feedback for mobile users

#### ⚙️ Mobile-Optimized Defaults

When mobile mode is detected, the following settings are automatically applied for better mobile experience:

| Setting          | Desktop | Mobile | Change |
| ---------------- | ------- | ------ | ------ |
| Height           | 250px   | 299px  | +49px  |
| Fret Width       | 57px    | 73px   | +16px  |
| Dot Text Size    | 13px    | 11px   | -2px   |
| Dot Size         | 16px    | 20px   | +4px   |
| Barre Height     | 7px     | 5px    | -2px   |
| Fret Height      | 30px    | 38px   | +8px   |
| Tuning Text Size | 13px    | 20px   | +7px   |
| Fret Text Size   | 20px    | 23px   | +3px   |

#### 🎨 Visual Improvements

- **Backdrop Blur Effect**: Added modern backdrop blur to the sticky SVG container
- **Enhanced Shadows**: Improved visual depth with better shadow effects
- **Smooth Transitions**: Responsive behavior with smooth transitions between desktop and mobile modes

#### 🔧 Technical Improvements

- **New Hook**: Added `useIsMobile()` hook for responsive behavior detection
- **TypeScript Enhancements**: Improved type safety with better error handling
- **Code Quality**: Fixed linting issues and improved overall code quality
- **Performance**: Optimized rendering for mobile devices

#### 🎯 User Experience

- **Seamless Switching**: Automatic detection and application of mobile settings
- **Preserved Customization**: User-defined settings in URL parameters are respected
- **Better Accessibility**: Enhanced mobile accessibility with larger touch targets
- **Consistent Behavior**: Maintains desktop functionality while enhancing mobile experience

### 🐛 Bug Fixes

- Fixed TypeScript compilation errors related to error code types
- Resolved linting issues for better code quality
- Improved error handling in component rendering
- Fixed Vercel build error by correcting import path in App.tsx

### 📚 Documentation

- Updated changelog with detailed mobile optimization information
- Enhanced release notes with comprehensive feature descriptions
- Added technical implementation details for developers

---

## Version 1.3.1

**Release Date:** September 28, 2025

### New Features

- **Internationalization (i18n)**: The application now supports both English (default) and Portuguese. A language switcher has been added to the control panel, and the selected language is persisted in the URL via the `lang` query parameter.

---

# Release Notes - @svguitar/react v1.3.0

## 🎸 @svguitar/react v1.3.0 - Validation Policy & Error Handling

**Release Date**: September 28, 2025

### 🆕 What's New in v1.3.0

- Validation policy: `validation` (strict | lenient)
- Invalid input behavior: `invalidBehavior` (keep-previous | render-fallback | suppress)
- Fallback chord: `fallbackChord` (default "000000")
- Error handling hooks: `onError` (delegate UI/telemetry) and `errorFallback` (inline UI)

### ✨ Defaults

- `validation="strict"`
- `invalidBehavior="keep-previous"`
- `fallbackChord="000000"`

### 📚 Examples

```tsx
<ChordDiagram
  instrument={{ strings: 6, frets: 4, tuning: ["E2","A2","D3","G3","B3","E4"], chord: "x3201" }}
  validation="strict"
  invalidBehavior="keep-previous"
  fallbackChord="000000"
  onError={(err, ctx) => console.error(ctx.code, err.message)}
/>

<ChordDiagram
  instrument={{ strings: 6, frets: 4, tuning, chord: "x32a10" }}
  validation="lenient"
  errorFallback={err => <div role="alert">{err.message}</div>}
/>
```

### 📋 Full Changelog

See [CHANGELOG.md](./CHANGELOG.md) for complete details.

---

# Release Notes - @svguitar/react v1.2.1

## 🎸 @svguitar/react v1.2.1 - Simplified API & Consistent Sizing

**Release Date**: December 19, 2024

### 🆕 What's New in v1.2.1

We're simplifying the API by removing redundant size properties and ensuring consistent sizing across all indicators!

### ✨ API Simplification

- **🎯 Consistent Sizing**: All indicators (fingers, open strings, muted strings) now use `dotSize` for uniform appearance
- **🧹 Cleaner API**: Removed `openStringSize` and `mutedStringSize` properties to reduce complexity
- **📐 Simplified Configuration**: One size property controls all indicator sizes for better consistency

### 🚨 Breaking Changes

- **Removed Properties**: `openStringSize` and `mutedStringSize` are no longer available
- **Migration Required**: Use `dotSize` to control all indicator sizes
- **Backward Compatibility**: Existing code will need to be updated to remove these properties

### 🔧 Migration Guide

**Before (v1.2.0):**

```tsx
const style = {
	dotSize: 12,
	openStringSize: 14, // ❌ No longer available
	mutedStringSize: 16, // ❌ No longer available
};
```

**After (v1.2.1):**

```tsx
const style = {
	dotSize: 12, // ✅ Controls all indicator sizes
};
```

### 📋 Full Changelog

See [CHANGELOG.md](./CHANGELOG.md) for complete details.

---

# Release Notes - @svguitar/react v1.2.0

## 🎸 @svguitar/react v1.2.0 - Enhanced Dot Positioning & Fret Width Responsiveness

**Release Date**: December 19, 2024

### 🆕 What's New in v1.2.0

We're excited to announce significant improvements to **@svguitar/react** with enhanced dot positioning and dynamic fret width responsiveness!

### ✨ Enhanced Features

- **🎯 Perfect Dot Centering**: Finger dots now automatically center within fret spaces regardless of `fretWidth` changes
- **📐 Dynamic Fret Width Support**: Dots maintain perfect positioning when fret width is adjusted
- **🔧 Centralized Positioning Logic**: New utility functions ensure consistent positioning across all components
- **⚡ Improved Performance**: Optimized positioning calculations for better rendering performance

### 🎨 Visual Improvements

```tsx
// Dots now perfectly center regardless of fretWidth changes
<ChordDiagram
	chord={chord}
	style={{
		fretWidth: 25, // Small fret width - dots still perfectly centered
		// ... other styles
	}}
/>

<ChordDiagram
	chord={chord}
	style={{
		fretWidth: 75, // Large fret width - dots still perfectly centered
		// ... other styles
	}}
/>
```

### 🔧 Technical Improvements

#### Enhanced Positioning Formula

```tsx
// New centralized positioning with 0.5 centering factor
const x = startX + (finger.fret - firstFret + 0.5) * fretWidth;
```

#### New Utility Functions

```tsx
// Centralized positioning utilities
import { getStartX, getStartY, getFingerX, getFingerY } from "@svguitar/react";

// Calculate starting positions
const startX = getStartX({ fretWidth, tuningTextSize });
const startY = getStartY({ fretTextSize });

// Calculate finger positions with perfect centering
const fingerX = getFingerX(finger, firstFret, fretWidth, startX);
const fingerY = getFingerY(finger, stringCount, fretHeight, startY);
```

### 🧪 Quality Improvements

- ✅ Enhanced positioning consistency across all components
- ✅ Improved fret width responsiveness
- ✅ Centralized utility functions for better maintainability
- ✅ All existing functionality preserved
- ✅ Comprehensive test coverage maintained (11/11 tests passing)

### 📊 Technical Details

- **Bundle Size**: 21.41 kB (ESM) / 14.57 kB (CJS)
- **Performance**: Optimized positioning calculations
- **Compatibility**: 100% backward compatible
- **Testing**: 11 Storybook tests + comprehensive unit tests

---

## 🎸 @svguitar/react v1.1.0 - Open & Muted String Support

**Release Date**: December 19, 2024

### 🆕 What's New in v1.1.0

We're excited to announce a major enhancement to **@svguitar/react** with comprehensive support for open and muted strings in guitar chord diagrams!

### ✨ New Features

- **🎯 Open String Support**: Render open strings as 'O' circles at fret zero
- **🚫 Muted String Support**: Display muted strings as red 'X' symbols at fret zero
- **🎨 Custom Indicators**: Full control over colors and sizes of open/muted string indicators
- **📍 Smart Positioning**: Indicators positioned at fret zero (leftmost) for clear visual distinction
- **🔧 Enhanced API**: New `is_muted` property in `Finger` interface for precise control

### 🎨 Visual Enhancements

```tsx
// Open and muted strings with custom styling
<ChordDiagram
	chord={{
		fingers: [
			{ fret: 1, string: 2, is_muted: false, text: "1" },
			{ fret: 0, string: 1, is_muted: false }, // Open string (O)
			{ fret: 0, string: 3, is_muted: true }, // Muted string (X)
		],
		barres: [],
	}}
	style={{
		openStringColor: "#00FF00", // Green for open strings
		mutedStringColor: "#FF0000", // Red for muted strings
		openStringSize: 14,
		mutedStringSize: 16,
	}}
/>
```

### 🔧 API Improvements

#### Enhanced Finger Interface

```tsx
interface Finger {
	fret: number; // Now supports 0 for open strings
	string: number;
	is_muted: boolean; // NEW: indicates if string is muted
	text?: string;
}
```

#### New Style Properties

```tsx
interface ChordStyle {
	// ... existing properties
	openStringSize: number; // NEW: size of open string indicator
	mutedStringSize: number; // NEW: size of muted string indicator
	openStringColor: string; // NEW: color of open string indicator
	mutedStringColor: string; // NEW: color of muted string indicator
}
```

### 🎼 Fret Notation Enhancement

```tsx
// Enhanced fret notation parsing
<ChordDiagram
	instrument={{
		tuning: ["E", "A", "D", "G", "B", "E"],
		chord: "x32010", // 'x' = muted, '0' = open, numbers = fretted
	}}
/>
```

### 🧪 Quality Improvements

- ✅ Enhanced test coverage with new open/muted string tests
- ✅ Performance test story rendering 50 chord diagrams
- ✅ Improved visual positioning and rendering
- ✅ Backward compatibility maintained
- ✅ Comprehensive TypeScript type safety

### 📊 Technical Details

- **Bundle Size**: 20.00 kB (ESM) / 13.82 kB (CJS)
- **Performance**: Optimized rendering with React.memo
- **Compatibility**: All existing functionality preserved
- **Testing**: 11 Storybook tests + comprehensive unit tests

---

## 🎸 @svguitar/react v1.0.0 - Initial Release

**Release Date**: December 19, 2024

### 🚀 What's New

We're excited to announce the first release of **@svguitar/react**, a high-performance React component for rendering beautiful guitar chord diagrams in SVG format.

### ✨ Key Features

- **🎸 Beautiful Chord Diagrams**: Render professional-quality guitar chord diagrams in SVG format
- **⚡ High Performance**: Optimized with React.memo and efficient rendering for smooth performance
- **🎨 Fully Customizable**: Complete control over colors, fonts, sizes, and spacing
- **📱 Responsive**: SVG-based rendering that scales perfectly on any device
- **🔧 TypeScript First**: Full TypeScript support with comprehensive type definitions
- **🧪 Well Tested**: 18 comprehensive tests with 100% pass rate
- **📚 Great Documentation**: Interactive Storybook with live examples

### 🎯 Use Cases

Perfect for:

- Music education applications
- Guitar learning platforms
- Chord reference tools
- Music composition software
- Guitar tablature applications
- Any app that needs to display guitar chords

### 🛠️ Installation

```bash
pnpm install @svguitar/react
# or
npm install @svguitar/react
# or
yarn add @svguitar/react
```

### 📖 Quick Start

```tsx
import React from "react";
import { ChordDiagram } from "@svguitar/react";

const App = () => {
	const cMajor = {
		fingers: [
			{ fret: 1, string: 2, text: "1" },
			{ fret: 2, string: 4, text: "2" },
			{ fret: 3, string: 5, text: "3" },
		],
		barres: [],
	};

	return <ChordDiagram chord={cMajor} />;
};
```

### 🎨 Customization

```tsx
<ChordDiagram
	chord={chordData}
	style={{
		width: 200,
		height: 250,
		dotColor: "#FF5733",
		stringColor: "#CCCCCC",
		fontFamily: "Arial, sans-serif",
	}}
/>
```

### 🔧 Advanced Features

- **Fret Notation Support**: Parse strings like "x32010" or "(10)(12)..."
- **Barre Chords**: Full support for barre chords across multiple strings
- **Custom Tunings**: Support for any guitar tuning
- **High Positions**: Display chords in higher fret positions
- **Open Strings**: Handle open and muted strings

### 📊 Technical Specifications

- **Bundle Size**: 18.22 kB (ESM) / 12.86 kB (CJS)
- **Dependencies**: React 18+ (peer dependency)
- **TypeScript**: Full type definitions included
- **Browser Support**: All modern browsers
- **Tree Shaking**: Fully supported

### 🧪 Quality Assurance

- ✅ 18 comprehensive tests (100% passing)
- ✅ Full TypeScript coverage
- ✅ ESLint and Prettier configured
- ✅ Storybook documentation
- ✅ Performance optimized

### 📚 Documentation

- [README.md](./README.md) - Complete usage guide
- [Storybook](http://localhost:6006) - Interactive examples
- [API Reference](./README.md#api-reference) - Complete API documentation

### 🤝 Contributing

We welcome contributions! Please see our [Contributing Guide](./CONTRIBUTING.md) for details.

### 📄 License

MIT License - see [LICENSE](./LICENSE) file for details.

### 🔗 Links

- [GitHub Repository](https://github.com/svguitar/svguitar-react)
- [NPM Package](https://www.npmjs.com/package/@svguitar/react)
- [Documentation](https://github.com/svguitar/svguitar-react#readme)

---

**Thank you for using @svguitar/react!** 🎸

If you find this library helpful, please consider giving it a ⭐ on GitHub!
