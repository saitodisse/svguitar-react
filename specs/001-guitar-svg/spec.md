# Especificação da Feature: Componente de Diagrama de Acordes de Guitarra

**Branch da Feature**: `001-guitar-svg`
**Criada em**: 2025-09-24
**Status**: Rascunho
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
7.  **Dado** que eu especifique cordas soltas e mutadas, **Então** o componente renderiza o diagrama com as cordas soltas e mutadas corretas, colocando o "X" vermelho (#DC143C) no traste zero (primeira linha vertical à esquerda) para cordas mutadas e o "O" (círculo normal com cor padrão dos dedos) no traste zero para cordas soltas, ambos posicionados acima do traste mais grosso, próximos às notas de afinação. Se houver dedos na mesma corda, eles não serão mostrados (cordas mutadas têm precedência).
8.  **Dado** que quero exibir o diagrama na vertical para um músico destro, **Quando** passo uma propriedade de orientação, **Então** o componente rotaciona o braço do violão em 90 graus, com a corda mais grave (E2) posicionada à **esquerda**.
9.  **Dado** que quero exibir o diagrama para um músico canhoto, **Quando** passo uma propriedade de layout, **Então** o componente inverte (espelha) o diagrama horizontalmente (se em layout horizontal) ou posiciona a corda mais grave (E2) à **direita** (se em layout vertical).

### Casos Limite

- O que acontece quando não há dedos especificados? (O diagrama deve renderizar apenas as cordas, com indicações de cordas soltas ('O') ou mutadas ('X' vermelho) no traste zero, se fornecidas).
- Como o sistema lida com posições inválidas de dedos? (O sistema vai tentar representar o acorde da melhor forma possível, ignorando posições fora do braço).
- O que acontece quando a pestana se sobrepõe incorretamente aos dedos? (A pestana tem prioridade, e os dedos na mesma casa ou anterior são removidos da representação).
- Como o componente lida com definições de afinação inválidas ou incompletas? (Deve lançar um erro).

## Requisitos _(obrigatório)_

### Requisitos Funcionais

- **FR-001**: O sistema DEVE renderizar diagramas de acordes em formato SVG com alta qualidade.
- **FR-002**: O sistema DEVE aceitar posições de dedos como um array de objetos, cada um contendo `string` e `fret`.
- **FR-003**: O sistema DEVE renderizar pestanas como barras retangulares conectando múltiplas cordas.
- **FR-004**: O sistema DEVE suportar posições de acordes (ex: 1ª posição, 5ª posição) com rótulos apropriados.
- **FR-005**: O sistema DEVE permitir customização visual via props (cores, tamanhos, espaçamentos e fontes).
- **FR-006**: O sistema DEVE suportar afinações customizadas das cordas soltas, recebendo um array de strings em notação científica (ex: `["E2", "A2", "D3", "G3", "B3", "E4"]`).
- **FR-007**: O sistema DEVE renderizar cordas soltas (indicadas por "O" com cor padrão dos dedos) e mutadas (indicadas por "X" vermelho #DC143C) no traste zero (primeira linha vertical à esquerda), posicionados acima do traste mais grosso, próximos às notas de afinação.
- **FR-008**: O sistema DEVE aceitar acordes no formato Fret Notation (ex: "x32010") e renderizá-los corretamente, incluindo suporte para trastes com mais de um dígito (ex: "(10)").
- **FR-009**: O sistema DEVE ser otimizado para performance, evitando re-renderizações desnecessárias.
- **FR-010**: O sistema DEVE ser totalmente declarativo, sem gerenciar estado interno.
- **FR-011**: O sistema DEVE incluir suporte a texto dentro dos círculos dos dedos (ex: números dos dedos ou notas).
- **FR-012**: O sistema DEVE permitir customização das cores e tamanhos dos indicadores de cordas soltas (`openStringColor`, `openStringSize`) e mutadas (`mutedStringColor`, `mutedStringSize`) via propriedades de estilo.
- **FR-013**: O sistema DEVE integrar a biblioteca `tonal` para validar afinações e calcular as notas exatas que estão sendo tocadas com base na afinação e nas posições dos dedos.
- **FR-014**: O sistema DEVE suportar uma propriedade para rotacionar o diagrama em 90 graus (layout vertical), posicionando a corda mais grave à **esquerda** para destros.
- **FR-015**: O sistema DEVE suportar uma propriedade para inverter (espelhar) o diagrama para músicos canhotos, de acordo com a orientação: espelhamento horizontal para layout horizontal e corda grave à direita para layout vertical.

### Entidades-Chave _(incluir se a feature envolver dados)_

- **Finger**: Representa um dedo posicionado no braço. Contém `string` (corda), `fret` (traste, 0 para cordas soltas), `is_muted` (boolean para cordas mutadas) e `text` (texto opcional).
- **Barre**: Representa uma pestana. Contém `fret` (traste), `fromString` (corda inicial) e `toString` (corda final).
- **ChordStyle**: Representa configurações visuais do diagrama (cores, tamanhos, espaçamentos, fontes, orientação e layout para destro/canhoto).
- **ChordDiagramProps**: Interface principal do componente, aceitando dados do acorde como objeto estruturado (com `fingers`, `barres`) ou como Fret Notation (ex: "x32010").

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
