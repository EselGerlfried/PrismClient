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
