// @ts-check
import adapter from '@sveltejs/adapter-vercel';

/** @type {import('@sveltejs/kit').Config} */
export default {
	kit: {
		adapter: adapter(),
		prerender: {
			handleMissingId: 'ignore'
		}
	},

	vitePlugin: {
		inspector: true
	}
};
