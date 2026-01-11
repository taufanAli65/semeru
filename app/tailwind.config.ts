import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/features/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Palette "Semeru" (Teal/Dark Cyan based on design)
        semeru: {
          50: '#f0fdfa',  // Background tipis
          100: '#ccfbf1',
          200: '#99f6e4',
          300: '#5eead4',
          400: '#2dd4bf',
          500: '#14b8a6', // Primary standar
          600: '#0d9488',
          700: '#0f766e', // Warna button/text header
          800: '#0d6e6e', // Warna background sisi kiri login (Dark) - Updated to match design
          900: '#0a5555', // Hover state gelap - Updated to match design
          950: '#012024',
        },
        // Warna pendukung untuk alert/status
        status: {
          success: '#22c55e',
          error: '#ef4444',
          warning: '#f59e0b',
          info: '#3b82f6',
        }
      },
      fontFamily: {
        // Pastikan font Inter diload di layout.tsx
        sans: ['var(--font-inter)', 'sans-serif'], 
      },
      backgroundImage: {
        'login-pattern': "url('/patterns/login-bg.svg')", // Jika pakai asset
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
      },
    },
  },
  plugins: [],
};

export default config;