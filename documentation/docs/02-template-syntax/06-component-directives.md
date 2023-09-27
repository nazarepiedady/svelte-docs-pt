---
title: Diretivas de Componente
---

## on:_eventname_

```svelte
on:eventname={handler}
```

Os componentes podem emitir eventos usando [`createEventDispatcher`](/docs/svelte#createeventdispatcher), ou expedindo os eventos do DOM. Ouvir os eventos do componente é parecido com o ouvir os eventos do DOM:

```svelte
<SomeComponent on:whatever={handler} />
```

Tal como acontece com os eventos do DOM, se a diretiva `on:` for usada sem um valor, o componente _expedirá_ o evento, o que significa que um consumidor do componente pode ouvi-lo:

```svelte
<SomeComponent on:whatever />
```

## --style-props

```svelte
--style-props="anycssvalue"
```

Nós também podemos passar estilos como propriedades aos componentes para propósitos de criação de temas, usando propriedades personalizadas de CSS.

A implementação da Svelte é essencialmente um açúcar sintático para adicionar um elemento envolvedor. Este exemplo:

```svelte
<Slider bind:value min={0} --rail-color="black" --track-color="rgb(0, 0, 255)" />
```

Compila-se para isto:

```svelte
<div style="display: contents; --rail-color: black; --track-color: rgb(0, 0, 255)">
	<Slider bind:value min={0} max={100} />
</div>
```

**Nota**: Uma vez que isto é um `<div>` adicional, devemos estar ciente de que a estrutura do nosso CSS pode acidentalmente atingir isto. Devemos estar atentos a este elemento envolvedor adicionado quando usamos esta funcionalidade.

Para o espaço de nome da SVG, o exemplo acima compila-se usando `<g>`:

```svelte
<g style="--rail-color: black; --track-color: rgb(0, 0, 255)">
	<Slider bind:value min={0} max={100} />
</g>
```

**Nota**: Uma vez que isto é um `<g>` adicional, devemos estar ciente de que a estrutura do nosso CSS pode acidentalmente atingir isto. Devemos estar atentos a este elemento envolvedor adicionado quando usamos esta funcionalidade.

O suporte de Variáveis de CSS da Svelte permite facilmente a criação de componentes de temas:

```svelte
<!-- Slider.svelte -->
<style>
	.potato-slider-rail {
		background-color: var(--rail-color, var(--theme-color, 'purple'));
	}
</style>
```

Então podemos definir uma cor de tema de alto nível:

```css
/* global.css */
html {
	--theme-color: black;
}
```

Ou a sobrepor no nível do consumidor:

```svelte
<Slider --rail-color="goldenrod" />
```

## bind:_property_

```svelte
bind:property={variable}
```

Nós podemos vincular às propriedades do componente usando a mesma sintaxe para os elementos:

```svelte
<Keypad bind:value={pin} />
```

## bind:this

```svelte
bind:this={component_instance}
```

Os componentes também suportam `bind:this`, permitindo-nos interagir com as instâncias do componente programaticamente.

> Nota que não podemos fazer `{cart.empty}` uma vez que `cart` é `undefined` quando o botão for interpretado pela primeira vez e lança um erro.

```svelte
<ShoppingCart bind:this={cart} />

<button on:click={() => cart.empty()}> Empty shopping cart </button>
```
