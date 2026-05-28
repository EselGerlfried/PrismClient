export type ModLoader = 'vanilla' | 'fabric' | 'forge' | 'quilt';

export interface HudElement {
  id: string;
  x: number; // 0-100 percentage of screen width
  y: number; // 0-100 percentage of screen height
  width: number; // pixels
  height: number; // pixels
  opacity: number; // 0-1
  visible: boolean;
  textColor: string; // hex
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
  javaPath: string | null; // null = auto-detect
  javaFlags: string;
  modIds: string[]; // Modrinth/CurseForge mod IDs
  hudLayoutId: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface ProfileExport {
  version: 1;
  profile: LauncherProfile;
  hudLayouts: HudLayout[];
}
