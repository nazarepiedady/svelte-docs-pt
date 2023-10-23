---
title: 'API - Componente do Lado do Servidor'
---

```js
// @noErrors
const result = Component.render(...)
```

Diferente dos componentes do lado do cliente, os componentes do lado do servidor não têm um período de validade depois de desenhá-los — o seu trabalho todo é criar algum HTML e CSS. Por esta razão, a API é um tanto diferente.

Um componente do lado do servidor expõe um método `render` que pode ser chamado com as propriedades opcionais. Ele retorna um objeto com as propriedades `head`, `html`, e css, onde `head` contém o conteúdo de quaisquer elementos `<svelte:head>` encontrados.

Nós podemos importar um componente da Svelte diretamente num Nó usando [`svelte/register`](/docs/svelte-register):

```js
// @noErrors
require('svelte/register');

const App = require('./App.svelte').default;

const { head, html, css } = App.render({
	answer: 42
});
```

O método `.render()` aceita os seguintes parâmetros:

| parâmetro | padrão | descrição                                        |
| --------- | ------- | -------------------------------------------------- |
| `props`   | `{}`    | Um objeto de propriedades à fornecer ao componente |
| `options` | `{}`    | Um objeto de opções                                |

O objeto `options` recebe as seguintes opções:

| opção    | padrão     | descrição                                                              |
| --------- | ----------- | ------------------------------------------------------------------------ |
| `context` | `new Map()` | Um `Map` de pares de chave-valor de contexto de nível de raiz à fornecer ao componente |

```js
// @noErrors
const { head, html, css } = App.render(
	// propriedades
	{ answer: 42 },
	// opções
	{
		context: new Map([['context-key', 'context-value']])
	}
);
```
