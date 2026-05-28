import React from 'react'
import { useThemeStore } from '../store/theme.js'

export function MeshBackground() {
  const tokens = useThemeStore((s) => s.tokens)

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        background: tokens.bg,
        overflow: 'hidden',
        zIndex: 0,
        pointerEvents: 'none',
      }}
    >
      <div
        style={{
          position: 'absolute',
          width: 600, height: 600,
          left: -150, top: -150,
          borderRadius: '50%',
          background: 'radial-gradient(circle, #7c6fff 0%, transparent 70%)',
          filter: 'blur(80px)',
          opacity: 0.35,
          animation: 'meshFloat 12s ease-in-out infinite',
        }}
      />
      <div
        style={{
          position: 'absolute',
          width: 400, height: 400,
          right: '10%', bottom: '10%',
          borderRadius: '50%',
          background: 'radial-gradient(circle, #a78bfa 0%, transparent 70%)',
          filter: 'blur(80px)',
          opacity: 0.3,
          animation: 'meshFloat 12s ease-in-out infinite',
          animationDelay: '-4s',
        }}
      />
      <div
        style={{
          position: 'absolute',
          width: 500, height: 500,
          left: '40%', top: '30%',
          borderRadius: '50%',
          background: 'radial-gradient(circle, #6366f1 0%, transparent 70%)',
          filter: 'blur(80px)',
          opacity: 0.25,
          animation: 'meshFloat 12s ease-in-out infinite',
          animationDelay: '-8s',
        }}
      />
      <style>{`
        @keyframes meshFloat {
          0%, 100% { transform: translate(0, 0) scale(1); }
          33% { transform: translate(30px, -20px) scale(1.05); }
          66% { transform: translate(-20px, 30px) scale(0.95); }
        }
      `}</style>
    </div>
  )
}
