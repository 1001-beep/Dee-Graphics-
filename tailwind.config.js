/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: '#07070A',
        surface: {
          DEFAULT: '#0F0F15',
          alt: '#13131C',
          glass: 'rgba(15, 15, 21, 0.75)',
        },
        accent: {
          gold: '#D4AF37',
          blue: '#1E40AF',
          cyan: '#06B6D4',
        },
      },
      boxShadow: {
        glass: '0 8px 32px 0 rgba(0, 0, 0, 0.5)',
        'gold-glow': '0 0 25px rgba(212, 175, 55, 0.15)',
      },
    },
  },
  plugins: [],
};
