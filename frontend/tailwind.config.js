/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class', // Enable dark mode using class strategy
  theme: {
    extend: {
      colors: {
        // Subtle and classic palette (Slate & Indigo)
        background: {
          light: '#f8fafc', // soft slate-50
          dark: '#0f172a',  // deep slate-900
        },
        surface: {
          light: '#ffffff',
          dark: '#1e293b',  // slate-800
        },
        primary: {
          light: '#334155', // slate-700
          dark: '#f1f5f9',  // slate-100
        },
        secondary: {
          light: '#64748b', // slate-500
          dark: '#94a3b8',  // slate-400
        },
        accent: {
          light: '#4f46e5', // classic indigo-600
          dark: '#818cf8',  // soft indigo-400
        }
      }
    },
  },
  plugins: [],
}
