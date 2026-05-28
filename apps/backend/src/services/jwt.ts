import { SignJWT, jwtVerify } from 'jose';
import { config } from '../config.js';

const secret = new TextEncoder().encode(config.JWT_SECRET);
const ALG = 'HS256';

export interface JwtPayload {
  sub: string;
  email: string;
  tier: string;
}

export async function signAccessToken(payload: JwtPayload): Promise<string> {
  return new SignJWT({ ...payload })
    .setProtectedHeader({ alg: ALG })
    .setIssuedAt()
    .setExpirationTime('1h')
    .sign(secret);
}

export async function signRefreshToken(userUuid: string): Promise<string> {
  return new SignJWT({ sub: userUuid, type: 'refresh' })
    .setProtectedHeader({ alg: ALG })
    .setIssuedAt()
    .setExpirationTime('30d')
    .sign(secret);
}

export async function verifyRefreshToken(token: string): Promise<{ sub: string }> {
  const { payload } = await jwtVerify(token, secret);
  if ((payload as Record<string, unknown>).type !== 'refresh') throw new Error('Not a refresh token');
  return payload as { sub: string };
}
