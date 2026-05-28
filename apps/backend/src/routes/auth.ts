import type { FastifyInstance } from 'fastify';
import { z } from 'zod';
import { exchangeCode, fetchProfile } from '../services/microsoft-oauth.js';
import { signAccessToken, signRefreshToken, verifyRefreshToken } from '../services/jwt.js';
import { query } from '../db/client.js';

const authCodeSchema = z.object({ code: z.string().min(1) });
const refreshSchema = z.object({ refreshToken: z.string().min(1) });

export default async function authRoutes(app: FastifyInstance) {
  app.post('/microsoft', async (request, reply) => {
    const body = authCodeSchema.safeParse(request.body);
    if (!body.success) return reply.status(400).send({ error: 'code required' });

    const msTokens = await exchangeCode(body.data.code).catch(() => null);
    if (!msTokens) return reply.status(502).send({ error: 'MS OAuth failed' });

    const profile = await fetchProfile(msTokens.access_token).catch(() => null);
    if (!profile) return reply.status(502).send({ error: 'MS profile failed' });

    const email = profile.mail ?? profile.userPrincipalName;

    const { rows } = await query(
      `INSERT INTO users (ms_oid, username, email)
       VALUES ($1, $2, $3)
       ON CONFLICT (ms_oid) DO UPDATE SET username = EXCLUDED.username
       RETURNING uuid, username, email, tier, avatar_url, created_at`,
      [profile.id, profile.displayName, email]
    );

    const user = rows[0];
    const [accessToken, refreshToken] = await Promise.all([
      signAccessToken({ sub: user.uuid, email: user.email, tier: user.tier }),
      signRefreshToken(user.uuid),
    ]);

    return reply.send({
      user,
      tokens: { accessToken, refreshToken, expiresAt: Date.now() + 3600 * 1000 },
    });
  });

  app.post('/refresh', async (request, reply) => {
    const body = refreshSchema.safeParse(request.body);
    if (!body.success) return reply.status(400).send({ error: 'refreshToken required' });

    const payload = await verifyRefreshToken(body.data.refreshToken).catch(() => null);
    if (!payload) return reply.status(401).send({ error: 'Invalid refresh token' });

    const { rows } = await query(
      'SELECT uuid, email, tier FROM users WHERE uuid = $1',
      [payload.sub]
    );
    if (!rows[0]) return reply.status(401).send({ error: 'User not found' });

    const user = rows[0];
    const [accessToken, refreshToken] = await Promise.all([
      signAccessToken({ sub: user.uuid, email: user.email, tier: user.tier }),
      signRefreshToken(user.uuid),
    ]);

    return reply.send({
      tokens: { accessToken, refreshToken, expiresAt: Date.now() + 3600 * 1000 },
    });
  });
}
