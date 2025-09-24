# Pesquisa para Componente de Diagrama de Acordes

## 1. Decisões Técnicas

### Decisão: Geração de SVG em React

- **Decisão**: Utilizar JSX para renderizar elementos SVG (`<svg>`, `<rect>`, `<circle>`, `<line>`, `<text>`) diretamente no componente React.
- **Justificativa**: Esta abordagem é a mais idiomática para o React. Ela permite o uso de props para controlar dinamicamente os atributos do SVG, se integra perfeitamente ao ciclo de vida do React e aproveita a otimização de re-renderização do virtual DOM. Evita a manipulação manual do DOM e o uso de `dangerouslySetInnerHTML`, que são menos performáticos e seguros.
- **Alternativas consideradas**:
    - **Strings de SVG**: Gerar o SVG como uma string e inseri-la com `dangerouslySetInnerHTML`. Rejeitada por ser menos segura, mais difícil de manter e não aproveitar as otimizações do React.
    - **Bibliotecas de terceiros para SVG**: Usar bibliotecas como `react-svg` ou `svgr`. Rejeitado porque o requisito é não ter dependências externas para a lógica de renderização, e a geração dos elementos do diagrama é simples o suficiente para ser feita nativamente.

### Decisão: Otimização de Performance

- **Decisão**: Utilizar `React.memo` para envolver o componente principal `ChordDiagram` e seus subcomponentes puros. Os objetos e arrays passados como props (ex: `style`, `fingers`) devem ser memorizados no componente pai usando `useMemo` e `useCallback` para garantir a eficácia do `React.memo`.
- **Justificativa**: O diagrama de acordes é um componente puro: para as mesmas props, ele sempre renderizará a mesma saída. `React.memo` previne re-renderizações desnecessárias quando as props não mudam, o que é crucial para a performance em aplicações musicais que podem atualizar a UI frequentemente. A memorização das props no componente pai é essencial para evitar que novas referências de objetos quebrem a comparação superficial do `React.memo`.
- **Alternativas consideradas**:
    - **Nenhuma otimização**: Simplesmente criar o componente funcional. Rejeitado porque o requisito FR-009 exige otimização de performance explicitamente.

### Decisão: Build e Empacotamento para NPM

- **Decisão**: Utilizar o "Library Mode" do Vite para compilar o código TypeScript/React em um formato distribuível (ESM e UMD). O `package.json` será configurado para apontar para os arquivos de build corretos nos campos `main`, `module`, e `exports`, além de incluir os tipos TypeScript (`types`).
- **Justificativa**: O Vite oferece uma configuração simplificada e otimizada para a criação de bibliotecas, o que reduz a complexidade do processo de build. Ele gera pacotes eficientes e modernos, garantindo que a biblioteca possa ser consumida tanto em projetos que usam ES Modules quanto em ambientes mais antigos. A inclusão das definições de tipo é essencial para a experiência do desenvolvedor em projetos TypeScript.
- **Alternativas consideradas**:
    - **Webpack/Babel/Rollup manuais**: Configurar o processo de build manualmente. Rejeitado por ser significativamente mais complexo e demorado de configurar e manter em comparação com a solução integrada do Vite.

## 2. Boas Práticas

### Estrutura do Componente

- O componente principal `ChordDiagram` será responsável por receber todas as props e orquestrar a renderização.
- Subcomponentes puros e menores serão criados para cada parte do diagrama (ex: `Fretboard`, `Finger`, `Barre`, `StringLabel`). Isso melhora a legibilidade, a manutenção e permite otimizações de renderização mais granulares com `React.memo`.

### Estilização

- A estilização será controlada via um objeto `style` passado como prop, conforme o requisito FR-005. Este objeto conterá propriedades para cores, fontes, tamanhos, etc.
- Os valores padrão para o estilo serão definidos dentro do componente, e o objeto de estilo passado via prop fará um merge, sobrescrevendo os padrões.

### Tratamento de Dados

- Uma função utilitária será criada para converter a Fret Notation (ex: "x32010") para o formato de objeto estruturado (`fingers`, `barres`). Essa lógica será isolada do componente de renderização.
- A validação de props (ex: afinação incompleta) será feita no início do ciclo de renderização, lançando erros claros para o desenvolvedor, conforme especificado nos casos limite.

## 3. Padrões de Renderização SVG

### Elementos SVG Utilizados

- **`<svg>`**: Container principal do diagrama
- **`<rect>`**: Trastes do braço da guitarra
- **`<line>`**: Cordas da guitarra
- **`<circle>`**: Posições dos dedos
- **`<rect>`**: Pestanas (barras)
- **`<text>`**: Rótulos de posições, afinação, números dos dedos

### Estrutura do Diagrama

```
┌─ Afinação (E A D G B E)
│
├─ Cordas (6 linhas horizontais)
│
├─ Trastes (linhas verticais)
│
├─ Posições dos dedos (círculos)
│
└─ Pestanas (retângulos)
```

### Cálculos de Posicionamento

- **Coordenadas**: Sistema de coordenadas SVG com origem no canto superior esquerdo
- **Espaçamento**: Cálculos baseados em props de estilo (fretWidth, stringWidth)
- **Responsividade**: Dimensões proporcionais baseadas na largura/altura total

## 4. Validação e Tratamento de Erros

### Validação de Props

- **Fingers**: Verificar se fret > 0 e string está dentro do intervalo válido
- **Barres**: Verificar se fromString <= toString e fret > 0
- **Tuning**: Verificar se array tem o número correto de elementos
- **Style**: Valores numéricos devem ser positivos

### Casos Limite Tratados

- **Posições inválidas**: Ignorar dedos fora dos limites do braço
- **Pestanas sobrepostas**: Priorizar pestanas sobre dedos na mesma posição
- **Afinação incompleta**: Lançar erro com mensagem clara
- **Props vazias**: Renderizar diagrama básico sem posições

## 5. Integração com Storybook

### Stories Planejadas

- **Default**: Acorde simples (C Major)
- **With Barre**: Acorde com pestana (F Major)
- **High Position**: Acorde em posição alta (5ª posição)
- **Custom Tuning**: Afinação personalizada
- **Tab String**: Fret Notation
- **Custom Style**: Estilos personalizados
- **Edge Cases**: Casos limite e validação

### Controles Interativos

- Sliders para ajustar dimensões
- Color pickers para cores
- Inputs para posições de dedos
- Toggle para mostrar/ocultar elementos
