---
name: finalizar
description: Fecha um release do svguitar-react com testes, build, bump de versão, CHANGELOG e RELEASE_NOTES, commit, push, deploy do Storybook na Vercel e orientação para publish no npm. Use quando o usuário disser "finalizar", pedir release, encerrar entrega ou executar o fluxo de publicação da biblioteca.
---

# Finalizar release — svguitar-react

Somente prosseguir quando **todos** os passos de validação passarem. Se algo falhar, corrigir antes de versionar ou commitar.

## Pré-requisito

Confirmar com o usuário o tipo de bump SemVer (`patch`, `minor`, `major`) se não estiver explícito no pedido.

## Checklist

```
- [ ] 1. Testes unitários (Vitest)
- [ ] 2. Testes Storybook (test-storybook)
- [ ] 3. Build da biblioteca
- [ ] 4. Storybook sobe sem erro (smoke)
- [ ] 5. Versão em package.json
- [ ] 6. CHANGELOG.md
- [ ] 7. RELEASE_NOTES.md
- [ ] 8. Git stage + commit + push
- [ ] 9. Deploy Storybook produção
- [ ] 10. Usuário publica no npm (manual)
```

## Passo 1 — Testes unitários

```bash
pnpm test:run
```

## Passo 2 — Testes Storybook

Garantir que o Storybook pode ser exercitado (CI usa storybook em modo ci quando necessário):

```bash
pnpm test-storybook
```

Se falhar por servidor ausente, iniciar em outro terminal: `pnpm storybook:ci` e repetir.

## Passo 3 — Build

```bash
pnpm build
```

## Passo 4 — Smoke do Storybook

Verificar que o Storybook inicia sem erro (encerrar após validação):

```bash
pnpm storybook
```

Alternativa mais rápida se o projeto já valida via test-storybook: confiar no passo 2 se estiver verde.

## Passo 5 — Versionamento

1. Ler versão atual em `package.json`.
2. Incrementar conforme SemVer acordado.
3. Atualizar o campo `version`.

## Passo 6 — CHANGELOG.md

1. Nova entrada no **topo** com versão e data (`YYYY-MM-DD`).
2. Resumir mudanças reais (features, fixes, deps relevantes).
3. Não listar apenas “rodou testes” ou “incrementou versão”.

## Passo 7 — RELEASE_NOTES.md

1. Nova seção `## Version X.Y.Z` com data.
2. Tom voltado ao consumidor da biblioteca (o que mudou e impacto).
3. Alinhar com o CHANGELOG, com mais contexto de release quando fizer sentido.

## Passo 8 — Formatação e lint (antes do commit)

```bash
pnpm format
pnpm lint
```

## Passo 9 — Git

```bash
git add -A
git status   # revisar stage — só arquivos da release
git commit -m "$(cat <<'EOF'
chore(release): vX.Y.Z

- <bullet 1>
- <bullet 2>
EOF
)"
git push
```

Mensagem de commit em inglês (Conventional Commits). Ajustar tipo (`feat`, `fix`, `chore`) se a release for majoritariamente feature ou correção.

## Passo 10 — Deploy Storybook (Vercel)

```bash
pnpm deploy-storybook:prod
```

## Passo 11 — Publicação npm (usuário)

**Não** rodar publish automaticamente. Pedir ao usuário:

```bash
pnpm publish
```

(ou `npm publish` se preferir o fluxo npm após build — o pacote é publicado no registro npm.)

## Regras

- Não fazer push nem bump se testes ou build falharem.
- Não incluir arquivos não relacionados no commit de release.
- Responder em português ao guiar o processo; commit em inglês.
