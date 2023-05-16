export default {
	props: {
		inert: true
	},
	test({ assert, target, component }) {
		const div = target.querySelector('div');
		assert.ok(div.inert);
		component.inert = false;
		assert.ok(!div.inert);
	}
};
