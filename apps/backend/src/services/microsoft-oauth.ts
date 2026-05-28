import { config } from '../config.js';

interface MsTokenResponse {
  access_token: string;
  refresh_token: string;
  expires_in: number;
  id_token: string;
}

interface MsProfile {
  id: string;
  displayName: string;
  mail: string | null;
  userPrincipalName: string;
}

export async function exchangeCode(code: string): Promise<MsTokenResponse> {
  const body = new URLSearchParams({
    client_id: config.MS_CLIENT_ID,
    client_secret: config.MS_CLIENT_SECRET,
    code,
    redirect_uri: config.MS_REDIRECT_URI,
    grant_type: 'authorization_code',
    scope: 'openid profile email User.Read',
  });

  const res = await fetch('https://login.microsoftonline.com/consumers/oauth2/v2.0/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body,
  });

  if (!res.ok) throw new Error(`MS token exchange failed: ${res.status}`);
  return res.json() as Promise<MsTokenResponse>;
}

export async function fetchProfile(accessToken: string): Promise<MsProfile> {
  const res = await fetch('https://graph.microsoft.com/v1.0/me', {
    headers: { Authorization: `Bearer ${accessToken}` },
  });
  if (!res.ok) throw new Error(`MS profile fetch failed: ${res.status}`);
  return res.json() as Promise<MsProfile>;
}
