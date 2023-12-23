---
title: Questões Frequentes
---

## Sou Nova na Svelte. Onde Começo?

Nós achamos que a melhor maneira de começar é brincando através do [tutorial](https://learn-svelte-pt.vercel.app) interativo. Cada etapa lá é principalmente focado sobre um aspeto específico e é fácil de seguir. Editaremos e executaremos componentes reais da Svelte diretamente no nosso navegador.

5 à dez minutos deveria ser o suficiente para nós aprendermos o que precisamos. Uma hora e meia deve para ultrapassarmos o tutorial inteiro.

## Onde Posso Conseguir Suporte?

Se a nossa questão é sobre certa sintaxe, a [página da API](https://svelte-docs-pt.vercel.app/docs) é um bom lugar para começar.

Stack Overflow é um fórum popular para fazer questões de nível de código ou se estivermos presos com um erro específico. Leia atentamente as questões existentes rotuladas com [Svelte](https://stackoverflow.com/questions/tagged/svelte+or+svelte-3) ou [faça a tua própria questão](https://stackoverflow.com/questions/ask?tags=svelte)!

Existem fóruns e salas de conversas digitais que são excelentes lugares para discussão sobre boas práticas, arquitetura de aplicação ou apenas conhecer os colegas que usam a Svelte. [Nossa Discord](https://svelte.dev/chat) ou o [canal da Reddit](https://www.reddit.com/r/sveltejs/) são exemplos disto. Se tivermos uma questão de nível de código respondível, o Stack Overflow é normalmente um dos mais adequados.

## Existem Recursos de Terceiros?

A Svelte Society mantém uma [lista de livros e vídeos](https://sveltesociety.dev/resources).

## Como Posso Fazer o VSCode Destacar a Sintaxe dos Meus Ficheiros `.svelte`?

Existe uma [extensão de VSCode oficial para a Svelte](https://marketplace.visualstudio.com/items?itemName=svelte.svelte-vscode).

## Existe uma Ferramenta para Formatar Automaticamente os Meus Ficheiros `.svelte`?

Nós podemos usar a `prettier` com a extensão [`prettier-plugin-svelte`](https://www.npmjs.com/package/prettier-plugin-svelte).

## Como Documento os Meus Componentes?

Nos editores que usam o Servidor da Linguagem da Svelte podemos documentar os componentes, funções e exportações usando comentários especialmente formatados:

````svelte
<script>
	/** What should we call the user? */
	export let name = 'world';
</script>

<!--
@component
Here's some documentation for this component.
It will show up on hover.

- You can use markdown here.
- You can also use code blocks here.
- Usage:
  ```tsx
  <main name="Arethra">
  ```
-->
<main>
	<h1>
		Hello, {name}
	</h1>
</main>
````

Nota: O `@component` é necessário no comentário de HTML que descreve o nosso componente.

## Svelte Escala?

Eventualmente existirá uma publicação de blogue sobre isto, mas entretanto, consulte [esta questão](https://github.com/sveltejs/svelte/issues/2546).

## Existe uma Biblioteca de Componente de Interface?

Existem várias bibliotecas de componente de interface bom como componentes independentes. Encontre as mesmas sob a [seção de sistemas de desenho da página dos componentes](https://sveltesociety.dev/components#design-systems) na página da Web da Svelte Society.

## Como Testo as Aplicações de Svelte?

Como a nossa aplicação está estruturada e onde a lógica está definida determinará a melhor maneira de garantir que está devidamente testada. É importante notar que nem toda lógica deve estar dentro dum componente - isto inclui preocupações tais como transformação de dados, gestão de estado transversal de componente, registo, entre outros. Temos que lembrar que a biblioteca da Svelte tem seu próprio conjunto de teste, então não precisamos de escrever testes para validar detalhes de implementação fornecidos pela Svelte.

Uma aplicação de Svelte normalmente terá três tipos diferentes de testes: Unitário, Componente, e Ponta-a-Ponta (E2E).

_Testes Unitários_: Foca-se em testar a lógica de negocio em isolamento. Muitas vezes é validando funções individuais e casos extremos. Com a minimização da superfície destes testes, estes podem ser mantidos simples e rápidos, e com a extração do máximo de lógica possível dos nossos componentes de Svelte mais da nossa aplicação pode ser coberta usando os mesmos. Quando criarmos um novo projeto de SvelteKit, seremos perguntados se gostaríamos de configurar a [Vitest](https://vitest.dev/) para os testes unitários. Também existem um número de outros executores de teste que poderiam ser usados.

_Testes de Componente_: Validar que um componente de Svelte monta e interage como esperado ao longo do seu ciclo de vida exige uma ferramenta que fornece um Modelo de Objeto de Documento (DOM). Os componentes podem ser compilados (uma vez que a Svelte é um compilador e não uma biblioteca normal) e montados para permitir asserir contra a estrutura do elemento, ouvintes, estado, e todas outras capacidades fornecidas por um componente de Svelte. As ferramentas para teste de componentes variam desde uma implementação em memória como `jsdom` combinada com um executor de testes como a [Vitest](https://vitest.dev/) até soluções que influenciam um navegador verdadeiro a fornecer uma capacidade de teste visual como [Playwright](https://playwright.dev/docs/test-components) ou [Cypress](https://www.cypress.io/).

_End-to-End Tests_: To ensure your users are able to interact with your application it is necessary to test it as a whole in a manner as close to production as possible. This is done by writing end-to-end (E2E) tests which load and interact with a deployed version of your application in order to simulate how the user will interact with your application. When creating a new SvelteKit project, you will be asked whether you would like to setup [Playwright](https://playwright.dev/) for end-to-end testing. There are many other E2E test libraries available for use as well.

Some resources for getting started with testing:

- [Svelte Testing Library](https://testing-library.com/docs/svelte-testing-library/example/)
- [Svelte Component Testing in Cypress](https://docs.cypress.io/guides/component-testing/svelte/overview)
- [Example using vitest](https://github.com/vitest-dev/vitest/tree/main/examples/svelte)
- [Example using uvu test runner with JSDOM](https://github.com/lukeed/uvu/tree/master/examples/svelte)
- [Test Svelte components using Vitest & Playwright](https://davipon.hashnode.dev/test-svelte-component-using-vitest-playwright)
- [Component testing with WebdriverIO](https://webdriver.io/docs/component-testing/svelte)

## Is there a router?

The official routing library is [SvelteKit](https://kit.svelte.dev/). SvelteKit provides a filesystem router, server-side rendering (SSR), and hot module reloading (HMR) in one easy-to-use package. It shares similarities with Next.js for React.

However, you can use any router library. A lot of people use [page.js](https://github.com/visionmedia/page.js). There's also [navaid](https://github.com/lukeed/navaid), which is very similar. And [universal-router](https://github.com/kriasoft/universal-router), which is isomorphic with child routes, but without built-in history support.

If you prefer a declarative HTML approach, there's the isomorphic [svelte-routing](https://github.com/EmilTholin/svelte-routing) library and a fork of it called [svelte-navigator](https://github.com/mefechoel/svelte-navigator) containing some additional functionality.

If you need hash-based routing on the client side, check out [svelte-spa-router](https://github.com/ItalyPaleAle/svelte-spa-router) or [abstract-state-router](https://github.com/TehShrike/abstract-state-router/).

[Routify](https://routify.dev) is another filesystem-based router, similar to SvelteKit's router. Version 3 supports Svelte's native SSR.

You can see a [community-maintained list of routers on sveltesociety.dev](https://sveltesociety.dev/components#routers).

## Can I tell Svelte not to remove my unused styles?

No. Svelte removes the styles from the component and warns you about them in order to prevent issues that would otherwise arise.

Svelte's component style scoping works by generating a class unique to the given component, adding it to the relevant elements in the component that are under Svelte's control, and then adding it to each of the selectors in that component's styles. When the compiler can't see what elements a style selector applies to, there would be two bad options for keeping it:

- If it keeps the selector and adds the scoping class to it, the selector will likely not match the expected elements in the component, and they definitely won't if they were created by a child component or `{@html ...}`.
- If it keeps the selector without adding the scoping class to it, the given style will become a global style, affecting your entire page.

If you need to style something that Svelte can't identify at compile time, you will need to explicitly opt into global styles by using `:global(...)`. But also keep in mind that you can wrap `:global(...)` around only part of a selector. `.foo :global(.bar) { ... }` will style any `.bar` elements that appear within the component's `.foo` elements. As long as there's some parent element in the current component to start from, partially global selectors like this will almost always be able to get you what you want.

## Is Svelte v2 still available?

New features aren't being added to it, and bugs will probably only be fixed if they are extremely nasty or present some sort of security vulnerability.

The documentation is still available [here](https://v2.svelte.dev/guide).

## How do I do hot module reloading?

We recommend using [SvelteKit](https://kit.svelte.dev/), which supports HMR out of the box and is built on top of [Vite](https://vitejs.dev/) and [svelte-hmr](https://github.com/sveltejs/svelte-hmr). There are also community plugins for [rollup](https://github.com/rixo/rollup-plugin-svelte-hot) and [webpack](https://github.com/sveltejs/svelte-loader).
