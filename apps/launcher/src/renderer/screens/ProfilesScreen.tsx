import React, { useState } from 'react'
import { GlassPanel, GlassButton, GlassInput, GlassBadge } from '@prism/design-system'
import { useProfilesStore } from '../store/profiles.js'
import { useAuthStore } from '../store/auth.js'
import { apiFetch } from '../api/client.js'
import type { LauncherProfile } from '@prism/api-types'

const LOADER_VARIANT: Record<string, 'default' | 'warning' | 'accent'> = {
  vanilla: 'default',
  fabric: 'warning',
  forge: 'warning',
  quilt: 'accent',
}

export function ProfilesScreen() {
  const tokens = useAuthStore((s) => s.tokens)
  const { profiles, setProfiles, activeProfileId, setActiveProfile } = useProfilesStore()
  const [showForm, setShowForm] = useState(false)
  const [name, setName] = useState('')
  const [creating, setCreating] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleCreate() {
    if (!tokens || !name.trim()) return
    setCreating(true)
    setError(null)
    try {
      const profile = await apiFetch<LauncherProfile>(
        '/api/profiles',
        {
          method: 'POST',
          body: JSON.stringify({
            name: name.trim(),
            loader: 'fabric',
            mcVersion: '1.21.4',
            loaderVersion: null,
            ramMb: 4096,
            javaPath: null,
            javaFlags: '-XX:+UseG1GC -XX:+ParallelRefProcEnabled -XX:MaxGCPauseMillis=200',
            modIds: [],
            hudLayoutId: null,
          }),
        },
        tokens.accessToken,
      )
      setProfiles([...profiles, profile])
      setName('')
      setShowForm(false)
    } catch (e) {
      setError((e as Error).message)
    } finally {
      setCreating(false)
    }
  }

  return (
    <div style={{ padding: 28 }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 22 }}>
        <h2 style={{ margin: 0, color: 'var(--prism-text-primary)', fontSize: 22, fontWeight: 700 }}>
          Profiles
        </h2>
        <GlassButton onClick={() => setShowForm(!showForm)}>
          {showForm ? 'Cancel' : '+ New Profile'}
        </GlassButton>
      </div>

      {showForm && (
        <GlassPanel style={{ padding: 20, marginBottom: 18 }}>
          <h3 style={{ margin: '0 0 14px', color: 'var(--prism-text-primary)', fontSize: 15 }}>
            New Profile
          </h3>
          <GlassInput
            placeholder="Profile name"
            value={name}
            onChange={(v) => setName(v)}
          />
          {error && (
            <p style={{ color: '#fca5a5', fontSize: 12, marginTop: 8 }}>{error}</p>
          )}
          <div style={{ display: 'flex', gap: 10, marginTop: 14 }}>
            <GlassButton onClick={handleCreate} disabled={!name.trim() || creating} loading={creating}>
              Create
            </GlassButton>
            <GlassButton variant="ghost" onClick={() => setShowForm(false)}>
              Cancel
            </GlassButton>
          </div>
        </GlassPanel>
      )}

      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {profiles.map((p) => (
          <GlassPanel
            key={p.id}
            padding="none"
            onClick={() => setActiveProfile(p.id)}
            style={{
              padding: '14px 18px',
              display: 'flex',
              alignItems: 'center',
              gap: 14,
              cursor: 'pointer',
              border: p.id === activeProfileId
                ? '1px solid rgba(124,111,255,0.45)'
                : undefined,
            }}
          >
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 600, color: 'var(--prism-text-primary)' }}>{p.name}</div>
              <div style={{ color: 'var(--prism-text-secondary)', fontSize: 12, marginTop: 2 }}>
                Minecraft {p.mcVersion} · {p.ramMb} MB RAM
              </div>
            </div>
            <GlassBadge variant={LOADER_VARIANT[p.loader] ?? 'default'}>
              {p.loader.toUpperCase()}
            </GlassBadge>
            {p.id === activeProfileId && (
              <GlassBadge variant="success">ACTIVE</GlassBadge>
            )}
          </GlassPanel>
        ))}

        {profiles.length === 0 && !showForm && (
          <GlassPanel style={{ padding: 44, textAlign: 'center' }}>
            <p style={{ color: 'var(--prism-text-secondary)', marginBottom: 14 }}>
              No profiles yet
            </p>
            <GlassButton onClick={() => setShowForm(true)}>
              Create your first profile
            </GlassButton>
          </GlassPanel>
        )}
      </div>
    </div>
  )
}
