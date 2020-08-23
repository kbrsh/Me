const Sold = require("sold");
const marked = require("marked");
const exec = require("child_process").execSync;

const renderer = new marked.Renderer();

renderer.listitem = text => `<li><p>${text}</p></li>`;

Sold({
	root: __dirname,
	template: "template",
	source: "src",
	destination: "dist",
	feed: {},
	marked: {renderer}
});

exec("cp -r ./public/* ./dist");
