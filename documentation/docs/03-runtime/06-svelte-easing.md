---
title: 'svelte/easing'
---

As funções de atenuação especificam o ritmo de mudança ao longo do tempo e são úteis quando trabalhamos com as transições e animações embutidas da Svelte bem como os utilitários `spring` e `tweened`. `svelte/easing` contém 31 exportações nomeadas, uma desenvoltura `linear` e 3 variantes de 10 diferentes funções de atenuação: `in`, `out` e `inOut`.

Nós podemos explorar as várias desenvolturas usando o [visualizador de desenvoltura](/examples/easing) na [seção de exemplos](/examples).

| ease        | in          | out          | inOut          |
| ----------- | ----------- | ------------ | -------------- |
| **back**    | `backIn`    | `backOut`    | `backInOut`    |
| **bounce**  | `bounceIn`  | `bounceOut`  | `bounceInOut`  |
| **circ**    | `circIn`    | `circOut`    | `circInOut`    |
| **cubic**   | `cubicIn`   | `cubicOut`   | `cubicInOut`   |
| **elastic** | `elasticIn` | `elasticOut` | `elasticInOut` |
| **expo**    | `expoIn`    | `expoOut`    | `expoInOut`    |
| **quad**    | `quadIn`    | `quadOut`    | `quadInOut`    |
| **quart**   | `quartIn`   | `quartOut`   | `quartInOut`   |
| **quint**   | `quintIn`   | `quintOut`   | `quintInOut`   |
| **sine**    | `sineIn`    | `sineOut`    | `sineInOut`    |

<!-- TODO -->

<!--
<div class="max">
	<iframe
		title="Aphrodite example"
		src="/repl/easing"
		scrolling="no"
	></iframe>
</div> -->
