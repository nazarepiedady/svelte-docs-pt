// @ts-check
import fs from 'node:fs';

const BASE = '../../documentation/content/examples/';

/**
 * @returns {import('./types').ExamplesData}
 */
export function get_examples_data(base = BASE) {
	const examples = [];

	for (const subdir of fs.readdirSync(base)) {
		const section = {
			title: '', // Initialise with empty
			slug: subdir.split('-').slice(1).join('-'),
			examples: []
		};

		if (!(fs.statSync(`${base}/${subdir}`).isDirectory() || subdir.endsWith('meta.json'))) continue;

		if (!subdir.endsWith('meta.json'))
			section.title =
				JSON.parse(fs.readFileSync(`${base}/${subdir}/meta.json`, 'utf-8')).title ?? 'Embeds';

		for (const section_dir of fs.readdirSync(`${base}/${subdir}`)) {
			const match = /\d{2}-(.+)/.exec(section_dir);
			if (!match) continue;

			const slug = match[1];

			const example_base_dir = `${base}/${subdir}/${section_dir}`;

			// Get title for
			const example_title = JSON.parse(
				fs.readFileSync(`${example_base_dir}/meta.json`, 'utf-8')
			).title;

			const files = [];
			for (const file of fs
				.readdirSync(example_base_dir)
				.filter((file) => !file.endsWith('meta.json'))) {
				files.push({
					name: file,
					type: file.split('.').at(-1),
					content: fs.readFileSync(`${example_base_dir}/${file}`, 'utf-8')
				});
			}

			section.examples.push({ title: example_title, slug, files });
		}

		examples.push(section);
	}

	return examples;
}

/**
 * @param {import('./types').ExamplesData} examples_data
 * @returns {import('./types').ExamplesList}
 */
export function get_examples_list(examples_data) {
	return examples_data.map((section) => ({
		title: section.title,
		examples: section.examples.map((example) => ({
			title: example.title,
			slug: example.slug
		}))
	}));
}
