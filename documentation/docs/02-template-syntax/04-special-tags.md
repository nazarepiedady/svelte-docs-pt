---
title: Marcadores Especiais
---

## {@html ...}

```svelte
{@html expression}
```

Numa expressão de texto, os caracteres como `<` e `>` são escapados; no entanto, com as expressões de HTML, não são:

A expressão deve ser HTML autónomo válido — `{@html "<div>"}content{@html "</div>"}` _não_ funcionará, porque `</div>` não é HTML válido. Ele também _não_ compilará o código da Svelte.

> A Svelte não desinfeta expressões antes de injetar a HTML. Se os dados provêm duma fonte duvidosa, nós devemos desinfetá-lo, ou estamos expostos aos nossos utilizadores à uma vulnerabilidade XSS.

```svelte
<div class="blog-post">
	<h1>{post.title}</h1>
	{@html post.content}
</div>
```

## {@debug ...}

```svelte
{@debug}
```

```svelte
{@debug var1, var2, ..., varN}
```

O marcador `{@debug ...}` oferece uma alternativa à `console.log(...)`. Ele regista os valores de variáveis específicos sempre que mudarem, e para a execução do código se tivermos as ferramentas de programação aberta:

```svelte
<script>
	let user = {
		firstname: 'Ada',
		lastname: 'Lovelace'
	};
</script>

{@debug user}

<h1>Hello {user.firstname}!</h1>
```

`{@debug ...}` aceita uma lista de nomes de variável separada por vírgula (expressões não arbitrária):

```svelte
<!-- Compila -->
{@debug user}
{@debug user1, user2, user3}

<!-- NÃO compila -->
{@debug user.firstname}
{@debug myArray[0]}
{@debug !isReady}
{@debug typeof user === 'object'}
```

O marcador `{@debug}` sem quaisquer arguments inserirão uma declaração `debugger` que é acionada quando _qualquer_ estado mudar, como oposto às variáveis especificadas.

## {@const ...}

```svelte
{@const assignment}
```

O marcador `{@const ...}` define uma constate local:

```svelte
<script>
	export let boxes;
</script>

{#each boxes as box}
	{@const area = box.width * box.height}
	{box.width} * {box.height} = {area}
{/each}
```

`{@const}` apenas é permitido como filho direto de `{#if}`, `{:else if}`, `{:else}`, `{#each}`, `{:then}`, `{:catch}`, `<Component />` ou `<svelte:fragment />`.
