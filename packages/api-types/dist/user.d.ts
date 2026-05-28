export type SubscriptionTier = 'free' | 'standard' | 'max' | 'lifetime';
export interface User {
    uuid: string;
    username: string;
    email: string;
    tier: SubscriptionTier;
    createdAt: string;
    avatarUrl: string | null;
}
export interface AuthTokens {
    accessToken: string;
    refreshToken: string;
    expiresAt: number;
}
export interface AuthResponse {
    user: User;
    tokens: AuthTokens;
}
//# sourceMappingURL=user.d.ts.map