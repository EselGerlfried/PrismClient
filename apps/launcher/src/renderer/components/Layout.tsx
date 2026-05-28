import React, { useState } from 'react'
import { TitleBar } from './TitleBar.js'
import { useAuthStore } from '../store/auth.js'
import { useProfilesStore } from '../store/profiles.js'

export type Screen = 'home' | 'wardrobe' | 'profiles' | 'mods' | 'settings'

interface Props {
  screen: Screen
  onNavigate: (screen: Screen) => void
  children: React.ReactNode
}

const NAV: { id: Screen; label: string; icon: string }[] = [
  { id: 'home', label: 'Home', icon: '⌂' },
  { id: 'wardrobe', label: 'Wardrobe', icon: '✦' },
  { id: 'profiles', label: 'Profiles', icon: '◈' },
  { id: 'mods', label: 'Mods', icon: '⬡' },
  { id: 'settings', label: 'Settings', icon: '⚙' },
]

export function Layout({ screen, onNavigate, children }: Props) {
  const user = useAuthStore((s) => s.user)
  const isRunning = useProfilesStore((s) => s.isGameRunning)

  return (
    <div style={{ display: 'flex', height: '100%', flexDirection: 'column' }}>
      <TitleBar />
      <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
        <nav style={{
          width: 68,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          padding: '8px 0 12px',
          gap: 4,
          background: 'rgba(255,255,255,0.025)',
          borderRight: '1px solid rgba(255,255,255,0.05)',
          flexShrink: 0,
        }}>
          {NAV.map((item) => (
            <NavBtn
              key={item.id}
              item={item}
              active={screen === item.id}
              onClick={() => onNavigate(item.id)}
            />
          ))}
          <div style={{ flex: 1 }} />
          {isRunning && (
            <div
              title="Game running"
              style={{
                width: 8, height: 8,
                borderRadius: '50%',
                background: '#22c55e',
                boxShadow: '0 0 8px rgba(34,197,94,0.8)',
                marginBottom: 10,
              }}
            />
          )}
          {user?.avatarUrl && (
            <img
              src={user.avatarUrl}
              alt={user.username}
              title={user.username}
              style={{
                width: 34, height: 34,
                borderRadius: '50%',
                border: '2px solid rgba(255,255,255,0.12)',
                objectFit: 'cover',
              }}
            />
          )}
        </nav>
        <main style={{ flex: 1, overflow: 'auto', position: 'relative' }}>
          {children}
        </main>
      </div>
    </div>
  )
}

function NavBtn({ item, active, onClick }: {
  item: { id: Screen; label: string; icon: string }
  active: boolean
  onClick: () => void
}) {
  const [hover, setHover] = useState(false)
  return (
    <button
      onClick={onClick}
      title={item.label}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        width: 46, height: 46,
        borderRadius: 14,
        background: active
          ? 'rgba(124,111,255,0.2)'
          : hover ? 'rgba(255,255,255,0.05)' : 'transparent',
        border: active
          ? '1px solid rgba(124,111,255,0.35)'
          : '1px solid transparent',
        color: active ? 'var(--prism-accent)' : 'var(--prism-text-secondary)',
        fontSize: 17,
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        transition: 'all 0.15s',
      }}
    >
      {item.icon}
    </button>
  )
}
