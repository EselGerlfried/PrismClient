import { type ReactNode } from 'react';
import { clsx } from 'clsx';

type ButtonVariant = 'default' | 'accent' | 'danger' | 'ghost';

interface GlassButtonProps {
  children: ReactNode;
  onClick: () => void;
  variant?: ButtonVariant;
  disabled?: boolean;
  loading?: boolean;
  className?: string;
  type?: 'button' | 'submit' | 'reset';
}

const variantClasses: Record<ButtonVariant, string> = {
  default: [
    'bg-[var(--prism-glass,rgba(255,255,255,0.06))]',
    'border-[var(--prism-glass-border,rgba(255,255,255,0.14))]',
    'text-[var(--prism-text-primary,#fff)]',
    'hover:shadow-glass-hover',
  ].join(' '),
  accent: [
    'bg-gradient-to-r from-[var(--prism-accent,#7c6fff)] to-[var(--prism-accent-light,#a78bfa)]',
    'border-transparent',
    'text-white',
    'hover:opacity-90',
  ].join(' '),
  danger: ['bg-red-500/20', 'border-red-500/30', 'text-red-400', 'hover:bg-red-500/30'].join(' '),
  ghost: [
    'bg-transparent',
    'border-transparent',
    'text-[var(--prism-text-secondary,rgba(255,255,255,0.6))]',
    'hover:bg-[var(--prism-glass,rgba(255,255,255,0.06))]',
  ].join(' '),
};

export function GlassButton({
  children,
  onClick,
  variant = 'default',
  disabled = false,
  loading = false,
  className,
  type = 'button',
}: GlassButtonProps) {
  return (
    <button
      type={type}
      data-variant={variant}
      aria-busy={loading ? 'true' : undefined}
      disabled={disabled || loading}
      onClick={onClick}
      className={clsx(
        'inline-flex items-center justify-center gap-2',
        'px-4 py-2 rounded-[var(--prism-radius-sm,12px)]',
        'border',
        'backdrop-blur-[var(--prism-blur-sm,20px)]',
        '[backdrop-filter:blur(var(--prism-blur-sm,20px))_saturate(180%)]',
        'font-medium text-sm',
        'transition-all duration-200',
        'hover:-translate-y-0.5',
        'active:translate-y-0 active:scale-95',
        'disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:translate-y-0',
        variantClasses[variant],
        className,
      )}
    >
      {loading && (
        <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
        </svg>
      )}
      {children}
    </button>
  );
}
