---
title: Introdução
---

Bem-vindo à documentação de referência da Svelte! Esta está destinada como um recurso para pessoas que já têm alguma familiaridade com a Svelte e querem aprender mais sobre como usá-la.

Se não for o teu caso (ainda), podes preferir visitar o [seminário interativo](https://learn.svelte.dev) ou os [exemplos](/examples) antes de consultar esta referência. Tu podes testar a Svelte online usando a [REPL](/repl). Alternativamente, se gostarias de um ambiente mais completo, podes experimentar a Svelte na [StackBlitz](https://sveltekit.new).

## Começar um novo projeto

Nós recomendamos usar a [SvelteKit](https://kit.svelte.dev/), a abstração de aplicação oficial da equipa da Svelte:

```
npm create svelte@latest myapp
cd myapp
npm install
npm run dev
```

SvelteKit encarregar-se-á de chamar [o compilador da Svelte](https://www.npmjs.com/package/svelte) para converter os teus ficheiros `.svelte` em ficheiros `.js` que cria o DOM e os ficheiros `.css` que o estilizam. Também fornece todos os outros pedaços que precisas para construir uma aplicação de Web como um servidor de desenvolvimento, roteamento, implementação em produção, suporte a interpretação no lado do servidor. A [SvelteKit](https://kit.svelte.dev/) usa a [Vite](https://pt.vitejs.dev/) para construir o teu código.

### Alternativas à SvelteKit

Se não quiseres usar a SvelteKit por alguma razão, também podes usar a Svelte com a Vite (mas sem a SvelteKit) executando `npm init vite` e selecionado a opção `svelte`. Com isto, `npm run build` gerará os ficheiros de HTML, CSS e JavaScript dentro do diretório `dist`. Na maioria dos casos, provavelmente também precisarás de [escolher uma biblioteca de roteamento](/faq#is-there-a-router).

Alternativamente, existem [extensões para todos os principais empacotadores da Web](https://sveltesociety.dev/tools#bundling) para lidar com a compilação da Svelte — que produzirá o `.js` e `.css` que podes inserir no teu HTML — mas a maioria dos outros não lidarão com a interpretação no lado do servidor.

## Ferramentas do Editor

A equipa da Svelte mantém uma [extensão de VS Code](https://marketplace.visualstudio.com/items?itemName=svelte.svelte-vscode) e também existem integrações com vários outros [editores](https://sveltesociety.dev/tools#editor-support) e ferramentas.

## Pedindo ajuda

Não precisamos ter vergonha na hora de pedir ajuda, e pare isto temos a [sala de conversas da Discord](https://svelte.dev/chat)! Também é possível encontrar respostas na [Stack Overflow](https://stackoverflow.com/questions/tagged/svelte).
