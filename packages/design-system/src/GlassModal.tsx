import { type ReactNode } from 'react';
import { clsx } from 'clsx';
import { GlassPanel } from './GlassPanel.js';

interface GlassModalProps {
  open: boolean;
  onClose: () => void;
  children: ReactNode;
  title?: string;
  className?: string;
}

export function GlassModal({ open, onClose, children, title, className }: GlassModalProps) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div
        data-testid="modal-backdrop"
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={onClose}
      />
      <GlassPanel
        className={clsx(
          'relative z-10 min-w-[320px] max-w-[90vw] max-h-[90vh] overflow-auto',
          'animate-in fade-in zoom-in-95 duration-200',
          className,
        )}
      >
        {title && (
          <h2 className="text-lg font-semibold text-[var(--prism-text-primary,#fff)] mb-4">
            {title}
          </h2>
        )}
        {children}
      </GlassPanel>
    </div>
  );
}
