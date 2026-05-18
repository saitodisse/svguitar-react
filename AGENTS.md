# AGENTS.md — svguitar-react

Instruções centrais para agentes de IA e IDEs (Cursor, Copilot, Claude, etc.) neste repositório.

## Visão geral

Biblioteca React (TypeScript) para diagramas de acordes de guitarra em SVG, com Vite, Storybook, Vitest e Prettier.

**Gerenciador de pacotes:** use sempre **pnpm** (nunca npm ou yarn).

**Especificações:** antes de mudanças relevantes, consulte `specs/`. Para auditoria formal, use a skill [`specs-audit`](.cursor/skills/specs-audit/SKILL.md).

## Stack

| Área              | Tecnologia               |
| ----------------- | ------------------------ |
| UI                | React 19, TypeScript 5.8 |
| Build             | Vite 7                   |
| Docs / dev visual | Storybook 9              |
| Testes            | Vitest, test-storybook   |
| Qualidade         | ESLint 9, Prettier 3     |

## Estrutura

```
src/
├── components/ChordDiagram/   # Componente principal da biblioteca
├── components/ui/             # UI auxiliar (demo/app)
├── stories/                   # Stories do Storybook
├── App.tsx, main.tsx
└── index.ts                   # Entry da biblioteca
specs/001-guitar-svg/          # Specs obrigatórias
```

## Comandos (pnpm)

| Script         | Comando                      | Uso                  |
| -------------- | ---------------------------- | -------------------- |
| Dev            | `pnpm dev`                   | App Vite             |
| Build lib      | `pnpm build`                 | Pacote npm           |
| Lint           | `pnpm lint`                  | ESLint               |
| Format         | `pnpm format`                | Prettier (escreve)   |
| Format check   | `pnpm format:check`          | Só verifica          |
| Storybook      | `pnpm storybook`             | Porta 6006           |
| Build SB       | `pnpm build-storybook`       | Estático             |
| Testes unit    | `pnpm test:run`              | Vitest once          |
| Testes watch   | `pnpm test:watch`            | Vitest watch         |
| Testes SB      | `pnpm test-storybook`        | Integração Storybook |
| Coverage       | `pnpm test:coverage`         | Cobertura            |
| Deploy SB prod | `pnpm deploy-storybook:prod` | Vercel (Storybook)   |

## Convenções de código

- **Prettier** (`.prettierrc`): tabs, aspas duplas, `printWidth` 110, semicolons, trailing commas ES5, LF.
- **Componentes:** TypeScript explícito; stories para todo componente novo em `src/stories/` ou junto ao módulo.
- **Imports:** externos primeiro, depois internos.
- Antes de commitar: `pnpm format` e `pnpm lint` sem warnings.

## Especificações do projeto

Consulte antes de implementar ou alterar comportamento da biblioteca:

| Arquivo                              | Conteúdo               |
| ------------------------------------ | ---------------------- |
| `specs/001-guitar-svg/spec.md`       | Requisitos da feature  |
| `specs/001-guitar-svg/plan.md`       | Plano de implementação |
| `specs/001-guitar-svg/tasks.md`      | Tarefas                |
| `specs/001-guitar-svg/research.md`   | Decisões técnicas      |
| `specs/001-guitar-svg/data-model.md` | Modelo de dados        |
| `specs/001-guitar-svg/quickstart.md` | Guia de uso            |
| `specs/001-guitar-svg/contracts/`    | Contratos de API       |

Não implemente funcionalidades fora do que está documentado nas specs sem alinhar com o usuário.

## Skills do repositório

| Skill                                                | Quando usar                                                                      |
| ---------------------------------------------------- | -------------------------------------------------------------------------------- |
| [`finalizar`](.cursor/skills/finalizar/SKILL.md)     | Release: testes, build, versionamento, changelog, commit, push, deploy Storybook |
| [`specs-audit`](.cursor/skills/specs-audit/SKILL.md) | Antes de mudanças grandes: revisar specs, plano e checklist de aceite            |

## Ferramentas MCP (quando aplicável)

- **Storybook visual:** prefira `pnpm test-storybook`; Playwright MCP em `http://localhost:6006/` só com Storybook rodando (`pnpm storybook`).
- **Bibliotecas externas:** use Context7 (MCP) para documentação atualizada antes de integrar APIs novas.

## Comunicação

- Respostas ao usuário em **português (Brasil)**.
- Mensagens de commit em **inglês** (Conventional Commits), salvo pedido contrário.

## Proibido

1. npm ou yarn no lugar de pnpm
2. Commitar código sem formatar
3. Ignorar warnings do ESLint
4. Componentes sem story correspondente
5. Indentação com espaços (use tabs)
6. Mudanças relevantes sem ler `specs/`
7. Features não documentadas nas specs
8. Bibliotecas externas sem checar docs atualizadas (Context7)

## Configuração

`.prettierrc`, `eslint.config.js`, `vite.config.ts`, `tsconfig.json`, `.storybook/`
