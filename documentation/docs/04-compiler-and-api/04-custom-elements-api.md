---
title: 'API - Elementos Personalizados'
---

Os componentes da Svelte também podem ser compilados para elementos personalizados (vulgo, componentes da Web) usando a opção do compilador `customElement: true`. Nós devemos especificar um nome de marcador para o componente usando o [elemento](/docs/special-elements#svelte-options) `<svelte:options>`:

```svelte
<svelte:options customElement="my-element" />

<!-- na Svelte 3, fazemos isto:
<svelte:options tag="my-element" />
-->

<script>
	export let name = 'world';
</script>

<h1>Hello {name}!</h1>
<slot />
```

Nós podemos omitir o nome do marcador para qualquer um dos nossos componentes internos que não queremos expor e usá-los como componentes de Svelte normais. Os consumidores do componente ainda podem nomeá-lo mais tarde se necessário, usando a propriedade `element` estática que contém o construtor do elemento personalizado e que está disponível quando a opção do compilador `customElement` for `true`:

```js
// @noErrors
import MyElement from './MyElement.svelte';

customElements.define('my-element', MyElement.element);
// Na Svelte 3, fazemos isto:
// customElements.define('my-element', MyElement);
```

Assim que um elemento personalizado for definido, pode ser usado como um elemento de DOM normal:

```js
document.body.innerHTML = `
	<my-element>
		<p>This is some slotted content</p>
	</my-element>
`;
```

Por padrão, os elementos personalizados são compilados com `accessors: true`, o que significa que quaisquer [propriedades](/docs/basic-markup#attributes-and-props) são expostas como propriedades do elemento de DOM (bem como sendo legíveis ou graváveis como atributos, onde possível).

Para evitar isto, adicionamos `accessors={false}` ao `<svelte:options>`:

```js
// @noErrors
const el = document.querySelector('my-element');

// receber o valor atual da propriedade 'name'
console.log(el.name);

// definir um novo valor, atualizando o DOM de sombra
el.name = 'everybody';
```

## Opções do Componente

Quando construímos um elemento personalizado, podemos adaptar vários aspetos definindo `customElement` como um objeto dentro de `<svelte:options>` desde a Svelte 4. Este objeto inclui uma propriedade `tag` obrigatória para o nome do elemento personalizado, uma propriedade `shadow` opcional que pode ser definida para `"none"` para abster-se da criação da raiz da sombra (nota que os estilos já não são encapsulados, e não podemos usar as ranhuras), e uma opção `props`, que oferece as seguintes definições:

- `attribute: string`: Para atualizar uma propriedade do elemento personalizado, temos duas alternativas: ou definir a propriedade sobre a referência do elemento personalizado como ilustrado acima ou usar um atributo de HTML. Para o último, o nome do atributo padrão é o nome da propriedade com letras minúsculas. Modificamos isto atribuindo `attribute: "<desired name>"`.
- `reflect: boolean`: Por padrão, os valores da propriedade atualizada não refletem de volta ao DOM. Para ativar este comportamento, definimos `reflect: true`.
- `type: 'String' | 'Boolean' | 'Number' | 'Array' | 'Object'`: Enquanto convertemos um valor de atributo à um valor de propriedade e o refletimos de volta, o valor da propriedade é suposto ser uma `String` por padrão. Isto pode nem sempre ser exato. Por exemplo, para um tipo de número, o definimos usando `type: "Number"`.

```svelte
<svelte:options
	customElement={{
		tag: 'custom-element',
		shadow: 'none',
		props: {
			name: { reflect: true, type: 'Number', attribute: 'element-index' }
		}
	}}
/>

<script>
	export let elementIndex;
</script>

...
```

## Advertências e Limitações

Os elementos personalizados podem ser uma maneira útil de empacotar os componentes para consumo numa aplicação que não é de Svelte, visto que funcionarão com o HTML e JavaScript puros bem como com a [maioria das abstrações](https://custom-elements-everywhere.com/). Existem, no entanto, algumas diferenças importantes a tomar consciência de que:

- Os estilos são _encapsulados_, ao invés de meramente _isolados_ (a menos que definamos `shadow: "none"`). Isto significa que quaisquer estilos que não são do componente (tais como podemos ter num ficheiro `global.css`) não aplicar-se-ão ao elemento personalizado, incluindo os estilos com o modificador `:global(...)`
- Ao invés de serem extraídas como um ficheiro `.css` separado, os estilos são incorporados no componente como uma sequência de caracteres de JavaScript
- Os elementos personalizados não são geralmente adequados para a interpretação do lado do servidor, visto que o DOM de sombra é invisível até o JavaScript carregar
- Na Svelte, o conteúdo encaixado interpreta-se _preguiçosamente_. No DOM, interpreta-se _ansiosamente_. Em outras palavras, sempre será criado mesmo se o elemento `<slot>` do componente estiver dentro dum bloco `{#if ...}`. De maneira semelhante, incluir um `<slot>` num bloco `{#each ...}` não fará com que o conteúdo encaixado seja interpretado várias vezes.
- A diretiva `let:` não tem nenhum efeito, porque os elementos personalizados não têm numa maneira de passar os dados ao componente pai que preenche a ranhura
- Os tapadores de buracos de funcionalidades são obrigatórios para suportar navegadores mais antigos.

Quando um elemento personalizado escrito com a Svelte for criado ou atualizado, o DOM de sombra refletirá o valor no próximo tiquetaque, não imediatamente. Desta maneira as atualizações podem ser organizadas por grupos, e o DOM move-se o que temporariamente (mas de maneira síncrona) separa o elemento do DOM não leva à desmontar o componente interno.
