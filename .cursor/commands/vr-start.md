---
description: Iniciar servidor Visual Replies para receber perguntas do LLM
---

Este comando inicia o servidor Visual Replies que permite ao LLM fazer perguntas estruturadas ao usuário.

## Primeira Vez (Setup)

Se é a primeira vez executando:

```bash
cd /home/saito/_git/visual-replies
pnpm install
pnpm build
```

## Iniciar Servidor

```bash
cd /home/saito/_git/visual-replies
pnpm start
```

**Porta**: 9876  
**URL**: http://localhost:9876

## Verificação

1. Servidor iniciou com sucesso quando aparecer: `Ready on http://localhost:9876`
2. **Manter o terminal aberto** - não feche
3. **Abrir navegador** em http://localhost:9876
4. Página deve mostrar: "Nenhuma pergunta pendente. Aguardando..."

## Troubleshooting

**Erro "EADDRINUSE" (porta já em uso)**:

```bash
# Encontrar processo usando porta 9876
lsof -i :9876

# Matar processo
kill -9 <PID>
```

**Servidor não inicia**:

```bash
# Limpar e reinstalar
rm -rf node_modules pnpm-lock.yaml
pnpm install
pnpm build
pnpm start
```

## Após Servidor Rodando

Agora você (LLM) pode usar `/vr-ask` para fazer perguntas estruturadas ao usuário via API.
