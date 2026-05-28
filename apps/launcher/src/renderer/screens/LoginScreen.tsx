import React, { useState } from 'react'
import { GlassPanel, GlassButton } from '@prism/design-system'
import { MeshBackground } from '../components/MeshBackground.js'

export function LoginScreen() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleLogin() {
    setLoading(true)
    setError(null)
    try {
      const url = await window.prism.auth.getMsAuthUrl()
      window.prism.system.openExternal(url)
      setError('Complete Microsoft login in your browser — the app will refresh automatically.')
    } catch {
      setError('Failed to start login. Is the backend running on port 3001?')
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
            Sign in with Microsoft
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
