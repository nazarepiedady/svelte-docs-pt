import './ambient';

export {
	onMount,
	onDestroy,
	beforeUpdate,
	afterUpdate,
	setContext,
	getContext,
	getAllContexts,
	hasContext,
	tick,
	createEventDispatcher,
	SvelteComponentDev as SvelteComponent,
	SvelteComponentTyped
} from './internal';
export type {
	ComponentType,
	ComponentConstructorOptions,
	ComponentProps,
	ComponentEvents
} from './internal';
