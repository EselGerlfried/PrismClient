# PrismClient — Design Specification

**Date:** 2026-05-28  
**Status:** Approved  
**Repos:** [PrismClient](https://github.com/EselGerlfried/PrismClient) · PrismClient-Mod (to create)

---

## 1. Project Overview

PrismClient is a premium Minecraft Java Edition launcher and in-game client mod with a Liquid Glass design aesthetic. It targets Minecraft players who want a polished, fully customizable experience with cosmetics. No cheats — differentiation through design and UX quality.

**Inspiration:** Luna Client (UX/cosmetics), Feather Client (visual design), Meteor Client (module architecture, UI framework patterns)

---

## 2. Repository Architecture

### Option C: JS Monorepo + Separate Java Repo

```
PrismClient/                        ← JS Monorepo (GitHub: EselGerlfried/PrismClient)
├── apps/
│   ├── launcher/                   ← Electron + React + TypeScript
│   └── backend/                    ← Node.js + Fastify + PostgreSQL
├── packages/
│   ├── api-types/                  ← Shared TypeScript interfaces
│   └── design-system/              ← Liquid Glass React component library
├── docs/
│   └── superpowers/specs/          ← Design specs (this file)
└── package.json                    ← pnpm workspaces

PrismClient-Mod/                    ← Java Repo (GitHub: EselGerlfried/PrismClient-Mod)
└── src/main/java/                  ← Fabric Mod (Java 21, Fabric API)
```

### Data Flow

```
User launches PrismClient.exe
  → Launcher authenticates via Microsoft OAuth → Backend issues JWT
  → Launcher fetches profile + owned cosmetics from Backend API
  → User selects profile → Launcher starts Minecraft with Mod JAR injected
  → Mod connects to Backend WebSocket → streams cosmetics for nearby players
  → In-game Shop button → Launcher WebView overlay opens Shop
  → Tebex checkout → Webhook → Backend grants cosmetic → Mod refreshes
```

---

## 3. Tech Stack

| Layer | Technology |
|-------|-----------|
| Launcher | Electron 32 + React 19 + TypeScript 5 |
| Launcher UI | Tailwind CSS + custom Liquid Glass component lib |
| Launcher Bundler | Vite + electron-builder |
| Backend | Node.js 22 + Fastify 5 |
| Database | PostgreSQL 16 (users, cosmetics, purchases, profiles) |
| Cache | Redis 7 (sessions, cosmetics cache, announcements) |
| Payments | Tebex (Stripe/PayPal/crypto, Discord integration) |
| Asset Storage | Cloudflare R2 (cosmetic textures, emote animations) |
| In-Game Mod | Java 21 + Fabric API (latest) |
| Auto-Update | electron-updater (GitHub Releases or own server) |
| Monorepo | pnpm workspaces + Turborepo |

---

## 4. Design System — Liquid Glass

### Core Principle
Every panel has real depth. Background bleeds through, light refracts, shadows are soft. Inspired by Apple's 2026 Liquid Glass design language.

### CSS Foundation (every glass element)

```css
backdrop-filter: blur(40px) saturate(180%);
background: rgba(255, 255, 255, 0.06);
border: 1px solid rgba(255, 255, 255, 0.14);
box-shadow:
  0 8px 32px rgba(0, 0, 0, 0.3),
  inset 0 1px 0 rgba(255, 255, 255, 0.15);
border-radius: 20px;
```

### Themes

| | Dark (Default) | White |
|-|---------------|-------|
| Background | `#07070f` | `#f4f4f8` |
| Glass panels | `rgba(255,255,255,0.06)` + blur 40px | `rgba(255,255,255,0.65)` + blur 30px |
| Accent | `#7c6fff → #a78bfa` (violet gradient) | `#6366f1` |
| Primary text | `#ffffff` | `#0a0a0f` |
| Secondary text | `rgba(255,255,255,0.6)` | `rgba(0,0,0,0.5)` |
| Border | `rgba(255,255,255,0.14)` | `rgba(0,0,0,0.08)` |

Custom theme: user picks accent color, glass opacity, border radius via Theme Editor.

### Animations
- **Panel enter:** `scale(0.97)→1` + `opacity 0→1`, 200ms ease-out
- **Hover:** `translateY(-2px)` + glow shadow intensifies
- **Page transition:** blur-fade crossfade, 150ms
- **Live background:** animated mesh gradient / particle system (slow movement gives glass depth)

---

## 5. Launcher Features

### Navigation (left sidebar — glass icons)
- Home / News
- Profile Manager
- Mod Browser
- Cosmetics / Wardrobe
- Shop
- Settings

### Home Screen
- News feed (pulled from Backend — admin announcements, patch notes, sale banners)
- Quick-launch last-used profile
- Active player count badge

### Profile Manager
- Multiple profiles: each with own mod loader (Vanilla / Fabric / Forge / Quilt), MC version, RAM allocation, Java path, installed mods, HUD layout
- Profile export/import as `.prism` file
- Community profile sharing via link
- Per-profile Java flags editor

### Mod Browser
- Sources: Modrinth API + CurseForge API
- Filters: mod loader, MC version, category, sort by downloads/rating
- 1-click install → auto-added to active profile
- Installed mod update checker
- **Standard/Max:** curated PrismClient Featured Collections

### Settings
- Theme selector (Dark / White / Custom)
- Custom accent color picker
- Glass opacity slider
- Account management (Microsoft OAuth)
- Update channel (Stable / Beta)

### Auto-Update
- `electron-updater` checks Backend `/updates/latest` on launch
- Admin pushes release → all clients receive popup + download prompt
- Delta updates where possible

---

## 6. In-Game Mod Features (Fabric)

### Custom Title Screen (Main Menu)
- Replaces Vanilla main menu entirely
- Animated Liquid Glass panels over Minecraft panorama background
- 3D rotating skin preview with all active cosmetics visible (cape, hat, wings, backpack, aura)
- Buttons: Singleplayer · Multiplayer · Wardrobe · Shop · Settings · Quit (all glass-styled)
- PrismClient logo + version badge

### Wardrobe Screen
- Left: 3D skin viewer (rotate drag, zoom)
- Right: cosmetics grid
- Tabs: Capes · Hats · Backpacks · Wings · Auras · Trails · Emotes · Particle Effects · Crosshairs
- Equip/unequip with single click, previews instantly on 3D model
- "Get More" button → opens In-Game Shop overlay

### In-Game Shop Overlay
- WebView overlay (Launcher-injected, non-blocking)
- Full Tebex storefront embedded
- Opens over game via keybind or menu button

### Pause Menu
- Full Liquid Glass redesign
- Added: HUD Editor · Wardrobe · Shop shortcuts
- Vanilla options preserved

### HUD Editor (F6 to toggle)
- Drag & drop all HUD elements as glass cards
- Elements: Health bar · Hunger · Armor · XP · Minimap · Chat · Coordinates · FPS counter · Ping · Hotbar · Crosshair · Boss bar · Scoreboard · Potion effects · Compass
- Per-element: position · size · opacity · text color · background toggle
- Multiple HUD Profiles (save/load per game mode)
- Cloud sync (Standard/Max tier)

### Emote System
- Emote Wheel: hold `B` → radial glass selector with 8 equipped emotes
- Keybind slots: 1-8 bindable emotes for quick-fire
- Emote types:
  - **One-shot:** plays once, returns to idle
  - **Loop:** plays until cancelled
  - **Sync:** nearby PrismClient users auto-join animation
- Visibility: emote animations visible to all PrismClient users (own protocol via Backend WebSocket)

### Client Settings Screen
- Own settings screen accessible in-game
- Sections: Theme · HUD · Performance · Cosmetics · Account · Keybinds

---

## 7. Backend + Admin Panel

### REST API (Fastify)

```
Auth:
  POST /auth/microsoft            Microsoft OAuth → JWT
  POST /auth/refresh              Refresh token

User:
  GET  /user/me                   Profile + subscription tier
  GET  /user/cosmetics            Owned cosmetics list

Cosmetics:
  GET  /cosmetics/:uuid           Public cosmetics for any UUID (mod uses this)
  POST /cosmetics/equip           Set active cosmetics

Shop:
  GET  /shop/items                Full catalog with tier restrictions
  POST /shop/purchase             Tebex checkout session

Profiles:
  GET  /profiles                  All profiles for user
  POST /profiles                  Create profile
  PUT  /profiles/:id              Update (incl. HUD layout)

Updates:
  GET  /updates/latest            Current version + download URL

Announcements:
  GET  /announcements             Active announcements for client
```

### WebSocket
- `/ws/cosmetics` — mod subscribes, receives live cosmetic updates for nearby players

### Admin Panel (web dashboard, private)
Sections:
- **Announcements** — create/edit/delete popups (type: Info / Sale / Update / Warning, force-read toggle)
- **Updates** — upload new EXE build, set release notes, toggle rollout
- **Users** — search accounts, manually grant/revoke cosmetics, ban
- **Shop** — manage items, prices, visibility, sale banners
- **Analytics** — DAU, downloads, revenue, subscription counts

---

## 8. Monetization

### Pricing Tiers

| Tier | Price | Features |
|------|-------|---------|
| **Free** | €0 | Launcher, Fabric/Forge/Vanilla/Quilt, Profile System, Liquid Glass UI, Mod Browser |
| **Standard** | €6.99/month | + Cloud HUD Sync, exclusive themes, beta access, curated mod collections |
| **Max** | €12.99/month | + all cosmetics unlocked, premium features (TBD), exclusive emotes, priority support |
| **Lifetime** | €34.99 | Max features permanently, no subscription |

### Payment Flow
1. User visits Discord bot or In-Game Shop
2. Discord: `/buy <item>` → bot returns Tebex link
3. User completes Tebex checkout (Stripe/PayPal/crypto)
4. Tebex fires webhook → Backend → cosmetic granted
5. Mod receives live update via WebSocket

### Subscriptions
- Managed via Tebex subscription packages
- Cancellation: features locked until period ends, cosmetics not removed

---

## 9. Out of Scope (v1)

- Bedrock Edition support
- Server browser / custom server list
- Replay mod integration
- Voice chat integration
- Cheat modules of any kind
- Mobile companion app

---

## 10. Open Questions

- Exact Premium feature list for Standard vs Max (to be defined before backend implementation)
- Emote animation format (custom JSON skeleton vs standard format)
- Cosmetics visible to non-PrismClient users? (likely no for v1)
- Self-hosted update server vs GitHub Releases
