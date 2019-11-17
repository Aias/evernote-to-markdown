const fs = require('fs');
const path = require('path');
const mkdirp = require('mkdirp');
const glob = require('glob');

const getFileName = filePath => path.parse(filePath).name;
const getExtension = path.extname;
const getDirName = path.dirname;
const getRelDir = path.relative;

const toMarkdown = require('./toMarkdown');

const inputDir = path.join(__dirname, '/input');
const outputDir = path.join(__dirname, '/output');

glob(`${inputDir}/**/*.html`, (err, files) => {
	files.forEach(processNote);
});

function processNote(filePath) {
	fs.readFile(filePath, { encoding: 'utf-8' }, function(err, data) {
		if (!err) {
			try {
				const htmlString = data.toString();
				const markdown = toMarkdown(htmlString, filePath);

				const relDir = getDirName(getRelDir(inputDir, filePath));
				const fileName = getFileName(filePath);
				const outputFile = `${outputDir}/${relDir}/${fileName}.md`;

				writeFile(outputFile, markdown, err => {
					if (err) throw err;
					console.log(`Saved ${outputFile} to output.`);
				});
			} catch (e) {
				console.error('Could not parse file: ', filePath);
				console.log(e);
			}
		} else {
			throw err;
		}
	});
}

function writeFile(path, contents, cb) {
	mkdirp(getDirName(path), function(err) {
		if (err) return cb(err);

		fs.writeFile(path, contents, cb);
	});
}
