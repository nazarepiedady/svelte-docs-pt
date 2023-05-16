module.exports = {
	root: true,
	extends: ['@sveltejs', 'prettier'],
	settings: {
		'import/core-modules': [
			'svelte',
			'svelte/internal',
			'svelte/store',
			'svelte/easing',
			'estree'
		],
		'svelte3/compiler': require('./compiler')
	},
	rules: {
		'@typescript-eslint/no-non-null-assertion': 'off'
	}
};
