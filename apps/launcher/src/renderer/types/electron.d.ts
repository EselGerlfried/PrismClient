import type { AuthTokens } from '@prism/api-types'

interface PrismBridge {
  auth: {
    getTokens: () => Promise<AuthTokens | null>
    saveTokens: (tokens: AuthTokens) => Promise<void>
    clearTokens: () => Promise<void>
    startLogin: () => Promise<import('@prism/api-types').AuthResponse>
  }
  minecraft: {
    launch: (profileId: string) => Promise<{ ok: boolean; error?: string }>
    getVersions: () => Promise<string[]>
    isRunning: () => Promise<boolean>
    kill: () => Promise<void>
  }
  updater: {
    checkForUpdates: () => Promise<void>
    onUpdateAvailable: (cb: (info: unknown) => void) => void
    onUpdateProgress: (cb: (progress: { percent: number }) => void) => void
  }
  system: {
    getVersion: () => Promise<string>
    minimize: () => Promise<void>
    maximize: () => Promise<void>
    close: () => Promise<void>
    openExternal: (url: string) => Promise<void>
  }
}

declare global {
  interface Window {
    prism: PrismBridge
  }
}

export {}
