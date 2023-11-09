---
title: 'Componente do Cliente'
---

> Nesta seção apresentaremos a API do Componente do Lado do Cliente.

## Criando um Componente

```ts
// @errors: 2554
// @filename: ambient.d.ts
import { SvelteComponent, ComponentConstructorOptions } from 'svelte';

declare global {
	class Component extends SvelteComponent {}
	var options: ComponentConstructorOptions<Record<string, any>>;
}

// @filename: index.ts
// @errors: 2554
// ---cut---
const component = new Component(options);
```

Um componente do lado do cliente — isto é, um componente compilado com `generate: 'dom'` (ou com a opção `generate` deixada indeterminada) é uma classe de JavaScript:

```ts
// @errors: 2554
// @filename: ambient.d.ts
import { SvelteComponent, ComponentConstructorOptions } from 'svelte';

declare module './App.svelte' {
	class Component extends SvelteComponent {}
	export default Component;
}

// @filename: index.ts
// @errors: 2554
// ---cut---
import App from './App.svelte';

const app = new App({
	target: document.body,
	props: {
		// assumindo que `App.svelte` tenha algo como
		// `export let answer`:
		answer: 42
	}
});
```

As seguintes opções de inicialização podem ser fornecidas:

| opção    | padrão     | descrição                                                                                          |
| --------- | ----------- | ---------------------------------------------------------------------------------------------------- |
| `target`  | **none**    | Um `HTMLElement` ou `ShadowRoot` para qual interpretar. Esta opção é obrigatória.                               |
| `anchor`  | `null`      | Um filho de `target` para interpretar o componente imediatamente antes                                       |
| `props`   | `{}`        | Um objeto de propriedades à fornecer ao componente                                                   |
| `context` | `new Map()` | Um `Map` de pares de chave-valor do contexto de nível de raiz à fornecer ao componente                             |
| `hydrate` | `false`     | Consulte abaixo                                                                                            |
| `intro`   | `false`     | Se for `true`, reproduzirá as transições na interpretação inicial, no lugar de esperar pelas mudanças de estado subsequentes |

Os filhos existentes do `target` são deixados onde estão.

A opção `hydrate` instrui a Svelte à atualizar o DOM existente (normalmente a partir da interpretação do lado do servidor) ao invés de criar novos elementos. Isto apenas funcionará se o componente foi compilado com a [opção `hydratable: true`](/docs/svelte-compiler#compile). A hidratação dos elementos `<head>` apenas funciona apropriadamente se o código da interpretação do lado do servidor também foi compilado com `hydratable: true`, o que adiciona um marcador à cada elemento no `<head>` para que o componente saiba quais elementos é responsável por remover durante a hidratação.

Considerado que os filhos do `target` são normalmente deixados sozinhos, `hydrate: true` fará quaisquer filhos serem removidos. Por esta razão, a opção `anchor` não pode ser usada ao lado de `hydrate: true`.

O DOM existente não precisa de corresponder o componente — a Svelte 'reparará' o DOM conforme ir:

```ts
// @filename: ambient.d.ts
import { SvelteComponent, ComponentConstructorOptions } from 'svelte';

declare module './App.svelte' {
	class Component extends SvelteComponent {}
	export default Component;
}

// @filename: index.ts
// @errors: 2322 2554
// ---cut---
import App from './App.svelte';

const app = new App({
	target: document.querySelector('#server-rendered-html'),
	hydrate: true
});
```

## `$set`

```ts
// @filename: ambient.d.ts
import { SvelteComponent, ComponentConstructorOptions } from 'svelte';

declare global {
	class Component extends SvelteComponent {}
	var component: Component;
	var props: Record<string, any>;
}

export {};

// @filename: index.ts
// ---cut---
component.$set(props);
```

Define programaticamente as propriedades sobre uma instância. `component.set({ x: 1 })` é equivalente ao `x = 1` dentro do bloco `<script>` do componente.

Chamar este método agenda uma atualização para a próxima micro-tarefa — o DOM _não_ é atualizado de maneira síncrona:

```ts
// @filename: ambient.d.ts
import { SvelteComponent, ComponentConstructorOptions } from 'svelte';

declare global {
	class Component extends SvelteComponent {}
	var component: Component;
}

export {};

// @filename: index.ts
// ---cut---
component.$set({ answer: 42 });
```

## `$on`

```ts
// @filename: ambient.d.ts
import { SvelteComponent, ComponentConstructorOptions } from 'svelte';

declare global {
	class Component extends SvelteComponent {}
	var component: Component;
	var ev: string;
	var callback: (event: CustomEvent) => void;
}

export {};

// @filename: index.ts
// ---cut---
component.$on(ev, callback);
```

Faz a função `callback` ser chamada sempre que o componente despachar um `event`.

Uma função é retornada que removerá o ouvinte de evento quando for chamada:

```ts
// @filename: ambient.d.ts
import { SvelteComponent, ComponentConstructorOptions } from 'svelte';

declare global {
	class Component extends SvelteComponent {}
	var component: Component;
}

export {};

// @filename: index.ts
// ---cut---
const off = component.$on('selected', (event) => {
	console.log(event.detail.selection);
});

off();
```

## `$destroy`

```js
// @filename: ambient.d.ts
import { SvelteComponent, ComponentConstructorOptions } from 'svelte';

declare global {
	class Component extends SvelteComponent {}
	var component: Component;
}

export {}

// @filename: index.ts
// ---cut---
component.$destroy();
```

Remove um componente do DOM e aciona quaisquer manipuladores de `onDestroy`.

## Propriedades do Componente

```js
// @filename: ambient.d.ts
import { SvelteComponent, ComponentConstructorOptions } from 'svelte';

declare global {
	class Component extends SvelteComponent {}
	var component: Component;
}

export {}

// @filename: index.ts
// @errors: 2339
// ---cut---
component.prop;
```

```js
// @filename: ambient.d.ts
import { SvelteComponent, ComponentConstructorOptions } from 'svelte';

declare global {
	class Component extends SvelteComponent {}
	var component: Component;
	var value: unknown;
}

export {}

// @filename: index.ts
// @errors: 2339
// ---cut---
component.prop = value;
```

Se um componente for compilado com `accessors: true`, cada instância terá recuperadores e definidores correspondendo à cada uma das propriedades do componente. Definir um valor causará uma atualização _síncrona_, ao invés da atualização assíncrona padrão causada pela `component.$set(...)`.

Por padrão, `accessors` é `false`, ao menos que estejamos a compilar como um elemento personalizado:

```js
// @filename: ambient.d.ts
import { SvelteComponent, ComponentConstructorOptions } from 'svelte';

declare global {
	class Component extends SvelteComponent {}
	var component: Component;
	var props: Record<string, any>;
}

export {}

// @filename: index.ts
// @errors: 2339
// ---cut---
console.log(component.count);
component.count += 1;
```
