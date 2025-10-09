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

# Criar um package.json temporário na pasta storybook-static
cat > storybook-static/package.json << 'EOF'
{
  "name": "svguitar-react-storybook",
  "version": "1.0.0",
  "private": true
}
EOF

# Criar vercel.json na pasta storybook-static para servir como site estático
cat > storybook-static/vercel.json << 'EOF'
{
  "buildCommand": null,
  "outputDirectory": ".",
  "framework": null
}
EOF

if [ "$1" == "--production" ] || [ "$1" == "-p" ]; then
    echo "📦 Deploy de PRODUÇÃO"
    cd storybook-static && vercel --prod --yes && cd ..
else
    echo "🔍 Deploy de PREVIEW"
    cd storybook-static && vercel --yes && cd ..
fi

# Limpar arquivos temporários
rm -f storybook-static/package.json
rm -f storybook-static/vercel.json

echo ""
echo "✨ Deploy concluído!"
echo ""
echo "📖 Para mais informações, veja: STORYBOOK_DEPLOY.md"

