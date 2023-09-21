---
title: Componentes da Svelte
---

Os componentes são blocos de construção de aplicações de Svelte. Eles são escritos dentro dos ficheiros `.svelte`, usando um superconjunto de HTML.

Todas as três seções — `<script>` (o programa), `<style>` (o estilo), e a marcação — são opcionais.

```svelte
<script>
	// a lógica
</script>

<!-- marcação (zero ou mais itens) -->

<style>
	/* estilos */
</style>
```

## &lt;script&gt;

Um bloco `<script>` contém JavaScript que executa-se quando uma instância de componente é criada. As variáveis declaradas (ou importadas) no alto nível estão 'visíveis' a partir da marcação do componente. Existem quatro regras adicionais:

<span id="#script-1-export-creates-a-component-prop"></span>
### 1. `export` cria uma propriedade de componente

A Svelte usa a palavra-chave `export` para marcar uma declaração de variável como uma _propriedade_, o que significa que torna-se acessível aos consumidores do componente (consulte a seção sobre [atributos e propriedades](/docs/basic-markup#attributes-and-props) por mais informações):

```svelte
<script>
	export let foo;

	// Os valores que são passados como propriedades
	// estão imediatamente disponíveis
	console.log({ foo });
</script>
```

Nós podemos especificar um valor inicial padrão para uma propriedade. Ele será usado se o consumidor do componente não especificar a propriedade no componente (ou se seu valor inicial for `undefined`) quando inicializarmos o componente. Nota que se os valores das propriedades forem subsequentemente atualizados, então qualquer propriedade cujo valor não for especificado será definida para `undefined` (no lugar do seu valor inicial).

No modo de desenvolvimento (consulte as [opções do compilador](/docs/svelte-compiler#compile)), um aviso será imprimido se nenhum valor inicial padrão for fornecido e o consumidor não especificar um valor. Para reprimir este aviso, garantimos que um valor inicial padrão é especificado, mesmo se for `undefined`:

```svelte
<script>
	export let bar = 'optional default initial value';
	export let baz = undefined;
</script>
```

Se exportarmos uma `const`, `class` ou `function`, está disponível apenas para leitura a partir de fora do componente. As funções são valores de propriedade válidos, no entanto, como mostrado abaixo:

```svelte
<!--- file: App.svelte --->
<script>
	// estas são apenas para leitura
	export const thisIs = 'readonly';

	/** @param {string} name */
	export function greet(name) {
		alert(`hello ${name}!`);
	}

	// isto é uma propriedade
	export let format = (n) => n.toFixed(2);
</script>
```

As propriedades exclusivas para leitura podem ser acessadas como propriedades no elemento, atados ao componente usando a [sintaxe `bind:this`](/docs/component-directives#bind-this).

Nós podemos usar palavras reservadas como nomes de propriedade:

```svelte
<!--- file: App.svelte --->
<script>
	/** @type {string} */
	let className;

	// cria uma propriedade `class`, apesar
	// de ser uma palavra reservada
	export { className as class };
</script>
```

<span id="#script-2-assignments-are-reactive"></span>
### 2. Atribuições são 'reativas'

Para mudar o estado do componente e acionar um redesenho, apenas precisamos atribuir à uma variável declarada localmente.

As atualizações de expressão (`count += 1`) e atribuições de propriedade (`obj.x = y`) têm o mesmo efeito:

```svelte
<script>
	let count = 0;

	function handleClick() {
		// a chamada desta função acionará uma
		// atualização se a marcação referir-se à `count`
		count = count + 1;
	}
</script>
```

Uma vez que a reatividade da Svelte está baseada nas atribuições, o uso de métodos de vetor como `.push()` e `.splice()` não acionará automaticamente as atualizações. Uma atribuição subsequente é necessária para acionar a atualização. Este e mais detalhes podem ser encontrados no [seminário](https://learn.svelte.dev/tutorial/updating-arrays-and-objects):

```svelte
<script>
	let arr = [0, 1];

	function handleClick() {
		// esta chamada de método não aciona uma atualização
		arr.push(2);
		// esta atribuição acionará uma atualização
		// se a marcação referir-se à `arr`
		arr = arr;
	}
</script>
```

Os blocos de `<script>` da Svelte são executados apenas quando o componente for criado, assim as atribuições dentro dum bloco de `<script>` não são automaticamente executadas novamente quando uma propriedade atualizar-se. Se gostaríamos de rastrear mudanças à uma propriedade, o próximo exemplo na seguinte seção mostra-nos como fazê-lo:

```svelte
<script>
	export let person;
	// isto apenas definirá `name` na criação do componente
	// não atualizar-se-á quando `person` atualizar-se
	let { name } = person;
</script>
```

<span id="#script-3-$-marks-a-statement-as-reactive"></span>
### 3. `$:` marca uma declaração como reativa

Qualquer declaração de alto nível (por exemplo, que não estiver dentro dum bloco ou duma função) pode ser tornada reativa prefixando-a com a `$:` [sintaxe de rótulo da JavaScript](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/label). As declarações reativas executam depois do outro código do programa e antes do componente ser desenhado, sempre que os valores que de que dependem tiver sido mudado.

```svelte
<script>
	export let title;
	export let person;

	// isto atualizará `document.title` sempre
	// que a propriedade `title` mudar
	$: document.title = title;

	$: {
		console.log(`multiple statements can be combined`);
		console.log(`the current title is ${title}`);
	}

	// isto atualizará `name` quando `person´ mudar
	$: ({ name } = person);

	// não fazer isto. executará antes da linha anterior
	let name2 = name;
</script>
```

Apenas os valores que aparecem diretamente dentro do bloco `$:` tornar-se-ão dependências da declaração reativa. Por exemplo, no código baixo `total` apenas atualizar-se-á quando `x` mudar, mas não `y`:

```svelte
<!--- file: App.svelte --->
<script>
	let x = 0;
	let y = 0;

	/** @param {number} value */
	function yPlusAValue(value) {
		return value + y;
	}

	$: total = yPlusAValue(x);
</script>

Total: {total}
<button on:click={() => x++}> Increment X </button>

<button on:click={() => y++}> Increment Y </button>
```

É importante notar que os blocos reativos são ordenados através duma simples analise estática em tempo de compilação, e tudo que o compilador vê são as variáveis que são atribuídas à e usadas dentro do próprio bloco, não em quaisquer funções chamadas por elas. Isto significa que `yDependent` não será atualizado quando `x` for atualizada no seguinte exemplo:

```svelte
<script>
	let x = 0;
	let y = 0;

	/** @param {number} value */
	function setY(value) {
		y = value;
	}

	$: yDependent = y;
	$: setY(x);
</script>
```

O ato de mover a linha `$: yDependent = y` por baixo de `$: setY(x)` fará a `yDependent` ser atualizada quando `x` for atualizada.

Se uma declaração consistir inteiramente duma atribuição à uma variável não declarada, a Svelte injetará uma declaração `let` em nosso nome:

```svelte
<!--- file: App.svelte --->
<script>
	/** @type {number} */
	export let num;

	// não precisamos de declarar `squared` e `cubed`
	// — a Svelte faz isto por nós
	$: squared = num * num;
	$: cubed = squared * num;
</script>
```

<span id="#script-4-prefix-stores-with-$-to-access-their-values"></span>
### 4. Prefixar as memórias com `$` para acessar os seus valores

Uma _memória_ é um objeto que permite o acesso reativo à um valor através dum simples _contrato de memória_. O [módulo `svelte/store`](/docs/svelte-store) contém implementações de memória minimalista que satisfaz este contrato.

Em qualquer momento que tivermos uma referência à uma memória, podemos acessar o seu valor dentro dum componente prefixando-a com o carácter `$`. Isto faz a Svelte declarar a variável prefixada, subscrever à memória na inicialização do componente e anular a subscrição quando apropriado.

As atribuições às variáveis prefixadas pelo `$` exigem que a variável seja uma memória gravável, e resultará numa chamada ao método `.set` da memória.

Nota que a memória deve ser declarada no alto nível do componente — não dentro dum bloco `if` ou duma função, por exemplo.

As variáveis locais (que não representam os valores da memória) _não_ devem ter um prefixo `$`:

```svelte
<script>
	import { writable } from 'svelte/store';

	const count = writable(0);
	console.log($count); // logs 0

	count.set(1);
	console.log($count); // logs 1

	$count = 2;
	console.log($count); // logs 2
</script>
```

<span id="#script-4-prefix-stores-with-$-to-access-their-values-store-contract"></span>
#### Contrato de Memória

```ts
// @noErrors
store = { subscribe: (subscription: (value: any) => void) => (() => void), set?: (value: any) => void }
```

Nós podemos criar as nossas próprias memórias sem depender da [`svelte/store`](/docs/svelte-store), ao implementar o _contrato de memória_:

1. Uma memória deve conter um método `.subscribe`, o qual deve aceitar como seu argumento uma função de subscrição. Esta função de subscrição deve ser chamada imediatamente e de maneira síncrona com o valor atual da memória ao chamar `.subscribe`. Todas as funções de subscrição ativas duma memória devem ser posteriormente chamadas de maneira síncrona sempre que o valor da memória mudar.
2. O método `.subscribe` deve retornar uma função de anulação de subscrição. A chamada duma função de anulação de subscrição deve parar a sua subscrição, e a sua função de subscrição correspondente não deve ser chamada novamente pela memória.
3. Uma memória pode _opcionalmente_ conter um método `.set`, o qual deve aceitar como seu argumento um novo valor para a memória, e que chama de maneira síncrona todas as funções de subscrição ativas da memória. Tal memória é chamada de _memória gravável_.

Para interoperabilidade com os observáveis de RxJS, o método `.subscribe` também está permitido retornar um objeto com um  método `.unsubscribe`, ao invés de retornar a função de anulação de subscrição diretamente. Nota, no entanto, que a menos que `.subscribe` chame de maneira síncrona a subscrição (o que não é exigido pela especificação do Observável), a Svelte verá o valor da memória como `undefined` até que isto aconteça.

## &lt;script context="module"&gt;

Um marcador `<script>` com um atributo `context="module"` é executado uma vez quando o módulo é avaliado pela primeira vez, e nãp para cada instância do componente. Os valores declarados neste bloco são acessíveis a partir dum `<script>` normal (e a marcação do componente), mas não vice-versa.

Nós podemos fazer `export` de vínculos a partir deste bloco, e tornar-se-ão exportações do módulo compilado.

Nós não podemos fazer `export default`, visto que a exportação padrão é o próprio componente.

> As variáveis definidas nos programas de `module` não são reativas — reatribuí-las não acionará uma nova interpretação, mesmo que a própria variável seja atualizada. Para os valores partilhados entre vários componentes devemos considerar usar uma [memória](/docs/svelte-store).

```svelte
<script context="module">
	let totalComponents = 0;

	// a palavra-chave `export` permite esta função ser importada com
	//  por exemplo `import Example, { alertTotal } from './Example.svelte'`
	export function alertTotal() {
		alert(totalComponents);
	}
</script>

<script>
	totalComponents += 1;
	console.log(`total number of times this component has been created: ${totalComponents}`);
</script>
```

## &lt;style&gt;

A CSS dentro dum bloco `<style>` será isolada para este componente.

Isto funciona adicionando uma classe aos elementos afetados, que é baseada numa sequência de caracteres embaralhados dos estilos do componente (por exemplo, `svelte-123xyz`):

```svelte
<style>
	p {
		/* isto apenas afetará os elementos <p> neste componente */
		color: burlywood;
	}
</style>
```

Para aplicar estilos à um seletor globalmente, usamos o modificador `:global(...)`:

```svelte
<style>
	:global(body) {
		/* isto aplicar-se-á ao <body> */
		margin: 0;
	}

	div :global(strong) {
		/* isto aplicar-se-á à todos elementos <strong>, dentro de
			 qualquer componente, que estão dentro de elementos <div>
			 que pertencem à este componente */
		color: goldenrod;
	}

	p:global(.red) {
		/* isto aplicar-se-á à todos elementos <p> que pertencem à
			 este componente com a classe `red`, mesmo se `class="red"`
			 não aparecer inicialmente na marcação, e é ao invés disto
			 adicionada em tempo execução. Isto é útil quando a classe
			 do elemento é aplicada dinamicamente, por exemplo quando
			 atualizamos a propriedade `classList` do elemento diretamente. */
	}
</style>
```

Se quisermos criar `@keyframes` que são acessíveis globalmente, precisamos de prefixar os nomes dos quadros-chave com `-global-`.

A parte `-global-` será removida quando compilada, e o quadro-chave então será referenciado usando apenas `my-animation-name` em algum lugar no nosso código:

```svelte
<style>
	@keyframes -global-my-animation-name {
		/* o código vai aqui */
	}
</style>
```

Deveria apenas existir 1 marcador `<style>` de alto nível por componente.

No entanto, é possível ter um marcador `<style>` encaixado dentro doutros elementos ou blocos lógicos.

Neste caso, o marcador `<style>` será inserido tal como está no DOM, nenhum isolamento ou processamento será feito sobre o marcador `<style>`:

```svelte
<div>
	<style>
		/* este marcador de estilo será inserido como está */
		div {
			/* isto aplicar-se-á à todos elementos `<div>` no DOM */
			color: red;
		}
	</style>
</div>
```
