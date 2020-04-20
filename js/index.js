if (matchMedia("(prefers-color-scheme: dark)").matches) {
	document.getElementById("favicon").href = "/img/favicon-light.png";
} else {
	document.getElementById("favicon").href = "/img/favicon.png";
}
