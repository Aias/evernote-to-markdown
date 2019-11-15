# evernote-to-markdown
Converts HTML notes exported from Evernote to plain markdown files, to do with what you will.

## How to use

0. `git clone` this repository & `npm install`
1. From Evernote, right click a note, group of notes, or notebook, and export them to HTML.
2. Save the exported notes to this directory's `input` folder. They can be flat, or nested within subfolders.
3. `npm run go` or `yarn go`. Notes will be converted to `.md` and saved to the `output` folder.
