---
title: svelte/action
---

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

Uma ação pode ter um parâmetro. Se o valor retornado tiver um método `update`, será chamado imediatamente depois da Svelter ter aplicado atualizações à marcação sempre que este parâmetro mudar.

> Não temos que preocupar-nos com o fato de estarmos a redeclarar a função `foo` para toda instância do componente — a Svelte içará quaisquer funções que não dependem do estado local para fora da definição do componente.

```svelte
<!--- file: App.svelte --->
<script>
	/** @type {string} */
	export let bar;

	/** @type {import('svelte/action').Action<HTMLElement, string>}  */
	function foo(node, bar) {
		// o nó foi montado no DOM

		return {
			update(bar) {
				// o valor de `bar` foi mudado
			},

			destroy() {
				// o nó foi removido do DOM
			}
		};
	}
</script>

<div use:foo={bar} />
```

## Atributos

Algumas vezes as ações emitem eventos e aplicam atributos personalizados aos elementos nos quais são aplicadas. Para suportar isto, as ações tipadas com o tipo `Action` ou `ActionReturn` podem ter um último parâmetro, `Attributes`:

```svelte
<!--- file: App.svelte --->
<script>
	/**
	 * @type {import('svelte/action').Action<HTMLDivElement, { prop: any }, { 'on:emit': (e: CustomEvent<string>) => void }>}
	 */
	function foo(node, { prop }) {
		// o nó foi montado no DOM

		//...LÓGICA
		node.dispatchEvent(new CustomEvent('emit', { detail: 'hello' }));

		return {
			destroy() {
				// o nó foi removido do DOM
			}
		};
	}
</script>

<div use:foo={{ prop: 'someValue' }} on:emit={handleEmit} />
```

## Tipos

> TYPES: svelte/action
