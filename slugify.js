const slugify = require('slugify');

slugify.extend({
	'&': 'and',
	'–': '-',
	'—': '-',
	'_': '-',
	'=': '-',
});

const slugOpts = {
	remove: /[*+~.,()'"‘“”’!:;@?#]/g, // regex to remove characters
	lower: true, // result in lower case
};

module.exports = (str = '') => slugify(str, slugOpts);
