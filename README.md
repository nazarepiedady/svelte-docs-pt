[![Aplicações de Web Ciberneticamente Aprimoradas: Svelte](https://sveltejs.github.io/assets/banner.png)](https://svelte.dev)

[![Licença](https://img.shields.io/npm/l/svelte.svg)](LICENSE.md) [![Conversa](https://img.shields.io/discord/457912077277855764?label=chat&logo=discord)](https://svelte.dev/chat)

## O Que é Svelte?

Svelte é uma nova maneira de construir aplicações de Web. É um compilador que recebe os nossos componentes declarativos e converte-os em JavaScript eficiente que atualiza o maneira cirúrgica o DOM.

Saiba mais na [página da Svelte (em Português)](https://svelte-docs-pt.vercel.app), passe pelo [fórum de discussão da Discord](https://svelte.dev/chat).

## Apoiando a Svelte

Svelte é um projeto de código-aberto licenciado pela MIT com seu desenvolvimento em curso tornado possível inteiramente pelos fantásticos voluntários. Se gostarias de apoiar os seus esforços, considere:

- [Tornar-se um financiador na Open Collective](https://opencollective.com/svelte).

Os fundos doados através da Open Collective será usado para compensar as despesas relacionadas ao desenvolvimento da Svelte tais como custos de hospedagem. Se doações suficientes forem recebidas, os fundos também podem ser usados para apoiar o desenvolvimento da Svelte mais diretamente.

## Mapa de Estradas

É possível visualizar [o nosso mapa de estradas](https://svelte.dev/roadmap) para saberes o que estamos a trabalhar atualmente.

## Contribuição

Consulte o [Guia de Contribuição] e [pacote da svelte](packages/svelte) por contribuições à Svelte.

### Desenvolvimento

Os pedidos de atualização de repositório são encorajados e sempre bem-vindos. [Escolha um problema](https://github.com/sveltejs/svelte/issues?q=is%3Aissue+is%3Aopen+sort%3Aupdated-desc) e ajude-nos!

Para instalar e trabalhar na Svelte localmente:

```bash
git clone https://github.com/sveltejs/svelte.git
cd svelte
pnpm install
```

> Não usar a Yarn para instalar as dependências, uma vez que versões de pacotes específicas na `pnpm-lock.json` são usadas para construir e testar a Svelte.

Para construir o compilador e todos os outros módulos incluídos no pacote:

```bash
pnpm build
```

Para observar por mudanças e reconstruir o pacote continuamente (isto é útil se estivermos usando [`pnpm link`](https://pnpm.io/cli/link) para testar as mudanças num projeto localmente):

```bash
pnpm dev
```

O compilador é escrito em JavaScript e usa os comentários da [JSDoc](https://jsdoc.app/index.html) para verificação de tipo.

### Executando Testes

```bash
pnpm test
```

Para filtrar testes, usamos `-g` (vulgo `--grep`). Por exemplo, para apenas executar os testes envolvendo as transições:

```bash
pnpm test -- -g transition
```

### svelte.dev

O código-fonte para [svelte.dev](https://svelte.dev) mora no repositório [sites](https://github.com/sveltejs/sites), com toda a documentação no diretório [`site/content`](site/content). O sítio foi construído com a [SvelteKit](https://sveltekit-docs-pt.vercel.app/).

## svelte.dev está em baixo?

Provavelmente não, mas é possível. Se parece que não podemos acessar quaisquer sítios `.dev`, consulte [esta questão e resposta da SuperUser](https://superuser.com/q/1413402).

## Licença

[MIT](LICENSE.md)
