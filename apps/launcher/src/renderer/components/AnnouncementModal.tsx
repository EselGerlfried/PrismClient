import React, { useState } from 'react'
import type { Announcement } from '@prism/api-types'
import { GlassModal, GlassButton, GlassBadge } from '@prism/design-system'

interface Props {
  announcement: Announcement
  onDismiss: () => void
}

const typeVariant: Record<string, 'default' | 'accent' | 'success' | 'warning' | 'danger'> = {
  info: 'accent',
  sale: 'success',
  update: 'accent',
  warning: 'warning',
}

export function AnnouncementModal({ announcement, onDismiss }: Props) {
  const [confirmed, setConfirmed] = useState(false)
  const canDismiss = !announcement.forceRead || confirmed

  return (
    <GlassModal open title={announcement.title} onClose={canDismiss ? onDismiss : () => {}}>
      <div style={{ minWidth: 320, maxWidth: 460 }}>
        <div style={{ marginBottom: 8 }}>
          <GlassBadge variant={typeVariant[announcement.type] ?? 'default'}>
            {announcement.type.toUpperCase()}
          </GlassBadge>
        </div>
        <p style={{
          color: 'var(--prism-text-secondary)',
          lineHeight: 1.65,
          marginBottom: 20,
          fontSize: 14,
        }}>
          {announcement.body}
        </p>
        {announcement.forceRead && (
          <label style={{
            display: 'flex', alignItems: 'center', gap: 10,
            cursor: 'pointer', marginBottom: 20,
          }}>
            <input
              type="checkbox"
              checked={confirmed}
              onChange={(e) => setConfirmed(e.target.checked)}
              style={{ accentColor: 'var(--prism-accent)', width: 16, height: 16 }}
            />
            <span style={{ color: 'var(--prism-text-secondary)', fontSize: 13 }}>
              I have read and understood this
            </span>
          </label>
        )}
        <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
          {announcement.ctaUrl && announcement.ctaLabel && (
            <GlassButton
              variant="ghost"
              onClick={() => window.prism.system.openExternal(announcement.ctaUrl!)}
            >
              {announcement.ctaLabel}
            </GlassButton>
          )}
          <GlassButton onClick={onDismiss} disabled={!canDismiss}>
            Got it
          </GlassButton>
        </div>
      </div>
    </GlassModal>
  )
}
