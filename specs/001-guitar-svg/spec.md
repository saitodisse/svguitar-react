# Especificação da Feature: Componente de Diagrama de Acordes de Guitarra

**Branch da Feature**: `001-guitar-svg`
**Criada em**: 2025-09-24
**Status**: Rascunho (atualizado com política de validação e tratamento de erros)
**Entrada**: Descrição do usuário: "/specify guitar-svg

**Como um** desenvolvedor de aplicações musicais, **eu quero** um componente React que renderize diagramas de acordes de guitarra de forma declarativa e performática, **para que** eu possa criar interfaces de usuário ricas para ensino musical, aplicativos de acordes ou ferramentas de composição sem depender de bibliotecas externas que causem problemas de performance."

---

## Cenários do Usuário & Testes _(obrigatório)_

### User Story Primária

Como um desenvolvedor, eu quero passar dados de um acorde de guitarra para um componente React e obter um diagrama SVG customizável e de alta performance, para que eu possa exibir acordes de forma clara em minhas aplicações musicais.

### Cenários de Aceitação

1.  **Dado** que tenho um acorde simples (ex: C Major), **Quando** passo as posições dos dedos como props, **Então** o componente renderiza um diagrama SVG com as posições corretas no braço da guitarra.
2.  **Dado** que tenho um acorde com pestana (ex: F Major), **Quando** especifico a pestana e os dedos adicionais, **Então** o componente renderiza a pestana como uma barra e os dedos individuais nas posições corretas.
3.  **Dado** que quero mostrar um acorde em posição alta (ex: 5ª posição), **Quando** especifico a posição inicial, **Então** o componente ajusta o diagrama e mostra o rótulo da posição.
4.  **Dado** que quero customizar a aparência, **Quando** passo propriedades de estilo, **Então** o componente aplica as cores, tamanhos, espaçamentos e fontes especificadas.
5.  **Dado** que uso uma afinação não padrão, **Quando** especifico as notas das cordas no formato de notação científica (ex: `["E2", "A2", "D3", "G3", "B3", "E4"]`), **Então** o componente mostra a afinação correta no diagrama para as cordas soltas.
6.  **Dado** que recebo um acorde representado por Fret Notation (ex: "x32010" para C Major, ou "(10)(12)(10)(10)(10)(10)" para F Major na 10ª casa), **Quando** especifico a afinação das cordas, **Então** o componente renderiza o diagrama com as cordas soltas e as posições dos dedos corretas, utilizando a biblioteca `tonal` para calcular as notas resultantes.
7.  **Dado** que eu especifique cordas soltas e mutadas, **Então** o componente renderiza o diagrama com as cordas soltas e mutadas corretas, colocando um "X" vermelho (#DC143C) espesso no traste zero (primeira linha vertical à esquerda) para cordas mutadas e um "O" (círculo com preenchimento branco e borda na cor padrão dos dedos) no traste zero para cordas soltas, ambos posicionados acima do traste mais grosso, próximos às notas de afinação. Se houver dedos na mesma corda, eles não serão mostrados (cordas mutadas têm precedência).
8.  **Dado** que quero exibir o diagrama na vertical para um músico destro, **Quando** seleciono a view `vertical-right`, **Então** o componente desenha o braço com a corda mais grave (E2) à **esquerda** e renderiza as cordas, da esquerda para a direita, na ordem `["E2", "A2", "D3", "G3", "B3", "E4"]`, mantendo a legibilidade horizontal de labels e números. Os rótulos de afinação são posicionados acima das cordas verticais, da esquerda para a direita. Os números dos trastes são posicionados à direita do braço, alinhados com cada traste horizontal, começando com "0" no topo (nut) e "1, 2, 3..." abaixo, formando uma coluna vertical de números ao lado direito do diagrama.
9.  **Dado** que quero exibir o diagrama para um músico canhoto, **Quando** seleciono a view `horizontal-left` ou `vertical-left`, **Então** o componente desenha o braço conforme a view escolhida, mantendo centralização dos dots e legibilidade horizontal; no caso de `horizontal-left`, os rótulos de afinação aparecem à direita do braço e a numeração dos trastes é apresentada em ordem crescente da direita para a esquerda (lendo da esquerda para a direita resulta, por exemplo, em "3, 2, 1, 0"), com o traste 0 (nut) imediatamente antes dos rótulos de afinação; no caso de `vertical-left`, as cordas são renderizadas, da esquerda para a direita, na ordem `["E4", "B3", "G3", "D3", "A2", "E2"]`, com rótulos de afinação posicionados acima das cordas verticais, da esquerda para a direita, e os números dos trastes posicionados à direita do braço, alinhados com cada traste horizontal, começando com "0" no topo (nut) e "1, 2, 3..." abaixo, formando uma coluna vertical de números ao lado direito do diagrama.

### Casos Limite

- O que acontece quando não há dedos especificados? (O diagrama deve renderizar apenas as cordas, com indicações de cordas soltas ('O') ou mutadas ('X' vermelho) no traste zero, se fornecidas).
- Como o sistema lida com posições inválidas de dedos? (O sistema vai tentar representar o acorde da melhor forma possível, ignorando posições fora do braço).
- O que acontece quando a pestana se sobrepõe incorretamente aos dedos? (A pestana tem prioridade, e os dedos na mesma casa ou anterior são removidos da representação).
- Como o componente lida com definições de afinação inválidas ou incompletas? (Deve lançar um erro).
- O que acontece quando a Fret Notation (string) for inválida? (Deve manter o último acorde válido; se não houver anterior, renderizar o acorde "000000". A querystring pode permanecer com o valor inválido para persistência/compartilhamento.)

## Requisitos _(obrigatório)_

### Requisitos Funcionais

- **FR-001**: O sistema DEVE renderizar diagramas de acordes em formato SVG com alta qualidade.
- **FR-002**: O sistema DEVE aceitar posições de dedos como um array de objetos, cada um contendo `string` e `fret`.
- **FR-003**: O sistema DEVE renderizar pestanas como barras retangulares conectando múltiplas cordas.
- **FR-004**: O sistema DEVE suportar posições de acordes (ex: 1ª posição, 5ª posição) com rótulos apropriados.
- **FR-005**: O sistema DEVE permitir customização visual via props inline (cores, tamanhos, espaçamentos e fontes).
- **FR-006**: O sistema DEVE suportar afinações customizadas das cordas soltas, recebendo um array de strings em notação científica (ex: `["E2", "A2", "D3", "G3", "B3", "E4"]`), representando as cordas da mais grave para a mais aguda.
- **FR-007**: O sistema DEVE renderizar o diagrama com a corda mais aguda (ex: E4) na parte superior e a mais grave (ex: E2) na parte inferior.
- **FR-008**: O sistema DEVE renderizar cordas soltas (indicadas por um "O" com preenchimento branco e borda na cor padrão dos dedos) e mutadas (indicadas por um "X" vermelho #DC143C espesso) no traste zero (primeira linha vertical à esquerda), posicionados acima do traste mais grosso, próximos às notas de afinação.
- **FR-009**: O sistema DEVE aceitar acordes no formato Fret Notation (ex: "x32010") e renderizá-los corretamente, incluindo suporte para trastes com mais de um dígito (ex: "(10)").
- **FR-010**: O sistema DEVE ser otimizado para performance, evitando re-renderizações desnecessárias.
- **FR-011**: O sistema DEVE ser totalmente declarativo, sem gerenciar estado interno.
- **FR-012**: O sistema DEVE incluir suporte a texto dentro dos círculos dos dedos (ex: números dos dedos ou notas).
- **FR-013**: O sistema DEVE permitir customização das cores e tamanhos dos indicadores de cordas soltas (`openStringColor`, `openStringSize`) e mutadas (`mutedStringColor`, `mutedStringSize`) via propriedades de estilo.
- **FR-014**: O sistema DEVE integrar a biblioteca `tonal` para validar afinações e calcular as notas exatas que estão sendo tocadas com base na afinação e nas posições dos dedos.
- **FR-015**: O sistema DEVE suportar views predefinidas para layout: `horizontal-right` (padrão), `horizontal-left`, `vertical-right`, `vertical-left`.
- **FR-016**: O sistema DEVE mapear domínio → coordenadas via Strategy (mapping-per-view) sem utilizar `transform` global, preservando legibilidade horizontal e centralização dos dots.
- **FR-023**: O sistema DEVE garantir que na view `horizontal-left` os rótulos de afinação sejam renderizados à direita do braço e que os números dos trastes sejam exibidos em ordem crescente da direita para a esquerda (lendo da esquerda para a direita resulta, por exemplo, em "3, 2, 1, 0"), posicionando o traste 0 imediatamente antes desses rótulos.
- **FR-024**: O sistema DEVE renderizar, nas views verticais, as cordas na ordem exata definida pela view: `vertical-right` deve exibir `["E2", "A2", "D3", "G3", "B3", "E4"]` da esquerda para a direita; `vertical-left` deve exibir `["E4", "B3", "G3", "D3", "A2", "E2"]` da esquerda para a direita.
- **FR-025**: O sistema DEVE posicionar a numeração de trastes nas views verticais à direita do braço, exibindo valores crescentes de cima para baixo iniciando em "0" na área do nut. Ambas as views (`vertical-right` e `vertical-left`) DEVEM compartilhar o mesmo mapeamento de fretes, sem inversão adicional na orientação vertical.
- **FR-026**: O sistema DEVE posicionar os números dos trastes (FretNumbers) nas views verticais à direita do braço, alinhados com cada traste horizontal, começando com "0" no topo (nut) e "1, 2, 3..." abaixo, formando uma coluna vertical de números ao lado direito do diagrama. Os rótulos de afinação (TuningLabels) devem ser posicionados acima das cordas verticais, da esquerda para a direita, mantendo legibilidade horizontal e consistência entre as views `vertical-right` e `vertical-left`.
- **FR-017**: O sistema DEVE expor um mecanismo de tratamento de erros via `onError` (callback) e `errorFallback` (UI inline opcional).
- **FR-018**: O sistema DEVE suportar a política de validação `validation` com valores `"strict" | "lenient"` (padrão: `"strict"`).
- **FR-019**: O sistema DEVE suportar `invalidBehavior` com valores `"keep-previous" | "render-fallback" | "suppress"` (padrão: `"keep-previous"`).
- **FR-020**: O sistema DEVE aceitar `fallbackChord` (string/objeto) usado quando não houver acorde válido anterior (padrão: `"000000"`).
- **FR-021**: O sistema DEVE exportar helpers utilitários: `isValidChord`, `tryParseChord`, `normalizeChord`, além de `ERROR_CODES` e `ChordDiagramError`.
- **FR-022**: O sistema DEVE permitir extensão de layout via prop `layoutEngine` (Strategy customizada) ou registro interno opcional, com precedência sobre `view`.

### Política de Validação e Tratamento de Erros

- **validation**
    - `strict` (padrão): rejeita entradas inválidas; não normaliza.
    - `lenient`: tenta normalizar (ex.: pad/truncate para 6 caracteres, clamp de trastes) e pode emitir avisos via `onError`.
- **invalidBehavior** (aplicado quando o acorde é inválido)
    - `keep-previous` (padrão): mantém último acorde válido; se inexistente, usa `fallbackChord`.
    - `render-fallback`: sempre renderiza `fallbackChord` quando inválido.
    - `suppress`: não renderiza acorde (apenas o braço); pode combinar com `errorFallback`.
- **fallbackChord**: acorde padrão quando não houver histórico válido (padrão `"000000"`).
- **onError(error, context)**: callback para o app (telemetria, i18n, UX personalizada). `context` inclui `code`, `input` e, no modo lenient, `normalized`/`warnings`.
- **errorFallback**: UI inline opcional (node ou função) para exibir erro dentro do componente.

### Entidades-Chave _(incluir se a feature envolver dados)_

- **Finger**: Representa um dedo posicionado no braço. Contém `string` (corda, onde 1 é a mais grave), `fret` (traste, 0 para cordas soltas), `is_muted` (boolean para cordas mutadas) e `text` (texto opcional).
- **Barre**: Representa uma pestana. Contém `fret` (traste), `fromString` (corda inicial) e `toString` (corda final).
- **ChordStyle**: Representa configurações visuais do diagrama (cores, tamanhos, espaçamentos, fontes, orientação e layout para destro/canhoto).
- **ChordDiagramProps**: Interface principal do componente, aceitando dados do acorde como objeto estruturado (com `fingers`, `barres`) ou como Fret Notation (ex: "x32010"), com propriedades de estilo inline.

---

## Checklist de Revisão & Aceite

### Qualidade do Conteúdo

- [x] Sem detalhes de implementação (linguagens, frameworks, APIs)
- [x] Foco no valor ao usuário e necessidades de negócio
- [ ] Escrito para stakeholders não técnicos _(A especificação é bastante técnica, voltada para desenvolvedores)_
- [x] Todas as seções obrigatórias concluídas

### Integralidade dos Requisitos

- [x] Nenhum marcador [NEEDS CLARIFICATION] remanescente
- [x] Requisitos testáveis e não ambíguos
- [x] Critérios de sucesso mensuráveis
- [x] Escopo claramente delimitado
- [x] Dependências e premissas identificadas
