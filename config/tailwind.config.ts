import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}'
  ],
  theme: {
    extend: {
      colors: {
        // Design System Colors
        dark: {
          50: '#F4F4F4',    // Off-white
          100: '#E8E8E8',
          200: '#D1D1D1',
          300: '#BFBFBF',
          400: '#A0A0A0',
          500: '#808080',
          600: '#595959',
          700: '#404040',
          800: '#262626',
          900: '#0F0F0F',
          950: '#0A0A0A'    // Deep black
        },
        accent: {
          50: '#FFF5F0',
          100: '#FFE4D6',
          200: '#FFB8A3',
          300: '#FF8C6F',
          400: '#FF7043',
          500: '#FF6B00',   // Électric Orange
          600: '#E55A00',
          700: '#CC5000',
          800: '#B24600',
          900: '#993C00',
          950: '#661E00'
        }
      },
      typography: {
        DEFAULT: {
          css: {
            color: '#F4F4F4',
            a: {
              color: '#FF6B00',
              '&:hover': {
                color: '#E55A00'
              }
            },
            strong: {
              color: '#F4F4F4'
            },
            'code::before': {
              content: '""'
            },
            'code::after': {
              content: '""'
            },
            code: {
              color: '#FF6B00',
              backgroundColor: '#1A1A1A',
              padding: '2px 6px',
              borderRadius: '3px'
            },
            'thead th': {
              color: '#F4F4F4',
              borderBottomColor: '#404040'
            },
            'tbody td': {
              borderBottomColor: '#262626'
            }
          }
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace']
      },
      fontSize: {
        '2xl': ['24px', { lineHeight: '32px', letterSpacing: '-0.02em' }],
        '3xl': ['30px', { lineHeight: '36px', letterSpacing: '-0.02em' }],
        '4xl': ['36px', { lineHeight: '40px', letterSpacing: '-0.03em' }],
        '5xl': ['48px', { lineHeight: '56px', letterSpacing: '-0.03em' }],
        '6xl': ['60px', { lineHeight: '68px', letterSpacing: '-0.03em' }]
      },
      borderRadius: {
        none: '0px',
        sm: '4px',
        base: '6px',
        md: '8px',
        lg: '12px',
        xl: '16px',
        full: '999px'
      },
      spacing: {
        px: '1px',
        0: '0',
        1: '4px',
        2: '8px',
        3: '12px',
        4: '16px',
        6: '24px',
        8: '32px',
        12: '48px',
        16: '64px',
        20: '80px',
        24: '96px',
        32: '128px'
      },
      transitionDuration: {
        150: '150ms',
        300: '300ms',
        500: '500ms'
      }
    }
  },
  plugins: [require('@tailwindcss/typography')]
};

export default config;
