/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        light: {
          primary: '#3b82f6',
          secondary: '#60a5fa',
          background: '#ffffff',
          text: '#111827',
          border: '#e5e7eb',
          card: '#f3f4f6',
        },
        dark: {
          primary: '#1a1a1a',
          secondary: '#2d2d2d',
          text: '#ffffff',
          card: '#2d2d2d',
        }
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-out',
        'slide-up': 'slideUp 0.5s ease-out',
        'slide-down': 'slideDown 0.5s ease-out',
        'slide-left': 'slideLeft 0.5s ease-out',
        'slide-right': 'slideRight 0.5s ease-out',
        'scale': 'scale 0.5s ease-out',
        'bounce-custom': 'bounce 2s infinite',
        'pulse-custom': 'pulse 2s infinite',
        'spin-custom': 'spin 1s linear infinite',
        'shimmer': 'shimmer 2s infinite linear',
      }
    }
  },
  plugins: [],
} 