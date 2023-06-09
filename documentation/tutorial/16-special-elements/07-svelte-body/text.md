---
title: <svelte:body>
---

Similar to `<svelte:window>` and `<svelte:document>`, the `<svelte:body>` element allows you to listen for events that fire on `document.body`. This is useful with the `mouseenter` and `mouseleave` events, which don't fire on `window`.

Add the `mouseenter` and `mouseleave` handlers to the `<svelte:body>` tag:

<!-- prettier-ignore -->
```svelte
<svelte:body
	on:mouseenter={handleMouseenter}
	on:mouseleave={handleMouseleave}
/>
```
