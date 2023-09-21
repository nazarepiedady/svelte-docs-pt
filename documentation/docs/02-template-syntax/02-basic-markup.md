---
title: Marcação Básica
---

## Marcadores

Um marcador escrito com letras minúsculos, como `<div>`, denota um elemento de HTML normal. Um marcador escrito com a primeira letra em maiúscula, tal como `<Widget>` ou `<Namespace.Widget>`, indica um _componente_:

```svelte
<script>
	import Widget from './Widget.svelte';
</script>

<div>
	<Widget />
</div>
```

## Atributos e Propriedades

Por padrão, os atributos funcionam exatamente como os seus equivalentes de HTML:

```svelte
<div class="foo">
	<button disabled>can't touch this</button>
</div>
```

Tal como no HTML, os valores não precisam estar entre aspas:

```svelte
<input type="checkbox" />
```

Os valores de atributo podem conter expressões de JavaScript:

```svelte
<a href="page/{p}">page {p}</a>
```

Ou podem _ser_ expressões de JavaScript:

```svelte
<button disabled={!clickable}>...</button>
```

Os atributos booleanos são incluídos sobre o elemento se o seu valor for [verdadeiro](https://developer.mozilla.org/en-US/docs/Glossary/Truthy) e excluídos se for [falso](https://developer.mozilla.org/en-US/docs/Glossary/Falsy).

Todos os outros atributos são incluídos a menos que seu valor seja [nulo](https://developer.mozilla.org/en-US/docs/Glossary/Nullish) (`null` ou `undefined`):

```svelte
<input required={false} placeholder="This input field is not required" />
<div title={null}>This div has no title attribute</div>
```

Uma expressão pode incluir caracteres que fariam com que o destacamento de sintaxe falhasse no HTML normal, então é permitido colocar aspas no valor. As aspas não afetam em como o valor é analisado:

```svelte
<button disabled={number !== 42}>...</button>
```

Quando o nome do atributo e valor corresponderem-se (`name={name}`), podem ser substituídos por `{name}`:

```svelte
<button {disabled}>...</button>
<!-- equivalente ao
<button disabled={disabled}>...</button>
-->
```

Por convenção, os valores passados aos componentes são referidos como _propriedades_ ao invés de _atributos_, que são uma funcionalidade do DOM.

Tal como acontece com os elementos, `name={name}` podem ser substituídos pela abreviação `{name}`:

```svelte
<Widget foo={bar} answer={42} text="hello" />
```

Os _atributos de propagação_ permitem que muitos atributos ou propriedades sejam passados à um elemento ou componente de uma só vez.

Um elemento ou componente pode ter vários atributos de propagação, intercalados com atributos normais:

```svelte
<Widget {...things} />
```

`$$props` refere-se a todas as propriedades que são passadas ao componente, incluindo aquelas que não são declaradas com `export`. Geralmente não é recomendado, uma vez que é difícil para a Svelte otimizar. Mas pode ser útil em casos raros – por exemplo, quando não sabemos no momento da compilação quais propriedades podem ser passadas à um componente:

```svelte
<Widget {...$$props} />
```

`$$restProps` contém apenas as propriedades que _não_ são declaradas com `export`. Pode ser usada para passar outros atributos desconhecidos à um elemento num componente. Partilha os mesmos problemas de otimização que a `$$props`, e igualmente não é recomendado:

```svelte
<input {...$$restProps} />
```

> O atributo `value` dum elemento `input` ou seus elementos `option` filhos não devem ser definidos com atributos de propagação quando usamos `bind:group` ou `bind:checked`. A Svelte precisa ser capaz de ver o `value` do elemento diretamente na marcação nestes casos para que possa ligá-lo à variável vinculada.

> Algumas vezes, a ordem do atributo importa, uma vez que a Svelte define os atributos sequencialmente na JavaScript. Por exemplo, `<input type="range" min="0" max="1" value={0.5} step="0.1"/>`, a Svelte tentará definir o valor para `1` (arredondando-o a partir de 0.5 uma vez que o passo por padrão é 1), e então definir o passo para `0.1`. Para corrigir isto, o mudamos para `<input type="range" min="0" max="1" step="0.1" value={0.5}/>`.

> Um outro exemplo é `<img src="..." loading="lazy" />`. A Svelte definirá o `src` da imagem antes de tornar o elemento de imagem `loading="lazy"`, o que é provavelmente muito tarde. Mudamos isto para `<img loading="lazy" src="...">`para fazer a imagem ser carregada preguiçosamente.

## Expressões de Texto

```svelte
{expression}
```

O texto também pode conter expressões de JavaScript:

> Se estivermos a usar uma [notação literal](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/RegExp#literal_notation_and_constructor) de expressão regular (`RegExp`), precisaremos envolvê-lo em parênteses.

```svelte
<h1>Hello {name}!</h1>
<p>{a} + {b} = {a + b}.</p>

<div>{/^[A-Za-z ]+$/.test(value) ? x : y}</div>
```

## Comentários

Nós podemos usar os comentários de HTML dentro dos componentes:

```svelte
<!-- isto é um comentário! --><h1>Hello world</h1>
```

Os comentários começam com os avisos de desativação da `svelte-ignore` para o próximo bloco de marcação. Normalmente, estes são avisos de acessibilidade; devemos certificar-nos de que estamos a desativá-los por uma boa razão:

```svelte
<!-- svelte-ignore a11y-autofocus -->
<input bind:value={name} autofocus />
```
