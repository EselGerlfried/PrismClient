export type AnnouncementType = 'info' | 'sale' | 'update' | 'warning';
export interface Announcement {
    id: string;
    type: AnnouncementType;
    title: string;
    body: string;
    forceRead: boolean;
    ctaLabel: string | null;
    ctaUrl: string | null;
    expiresAt: string | null;
    createdAt: string;
}
//# sourceMappingURL=announcements.d.ts.map