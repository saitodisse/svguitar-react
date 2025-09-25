Somente prosseguir se todos os testes passarem, o build for criado e o storybook rodar sem erros.

- rode todos os testes unitários (vitest)
- rode os testes programáticos do storybook (test-storybook)
- faça o build
- GIT: adicione todos os arquivos modificados para stage
- GIT: crie uma mensagem de commit para o release
- incremente a versão no package.json
- atualize o arquivo de changelog
- atualize o arquivo de release notes
- peça para o usuário finalizar o release rodando o comando `pnpm publish`
