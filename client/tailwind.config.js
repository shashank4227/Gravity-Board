/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        midnight: '#0B1020',
        surface: '#141A3A',
        elevated: '#1B2250',
        neon: {
           DEFAULT: '#7C7CFF', // Neon Violet
           cyan: '#4FD1C5',    // Soft Cyan
           glow: '#A78BFA',    // Electric Purple
        },
        t: { // Text
           primary: '#E6E8F0',
           secondary: '#A1A6C8',
           disabled: '#6B6F91',
        },
        status: {
           success: '#3DDC97',
           warning: '#FBBF24',
           error: '#F87171',
        }
      },
      backgroundImage: {
        'vortex-gradient': 'radial-gradient(circle at 50% 0%, #1B2250 0%, #0B1020 100%)',
      }
    },
  },
  plugins: [],
}
