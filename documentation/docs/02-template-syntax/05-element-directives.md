---
title: Diretivas do Elemento
---

Tal como os atributos, os elementos podem ter _diretivas_, os quais controlam o comportamento do componente de alguma maneira.

## on:_eventname_

```svelte
on:eventname={handler}
```

```svelte
on:eventname|modifiers={handler}
```

Usamos a diretiva `on:` para ouvir os eventos do DOM:

```svelte
<!--- file: App.svelte --->
<script>
	let count = 0;

	/** @param {MouseEvent} event */
	function handleClick(event) {
		count += 1;
	}
</script>

<button on:click={handleClick}>
	count: {count}
</button>
```

Os manipuladores podem ser declarados em linha sem penalização de desempenho. Tal como acontece com os atributos, os valores da diretiva podem estar entre aspas para o bem do destacadores de sintaxe:

```svelte
<button on:click={() => (count += 1)}>
	count: {count}
</button>
```

Adicionamos os _modificadores_ aos eventos do DOM com o carácter `|`:

```svelte
<form on:submit|preventDefault={handleSubmit}>
	<!-- o padrão do evento `submit` é impedido,
	     então a página não recarregará -->
</form>
```

Os seguintes modificadores estão disponíveis:

- `preventDefault` — chama `event.preventDefault()` antes de executar o manipulador
- `stopPropagation` — chama `event.stopPropagation()`, impedindo o evento de alcançar o próximo elemento
- `stopImmediatePropagation` - chama `event.stopImmediatePropagation()`, impedindo os outros ouvintes do mesmo evento de serem disparados.
- `passive` — melhora o desempenho do deslocamento sobre os eventos de toque ou roda (a Svelte o adicionará automaticamente onde for seguro)
- `nonpassive` — define explicitamente `passive: false`
- `capture` — dispara o manipulador durante a fase de _captura_ ao invés da fase _borbulhante_
- `once` — remove o manipulador depois de ser executado uma vez
- `self` — apenas aciona o manipulador se `event.target` for o próprio elemento
- `trusted` — apenas aciona o manipulador se `event.isTrusted` for `true`. Por exemplo, se o evento for acionado por uma ação do utilizador.

Os modificadores podem ser encadeados, por exemplo `on:click|once|capture={...}`.

Se a diretiva `on:` for usada sem um valor, o componente _expedirá_ o evento, o que significa que um consumidor do componente pode ouvir o evento:

```svelte
<button on:click> The component itself will emit the click event </button>
```

É possível ter vários ouvintes de evento para o mesmo evento:

```svelte
<!--- file: App.svelte --->
<script>
	let counter = 0;
	function increment() {
		counter = counter + 1;
	}

	/** @param {MouseEvent} event */
	function track(event) {
		trackEvent(event);
	}
</script>

<button on:click={increment} on:click={track}>Click me!</button>
```

## bind:_property_

```svelte
bind:property={variable}
```

Os dados normalmente fluem para baixo, do pai ao filho. A diretiva `bind:` permite os dados fluírem de outra maneira, do filho ao pai. A maioria dos vínculos são específicos aos elementos em especial.

Os vínculos mais simples refletem o valor duma propriedade, tais como `input.value`:

```svelte
<input bind:value={name} />
<textarea bind:value={text} />

<input type="checkbox" bind:checked={yes} />
```

Se o nome corresponder o valor, podemos usar uma abreviação:

```svelte
<input bind:value />
<!-- equivalente ao
<input bind:value={value} />
-->
```

Os valores de entrada numérica são coagidos; apesar de `input.value` ser uma sequência de caracteres, no que diz respeito ao DOM, a svelte a tratará como um número. Se a entrada estiver vazia ou for inválida (no caso de `type="number"`), o valor é `undefined`:

```svelte
<input type="number" bind:value={num} />
<input type="range" bind:value={num} />
```

Nos elementos de `<input>` com `type="file"`, podemos usar `bind:files` para receber o [`FileList` dos ficheiros selecionados](https://developer.mozilla.org/en-US/docs/Web/API/FileList). É apenas para leitura:

```svelte
<label for="avatar">Upload a picture:</label>
<input accept="image/png, image/jpeg" bind:files id="avatar" name="avatar" type="file" />
```

Se estivermos a usar as diretivas de `bind:` juntamente com as diretivas `on:`, a ordem em que foram definidas afetam o valor da variável vinculada quando o manipulador de evento for chamado:

```svelte
<script>
	let value = 'Hello World';
</script>

<input
	on:input={() => console.log('Old value:', value)}
	bind:value
	on:input={() => console.log('New value:', value)}
/>
```

Neste exemplo estávamos a vincular ao valor duma entrada de texto, que usa o evento `input`. Os vínculos sobre outros elementos podem usar diferentes eventos tais como `change`.

## Vincular o Valor de `<select>`

Um vínculo de valor de `<select>` corresponde à propriedade `value` sobre o `<option>` selecionado, que pode ser qualquer valor (não apenas sequências de caracteres, já que é normalmente o caso no DOM):

```svelte
<select bind:value={selected}>
	<option value={a}>a</option>
	<option value={b}>b</option>
	<option value={c}>c</option>
</select>
```

Um elemento `<select multiple>` comporta-se de maneira semelhante à um grupo de caixa de confirmação. A variável vinculada é um vetor com uma entrada correspondente à propriedade `value` de cada `<option>` selecionado:

```svelte
<select multiple bind:value={fillings}>
	<option value="Rice">Rice</option>
	<option value="Beans">Beans</option>
	<option value="Cheese">Cheese</option>
	<option value="Guac (extra)">Guac (extra)</option>
</select>
```

Quando o valor dum `<option>` corresponde o seu conteúdo de texto, o atributo pode ser omitido:

```svelte
<select multiple bind:value={fillings}>
	<option>Rice</option>
	<option>Beans</option>
	<option>Cheese</option>
	<option>Guac (extra)</option>
</select>
```

Os elementos com o atributo `contenteditable` suporta os seguintes vínculos:

- [`innerHTML`](https://developer.mozilla.org/en-US/docs/Web/API/Element/innerHTML)
- [`innerText`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement/innerText)
- [`textContent`](https://developer.mozilla.org/en-US/docs/Web/API/Node/textContent)

Existem ligeiras diferenças entre cada um destes, leia mais sobre as mesma [nesta ligação](https://developer.mozilla.org/en-US/docs/Web/API/Node/textContent#Differences_from_innerText):

```svelte
<div contenteditable="true" bind:innerHTML={html} />
```

Os elementos de `<details>` suportam vínculo à propriedade `open`:

```svelte
<details bind:open={isOpen}>
	<summary>Details</summary>
	<p>Something small enough to escape casual notice.</p>
</details>
```

## Vínculos de Elemento de Media

Os elementos de media (`<audio>` e `<video>`) têm o seu próprio conjunto de vínculos — sete que _apenas suportam a leitura_...

- `duration` (apenas leitura) — a duração total do vídeo, em segundos
- `buffered` (apenas leitura) — um vetor de objetos `{start, end}`
- `played` (apenas leitura) — idem
- `seekable` (apenas leitura) — idem
- `seeking` (apenas leitura) — booleano
- `ended` (apenas leitura) — booleano
- `readyState` (apenas leitura) — número entre (e incluindo) 0 e 4

...e cinco vínculos _bidirecionais_:

- `currentTime` — o tempo de repetição atual no vídeo, em segundos
- `playbackRate` — quão rápido ou lento tocar o vídeo, onde 1 é 'normal'
- `paused` — este deve ser auto-explicativo
- `volume` — um valor entre 0 e 1
- `muted` — um valor booleano indicando se o leitor está abafado

Os vídeos têm adicionalmente vínculos `videoWidth` e `videoHeight` de apenas leitura:

```svelte
<video
	src={clip}
	bind:duration
	bind:buffered
	bind:played
	bind:seekable
	bind:seeking
	bind:ended
	bind:readyState
	bind:currentTime
	bind:playbackRate
	bind:paused
	bind:volume
	bind:muted
	bind:videoWidth
	bind:videoHeight
/>
```

## Vínculos do Elemento de Imagem

Os elementos de imagem (`<img>`) têm dois vínculos de apenas leitura:

- `naturalWidth` (apenas leitura) — a largura original da imagem, disponível depois da imagem ser carregada
- `naturalHeight` (apenas leitura) — a altura original da imagem, disponível depois da imagem ser carregada

```svelte
<img
	bind:naturalWidth
	bind:naturalHeight
></img>
```

## Vínculos de Elemento de Nível de Bloco

Os elementos de nível de bloco têm quatro vínculos de apenas leitura, medido usando a uma técnica semelhante à [esta](http://www.backalleycoder.com/2013/03/18/cross-browser-event-based-element-resize-detection/):

- `clientWidth`
- `clientHeight`
- `offsetWidth`
- `offsetHeight`

```svelte
<div bind:offsetWidth={width} bind:offsetHeight={height}>
	<Chart {width} {height} />
</div>
```

## bind:group

```svelte
bind:group={variable}
```

As entradas que trabalham juntas podem usar `bind:group`:

```svelte
<!--- file: App.svelte --->
<script>
	let tortilla = 'Plain';

	/** @type {Array<string>} */
	let fillings = [];
</script>

<!-- entradas de rádio agrupadas são mutuamente exclusivas -->
<input type="radio" bind:group={tortilla} value="Plain" />
<input type="radio" bind:group={tortilla} value="Whole wheat" />
<input type="radio" bind:group={tortilla} value="Spinach" />

<!-- entradas de caixa de confirmação agrupadas povoam um vetor -->
<input type="checkbox" bind:group={fillings} value="Rice" />
<input type="checkbox" bind:group={fillings} value="Beans" />
<input type="checkbox" bind:group={fillings} value="Cheese" />
<input type="checkbox" bind:group={fillings} value="Guac (extra)" />
```

> `bind:group` apenas funciona se as entradas estiverem no mesmo componente de Svelte.

## bind:this

```svelte
bind:this={dom_node}
```

Para receber uma referência à um nó do DOM, usamos `bind:this`:

```svelte
<!--- file: App.svelte --->
<script>
	import { onMount } from 'svelte';

	/** @type {HTMLCanvasElement} */
	let canvasElement;

	onMount(() => {
		const ctx = canvasElement.getContext('2d');
		drawStuff(ctx);
	});
</script>

<canvas bind:this={canvasElement} />
```

## class:_name_

```svelte
class:name={value}
```

```svelte
class:name
```

Uma diretiva `class:` fornece uma maneira mais curta de alternar uma classe sobre um elemento:

```svelte
<!-- Estes são equivalentes -->
<div class={isActive ? 'active' : ''}>...</div>
<div class:active={isActive}>...</div>

<!-- Abreviação, para quando o nome e valor corresponderem-se -->
<div class:active>...</div>

<!-- Alternância de várias classes podem ser incluídas -->
<div class:active class:inactive={!active} class:isAdmin>...</div>
```

## style:_property_

```svelte
style:property={value}
```

```svelte
style:property="value"
```

```svelte
style:property
```

A diretiva `style:` fornece uma abreviação para definir vários estilos sobre um elemento:

```svelte
<!-- Estes são equivalentes -->
<div style:color="red">...</div>
<div style="color: red;">...</div>

<!-- Variáveis podem ser usada -->
<div style:color={myColor}>...</div>

<!-- Abreviação, para quando o nome da propriedade e da variável correspondem-se  -->
<div style:color>...</div>

<!-- Vários estilos podem ser incluídos -->
<div style:color style:width="12rem" style:background-color={darkMode ? 'black' : 'white'}>...</div>

<!-- Estilos podem ser marcados como importante -->
<div style:color|important="red">...</div>
```

Quando as diretivas `style:` são combinadas com os atributos `style`, as diretivas terão precedência:

```svelte
<div style="color: blue;" style:color="red">This will be red</div>
```

## use:_action_

```svelte
use:action
```

```svelte
use:action={parameters}
```

```ts
// @noErrors
action = (node: HTMLElement, parameters: any) => {
	update?: (parameters: any) => void,
	destroy?: () => void
}
```

As ações são funções que são chamadas quando um elemento é criado. Elas podem retornar um objeto com um método `destroy` que é chamado depois do elemento ser desmontado:

```svelte
<!--- file: App.svelte --->
<script>
	/** @type {import('svelte/action').Action}  */
	function foo(node) {
		// o nó foi montado no DOM

		return {
			destroy() {
				// o nó foi removido do DOM
			}
		};
	}
</script>

<div use:foo />
```

Uma ação pode ter um parâmetro. Se o valor retornado tiver um método `update`, será chamado sempre que o parâmetro mudar, imediatamente depois da Svelte tiver aplicado as atualizações à marcação.

> Não precisamos de preocupar-nos sobre o fato de que estão a re-declarar a função `foo` para toda instância do componente — a Svelte içará quaisquer funções que não dependem do estado local para fora da definição do componente.

```svelte
<!--- file: App.svelte --->
<script>
	export let bar;

	/** @type {import('svelte/action').Action}  */
	function foo(node, bar) {
		// o nó foi montado no DOM

		return {
			update(bar) {
				// o valor de `bar` mudou
			},

			destroy() {
				// o nó foi removido do DOM
			}
		};
	}
</script>

<div use:foo={bar} />
```

Leia mais na página da [`svelte/action`](/docs/svelte-action).

## transition:_fn_

```svelte
transition:fn
```

```svelte
transition:fn={params}
```

```svelte
transition:fn|global
```

```svelte
transition:fn|global={params}
```

```svelte
transition:fn|local
```

```svelte
transition:fn|local={params}
```

```js
// @noErrors
transition = (node: HTMLElement, params: any, options: { direction: 'in' | 'out' | 'both' }) => {
	delay?: number,
	duration?: number,
	easing?: (t: number) => number,
	css?: (t: number, u: number) => string,
	tick?: (t: number, u: number) => void
}
```

Uma transição é acionada por um elemento entrando ou saindo do DOM como resultado duma mudança de estado.

Quando um bloco estiver transitando para fora, todos os elementos dentro do bloco, incluindo aqueles que não têm suas próprias transições, são mantidos no DOM até toda transição no bloco tiver sido completada.

A diretiva `transition:` indica uma transição _bidirecional_, o que significa que pode ser suavemente invertida enquanto a transição estiver em progresso:

```svelte
{#if visible}
	<div transition:fade>fades in and out</div>
{/if}
```

As transições são locais por padrão (na Svelte 3, eram globais por padrão). As transições locais apenas entram cena quando o bloco a que pertencem for criado ou destruído, _não_ quando os blocos pai forem criados ou destruídos:

```svelte
{#if x}
	{#if y}
		<!-- Svelte 3: <p transition:fade|local> -->
		<p transition:fade>fades in and out only when y changes</p>

		<!-- Svelte 3: <p transition:fade> -->
		<p transition:fade|global>fades in and out when x or y change</p>
	{/if}
{/if}
```

> Por padrão as transições de introdução entrarão em cena na primeira interpretação. Nós podemos modificar este comportamento definindo `intro: true` que [criarmos um componente](/docs#run-time-client-side-component-api) e marcando a transição como `global`.

## Parâmetros de Transição

Tal como as ações, as transições podem ter parâmetros.

(As `{{chavetas}}` duplas não são uma sintaxe especial; isto é um literal de objeto dentro dum marcador de expressão.)

```svelte
{#if visible}
	<div transition:fade={{ duration: 2000 }}>fades in and out over two seconds</div>
{/if}
```

## Funções de Transição Personalizadas

As transições podem usar funções personalizadas. Se o objeto retornado tiver uma função `css`. a Svelte criará uma animação de CSS que explora o elemento.

O argumento `t` passado à `css` é um valor entre `0` e `1` depois da função `easing` ter sido aplicada. As transições de _entrada_ executam de `0` à `1`, as funções de _saída_ executam de `1` à `0` — em outras palavras, `1` é o estado natural do elemento, como se nenhuma transição tivesse sido aplicada. O argumento `u` é igual à `1 - t`.

A função é chamada repetidamente _antes_ da transição começar, com diferentes argumentos `t` e `u`:

```svelte
<!--- file: App.svelte --->
<script>
	import { elasticOut } from 'svelte/easing';

	/** @type {boolean} */
	export let visible;

	/**
	 * @param {HTMLElement} node
	 * @param {{ delay?: number, duration?: number, easing?: (t: number) => number }} params
	 */
	function whoosh(node, params) {
		const existingTransform = getComputedStyle(node).transform.replace('none', '');

		return {
			delay: params.delay || 0,
			duration: params.duration || 400,
			easing: params.easing || elasticOut,
			css: (t, u) => `transform: ${existingTransform} scale(${t})`
		};
	}
</script>

{#if visible}
	<div in:whoosh>whooshes in</div>
{/if}
```

Uma função de transição personalizada também pode retornar uma função `tick`, que é chamada _durante_ a transição com os mesmos argumentos `t` e `u`.

> Se for possível usar `css` ao invés de `tick`, faça-o — as animações de CSS podem executar para fora da linha principal, evitando brincadeiras nos dispositivos mais lentos.

```svelte
<!--- file: App.svelte --->
<script>
	export let visible = false;

	/**
	 * @param {HTMLElement} node
	 * @param {{ speed?: number }} params
	 */
	function typewriter(node, { speed = 1 }) {
		const valid = node.childNodes.length === 1 && node.childNodes[0].nodeType === Node.TEXT_NODE;

		if (!valid) {
			throw new Error(`This transition only works on elements with a single text node child`);
		}

		const text = node.textContent;
		const duration = text.length / (speed * 0.01);

		return {
			duration,
			tick: (t) => {
				const i = ~~(text.length * t);
				node.textContent = text.slice(0, i);
			}
		};
	}
</script>

{#if visible}
	<p in:typewriter={{ speed: 1 }}>The quick brown fox jumps over the lazy dog</p>
{/if}
```

Se uma transição retornar uma função ao invés dum objeto de transição, a função será chamada na próxima micro-tarefa. Isto permite várias transições coordenarem-se, tornado os [efeitos de desvanecimento cruzado](https://learn.svelte.dev/tutorial/deferred-transitions) possível.

As funções de transição também recebem um terceiro argumento, `options`, que contém informação sobre a transição.

Os valores disponíveis no objeto `options` são:

- `direction` - um de `in`, `out`, ou `both` dependendo do tipo de transição.

## Eventos de Transição

Um elemento com transições despacharão os seguintes eventos além de quaisquer eventos do DOM padrão:

- `introstart`
- `introend`
- `outrostart`
- `outroend`

```svelte
{#if visible}
	<p
		transition:fly={{ y: 200, duration: 2000 }}
		on:introstart={() => (status = 'intro started')}
		on:outrostart={() => (status = 'outro started')}
		on:introend={() => (status = 'intro ended')}
		on:outroend={() => (status = 'outro ended')}
	>
		Flies in and out
	</p>
{/if}
```

## in:_fn_/out:_fn_

```svelte
in:fn
```

```svelte
in:fn={params}
```

```svelte
in:fn|global
```

```svelte
in:fn|global={params}
```

```svelte
in:fn|local
```

```svelte
in:fn|local={params}
```

```svelte
out:fn
```

```svelte
out:fn={params}
```

```svelte
out:fn|global
```

```svelte
out:fn|global={params}
```

```svelte
out:fn|local
```

```svelte
out:fn|local={params}
```

Semelhante ao `transition:`, mas apenas aplica-se aos elementos entrando (`in:`) ou saído (`out:`) do DOM.

Ao contrário da `transition:`, as transições aplicadas com `in:` e `out:` não são bidirecionais — uma transição de entrada continuará à 'reproduzir' ao lado da transição de saída, ao invés de inverter, se o bloco for finalizado enquanto a transição estiver em progresso. Se uma transição de saída for abortada, as transições reinicializarão a partir do zero:

```svelte
{#if visible}
	<div in:fly out:fade>flies in, fades out</div>
{/if}
```

## animate:_fn_

```svelte
animate:name
```

```svelte
animate:name={params}
```

```js
// @noErrors
animation = (node: HTMLElement, { from: DOMRect, to: DOMRect } , params: any) => {
	delay?: number,
	duration?: number,
	easing?: (t: number) => number,
	css?: (t: number, u: number) => string,
	tick?: (t: number, u: number) => void
}
```

```ts
// @noErrors
DOMRect {
	bottom: number,
	height: number,
	​​left: number,
	right: number,
	​top: number,
	width: number,
	x: number,
	y: number
}
```

Uma animação é acionada quando os conteúdos dum [bloco `each` com chave](/docs/logic-blocks#each) são re-organizados. As animações não executam quando um elemento for adicionado ou removido, apenas quando o índice dum item de dado existente dento do bloco `each` mudar. As diretivas de `animate` devem estar sobre um elemento que é um filho _imediato_ dum bloco `each` com chave.

As animações podem ser usados com as [funções de animação embutida](/docs/svelte-animate) da Svelte ou [funções de animação personalizadas](/docs/element-directives#custom-transition-functions).

```svelte
<!-- Quando `list` for reorganizada, a animação executará -->
{#each list as item, index (item)}
	<li animate:flip>{item}</li>
{/each}
```

## Parâmetros de Animação

Tal como acontece com as ações e transições, as animações podem ter parâmetros.

(As `{{chavetas}}` duplas não são uma sintaxe especial; isto é um literal de objeto dentro dum marcador de expressão.)

```svelte
{#each list as item, index (item)}
	<li animate:flip={{ delay: 500 }}>{item}</li>
{/each}
```

## Funções de Animação Personalizadas

As animações podem usar funções personalizadas que fornecem o `node`, um objeto de `animation` e quaisquer `parameters` como argumentos. O parâmetro de `animation` é um objeto contendo propriedades `from` e `to`, cada contendo um [`DOMRect`](https://developer.mozilla.org/en-US/docs/Web/API/DOMRect#Properties) descrevendo a geometria do elemento nas suas posições `start` e `end`. A propriedade `from` é o `DOMRect` do elemento na sua posição inicial, e a propriedade `to` é o `DOMRect` do elemento na sua posição final depois da lista tiver sido reorganizada e o DOM atualizado.

Se objeto retornado tiver um método `css`, a Svelte criará uma animação de CSS que atua sobre o elemento.

O argumento `t` passado à `css` é um valor que vai de `0` e `1` depois da função `easing` tiver sido aplicado. O argumento `u` é igual à `1 - t`.

A função é chamada repetidamente _depois_ da animação começar, com diferentes argumentos `t` e `u`:

<!-- TODO: Types -->

```svelte
<!--- file: App.svelte --->
<script>
	import { cubicOut } from 'svelte/easing';

	/**
	 * @param {HTMLElement} node
	 * @param {{ from: DOMRect; to: DOMRect }} states
	 * @param {any} params
	 */
	function whizz(node, { from, to }, params) {
		const dx = from.left - to.left;
		const dy = from.top - to.top;

		const d = Math.sqrt(dx * dx + dy * dy);

		return {
			delay: 0,
			duration: Math.sqrt(d) * 120,
			easing: cubicOut,
			css: (t, u) => `transform: translate(${u * dx}px, ${u * dy}px) rotate(${t * 360}deg);`
		};
	}
</script>

{#each list as item, index (item)}
	<div animate:whizz>{item}</div>
{/each}
```

Uma função de animação personalizada também pode retornar uma função `tick`, que é chamada _durante_ a animação com os mesmos argumentos `t` e `u`.

> Se for possível usar `css` ao invés de `tick`, faça-o — as animações de CSS podem executar para fora da linha principal, evitando brincadeiras nos dispositivos mais lentos.

```svelte
<!--- file: App.svelte --->
<script>
	import { cubicOut } from 'svelte/easing';

	/**
	 * @param {HTMLElement} node
	 * @param {{ from: DOMRect; to: DOMRect }} states
	 * @param {any} params
	 */
	function whizz(node, { from, to }, params) {
		const dx = from.left - to.left;
		const dy = from.top - to.top;

		const d = Math.sqrt(dx * dx + dy * dy);

		return {
			delay: 0,
			duration: Math.sqrt(d) * 120,
			easing: cubicOut,
			tick: (t, u) => Object.assign(node.style, { color: t > 0.5 ? 'Pink' : 'Blue' })
		};
	}
</script>

{#each list as item, index (item)}
	<div animate:whizz>{item}</div>
{/each}
```
