/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#fef5ee',
          100: '#fce8d7',
          200: '#f9cdae',
          300: '#f4a97b',
          400: '#ee7b46',
          500: '#e95823',
          600: '#da3f19',
          700: '#b42e17',
          800: '#90261a',
          900: '#742318',
        },
        dark: {
          50: '#f7f7f8',
          100: '#ececf0',
          200: '#d5d5dc',
          300: '#b1b1bd',
          400: '#888898',
          500: '#6a6a7d',
          600: '#555566',
          700: '#464653',
          800: '#3c3c47',
          900: '#35353f',
          950: '#18181b',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      animation: {
        'gradient': 'gradient 8s linear infinite',
        'float': 'float 6s ease-in-out infinite',
      },
      keyframes: {
        gradient: {
          '0%, 100%': {
            'background-size': '200% 200%',
            'background-position': 'left center',
          },
          '50%': {
            'background-size': '200% 200%',
            'background-position': 'right center',
          },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-20px)' },
        },
      },
    },
  },
  plugins: [],
}