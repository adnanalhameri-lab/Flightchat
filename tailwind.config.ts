import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Ocean Blues Palette
        ocean: {
          deep: '#0F172A',
          950: '#0F172A',
          900: '#1E293B',
          800: '#1E3A8A',
          700: '#1D4ED8',
          600: '#2563EB',
          500: '#3B82F6',
          400: '#60A5FA',
          300: '#93C5FD',
          200: '#BFDBFE',
          100: '#DBEAFE',
          50: '#EFF6FF',
        },
        // Sunset Orange Palette
        sunset: {
          900: '#7C2D12',
          800: '#9A3412',
          700: '#C2410C',
          600: '#EA580C',
          500: '#F97316',
          400: '#FB923C',
          300: '#FDBA74',
          200: '#FED7AA',
          100: '#FFEDD5',
          50: '#FFF7ED',
        },
        // Semantic colors
        primary: {
          DEFAULT: '#3B82F6',
          hover: '#2563EB',
          light: '#60A5FA',
        },
        accent: {
          DEFAULT: '#F97316',
          hover: '#EA580C',
          light: '#FB923C',
        },
        // Neutrals
        background: '#FAFAF9',
        surface: {
          DEFAULT: '#FFFFFF',
          elevated: '#FFFFFF',
        },
        text: {
          DEFAULT: '#18181B',
          secondary: '#52525B',
          tertiary: '#A1A1AA',
        },
        border: {
          DEFAULT: '#E4E4E7',
          light: '#F4F4F5',
        },
        // Status colors
        success: {
          DEFAULT: '#10B981',
          light: '#D1FAE5',
        },
        error: {
          DEFAULT: '#EF4444',
          light: '#FEE2E2',
        },
        warning: {
          DEFAULT: '#F59E0B',
          light: '#FEF3C7',
        },
        info: {
          DEFAULT: '#3B82F6',
          light: '#EFF6FF',
        },
      },
      backgroundImage: {
        'gradient-ocean': 'linear-gradient(135deg, #0F172A 0%, #1E3A8A 50%, #3B82F6 100%)',
        'gradient-sunset': 'linear-gradient(135deg, #F97316 0%, #FDBA74 100%)',
        'gradient-hero': 'linear-gradient(135deg, #3B82F6 0%, #F97316 100%)',
      },
      boxShadow: {
        'glow': '0 0 24px rgba(59, 130, 246, 0.4)',
        'glow-accent': '0 0 24px rgba(249, 115, 22, 0.4)',
      },
      backdropBlur: {
        xs: '2px',
        sm: '4px',
        md: '12px',
        lg: '24px',
        xl: '40px',
      },
    },
  },
  plugins: [],
};

export default config;
