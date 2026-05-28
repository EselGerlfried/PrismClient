export const darkTheme = {
  bg: '#07070f',
  bgSecondary: '#0e0e1a',
  glass: 'rgba(255, 255, 255, 0.06)',
  glassBorder: 'rgba(255, 255, 255, 0.14)',
  glassInner: 'rgba(255, 255, 255, 0.15)',
  accent: '#7c6fff',
  accentLight: '#a78bfa',
  textPrimary: '#ffffff',
  textSecondary: 'rgba(255, 255, 255, 0.6)',
  textDisabled: 'rgba(255, 255, 255, 0.3)',
  blur: '40px',
  blurSm: '20px',
  radius: '20px',
  radiusSm: '12px',
  radiusLg: '28px',
} as const;

export const whiteTheme = {
  bg: '#f4f4f8',
  bgSecondary: '#eaeaf0',
  glass: 'rgba(255, 255, 255, 0.65)',
  glassBorder: 'rgba(0, 0, 0, 0.08)',
  glassInner: 'rgba(255, 255, 255, 0.9)',
  accent: '#6366f1',
  accentLight: '#818cf8',
  textPrimary: '#0a0a0f',
  textSecondary: 'rgba(0, 0, 0, 0.5)',
  textDisabled: 'rgba(0, 0, 0, 0.25)',
  blur: '30px',
  blurSm: '15px',
  radius: '20px',
  radiusSm: '12px',
  radiusLg: '28px',
} as const;

export interface ThemeTokens {
  bg: string;
  bgSecondary: string;
  glass: string;
  glassBorder: string;
  glassInner: string;
  accent: string;
  accentLight: string;
  textPrimary: string;
  textSecondary: string;
  textDisabled: string;
  blur: string;
  blurSm: string;
  radius: string;
  radiusSm: string;
  radiusLg: string;
}

export function cssVarsFromTokens(tokens: ThemeTokens): Record<string, string> {
  return {
    '--prism-bg': tokens.bg,
    '--prism-bg-secondary': tokens.bgSecondary,
    '--prism-glass': tokens.glass,
    '--prism-glass-border': tokens.glassBorder,
    '--prism-glass-inner': tokens.glassInner,
    '--prism-accent': tokens.accent,
    '--prism-accent-light': tokens.accentLight,
    '--prism-text-primary': tokens.textPrimary,
    '--prism-text-secondary': tokens.textSecondary,
    '--prism-text-disabled': tokens.textDisabled,
    '--prism-blur': tokens.blur,
    '--prism-blur-sm': tokens.blurSm,
    '--prism-radius': tokens.radius,
    '--prism-radius-sm': tokens.radiusSm,
    '--prism-radius-lg': tokens.radiusLg,
  };
}
