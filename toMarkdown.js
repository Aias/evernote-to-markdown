const TurndownService = require('turndown');
const jsdom = require('jsdom');

const { JSDOM } = jsdom;

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
}).addRule('divs', {
	filter: 'div',
	replacement: function(content, node, options) {
		return content + (node.nextElementSibling ? '\r\n' : '');
	},
});

function toMarkDown(htmlString) {
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

	const body = document.querySelector('body');
	const bodyMarkdown = converter.turndown(body);

	return trimWhiteSpace(bodyMarkdown);
}

function trimWhiteSpace(markdownString) {
	const completelyBlankLine = /^[\r\n]/gm;
	const justWhiteSpace = /^\s*[\r\n]/gm;

	return markdownString
		.replace(completelyBlankLine, '')
		.replace(justWhiteSpace, '\r\n');
}

module.exports = toMarkDown;
