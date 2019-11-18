const TurndownService = require('turndown');
const jsdom = require('jsdom');

const { JSDOM } = jsdom;
const NEWLINE = '\r\n';

const converter = new TurndownService({
	headingStyle: 'atx',
	bulletListMarker: '-',
	codeBlockStyle: 'fenced',
	emDelimiter: '*',
	strongDelimiter: '__',
	linkStyle: 'referenced',
	blankReplacement: function(content) {
		return '';
	},
})
	.addRule('divs', {
		filter: 'div',
		replacement: function(content, node, options) {
			return content + (node.nextElementSibling ? NEWLINE : '');
		},
	})
	.addRule('headings', {
		filter: ['h1', 'h2', 'h3', 'h4', 'h5', 'h6'],
		replacement: function(content, node, options) {
			const headerLevel = Number(node.nodeName.substr(1));
			let hashes = '';
			for (let i = 1; i <= headerLevel; i++) {
				hashes += '#';
			}

			return `${hashes} ${content}${NEWLINE}  ${NEWLINE}`;
		},
	});

function toMarkDown(htmlString = '', includeMeta = true) {
	const dom = new JSDOM(htmlString);
	const document = dom.window.document;

	const spans = document.querySelectorAll('span');
	for (let i = 0; i < spans.length; i++) {
		let span = spans[i];

		const fontStyle = span.style.fontStyle;
		const fontWeight = span.style.fontWeight;

		if (fontStyle === 'italic') {
			const em = document.createElement('em');
			em.innerHTML = span.innerHTML;
			span.innerHTML = em.outerHTML;
		}
		if (fontWeight === 'bold') {
			const strong = document.createElement('strong');
			strong.innerHTML = span.innerHTML;
			span.innerHTML = strong.outerHTML;
		}
	}

	let meta = {
		title: document.querySelector('title')
			? document.querySelector('title').innerHTML
			: 'Untitled',
	};
	document.querySelectorAll('meta[name]').forEach(el => {
		meta[el.getAttribute('name')] = el.getAttribute('content');
	});

	const body = document.querySelector('body');
	let markdown = trimWhiteSpace(converter.turndown(body));
	// TODO: Figure out a way to add an extra newline
	// between the main markdown content and the start of the reference-style links.
	// Without it, I've seen bugs with certain markdown renderers (like github),
	// that don't display the links properly.

	if (includeMeta) {
		markdown =
			`---${NEWLINE}` +
			(meta.title ? `title: ${meta.title + NEWLINE}` : '') +
			// TODO: Remove +0000 from end of these dates.
			(meta.created ? `date: ${meta.created + NEWLINE}` : '') +
			(meta.updated ? `updated: ${meta.updated + NEWLINE}` : '') +
			(meta.author && meta.author !== 'Nick Trombley'
				? `author: ${meta.author + NEWLINE}`
				: '') +
			(meta['source-url']
				? `source: ${meta['source-url'] + NEWLINE}`
				: '') +
			(meta.altitude ? `altitude: ${meta.altitude + NEWLINE}` : '') +
			(meta.latitude ? `latitude: ${meta.latitude + NEWLINE}` : '') +
			(meta.longitude ? `longitude: ${meta.longitude + NEWLINE}` : '') +
			(meta.keywords ? `tags:${NEWLINE + makeTags(meta.keywords)}` : '') +
			`---${NEWLINE}` +
			markdown;
	}

	return markdown;
}

function trimWhiteSpace(markdownString = '') {
	const completelyBlankLine = /^[\r\n]/gm;
	const justWhiteSpace = /^\s*[\r\n]/gm;

	return markdownString
		.replace(completelyBlankLine, '')
		.replace(justWhiteSpace, NEWLINE);
}

function makeTags(tagString = '') {
	/*
		The "tag #<tag>" format is admittedly kind of ugly.
		I would prefer not to duplicate them.
		But I also plan on using these in iA Writer,
		which has special handling for the # character,
		so I need to include both the unhashed word,
		for YAML compatibility, and the hashed word,
		for my writing tool of choice.
	*/
	return tagString
		.split(',')
		.map(tag => `  - ${tag.trim()} #${tag.trim()}${NEWLINE}`)
		.join('');
}

module.exports = toMarkDown;
