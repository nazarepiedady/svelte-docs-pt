---
title: Introdução
---

Bem-vindo à documentação de referência da Svelte! Esta documentação está destinada a servir como um recurso para as pessoas que já têm alguma experiência com a Svelte e querem aprender mais sobre como usá-la.

Se ainda não for o nosso caso, podemos visitar o [tutorial](https://learn-svelte-pt.vercel.app) ou os [exemplos](/examples) antes de consultarmos esta referência. Nós podemos testar a Svelte online usando a [REPL](/repl). Alternativamente, se gostaríamos dum ambiente mais completo, podemos experimentar a Svelte na [StackBlitz](https://sveltekit.new).

## Começar Um Novo Projeto

Nós recomendamos usar a [SvelteKit](https://sveltekit-docs-pt.vercel.app/), a abstração de aplicação oficial da equipa da Svelte:

```
npm create svelte@latest myapp
cd myapp
npm install
npm run dev
```

SvelteKit encarregar-se-á de chamar [o compilador da Svelte](https://www.npmjs.com/package/svelte) para converter os nossos ficheiros `.svelte` em ficheiros `.js` que criam o DOM e os ficheiros `.css` que o estilizam. Também fornece todos os outros pedaços que precisas para construir uma aplicação de Web como um servidor de desenvolvimento, roteamento, implementação em produção, suporte a interpretação do lado do servidor. A [SvelteKit](https://sveltekit-docs-pt.vercel.app/) usa a [Vite](https://pt.vitejs.dev/) para construir o nosso código.

### Alternativas à SvelteKit

Se não quisermos usar a SvelteKit por alguma razão, também podemos usar a Svelte com a Vite (mas sem a SvelteKit) executando `npm init vite` e selecionado a opção `svelte`. Com isto, `npm run build` gerará os ficheiros de HTML, CSS e JavaScript dentro do diretório `dist`. Na maioria dos casos, provavelmente também precisaremos de [escolher uma biblioteca de roteamento](/faq#is-there-a-router).

Alternativamente, existem [extensões para todos os principais empacotadores da Web](https://sveltesociety.dev/tools#bundling) para lidar com a compilação da Svelte — que produzirá o `.js` e `.css` que podemos inserir no nosso HTML — mas a maioria dos outros não lidarão com a interpretação no lado do servidor.

## Ferramentas do Editor

A equipa da Svelte mantém uma [extensão de VS Code](https://marketplace.visualstudio.com/items?itemName=svelte.svelte-vscode) e também existem integrações com vários outros [editores](https://sveltesociety.dev/tools#editor-support) e ferramentas.

## Pedindo Ajuda

Não precisamos ter vergonha na hora de pedir ajuda, e para isto temos a [sala de conversas da Discord](https://svelte.dev/chat)! Também é possível encontrar respostas na [Stack Overflow](https://stackoverflow.com/questions/tagged/svelte).
