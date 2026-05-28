export type ModLoader = 'vanilla' | 'fabric' | 'forge' | 'quilt';
export interface HudElement {
    id: string;
    x: number;
    y: number;
    width: number;
    height: number;
    opacity: number;
    visible: boolean;
    textColor: string;
    showBackground: boolean;
}
export type HudElementId = 'health' | 'hunger' | 'armor' | 'xp' | 'minimap' | 'chat' | 'coords' | 'fps' | 'ping' | 'hotbar' | 'crosshair' | 'bossbar' | 'scoreboard' | 'potions' | 'compass';
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
    loaderVersion: string | null;
    ramMb: number;
    javaPath: string | null;
    javaFlags: string;
    modIds: string[];
    hudLayoutId: string | null;
    createdAt: string;
    updatedAt: string;
}
export interface ProfileExport {
    version: 1;
    profile: LauncherProfile;
    hudLayouts: HudLayout[];
}
//# sourceMappingURL=profiles.d.ts.map