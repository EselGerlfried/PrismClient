export type AnnouncementType = 'info' | 'sale' | 'update' | 'warning';

export interface Announcement {
  id: string;
  type: AnnouncementType;
  title: string;
  body: string;
  forceRead: boolean; // if true, user cannot dismiss without clicking confirm
  ctaLabel: string | null;
  ctaUrl: string | null;
  expiresAt: string | null; // ISO 8601, null = never expires
  createdAt: string;
}
