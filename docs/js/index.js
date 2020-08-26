var themes = ["light", "dark", "topography", "image"];
var themeIndex = 0;
var html = document.documentElement;
var logo = document.getElementById("logo");

function updateTheme() {
	var theme = themes[themeIndex];

	switch (theme) {
		case "light": {
			html.className = "theme-light";
			logo.src = "/images/light-logo.svg";
			document.getElementById("favicon").href = "/images/favicon-dark.png";
			break;
		}
		case "dark": {
			html.className = "theme-dark";
			logo.src = "/images/dark-logo.svg";
			document.getElementById("favicon").href = "/images/favicon-light.png";
			break;
		}
		case "topography": {
			html.className = "theme-topography";
			logo.src = "/images/topography-logo.svg";
			document.getElementById("favicon").href = "/images/favicon-light.png";
			break;
		}
		case "image": {
			html.className = "theme-image";
			logo.src = "/images/image-logo.svg";
			document.getElementById("favicon").href = "/images/favicon-light.png";
			break;
		}
	}
}

if (matchMedia("(prefers-color-scheme: dark)").matches) {
	themeIndex = 1;
	updateTheme();
} else {
	themeIndex = 0;
	updateTheme();
}

window.addEventListener("keydown", function(event) {
	if (event.key === "t") {
		themeIndex = (themeIndex + 1) % themes.length;
		updateTheme();
	}
});
