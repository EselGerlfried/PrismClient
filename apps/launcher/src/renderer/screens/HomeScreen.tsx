import React, { useState, useEffect } from 'react'
import { GlassPanel, GlassButton, GlassBadge } from '@prism/design-system'
import { useAuthStore } from '../store/auth.js'
import { useProfilesStore } from '../store/profiles.js'
import { apiFetch } from '../api/client.js'
import type { Announcement } from '@prism/api-types'
import { AnnouncementModal } from '../components/AnnouncementModal.js'

const TIER_VARIANT: Record<string, 'default' | 'accent' | 'warning'> = {
  free: 'default',
  standard: 'accent',
  max: 'accent',
  lifetime: 'warning',
}

export function HomeScreen() {
  const user = useAuthStore((s) => s.user)
  const tokens = useAuthStore((s) => s.tokens)
  const { profiles, activeProfileId, isGameRunning, setGameRunning, setActiveProfile } = useProfilesStore()
  const [announcement, setAnnouncement] = useState<Announcement | null>(null)
  const [launching, setLaunching] = useState(false)
  const [launchError, setLaunchError] = useState<string | null>(null)

  const activeProfile = profiles.find((p) => p.id === activeProfileId) ?? profiles[0] ?? null

  useEffect(() => {
    if (!tokens) return
    apiFetch<{ items: Announcement[] }>('/api/announcements', undefined, tokens.accessToken)
      .then((r) => { if (r.items.length > 0) setAnnouncement(r.items[0] ?? null) })
      .catch(() => {})
  }, [tokens])

  async function handleLaunch() {
    if (!activeProfile) return
    setLaunching(true)
    setLaunchError(null)
    try {
      const result = await window.prism.minecraft.launch(activeProfile.id)
      if (result.ok) {
        setGameRunning(true)
      } else {
        setLaunchError(result.error ?? 'Failed to launch')
      }
    } finally {
      setLaunching(false)
    }
  }

  async function handleStop() {
    await window.prism.minecraft.kill()
    setGameRunning(false)
  }

  return (
    <div style={{ padding: 28 }}>
      {announcement && (
        <AnnouncementModal announcement={announcement} onDismiss={() => setAnnouncement(null)} />
      )}

      <div style={{ display: 'flex', alignItems: 'flex-start', gap: 14, marginBottom: 28 }}>
        <div>
          <h2 style={{ margin: '0 0 6px', color: 'var(--prism-text-primary)', fontSize: 22, fontWeight: 700 }}>
            Welcome back, {user?.username ?? 'Player'}
          </h2>
          <GlassBadge variant={TIER_VARIANT[user?.tier ?? 'free'] ?? 'default'}>
            {(user?.tier ?? 'free').toUpperCase()}
          </GlassBadge>
        </div>
      </div>

      {/* Launch panel */}
      <GlassPanel style={{ padding: 22, marginBottom: 20 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <div style={{ flex: 1 }}>
            <div style={{ fontWeight: 700, color: 'var(--prism-text-primary)', fontSize: 16 }}>
              {activeProfile?.name ?? 'No profile selected'}
            </div>
            {activeProfile && (
              <div style={{ color: 'var(--prism-text-secondary)', fontSize: 12, marginTop: 3 }}>
                {activeProfile.loader} · Minecraft {activeProfile.mcVersion} · {activeProfile.ramMb} MB
              </div>
            )}
            {launchError && (
              <div style={{ color: '#fca5a5', fontSize: 12, marginTop: 6 }}>{launchError}</div>
            )}
          </div>
          {isGameRunning ? (
            <GlassButton onClick={handleStop} variant="danger">
              ■ Stop
            </GlassButton>
          ) : (
            <GlassButton
              onClick={handleLaunch}
              disabled={!activeProfile || launching}
              loading={launching}
              variant="accent"
            >
              ▶ Play
            </GlassButton>
          )}
        </div>
      </GlassPanel>

      {/* Profile quick-select */}
      {profiles.length > 1 && (
        <>
          <p style={{ color: 'var(--prism-text-disabled)', fontSize: 11, fontWeight: 600, letterSpacing: '0.1em', marginBottom: 10 }}>
            SWITCH PROFILE
          </p>
          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
            {profiles.map((p) => (
              <GlassPanel
                key={p.id}
                padding="sm"
                onClick={() => setActiveProfile(p.id)}
                style={{
                  cursor: 'pointer',
                  border: p.id === activeProfile?.id
                    ? '1px solid rgba(124,111,255,0.45)'
                    : undefined,
                  minWidth: 130,
                }}
              >
                <div style={{ fontWeight: 600, color: 'var(--prism-text-primary)', fontSize: 13 }}>
                  {p.name}
                </div>
                <div style={{ color: 'var(--prism-text-secondary)', fontSize: 11, marginTop: 2 }}>
                  {p.loader} {p.mcVersion}
                </div>
              </GlassPanel>
            ))}
          </div>
        </>
      )}

      {profiles.length === 0 && (
        <GlassPanel style={{ padding: 36, textAlign: 'center' }}>
          <p style={{ color: 'var(--prism-text-secondary)', marginBottom: 12 }}>
            No profiles yet. Create one in Profiles.
          </p>
        </GlassPanel>
      )}
    </div>
  )
}
