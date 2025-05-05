/** @type {import('tailwindcss').Config} */
export default {
  mode: 'jit',
  important: true,
  content: ["./src/**/*.{html,js,jsx,ts,tsx}"],
  theme: {
    extend: {},
  },
  darkMode: 'class',
  plugins: [],
  corePlugins: {
    preflight: false
  }
}

