export function getThemeColorShade(colorName: string, shade: string): string {
  const shadeMap: Record<string, Record<string, string>> = {
    sand: {
      '50': 'sand.subtle',
      '100': 'sand.muted',
      '200': 'sand.muted',
      '500': 'sand.solid',
      '600': 'sand.solid',
      '700': 'sand.emphasized',
    },
    beige: {
      '50': 'beige.subtle',
      '100': 'beige.muted',
      '200': 'beige.muted',
      '500': 'beige.solid',
      '600': 'beige.solid',
      '700': 'beige.emphasized',
    },
    cream: {
      '50': 'cream.subtle',
      '100': 'cream.muted',
      '200': 'cream.muted',
      '500': 'cream.solid',
      '600': 'cream.solid',
      '700': 'cream.emphasized',
    },
    gold: {
      '50': 'gold.subtle',
      '100': 'gold.muted',
      '200': 'gold.muted',
      '500': 'gold.solid',
      '600': 'gold.solid',
      '700': 'gold.emphasized',
    },
    taupe: {
      '50': 'taupe.subtle',
      '100': 'taupe.muted',
      '200': 'taupe.muted',
      '500': 'taupe.solid',
      '600': 'taupe.solid',
      '700': 'taupe.emphasized',
    },
    white: {
      '50': 'white.subtle',
      '100': 'white.muted',
      '200': 'white.muted',
      '500': 'white.solid',
      '600': 'white.solid',
      '700': 'white.emphasized',
    },
  };

  if (shadeMap[colorName]?.[shade]) {
    return shadeMap[colorName][shade];
  }

  return `${colorName}.${shade}`;
}
