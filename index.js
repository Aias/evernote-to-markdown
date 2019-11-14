const toMarkdown = require('./toMarkdown');

const testHtml = `
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html><head><meta http-equiv="Content-Type" content="text/html; charset=UTF-8"/><meta name="exporter-version" content="Evernote Mac 7.13 (458080)"/><meta name="altitude" content="408.9852600097656"/><meta name="author" content="Nick Trombley"/><meta name="created" content="2019-11-14 17:10:50 +0000"/><meta name="latitude" content="44.762939453125"/><meta name="longitude" content="-73.61595619003474"/><meta name="source" content="desktop.mac"/><meta name="updated" content="2019-11-14 17:13:46 +0000"/><title>Test Export</title></head><body><div>A heading</div><div><br/></div><ul><li><div>A list</div></li><li><div>List item two</div></li><li><div>List item three</div></li></ul><div><br/></div><ol><li><div>A numbered list</div></li><li><div>List item two</div></li><li><div>List item three</div></li></ol><div><br/></div><div><span style="font-style: italic;">This sentence is italic.</span></div><div><br/></div><div><span style="font-weight: bold;">This sentence is bold.</span></div><div><br/></div><div><span style="font-style: italic; font-weight: bold;">This sentence is both italic and bold.</span></div><div><br/></div><div><br/></div><div>This sentence</div><div>Is split</div><div>Between many lines</div><div>And should make</div><div>New paragraphs</div><div><br/></div><div>This is a sentence with <i>italic parts</i> and <b>bold parts</b> and also <b><i>italic and bold</i></b> parts.</div></body></html>`;

const markdown = toMarkdown(testHtml);

console.log(markdown);
