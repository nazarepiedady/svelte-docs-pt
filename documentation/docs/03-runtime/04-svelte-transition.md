---
title: 'svelte/transition'
---

O módulo `svelte/transition` exporta sente funções: `fade`, `blur`, `fly`, `slide`, `scale`, `draw` e `crossfade`. Elas são para usar com as [`transitions`](/docs/element-directives#transition-fn) da Svelte.

## `fade`

> EXPORT_SNIPPET: svelte/transition#fade

```svelte
transition:fade={params}
```

```svelte
in:fade={params}
```

```svelte
out:fade={params}
```

Anima a opacidade dum elemento de 0 à opacidade atual para as transições de `in` e da opacidade atual à 0 para as transições de `out`.

`fade` aceita os seguintes parâmetros:

- `delay` (`number`, predefinido como `0`) — milissegundos antes de começar
- `duration` (`number`, predefinido como `400`) — milissegundos que a transição dura
- `easing` (`function`, predefinido como `linear`) — uma [função de atenuação](/docs/svelte-easing)

Nós podemos ver a transição de `fade` em ação no [tutorial de transição](https://learn-svelte-pt.vercel.app/tutorial/transition):

```svelte
<script>
	import { fade } from 'svelte/transition';
</script>

{#if condition}
	<div transition:fade={{ delay: 250, duration: 300 }}>fades in and out</div>
{/if}
```

## `blur`

> EXPORT_SNIPPET: svelte/transition#blur

```svelte
transition:blur={params}
```

```svelte
in:blur={params}
```

```svelte
out:blur={params}
```

Anima um filtro de `blur` em conjunto da opacidade dum elemento.

`blur` aceita os seguintes parâmetros:

- `delay` (`number`, predefinido como `0`) — milissegundos antes de começar
- `duration` (`number`, predefinido como `400`) — milissegundos que a transição dura
- `easing` (`function`, predefinido como `cubicInOut`) — uma [função de atenuação](/docs/svelte-easing)
- `opacity` (`number`, predefinido como `0`) - o valor de opacidade para qual e de onde animar
- `amount` (`number | string`, predefinido como `5`) - o tamanho da névoa. Suporta unidades de CSS (por exemplo: `"4rem"`). A unidade padrão é `px`.

```svelte
<script>
	import { blur } from 'svelte/transition';
</script>

{#if condition}
	<div transition:blur={{ amount: 10 }}>fades in and out</div>
{/if}
```

## `fly`

> EXPORT_SNIPPET: svelte/transition#fly

```svelte
transition:fly={params}
```

```svelte
in:fly={params}
```

```svelte
out:fly={params}
```

Anima as posições x e y e a opacidade dum elemento. As transições de `in` animam a partir dos valores fornecidos, passados como parâmetros aos valores padrão do elemento. As transições de `out` animam a partir dos valores padrão do elemento ao valores fornecidos.

`fly` aceita os seguintes parâmetros:

- `delay` (`number`, predefinido como `0`) — milissegundos antes de começar
- `duration` (`number`, predefinido como `400`) — milissegundos que a transição dura
- `easing` (`function`, predefinido como `cubicOut`) — uma [função de atenuação](/docs/svelte-easing)
- `x` (`number | string`, predefinido como `0`) - a distância `x` para qual e de onde animar
- `y` (`number | string`, predefinido como `0`) - a distância `y` para qual e de onde animar
- `opacity` (`number`, predefinido como `0`) - o valor de opacidade para qual e de onde animar

`x` e `y` usam `px` por padrão mas suportam unidades de CSS, por exemplo `x: '100vw'` ou `y: '50%'`. Nós podemos ver a transição de `fly` em ação no [tutorial de transição](https://learn.svelte.dev/tutorial/adding-parameters-to-transitions).

```svelte
<script>
	import { fly } from 'svelte/transition';
	import { quintOut } from 'svelte/easing';
</script>

{#if condition}
	<div
		transition:fly={{ delay: 250, duration: 300, x: 100, y: 500, opacity: 0.5, easing: quintOut }}
	>
		flies in and out
	</div>
{/if}
```

## `slide`

> EXPORT_SNIPPET: svelte/transition#slide

```svelte
transition:slide={params}
```

```svelte
in:slide={params}
```

```svelte
out:slide={params}
```

Desliza um elemento para dentro e fora.

`slide` aceita os seguintes parâmetros:

- `delay` (`number`, predefinido como `0`) — milissegundos antes de começar
- `duration` (`number`, predefinido como `400`) — milissegundos que a transição dura
- `easing` (`function`, predefinido como `cubicOut`) — uma [função de atenuação](/docs/svelte-easing)

* `axis` (`x` | `y`, predefinido como `y`) — o eixo do movimento ao longo de qual transição ocorre

```svelte
<script>
	import { slide } from 'svelte/transition';
	import { quintOut } from 'svelte/easing';
</script>

{#if condition}
	<div transition:slide={{ delay: 250, duration: 300, easing: quintOut, axis: 'x' }}>
		slides in and out horizontally
	</div>
{/if}
```

## `scale`

> EXPORT_SNIPPET: svelte/transition#scale

```svelte
transition:scale={params}
```

```svelte
in:scale={params}
```

```svelte
out:scale={params}
```

Anima a opacidade e escala dum elemento. As transições de `in` animam a partir dos valores (padrão) atuais dum elemento aos valores fornecidos, passados como parâmetros. As transições de `out` anima a partir dos valores fornecidos aos valores padrão dum elemento.

`scale` aceita os seguintes parâmetros:

- `delay` (`number`, predefinido como `0`) — milissegundos antes de começar
- `duration` (`number`, predefinido como `400`) — milissegundos que a transição dura
- `easing` (`function`, predefinido como `cubicOut`) — uma [função de atenuação](/docs/svelte-easing)
- `start` (`number`, predefinido como `0`) - o valor de escala para qual e de onde animar
- `opacity` (`number`, predefinido como `0`) - o valor de opacidade para qual e de onde animar

```svelte
<script>
	import { scale } from 'svelte/transition';
	import { quintOut } from 'svelte/easing';
</script>

{#if condition}
	<div transition:scale={{ duration: 500, delay: 500, opacity: 0.5, start: 0.5, easing: quintOut }}>
		scales in and out
	</div>
{/if}
```

## `draw`

> EXPORT_SNIPPET: svelte/transition#draw

```svelte
transition:draw={params}
```

```svelte
in:draw={params}
```

```svelte
out:draw={params}
```

Anima a traço dum elemento de SVG, tal como cobra num tubo. As transições de `in` começam com o caminho invisível e desenham o caminho ao ecrã durante o tempo. As transições de `out` começam num estado visível e apagam gradualmente o caminho. `draw` apenas funciona com elementos que têm um método `getTotalLength`, tais como `<path>` e `<polyline>`.

`draw` aceita os seguintes parâmetros:

- `delay` (`number`, predefinido como `0`) — milissegundos antes de começar
- `speed` (`number`, predefinido como `undefined`) - a velocidade da animação, consultar abaixo.
- `duration` (`number` | `function`, predefinido como `800`) — milissegundos que a transição dura
- `easing` (`function`, predefinido como `cubicInOut`) — uma [função de atenuação](/docs/svelte-easing)

O parâmetro `speed` é um meio de definir a duração da transição relativa ao comprimento do caminho. É um modificador que é aplicado ao comprimento do caminho: `duration = length / speed`. Um caminho que é de 1000 píxeis com uma velocidade de 1 terá a duração de `1000ms`, definir a velocidade para `0.5` dobrará esta duração e defini-la para `2` a reduzirá a metade.

```svelte
<script>
	import { draw } from 'svelte/transition';
	import { quintOut } from 'svelte/easing';
</script>

<svg viewBox="0 0 5 5" xmlns="http://www.w3.org/2000/svg">
	{#if condition}
		<path
			transition:draw={{ duration: 5000, delay: 500, easing: quintOut }}
			d="M2 1 h1 v1 h1 v1 h-1 v1 h-1 v-1 h-1 v-1 h1 z"
			fill="none"
			stroke="cornflowerblue"
			stroke-width="0.1px"
			stroke-linejoin="round"
		/>
	{/if}
</svg>
```

## `crossfade`

> EXPORT_SNIPPET: svelte/transition#crossfade

A função `crossfade` cria um par de [transições](/docs/element-directives#transition-fn) chamados de `send` e `receive`. Quando um elemento é 'enviado', procura por um elemento correspondente sendo 'recebido', e gera uma transição que transforma o elemento para a posição do seu equivalente e o desvanece. Quando um elemento é 'recebido', o inverso acontece. Se não existir nenhum equivalente, a transição de `fallback` é usada.

`crossfade` aceita os seguintes parâmetros:

- `delay` (`number`, predefinido como `0`) — milissegundos antes de começar
- `duration` (`number` | `function`, predefinido como `800`) — milissegundos que a transição dura
- `easing` (`function`, predefinido como `cubicOut`) — uma [função de atenuação](/docs/svelte-easing)
- `fallback` (`function`) — Uma [transição](/docs/element-directives#transition-fn) de retrocesso à usar para enviar quando não existir nenhum elemento correspondente sendo recebido, e para receber quando não existir nenhum elemento sendo enviado.

```svelte
<script>
	import { crossfade } from 'svelte/transition';
	import { quintOut } from 'svelte/easing';

	const [send, receive] = crossfade({
		duration: 1500,
		easing: quintOut
	});
</script>

{#if condition}
	<h1 in:send={{ key }} out:receive={{ key }}>BIG ELEM</h1>
{:else}
	<small in:send={{ key }} out:receive={{ key }}>small elem</small>
{/if}
```

## Tipos

> TYPES: svelte/transition
