---
title: Elementos Especiais
---

## `<slot>`

```svelte
<slot><!-- retrocesso opcional --></slot>
```

```svelte
<slot name="x"><!-- retrocesso opcional --></slot>
```

```svelte
<slot prop={value} />
```

Os componentes podem ter conteúdo filho, da mesma maneira que os elementos podem.

O conteúdo é exposto no componente filho usando o elemento `<slot>`, que pode conter conteúdo de retrocesso que é interpretado se nenhum filho for fornecido:

```svelte
<!-- Widget.svelte -->
<div>
	<slot>
		this fallback content will be rendered when no content is provided, like in the first example
	</slot>
</div>

<!-- App.svelte -->
<Widget />
<!-- este componente interpretará o conteúdo padrão -->

<Widget>
	<p>this is some child content that will overwrite the default slot content</p>
</Widget>
```

Nota: Se quisermos interpretar o elemento `<slot>`, podemos usar `<svelte:element this="slot" />`.

### `<slot name="`_name_`">`

As ranhuras nomeadas permite os consumidores migrar áreas específicas. Eles também pode ter conteúdo de retrocesso:

```svelte
<!-- Widget.svelte -->
<div>
	<slot name="header">No header was provided</slot>
	<p>Some content between header and footer</p>
	<slot name="footer" />
</div>

<!-- App.svelte -->
<Widget>
	<h1 slot="header">Hello</h1>
	<p slot="footer">Copyright (c) 2019 Svelte Industries</p>
</Widget>
```

Os componentes podem ser colocados numa ranhura nomeada usando a sintaxe `<Component slot="name" />`. No sentido de colocar o conteúdo numa ranhura sem usar um elemento envolvente, podemos usar o elemento especial `<svelte:fragment>`:

```svelte
<!-- Widget.svelte -->
<div>
	<slot name="header">No header was provided</slot>
	<p>Some content between header and footer</p>
	<slot name="footer" />
</div>

<!-- App.svelte -->
<Widget>
	<HeaderComponent slot="header" />
	<svelte:fragment slot="footer">
		<p>All rights reserved.</p>
		<p>Copyright (c) 2019 Svelte Industries</p>
	</svelte:fragment>
</Widget>
```

### $$slots

`$$slots` é um objeto cujas chaves são os nomes das ranhuras passados ao componente pelo pai. Se o pai não passar uma ranhura com um nome particular, que o nome estará presente no `$$slots`. Isto permite os componentes interpretar uma ranhura (e outros elementos, como envolvedores para estilização) apenas se o pai o fornecer.

Nota que passar explicitamente um ranhura nomeada vazia adicionará o nome desta ranhura ao `$$slots`. Por exemplo, se um pai passar `<div slot="title" />` à um componente filho, `$$slots.title` será verdadeiro dentro do filho:

```svelte
<!-- Card.svelte -->
<div>
	<slot name="title" />
	{#if $$slots.description}
		<!-- Este <hr> e a ranhura interpretará apenas
				se uma ranhura nomeada "description" for fornecida. -->
		<hr />
		<slot name="description" />
	{/if}
</div>

<!-- App.svelte -->
<Card>
	<h1 slot="title">Blog Post Title</h1>
	<!-- Nenhuma ranhura nomeada "description" foi fornecida
			assim a ranhura opcional não será interpretada. -->
</Card>
```

### `<slot key={`_value_`}>`

As ranhuras podem ser interpretadas zero ou mais vezes e podem passar valores de _volta_ para o pai usando propriedades. O pai expõe os valores ao modelo de marcação da ranhura usando a diretiva `let:`.

As regras de abreviação habituais aplicam-se — `let:item` é equivalente ao `let:item={item}`, e `<slot {item}>` é equivalente ao `<slot item={item}>`:

```svelte
<!-- FancyList.svelte -->
<ul>
	{#each items as item}
		<li class="fancy">
			<slot prop={item} />
		</li>
	{/each}
</ul>

<!-- App.svelte -->
<FancyList {items} let:prop={thing}>
	<div>{thing.text}</div>
</FancyList>
```

As ranhuras nomeadas também podem expor valores. A diretiva `let:` liga-se ao elemento com o atributo `slot`:

```svelte
<!-- FancyList.svelte -->
<ul>
	{#each items as item}
		<li class="fancy">
			<slot name="item" {item} />
		</li>
	{/each}
</ul>

<slot name="footer" />

<!-- App.svelte -->
<FancyList {items}>
	<div slot="item" let:item>{item.text}</div>
	<p slot="footer">Copyright (c) 2019 Svelte Industries</p>
</FancyList>
```

## `<svelte:self>`

O elemento `<svelte:self>` permite um componente incluir-se a si mesmo, recursivamente.

Ele não pode aparecer no alto nível da nossa marcação; deve estar dentro dum bloco `if` ou `each` ou passado à uma ranhura do componente para evitar um laço de repetição infinito:

```svelte
<script>
	/** @type {number} */
	export let count;
</script>

{#if count > 0}
	<p>counting down... {count}</p>
	<svelte:self count={count - 1} />
{:else}
	<p>lift-off!</p>
{/if}
```

## `<svelte:component>`

```svelte
<svelte:component this={expression} />
```

O elemento `<svelte:component>` interpreta um componente dinamicamente, usando o construtor do componente especificado como a propriedade `this`. Quando a propriedade muda, o componente é destruído e recriado:

Se `this` for falso, nenhum componente é interpretado:

```svelte
<svelte:component this={currentSelection.component} foo={bar} />
```

## `<svelte:element>`

```svelte
<svelte:element this={expression} />
```

O elemento `<svelte:element>` permite-nos interpretar um elemento dum tipo especificado dinamicamente. Isto é útil por exemplo quando exibimos conteúdo de texto rico a partir dum sistema de gestão de conteúdo. Quaisquer propriedades e ouvintes de evento presentes serão aplicados ao elemento.

O único vínculo suportado é o `bind:this`, uma vez que os vínculos específicos do tipo de elemento que a Svelte faz em tempo de construção (por exemplo, `bind:value` para os elementos de entrada) não funcionam com um tipo de marcador dinâmico.

Se `this` tiver um valor nulo, o elemento e seus filhos não serão interpretados.

Se `this` for o nome dum [elemento nulo](https://developer.mozilla.org/en-US/docs/Glossary/Void_element) (por exemplo, `br`) e `<svelte:element>` tiver elementos filho, um erro de tempo de execução será lançado no modo de desenvolvimento:

```svelte
<script>
	let tag = 'div';

	/** @type {(e: MouseEvent) => void} */
	export let handler;
</script>

<svelte:element this={tag} on:click={handler}>Foo</svelte:element>
```

## `<svelte:window>`

```svelte
<svelte:window on:event={handler} />
```

```svelte
<svelte:window bind:prop={value} />
```

O elemento `<svelte:window>` permite-nos adicionar ouvintes de evento ao objeto `window` sem preocupar-se com a remoção dos mesmos quando o componente for destruído, ou verificar pela existência do `window` quando interpretar a partir do servidor.

Ao contrário de `<svelte:self>`, este elemento apenas pode aparecer no alto nível do nosso componente e nunca deve estar dentro dum bloco ou elemento:

```svelte
<script>
	/** @param {KeyboardEvent} event */
	function handleKeydown(event) {
		alert(`pressed the ${event.key} key`);
	}
</script>

<svelte:window on:keydown={handleKeydown} />
```

Noś também podemos vincular às seguintes propriedades:

- `innerWidth`
- `innerHeight`
- `outerWidth`
- `outerHeight`
- `scrollX`
- `scrollY`
- `online` — um pseudónimo para `window.navigator.onLine`
- `devicePixelRatio`

Todos exceto `scrollX` e `scrollY` são de apenas leitura:

```svelte
<svelte:window bind:scrollY={y} />
```

> Nota que a página não será deslocada para o valor inicial para evitar problemas de acessibilidade. Apenas mudanças subsequentes à variável vinculada de `scrollX` e `scrollY` causarão deslocamento. No entanto, se o comportamento de deslocamento for desejado, podemos chamar `scrollTo()` na `onMount()`.

## `<svelte:document>`

```svelte
<svelte:document on:event={handler} />
```

```svelte
<svelte:document bind:prop={value} />
```

De maneira semelhante ao `<svelte:window>`, este elemento permite-nos adicionar ouvintes aos eventos sobre o `document`, tais como `visibilitychange`, os quais não disparam sobre o `window`. Ele também permite-nos usar [ações](/docs/element-directives#use-action) sobre o `document`.

Tal como acontece com `<svelte:window>`, este elemento apenas pode aparecer no alto nível do nosso componente e nunca deve estar dentro dum bloco ou elemento:

```svelte
<svelte:document on:visibilitychange={handleVisibilityChange} use:someAction />
```

Nós também podemos vincular às seguintes propriedades:

- `fullscreenElement`
- `visibilityState`

All are readonly.
Todas são de apenas leitura.

## `<svelte:body>`

```svelte
<svelte:body on:event={handler} />
```

De maneira semelhante ao `<svelte:window>`, este elemento permite-nos adicionar ouvintes aos eventos sobre o `document.body`, tais como `mouseenter` e `mouseleave`, os quais não disparam-se sobre o `window`. Ele também permite-nos usar [ações](/docs/element-directives#use-action) sobre o elemento `<body>`.

Tal como acontece com `<svelte:window>` e `<svelte:document>`, este elemento apenas pode aparecer no alto nível do nosso componente e não deve estar dentro dum bloco ou elemento:

```svelte
<svelte:body on:mouseenter={handleMouseenter} on:mouseleave={handleMouseleave} use:someAction />
```

## `<svelte:head>`

```svelte
<svelte:head>...</svelte:head>
```

Este elemento torna possível inserir elementos no `document.head`. Durante a interpretação no lado do servidor, o conteúdo do `head` é exposto separadamente ao conteúdo de `html` principal.

Tal como acontece com `<svelte:window>`, `<svelte:document>` e `<svelte:body>`, este elemento apenas pode aparecer no alto nível do nosso componente e nunca deve estar dentro dum bloco ou elemento:

```svelte
<svelte:head>
	<title>Hello world!</title>
	<meta name="description" content="This is where the description goes for SEO" />
</svelte:head>
```

## `<svelte:options>`

```svelte
<svelte:options option={value} />
```

O elemento `<svelte:options>` fornece um lugar para especificar opções do compilador por componente, as quais são detalhadas na [seção do compilador](/docs/svelte-compiler#compile). As possíveis opções são:

- `immutable={true}` — nunca usamos dados mutáveis, então o compilador pode fazer verificações de igualdade referencial simples para determinar se os valores mudaram.
- `immutable={false}` — o padrão. A Svelte será mais conservadora sobre se ou não os objetos mutáveis mudaram.
- `accessors={true}` — adiciona recuperadores e definidores para as propriedades do componente.
- `accessors={false}` — o padrão.
- `namespace="..."` — o espaço nominal onde este componente será usado, mais comummente "svg"; usamos o espaço nominal "foreign" para abandonar os nomes de atributo insensíveis a caixa e os avisos específicos de HTML.
- `customElement="..."` — o nome à usar quando compilamos este componente como um elemento personalizado.

```svelte
<svelte:options customElement="my-custom-element" />
```

## `<svelte:fragment>`

O elemento `<svelte:fragment>` permite-nos colocar conteúdo numa [ranhura nomeada](/docs/special-elements#slot-slot-name-name) sem envolvê-la num elemento de DOM contentor. Isto preserva a disposição do fluxo do nosso componente intacto:

```svelte
<!-- Widget.svelte -->
<div>
	<slot name="header">No header was provided</slot>
	<p>Some content between header and footer</p>
	<slot name="footer" />
</div>

<!-- App.svelte -->
<Widget>
	<h1 slot="header">Hello</h1>
	<svelte:fragment slot="footer">
		<p>All rights reserved.</p>
		<p>Copyright (c) 2019 Svelte Industries</p>
	</svelte:fragment>
</Widget>
```
