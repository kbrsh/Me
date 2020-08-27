var themes = ["light", "dark", "topography", "image"];
var themeIndex = parseInt(localStorage.kabirThemeIndex);
var favicon = document.getElementById("favicon");
var html = document.documentElement;
var logo = document.getElementById("logo");
var isDarkTheme = matchMedia("(prefers-color-scheme: dark)").matches;

function updateTheme() {
	var theme = themes[themeIndex];
	localStorage.kabirThemeIndex = themeIndex;

	switch (theme) {
		case "light": {
			html.className = "theme-light";
			logo.src = "/images/light-logo.svg";
			break;
		}
		case "dark": {
			html.className = "theme-dark";
			logo.src = "/images/dark-logo.svg";
			break;
		}
		case "topography": {
			html.className = "theme-topography";
			logo.src = "/images/topography-logo.svg";
			break;
		}
		case "image": {
			html.className = "theme-image";
			logo.src = "/images/image-logo.svg";
			break;
		}
	}
}

if (isDarkTheme) {
	favicon.href = "/images/favicon-light.png";
} else {
	favicon.href = "/images/favicon-dark.png";
}

if (isNaN(themeIndex)) {
	if (isDarkTheme) {
		themeIndex = 1;
	} else {
		themeIndex = 0;
	}
}

updateTheme();
window.addEventListener("keydown", function(event) {
	if (event.key === "t") {
		themeIndex = (themeIndex + 1) % themes.length;
		updateTheme();
	}
});
