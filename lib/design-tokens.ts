// Design Tokens - Modern Minimalist Ocean Blues + Sunset Orange
// Use these constants for programmatic access to design values

export const colors = {
  // Ocean Blues
  ocean: {
    deep: '#0F172A',
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
  
  // Sunset Orange
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
  
  // Neutrals
  neutral: {
    900: '#18181B',
    800: '#27272A',
    700: '#3F3F46',
    600: '#52525B',
    500: '#71717A',
    400: '#A1A1AA',
    300: '#D4D4D8',
    200: '#E4E4E7',
    100: '#F4F4F5',
    50: '#FAFAF9',
  },
  
  // Status
  success: '#10B981',
  error: '#EF4444',
  warning: '#F59E0B',
  info: '#3B82F6',
} as const

export const spacing = {
  1: '0.25rem',   // 4px
  2: '0.5rem',    // 8px
  3: '0.75rem',   // 12px
  4: '1rem',      // 16px
  5: '1.25rem',   // 20px
  6: '1.5rem',    // 24px
  8: '2rem',      // 32px
  10: '2.5rem',   // 40px
  12: '3rem',     // 48px
  16: '4rem',     // 64px
  20: '5rem',     // 80px
  24: '6rem',     // 96px
} as const

export const radius = {
  sm: '0.5rem',     // 8px
  md: '0.75rem',    // 12px
  lg: '1rem',       // 16px
  xl: '1.5rem',     // 24px
  '2xl': '2rem',    // 32px
  full: '9999px',
} as const

export const shadows = {
  xs: '0 1px 2px rgba(15, 23, 42, 0.05)',
  sm: '0 2px 4px rgba(15, 23, 42, 0.06), 0 1px 2px rgba(15, 23, 42, 0.03)',
  md: '0 4px 8px rgba(15, 23, 42, 0.08), 0 2px 4px rgba(15, 23, 42, 0.03)',
  lg: '0 12px 24px rgba(15, 23, 42, 0.12), 0 4px 8px rgba(15, 23, 42, 0.04)',
  xl: '0 20px 40px rgba(15, 23, 42, 0.16), 0 8px 16px rgba(15, 23, 42, 0.06)',
  '2xl': '0 32px 64px rgba(15, 23, 42, 0.2), 0 12px 24px rgba(15, 23, 42, 0.08)',
  glow: '0 0 24px rgba(59, 130, 246, 0.4)',
  glowAccent: '0 0 24px rgba(249, 115, 22, 0.4)',
} as const

export const typography = {
  fontFamily: {
    sans: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', system-ui, sans-serif",
    mono: "'JetBrains Mono', 'Fira Code', 'Courier New', monospace",
  },
  fontSize: {
    xs: '0.75rem',      // 12px
    sm: '0.875rem',     // 14px
    base: '1rem',       // 16px
    lg: '1.125rem',     // 18px
    xl: '1.25rem',      // 20px
    '2xl': '1.5rem',    // 24px
    '3xl': '2rem',      // 32px
    '4xl': '2.5rem',    // 40px
  },
  lineHeight: {
    tight: 1.2,
    normal: 1.5,
    relaxed: 1.75,
  },
  fontWeight: {
    normal: 400,
    medium: 500,
    semibold: 600,
    bold: 700,
  },
} as const

export const transitions = {
  fast: '150ms cubic-bezier(0.4, 0, 0.2, 1)',
  base: '200ms cubic-bezier(0.4, 0, 0.2, 1)',
  slow: '300ms cubic-bezier(0.4, 0, 0.2, 1)',
  bounce: '500ms cubic-bezier(0.34, 1.56, 0.64, 1)',
} as const

export const blur = {
  sm: '8px',
  md: '12px',
  lg: '16px',
  xl: '24px',
} as const

export const breakpoints = {
  sm: '640px',
  md: '768px',
  lg: '1024px',
  xl: '1280px',
  '2xl': '1536px',
} as const

// Framer Motion Variants
export const motionVariants = {
  // Message animations
  messageUser: {
    hidden: { opacity: 0, x: 20, scale: 0.95 },
    visible: { 
      opacity: 1, 
      x: 0, 
      scale: 1,
      transition: { 
        type: 'spring', 
        stiffness: 300, 
        damping: 30 
      }
    }
  },
  
  messageAssistant: {
    hidden: { opacity: 0, x: -20, scale: 0.95 },
    visible: { 
      opacity: 1, 
      x: 0, 
      scale: 1,
      transition: { 
        type: 'spring', 
        stiffness: 300, 
        damping: 30 
      }
    }
  },
  
  // Card animations
  card: {
    hidden: { opacity: 0, y: 20, scale: 0.95 },
    visible: { 
      opacity: 1, 
      y: 0, 
      scale: 1,
      transition: { 
        type: 'spring', 
        stiffness: 300, 
        damping: 30 
      }
    },
    hover: {
      y: -8,
      scale: 1.02,
      transition: { 
        type: 'spring', 
        stiffness: 400, 
        damping: 20 
      }
    }
  },
  
  // Button animations
  button: {
    tap: { scale: 0.95 },
    hover: { scale: 1.05 }
  },
  
  // Stagger container
  staggerContainer: {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.1
      }
    }
  },
  
  // Fade animations
  fadeIn: {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { duration: 0.3 }
    }
  },
  
  // Scale animations
  scaleIn: {
    hidden: { scale: 0, opacity: 0 },
    visible: { 
      scale: 1, 
      opacity: 1,
      transition: { 
        type: 'spring', 
        stiffness: 500, 
        damping: 30 
      }
    }
  }
} as const

// Helper functions
export function getColor(path: string): string {
  const parts = path.split('.')
  let value: any = colors
  
  for (const part of parts) {
    value = value[part]
    if (!value) return '#000000'
  }
  
  return value as string
}

export function withOpacity(color: string, opacity: number): string {
  // Convert hex to rgba
  const hex = color.replace('#', '')
  const r = parseInt(hex.substring(0, 2), 16)
  const g = parseInt(hex.substring(2, 4), 16)
  const b = parseInt(hex.substring(4, 6), 16)
  
  return `rgba(${r}, ${g}, ${b}, ${opacity})`
}
