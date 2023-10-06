---
title: Blocos Lógicos
---

## `{#if ...}`

```svelte
{#if expression}...{/if}
```

```svelte
{#if expression}...{:else if expression}...{/if}
```

```svelte
{#if expression}...{:else}...{/if}
```

O conteúdo que é condicionalmente interpretado pode ser envolto num bloco `if`:

```svelte
{#if answer === 42}
	<p>what was the question?</p>
{/if}
```

As condições adicionais podem ser adicionadas com `{:else if expression}`, opcionalmente terminado numa cláusula `{:else}`:

```svelte
{#if porridge.temperature > 100}
	<p>too hot!</p>
{:else if 80 > porridge.temperature}
	<p>too cold!</p>
{:else}
	<p>just right!</p>
{/if}
```

(Os blocos não precisam envolver os elementos, também podem envolver texto dentro dos elementos!)

## `{#each ...}`

```svelte
{#each expression as name}...{/each}
```

```svelte
{#each expression as name, index}...{/each}
```

```svelte
{#each expression as name (key)}...{/each}
```

```svelte
{#each expression as name, index (key)}...{/each}
```

```svelte
{#each expression as name}...{:else}...{/each}
```

A iteração sobre as listas de valores podem ser feita com um bloco `each`:

```svelte
<h1>Shopping list</h1>
<ul>
	{#each items as item}
		<li>{item.name} x {item.qty}</li>
	{/each}
</ul>
```

Nós podemos usar os blocos `each` para iterar sobre qualquer vetor ou valor parecido com um vetor — isto é, qualquer objeto com uma propriedade `length`.

Um bloco `each` também pode especificar um _índice_, equivalente ao segundo argumento numa função de resposta de `array.map(...)`:

```svelte
{#each items as item, i}
	<li>{i + 1}: {item.name} x {item.qty}</li>
{/each}
```

Se uma expressão _chave_ for fornecida — a qual deve identificar unicamente cada item da lista — a Svelte a usará para diferenciar a lista quando os dados mudarem, ao invés de adicionar ou remover itens no final. A chave pode ser qualquer objeto, mas sequências de caracteres e números são recomendados visto que permitem a identidade persistir quando os próprios objetos mudarem:

```svelte
{#each items as item (item.id)}
	<li>{item.name} x {item.qty}</li>
{/each}

<!-- ou com o valor do índice adicional -->
{#each items as item, i (item.id)}
	<li>{i + 1}: {item.name} x {item.qty}</li>
{/each}
```

Nós podemos usar livremente os padrões de desestruturação ou propagação nos blocos `each`:

```svelte
{#each items as { id, name, qty }, i (id)}
	<li>{i + 1}: {name} x {qty}</li>
{/each}

{#each objects as { id, ...rest }}
	<li><span>{id}</span><MyComponent {...rest} /></li>
{/each}

{#each items as [id, ...rest]}
	<li><span>{id}</span><MyComponent values={rest} /></li>
{/each}
```

Um bloco `each` também podem ter uma cláusula `{:else}`, a qual é interpretada se a lista estiver vazia:

```svelte
{#each todos as todo}
	<p>{todo.text}</p>
{:else}
	<p>No tasks today!</p>
{/each}
```

Desde a Svelte 4, é possível iterar sobre os iteráveis como `Map` ou `Set`. Os iteráveis precisam ser finitos e estáticos (não devem mudar enquanto são iterados). Nos bastidores, são transformados num vetor usando `Array.from` antes de ser passados à interpretação. Se estivermos a escrever um código sensível ao desempenho, devemos tentar evitar os iteráveis e usar vetores normais visto que são mais otimizados:

## `{#await ...}`

```svelte
{#await expression}...{:then name}...{:catch name}...{/await}
```

```svelte
{#await expression}...{:then name}...{/await}
```

```svelte
{#await expression then name}...{/await}
```

```svelte
{#await expression catch name}...{/await}
```

Os blocos `await` permitem-nos ramificar sobre os três estados possíveis duma promessa — pendente, concretizada ou rejeitada. No mode de interpretação no lado do servidor, apenas o estado pendente será interpretado no servidor:

```svelte
{#await promise}
	<!-- a promessa está pendente -->
	<p>waiting for the promise to resolve...</p>
{:then value}
	<!-- a promessa foi concretizada -->
	<p>The value is {value}</p>
{:catch error}
	<!-- a promessa foi rejeitada -->
	<p>Something went wrong: {error.message}</p>
{/await}
```

O bloco `catch` pode ser omitida se não precisarmos de interpretar qualquer coisa quando a promessa rejeitar (ou nenhum erro é possível):

```svelte
{#await promise}
	<!-- a promessa está pendente -->
	<p>waiting for the promise to resolve...</p>
{:then value}
	<!-- a promessa foi concretizada -->
	<p>The value is {value}</p>
{/await}
```

Se não nos importamos com o estado pendente, também podemos omitir o bloco inicial:

```svelte
{#await promise then value}
	<p>The value is {value}</p>
{/await}
```

De maneira semelhante, se apenas quisermos mostrar o estado de erro, podemos omitir o bloco `then`:

```svelte
{#await promise catch error}
	<p>The error is {error}</p>
{/await}
```

## `{#key ...}`

```svelte
{#key expression}...{/key}
```

Os blocos `key` destroem e recriam os seus conteúdos quando o valor duma expressão mudar.

Isto é útil se quisermos que um elemento execute a sua transição sempre que um valor mudar:

```svelte
{#key value}
	<div transition:fade>{value}</div>
{/key}
```

Quando usada em torno dos componentes, isto os fará serem reinstanciados e reinicializados:

```svelte
{#key value}
	<Component />
{/key}
```
