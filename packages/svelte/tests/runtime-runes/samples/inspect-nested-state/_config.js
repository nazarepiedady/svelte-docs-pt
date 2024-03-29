import { test } from '../../test';

/**
 * @type {any[]}
 */
let log;
/**
 * @type {typeof console.log}}
 */
let original_log;

export default test({
	compileOptions: {
		dev: true
	},
	before_test() {
		log = [];
		original_log = console.log;
		console.log = (...v) => {
			log.push(...v);
		};
	},
	after_test() {
		console.log = original_log;
	},
	async test({ assert, target }) {
		const [b1] = target.querySelectorAll('button');
		b1.click();
		await Promise.resolve();

		assert.deepEqual(log, [
			'init',
			{ x: { count: 0 } },
			[{ count: 0 }],
			'update',
			{ x: { count: 1 } },
			[{ count: 1 }]
		]);
	}
});
