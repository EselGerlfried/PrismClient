import { create } from 'zustand'
import { darkTheme, whiteTheme, cssVarsFromTokens, type ThemeTokens } from '@prism/design-system'

type ThemeId = 'dark' | 'white'

interface ThemeState {
  themeId: ThemeId
  tokens: ThemeTokens
  setTheme: (id: ThemeId) => void
}

function applyTheme(tokens: ThemeTokens) {
  const vars = cssVarsFromTokens(tokens)
  for (const [k, v] of Object.entries(vars)) {
    document.documentElement.style.setProperty(k, v)
  }
}

export const useThemeStore = create<ThemeState>()((set) => ({
  themeId: 'dark',
  tokens: darkTheme,
  setTheme: (themeId) => {
    const tokens = themeId === 'dark' ? darkTheme : whiteTheme
    applyTheme(tokens)
    localStorage.setItem('prism-theme', themeId)
    set({ themeId, tokens })
  },
}))

// Initialize theme CSS vars from localStorage on module load
const saved = localStorage.getItem('prism-theme') as ThemeId | null
applyTheme(saved === 'white' ? whiteTheme : darkTheme)
