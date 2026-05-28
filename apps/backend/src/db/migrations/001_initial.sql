CREATE TABLE IF NOT EXISTS users (
  uuid        UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  ms_oid      TEXT UNIQUE NOT NULL,
  username    TEXT NOT NULL,
  email       TEXT UNIQUE NOT NULL,
  tier        TEXT NOT NULL DEFAULT 'free'
                CHECK (tier IN ('free','standard','max','lifetime')),
  avatar_url  TEXT,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS cosmetic_items (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name        TEXT NOT NULL,
  type        TEXT NOT NULL,
  rarity      TEXT NOT NULL DEFAULT 'common'
                CHECK (rarity IN ('common','rare','epic','legendary')),
  asset_url   TEXT NOT NULL,
  price_cents INT NOT NULL DEFAULT 0,
  tebex_id    TEXT,
  active      BOOLEAN NOT NULL DEFAULT TRUE,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS user_cosmetics (
  user_uuid       UUID NOT NULL REFERENCES users(uuid) ON DELETE CASCADE,
  cosmetic_id     UUID NOT NULL REFERENCES cosmetic_items(id) ON DELETE CASCADE,
  purchased_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  PRIMARY KEY (user_uuid, cosmetic_id)
);

CREATE TABLE IF NOT EXISTS equipped_cosmetics (
  user_uuid    UUID PRIMARY KEY REFERENCES users(uuid) ON DELETE CASCADE,
  cape_id      UUID REFERENCES cosmetic_items(id),
  hat_id       UUID REFERENCES cosmetic_items(id),
  wings_id     UUID REFERENCES cosmetic_items(id),
  aura_id      UUID REFERENCES cosmetic_items(id),
  trail_id     UUID REFERENCES cosmetic_items(id),
  backpack_id  UUID REFERENCES cosmetic_items(id),
  emote_slot_0 UUID REFERENCES cosmetic_items(id),
  emote_slot_1 UUID REFERENCES cosmetic_items(id),
  emote_slot_2 UUID REFERENCES cosmetic_items(id),
  emote_slot_3 UUID REFERENCES cosmetic_items(id),
  emote_slot_4 UUID REFERENCES cosmetic_items(id),
  emote_slot_5 UUID REFERENCES cosmetic_items(id),
  emote_slot_6 UUID REFERENCES cosmetic_items(id),
  emote_slot_7 UUID REFERENCES cosmetic_items(id),
  updated_at   TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS profiles (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_uuid   UUID NOT NULL REFERENCES users(uuid) ON DELETE CASCADE,
  name        TEXT NOT NULL,
  mc_version  TEXT NOT NULL DEFAULT '1.21.4',
  mod_loader  TEXT NOT NULL DEFAULT 'fabric'
                CHECK (mod_loader IN ('vanilla','fabric','forge','quilt')),
  hud_layout  JSONB NOT NULL DEFAULT '{}',
  mods        JSONB NOT NULL DEFAULT '[]',
  is_default  BOOLEAN NOT NULL DEFAULT FALSE,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS announcements (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  type        TEXT NOT NULL CHECK (type IN ('info','sale','update','warning')),
  title       TEXT NOT NULL,
  body        TEXT NOT NULL,
  cta_label   TEXT,
  cta_url     TEXT,
  force_read  BOOLEAN NOT NULL DEFAULT FALSE,
  active      BOOLEAN NOT NULL DEFAULT TRUE,
  expires_at  TIMESTAMPTZ,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS versions (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  version      TEXT UNIQUE NOT NULL,
  channel      TEXT NOT NULL DEFAULT 'stable'
                 CHECK (channel IN ('stable','beta','alpha')),
  download_url TEXT NOT NULL,
  changelog    TEXT NOT NULL DEFAULT '',
  published_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS schema_migrations (
  version    TEXT PRIMARY KEY,
  applied_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
