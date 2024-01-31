<script>
	import { Blurb, Footer } from '@sveltejs/site-kit/home';
	import Demo from './_components/Demo.svelte';
	import Hero from './_components/Hero.svelte';
	import Supporters from './_components/Supporters/index.svelte';
	import TryTerminal from './_components/TryTerminal.svelte';
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

<TryTerminal />

<Demo />

<WhosUsingSvelte />

<Supporters />

<Footer
	links={{
		resources: [
			{
				title: 'documentação',
				href: '/docs'
			},
			{
				title: 'tutorial',
				href: '/tutorial'
			},
			{
				title: 'exemplos',
				href: '/examples'
			},
			{
				title: 'blogue',
				href: '/blog'
			}
		],
		connect: [
			{
				title: 'github',
				href: 'https://github.com/sveltejs/svelte'
			},
			{
				title: 'opencollective',
				href: 'https://opencollective.com/svelte'
			},
			{
				title: 'discord',
				href: '/chat'
			},
			{
				title: 'twitter',
				href: 'https://twitter.com/sveltejs'
			}
		]
	}}>
	<span slot="copyright">
		© 2023 <a href="https://github.com/sveltejs/svelte/graphs/contributors">colaboradores da Svelte</a>
	</span>
	<span slot="license">
		Svelte é um projeto <a href="https://github.com/sveltejs/svelte">gratuito e de código-aberto</a> lançado sob a licença MIT
	</span>
</Footer>

<style>
	h2 {
		line-height: 1.05;
	}

	p {
		font-size: var(--sk-text-m);
	}
</style>
