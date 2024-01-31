<script>
	export let data;
</script>

<svelte:head>
	<title>Blogue • Svelte</title>
	<link
		rel="alternate"
		type="application/rss+xml"
		title="Blogue da Svelte"
		href="https://svelte-docs-pt.vercel.app/blog/rss.xml"
	/>

	<meta name="twitter:title" content="Blogue da Svelte" />
	<meta name="twitter:description" content="Artigos sobre a Svelte e o desenvolvimento de interface de utilizador" />
	<meta name="Description" content="Artigos sobre a Svelte e o desenvolvimento de interface de utilizador" />
</svelte:head>

<h1 class="visually-hidden">Blogue</h1>
<div class="posts stretch">
	{#each data.posts as post}
		{#if !post.draft}
			<article class="post" data-pubdate={post.date}>
				<a class="no-underline" href="/blog/{post.slug}" title="Ler o artigo »">
					<h2>{post.title}</h2>
					<p>{post.description}</p>
				</a>
			</article>
		{/if}
	{/each}
</div>

<style>
	.posts {
		grid-template-columns: 1fr 1fr;
		grid-gap: 1em;
		min-height: calc(100vh - var(--sk-nav-height) - var(--sk-banner-bottom-height));
		padding: var(--sk-page-padding-top) var(--sk-page-padding-side) 6rem var(--sk-page-padding-side);
		max-width: var(--sk-page-main-width);
		margin: 0 auto;
	}

	h2 {
		display: inline-block;
		margin: 3.2rem 0 0.4rem 0;
		color: var(--sk-text-2);
		max-width: 18em;
		font-size: var(--sk-text-m);
		font-weight: 400;
	}

	.post:first-child {
		margin: 0 0 2rem 0;
		padding: 0 0 4rem 0;
		border-bottom: var(--sk-thick-border-width) solid #6767785b; /* based on --second */
	}

	.post:first-child h2 {
		font-size: 4rem;
		font-weight: 400;
		color: var(--sk-text-2);
	}

	.post:where(:first-child, :nth-child(2))::before {
		content: 'Latest post • ' attr(data-pubdate);
		color: var(--sk-theme-3);
		font-size: var(--sk-text-xs);
		font-weight: 400;
		letter-spacing: 0.05em;
		text-transform: uppercase;
	}

	.post:nth-child(2)::before {
		content: 'Older posts';
	}

	.post p {
		font-size: var(--sk-text-s);
		max-width: 30em;
		color: var(--sk-text-3);
	}

	.post > a {
		display: block;
	}

	.posts a:hover,
	.posts a:hover > h2 {
		color: var(--sk-theme-3);
	}
</style>
