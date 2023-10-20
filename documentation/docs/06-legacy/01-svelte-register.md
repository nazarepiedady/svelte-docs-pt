---
title: 'svelte/register'
---

> Esta API foi removida na Svelte 4. Os gatilhos de `require` foram depreciados e as versões da Node atuais entendem o Módulo de ECMAScript. Use um empacotador como a Vite ou a nossa abstração de pilha completa [SvelteKit](https://sveltekit-docs-pt.vercel.app) no lugar de criar módulos de JavaScript a partir dos componentes da Svelte.

Para desenhar componentes de Svelte na Node.js sem empacotamento, usamos `require('svelte/register')`. Depois disto, podemos usar `require` para incluir qualquer ficheiro `.svelte`:

```js
// @noErrors
require('svelte/register');

const App = require('./App.svelte').default;

// ...

const { html, css, head } = App.render({ answer: 42 });
```

> O `.default` é necessário porque convertemos a partir dos módulos de JavaScript nativos para os módulos de CommonJS reconhecidos pela Node. Nota que se o nosso componente importa os módulos de JavaScript, falhará em carregar na Node e precisaremos de usar um empacotador.

Para definir as opções de compilação, ou usar um extensão de ficheiro personalizada, chamamos o gatilho `register` como uma função:

```js
// @noErrors
require('svelte/register')({
	extensions: ['.customextension'], // predefinido para ['.html', '.svelte']
	preserveComments: true
});
```
