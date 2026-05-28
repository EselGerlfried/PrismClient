# PrismClient Phase 1: Foundation Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Set up the pnpm monorepo with Turborepo, shared TypeScript config, the `api-types` package (all shared interfaces used by launcher and backend), and the `design-system` package with core Liquid Glass React components.

**Architecture:** pnpm workspaces + Turborepo for build orchestration. Two packages: `api-types` (zero-runtime shared TypeScript interfaces) and `design-system` (React component library with Liquid Glass CSS). Apps (`launcher`, `backend`) are scaffolded as empty packages so workspace resolves correctly — implemented in Phase 2/3.

**Tech Stack:** Node.js 22, pnpm 9, Turborepo 2, TypeScript 5.5, React 19, Vitest 2, @testing-library/react 16, Tailwind CSS 3, tailwindcss-animate 1

---

## File Map

```
PrismClient/
├── package.json                          ← workspace root (no src)
├── pnpm-workspace.yaml
├── turbo.json
├── tsconfig.base.json
├── .prettierrc
├── .github/
│   └── workflows/
│       └── ci.yml
├── packages/
│   ├── api-types/
│   │   ├── package.json
│   │   ├── tsconfig.json
│   │   └── src/
│   │       ├── index.ts              ← re-exports everything
│   │       ├── user.ts               ← User, SubscriptionTier
│   │       ├── cosmetics.ts          ← CosmeticItem, CosmeticType, OwnedCosmetics
│   │       ├── profiles.ts           ← LauncherProfile, ModLoader, HudLayout
│   │       └── announcements.ts      ← Announcement, AnnouncementType
│   └── design-system/
│       ├── package.json
│       ├── tsconfig.json
│       ├── vite.config.ts
│       ├── tailwind.config.ts
│       └── src/
│           ├── index.ts              ← re-exports all components
│           ├── tokens.ts             ← CSS custom properties + JS theme tokens
│           ├── themes.ts             ← ThemeConfig, dark/white/custom presets
│           ├── GlassPanel.tsx        ← base glass container
│           ├── GlassButton.tsx       ← glass button with hover glow
│           ├── GlassInput.tsx        ← glass text input
│           ├── GlassModal.tsx        ← animated glass modal overlay
│           ├── GlassBadge.tsx        ← small label chip
│           └── __tests__/
│               ├── GlassPanel.test.tsx
│               ├── GlassButton.test.tsx
│               ├── GlassInput.test.tsx
│               └── GlassModal.test.tsx
├── apps/
│   ├── launcher/
│   │   └── package.json              ← stub (implemented Phase 3)
│   └── backend/
│       └── package.json              ← stub (implemented Phase 2)
```

---

## Task 1: Monorepo Root Setup

**Files:**
- Create: `package.json`
- Create: `pnpm-workspace.yaml`
- Create: `turbo.json`
- Create: `tsconfig.base.json`
- Create: `.prettierrc`

- [ ] **Step 1: Verify pnpm and Node versions**

```bash
node --version   # must be >= 22
pnpm --version   # must be >= 9
```

Expected: version numbers printed, no errors. If pnpm missing: `npm install -g pnpm@9`

- [ ] **Step 2: Initialize root package.json**

Create `package.json`:

```json
{
  "name": "prismclient",
  "private": true,
  "scripts": {
    "build": "turbo build",
    "test": "turbo test",
    "lint": "turbo lint",
    "typecheck": "turbo typecheck",
    "dev": "turbo dev"
  },
  "devDependencies": {
    "turbo": "^2.0.0",
    "typescript": "^5.5.0",
    "prettier": "^3.3.0"
  },
  "engines": {
    "node": ">=22",
    "pnpm": ">=9"
  },
  "packageManager": "pnpm@9.0.0"
}
```

- [ ] **Step 3: Create pnpm-workspace.yaml**

```yaml
packages:
  - 'apps/*'
  - 'packages/*'
```

- [ ] **Step 4: Create turbo.json**

```json
{
  "$schema": "https://turbo.build/schema.json",
  "tasks": {
    "build": {
      "dependsOn": ["^build"],
      "outputs": ["dist/**"]
    },
    "test": {
      "dependsOn": ["^build"]
    },
    "typecheck": {
      "dependsOn": ["^build"]
    },
    "lint": {},
    "dev": {
      "cache": false,
      "persistent": true
    }
  }
}
```

- [ ] **Step 5: Create tsconfig.base.json**

```json
{
  "compilerOptions": {
    "target": "ES2022",
    "lib": ["ES2022", "DOM"],
    "module": "ESNext",
    "moduleResolution": "bundler",
    "jsx": "react-jsx",
    "strict": true,
    "exactOptionalPropertyTypes": true,
    "noUncheckedIndexedAccess": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "declaration": true,
    "declarationMap": true,
    "sourceMap": true
  }
}
```

- [ ] **Step 6: Create .prettierrc**

```json
{
  "semi": true,
  "singleQuote": true,
  "tabWidth": 2,
  "trailingComma": "all",
  "printWidth": 100
}
```

- [ ] **Step 7: Create app stubs so workspace resolves**

```bash
mkdir -p apps/launcher apps/backend
```

Create `apps/launcher/package.json`:

```json
{
  "name": "@prism/launcher",
  "version": "0.0.1",
  "private": true
}
```

Create `apps/backend/package.json`:

```json
{
  "name": "@prism/backend",
  "version": "0.0.1",
  "private": true
}
```

- [ ] **Step 8: Install dependencies**

```bash
pnpm install
```

Expected: `node_modules/.pnpm` created, no errors.

- [ ] **Step 9: Commit**

```bash
git add package.json pnpm-workspace.yaml turbo.json tsconfig.base.json .prettierrc apps/ pnpm-lock.yaml
git commit -m "chore: init pnpm monorepo with turborepo"
```

---

## Task 2: api-types Package

**Files:**
- Create: `packages/api-types/package.json`
- Create: `packages/api-types/tsconfig.json`
- Create: `packages/api-types/src/user.ts`
- Create: `packages/api-types/src/cosmetics.ts`
- Create: `packages/api-types/src/profiles.ts`
- Create: `packages/api-types/src/announcements.ts`
- Create: `packages/api-types/src/index.ts`

- [ ] **Step 1: Create package.json**

```json
{
  "name": "@prism/api-types",
  "version": "0.1.0",
  "private": true,
  "main": "./dist/index.js",
  "types": "./dist/index.d.ts",
  "exports": {
    ".": {
      "import": "./dist/index.js",
      "types": "./dist/index.d.ts"
    }
  },
  "scripts": {
    "build": "tsc",
    "typecheck": "tsc --noEmit"
  },
  "devDependencies": {
    "typescript": "^5.5.0"
  }
}
```

- [ ] **Step 2: Create tsconfig.json**

```json
{
  "extends": "../../tsconfig.base.json",
  "compilerOptions": {
    "outDir": "./dist",
    "rootDir": "./src"
  },
  "include": ["src/**/*"]
}
```

- [ ] **Step 3: Write src/user.ts**

```typescript
export type SubscriptionTier = 'free' | 'standard' | 'max' | 'lifetime';

export interface User {
  uuid: string;
  username: string;
  email: string;
  tier: SubscriptionTier;
  createdAt: string; // ISO 8601
  avatarUrl: string | null;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
  expiresAt: number; // Unix timestamp ms
}

export interface AuthResponse {
  user: User;
  tokens: AuthTokens;
}
```

- [ ] **Step 4: Write src/cosmetics.ts**

```typescript
export type CosmeticType =
  | 'cape'
  | 'hat'
  | 'backpack'
  | 'wings'
  | 'aura'
  | 'trail'
  | 'emote'
  | 'particle_effect'
  | 'crosshair'
  | 'chat_color'
  | 'kill_effect';

export interface CosmeticItem {
  id: string;
  name: string;
  type: CosmeticType;
  previewUrl: string;
  textureUrl: string;
  animationUrl: string | null; // for emotes
  requiredTier: 'free' | 'standard' | 'max'; // 'free' = individual purchase
  priceCoins: number | null; // null if tier-locked only
  createdAt: string;
}

export interface OwnedCosmetics {
  userUuid: string;
  items: CosmeticItem[];
}

export interface EquippedCosmetics {
  userUuid: string;
  cape: string | null;       // cosmetic ID
  hat: string | null;
  backpack: string | null;
  wings: string | null;
  aura: string | null;
  trail: string | null;
  emoteSlots: [string | null, string | null, string | null, string | null,
               string | null, string | null, string | null, string | null]; // 8 slots
  crosshair: string | null;
  chatColor: string | null;
  killEffect: string | null;
}

export interface PlayerCosmeticsResponse {
  uuid: string;
  equipped: EquippedCosmetics;
}
```

- [ ] **Step 5: Write src/profiles.ts**

```typescript
export type ModLoader = 'vanilla' | 'fabric' | 'forge' | 'quilt';

export interface HudElement {
  id: string;
  x: number;          // 0-100 percentage of screen width
  y: number;          // 0-100 percentage of screen height
  width: number;      // pixels
  height: number;     // pixels
  opacity: number;    // 0-1
  visible: boolean;
  textColor: string;  // hex
  showBackground: boolean;
}

export type HudElementId =
  | 'health'
  | 'hunger'
  | 'armor'
  | 'xp'
  | 'minimap'
  | 'chat'
  | 'coords'
  | 'fps'
  | 'ping'
  | 'hotbar'
  | 'crosshair'
  | 'bossbar'
  | 'scoreboard'
  | 'potions'
  | 'compass';

export interface HudLayout {
  id: string;
  name: string;
  elements: Partial<Record<HudElementId, HudElement>>;
}

export interface LauncherProfile {
  id: string;
  name: string;
  loader: ModLoader;
  mcVersion: string;
  loaderVersion: string | null; // null for vanilla
  ramMb: number;
  javaPath: string | null;      // null = auto-detect
  javaFlags: string;
  modIds: string[];             // Modrinth/CurseForge mod IDs
  hudLayoutId: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface ProfileExport {
  version: 1;
  profile: LauncherProfile;
  hudLayouts: HudLayout[];
}
```

- [ ] **Step 6: Write src/announcements.ts**

```typescript
export type AnnouncementType = 'info' | 'sale' | 'update' | 'warning';

export interface Announcement {
  id: string;
  type: AnnouncementType;
  title: string;
  body: string;
  forceRead: boolean;   // if true, user cannot dismiss without clicking confirm
  ctaLabel: string | null;
  ctaUrl: string | null;
  expiresAt: string | null; // ISO 8601, null = never expires
  createdAt: string;
}
```

- [ ] **Step 7: Write src/index.ts**

```typescript
export * from './user.js';
export * from './cosmetics.js';
export * from './profiles.js';
export * from './announcements.js';
```

- [ ] **Step 8: Build and typecheck**

```bash
cd packages/api-types && pnpm build
```

Expected: `dist/` created with `.js` and `.d.ts` files, no TypeScript errors.

- [ ] **Step 9: Commit**

```bash
git add packages/api-types/
git commit -m "feat(api-types): add shared TypeScript interfaces for all domains"
```

---

## Task 3: Design System — Setup + Tokens

**Files:**
- Create: `packages/design-system/package.json`
- Create: `packages/design-system/tsconfig.json`
- Create: `packages/design-system/vite.config.ts`
- Create: `packages/design-system/tailwind.config.ts`
- Create: `packages/design-system/src/tokens.ts`
- Create: `packages/design-system/src/themes.ts`

- [ ] **Step 1: Create package.json**

```json
{
  "name": "@prism/design-system",
  "version": "0.1.0",
  "private": true,
  "main": "./dist/index.js",
  "types": "./dist/index.d.ts",
  "exports": {
    ".": {
      "import": "./dist/index.js",
      "types": "./dist/index.d.ts"
    },
    "./styles.css": "./dist/styles.css"
  },
  "scripts": {
    "build": "vite build",
    "test": "vitest run",
    "typecheck": "tsc --noEmit",
    "dev": "vitest"
  },
  "peerDependencies": {
    "react": "^19.0.0",
    "react-dom": "^19.0.0"
  },
  "devDependencies": {
    "@testing-library/jest-dom": "^6.4.0",
    "@testing-library/react": "^16.0.0",
    "@testing-library/user-event": "^14.5.0",
    "@types/react": "^19.0.0",
    "@types/react-dom": "^19.0.0",
    "@vitejs/plugin-react": "^4.3.0",
    "autoprefixer": "^10.4.0",
    "jsdom": "^24.0.0",
    "postcss": "^8.4.0",
    "tailwindcss": "^3.4.0",
    "typescript": "^5.5.0",
    "vite": "^5.3.0",
    "vite-plugin-dts": "^4.0.0",
    "tailwindcss-animate": "^1.0.0",
    "vitest": "^2.0.0"
  },
  "dependencies": {
    "clsx": "^2.1.0"
  }
}
```

- [ ] **Step 2: Create tsconfig.json**

```json
{
  "extends": "../../tsconfig.base.json",
  "compilerOptions": {
    "outDir": "./dist",
    "rootDir": "./src"
  },
  "include": ["src/**/*"]
}
```

- [ ] **Step 3: Create vite.config.ts**

```typescript
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import dts from 'vite-plugin-dts';

export default defineConfig({
  plugins: [
    react(),
    dts({ include: ['src'] }),
  ],
  build: {
    lib: {
      entry: 'src/index.ts',
      formats: ['es'],
      fileName: 'index',
    },
    rollupOptions: {
      external: ['react', 'react-dom', 'react/jsx-runtime'],
    },
    cssCodeSplit: false,
  },
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./src/__tests__/setup.ts'],
  },
});
```

- [ ] **Step 4: Create tailwind.config.ts**

```typescript
import type { Config } from 'tailwindcss';

export default {
  content: ['./src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        prism: {
          violet: '#7c6fff',
          'violet-light': '#a78bfa',
          dark: '#07070f',
          glass: 'rgba(255,255,255,0.06)',
        },
      },
      borderRadius: {
        glass: '20px',
        'glass-sm': '12px',
        'glass-lg': '28px',
      },
      backdropBlur: {
        glass: '40px',
        'glass-sm': '20px',
      },
      boxShadow: {
        glass: '0 8px 32px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.15)',
        'glass-hover': '0 12px 40px rgba(124,111,255,0.25), inset 0 1px 0 rgba(255,255,255,0.2)',
        'glass-white': '0 8px 32px rgba(0,0,0,0.08), inset 0 1px 0 rgba(255,255,255,0.9)',
      },
    },
  },
  plugins: [require('tailwindcss-animate')],
} satisfies Config;
```

- [ ] **Step 5: Write src/tokens.ts**

```typescript
export const darkTheme = {
  bg: '#07070f',
  bgSecondary: '#0e0e1a',
  glass: 'rgba(255, 255, 255, 0.06)',
  glassBorder: 'rgba(255, 255, 255, 0.14)',
  glassInner: 'rgba(255, 255, 255, 0.15)',
  accent: '#7c6fff',
  accentLight: '#a78bfa',
  textPrimary: '#ffffff',
  textSecondary: 'rgba(255, 255, 255, 0.6)',
  textDisabled: 'rgba(255, 255, 255, 0.3)',
  blur: '40px',
  blurSm: '20px',
  radius: '20px',
  radiusSm: '12px',
  radiusLg: '28px',
} as const;

export const whiteTheme = {
  bg: '#f4f4f8',
  bgSecondary: '#eaeaf0',
  glass: 'rgba(255, 255, 255, 0.65)',
  glassBorder: 'rgba(0, 0, 0, 0.08)',
  glassInner: 'rgba(255, 255, 255, 0.9)',
  accent: '#6366f1',
  accentLight: '#818cf8',
  textPrimary: '#0a0a0f',
  textSecondary: 'rgba(0, 0, 0, 0.5)',
  textDisabled: 'rgba(0, 0, 0, 0.25)',
  blur: '30px',
  blurSm: '15px',
  radius: '20px',
  radiusSm: '12px',
  radiusLg: '28px',
} as const;

export type ThemeTokens = typeof darkTheme;

export function cssVarsFromTokens(tokens: ThemeTokens): Record<string, string> {
  return {
    '--prism-bg': tokens.bg,
    '--prism-bg-secondary': tokens.bgSecondary,
    '--prism-glass': tokens.glass,
    '--prism-glass-border': tokens.glassBorder,
    '--prism-glass-inner': tokens.glassInner,
    '--prism-accent': tokens.accent,
    '--prism-accent-light': tokens.accentLight,
    '--prism-text-primary': tokens.textPrimary,
    '--prism-text-secondary': tokens.textSecondary,
    '--prism-text-disabled': tokens.textDisabled,
    '--prism-blur': tokens.blur,
    '--prism-blur-sm': tokens.blurSm,
    '--prism-radius': tokens.radius,
    '--prism-radius-sm': tokens.radiusSm,
    '--prism-radius-lg': tokens.radiusLg,
  };
}
```

- [ ] **Step 6: Write src/themes.ts**

```typescript
import { darkTheme, whiteTheme, type ThemeTokens } from './tokens.js';

export type ThemeId = 'dark' | 'white' | 'custom';

export interface ThemeConfig {
  id: ThemeId;
  label: string;
  tokens: ThemeTokens;
}

export const themes: Record<ThemeId, ThemeConfig> = {
  dark: {
    id: 'dark',
    label: 'Dark',
    tokens: darkTheme,
  },
  white: {
    id: 'white',
    label: 'White',
    tokens: whiteTheme,
  },
  custom: {
    id: 'custom',
    label: 'Custom',
    tokens: darkTheme, // user overrides individual token values
  },
};

export function getTheme(id: ThemeId): ThemeConfig {
  return themes[id];
}
```

- [ ] **Step 7: Install dependencies**

```bash
cd packages/design-system && pnpm install
```

- [ ] **Step 8: Commit**

```bash
git add packages/design-system/
git commit -m "chore(design-system): scaffold package with tokens and theme config"
```

---

## Task 4: Design System — GlassPanel Component

**Files:**
- Create: `packages/design-system/src/__tests__/setup.ts`
- Create: `packages/design-system/src/__tests__/GlassPanel.test.tsx`
- Create: `packages/design-system/src/GlassPanel.tsx`

- [ ] **Step 1: Create test setup file**

Create `packages/design-system/src/__tests__/setup.ts`:

```typescript
import '@testing-library/jest-dom';
```

- [ ] **Step 2: Write failing test**

Create `packages/design-system/src/__tests__/GlassPanel.test.tsx`:

```typescript
import { render, screen } from '@testing-library/react';
import { GlassPanel } from '../GlassPanel';

describe('GlassPanel', () => {
  it('renders children', () => {
    render(<GlassPanel>Hello Panel</GlassPanel>);
    expect(screen.getByText('Hello Panel')).toBeInTheDocument();
  });

  it('applies glass styles via data attribute', () => {
    const { container } = render(<GlassPanel>content</GlassPanel>);
    const panel = container.firstChild as HTMLElement;
    expect(panel).toHaveAttribute('data-prism', 'glass-panel');
  });

  it('forwards className', () => {
    const { container } = render(<GlassPanel className="extra">content</GlassPanel>);
    expect(container.firstChild).toHaveClass('extra');
  });

  it('accepts padding variant', () => {
    const { container } = render(<GlassPanel padding="lg">content</GlassPanel>);
    expect(container.firstChild).toHaveClass('p-8');
  });

  it('renders as custom element', () => {
    const { container } = render(<GlassPanel as="section">content</GlassPanel>);
    expect(container.firstChild?.nodeName).toBe('SECTION');
  });
});
```

- [ ] **Step 3: Run test — verify it fails**

```bash
cd packages/design-system && pnpm test
```

Expected: FAIL — `GlassPanel` not found.

- [ ] **Step 4: Implement GlassPanel**

Create `packages/design-system/src/GlassPanel.tsx`:

```typescript
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
```

- [ ] **Step 5: Run test — verify it passes**

```bash
cd packages/design-system && pnpm test
```

Expected: PASS — all 5 GlassPanel tests green.

- [ ] **Step 6: Commit**

```bash
git add packages/design-system/src/GlassPanel.tsx packages/design-system/src/__tests__/
git commit -m "feat(design-system): add GlassPanel component with tests"
```

---

## Task 5: Design System — GlassButton Component

**Files:**
- Create: `packages/design-system/src/__tests__/GlassButton.test.tsx`
- Create: `packages/design-system/src/GlassButton.tsx`

- [ ] **Step 1: Write failing test**

Create `packages/design-system/src/__tests__/GlassButton.test.tsx`:

```typescript
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { GlassButton } from '../GlassButton';

describe('GlassButton', () => {
  it('renders label', () => {
    render(<GlassButton onClick={() => {}}>Click me</GlassButton>);
    expect(screen.getByRole('button', { name: 'Click me' })).toBeInTheDocument();
  });

  it('calls onClick when clicked', async () => {
    const handler = vi.fn();
    render(<GlassButton onClick={handler}>Go</GlassButton>);
    await userEvent.click(screen.getByRole('button'));
    expect(handler).toHaveBeenCalledOnce();
  });

  it('is disabled when disabled prop passed', async () => {
    const handler = vi.fn();
    render(<GlassButton onClick={handler} disabled>Go</GlassButton>);
    await userEvent.click(screen.getByRole('button'));
    expect(handler).not.toHaveBeenCalled();
  });

  it('shows loading state', () => {
    render(<GlassButton onClick={() => {}} loading>Save</GlassButton>);
    expect(screen.getByRole('button')).toHaveAttribute('aria-busy', 'true');
  });

  it('applies accent variant styles', () => {
    const { container } = render(
      <GlassButton onClick={() => {}} variant="accent">Buy</GlassButton>
    );
    expect(container.firstChild).toHaveAttribute('data-variant', 'accent');
  });
});
```

- [ ] **Step 2: Run test — verify it fails**

```bash
cd packages/design-system && pnpm test
```

Expected: FAIL — `GlassButton` not found.

- [ ] **Step 3: Implement GlassButton**

Create `packages/design-system/src/GlassButton.tsx`:

```typescript
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
  danger: [
    'bg-red-500/20',
    'border-red-500/30',
    'text-red-400',
    'hover:bg-red-500/30',
  ].join(' '),
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
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
        </svg>
      )}
      {children}
    </button>
  );
}
```

- [ ] **Step 4: Run tests — verify all pass**

```bash
cd packages/design-system && pnpm test
```

Expected: PASS — all GlassPanel + GlassButton tests green.

- [ ] **Step 5: Commit**

```bash
git add packages/design-system/src/GlassButton.tsx packages/design-system/src/__tests__/GlassButton.test.tsx
git commit -m "feat(design-system): add GlassButton component with variant support"
```

---

## Task 6: Design System — GlassInput + GlassModal

**Files:**
- Create: `packages/design-system/src/__tests__/GlassInput.test.tsx`
- Create: `packages/design-system/src/__tests__/GlassModal.test.tsx`
- Create: `packages/design-system/src/GlassInput.tsx`
- Create: `packages/design-system/src/GlassModal.tsx`

- [ ] **Step 1: Write GlassInput failing test**

Create `packages/design-system/src/__tests__/GlassInput.test.tsx`:

```typescript
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { GlassInput } from '../GlassInput';

describe('GlassInput', () => {
  it('renders with placeholder', () => {
    render(<GlassInput placeholder="Search mods" onChange={() => {}} value="" />);
    expect(screen.getByPlaceholderText('Search mods')).toBeInTheDocument();
  });

  it('calls onChange on type', async () => {
    const handler = vi.fn();
    render(<GlassInput placeholder="Enter" onChange={handler} value="" />);
    await userEvent.type(screen.getByRole('textbox'), 'hello');
    expect(handler).toHaveBeenCalled();
  });

  it('renders label when provided', () => {
    render(<GlassInput label="Username" onChange={() => {}} value="" />);
    expect(screen.getByText('Username')).toBeInTheDocument();
  });

  it('shows error message', () => {
    render(<GlassInput error="Required" onChange={() => {}} value="" />);
    expect(screen.getByText('Required')).toBeInTheDocument();
  });
});
```

- [ ] **Step 2: Write GlassModal failing test**

Create `packages/design-system/src/__tests__/GlassModal.test.tsx`:

```typescript
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { GlassModal } from '../GlassModal';

describe('GlassModal', () => {
  it('renders nothing when closed', () => {
    render(<GlassModal open={false} onClose={() => {}}>Content</GlassModal>);
    expect(screen.queryByText('Content')).not.toBeInTheDocument();
  });

  it('renders children when open', () => {
    render(<GlassModal open={true} onClose={() => {}}>Content</GlassModal>);
    expect(screen.getByText('Content')).toBeInTheDocument();
  });

  it('calls onClose when backdrop clicked', async () => {
    const handler = vi.fn();
    render(<GlassModal open={true} onClose={handler}>Content</GlassModal>);
    await userEvent.click(screen.getByTestId('modal-backdrop'));
    expect(handler).toHaveBeenCalledOnce();
  });

  it('renders title when provided', () => {
    render(<GlassModal open={true} onClose={() => {}} title="Settings">Body</GlassModal>);
    expect(screen.getByText('Settings')).toBeInTheDocument();
  });
});
```

- [ ] **Step 3: Run — verify both fail**

```bash
cd packages/design-system && pnpm test
```

Expected: FAIL — components not found.

- [ ] **Step 4: Implement GlassInput**

Create `packages/design-system/src/GlassInput.tsx`:

```typescript
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
      {error && (
        <span className="text-xs text-red-400">{error}</span>
      )}
    </div>
  );
}
```

- [ ] **Step 5: Implement GlassModal**

Create `packages/design-system/src/GlassModal.tsx`:

```typescript
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
```

- [ ] **Step 6: Run all tests — verify pass**

```bash
cd packages/design-system && pnpm test
```

Expected: PASS — all 13 tests green (GlassPanel×5 + GlassButton×5 + GlassInput×4 + GlassModal×4 = 18 total. Adjust count if some tests are named differently).

- [ ] **Step 7: Commit**

```bash
git add packages/design-system/src/GlassInput.tsx packages/design-system/src/GlassModal.tsx packages/design-system/src/__tests__/
git commit -m "feat(design-system): add GlassInput and GlassModal components"
```

---

## Task 7: Design System — GlassBadge + index export + build

**Files:**
- Create: `packages/design-system/src/GlassBadge.tsx`
- Create: `packages/design-system/src/index.ts`

- [ ] **Step 1: Implement GlassBadge**

Create `packages/design-system/src/GlassBadge.tsx`:

```typescript
import { type ReactNode } from 'react';
import { clsx } from 'clsx';

type BadgeVariant = 'default' | 'accent' | 'success' | 'warning' | 'danger';

const badgeVariantClasses: Record<BadgeVariant, string> = {
  default: 'bg-white/10 text-[var(--prism-text-secondary,rgba(255,255,255,0.6))] border-white/15',
  accent: 'bg-[var(--prism-accent,#7c6fff)]/20 text-[var(--prism-accent-light,#a78bfa)] border-[var(--prism-accent,#7c6fff)]/30',
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
```

- [ ] **Step 2: Write index.ts**

Create `packages/design-system/src/index.ts`:

```typescript
export { GlassPanel } from './GlassPanel.js';
export { GlassButton } from './GlassButton.js';
export { GlassInput } from './GlassInput.js';
export { GlassModal } from './GlassModal.js';
export { GlassBadge } from './GlassBadge.js';
export { darkTheme, whiteTheme, cssVarsFromTokens, type ThemeTokens } from './tokens.js';
export { themes, getTheme, type ThemeId, type ThemeConfig } from './themes.js';
```

- [ ] **Step 3: Build design-system**

```bash
cd packages/design-system && pnpm build
```

Expected: `dist/index.js` and `dist/index.d.ts` generated, no TypeScript errors.

- [ ] **Step 4: Run full workspace build**

```bash
cd ../.. && pnpm build
```

Expected: Both `api-types` and `design-system` build successfully. Turborepo cache entries written.

- [ ] **Step 5: Commit**

```bash
git add packages/design-system/src/GlassBadge.tsx packages/design-system/src/index.ts
git commit -m "feat(design-system): add GlassBadge and complete package exports"
```

---

## Task 8: GitHub Actions CI

**Files:**
- Create: `.github/workflows/ci.yml`

- [ ] **Step 1: Write CI workflow**

Create `.github/workflows/ci.yml`:

```yaml
name: CI

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  build-and-test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - uses: pnpm/action-setup@v4
        with:
          version: 9

      - uses: actions/setup-node@v4
        with:
          node-version: '22'
          cache: 'pnpm'

      - name: Install dependencies
        run: pnpm install --frozen-lockfile

      - name: Typecheck
        run: pnpm typecheck

      - name: Test
        run: pnpm test

      - name: Build
        run: pnpm build
```

- [ ] **Step 2: Commit and push**

```bash
git add .github/
git commit -m "ci: add GitHub Actions CI workflow"
git push
```

- [ ] **Step 3: Verify CI passes on GitHub**

Open: `https://github.com/EselGerlfried/PrismClient/actions`

Expected: Green checkmark on latest commit. All steps pass.

---

## Task 9: Second Repo — PrismClient-Mod

- [ ] **Step 1: Create the Java repo on GitHub**

```bash
gh repo create PrismClient-Mod --public --description "PrismClient in-game Fabric mod — Liquid Glass UI, HUD editor, cosmetics, emotes"
```

- [ ] **Step 2: Clone and scaffold**

```bash
cd "C:\Users\EselGerlfried\Desktop"
gh repo clone EselGerlfried/PrismClient-Mod
cd PrismClient-Mod
```

- [ ] **Step 3: Download Fabric mod template**

```bash
gh api repos/FabricMC/fabric-example-mod/tarball/HEAD --output fabric-template.tar.gz
mkdir -p src/main/java/dev/prismclient
tar -xzf fabric-template.tar.gz --strip-components=1
rm fabric-template.tar.gz
```

- [ ] **Step 4: Update gradle.properties**

Edit `gradle.properties` — set:
```properties
mod_version=0.1.0
maven_group=dev.prismclient
archives_base_name=prismclient-mod
```

- [ ] **Step 5: Commit scaffold**

```bash
git add .
git commit -m "chore: init Fabric mod scaffold from fabric-example-mod template"
git push
```

---

## Summary

Phase 1 delivers:
- pnpm monorepo with Turborepo ✓
- `@prism/api-types` — all shared TypeScript interfaces ✓
- `@prism/design-system` — GlassPanel, GlassButton, GlassInput, GlassModal, GlassBadge + theme system ✓
- GitHub Actions CI ✓
- PrismClient-Mod repo scaffolded ✓

**Next:** Phase 2 (Backend) and Phase 3 (Launcher) can now be developed in parallel. Both depend on `@prism/api-types`. The Fabric Mod (Phase 4) is independent.
