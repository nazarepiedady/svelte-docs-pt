import { test } from '../../test';

export default test({
	html: `<button>0 / 0</button>`,

	async test({ assert, target }) {
		const btn = target.querySelector('button');
		await btn?.click();
		assert.htmlEqual(target.innerHTML, `<button>1 / 1</button>`);
	}
});
