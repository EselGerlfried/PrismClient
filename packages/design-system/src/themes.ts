import { darkTheme, whiteTheme, type ThemeTokens } from './tokens.js';

export type ThemeId = 'dark' | 'white' | 'custom';

export interface ThemeConfig {
  id: ThemeId;
  label: string;
  tokens: ThemeTokens;
}

export const themes: Record<ThemeId, ThemeConfig> = {
  dark: {
    id: 'dark',
    label: 'Dark',
    tokens: darkTheme,
  },
  white: {
    id: 'white',
    label: 'White',
    tokens: whiteTheme,
  },
  custom: {
    id: 'custom',
    label: 'Custom',
    tokens: darkTheme, // user overrides individual token values
  },
};

export function getTheme(id: ThemeId): ThemeConfig {
  return themes[id];
}
