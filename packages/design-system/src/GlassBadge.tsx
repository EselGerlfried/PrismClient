import { type ReactNode } from 'react';
import { clsx } from 'clsx';

type BadgeVariant = 'default' | 'accent' | 'success' | 'warning' | 'danger';

const badgeVariantClasses: Record<BadgeVariant, string> = {
  default:
    'bg-white/10 text-[var(--prism-text-secondary,rgba(255,255,255,0.6))] border-white/15',
  accent:
    'bg-[var(--prism-accent,#7c6fff)]/20 text-[var(--prism-accent-light,#a78bfa)] border-[var(--prism-accent,#7c6fff)]/30',
  success: 'bg-green-500/15 text-green-400 border-green-500/25',
  warning: 'bg-amber-500/15 text-amber-400 border-amber-500/25',
  danger: 'bg-red-500/15 text-red-400 border-red-500/25',
};

interface GlassBadgeProps {
  children: ReactNode;
  variant?: BadgeVariant;
  className?: string;
}

export function GlassBadge({ children, variant = 'default', className }: GlassBadgeProps) {
  return (
    <span
      className={clsx(
        'inline-flex items-center px-2 py-0.5',
        'rounded-full border text-xs font-medium',
        badgeVariantClasses[variant],
        className,
      )}
    >
      {children}
    </span>
  );
}
