import { type ElementType, type ReactNode, type CSSProperties } from 'react';
import { clsx } from 'clsx';

type PaddingVariant = 'none' | 'sm' | 'md' | 'lg';

const paddingClasses: Record<PaddingVariant, string> = {
  none: '',
  sm: 'p-3',
  md: 'p-5',
  lg: 'p-8',
};

interface GlassPanelProps {
  children: ReactNode;
  className?: string;
  padding?: PaddingVariant;
  as?: ElementType;
  style?: CSSProperties;
  onClick?: () => void;
}

export function GlassPanel({
  children,
  className,
  padding = 'md',
  as: Tag = 'div',
  style,
  onClick,
}: GlassPanelProps) {
  return (
    <Tag
      data-prism="glass-panel"
      className={clsx(
        'relative rounded-[var(--prism-radius,20px)]',
        'border border-[var(--prism-glass-border,rgba(255,255,255,0.14))]',
        'bg-[var(--prism-glass,rgba(255,255,255,0.06))]',
        'shadow-glass',
        'backdrop-blur-[var(--prism-blur,40px)]',
        '[backdrop-filter:blur(var(--prism-blur,40px))_saturate(180%)]',
        'transition-all duration-200',
        paddingClasses[padding],
        className,
      )}
      style={style}
      onClick={onClick}
    >
      {children}
    </Tag>
  );
}
