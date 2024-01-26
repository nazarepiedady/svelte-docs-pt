import { describe, assert, it } from 'vitest';
import * as $ from '../../src/internal/client/runtime';

/**
 * @param runes runes mode
 * @param fn A function that returns a function because we first need to setup all the signals
 * 			 and then execute the test in order to simulate a real component
 */
function run_test(runes: boolean, fn: () => () => void) {
	return () => {
		// Create a component context to test runes vs legacy mode
		$.push({}, runes);
		// Create a render context so that effect validations etc don't fail
		let execute: any;
		const signal = $.render_effect(
			() => {
				execute = fn();
			},
			null,
			true,
			true
		);
		$.pop();
		execute();
		$.destroy_signal(signal);
	};
}

function test(text: string, fn: () => any) {
	it(`${text} (legacy mode)`, run_test(false, fn));
	it(`${text} (runes mode)`, run_test(true, fn));
}

describe('signals', () => {
	test('effect with state and derived in it', () => {
		const log: string[] = [];

		let count = $.source(0);
		let double = $.derived(() => $.get(count) * 2);
		$.effect(() => {
			log.push(`${$.get(count)}:${$.get(double)}`);
		});

		return () => {
			$.flushSync(() => $.set(count, 1));
			$.flushSync(() => $.set(count, 2));

			assert.deepEqual(log, ['0:0', '1:2', '2:4']);
		};
	});

	test('multiple effects with state and derived in it#1', () => {
		const log: string[] = [];

		let count = $.source(0);
		let double = $.derived(() => $.get(count) * 2);

		$.effect(() => {
			log.push(`A:${$.get(count)}:${$.get(double)}`);
		});
		$.effect(() => {
			log.push(`B:${$.get(double)}`);
		});

		return () => {
			$.flushSync(() => $.set(count, 1));
			$.flushSync(() => $.set(count, 2));

			assert.deepEqual(log, ['A:0:0', 'B:0', 'A:1:2', 'B:2', 'A:2:4', 'B:4']);
		};
	});

	test('multiple effects with state and derived in it#2', () => {
		const log: string[] = [];

		let count = $.source(0);
		let double = $.derived(() => $.get(count) * 2);

		$.effect(() => {
			log.push(`A:${$.get(double)}`);
		});
		$.effect(() => {
			log.push(`B:${$.get(count)}:${$.get(double)}`);
		});

		return () => {
			$.flushSync(() => $.set(count, 1));
			$.flushSync(() => $.set(count, 2));

			assert.deepEqual(log, ['A:0', 'B:0:0', 'A:2', 'B:1:2', 'A:4', 'B:2:4']);
		};
	});

	test('derived from state', () => {
		const log: number[] = [];

		let count = $.source(0);
		let double = $.derived(() => $.get(count) * 2);

		$.effect(() => {
			log.push($.get(double));
		});

		return () => {
			$.flushSync(() => $.set(count, 1));
			$.flushSync(() => $.set(count, 2));

			assert.deepEqual(log, [0, 2, 4]);
		};
	});

	test('derived from derived', () => {
		const log: number[] = [];

		let count = $.source(0);
		let double = $.derived(() => $.get(count) * 2);
		let quadruple = $.derived(() => $.get(double) * 2);

		$.effect(() => {
			log.push($.get(quadruple));
		});

		return () => {
			$.flushSync(() => $.set(count, 1));
			$.flushSync(() => $.set(count, 2));

			assert.deepEqual(log, [0, 4, 8]);
		};
	});

	test('https://perf.js.hyoo.ru/#!bench=9h2as6_u0mfnn', () => {
		let res: number[] = [];

		const numbers = Array.from({ length: 2 }, (_, i) => i);
		const fib = (n: number): number => (n < 2 ? 1 : fib(n - 1) + fib(n - 2));
		const hard = (n: number, l: string) => n + fib(16);

		const A = $.source(0);
		const B = $.source(0);
		const C = $.derived(() => ($.get(A) % 2) + ($.get(B) % 2));
		const D = $.derived(() => numbers.map((i) => i + ($.get(A) % 2) - ($.get(B) % 2)));
		const E = $.derived(() => hard($.get(C) + $.get(A) + $.get(D)[0]!, 'E'));
		const F = $.derived(() => hard($.get(D)[0]! && $.get(B), 'F'));
		const G = $.derived(() => $.get(C) + ($.get(C) || $.get(E) % 2) + $.get(D)[0]! + $.get(F));
		$.effect(() => {
			res.push(hard($.get(G), 'H'));
		});
		$.effect(() => {
			res.push($.get(G));
		});
		$.effect(() => {
			res.push(hard($.get(F), 'J'));
		});

		return () => {
			$.flushSync();

			let i = 2;
			while (--i) {
				res.length = 0;
				$.set(B, 1);
				$.set(A, 1 + i * 2);
				$.flushSync();

				$.set(A, 2 + i * 2);
				$.set(B, 2);
				$.flushSync();

				assert.equal(res.length, 4);
				assert.deepEqual(res, [3198, 1601, 3195, 1598]);
			}
		};
	});

	test('effects correctly handle unowned derived values that do not change', () => {
		const log: number[] = [];

		let count = $.source(0);
		const read = () => {
			const x = $.derived(() => ({ count: $.get(count) }));
			return $.get(x);
		};
		const derivedCount = $.derived(() => read().count);
		$.user_effect(() => {
			log.push($.get(derivedCount));
		});

		return () => {
			$.flushSync(() => $.set(count, 1));
			// Ensure we're not leaking consumers
			assert.deepEqual(count.c?.length, 1);
			$.flushSync(() => $.set(count, 2));
			// Ensure we're not leaking consumers
			assert.deepEqual(count.c?.length, 1);
			$.flushSync(() => $.set(count, 3));
			// Ensure we're not leaking consumers
			assert.deepEqual(count.c?.length, 1);
			assert.deepEqual(log, [0, 1, 2, 3]);
		};
	});

	// outside of test function so that they are unowned signals
	let count = $.source(0);
	let calc = $.derived(() => {
		if ($.get(count) >= 2) {
			return 'limit';
		}
		return $.get(count) * 2;
	});

	test('effect with derived using unowned derived every time', () => {
		const log: Array<number | string> = [];

		const effect = $.user_effect(() => {
			log.push($.get(calc));
		});

		return () => {
			$.flushSync(() => $.set(count, 1));
			$.flushSync(() => $.set(count, 2));
			$.flushSync(() => $.set(count, 3));
			$.flushSync(() => $.set(count, 4));
			$.flushSync(() => $.set(count, 0));
			// Ensure we're not leaking consumers
			assert.deepEqual(count.c?.length, 1);
			assert.deepEqual(log, [0, 2, 'limit', 0]);
			$.destroy_signal(effect);
			// Ensure we're not leaking consumers
			assert.deepEqual(count.c, null);
		};
	});
});
