import { create } from 'zustand'
import type { User, AuthTokens } from '@prism/api-types'

interface AuthState {
  user: User | null
  tokens: AuthTokens | null
  isLoading: boolean
  setAuth: (user: User, tokens: AuthTokens) => void
  clearAuth: () => void
  setLoading: (v: boolean) => void
}

export const useAuthStore = create<AuthState>()((set) => ({
  user: null,
  tokens: null,
  isLoading: true,
  setAuth: (user, tokens) => set({ user, tokens }),
  clearAuth: () => {
    set({ user: null, tokens: null })
    window.prism.auth.clearTokens()
  },
  setLoading: (isLoading) => set({ isLoading }),
}))
