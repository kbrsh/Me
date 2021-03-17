const spacing = {}
const colors = {
	'gray': {h: 0, s: 0}
}
const tri = n => n * (n + 1) / 2

for (let i = 0; i < 49; i++) {
	spacing[i] = `calc(${tri(i)}px*var(--grain-scale))`
}

for (const color in colors) {
	const parts = colors[color]
	const variants = colors[color] = {}

	for (let i = 0; i < 49; i++) {
		variants[i] = `hsl(${parts.h}, ${parts.s*100}%, ${i/49*100}%)`
	}
}

module.exports = {
	purge: ["./docs/*.html"],
	darkMode: false,
	theme: {
		spacing,
		colors,
		fontSize: spacing,
		extend: {}
	},
	variants: {
		extend: {}
	},
	plugins: []
}
