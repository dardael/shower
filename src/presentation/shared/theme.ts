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
              value: { _light: '{colors.red.900}', _dark: '{colors.red.900}' },
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
              value: {
                _light: '{colors.orange.900}',
                _dark: '{colors.orange.900}',
              },
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
              value: {
                _light: '{colors.teal.900}',
                _dark: '{colors.teal.900}',
              },
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
              value: {
                _light: '{colors.pink.900}',
                _dark: '{colors.pink.900}',
              },
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
              value: {
                _light: '{colors.cyan.900}',
                _dark: '{colors.cyan.900}',
              },
            },
            border: {
              value: { _light: '{colors.cyan.200}', _dark: '#0e7490' },
            },
          },
          beige: {
            solid: {
              value: { _light: '#cdb99d', _dark: '#a89070' },
            },
            muted: {
              value: { _light: '#e8dfd3', _dark: '#4a4235' },
            },
            subtle: {
              value: { _light: '#f5f0e8', _dark: '#3d3830' },
            },
            emphasized: {
              value: { _light: '#b8a48a', _dark: '#8a7560' },
            },
            fg: {
              value: { _light: '#3d3830', _dark: '#f5f0e8' },
            },
            contrast: {
              value: { _light: '#ffffff', _dark: '#1a1815' },
            },
            border: {
              value: { _light: '#d4c4a8', _dark: '#6b5d4a' },
            },
          },
          cream: {
            solid: {
              value: { _light: '#ede6dd', _dark: '#3d3830' },
            },
            muted: {
              value: { _light: '#f5f0e8', _dark: '#2d2a25' },
            },
            subtle: {
              value: { _light: '#faf8f5', _dark: '#252320' },
            },
            emphasized: {
              value: { _light: '#d9d0c3', _dark: '#4a4540' },
            },
            fg: {
              value: { _light: '#3d3830', _dark: '#f5f0e8' },
            },
            contrast: {
              value: { _light: '#1a1815', _dark: '#faf8f5' },
            },
            border: {
              value: { _light: '#e0d6c8', _dark: '#4a4540' },
            },
          },
          gold: {
            solid: {
              value: { _light: '#eeb252', _dark: '#8b6914' },
            },
            muted: {
              value: { _light: '#f9e4b8', _dark: '#4a3810' },
            },
            subtle: {
              value: { _light: '#fdf3dc', _dark: '#3d2f0d' },
            },
            emphasized: {
              value: { _light: '#d9a043', _dark: '#a87d1a' },
            },
            fg: {
              value: { _light: '#3d2f0d', _dark: '#fdf3dc' },
            },
            contrast: {
              value: { _light: '#1a1408', _dark: '#fdf3dc' },
            },
            border: {
              value: { _light: '#e6c57a', _dark: '#6b5212' },
            },
          },
          sand: {
            solid: {
              value: { _light: '#f2e8de', _dark: '#4a4238' },
            },
            muted: {
              value: { _light: '#f8f3ec', _dark: '#3a342c' },
            },
            subtle: {
              value: { _light: '#fcf9f5', _dark: '#2d2924' },
            },
            emphasized: {
              value: { _light: '#e5d8c8', _dark: '#5c5245' },
            },
            fg: {
              value: { _light: '#3d3830', _dark: '#f8f3ec' },
            },
            contrast: {
              value: { _light: '#1a1815', _dark: '#fcf9f5' },
            },
            border: {
              value: { _light: '#e8dcd0', _dark: '#4f463a' },
            },
          },
          taupe: {
            solid: {
              value: { _light: '#e2cbac', _dark: '#5c4d3a' },
            },
            muted: {
              value: { _light: '#f0e4d4', _dark: '#4a3f30' },
            },
            subtle: {
              value: { _light: '#f7f1e8', _dark: '#3a3228' },
            },
            emphasized: {
              value: { _light: '#d4bc98', _dark: '#6e5c45' },
            },
            fg: {
              value: { _light: '#3a3228', _dark: '#f7f1e8' },
            },
            contrast: {
              value: { _light: '#1a1612', _dark: '#f7f1e8' },
            },
            border: {
              value: { _light: '#ddd0b8', _dark: '#5a4c3c' },
            },
          },
          white: {
            solid: {
              value: { _light: '#ffffff', _dark: '#1a1a1a' },
            },
            muted: {
              value: { _light: '#fafafa', _dark: '#262626' },
            },
            subtle: {
              value: { _light: '#f5f5f5', _dark: '#2d2d2d' },
            },
            emphasized: {
              value: { _light: '#e8e8e8', _dark: '#404040' },
            },
            fg: {
              value: { _light: '#1a1a1a', _dark: '#fafafa' },
            },
            contrast: {
              value: { _light: '#000000', _dark: '#ffffff' },
            },
            border: {
              value: { _light: '#e0e0e0', _dark: '#383838' },
            },
          },
        },
      },
    },
    globalCss: {
      html: {
        colorPalette: themeColor,
      },
      body: {
        fontFamily: 'var(--website-font, system-ui, sans-serif)',
      },
    },
  });
}

export function createDynamicSystem(themeColor: ThemeColorToken = 'blue') {
  const customConfig = createDynamicThemeConfig(themeColor);
  return createSystem(defaultConfig, customConfig);
}

export const system = createDynamicSystem('blue');
