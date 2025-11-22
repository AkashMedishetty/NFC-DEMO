export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      colors: {
        primary: {
          dark: '#0A0E27',
          medium: '#1E293B',
          light: '#3B82F6',
        }
      }
    },
  },
  plugins: [],
}
