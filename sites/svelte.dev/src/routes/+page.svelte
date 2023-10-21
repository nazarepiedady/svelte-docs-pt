<script>
	import { Blurb } from '@sveltejs/site-kit/components';
	import Demo from './_components/Demo.svelte';
	import Hero from './_components/Hero.svelte';
	import Supporters from './_components/Supporters/index.svelte';
	import Try from './_components/Try.svelte';
	import WhosUsingSvelte from './_components/WhosUsingSvelte/index.svelte';
</script>

<svelte:head>
	<title>Svelte • Aplicações da Web Ciberneticamente Melhoradas</title>

	<meta name="twitter:title" content="Svelte" />
	<meta name="twitter:description" content="Aplicações da Web Ciberneticamente Melhoradas" />
	<meta name="Description" content="Aplicações da Web Ciberneticamente Melhoradas" />
</svelte:head>

<h1 class="visually-hidden">Svelte</h1>

<Hero />

<Blurb --background="var(--sk-back-1)">
	<div slot="one">
		<h2>compilada</h2>
		<p>
			Svelte alterna-se o máximo possível fora do navegador e à tua etapa de construção. Sem otimizações manuais — apenas aplicações mais rápida, e mais eficientes.
		</p>
	</div>

	<div slot="two">
		<h2>compacta</h2>
		<p>
			Escreva componentes concisos de cortar a respiração usando as linguagens que já conheces — HTML, CSS e JavaScript. Oh, e os pacotes da tua aplicação também serão pequenos.
		</p>
	</div>

	<div slot="three">
		<h2>completa</h2>
		<p>
			Estilização isolada, gestão de estado, primitivos de movimento, vínculos de formulário embutidos e muito mais — não perca tempo a vasculhar a npm a procura do essencial. Está tudo aqui.
		</p>
	</div>
</Blurb>

<Try />

<Demo />

<WhosUsingSvelte />

<Supporters />

<section>
	<footer>
		<div class="logo" />
		<div class="links">
			<h4>recursos</h4>
			<a href="/docs">documentação</a>
			<a href="/tutorial">seminário interativo</a>
			<a href="/examples">exemplos</a>
			<a href="/blog">blogue</a>
		</div>
		<div class="links">
			<h4>conectar</h4>
			<a href="https://github.com/sveltejs/svelte">github</a>
			<a href="https://opencollective.com/svelte">open collective</a>
			<a href="/chat">discord</a>
			<a href="https://twitter.com/sveltejs">twitter</a>
		</div>
		<div class="copyright">
			© 2023 <a href="https://github.com/sveltejs/svelte/graphs/contributors">colaboradores da Svelte</a>
		</div>
		<div class="open-source">
			Svelte é um projeto <a href="https://github.com/sveltejs/svelte">gratuito e de código-aberto</a> lançado sob a licença MIT
		</div>
	</footer>
</section>

<style>
	h2 {
		line-height: 1.05;
	}

	p {
		font-size: var(--sk-text-m);
	}

	section {
		background: var(--sk-back-4);
		padding: 10rem 0;
	}

	footer {
		max-width: 120rem;
		padding: 0 var(--sk-page-padding-side);
		margin: 0 auto;
		display: grid;
		grid-template-columns: repeat(2, 1fr);
		grid-template-rows: 1fr;
		grid-row-gap: 6rem;
	}

	footer .logo {
		display: none;
		background: url('@sveltejs/site-kit/branding/svelte-logo.svg');
		background-repeat: no-repeat;
		background-size: 8rem;
		filter: grayscale(100%) opacity(84%);
	}

	footer h4 {
		font-size: var(--sk-text-m);
		padding-bottom: 1rem;
	}

	.links a {
		color: var(--sk-text-2);
		font-size: var(--sk-text-s);
		display: block;
		line-height: 1.8;
	}

	.open-source {
		display: none;
		grid-column: span 2;
	}

	.copyright {
		grid-column: span 2;
	}

	@media (min-width: 500px) {
		footer {
			grid-template-columns: repeat(3, 1fr);
		}

		footer .logo {
			display: block;
		}

		.copyright {
			grid-column: span 1;
		}

		.open-source {
			display: block;
		}
	}
</style>
