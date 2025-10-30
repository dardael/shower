import { createSystem, defaultConfig, defineConfig } from '@chakra-ui/react';
import type { ThemeColorToken } from '@/domain/settings/constants/ThemeColorPalette';

function createDynamicThemeConfig(themeColor: ThemeColorToken) {
  return defineConfig({
    theme: {
      semanticTokens: {
        colors: {
          bg: {
            DEFAULT: {
              value: { _light: '{colors.white}', _dark: '#0a0a0a' },
            },
            subtle: {
              value: { _light: '{colors.gray.50}', _dark: '#171717' },
            },
            muted: {
              value: { _light: '{colors.gray.100}', _dark: '#262626' },
            },
            canvas: {
              value: { _light: '#ffffff', _dark: '#000000' },
            },
          },
          fg: {
            DEFAULT: {
              value: { _light: '{colors.black}', _dark: '#fafafa' },
            },
            muted: {
              value: { _light: '{colors.gray.600}', _dark: '#a3a3a3' },
            },
            subtle: {
              value: { _light: '{colors.gray.500}', _dark: '#737373' },
            },
          },
          border: {
            DEFAULT: {
              value: { _light: '{colors.gray.200}', _dark: '#404040' },
            },
            emphasized: {
              value: { _light: '{colors.gray.300}', _dark: '#525252' },
            },
          },
          // Enhanced color palettes for better dark mode support
          blue: {
            solid: {
              value: { _light: '{colors.blue.600}', _dark: '#0284c7' },
            },
            muted: {
              value: { _light: '{colors.blue.100}', _dark: '#082f49' },
            },
            subtle: {
              value: { _light: '{colors.blue.50}', _dark: '#0c4a6e' },
            },
            fg: {
              value: { _light: '{colors.white}', _dark: '{colors.blue.50}' },
            },
            contrast: {
              value: { _light: '{colors.white}', _dark: '{colors.blue.900}' },
            },
            border: {
              value: { _light: '{colors.blue.200}', _dark: '#0e7490' },
            },
          },
          purple: {
            solid: {
              value: { _light: '{colors.purple.600}', _dark: '#9333ea' },
            },
            muted: {
              value: { _light: '{colors.purple.100}', _dark: '#581c87' },
            },
            subtle: {
              value: { _light: '{colors.purple.50}', _dark: '#6b21a8' },
            },
            fg: {
              value: { _light: '{colors.white}', _dark: '{colors.purple.50}' },
            },
            contrast: {
              value: { _light: '{colors.white}', _dark: '{colors.purple.900}' },
            },
            border: {
              value: { _light: '{colors.purple.200}', _dark: '#7c3aed' },
            },
          },
          red: {
            solid: {
              value: { _light: '{colors.red.600}', _dark: '#dc2626' },
            },
            muted: {
              value: { _light: '{colors.red.100}', _dark: '#7f1d1d' },
            },
            subtle: {
              value: { _light: '{colors.red.50}', _dark: '#991b1b' },
            },
            fg: {
              value: { _light: '{colors.white}', _dark: '{colors.red.50}' },
            },
            contrast: {
              value: { _light: '{colors.white}', _dark: '{colors.red.900}' },
            },
            border: {
              value: { _light: '{colors.red.200}', _dark: '#b91c1c' },
            },
          },
          green: {
            solid: {
              value: { _light: '{colors.green.600}', _dark: '#16a34a' },
            },
            muted: {
              value: { _light: '{colors.green.100}', _dark: '#14532d' },
            },
            subtle: {
              value: { _light: '{colors.green.50}', _dark: '#166534' },
            },
            fg: {
              value: { _light: '{colors.white}', _dark: '{colors.green.50}' },
            },
            contrast: {
              value: { _light: '{colors.white}', _dark: '{colors.green.900}' },
            },
            border: {
              value: { _light: '{colors.green.200}', _dark: '#15803d' },
            },
          },
          orange: {
            solid: {
              value: { _light: '{colors.orange.600}', _dark: '#ea580c' },
            },
            muted: {
              value: { _light: '{colors.orange.100}', _dark: '#7c2d12' },
            },
            subtle: {
              value: { _light: '{colors.orange.50}', _dark: '#9a3412' },
            },
            fg: {
              value: { _light: '{colors.white}', _dark: '{colors.orange.50}' },
            },
            contrast: {
              value: { _light: '{colors.white}', _dark: '{colors.orange.900}' },
            },
            border: {
              value: { _light: '{colors.orange.200}', _dark: '#c2410c' },
            },
          },
          teal: {
            solid: {
              value: { _light: '{colors.teal.600}', _dark: '#0d9488' },
            },
            muted: {
              value: { _light: '{colors.teal.100}', _dark: '#134e4a' },
            },
            subtle: {
              value: { _light: '{colors.teal.50}', _dark: '#164e63' },
            },
            fg: {
              value: { _light: '{colors.white}', _dark: '{colors.teal.50}' },
            },
            contrast: {
              value: { _light: '{colors.white}', _dark: '{colors.teal.900}' },
            },
            border: {
              value: { _light: '{colors.teal.200}', _dark: '#115e59' },
            },
          },
          pink: {
            solid: {
              value: { _light: '{colors.pink.600}', _dark: '#db2777' },
            },
            muted: {
              value: { _light: '{colors.pink.100}', _dark: '#831843' },
            },
            subtle: {
              value: { _light: '{colors.pink.50}', _dark: '#9f1239' },
            },
            fg: {
              value: { _light: '{colors.white}', _dark: '{colors.pink.50}' },
            },
            contrast: {
              value: { _light: '{colors.white}', _dark: '{colors.pink.900}' },
            },
            border: {
              value: { _light: '{colors.pink.200}', _dark: '#be185d' },
            },
          },
          cyan: {
            solid: {
              value: { _light: '{colors.cyan.600}', _dark: '#0891b2' },
            },
            muted: {
              value: { _light: '{colors.cyan.100}', _dark: '#164e63' },
            },
            subtle: {
              value: { _light: '{colors.cyan.50}', _dark: '#164e63' },
            },
            fg: {
              value: { _light: '{colors.white}', _dark: '{colors.cyan.50}' },
            },
            contrast: {
              value: { _light: '{colors.white}', _dark: '{colors.cyan.900}' },
            },
            border: {
              value: { _light: '{colors.cyan.200}', _dark: '#0e7490' },
            },
          },
        },
      },
    },
    globalCss: {
      html: {
        colorPalette: themeColor,
      },
    },
  });
}

export function createDynamicSystem(themeColor: ThemeColorToken = 'blue') {
  const customConfig = createDynamicThemeConfig(themeColor);
  return createSystem(defaultConfig, customConfig);
}

export const system = createDynamicSystem('blue');
