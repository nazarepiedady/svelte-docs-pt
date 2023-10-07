---
title: 'svelte/animate'
---

O módulo `svelte/animate` exporta uma função para usar com as [animações](/docs/element-directives#animate-fn) da Svelte.

## `flip`

> EXPORT_SNIPPET: svelte/animate#flip

```svelte
animate:flip={params}
```

A função `flip` calcula a posição inicial e final dum elemento e anima entre elas, passando os valores de `x` e `y`. `flip` significa [First (Primeiro), Last (Último), Invert (Inverter), Play (Tocar)](https://aerotwist.com/blog/flip-your-animations/).

`flip` aceita os seguintes parâmetros:

- `delay` (`number`, predefine 0) — milissegundos antes de começar
- `duration` (`number` | `function`, predefine `d => Math.sqrt(d) * 120`) — consulte abaixo
- `easing` (`function`, predefine `cubicOut`) — uma [função de atenuação](/docs/svelte-easing)

`duration` pode ser fornecido ou como:

- um `number`, em milissegundos.
- uma função, `distance: number => duration: number`, recebendo a distância que o elemento percorrerá em píxeis e retornando a duração em milissegundos. Isto permite-nos atribuir uma duração que é relativa à distância percorrida por cada elemento.

Nós podemos consultar um exemplo completo no [seminário de animações](https://learn.svelte.dev/tutorial/animate):

```svelte
<script>
	import { flip } from 'svelte/animate';
	import { quintOut } from 'svelte/easing';

	let list = [1, 2, 3];
</script>

{#each list as n (n)}
	<div animate:flip={{ delay: 250, duration: 250, easing: quintOut }}>
		{n}
	</div>
{/each}
```

## Tipos

> TYPES: svelte/animate
