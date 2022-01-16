const spacing = {}
const tri = n => (n * (n + 1)) / 2

for (let i = 0; i < 49; i++) {
   spacing[i] = `calc(${tri(i)}px*var(--grain-scale))`
}

module.exports = {
   purge: ["./docs/*.html"],
   darkMode: false,
   theme: {
      spacing,
      colors: {
         gray: {
            100: `hsl(0, 0%, 100%)`
         }
      },
      fontSize: spacing,
      extend: {}
   },
   variants: {
      extend: {}
   },
   plugins: []
}
