---
title: 'svelte/compiler'
---

Normalmente, não interagiremos com o compilador da Svelte diretamente, mas o integraremos no nosso sistema de construção usando uma extensão de empacotador. A extensão de empacotador que a equipa da Svelte mais recomenda e investe é a [`vite-plugin-svelte`](https://github.com/sveltejs/vite-plugin-svelte). A abstração [SvelteKit](https://sveltekit-docs-pt.vercel.app/) fornece uma configuração influenciando a `vite-plugin-svelte` à construir aplicações bem como uma [ferramenta para empacotar as bibliotecas de componente de Svelte](https://sveltekit-docs-pt.vercel.app/docs/packaging). A Sociedade da Svelte mantém uma lista de [outras extensões de empacotador](https://sveltesociety.dev/tools/#bundling) para ferramentas adicionais como a Rollup e Webpack.

Contudo, é útil entender como usar o compilador, uma vez que as extensões de empacotador geralmente expõem as opções do compilador à nós.

## `compile`

> EXPORT_SNIPPET: svelte/compiler#compile

Isto é onde a magia acontece. `svelte.compile` recebe o código-fonte do nosso componente, e transforma-o num módulo de JavaScript que exporta uma classe:

```js
// @filename: ambient.d.ts
declare global {
	var source: string
}

export {}

// @filename: index.ts
// ---cut---
import { compile } from 'svelte/compiler';

const result = compile(source, {
	// opções
});
```

Consulte a [`CompileOptions`](#types-compileoptions) por todas as opções disponíveis.

O objeto `result` retornado contém o código para o nosso componente, juntamente com bocados úteis de metadados:

```ts
// @filename: ambient.d.ts
declare global {
	const source: string;
}

export {};

// @filename: main.ts
import { compile } from 'svelte/compiler';
// ---cut---
const { js, css, ast, warnings, vars, stats } = compile(source);
```

Consulte a [`CompileResult`](#types-compileresult) por uma descrição completa do resultado da compilação.

## `parse`

> EXPORT_SNIPPET: svelte/compiler#parse

A função `parse` analisa sintaticamente um componente, retornando apenas sua árvore de sintaxe abstrata. Diferente da compilação com a opção `generate: false`, esta não realizará quaisquer validação ou outras analises do componente além analisá-lo sintaticamente. Nota que a árvore de sintaxe abstrata retornada não é considerada API pública, assim mudanças rutura poderiam ocorrer a qualquer momento no tempo:

```js
// @filename: ambient.d.ts
declare global {
	var source: string;
}

export {};

// @filename: main.ts
// ---cut---
import { parse } from 'svelte/compiler';

const ast = parse(source, { filename: 'App.svelte' });
```

## `preprocess`

> EXPORT_SNIPPET: svelte/compiler#preprocess

Um número de [extensões de pré-processamento mantidas pela comunidade e oficiais](https://sveltesociety.dev/tools#preprocessors) estão disponíveis para permitir-nos usar a Svelte com ferramentas como TypeScript, PostCSS, SCSS, e Less.

Nós podemos escrever o nosso próprio processador usando a API `svelte.preprocess`.

A função `preprocess` fornece gatilhos convenientes para transformar de maneira arbitrária o código-fonte do componente. Por exemplo, pode ser usada para converter um bloco `<style lang="sass">` em CSS puro.

O primeiro argumento é o código-fonte do componente. O segundo é um vetor de _pré-processadores_ (ou um único pré-processador, se apenas tivermos um), onde um pré-processador é um objeto com uma `name` que é obrigatória, e funções `markup`, `script` e `style`, cada uma das quais é opcional.

A função `markup` recebe o texto do código-fonte do componente inteiro, juntamente com o `filename` do componente se fora especificado no terceiro argumento.

As funções `script` e `style` recebem o conteúdo dos elementos `<script>` e `<style>` respetivamente (`content`) bem como o texto do código-fonte do componente inteiro (`markup`). Além do `filename`, recebem um objeto dos atributos do elemento.

Cada função `markup`, `script` ou `style` deve retornar um objeto (ou uma promessa que resolve para um objeto) com uma propriedade `code`, representando o código-fonte transformado. Opcionalmente podem retornar um vetor de `dependencies` que representa os ficheiros à observar por mudanças, e um objeto `map` que é um mapa de código-fonte mapeando de volta a transformação ao código original. Os pré-processadores de `script` e `style` podem opcionalmente retornar um registo de atributos que representam os atributos atualizados no marcador de `script` e `style`.

> As funções pré-processadoras devem retornar um objeto `map` sempre que possível ou senão a depuração torna-se mais difícil uma vez que os rastos da pilha não podem ligar-se ao código original corretamente.

```js
// @filename: ambient.d.ts
declare global {
	var source: string;
}

export {};

// @filename: main.ts
// ---cut---
import { preprocess } from 'svelte/compiler';
import MagicString from 'magic-string';

const { code } = await preprocess(
	source,
	{
		markup: ({ content, filename }) => {
			const pos = content.indexOf('foo');
			if (pos < 0) {
				return { code: content };
			}
			const s = new MagicString(content, { filename });
			s.overwrite(pos, pos + 3, 'bar', { storeName: true });
			return {
				code: s.toString(),
				map: s.generateMap()
			};
		}
	},
	{
		filename: 'App.svelte'
	}
);
```

As funções `script` e `style` recebem o conteúdo dos elementos `<script>` e `<style>` respetivamente (`content`) bem como o texto do código-fonte do componente inteiro (`markup`). Além do `filename`, recebem um objeto dos atributos do elemento.

Se um vetor de `dependencies` for retornado, será incluído no objeto do resultado. Isto é usado por pacotes como [`vite-plugin-svelte`](https://github.com/sveltejs/vite-plugin-svelte) e [`rollup-plugin-svelte`](https://github.com/sveltejs/rollup-plugin-svelte) para observar ficheiros adicionais por mudanças, no caso onde o nosso marcador `<style>` tiver um `@import` (por exemplo):

```ts
// @filename: ambient.d.ts
declare global {
	var source: string;
}

export {};

// @filename: main.ts
// @errors: 2322 2345 2339
/// <reference types="@types/node" />
// ---cut---
import { preprocess } from 'svelte/compiler';
import MagicString from 'magic-string';
import sass from 'sass';
import { dirname } from 'path';

const { code } = await preprocess(
	source,
	{
		name: 'my-fancy-preprocessor',
		markup: ({ content, filename }) => {
			// Retornar o código como está quando nenhuma
			// sequência de caracteres `foo` estiver presente
			const pos = content.indexOf('foo');
			if (pos < 0) {
				return;
			}

			// Substituir `foo` por `bar` usando `MagicString` que fornece
			// um mapa de código-fonte juntamente com o código mudado
			const s = new MagicString(content, { filename });
			s.overwrite(pos, pos + 3, 'bar', { storeName: true });

			return {
				code: s.toString(),
				map: s.generateMap({ hires: true, file: filename })
			};
		},
		style: async ({ content, attributes, filename }) => {
			// apenas processar o <style lang="sass">
			if (attributes.lang !== 'sass') return;

			const { css, stats } = await new Promise((resolve, reject) =>
				sass.render(
					{
						file: filename,
						data: content,
						includePaths: [dirname(filename)]
					},
					(err, result) => {
						if (err) reject(err);
						else resolve(result);
					}
				)
			);

			// remover o atributo `lang` do marcador `style`
			delete attributes.lang;

			return {
				code: css.toString(),
				dependencies: stats.includedFiles,
				attributes
			};
		}
	},
	{
		filename: 'App.svelte'
	}
);
```

Vários pré-processadores podem ser usados juntos. A saída do primeiro torna-se a entrada ao segundo. Com um pré-processador, `markup` executa primeiro, depois `script` e `style`.

> Na Svelte 3, todas as funções de `markup` executavam primeiro, depois todas de `script` e depois todos os pré-processadores de `style`. Esta ordem foi mudada na Svelte 4.

```js
// @errors: 2322
// @filename: ambient.d.ts
declare global {
	var source: string;
}

export {};

// @filename: main.ts
// ---cut---
import { preprocess } from 'svelte/compiler';

const { code } = await preprocess(source, [
	{
		name: 'first preprocessor',
		markup: () => {
			console.log('this runs first');
		},
		script: () => {
			console.log('this runs second');
		},
		style: () => {
			console.log('this runs third');
		}
	},
	{
		name: 'second preprocessor',
		markup: () => {
			console.log('this runs fourth');
		},
		script: () => {
			console.log('this runs fifth');
		},
		style: () => {
			console.log('this runs sixth');
		}
	}
], {
	filename: 'App.svelte'
});
```

## `walk`

> EXPORT_SNIPPET: svelte/compiler#walk

A função `walk` fornece uma maneira de percorrer as árvores de sintaxe abstrata geradas pelo analisador sintático, usando a própria instância embutida do compilador de [`estree-walker`](https://github.com/Rich-Harris/estree-walker).

O caminhante recebe uma árvore de sintaxe abstrata à percorrer e um objeto com dois métodos opcionais: `enter` e `leave`. Para cada nó, `enter` é chamado (se estiver presente). Depois, a menos que `this.skip()` seja chamado durante `enter`, cada um dos filhos é percorrido, e depois `leave` é chamado sobre o nó:

```js
// @filename: ambient.d.ts
declare global {
	var ast: import('estree').Node;
	function do_something(node: import('estree').Node): void;
	function do_something_else(node: import('estree').Node): void;
	function should_skip_children(node: import('estree').Node): boolean;
}

export {};

// @filename: main.ts
// @errors: 7006
// ---cut---
import { walk } from 'svelte/compiler';

walk(ast, {
	enter(node, parent, prop, index) {
		do_something(node);
		if (should_skip_children(node)) {
			this.skip();
		}
	},
	leave(node, parent, prop, index) {
		do_something_else(node);
	}
});
```

## `VERSION`

> EXPORT_SNIPPET: svelte/compiler#VERSION

A versão atual, como definida no `package.json`.

```js
import { VERSION } from 'svelte/compiler';
console.log(`running svelte version ${VERSION}`);
```

## Tipos

> TYPES: svelte/compiler
