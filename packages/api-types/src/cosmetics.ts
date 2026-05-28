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
  cape: string | null;
  hat: string | null;
  backpack: string | null;
  wings: string | null;
  aura: string | null;
  trail: string | null;
  emoteSlots: [
    string | null,
    string | null,
    string | null,
    string | null,
    string | null,
    string | null,
    string | null,
    string | null,
  ]; // 8 slots
  crosshair: string | null;
  chatColor: string | null;
  killEffect: string | null;
}

export interface PlayerCosmeticsResponse {
  uuid: string;
  equipped: EquippedCosmetics;
}
