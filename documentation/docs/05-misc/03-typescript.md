---
title: TypeScript
---

Nós podemos usar a TypeScript dentro dos componentes da Svelte. Extensões de ambiente de desenvolvimento integrado como a [extensão de VSCode da Svelte](https://marketplace.visualstudio.com/items?itemName=svelte.svelte-vscode) ajudar-nos-á a capturar os erros diretamente no nosso editor, e o [`svelte-check`](https://www.npmjs.com/package/svelte-check) faz o mesmo na linha de comando, o qual podemos integrar na nossa integração continua.

## Configuração

Para usarmos a TypeScript dentro dos componentes da Svelte, precisamos adicionar um pré-processador que transformará a TypeScript em JavaScript.

### Usando a SvelteKit ou a Vite

A maneira mais fácil de começar é estruturando um novo projeto de SvelteKit digitando `npm create svelte@latest`, seguindo os prontos e escolhendo a opção TypeScript:

```ts
/// file: svelte.config.js
// @noErrors
import { vitePreprocess } from '@sveltejs/kit/vite';

const config = {
	preprocess: vitePreprocess()
};

export default config;
```

Se não precisamos ou queremos todas as funcionalidades que a SvelteKit tem a oferecer, podemos estruturar um projeto de Vite temperado com a Svelte digitando `npm create vite@latest` e selecionando a opção `svelte-ts`:

```ts
/// file: svelte.config.js
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';

const config = {
	preprocess: vitePreprocess()
};

export default config;
```

Em ambos casos, um `svelte.config.js` com `vitePreprocess` será adicionado. A Vite ou a SvelteKit lerá a partir deste ficheiro de configuração.

### Outras Ferramentas de Construção

Se estivermos usando ferramentas como a Rollup ou a Webpack, instalamos as suas respetivas extensões de Svelte. Para a Rollup é [`rollup-plugin-svelte`](https://github.com/sveltejs/rollup-plugin-svelte) e para a Webpack é [`svelte-loader`](https://github.com/sveltejs/svelte-loader). Para ambas, precisamos instalar a `typescript` e a `svelte-preprocess` e adicionar o pré-processador à configuração da extensão (consulte as respetivas READMEs por mais informação). Se estivermos começando um novo projeto, também podemos usar o modelo de projeto da [`rollup`](https://github.com/sveltejs/template) ou da [`webpack`](https://github.com/sveltejs/template-webpack) para estruturar a configuração a partir dum programa.

> Se estivermos a começar um novo projeto, recomendamos usar a SvelteKit ou Vite

## `<script lang="ts">`

Para usarmos a TypeScript dentro dos nossos componentes da Svelte, adicionamos `lang="ts"` aos nossos marcadores de `script`:

```svelte
<script lang="ts">
	let name: string = 'world';

	function greet(name: string) {
		alert(`Hello, ${name}!`);
	}
</script>
```

### Propriedades

As propriedades podem ser tipificadas diretamente sobre a declaração `export let`:

```svelte
<script lang="ts">
	export let name: string;
</script>
```

### Ranhuras

A ranhura e os tipos da propriedades do `slot` são inferidos a partir dos tipos das propriedades da ranhura passadas às mesmas:

```svelte
<script lang="ts">
	export let name: string;
</script>

<slot {name} />

<!-- Depois -->
<Comp let:name>
	<!--    ^ Inferido como sequência de caracteres -->
	{name}
</Comp>
```

### Eventos

Os eventos podem ser tipificados com `createEventDispatcher`:

```svelte
<script lang="ts">
	import { createEventDispatcher } from 'svelte';

	const dispatch = createEventDispatcher<{
		event: null; // não aceita uma carga
		click: string; // tem uma carga de sequência de caracteres obrigatória
		type: string | null; // tem uma carga de sequência de caracteres opcional
	}>();

	function handleClick() {
		dispatch('event');
		dispatch('click', 'hello');
	}

	function handleType() {
		dispatch('event');
		dispatch('type', Math.random() > 0.5 ? 'world' : null);
	}
</script>

<button on:click={handleClick} on:keydown={handleType}>Click</button>
```

## Melhorando os Tipos do DOM Embutidos

A Svelte fornece um melhor esforço para todos os tipos do DOM de HTML que existem. Algumas vezes podemos desejar usar atributos experimentais ou eventos personalizados vindos a partir duma ação. Se for um atributo ou evento padrão não experimental, este pode muito bem uma tipificação em falta da nossas [tipificações de HTML](https://github.com/sveltejs/svelte/blob/master/packages/svelte/elements.d.ts). Neste caso, todos são bem-vindos a abrir uma questão ou um pedido de atualização do repositório para correção.

No caso que for um evento ou atributo experimental ou personalizado, podemos melhor as tipificações com isto:

```ts
/// file: additional-svelte-typings.d.ts
declare namespace svelteHTML {
	// melhorar os elementos
	interface IntrinsicElements {
		'my-custom-element': { someattribute: string; 'on:event': (e: CustomEvent<any>) => void };
	}
	// melhorar os atributos
	interface HTMLAttributes<T> {
		// Se quisermos usar `on:beforeinstallprompt`
		'on:beforeinstallprompt'?: (event: any) => any;
		// Se quisermos usar `myCustomAttribute={..}` (nota: tudo minúsculo)
		mycustomattribute?: any; // Podemos substituir `any` por algo mais específico se quisermos
	}
}
```

Depois certificamos-nos de que o ficheiro `d.ts` é referenciando no nosso `tsconfig.json`. Se este precisar de algo como `"include": ["src/**/*"]` e o nosso ficheiro `d.ts` estiver dentro de `src`, deve funcionar. Nós podemos precisar recarregar para as mudanças surtirem efeito.

Desde a versão 4.2 da Svelte ou versão 3.5 do `svelte-check` ou versão 107.10.0 da extensão do VSCode também podemos declarar as tipificações aumentando o módulo `svelte/elements` desta maneira:

```ts
/// file: additional-svelte-typings.d.ts
import { HTMLButtonAttributes } from 'svelte/elements';

declare module 'svelte/elements' {
	export interface SvelteHTMLElements {
		'custom-button': HTMLButtonAttributes;
	}

	// permite controle mais granular sobre para qual elemento adicionar as tipificações
	export interface HTMLButtonAttributes {
		veryexperimentalattribute?: string;
	}
}

export {}; // garantir que isto não é um módulo ambiente, senão os tipos serão sobrepostos ao invés de aumentados
```

## Tipificações Avançadas Experimentais

Algumas funcionalidades não estão tirando total vantagem da TypeScript nos casos de uso mais avançados como tipificar que um componente implementa uma certa interface, explicitamente tipificando as ranhuras, ou usando os genéricos. Estas coisas são possíveis usando as capacidades de tipo avançado experimentais. Consulte esta [RFC](https://github.com/dummdidumm/rfcs/blob/ts-typedefs-within-svelte-components/text/ts-typing-props-slots-events.md) por mais informação sobre como fazer uso das mesmas.

> A API é experimental e pode mudar em algum ponto.

## Limitações

### Sem TypeScript na Marcação

Nós não podemos usar TypeScript na marcação do nosso modelo de marcação de hipertexto. Por exemplo, o seguinte não funciona:

```svelte
<script lang="ts">
	let count = 10;
</script>

<h1>Count as string: {count as string}!</h1> <!-- ❌ Não funciona -->
{#if count > 4}
	{@const countString: string = count} <!-- ❌ Não funciona -->
	{countString}
{/if}
```

### Declarações Reativas

Nós não podemos tipificar as nossas declarações reativas com a TypeScript da maneira que tipificamos uma variável. Por exemplo, o seguinte não funciona:

```svelte
<script lang="ts">
	let count = 0;

	$: doubled: number = count * 2; // ❌ Não funciona
</script>
```

Não podemos adicionar um `: TYPE` porque é sintaxe inválida nesta posição. No lugar disto, podemos mover a definição para uma declaração de `let` como acima:

```svelte
<script lang="ts">
	let count = 0;

	let doubled: number;
	$: doubled = count * 2;
</script>
```

## Tipos

> TYPES: svelte
