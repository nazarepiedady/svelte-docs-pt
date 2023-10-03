---
title: svelte
---

O pacote `svelte` expõe as [funções do ciclo de vida](https://learn.svelte.dev/tutorial/onmount) e a [API de contexto](https://learn.svelte.dev/tutorial/context-api).

## `onMount`

> EXPORT_SNIPPET: svelte#onMount

A função `onMount` agenda uma função de resposta à executar logo que o componente tiver sido montado ao DOM. Esta deve ser chamada durante a inicialização do componente (mas não precisa morar _dentro_ do componente; pode ser chamada a partir dum módulo externo).

`onMount` não executa dentro dum [componente do lado do servidor](/docs/server-side-component-api):

```svelte
<script>
	import { onMount } from 'svelte';

	onMount(() => {
		console.log('the component has mounted');
	});
</script>
```

Se uma função for retornada a partir de `onMount`, será chamada quando o componente for desmontado:

```svelte
<script>
	import { onMount } from 'svelte';

	onMount(() => {
		const interval = setInterval(() => {
			console.log('beep');
		}, 1000);

		return () => clearInterval(interval);
	});
</script>
```

> Este comportamento apenas funcionará quando a função passada à `onMount` retornar _de maneira síncrona_ um valor. As funções `async` sempre retornam uma `Promise`, e como tal não podem retornar _de maneira síncrona_ uma função.

## `beforeUpdate`

> EXPORT_SNIPPET: svelte#beforeUpdate

Agenda uma função de resposta à executar imediatamente antes do componente ser atualizado depois de qualquer mudança.

> A primeira vez que a função de resposta executar será antes da `onMount` inicial

```svelte
<script>
	import { beforeUpdate } from 'svelte';

	beforeUpdate(() => {
		console.log('the component is about to update');
	});
</script>
```

## `afterUpdate`

> EXPORT_SNIPPET: svelte#afterUpdate

Agenda uma função de resposta à executar imediatamente depois do componente tiver sido atualizado.

> A primeira vez que a função de resposta executar será depois da `onMount` inicial

```svelte
<script>
	import { afterUpdate } from 'svelte';

	afterUpdate(() => {
		console.log('the component just updated');
	});
</script>
```

## `onDestroy`

> EXPORT_SNIPPET: svelte#onDestroy

Agenda uma função de resposta à executar imediatamente antes do componente ser desmontado.

Fora a `onMount`, `beforeUpdate`, `afterUpdate` e `onDestroy`, esta é a única que executa dentro dum componente do lado do servidor:

```svelte
<script>
	import { onDestroy } from 'svelte';

	onDestroy(() => {
		console.log('the component is being destroyed');
	});
</script>
```

## `tick`

> EXPORT_SNIPPET: svelte#tick

Retorna uma promessa que resolve assim que quaisquer mudanças de estado pendentes tiverem sido aplicadas, ou na próxima micro-tarefa se não existirem nenhuma mudança a ser aplicada:

```svelte
<script>
	import { beforeUpdate, tick } from 'svelte';

	beforeUpdate(async () => {
		console.log('the component is about to update');
		await tick();
		console.log('the component just updated');
	});
</script>
```

## `setContext`

> EXPORT_SNIPPET: svelte#setContext

Associa um objeto `context` arbitrário com o componente atual e a `key` especificada e retorna este objeto. O contexto está então disponível aos filhos do componente (incluindo conteúdo isolado) com a `getContext`.

Tal como as funções do ciclo de vida, esta deve ser chamada durante a inicialização do componente:

```svelte
<script>
	import { setContext } from 'svelte';

	setContext('answer', 42);
</script>
```

> O contexto não é inerentemente reativo. Se precisarmos de valores reativos no contexto então podemos passar uma memória ao contexto, que _será_ reativo.

## `getContext`

> EXPORT_SNIPPET: svelte#getContext

Recupera o contexto que pertence ao componente pai mais próximo com a `key` especificada. Deve ser chamada durante a inicialização do componente:

```svelte
<script>
	import { getContext } from 'svelte';

	const answer = getContext('answer');
</script>
```

## `hasContext`

> EXPORT_SNIPPET: svelte#hasContext

Verifica se uma dada `key` foi definida no contexto dum componente pai. Deve ser chamada durante a inicialização do componente:

```svelte
<script>
	import { hasContext } from 'svelte';

	if (hasContext('answer')) {
		// fazer algo
	}
</script>
```

## `getAllContexts`

> EXPORT_SNIPPET: svelte#getAllContexts

Recupera o mapa do contexto inteiro que pertence ao componente pai mais próximo. Deve ser chamada durante a inicialização do componente. Útil, por exemplo, se criarmos programaticamente um componente e quisermos passar o contexto existente à ele:

```svelte
<script>
	import { getAllContexts } from 'svelte';

	const contexts = getAllContexts();
</script>
```

## `createEventDispatcher`

> EXPORT_SNIPPET: svelte#createEventDispatcher

Cria um despachador de evento que pode ser usado para despachar [eventos do componente](/docs/component-directives#on-eventname). Os despachadores de evento são funções que podem receber dois argumentos `name` e `detail`.

Os eventos do componente criados com `createEventDispatcher` criam um [`CustomEvent`](https://developer.mozilla.org/en-US/docs/Web/API/CustomEvent). Estes eventos não [transbordam](https://developer.mozilla.org/en-US/docs/Learn/JavaScript/Building_blocks/Events#Event_bubbling_and_capture). O argumento `detail` corresponde à propriedade [`CustomEvent.detail`](https://developer.mozilla.org/en-US/docs/Web/API/CustomEvent/detail) e pode conter qualquer tipo de dado:

```svelte
<script>
	import { createEventDispatcher } from 'svelte';

	const dispatch = createEventDispatcher();
</script>

<button on:click={() => dispatch('notify', 'detail value')}>Fire Event</button>
```

Os eventos despachados a partir dos componentes filhos podem ser ouvidos nos seus pais. Qualquer dado fornecido quando o evento foi despachado está disponível na propriedade `detail` do objeto do evento:

```svelte
<script>
	function callbackFunction(event) {
		console.log(`Notify fired! Detail: ${event.detail}`);
	}
</script>

<Child on:notify={callbackFunction} />
```

Os eventos podem ser canceláveis passando um terceiro parâmetro à função de despacho. A função retorna `false` se o evento for cancelado com `event.preventDefault()`, de outro modo retorna `true`:

```svelte
<script>
	import { createEventDispatcher } from 'svelte';

	const dispatch = createEventDispatcher();

	function notify() {
		const shouldContinue = dispatch('notify', 'detail value', { cancelable: true });
		if (shouldContinue) {
			// ninguém chamou `preventDefault`
		} else {
			// um ouvinte chamou `preventDefault`
		}
	}
</script>
```

Nós podemos tipificar o despachador de evento para definir quais eventos pode receber. Isto tornará o nosso código mais seguro no que diz respeito a tipo tanto dentro do componente (chamadas erradas são sinalizadas) como quando usarmos o componente (tipos de eventos agora são reduzidos). Consulte [neste material](typescript#script-lang-ts-events) como fazer isto.

## Tipos

> TYPES: svelte
