export default {
	props: {
		name: 'world'
	},

	ssrHtml: `
		<editor contenteditable="true">world</editor>
		<p>hello world</p>
	`,

	async test({ assert, component, target, window }) {
		// JSDom doesn't support innerText yet, so the test is not ideal
		// https://github.com/jsdom/jsdom/issues/1245
		const el = target.querySelector('editor');
		assert.equal(el.innerText, 'world');

		const event = new window.Event('input');
		el.innerText = 'everybody';
		await el.dispatchEvent(event);
		assert.equal(component.name, 'everybody');

		component.name = 'goodbye';
		assert.equal(el.innerText, 'goodbye');
	}
};
