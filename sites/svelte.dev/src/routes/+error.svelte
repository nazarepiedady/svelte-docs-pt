<script>
	import { page } from '$app/stores';

	// we don't want to use <svelte:window bind:online> here,
	// because we only care about the online state when
	// the page first loads
	const online = typeof navigator !== 'undefined' ? navigator.onLine : true;
</script>

<svelte:head>
	<title>{$page.status}</title>
</svelte:head>

<div class="container">
	{#if online}
		{#if $page.status === 404}
			<h1>Não encontrada!</h1>
			<p>
				Se esperavas encontrar alguma coisa, visite a <a href="/chat">sala de conversas da Discord</a> e informe-nos, ou levante uma questão na <a href="https://github.com/sveltejs/sites">GitHub</a>. Obrigado!
			</p>
		{:else}
			<h1>Oh Não!</h1>
			<p>Algo correu mal quando tentávamos processar esta página.</p>
			{#if $page.error.message}
				<p class="error">{$page.status}: {$page.error.message}</p>
			{:else}
				<p class="error">Encontrou um erro {$page.status}.</p>
			{/if}
			<p>Tente recarregar a página.</p>
			<p>
				Se o erro persistir, visite a <a href="/chat">sala de conversas da Discord</a> e informe-nos, ou levante uma questão na <a href="https://github.com/sveltejs/sites">GitHub</a>. Obrigado!
			</p>
		{/if}
	{:else}
		<h1>Parece que não tens conexão à internet</h1>
		<p>Recarregue a página quando ligares a internet.</p>
	{/if}
</div>

<style>
	.container {
		padding: var(--sk-page-padding-top) var(--sk-page-padding-side) 6rem var(--sk-page-padding-side);
	}

	h1,
	p {
		margin: 0 auto;
	}

	h1 {
		font-size: 2.8em;
		font-weight: 300;
		margin: 0 0 0.5em 0;
	}

	p {
		margin: 1em auto;
	}

	.error {
		background-color: var(--sk-theme-2);
		color: white;
		padding: 12px 16px;
		font: 600 16px/1.7 var(--sk-font);
		border-radius: 2px;
	}
</style>
