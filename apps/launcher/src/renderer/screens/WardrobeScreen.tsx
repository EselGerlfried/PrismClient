import React, { useState, useEffect } from 'react'
import { GlassPanel, GlassBadge } from '@prism/design-system'
import { useAuthStore } from '../store/auth.js'
import { apiFetch } from '../api/client.js'
import type { CosmeticItem, CosmeticType } from '@prism/api-types'

const TYPES: CosmeticType[] = [
  'cape', 'hat', 'backpack', 'wings', 'aura',
  'trail', 'emote', 'crosshair', 'chat_color', 'kill_effect', 'particle_effect',
]

const TIER_VARIANT: Record<string, 'default' | 'accent' | 'success'> = {
  free: 'default',
  standard: 'accent',
  max: 'success',
}

export function WardrobeScreen() {
  const tokens = useAuthStore((s) => s.tokens)
  const [items, setItems] = useState<CosmeticItem[]>([])
  const [filter, setFilter] = useState<CosmeticType>('cape')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!tokens) return
    setLoading(true)
    apiFetch<CosmeticItem[]>('/api/cosmetics', undefined, tokens.accessToken)
      .then(setItems)
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [tokens])

  const filtered = items.filter((i) => i.type === filter)

  return (
    <div style={{ padding: 28 }}>
      <h2 style={{ margin: '0 0 4px', color: 'var(--prism-text-primary)', fontSize: 22, fontWeight: 700 }}>
        Wardrobe
      </h2>
      <p style={{ color: 'var(--prism-text-secondary)', fontSize: 13, margin: '0 0 20px' }}>
        Your cosmetic collection
      </p>

      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 20 }}>
        {TYPES.map((t) => (
          <button
            key={t}
            onClick={() => setFilter(t)}
            style={{
              padding: '5px 12px',
              borderRadius: 8,
              background: filter === t ? 'rgba(124,111,255,0.2)' : 'rgba(255,255,255,0.04)',
              border: filter === t ? '1px solid rgba(124,111,255,0.35)' : '1px solid rgba(255,255,255,0.07)',
              color: filter === t ? 'var(--prism-accent)' : 'var(--prism-text-secondary)',
              cursor: 'pointer',
              fontSize: 11,
              fontWeight: filter === t ? 600 : 400,
              textTransform: 'capitalize',
              transition: 'all 0.15s',
            }}
          >
            {t.replace(/_/g, ' ')}
          </button>
        ))}
      </div>

      {loading ? (
        <div style={{ color: 'var(--prism-text-secondary)', textAlign: 'center', padding: 48 }}>Loading...</div>
      ) : filtered.length === 0 ? (
        <GlassPanel style={{ padding: 48, textAlign: 'center' }}>
          <p style={{ color: 'var(--prism-text-secondary)' }}>
            No {filter.replace(/_/g, ' ')} cosmetics available
          </p>
        </GlassPanel>
      ) : (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(148px, 1fr))',
          gap: 14,
        }}>
          {filtered.map((item) => (
            <GlassPanel key={item.id} padding="sm" style={{ textAlign: 'center' }}>
              <div style={{
                width: '100%', paddingBottom: '100%',
                background: 'rgba(255,255,255,0.04)',
                borderRadius: 10,
                marginBottom: 10,
                position: 'relative',
                overflow: 'hidden',
              }}>
                {item.previewUrl && (
                  <img
                    src={item.previewUrl}
                    alt={item.name}
                    style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                )}
              </div>
              <div style={{ fontWeight: 600, color: 'var(--prism-text-primary)', fontSize: 12, marginBottom: 5 }}>
                {item.name}
              </div>
              <GlassBadge variant={TIER_VARIANT[item.requiredTier] ?? 'default'}>
                {item.requiredTier.toUpperCase()}
              </GlassBadge>
            </GlassPanel>
          ))}
        </div>
      )}
    </div>
  )
}
