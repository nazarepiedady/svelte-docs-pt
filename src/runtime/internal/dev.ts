import {
	custom_event,
	append,
	append_hydration,
	insert,
	insert_hydration,
	detach,
	listen,
	attr
} from './dom';
import { SvelteComponent } from './Component';
import { is_void } from '../../shared/utils/names';
import { contenteditable_truthy_values } from './utils';

export function dispatch_dev<T = any>(type: string, detail?: T) {
	document.dispatchEvent(
		custom_event(type, { version: '__VERSION__', ...detail }, { bubbles: true })
	);
}

export function append_dev(target: Node, node: Node) {
	dispatch_dev('SvelteDOMInsert', { target, node });
	append(target, node);
}

export function append_hydration_dev(target: Node, node: Node) {
	dispatch_dev('SvelteDOMInsert', { target, node });
	append_hydration(target, node);
}

export function insert_dev(target: Node, node: Node, anchor?: Node) {
	dispatch_dev('SvelteDOMInsert', { target, node, anchor });
	insert(target, node, anchor);
}

export function insert_hydration_dev(target: Node, node: Node, anchor?: Node) {
	dispatch_dev('SvelteDOMInsert', { target, node, anchor });
	insert_hydration(target, node, anchor);
}

export function detach_dev(node: Node) {
	dispatch_dev('SvelteDOMRemove', { node });
	detach(node);
}

export function detach_between_dev(before: Node, after: Node) {
	while (before.nextSibling && before.nextSibling !== after) {
		detach_dev(before.nextSibling);
	}
}

export function detach_before_dev(after: Node) {
	while (after.previousSibling) {
		detach_dev(after.previousSibling);
	}
}

export function detach_after_dev(before: Node) {
	while (before.nextSibling) {
		detach_dev(before.nextSibling);
	}
}

export function listen_dev(
	node: Node,
	event: string,
	handler: EventListenerOrEventListenerObject,
	options?: boolean | AddEventListenerOptions | EventListenerOptions,
	has_prevent_default?: boolean,
	has_stop_propagation?: boolean,
	has_stop_immediate_propagation?: boolean
) {
	const modifiers =
		options === true ? ['capture'] : options ? Array.from(Object.keys(options)) : [];
	if (has_prevent_default) modifiers.push('preventDefault');
	if (has_stop_propagation) modifiers.push('stopPropagation');
	if (has_stop_immediate_propagation) modifiers.push('stopImmediatePropagation');

	dispatch_dev('SvelteDOMAddEventListener', { node, event, handler, modifiers });

	const dispose = listen(node, event, handler, options);
	return () => {
		dispatch_dev('SvelteDOMRemoveEventListener', { node, event, handler, modifiers });
		dispose();
	};
}

export function attr_dev(node: Element, attribute: string, value?: string) {
	attr(node, attribute, value);

	if (value == null) dispatch_dev('SvelteDOMRemoveAttribute', { node, attribute });
	else dispatch_dev('SvelteDOMSetAttribute', { node, attribute, value });
}

export function prop_dev(node: Element, property: string, value?: any) {
	node[property] = value;

	dispatch_dev('SvelteDOMSetProperty', { node, property, value });
}

export function dataset_dev(node: HTMLElement, property: string, value?: any) {
	node.dataset[property] = value;

	dispatch_dev('SvelteDOMSetDataset', { node, property, value });
}

export function set_data_dev(text: Text, data: unknown) {
	data = '' + data;
	if (text.data === data) return;
	dispatch_dev('SvelteDOMSetData', { node: text, data });
	text.data = data as string;
}

export function set_data_contenteditable_dev(text: Text, data: unknown) {
	data = '' + data;
	if (text.wholeText === data) return;
	dispatch_dev('SvelteDOMSetData', { node: text, data });
	text.data = data as string;
}

export function set_data_maybe_contenteditable_dev(text: Text, data: unknown, attr_value: string) {
	if (~contenteditable_truthy_values.indexOf(attr_value)) {
		set_data_contenteditable_dev(text, data);
	} else {
		set_data_dev(text, data);
	}
}

export function validate_each_argument(arg) {
	if (typeof arg !== 'string' && !(arg && typeof arg === 'object' && 'length' in arg)) {
		let msg = '{#each} only iterates over array-like objects.';
		if (typeof Symbol === 'function' && arg && Symbol.iterator in arg) {
			msg += ' You can use a spread to convert this iterable into an array.';
		}
		throw new Error(msg);
	}
}

export function validate_slots(name, slot, keys) {
	for (const slot_key of Object.keys(slot)) {
		if (!~keys.indexOf(slot_key)) {
			console.warn(`<${name}> received an unexpected slot "${slot_key}".`);
		}
	}
}

export function validate_dynamic_element(tag: unknown) {
	const is_string = typeof tag === 'string';
	if (tag && !is_string) {
		throw new Error('<svelte:element> expects "this" attribute to be a string.');
	}
}

export function validate_void_dynamic_element(tag: undefined | string) {
	if (tag && is_void(tag)) {
		console.warn(`<svelte:element this="${tag}"> is self-closing and cannot have content.`);
	}
}

export function construct_svelte_component_dev(component, props) {
	const error_message = 'this={...} of <svelte:component> should specify a Svelte component.';
	try {
		const instance = new component(props);
		if (!instance.$$ || !instance.$set || !instance.$on || !instance.$destroy) {
			throw new Error(error_message);
		}
		return instance;
	} catch (err) {
		const { message } = err;
		if (typeof message === 'string' && message.indexOf('is not a constructor') !== -1) {
			throw new Error(error_message);
		} else {
			throw err;
		}
	}
}

export interface SvelteComponentDev<
	Props extends Record<string, any> = any,
	Events extends Record<string, any> = any,
	Slots extends Record<string, any> = any // eslint-disable-line @typescript-eslint/no-unused-vars
> {
	$set(props?: Partial<Props>): void;
	$on<K extends Extract<keyof Events, string>>(
		type: K,
		callback: ((e: Events[K]) => void) | null | undefined
	): () => void;
	$destroy(): void;
	[accessor: string]: any;
}

export interface ComponentConstructorOptions<
	Props extends Record<string, any> = Record<string, any>
> {
	target: Element | Document | ShadowRoot;
	anchor?: Element;
	props?: Props;
	context?: Map<any, any>;
	hydrate?: boolean;
	intro?: boolean;
	$$inline?: boolean;
}

/**
 * Base class for Svelte components with some minor dev-enhancements. Used when dev=true.
 *
 * Can be used to create strongly typed Svelte components.
 *
 * ### Example:
 *
 * You have component library on npm called `component-library`, from which
 * you export a component called `MyComponent`. For Svelte+TypeScript users,
 * you want to provide typings. Therefore you create a `index.d.ts`:
 * ```ts
 * import { SvelteComponent } from "svelte";
 * export class MyComponent extends SvelteComponent<{foo: string}> {}
 * ```
 * Typing this makes it possible for IDEs like VS Code with the Svelte extension
 * to provide intellisense and to use the component like this in a Svelte file
 * with TypeScript:
 * ```svelte
 * <script lang="ts">
 * 	import { MyComponent } from "component-library";
 * </script>
 * <MyComponent foo={'bar'} />
 * ```
 */
export class SvelteComponentDev<
	Props extends Record<string, any> = any,
	Events extends Record<string, any> = any,
	Slots extends Record<string, any> = any
> extends SvelteComponent {
	/**
	 * @private
	 * For type checking capabilities only.
	 * Does not exist at runtime.
	 * ### DO NOT USE!
	 */
	$$prop_def: Props;
	/**
	 * @private
	 * For type checking capabilities only.
	 * Does not exist at runtime.
	 * ### DO NOT USE!
	 */
	$$events_def: Events;
	/**
	 * @private
	 * For type checking capabilities only.
	 * Does not exist at runtime.
	 * ### DO NOT USE!
	 */
	$$slot_def: Slots;

	constructor(options: ComponentConstructorOptions<Props>) {
		if (!options || (!options.target && !options.$$inline)) {
			throw new Error("'target' is a required option");
		}

		super();
	}

	$destroy() {
		super.$destroy();
		this.$destroy = () => {
			console.warn('Component was already destroyed'); // eslint-disable-line no-console
		};
	}

	$capture_state() {}

	$inject_state() {}
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface SvelteComponentTyped<
	Props extends Record<string, any> = any,
	Events extends Record<string, any> = any,
	Slots extends Record<string, any> = any
> extends SvelteComponentDev<Props, Events, Slots> {}

/**
 * @deprecated Use `SvelteComponent` instead. See PR for more information: https://github.com/sveltejs/svelte/pull/8512
 */
export class SvelteComponentTyped<
	Props extends Record<string, any> = any,
	Events extends Record<string, any> = any,
	Slots extends Record<string, any> = any
> extends SvelteComponentDev<Props, Events, Slots> {}

/**
 * Convenience type to get the type of a Svelte component. Useful for example in combination with
 * dynamic components using `<svelte:component>`.
 *
 * Example:
 * ```svelte
 * <script lang="ts">
 * 	import type { ComponentType, SvelteComponent } from 'svelte';
 * 	import Component1 from './Component1.svelte';
 * 	import Component2 from './Component2.svelte';
 *
 * 	const component: ComponentType = someLogic() ? Component1 : Component2;
 * 	const componentOfCertainSubType: ComponentType<SvelteComponent<{ needsThisProp: string }>> = someLogic() ? Component1 : Component2;
 * </script>
 *
 * <svelte:component this={component} />
 * <svelte:component this={componentOfCertainSubType} needsThisProp="hello" />
 * ```
 */
export type ComponentType<Component extends SvelteComponentDev = SvelteComponentDev> = (new (
	options: ComponentConstructorOptions<
		Component extends SvelteComponentDev<infer Props> ? Props : Record<string, any>
	>
) => Component) & {
	/** The custom element version of the component. Only present if compiled with the `customElement` compiler option */
	element?: typeof HTMLElement;
};

/**
 * Convenience type to get the props the given component expects. Example:
 * ```svelte
 * <script lang="ts">
 * 	import type { ComponentProps } from 'svelte';
 * 	import Component from './Component.svelte';
 *
 * 	const props: ComponentProps<Component> = { foo: 'bar' }; // Errors if these aren't the correct props
 * </script>
 * ```
 */
export type ComponentProps<Component extends SvelteComponent> =
	Component extends SvelteComponentDev<infer Props> ? Props : never;

/**
 * Convenience type to get the events the given component expects. Example:
 * ```svelte
 * <script lang="ts">
 *    import type { ComponentEvents } from 'svelte';
 *    import Component from './Component.svelte';
 *
 *    function handleCloseEvent(event: ComponentEvents<Component>['close']) {
 *       console.log(event.detail);
 *    }
 * </script>
 *
 * <Component on:close={handleCloseEvent} />
 * ```
 */
export type ComponentEvents<Component extends SvelteComponent> =
	Component extends SvelteComponentDev<any, infer Events> ? Events : never;

export function loop_guard(timeout) {
	const start = Date.now();
	return () => {
		if (Date.now() - start > timeout) {
			throw new Error('Infinite loop detected');
		}
	};
}
