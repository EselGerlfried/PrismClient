import React, { useState } from 'react'
import { GlassPanel, GlassInput, GlassBadge } from '@prism/design-system'

interface ModResult {
  id: string
  name: string
  description: string
  downloads: number
  categories: string[]
  iconUrl: string | null
}

export function ModBrowserScreen() {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<ModResult[]>([])
  const [loading, setLoading] = useState(false)
  const [searched, setSearched] = useState(false)

  async function search() {
    const q = query.trim()
    if (!q) return
    setLoading(true)
    setSearched(true)
    try {
      const url = `https://api.modrinth.com/v2/search?query=${encodeURIComponent(q)}&facets=%5B%5B%22project_type%3Amod%22%5D%5D&limit=20`
      const res = await fetch(url)
      const data: { hits: unknown[] } = await res.json()
      setResults(
        (data.hits ?? []).map((h: any) => ({
          id: h.project_id as string,
          name: h.title as string,
          description: h.description as string,
          downloads: (h.downloads as number) ?? 0,
          categories: (h.categories as string[]) ?? [],
          iconUrl: (h.icon_url as string | null) ?? null,
        })),
      )
    } catch {
      setResults([])
    } finally {
      setLoading(false)
    }
  }

  function fmtDl(n: number) {
    if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`
    if (n >= 1_000) return `${(n / 1_000).toFixed(0)}K`
    return String(n)
  }

  return (
    <div style={{ padding: 28 }}>
      <h2 style={{ margin: '0 0 4px', color: 'var(--prism-text-primary)', fontSize: 22, fontWeight: 700 }}>
        Mod Browser
      </h2>
      <p style={{ color: 'var(--prism-text-secondary)', fontSize: 13, margin: '0 0 20px' }}>
        Search Modrinth · Fabric mods
      </p>

      <div style={{ display: 'flex', gap: 10, marginBottom: 20 }}>
        <div style={{ flex: 1 }}>
          <GlassInput
            placeholder="Search mods... (press Enter)"
            value={query}
            onChange={(v) => setQuery(v)}
            type="search"
          />
        </div>
        <button
          onClick={search}
          disabled={loading || !query.trim()}
          style={{
            padding: '0 18px',
            background: 'rgba(124,111,255,0.2)',
            border: '1px solid rgba(124,111,255,0.35)',
            borderRadius: 12,
            color: 'var(--prism-accent)',
            cursor: loading ? 'not-allowed' : 'pointer',
            fontWeight: 600,
            fontSize: 13,
            opacity: loading || !query.trim() ? 0.5 : 1,
            transition: 'opacity 0.15s',
          }}
        >
          {loading ? '…' : 'Search'}
        </button>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {loading && (
          <div style={{ color: 'var(--prism-text-secondary)', textAlign: 'center', padding: 48 }}>
            Searching Modrinth...
          </div>
        )}
        {!loading && results.map((mod) => (
          <GlassPanel key={mod.id} padding="none" style={{ padding: '14px 18px', display: 'flex', gap: 14, alignItems: 'flex-start' }}>
            {mod.iconUrl ? (
              <img src={mod.iconUrl} alt={mod.name} style={{ width: 44, height: 44, borderRadius: 10, objectFit: 'cover', flexShrink: 0 }} />
            ) : (
              <div style={{ width: 44, height: 44, borderRadius: 10, background: 'rgba(255,255,255,0.05)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18, flexShrink: 0 }}>⬡</div>
            )}
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 3 }}>
                <span style={{ fontWeight: 600, color: 'var(--prism-text-primary)', fontSize: 14 }}>{mod.name}</span>
                <span style={{ color: 'var(--prism-text-disabled)', fontSize: 11 }}>↓ {fmtDl(mod.downloads)}</span>
              </div>
              <p style={{ margin: '0 0 8px', color: 'var(--prism-text-secondary)', fontSize: 12, lineHeight: 1.55, overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' } as React.CSSProperties}>
                {mod.description}
              </p>
              <div style={{ display: 'flex', gap: 5, flexWrap: 'wrap' }}>
                {mod.categories.slice(0, 4).map((c) => (
                  <GlassBadge key={c}>{c}</GlassBadge>
                ))}
              </div>
            </div>
          </GlassPanel>
        ))}
        {!loading && searched && results.length === 0 && (
          <GlassPanel style={{ padding: 44, textAlign: 'center' }}>
            <p style={{ color: 'var(--prism-text-secondary)' }}>No mods found for &quot;{query}&quot;</p>
          </GlassPanel>
        )}
        {!loading && !searched && (
          <GlassPanel style={{ padding: 44, textAlign: 'center' }}>
            <p style={{ color: 'var(--prism-text-secondary)' }}>Search Modrinth for Fabric mods above</p>
          </GlassPanel>
        )}
      </div>
    </div>
  )
}
