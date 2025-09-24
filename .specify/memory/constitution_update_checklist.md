# Checklist de Atualização da Constituição

Ao emendar a constituição (`/memory/constitution.md`), garanta que todos os documentos dependentes estejam atualizados para manter a consistência.

## Templates a Atualizar

### Ao adicionar/modificar QUALQUER artigo:

- [ ] `/templates/plan-template.md` - Atualizar a seção de Verificação da Constituição
- [ ] `/templates/spec-template.md` - Atualizar se requisitos/escopo forem afetados
- [ ] `/templates/tasks-template.md` - Atualizar se novos tipos de tarefas forem necessários
- [ ] `/.claude/commands/plan.md` - Atualizar se o processo de planejamento mudar
- [ ] `/.claude/commands/tasks.md` - Atualizar se a geração de tarefas for afetada
- [ ] `/CLAUDE.md` - Atualizar diretrizes de desenvolvimento em tempo de execução

### Atualizações específicas por artigo:

#### Artigo I (Biblioteca-Primeiro):

- [ ] Garantir que os templates enfatizam a criação de bibliotecas
- [ ] Atualizar exemplos de comandos CLI
- [ ] Adicionar requisitos de documentação llms.txt

#### Artigo II (Interface CLI):

- [ ] Atualizar requisitos de flags de CLI nos templates
- [ ] Adicionar lembretes do protocolo de E/S de texto

#### Artigo III (Teste-Primeiro):

- [ ] Atualizar a ordem de testes em todos os templates
- [ ] Enfatizar os requisitos de TDD
- [ ] Adicionar gates de aprovação de testes

#### Artigo IV (Testes de Integração):

- [ ] Listar gatilhos de testes de integração
- [ ] Atualizar prioridades de tipos de teste
- [ ] Adicionar requisitos de dependências reais

#### Artigo V (Observabilidade):

- [ ] Adicionar requisitos de logging aos templates
- [ ] Incluir streaming de logs em múltiplos níveis
- [ ] Atualizar seções de monitoramento de performance

#### Artigo VI (Versionamento):

- [ ] Adicionar lembretes de incremento de versão
- [ ] Incluir procedimentos para breaking changes
- [ ] Atualizar requisitos de migração

#### Artigo VII (Simplicidade):

- [ ] Atualizar limites de quantidade de projetos
- [ ] Adicionar exemplos de padrões proibidos
- [ ] Incluir lembretes de YAGNI

## Etapas de Validação

1. **Antes de comitar mudanças na constituição:**

   - [ ] Todos os templates referenciam os novos requisitos
   - [ ] Exemplos atualizados para corresponder às novas regras
   - [ ] Sem contradições entre documentos

2. **Após atualizar os templates:**

   - [ ] Percorrer um plano de implementação de exemplo
   - [ ] Verificar que todos os requisitos da constituição foram atendidos
   - [ ] Checar que os templates são autocontidos (legíveis sem a constituição)

3. **Rastreamento de versão:**
   - [ ] Atualizar o número da versão da constituição
   - [ ] Anotar a versão nos rodapés dos templates
   - [ ] Adicionar emenda ao histórico da constituição

## Itens Comumente Esquecidos

Fique atento a estas atualizações frequentemente esquecidas:

- Documentação de comandos (`/commands/*.md`)
- Itens de checklist nos templates
- Exemplos de código/comandos
- Variações específicas de domínio (web vs mobile vs CLI)
- Referências cruzadas entre documentos

## Status de Sincronização dos Templates

Última verificação de sync: 2025-07-16

- Versão da constituição: 2.1.1
- Templates alinhados: ❌ (faltando detalhes de versionamento e observabilidade)

---

_Este checklist garante que os princípios da constituição sejam aplicados de forma consistente em toda a documentação do projeto._
