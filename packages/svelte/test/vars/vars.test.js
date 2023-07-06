import * as fs from 'node:fs';
import { assert, describe, it } from 'vitest';
import { compile } from 'svelte/compiler';
import { try_load_json } from '../helpers.js';

describe('vars', () => {
	fs.readdirSync(`${__dirname}/samples`).forEach((dir) => {
		if (dir[0] === '.') {
			return;
		}

		// add .solo to a sample directory name to only run that test
		const solo = /\.solo/.test(dir);
		const skip = /\.skip/.test(dir);

		const it_fn = solo ? it.only : skip ? it.skip : it;

		it_fn.each(['dom', 'ssr', false])(`${dir} generate: %s`, async (generate) => {
			const input = (await import(`./samples/${dir}/input.svelte?raw`)).default
				.trimEnd()
				.replace(/\r/g, '');

			const expectedError = try_load_json(`${__dirname}/samples/${dir}/error.json`);

			/**
			 * @type {{ options: any, test: (assert: typeof import('vitest').assert, vars: any[]) => void }}}
			 */
			const { options, test } = (await import(`./samples/${dir}/_config.js`)).default;

			try {
				const { vars } = compile(input, { ...options, generate });
				test(assert, vars);
			} catch (error) {
				if (expectedError) {
					assert.equal(error.message, expectedError.message);
					assert.deepEqual(error.start, expectedError.start);
					assert.deepEqual(error.end, expectedError.end);
					assert.equal(error.pos, expectedError.pos);
					return;
				} else {
					throw error;
				}
			}

			if (expectedError) {
				assert.fail(`Expected an error: ${JSON.stringify(expectedError)}`);
			}
		});
	});
});
