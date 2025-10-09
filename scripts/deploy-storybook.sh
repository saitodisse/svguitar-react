#!/bin/bash

# Script para deploy do Storybook na Vercel
# Uso: ./scripts/deploy-storybook.sh [--production]

set -e

echo "🚀 Deploy do Storybook na Vercel"
echo "================================="

# Verificar se vercel CLI está instalado
if ! command -v vercel &> /dev/null; then
    echo "❌ Vercel CLI não encontrado"
    echo "📦 Instalando Vercel CLI..."
    pnpm add -g vercel
fi

# Verificar se está logado
echo "🔐 Verificando autenticação..."
if ! vercel whoami &> /dev/null; then
    echo "❌ Não está autenticado na Vercel"
    echo "🔑 Faça login:"
    vercel login
fi

# Build do Storybook
echo ""
echo "📚 Building Storybook..."
pnpm build-storybook

# Verificar se o build foi bem-sucedido
if [ ! -d "storybook-static" ]; then
    echo "❌ Erro: pasta storybook-static não encontrada"
    exit 1
fi

echo "✅ Build concluído!"

# Deploy
echo ""
echo "🚀 Fazendo deploy..."

if [ "$1" == "--production" ] || [ "$1" == "-p" ]; then
    echo "📦 Deploy de PRODUÇÃO"
    vercel deploy storybook-static --prod --yes
else
    echo "🔍 Deploy de PREVIEW"
    vercel deploy storybook-static --yes
fi

echo ""
echo "✨ Deploy concluído!"
echo ""
echo "📖 Para mais informações, veja: STORYBOOK_DEPLOY.md"

