import { type ChangeEvent, useId } from 'react';
import { clsx } from 'clsx';

interface GlassInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  label?: string;
  error?: string;
  type?: 'text' | 'email' | 'password' | 'search';
  disabled?: boolean;
  className?: string;
}

export function GlassInput({
  value,
  onChange,
  placeholder,
  label,
  error,
  type = 'text',
  disabled = false,
  className,
}: GlassInputProps) {
  const id = useId();

  return (
    <div className={clsx('flex flex-col gap-1.5', className)}>
      {label && (
        <label
          htmlFor={id}
          className="text-sm font-medium text-[var(--prism-text-secondary,rgba(255,255,255,0.6))]"
        >
          {label}
        </label>
      )}
      <input
        id={id}
        type={type}
        value={value}
        placeholder={placeholder}
        disabled={disabled}
        onChange={(e: ChangeEvent<HTMLInputElement>) => onChange(e.target.value)}
        className={clsx(
          'w-full px-4 py-2.5 rounded-[var(--prism-radius-sm,12px)]',
          'border border-[var(--prism-glass-border,rgba(255,255,255,0.14))]',
          'bg-[var(--prism-glass,rgba(255,255,255,0.06))]',
          '[backdrop-filter:blur(20px)_saturate(180%)]',
          'text-[var(--prism-text-primary,#fff)] text-sm',
          'placeholder:text-[var(--prism-text-disabled,rgba(255,255,255,0.3))]',
          'outline-none focus:border-[var(--prism-accent,#7c6fff)]',
          'focus:shadow-[0_0_0_2px_rgba(124,111,255,0.2)]',
          'transition-all duration-200',
          'disabled:opacity-40 disabled:cursor-not-allowed',
          error && 'border-red-500/60 focus:border-red-500',
        )}
      />
      {error && <span className="text-xs text-red-400">{error}</span>}
    </div>
  );
}
