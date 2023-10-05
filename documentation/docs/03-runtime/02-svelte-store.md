---
title: 'svelte/store'
---

O módulo `svelte/store` exporta funções para a criação de memórias [legíveis](/docs/svelte-store#readable), [graváveis](/docs/svelte-store#writable), [derivadas](/docs/svelte-store#derived).

Temos que lembrar-nos de que não _precisamos_ usar estas funções para desfrutar da [sintaxe `$store` reativa](/docs/svelte-components#script-4-prefix-stores-with-$-to-access-their-values) nos nossos componentes. Qualquer objeto que implementa corretamente a `.subscribe`, a anulação de subscrição, e (opcionalmente) a `.set` é uma memória válida, e funcionará com ambas sintaxe especial e com as [memórias `derived`](/docs/svelte-store#derived) embutidas da Svelte.

Isto torna possível envolver quase qualquer outra biblioteca de manipulação de estado reativo para usar na Svelte. Leia mais sobre o [contrato de memória](/docs/svelte-components#script-4-prefix-stores-with-$-to-access-their-values) para ver como uma implementação correta se parece.

## `writable`

> EXPORT_SNIPPET: svelte/store#writable

Função que cria uma memória que tem valores que podem ser definidos a partir dos componentes 'de fora'. É criada como um objeto com métodos `set` e `update` adicionais.

`set` é um método que recebe um argumento que é o valor à ser definido. O valor da memória é definido ao valor do argumento se o valor da memória já não for igual a ele.

`update` é um método que recebe um argumento que é uma função de resposta. A função de resposta recebe o valor da memória existente como seu argumento e retorna o novo valor à ser definido à memória:

```js
/// file: store.js
import { writable } from 'svelte/store';

const count = writable(0);

count.subscribe((value) => {
	console.log(value);
}); // regista '0'

count.set(1); // regista '1'

count.update((n) => n + 1); // regista '2'
```

Se uma função for passada como segundo argumento, será chamada quando o número de subscritores segue de zero à um (mas não de um à dois, etc). Esta função será passada uma função `set` que muda o valor da memória, e uma função `update` que funciona tal como o método `update` na memória, recebendo uma função de resposta para calcular o novo valor da memória a partir do antigo valor. Ela deve retornar uma função `stop` que é chamada quando a contagem do subscritor segue de um à zero:

```js
/// file: store.js
import { writable } from 'svelte/store';

const count = writable(0, () => {
	console.log('got a subscriber');
	return () => console.log('no more subscribers');
});

count.set(1); // não faz nada

const unsubscribe = count.subscribe((value) => {
	console.log(value);
}); // regista 'got a subscriber', depois '1'

unsubscribe(); // regista 'no more subscribers'
```

Nota que o valor duma `writable` é perdido quando for destruída, por exemplo quando a página é atualizada. No entanto, podemos escrever a nossa própria lógica para sincronizar o valor ao por exemplo a `localStorage`.

## `readable`

> EXPORT_SNIPPET: svelte/store#readable

Cria uma memória cujo valor não pode ser definido a partir do 'lado de fora', o primeiro argumento é o valor inicial da memória, e o segundo argumento para `readable` é o mesmo segundo argumento para `writable`:

```js
<!--- file: App.svelte --->
// ---cut---
import { readable } from 'svelte/store';

const time = readable(new Date(), (set) => {
	set(new Date());

	const interval = setInterval(() => {
		set(new Date());
	}, 1000);

	return () => clearInterval(interval);
});

const ticktock = readable('tick', (set, update) => {
	const interval = setInterval(() => {
		update((sound) => (sound === 'tick' ? 'tock' : 'tick'));
	}, 1000);

	return () => clearInterval(interval);
});
```

## `derived`

> EXPORT_SNIPPET: svelte/store#derived

Deriva uma memória a partir duma ou mais outras memórias. A função de resposta executa inicialmente quando o primeiro subscritor subscrever-se e depois sempre que as dependências da memória mudarem.

Na versão mais simples, `derived` recebe uma única memória, e a função de resposta retorna um valor derivado:

```ts
// @filename: ambient.d.ts
import { type Writable } from 'svelte/store';

declare global {
	const a: Writable<number>;
}

export {};

// @filename: index.ts
// ---cut---
import { derived } from 'svelte/store';

const doubled = derived(a, ($a) => $a * 2);
```

A função de resposta pode definir um valor de maneira assíncrona aceitando um segundo argumento, `set`, e um terceiro argumento opcional, `update`, chamando nenhum ou ambos quando apropriado.

Neste caso, também podemos passar um terceiro argumento à `derived` — o valor inicial da memória derivada antes de `set` ou `update` é chamado primeiro. Se nenhum valor inicial for especificado, o valor inicial da memória será `undefined`:

```js
// @filename: ambient.d.ts
import { type Writable } from 'svelte/store';

declare global {
	const a: Writable<number>;
}

export {};

// @filename: index.ts
// @errors: 18046 2769 7006
// ---cut---
import { derived } from 'svelte/store';

const delayed = derived(a, ($a, set) => {
	setTimeout(() => set($a), 1000);
}, 2000);

const delayedIncrement = derived(a, ($a, set, update) => {
	set($a);
	setTimeout(() => update(x => x + 1), 1000);
	// toda vez que `$a` produzir um valor, esta produz dois
	// valores, `$a` imediatamente e depois `$a + 1` um segundo depois
});
```

Se retornarmos uma função a partir da função de resposta, será chamada quando a) a função de resposta executar novamente, ou b) o último subscritor anular a subscrição:

```js
// @filename: ambient.d.ts
import { type Writable } from 'svelte/store';

declare global {
	const frequency: Writable<number>;
}

export {};

// @filename: index.ts
// ---cut---
import { derived } from 'svelte/store';

const tick = derived(
	frequency,
	($frequency, set) => {
		const interval = setInterval(() => {
			set(Date.now());
		}, 1000 / $frequency);

		return () => {
			clearInterval(interval);
		};
	},
	2000
);
```

Em ambos casos, um vetor de argumentos pode ser passado como primeiro argumento ao invés duma única memória:

```ts
// @filename: ambient.d.ts
import { type Writable } from 'svelte/store';

declare global {
	const a: Writable<number>;
	const b: Writable<number>;
}

export {};

// @filename: index.ts

// ---cut---
import { derived } from 'svelte/store';

const summed = derived([a, b], ([$a, $b]) => $a + $b);

const delayed = derived([a, b], ([$a, $b], set) => {
	setTimeout(() => set($a + $b), 1000);
});
```

## `readonly`

> EXPORT_SNIPPET: svelte/store#readonly

Esta função auxiliar simples torna uma memória disponível apenas para leitura. Nós ainda podemos subscrever às mudanças a partir do original usando esta nova memória legível:

```js
import { readonly, writable } from 'svelte/store';

const writableStore = writable(1);
const readableStore = readonly(writableStore);

readableStore.subscribe(console.log);

writableStore.set(2); // console: 2
// @errors: 2339
readableStore.set(2); // ERROR
```

## `get`

> EXPORT_SNIPPET: svelte/store#get

Geralmente, devemos ler o valor duma memória subscrevendo à ela e usando o valor a medida que mudar ao longo do tempo. Ocasionalmente, podemos precisar de recuperar o valor duma memória para qual não estamos subscritos. `get` permite-nos fazer isto.

> Isto funciona criando uma subscrição, lendo o valor, depois anulando a subscrição. Portanto não é recomendado nos caminhos de código de última hora.

```js
// @filename: ambient.d.ts
import { type Writable } from 'svelte/store';

declare global {
	const store: Writable<string>;
}

export {};

// @filename: index.ts
// ---cut---
import { get } from 'svelte/store';

const value = get(store);
```

## Tipos

> TYPES: svelte/store
