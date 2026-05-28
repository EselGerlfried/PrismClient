import React, { useState, useEffect } from 'react'
import { GlassPanel, GlassBadge } from '@prism/design-system'
import { useAuthStore } from '../store/auth.js'
import { apiFetch } from '../api/client.js'
import type { CosmeticItem, CosmeticType } from '@prism/api-types'

const IS_DEV = import.meta.env.DEV

const TYPE_LABELS: Record<CosmeticType, string> = {
  cape: 'Capes',
  hat: 'Hats',
  backpack: 'Backpacks',
  wings: 'Wings',
  aura: 'Auras',
  trail: 'Trails',
  emote: 'Emotes',
  particle_effect: 'Particles',
  crosshair: 'Crosshairs',
  chat_color: 'Chat',
  kill_effect: 'Kill FX',
}

const TYPE_ICON: Record<CosmeticType, string> = {
  cape: '🧣',
  hat: '🎩',
  backpack: '🎒',
  wings: '🪶',
  aura: '✨',
  trail: '💫',
  emote: '🎭',
  particle_effect: '🌟',
  crosshair: '⊕',
  chat_color: '🎨',
  kill_effect: '⚡',
}

const MOCK_ITEMS: CosmeticItem[] = [
  { id: '1', name: 'Aurora Cape', type: 'cape', previewUrl: '', textureUrl: '', animationUrl: null, requiredTier: 'max', priceCoins: null, createdAt: '' },
  { id: '2', name: 'Prism Cape', type: 'cape', previewUrl: '', textureUrl: '', animationUrl: null, requiredTier: 'standard', priceCoins: 800, createdAt: '' },
  { id: '3', name: 'Void Cape', type: 'cape', previewUrl: '', textureUrl: '', animationUrl: null, requiredTier: 'free', priceCoins: 400, createdAt: '' },
  { id: '4', name: 'Crown', type: 'hat', previewUrl: '', textureUrl: '', animationUrl: null, requiredTier: 'max', priceCoins: null, createdAt: '' },
  { id: '5', name: 'Crystal Wings', type: 'wings', previewUrl: '', textureUrl: '', animationUrl: null, requiredTier: 'max', priceCoins: null, createdAt: '' },
  { id: '6', name: 'Ember Aura', type: 'aura', previewUrl: '', textureUrl: '', animationUrl: null, requiredTier: 'standard', priceCoins: 600, createdAt: '' },
]

const TIER_CONFIG: Record<string, { label: string; color: string }> = {
  free: { label: 'Free', color: '#6b7280' },
  standard: { label: 'Standard', color: '#7c6fff' },
  max: { label: 'Max', color: '#a78bfa' },
}

export function WardrobeScreen() {
  const tokens = useAuthStore((s) => s.tokens)
  const [items, setItems] = useState<CosmeticItem[]>(IS_DEV ? MOCK_ITEMS : [])
  const [filter, setFilter] = useState<CosmeticType>('cape')
  const [loading, setLoading] = useState(!IS_DEV)
  const [equipped, setEquipped] = useState<string | null>(null)

  useEffect(() => {
    if (IS_DEV || !tokens) return
    setLoading(true)
    apiFetch<CosmeticItem[]>('/api/cosmetics', undefined, tokens.accessToken)
      .then(setItems)
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [tokens])

  const filtered = items.filter((i) => i.type === filter)
  const types = (Object.keys(TYPE_LABELS) as CosmeticType[]).filter(
    (t) => IS_DEV || items.some((i) => i.type === t)
  )

  return (
    <div style={{ display: 'flex', height: '100%', overflow: 'hidden' }}>
      {/* Left: Type sidebar */}
      <div style={{
        width: 140,
        borderRight: '1px solid rgba(255,255,255,0.06)',
        padding: '20px 10px',
        display: 'flex',
        flexDirection: 'column',
        gap: 4,
        overflowY: 'auto',
        flexShrink: 0,
      }}>
        <p style={{
          color: 'var(--prism-text-disabled)',
          fontSize: 10,
          fontWeight: 700,
          letterSpacing: '0.1em',
          padding: '0 8px 10px',
        }}>
          CATEGORY
        </p>
        {(Object.keys(TYPE_LABELS) as CosmeticType[]).map((t) => {
          const hasItems = IS_DEV || items.some((i) => i.type === t)
          return (
            <TypeTab
              key={t}
              icon={TYPE_ICON[t]}
              label={TYPE_LABELS[t]}
              active={filter === t}
              disabled={!hasItems}
              onClick={() => { if (hasItems) setFilter(t) }}
            />
          )
        })}
      </div>

      {/* Right: Item grid */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '20px 24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20 }}>
          <span style={{ fontSize: 20 }}>{TYPE_ICON[filter]}</span>
          <h2 style={{ margin: 0, color: 'var(--prism-text-primary)', fontSize: 20, fontWeight: 700 }}>
            {TYPE_LABELS[filter]}
          </h2>
          <span style={{ color: 'var(--prism-text-disabled)', fontSize: 13, marginLeft: 2 }}>
            {filtered.length}
          </span>
        </div>

        {loading ? (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))', gap: 12 }}>
            {Array.from({ length: 6 }).map((_, i) => (
              <SkeletonCard key={i} />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <EmptyState type={filter} />
        ) : (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))',
            gap: 12,
          }}>
            {filtered.map((item) => (
              <CosmeticCard
                key={item.id}
                item={item}
                isEquipped={equipped === item.id}
                onEquip={() => setEquipped(equipped === item.id ? null : item.id)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

function TypeTab({ icon, label, active, disabled, onClick }: {
  icon: string; label: string; active: boolean; disabled: boolean; onClick: () => void
}) {
  const [hover, setHover] = useState(false)
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        display: 'flex', alignItems: 'center', gap: 8,
        padding: '8px 10px',
        borderRadius: 10,
        background: active ? 'rgba(124,111,255,0.18)' : hover && !disabled ? 'rgba(255,255,255,0.04)' : 'transparent',
        border: active ? '1px solid rgba(124,111,255,0.3)' : '1px solid transparent',
        color: active ? 'var(--prism-accent)' : disabled ? 'var(--prism-text-disabled)' : 'var(--prism-text-secondary)',
        cursor: disabled ? 'default' : 'pointer',
        fontSize: 12,
        fontWeight: active ? 600 : 400,
        textAlign: 'left',
        transition: 'all 0.12s',
        opacity: disabled ? 0.4 : 1,
      }}
    >
      <span style={{ fontSize: 14, lineHeight: 1 }}>{icon}</span>
      {label}
    </button>
  )
}

function CosmeticCard({ item, isEquipped, onEquip }: {
  item: CosmeticItem; isEquipped: boolean; onEquip: () => void
}) {
  const [hover, setHover] = useState(false)
  const tier = TIER_CONFIG[item.requiredTier]

  // Generate a gradient preview based on item name (placeholder until real textures)
  const hue = (item.name.charCodeAt(0) * 37 + item.id.charCodeAt(0) * 13) % 360

  return (
    <div
      onClick={onEquip}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        borderRadius: 16,
        border: isEquipped
          ? '1.5px solid rgba(124,111,255,0.6)'
          : hover ? '1px solid rgba(255,255,255,0.12)' : '1px solid rgba(255,255,255,0.06)',
        background: hover ? 'rgba(255,255,255,0.05)' : 'rgba(255,255,255,0.03)',
        cursor: 'pointer',
        overflow: 'hidden',
        transition: 'all 0.15s',
        transform: hover ? 'translateY(-2px)' : 'none',
        boxShadow: isEquipped ? '0 0 20px rgba(124,111,255,0.2)' : 'none',
      }}
    >
      {/* Preview area */}
      <div style={{
        width: '100%',
        paddingBottom: '100%',
        position: 'relative',
        background: `linear-gradient(135deg, hsla(${hue},60%,20%,0.8) 0%, hsla(${(hue + 60) % 360},50%,30%,0.6) 100%)`,
        overflow: 'hidden',
      }}>
        {item.previewUrl ? (
          <img
            src={item.previewUrl}
            alt={item.name}
            style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }}
          />
        ) : (
          <div style={{
            position: 'absolute', inset: 0,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 36, opacity: 0.7,
          }}>
            {TYPE_ICON[item.type]}
          </div>
        )}
        {isEquipped && (
          <div style={{
            position: 'absolute', top: 8, right: 8,
            background: 'rgba(124,111,255,0.9)',
            borderRadius: 6,
            padding: '2px 6px',
            fontSize: 9,
            fontWeight: 700,
            color: '#fff',
            letterSpacing: '0.05em',
          }}>
            ON
          </div>
        )}
      </div>

      {/* Info */}
      <div style={{ padding: '10px 10px 12px' }}>
        <div style={{
          fontWeight: 600,
          color: 'var(--prism-text-primary)',
          fontSize: 12,
          marginBottom: 6,
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          whiteSpace: 'nowrap',
        }}>
          {item.name}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <span style={{
            fontSize: 10,
            color: tier.color,
            fontWeight: 600,
          }}>
            {tier.label}
          </span>
          {item.priceCoins !== null && (
            <span style={{ fontSize: 10, color: 'var(--prism-text-disabled)' }}>
              {item.priceCoins}✦
            </span>
          )}
        </div>
      </div>
    </div>
  )
}

function SkeletonCard() {
  return (
    <div style={{ borderRadius: 16, overflow: 'hidden', border: '1px solid rgba(255,255,255,0.06)' }}>
      <div style={{
        width: '100%', paddingBottom: '100%',
        background: 'rgba(255,255,255,0.04)',
        animation: 'pulse 1.5s ease-in-out infinite',
      }} />
      <div style={{ padding: '10px 10px 12px' }}>
        <div style={{ height: 12, borderRadius: 6, background: 'rgba(255,255,255,0.06)', marginBottom: 8 }} />
        <div style={{ height: 10, borderRadius: 5, background: 'rgba(255,255,255,0.04)', width: '60%' }} />
      </div>
      <style>{`@keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.5} }`}</style>
    </div>
  )
}

function EmptyState({ type }: { type: CosmeticType }) {
  return (
    <div style={{
      display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
      padding: '60px 20px', gap: 12,
    }}>
      <span style={{ fontSize: 48, opacity: 0.3 }}>{TYPE_ICON[type]}</span>
      <p style={{ color: 'var(--prism-text-secondary)', fontSize: 14, margin: 0 }}>
        No {TYPE_LABELS[type].toLowerCase()} yet
      </p>
      <p style={{ color: 'var(--prism-text-disabled)', fontSize: 12, margin: 0 }}>
        Visit the Shop to unlock cosmetics
      </p>
    </div>
  )
}
