export default {
	get props() {
		return {
			myClass: 'one two',
			attributes: { role: 'button' }
		};
	},

	html: '<div class="one two" role="button"></div>',

	test({ assert, component, target }) {
		component.myClass = 'one';
		component.attributes = {
			'aria-label': 'Test'
		};

		assert.htmlEqual(
			target.innerHTML,
			`
			<div class="one" aria-label="Test"></div>
		`
		);
	}
};
