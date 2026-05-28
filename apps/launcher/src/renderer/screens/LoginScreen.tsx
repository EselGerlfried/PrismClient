import React, { useState } from 'react'
import { GlassPanel, GlassButton } from '@prism/design-system'
import { MeshBackground } from '../components/MeshBackground.js'
import { useAuthStore } from '../store/auth.js'
import { useProfilesStore } from '../store/profiles.js'
import { apiFetch } from '../api/client.js'
import type { LauncherProfile } from '@prism/api-types'

export function LoginScreen() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const { setAuth } = useAuthStore()
  const { setProfiles, setActiveProfile } = useProfilesStore()

  async function handleLogin() {
    setLoading(true)
    setError(null)
    try {
      const data = await window.prism.auth.startLogin()
      // Save tokens to disk
      await window.prism.auth.saveTokens(data.tokens)
      // Load profiles
      const profs = await apiFetch<LauncherProfile[]>('/api/profiles', undefined, data.tokens.accessToken)
      setProfiles(profs)
      if (profs.length > 0) setActiveProfile(profs[0]!.id)
      // Transition to app — setAuth triggers App re-render
      setAuth(data.user, data.tokens)
    } catch (e) {
      const msg = (e as Error).message
      if (msg === 'Login cancelled') return
      setError(msg.includes('Backend not running')
        ? 'Backend offline — start the API server on port 3001 first.'
        : msg)
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <MeshBackground />
      <div style={{
        position: 'relative', zIndex: 1,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        height: '100vh',
      }}>
        <GlassPanel style={{ padding: '44px 52px', textAlign: 'center', maxWidth: 360 }}>
          <div style={{
            width: 60, height: 60,
            background: 'linear-gradient(135deg, #7c6fff 0%, #a78bfa 100%)',
            borderRadius: 18,
            margin: '0 auto 20px',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 26, color: '#fff',
            boxShadow: '0 8px 24px rgba(124,111,255,0.35)',
          }}>
            ◈
          </div>
          <h1 style={{
            fontSize: 26, fontWeight: 800,
            color: 'var(--prism-text-primary)',
            margin: '0 0 6px',
            letterSpacing: '-0.02em',
          }}>
            PrismClient
          </h1>
          <p style={{
            color: 'var(--prism-text-secondary)',
            fontSize: 13,
            marginBottom: 28,
          }}>
            Premium Minecraft Experience
          </p>
          {loading && (
            <div style={{
              background: 'rgba(124,111,255,0.12)',
              border: '1px solid rgba(124,111,255,0.25)',
              borderRadius: 10,
              padding: '10px 14px',
              color: 'var(--prism-accent)',
              fontSize: 12,
              marginBottom: 18,
            }}>
              Microsoft sign-in window is open — complete login there
            </div>
          )}
          {error && (
            <div style={{
              background: 'rgba(239,68,68,0.12)',
              border: '1px solid rgba(239,68,68,0.25)',
              borderRadius: 10,
              padding: '10px 14px',
              color: '#fca5a5',
              fontSize: 12,
              lineHeight: 1.5,
              marginBottom: 18,
              textAlign: 'left',
            }}>
              {error}
            </div>
          )}
          <GlassButton onClick={handleLogin} disabled={loading} loading={loading} variant="accent">
            {loading ? 'Waiting for Microsoft...' : 'Sign in with Microsoft'}
          </GlassButton>
          <p style={{
            color: 'var(--prism-text-disabled)',
            fontSize: 11, marginTop: 18, lineHeight: 1.5,
          }}>
            Requires a valid Minecraft Java Edition license
          </p>
        </GlassPanel>
      </div>
    </>
  )
}
