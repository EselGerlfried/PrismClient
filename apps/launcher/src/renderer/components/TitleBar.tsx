import React, { useState } from 'react'

export function TitleBar() {
  return (
    <div
      style={{
        height: 36,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 16px',
        // @ts-ignore electron-specific CSS property
        WebkitAppRegion: 'drag',
        position: 'relative',
        zIndex: 200,
        flexShrink: 0,
      }}
    >
      <span style={{
        fontSize: 11,
        fontWeight: 600,
        color: 'var(--prism-text-disabled)',
        letterSpacing: '0.12em',
        textTransform: 'uppercase',
      }}>
        PrismClient
      </span>
      <div style={{ display: 'flex', gap: 6, WebkitAppRegion: 'no-drag' } as React.CSSProperties}>
        <WinButton onClick={() => window.prism.system.minimize()} title="Minimize">−</WinButton>
        <WinButton onClick={() => window.prism.system.maximize()} title="Maximize">□</WinButton>
        <WinButton onClick={() => window.prism.system.close()} title="Close" danger>✕</WinButton>
      </div>
    </div>
  )
}

function WinButton({
  onClick, children, title, danger,
}: { onClick: () => void; children: React.ReactNode; title: string; danger?: boolean }) {
  const [hover, setHover] = useState(false)
  return (
    <button
      onClick={onClick}
      title={title}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        width: 28, height: 20,
        background: hover
          ? danger ? 'rgba(239,68,68,0.4)' : 'rgba(255,255,255,0.1)'
          : 'transparent',
        border: 'none',
        borderRadius: 5,
        color: 'var(--prism-text-secondary)',
        cursor: 'pointer',
        fontSize: 11,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        transition: 'background 0.15s',
        lineHeight: 1,
      }}
    >
      {children}
    </button>
  )
}
