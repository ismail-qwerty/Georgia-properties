/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Primary Teal - Main brand color
        primary: {
          DEFAULT: '#0D9488',
          50: '#E6F7F5',
          100: '#CCEFEB',
          200: '#99DFD7',
          300: '#66CFC3',
          400: '#33BFAF',
          500: '#0D9488',
          600: '#0A766D',
          700: '#085952',
          800: '#053B37',
          900: '#031E1C',
        },
        // Solid Green - Success, active states, generate buttons
        green: {
          DEFAULT: '#16A34A',
          50: '#E8F7ED',
          100: '#D1EFDB',
          200: '#A3DFB7',
          300: '#75CF93',
          400: '#47BF6F',
          500: '#16A34A',
          600: '#12823B',
          700: '#0D622C',
          800: '#09411E',
          900: '#04210F',
        },
        // Action Blue - Primary buttons, links, CTAs
        blue: {
          DEFAULT: '#2563EB',
          50: '#EBF2FE',
          100: '#D7E5FD',
          200: '#AFCBFB',
          300: '#87B1F9',
          400: '#5F97F7',
          500: '#2563EB',
          600: '#1E4FBC',
          700: '#163B8D',
          800: '#0F285E',
          900: '#07142F',
        },
        // Sidebar Dark - Admin panel, dark backgrounds
        sidebar: {
          DEFAULT: '#1A1F1A',
          50: '#E8E9E8',
          100: '#D1D3D1',
          200: '#A3A7A3',
          300: '#757B75',
          400: '#474F47',
          500: '#1A1F1A',
          600: '#151915',
          700: '#101310',
          800: '#0A0C0A',
          900: '#050605',
        },
        // Additional system colors
        teal: {
          DEFAULT: '#0D9488',
          light: '#14B8A6',
          dark: '#0F766E',
        },
      },
      fontFamily: {
        sans: ['Montserrat', 'Nunito Sans', 'system-ui', 'sans-serif'],
      },
      spacing: {
        '128': '32rem',
        '144': '36rem',
      },
      borderRadius: {
        '4xl': '2rem',
      },
    },
  },
  plugins: [],
}
