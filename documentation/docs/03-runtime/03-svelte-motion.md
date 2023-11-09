---
title: 'svelte/motion'
---

O módulo `svelte/motion` exporta duas funções, `tweened` e `spring`, para criação de memórias graváveis cujos valores mudam ao longo do tempo depois de `set` e `update`, ao invés de imediatamente.

## `tweened`

> EXPORT_SNIPPET: svelte/motion#tweened

As memórias intercaladas atualizam seus valores sobre uma duração fixada. As seguintes opções estão disponíveis:

- `delay` (`number`, predefine 0) — milissegundos antes de começar
- `duration` (`number` | `function`, predefine 400) — milissegundos que a intercalação dura
- `easing` (`function`, predefine `t => t`) — uma [função de atenuação](/docs/svelte-easing)
- `interpolate` (`function`) — consulte abaixo

`store.set` e `store.update` podem aceitar um segundo argumento `options` que sobreporão as opções passadas sobre a instância.

Ambas funções retornam uma promessa que resolve quando a intercalação terminar. Se a intercalação for interrompida a promessa nunca resolverá.

Fora da caixa, a Svelte interpolará entre dois números, dois vetores ou dois objetos (enquanto os vetores e objetos forem da mesma 'forma' e suas propriedades 'folha' também forem números):

```svelte
<script>
	import { tweened } from 'svelte/motion';
	import { cubicOut } from 'svelte/easing';

	const size = tweened(1, {
		duration: 300,
		easing: cubicOut
	});

	function handleClick() {
		// isto é equivalente ao `size.update(n => n + 1)`
		$size += 1;
	}
</script>

<button on:click={handleClick} style="transform: scale({$size}); transform-origin: 0 0">
	embiggen
</button>
```

Se o valor inicial for `undefined` ou `null`, a mudança do primeiro valor surtirá efeito imediatamente. Isto é útil quando temos valores intercalados que são baseados nas propriedades, e não queremos nenhum movimento quando o componente interpretar em primeiro lugar:

```ts
// @filename: ambient.d.ts
declare global {
	var $size: number;
	var big: number;
}

export {};
// @filename: motion.ts
// ---cut---
import { tweened } from 'svelte/motion';
import { cubicOut } from 'svelte/easing';

const size = tweened(undefined, {
	duration: 300,
	easing: cubicOut
});

$: $size = big ? 100 : 10;
```

A opção `interpolate` permite-nos intercalar entre _quaisquer_ valores arbitrários. Deve ser uma função `(a, b) => t => value`, onde `a` é o valor inicial, `b` é o valor objetivo, `t` é um número entre 0 e 1, e `value` é o resultado. Por exemplo, podemos usar o pacote [`d3-interpolate`](https://github.com/d3/d3-interpolate) para interpolar suavemente entre duas cores:

```svelte
<script>
	import { interpolateLab } from 'd3-interpolate';
	import { tweened } from 'svelte/motion';

	const colors = ['rgb(255, 62, 0)', 'rgb(64, 179, 255)', 'rgb(103, 103, 120)'];

	const color = tweened(colors[0], {
		duration: 800,
		interpolate: interpolateLab
	});
</script>

{#each colors as c}
	<button style="background-color: {c}; color: white; border: none;" on:click={(e) => color.set(c)}>
		{c}
	</button>
{/each}

<h1 style="color: {$color}">{$color}</h1>
```

## `spring`

> EXPORT_SNIPPET: svelte/motion#spring

Uma memória `spring` muda gradualmente para o seu valor objetivo baseada no seus parâmetros `stiffness` e `damping`. Visto que as memórias `tweened` mudam seus valores sobre uma duração fixada, as memórias `spring` mudam sobre uma duração que é determinada por sua velocidade, permitindo movimentação de aparência mais natural em muitas situações. As seguintes opções estão disponíveis:

- `stiffness` (`number`, predefine `0.15`) — um valor entre 0 e 1 onde mais alto significa um salto 'mais apertado'.
- `damping` (`number`, predefine `0.8`) — um valor entre 0 e 1 onde mais baixo significa um salto 'mais enérgico'.
- `precision` (`number`, predefine `0.01`) — determina o limiar no qual o salto é considerado ter 'acalmado', onde mais baixo significa mais preciso.

Todos as opções acima podem ser mudadas enquanto o salto estiver em movimento, e surtirão efeito imediato:

```js
import { spring } from 'svelte/motion';

const size = spring(100);
size.stiffness = 0.3;
size.damping = 0.4;
size.precision = 0.005;
```

Tal como acontece com as memórias [`tweened`](/docs/svelte-motion#tweened), `set` e `update` retornam uma promessa que resolve se o salto acalmar-se.

Ambas `set` e `update` podem receber um segundo argumento — um objeto com as propriedades `hard` ou `soft`. `{ hard: true }` define o valor do alvo imediatamente; `{ soft: n }` preserva a velocidade existente por `n` segundos antes de acalmar. `{ soft: true }` é equivalente ao `{ soft: 0.5 }`:

```js
import { spring } from 'svelte/motion';

const coords = spring({ x: 50, y: 50 });
// atualiza o valor imediatamente
coords.set({ x: 100, y: 200 }, { hard: true });
// preserva a velocidade existente por 1s
coords.update(
	(target_coords, coords) => {
		return { x: target_coords.x, y: coords.y };
	},
	{ soft: 1 }
);
```

[Consulte um exemplo completo no tutorial de salto.](https://learn-svelte-pt.vercel.app/tutorial/springs)

```svelte
<script>
	import { spring } from 'svelte/motion';

	const coords = spring(
		{ x: 50, y: 50 },
		{
			stiffness: 0.1,
			damping: 0.25
		}
	);
</script>
```

Se o valor inicial for `undefined` ou `null`, a mudança do primeiro valor surtirá efeito imediatamente, tal como acontece com os valores `tweened` (consulte acima):

```ts
// @filename: ambient.d.ts
declare global {
	var $size: number;
	var big: number;
}

export {};

// @filename: motion.ts
// ---cut---
import { spring } from 'svelte/motion';

const size = spring();
$: $size = big ? 100 : 10;
```

## Tipos

> TYPES: svelte/motion
