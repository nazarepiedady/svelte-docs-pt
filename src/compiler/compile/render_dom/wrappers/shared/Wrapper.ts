import Renderer from '../../Renderer';
import Block from '../../Block';
import { x } from 'code-red';
import { TemplateNode } from '../../../../interfaces';
import { Identifier } from 'estree';

export default class Wrapper {
	renderer: Renderer;
	parent: Wrapper;
	node: TemplateNode;

	prev: Wrapper | null;
	next: Wrapper | null;

	var: Identifier;

	constructor(renderer: Renderer, block: Block, parent: Wrapper, node: TemplateNode) {
		this.node = node;

		// make these non-enumerable so that they can be logged sensibly
		// (TODO in dev only?)
		Object.defineProperties(this, {
			renderer: {
				value: renderer
			},
			parent: {
				value: parent
			}
		});

		block.wrappers.push(this);
	}

	get_or_create_anchor(block: Block, parent_node: Identifier, parent_nodes: Identifier) {
		// TODO use this in EachBlock and IfBlock — tricky because
		// children need to be created first
		const needs_anchor = this.next
			? !this.next.is_dom_node()
			: !parent_node || !this.parent.is_dom_node();
		const anchor = needs_anchor
			? block.get_unique_name(`${this.var.name}_anchor`)
			: (this.next && this.next.var) || { type: 'Identifier', name: 'null' };

		if (needs_anchor) {
			block.add_element(
				anchor,
				x`@empty()`,
				parent_nodes && x`@empty()`,
				parent_node as Identifier
			);
		}

		return anchor;
	}

	get_update_mount_node(anchor: Identifier): Identifier {
		return (
			this.parent && this.parent.is_dom_node() ? this.parent.var : x`${anchor}.parentNode`
		) as Identifier;
	}

	is_dom_node() {
		return (
			this.node.type === 'Element' || this.node.type === 'Text' || this.node.type === 'MustacheTag'
		);
	}

	render(
		_block: Block,
		_parent_node: Identifier,
		_parent_nodes: Identifier,
		_data: Record<string, any> = undefined
	) {
		throw Error('Wrapper class is not renderable');
	}
}
