const Sold = require("sold");
const marked = require("marked");
const Prism = require("prismjs");
const katex = require("katex");
const PurgeCSS = require("purgecss").PurgeCSS;
const fs = require("fs");
const exec = require("child_process").execSync;

const renderer = new marked.Renderer();

const commentRE = /#(\\[^]|[^#])*#/;
Prism.languages.markup.tag.inside["attr-value"].pattern = /=([@$\w.]+|"[^"]*"|'[^']*'|`[^`]*`|\([^)]+\)|\[[^]]+\]|\{[^}]+\})/;
Prism.languages.markup.tag.inside["attr-value"].inside = Prism.languages.javascript;
Prism.languages.javascript.comment.push(commentRE);
Prism.languages.insertBefore("inside", "attr-name", { comment: commentRE }, Prism.languages.markup.tag);
Prism.languages.javascript = Prism.languages.extend("markup", Prism.util.clone(Prism.languages.javascript));

renderer.listitem = text => `<li><p>${text}</p></li>`;

renderer.code = (code, lang, escaped) => {
	if (lang === "js") {
		lang = "javascript";
	}

	if (lang === "math") {
		return katex.renderToString(code, {
			displayMode: true
		});
	} else if (lang in Prism.languages) {
		return `<pre><code>${Prism.highlight(code, Prism.languages[lang], lang)}</code></pre>`;
	} else {
		return `<pre><code>${code}</code></pre>`;
	}
};

renderer.codespan = code => {
	if (code[0] === "$" && code[code.length - 1] === "$") {
		return katex.renderToString(code.slice(1, -1));
	} else {
		return `<code>${code}</code>`;
	}
};

Sold({
	root: __dirname,
	template: "template",
	source: "src",
	destination: "docs",
	feed: {},
	marked: {renderer}
});

new PurgeCSS().purge({
	content: ["docs/*.html"],
	css: ["lib/*.css", "public/css/*.css"],
	whitelistPatterns: [/^theme/, /focus/]
}).then(css => {
	fs.writeFileSync("./docs/css/index.min.css", css.map(file => file.css).join(""));
});

exec("cp -r ./public/* ./docs");
