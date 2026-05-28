import React, { useEffect, useState } from 'react'
import { GlassPanel, GlassButton, GlassBadge } from '@prism/design-system'
import { useAuthStore } from '../store/auth.js'
import { useThemeStore } from '../store/theme.js'

const TIER_DESC: Record<string, string> = {
  free: 'Free',
  standard: 'Standard — €6.99/mo',
  max: 'Max — €12.99/mo',
  lifetime: 'Lifetime — €34.99',
}

export function SettingsScreen() {
  const user = useAuthStore((s) => s.user)
  const clearAuth = useAuthStore((s) => s.clearAuth)
  const { themeId, setTheme } = useThemeStore()
  const [version, setVersion] = useState('')

  useEffect(() => {
    window.prism.system.getVersion().then(setVersion).catch(() => {})
  }, [])

  return (
    <div style={{ padding: 28 }}>
      <h2 style={{ margin: '0 0 22px', color: 'var(--prism-text-primary)', fontSize: 22, fontWeight: 700 }}>
        Settings
      </h2>

      {/* Account */}
      <GlassPanel style={{ padding: 22, marginBottom: 14 }}>
        <p style={{ color: 'var(--prism-text-disabled)', fontSize: 10, fontWeight: 700, letterSpacing: '0.1em', marginBottom: 14 }}>
          ACCOUNT
        </p>
        <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 14 }}>
          {user?.avatarUrl && (
            <img
              src={user.avatarUrl}
              alt={user.username}
              style={{ width: 44, height: 44, borderRadius: '50%', border: '2px solid rgba(255,255,255,0.12)', objectFit: 'cover' }}
            />
          )}
          <div style={{ flex: 1 }}>
            <div style={{ fontWeight: 600, color: 'var(--prism-text-primary)' }}>{user?.username}</div>
            <div style={{ color: 'var(--prism-text-secondary)', fontSize: 12, marginTop: 1 }}>{user?.email}</div>
          </div>
          <GlassBadge variant={user?.tier === 'lifetime' ? 'warning' : user?.tier === 'free' ? 'default' : 'accent'}>
            {(user?.tier ?? 'free').toUpperCase()}
          </GlassBadge>
        </div>
        <p style={{ color: 'var(--prism-text-secondary)', fontSize: 13, marginBottom: 14 }}>
          {TIER_DESC[user?.tier ?? 'free']}
        </p>
        <div style={{ display: 'flex', gap: 10 }}>
          <GlassButton variant="ghost" onClick={() => window.prism.system.openExternal('https://prismclient.app/upgrade')}>
            Upgrade Plan
          </GlassButton>
          <GlassButton variant="danger" onClick={clearAuth}>
            Sign Out
          </GlassButton>
        </div>
      </GlassPanel>

      {/* Appearance */}
      <GlassPanel style={{ padding: 22, marginBottom: 14 }}>
        <p style={{ color: 'var(--prism-text-disabled)', fontSize: 10, fontWeight: 700, letterSpacing: '0.1em', marginBottom: 14 }}>
          APPEARANCE
        </p>
        <div style={{ display: 'flex', gap: 12 }}>
          <ThemeCard
            label="Dark"
            bg="#07070f"
            active={themeId === 'dark'}
            onClick={() => setTheme('dark')}
          />
          <ThemeCard
            label="Light"
            bg="#f4f4f8"
            active={themeId === 'white'}
            onClick={() => setTheme('white')}
          />
        </div>
      </GlassPanel>

      {/* About */}
      <GlassPanel style={{ padding: 22 }}>
        <p style={{ color: 'var(--prism-text-disabled)', fontSize: 10, fontWeight: 700, letterSpacing: '0.1em', marginBottom: 10 }}>
          ABOUT
        </p>
        <p style={{ color: 'var(--prism-text-secondary)', fontSize: 13, marginBottom: 3 }}>
          PrismClient v{version || '0.1.0'}
        </p>
        <p style={{ color: 'var(--prism-text-disabled)', fontSize: 11 }}>
          Not affiliated with Mojang Studios or Microsoft
        </p>
      </GlassPanel>
    </div>
  )
}

function ThemeCard({
  label, bg, active, onClick,
}: { label: string; bg: string; active: boolean; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      style={{
        background: 'transparent',
        border: active
          ? '2px solid var(--prism-accent)'
          : '1px solid rgba(255,255,255,0.1)',
        borderRadius: 12,
        cursor: 'pointer',
        padding: 0,
        overflow: 'hidden',
        width: 96,
        transition: 'border-color 0.15s',
      }}
    >
      <div style={{ height: 52, background: bg, borderRadius: '10px 10px 0 0' }} />
      <div style={{
        padding: '7px 10px',
        color: active ? 'var(--prism-accent)' : 'var(--prism-text-secondary)',
        fontSize: 12,
        fontWeight: active ? 600 : 400,
        textAlign: 'left',
        background: 'rgba(255,255,255,0.03)',
      }}>
        {label}
      </div>
    </button>
  )
}
