import { get_docs_data, get_docs_list } from '$lib/server/docs/get-docs';

export const prerender = true;

export function load() {
	return {
		sections: get_docs_list(get_docs_data())
	};
}
