---
description: Fazer perguntas ao usuário via Visual Replies API
---

**Me Faça Perguntas usando POST para http://localhost:9876/api/questions**

Quando você (LLM) precisar de input do usuário, use esta API em vez de perguntar via chat.

## Interface TypeScript Completa (v2 - Semantic)

```typescript
interface Question {
	version: "1.0.0";
	id?: string; // OPCIONAL - auto-gerado se não fornecido
	questionType: // OBRIGATÓRIO - tipo semântico
	| "architecture" // Decisões estruturais
		| "style" // Preferências de código
		| "configuration" // Setup de ferramentas
		| "preference" // Escolhas subjetivas
		| "clarification" // Entender requisitos
		| "validation" // Confirmar decisão
		| "refactoring" // Melhorias de código
		| "debugging"; // Escolhas durante bug fix
	text: string; // Pergunta (1-500 chars)
	description?: string; // Markdown (0-5000 chars)
	options: string[]; // Min 1, max 20
	allowMultiple: boolean; // checkboxes ou radio
	allowText: boolean; // Permite texto adicional?
	textPlaceholder?: string;

	// NOVOS CAMPOS SEMÂNTICOS:
	optionsMetadata?: {
		[optionText: string]: {
			pros?: string[]; // Vantagens
			cons?: string[]; // Desvantagens
			impact?: string; // Impacto (max 200 chars)
			tradeoffs?: string; // Tradeoffs (max 300 chars)
			whenToUse?: string; // Quando usar (max 200 chars)
		};
	};

	codeContext?: Array<{
		filePath: string;
		lineRange?: [number, number]; // [início, fim]
		explanation?: string; // max 200 chars
	}>; // Max 5 referências

	metadata?: {
		timestamp: string; // ISO 8601
		source?: string;
		priority?: number; // 1-5
		tags?: string[];
		// NOVOS CAMPOS SEMÂNTICOS:
		rationale?: string; // Por quê está perguntando (max 500 chars)
		confidence?: number; // 0-100
		impact?: "low" | "medium" | "high" | "critical";
		category?: "architecture" | "styling" | "configuration" | "preference"; // ATENÇÃO: "styling" (não "style") - diferente de questionType
		recommendedOption?: {
			option: string; // Deve existir em options
			reason: string; // max 300 chars
		};
	};
}
```

## Exemplo Simples (sem ID - auto-gerado)

```bash
curl -X POST http://localhost:9876/api/questions \
  -H "Content-Type: application/json" \
  -d '{
    "questions": [
      {
        "questionType": "preference",
        "text": "Qual database você prefere?",
        "options": ["PostgreSQL", "MongoDB", "MySQL"],
        "allowMultiple": false,
        "allowText": true,
        "textPlaceholder": "Explique..."
      }
    ]
  }'
```

**Nota**: O campo `id` é opcional. Se não fornecido, o backend gera automaticamente.

## ⚠️ IMPORTANTE: Diferenças Entre Campos

### `questionType` vs `metadata.category`

Estes dois campos têm valores **diferentes** e **não são intercambiáveis**:

**`questionType`** (obrigatório):

- `"architecture"` ✅
- `"style"` ✅ (não "styling")
- `"configuration"` ✅
- `"preference"` ✅
- `"clarification"` ✅
- `"validation"` ✅
- `"refactoring"` ✅
- `"debugging"` ✅

**`metadata.category`** (opcional):

- `"architecture"` ✅
- `"styling"` ✅ (não "style" - note a diferença!)
- `"configuration"` ✅
- `"preference"` ✅

**Erro Comum**: Usar `"style"` em `metadata.category` ou `"styling"` em `questionType`. Isso causará erro de validação!

## Exemplo Completo: Pergunta Semântica Rica

````bash
curl -X POST http://localhost:9876/api/questions \
  -H "Content-Type: application/json" \
  -d '{
    "questions": [
      {
        "questionType": "architecture",
        "text": "Qual estratégia de cache você prefere para esta API?",
        "description": "## Contexto\n\nA API terá **alto tráfego** (10k req/min) e dados que mudam a cada 5min.\n\n```typescript\n// Endpoint atual sem cache\nexport async function GET() {\n  const data = await db.query();\n  return Response.json(data);\n}\n```",
        "options": ["Redis", "Memcached", "In-memory (Node)", "CDN Edge Cache"],
        "allowMultiple": false,
        "allowText": true,
        "textPlaceholder": "Explique considerações de infraestrutura...",
        "optionsMetadata": {
          "Redis": {
            "pros": ["Persistência", "Estruturas avançadas", "TTL automático"],
            "cons": ["Infraestrutura adicional", "Custo de rede"],
            "whenToUse": "Cache distribuído com múltiplas instâncias"
          },
          "Memcached": {
            "pros": ["Simples", "Rápido", "Leve"],
            "cons": ["Sem persistência", "Sem estruturas complexas"],
            "whenToUse": "Cache volátil de chave-valor simples"
          },
          "In-memory (Node)": {
            "pros": ["Zero latência", "Sem infra extra"],
            "cons": ["Não escalável", "Perdido a cada restart"],
            "whenToUse": "Protótipo ou single-instance"
          }
        },
        "codeContext": [
          {
            "filePath": "app/api/products/route.ts",
            "lineRange": [23, 45],
            "explanation": "Endpoint atual sem cache (500ms de latência)"
          }
        ],
        "metadata": {
          "timestamp": "2025-10-12T16:00:00.000Z",
          "source": "cursor",
          "priority": 5,
          "rationale": "Latência atual está impactando UX. Precisamos reduzir de 500ms para <50ms.",
          "confidence": 75,
          "impact": "critical",
          "category": "architecture",
          "recommendedOption": {
            "option": "Redis",
            "reason": "Melhor tradeoff: performance + escalabilidade + features. Vale investir na infra."
          }
        }
      }
    ]
  }'
````

## Como os Campos Semânticos São Renderizados na UI

- **questionType**: Ícone visual (🏗️ architecture, 🎨 style, ⚙️ configuration, 💭 preference, etc.)
- **metadata.category**: Categorização secundária (valores: "architecture" | "styling" | "configuration" | "preference")
- **metadata.impact**: Badge colorido (verde/amarelo/laranja/vermelho)
- **metadata.rationale**: Caixa destacada "Por quê: ..."
- **metadata.recommendedOption**: Box azul com 💡 "Recomendação: ..."
- **metadata.confidence**: Indicador de % no rodapé
- **optionsMetadata.pros/cons**: Listagem ✓/✗ abaixo de cada opção
- **codeContext**: Links 📄 com filePath e line range

## Exemplo: Múltiplas Perguntas no Mesmo POST

```bash
curl -X POST http://localhost:9876/api/questions \
  -H "Content-Type: application/json" \
  -d '{
    "questions": [
      {
        "questionType": "architecture",
        "text": "Qual método de autenticação?",
        "options": ["JWT", "Session-based", "OAuth2"],
        "allowMultiple": false,
        "allowText": false
      },
      {
        "questionType": "configuration",
        "text": "Habilitar ESLint strict mode?",
        "options": ["Sim", "Não"],
        "allowMultiple": false,
        "allowText": true
      }
    ]
  }'
```

Ambas as perguntas serão exibidas na UI e o usuário responde todas de uma vez.

## Quando Usar

**SEMPRE use Visual Replies para:**

- ✅ Decisões de arquitetura
- ✅ Escolhas de tecnologia/bibliotecas
- ✅ Prioridades de features
- ✅ Preferências de design/estilo
- ✅ Configurações de projeto
- ✅ Validação antes de implementar
- ✅ Clarificação de requisitos ambíguos

**NÃO pergunte via chat** - Use a API para perguntas estruturadas.

## Benefícios dos Campos Semânticos

- 🎯 **Contexto Rico**: LLM pode explicar POR QUÊ está perguntando
- 💡 **Recomendações**: LLM pode sugerir opção com justificativa
- 📊 **Pros/Cons**: Usuário vê tradeoffs de cada opção inline
- 📄 **Code Links**: Referências diretas a arquivos relevantes
- 🏷️ **Categorização**: Ícones e badges ajudam usuário a priorizar
- 🎯 **Confiança**: LLM indica nível de certeza na decisão

## Resposta (Não Mudou)

```typescript
interface Answer {
	version: "1.0.0";
	questionId: string;
	selectedOptions: string[];
	additionalText?: string;
	metadata: {
		timestamp: string; // ISO 8601
		responseTimeMs?: number;
	};
}

interface APIResponse {
	success: boolean;
	answers: Answer[];
}
```

## Pré-requisitos

Servidor deve estar rodando. Se não estiver, execute `/vr-start` primeiro.

---

**Dica**: Não precisa mais gerar UUIDs! Omita o campo `id` e o backend gera automaticamente.
