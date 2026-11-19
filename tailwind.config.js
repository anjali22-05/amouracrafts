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
          ivory: '#F8F5EF',       // Primary background canvas
          cream: '#EFE8DC',       // Surface, cards, subtle alternating bands
          sage: '#89977C',        // Botanical accents, secondary buttons, tags
          'sage-light': '#D6DDCF',
          'sage-dark': '#68775B',
          forest: '#344638',      // Primary brand accent, primary CTA, dark headers
          'forest-dark': '#243227',
          terracotta: '#C47D5A',  // Warm highlights, bestsellers, focus tags
          'terracotta-light': '#E8BEA9',
          charcoal: '#292B28',    // Primary typography ink, crisp contrast
          muted: '#6E726B',       // Subtitle and meta text
          border: 'rgba(52, 70, 56, 0.12)', // Subtle natural border
          'border-strong': 'rgba(52, 70, 56, 0.28)',
          white: '#FFFFFF',       // Elevated cards, modals, popovers
        }
      },
      fontFamily: {
        serif: ['"Cormorant Garamond"', 'Marcellus', 'Georgia', 'serif'],
        sans: ['"Plus Jakarta Sans"', 'Inter', '-apple-system', 'BlinkMacSystemFont', 'sans-serif'],
      },
      boxShadow: {
        'soft': '0 4px 20px -2px rgba(41, 43, 40, 0.05), 0 2px 6px -1px rgba(41, 43, 40, 0.03)',
        'elevated': '0 12px 32px -4px rgba(41, 43, 40, 0.08), 0 4px 12px -2px rgba(41, 43, 40, 0.04)',
        'modal': '0 24px 48px -8px rgba(41, 43, 40, 0.16)',
      },
      borderRadius: {
        '2xl': '1rem',
        '3xl': '1.5rem',
      }
    },
  },
  plugins: [],
}
