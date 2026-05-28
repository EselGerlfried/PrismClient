import React, { useState, useEffect } from 'react'
import { LoginScreen } from './screens/LoginScreen.js'
import { HomeScreen } from './screens/HomeScreen.js'
import { WardrobeScreen } from './screens/WardrobeScreen.js'
import { ProfilesScreen } from './screens/ProfilesScreen.js'
import { ModBrowserScreen } from './screens/ModBrowserScreen.js'
import { SettingsScreen } from './screens/SettingsScreen.js'
import { Layout, type Screen } from './components/Layout.js'
import { MeshBackground } from './components/MeshBackground.js'
import { useAuthStore } from './store/auth.js'
import { useProfilesStore } from './store/profiles.js'
import { apiFetch } from './api/client.js'
import type { AuthResponse, LauncherProfile } from '@prism/api-types'

export function App() {
  const { user, tokens, isLoading, setAuth, setLoading } = useAuthStore()
  const { setProfiles, setActiveProfile } = useProfilesStore()
  const [screen, setScreen] = useState<Screen>('home')

  useEffect(() => {
    async function restoreSession() {
      try {
        const stored = await window.prism.auth.getTokens()
        if (!stored) return
        const data = await apiFetch<AuthResponse>('/api/auth/me', undefined, stored.accessToken)
        setAuth(data.user, stored)
        const profs = await apiFetch<LauncherProfile[]>('/api/profiles', undefined, stored.accessToken)
        setProfiles(profs)
        if (profs.length > 0) setActiveProfile(profs[0]!.id)
      } catch {
        window.prism.auth.clearTokens()
      } finally {
        setLoading(false)
      }
    }
    restoreSession()
  }, [])

  if (isLoading) {
    return (
      <>
        <MeshBackground />
        <div style={{
          position: 'relative', zIndex: 1,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          height: '100vh',
          color: 'var(--prism-text-secondary)',
          fontSize: 14,
        }}>
          Loading...
        </div>
      </>
    )
  }

  if (!user) return <LoginScreen />

  const SCREENS: Record<Screen, React.ReactNode> = {
    home: <HomeScreen />,
    wardrobe: <WardrobeScreen />,
    profiles: <ProfilesScreen />,
    mods: <ModBrowserScreen />,
    settings: <SettingsScreen />,
  }

  return (
    <>
      <MeshBackground />
      <div style={{ position: 'relative', zIndex: 1, height: '100vh' }}>
        <Layout screen={screen} onNavigate={setScreen}>
          {SCREENS[screen]}
        </Layout>
      </div>
    </>
  )
}
