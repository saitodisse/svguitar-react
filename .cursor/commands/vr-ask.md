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

## Exemplo: Múltiplas Perguntas no Mesmo POST (Uso Real)

Este exemplo mostra um caso real com 3 perguntas relacionadas, cada uma com diferentes níveis de metadados:

````bash
curl -X POST http://localhost:9876/api/questions \
  -H "Content-Type: application/json" \
  -d '{
    "questions": [
      {
        "questionType": "clarification",
        "text": "Qual deve ser a regra para autoFirstFret quando há cordas soltas (fret 0)?",
        "description": "## Problema Atual\n\nO chord **\"005500\"** está renderizando frets **5-9** ao invés de **1-5**.\n\n### Análise do Chord \"005500\"\n```\nString 1: 0 (open)\nString 2: 0 (open)\nString 3: 5 (pressed)\nString 4: 5 (pressed)\nString 5: 0 (open)\nString 6: 0 (open)\n```\n\n**Situação Atual:**\n- Dedos pressionados: fret 5 (strings 3 e 4)\n- `minFret = 5` → `firstFret = 5`\n- Renderiza frets 5-9 ❌\n\n**Expectativa:**\n- Renderizar frets 1-5 ✅\n- Manter `firstFret = 1` (padrão)",
        "options": [
          "Só ajustar firstFret se dedos NÃO cabem no range 1-fretCount",
          "Sempre mostrar cordas soltas quando existirem (firstFret=1)",
          "Regra híbrida: ajustar só se maxFret > fretCount"
        ],
        "allowMultiple": false,
        "allowText": true,
        "textPlaceholder": "Explique a regra desejada em detalhes...",
        "optionsMetadata": {
          "Só ajustar firstFret se dedos NÃO cabem no range 1-fretCount": {
            "pros": ["Sempre mostra cordas soltas quando possível", "Mantém visualização familiar (frets 1-5)", "Economiza espaço vertical"],
            "cons": ["Pode não funcionar bem com fretCount pequeno", "Regra mais complexa de implementar"],
            "whenToUse": "Quando você quer priorizar visualização de cordas soltas"
          },
          "Sempre mostrar cordas soltas quando existirem (firstFret=1)": {
            "pros": ["Regra simples", "Cordas soltas sempre visíveis", "Comportamento previsível"],
            "cons": ["Pode gerar diagramas muito longos", "Desperdício de espaço se dedos estão no fret 12+"],
            "whenToUse": "Quando cordas soltas são críticas para a visualização"
          },
          "Regra híbrida: ajustar só se maxFret > fretCount": {
            "pros": ["Balance entre espaço e funcionalidade", "Mantém firstFret=1 quando possível"],
            "cons": ["Regra um pouco mais complexa"],
            "whenToUse": "Melhor dos dois mundos"
          }
        },
        "codeContext": [
          {
            "filePath": "src/components/ChordDiagram/utils/autoFirstFret.ts",
            "lineRange": [93, 136],
            "explanation": "Algoritmo atual de calculateAutoFirstFret"
          }
        ],
        "metadata": {
          "timestamp": "2025-10-13T00:00:00.000Z",
          "rationale": "Precisamos entender a regra exata para quando ajustar ou não o firstFret quando há cordas soltas.",
          "confidence": 60,
          "impact": "high",
          "category": "architecture",
          "recommendedOption": {
            "option": "Regra híbrida: ajustar só se maxFret > fretCount",
            "reason": "Balance ideal: mantém firstFret=1 quando dedos cabem no range padrão, mas ajusta quando necessário."
          }
        }
      },
      {
        "questionType": "validation",
        "text": "Confirme: com fretCount=5, \"005500\" deve renderizar frets 1-5?",
        "description": "## Validação de Comportamento\n\nPara o chord **\"005500\"** com `fretCount=5`:\n\n### Opção A: Renderizar frets 1-5\n```\nfirstFret = 1\nlastFret = 5\nFrets visíveis: 1, 2, 3, 4, 5\n```\n✅ Dedos no fret 5 são visíveis\n✅ Cordas soltas (fret 0) são visíveis acima do fret 1\n\n### Opção B: Renderizar frets 5-9 (atual)\n```\nfirstFret = 5\nlastFret = 9\nFrets visíveis: 5, 6, 7, 8, 9\n```\n❌ Cordas soltas não aparecem no diagrama\n❌ Frets 6-9 estão vazios (desperdício de espaço)",
        "options": [
          "Opção A: frets 1-5 (com cordas soltas visíveis)",
          "Opção B: frets 5-9 (comportamento atual)",
          "Outro comportamento (especificar no texto)"
        ],
        "allowMultiple": false,
        "allowText": true,
        "textPlaceholder": "Descreva o comportamento esperado...",
        "metadata": {
          "timestamp": "2025-10-13T00:00:00.000Z",
          "rationale": "Confirmar o comportamento esperado antes de implementar a correção.",
          "confidence": 85,
          "impact": "high",
          "category": "configuration",
          "recommendedOption": {
            "option": "Opção A: frets 1-5 (com cordas soltas visíveis)",
            "reason": "Faz sentido mostrar cordas soltas quando os dedos cabem no range padrão."
          }
        }
      },
      {
        "questionType": "clarification",
        "text": "Para \"006600\", qual fretCount você usa e qual o comportamento esperado?",
        "description": "## Caso \"006600\"\n\n### Análise\n```\nString 1: 0 (open)\nString 2: 0 (open)\nString 3: 6 (pressed)\nString 4: 6 (pressed)\nString 5: 0 (open)\nString 6: 0 (open)\n```\n\n### Cenários Possíveis\n\n**Cenário 1: fretCount=4**\n- Dedos no fret 6 NÃO cabem em 1-4\n- Ajusta para firstFret=6, renderiza 6-9\n\n**Cenário 2: fretCount=5**\n- Dedos no fret 6 NÃO cabem em 1-5\n- Ajusta para firstFret=6, renderiza 6-10\n\n**Cenário 3: fretCount=6**\n- Dedos no fret 6 cabem em 1-6\n- Mantém firstFret=1, renderiza 1-6",
        "options": [
          "Ajustar firstFret sempre que maxFret > fretCount",
          "Ajustar firstFret sempre que minFret > 1",
          "Depende: se há muitas cordas soltas, manter firstFret=1",
          "Outro critério (especificar)"
        ],
        "allowMultiple": false,
        "allowText": true,
        "textPlaceholder": "Explique o critério exato...",
        "optionsMetadata": {
          "Ajustar firstFret sempre que maxFret > fretCount": {
            "pros": ["Regra clara e objetiva", "Fácil de implementar", "Economiza espaço quando possível"],
            "cons": ["Pode perder visualização de cordas soltas"],
            "whenToUse": "Quando você quer otimizar espaço vertical do diagrama"
          },
          "Ajustar firstFret sempre que minFret > 1": {
            "pros": ["Maximiza uso do espaço", "Foca nos dedos pressionados"],
            "cons": ["Perde completamente as cordas soltas", "Pode ser confuso para iniciantes"],
            "whenToUse": "Quando cordas soltas não são importantes"
          },
          "Depende: se há muitas cordas soltas, manter firstFret=1": {
            "pros": ["Flexível", "Considera contexto do chord"],
            "cons": ["Regra complexa", "Comportamento menos previsível"],
            "whenToUse": "Quando você quer um balance contextual"
          }
        },
        "metadata": {
          "timestamp": "2025-10-13T00:00:00.000Z",
          "rationale": "Entender quando ajustar o firstFret para casos com dedos em posições altas mas com cordas soltas.",
          "confidence": 70,
          "impact": "high",
          "category": "architecture",
          "recommendedOption": {
            "option": "Ajustar firstFret sempre que maxFret > fretCount",
            "reason": "Simples e objetivo: só ajusta se dedos não cabem no range padrão."
          }
        }
      }
    ]
  }'
````

**Notas sobre este exemplo:**

- **3 perguntas relacionadas**: Demonstra um fluxo de clarificação progressiva
- **Diferentes níveis de metadados**:
    - Perguntas 1 e 3: `optionsMetadata` completo com pros/cons
    - Pergunta 2: Sem `optionsMetadata` nem `codeContext` (mais simples)
- **Tipos variados**: `clarification` → `validation` → `clarification`
- **Contexto rico**: Markdown com exemplos de código, comparações visuais
- **Recomendações**: Todas têm `recommendedOption` com justificativa

Todas as perguntas serão exibidas na UI e o usuário responde todas de uma vez.

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
