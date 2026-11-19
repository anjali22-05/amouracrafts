/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        amoura: {
          bg: '#180a08',
          card: '#220e10',
          'card-hover': '#2d1316',
          input: '#150808',
          dark: '#120506',
          'maroon-950': '#210810',
          'maroon-900': '#360d18',
          'maroon-800': '#4a1220',
          gold: '#d4af37',
          'gold-light': '#f4dd8e',
          'gold-dark': '#aa820a',
          marigold: '#e8871e',
          cream: '#f7ead0',
          'cream-dim': '#e7d6b3',
          ember: '#b5233b',
          line: 'rgba(244, 221, 142, 0.18)',
          'line-strong': 'rgba(212, 175, 55, 0.45)',
          muted: '#a89484',
          subtext: '#d6c6b8',
        }
      },
      fontFamily: {
        display: ['Marcellus', 'Cinzel', 'serif'],
        body: ['Poppins', 'sans-serif'],
        serif: ['Marcellus', 'Cinzel', 'serif'],
        sans: ['Poppins', 'sans-serif'],
      },
      boxShadow: {
        'gold-glow': '0 0 25px rgba(212, 175, 55, 0.25)',
        'gold-glow-lg': '0 0 40px rgba(212, 175, 55, 0.4)',
        'card': '0 10px 30px rgba(0, 0, 0, 0.5)',
      },
      backgroundImage: {
        'gold-gradient': 'linear-gradient(135deg, #d4af37 0%, #f4dd8e 50%, #c96a12 100%)',
        'gold-btn': 'linear-gradient(135deg, #d4af37 0%, #f4dd8e 100%)',
        'maroon-radial': 'radial-gradient(ellipse at top, #360d18 0%, #180a08 75%)',
        'hero-pattern': 'radial-gradient(circle at 50% 20%, rgba(212, 175, 55, 0.12) 0%, transparent 60%)',
      }
    },
  },
  plugins: [],
}
