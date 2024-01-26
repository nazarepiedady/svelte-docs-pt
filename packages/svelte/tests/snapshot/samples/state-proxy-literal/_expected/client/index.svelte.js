// index.svelte (Svelte VERSION)
// Note: compiler output will change before 5.0 is released!
import "svelte/internal/disclose-version";
import * as $ from "svelte/internal";

function reset(_, str, tpl) {
	$.set(str, '');
	$.set(str, ``);
	$.set(tpl, '');
	$.set(tpl, ``);
}

var frag = $.template(`<input> <input> <button>reset</button>`, true);

export default function State_proxy_literal($$anchor, $$props) {
	$.push($$props, true);

	let str = $.source('');
	let tpl = $.source(``);
	/* Init */
	var fragment = $.open_frag($$anchor, true, frag);
	var node = $.child_frag(fragment);

	$.remove_input_attr_defaults(node);

	var input = $.sibling($.sibling(node));

	$.remove_input_attr_defaults(input);

	var button = $.sibling($.sibling(input));

	$.bind_value(node, () => $.get(str), ($$value) => $.set(str, $$value));
	$.bind_value(input, () => $.get(tpl), ($$value) => $.set(tpl, $$value));
	button.__click = [reset, str, tpl];
	$.close_frag($$anchor, fragment);
	$.pop();
}

$.delegate(["click"]);